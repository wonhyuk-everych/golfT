import { defineEventHandler, getQuery, createError } from 'h3'
import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

interface GolfCourseSearchResult {
  idx: number
  name_kr: string
  name_en: string
  country_name: string
  city_name: string
}

interface HotelSearchResult {
  idx: number
  name_kr: string
  name_en: string
  country_name: string
  city_name: string
}

interface CaddySearchResult {
  idx: number
  name_kr: string
  name_en: string
}

interface SearchResponse {
  courses: GolfCourseSearchResult[]
  hotels?: HotelSearchResult[]
  caddies?: CaddySearchResult[]
}

/**
 * Process golf course search query
 * @param searchWord The search keyword for golf courses
 * @returns SQL query and parameters
 */
const processGolfQuery = (searchWord?: string) => {
  let sql = `
    SELECT 
      course_idx as idx,
      name_kr,
      name_en,
      (SELECT country_name FROM country_code WHERE country_code = G.country_code LIMIT 1) AS country_name,
      (SELECT city_name FROM country_code WHERE city_code = G.city_code LIMIT 1) AS city_name
    FROM golf_course G
    WHERE course_status = 'Y'
  `
  const params: string[] = []

  if (searchWord) {
    sql += ' AND (name_kr LIKE ? OR name_en LIKE ?)'
    params.push(`%${searchWord}%`, `%${searchWord}%`)
  }

  sql += ' ORDER BY name_kr ASC LIMIT 20'
  
  return { sql, params }
}

/**
 * Process hotel search query
 * @param searchWord The search keyword for hotels
 * @returns SQL query and parameters
 */
const processHotelQuery = (searchWord?: string) => {
  let sql = `
    SELECT
      hotel_idx as idx,
      name_kr,
      name_en,
      (SELECT country_name FROM country_code WHERE country_code = H.country_code LIMIT 1) AS country_name,
      (SELECT city_name FROM country_code WHERE city_code = H.city_code LIMIT 1) AS city_name
    FROM hotel H
    WHERE hotel_status = 'Y'
  `
  const params: string[] = []

  if (searchWord) {
    sql += ' AND (name_kr LIKE ? OR name_en LIKE ?)'
    params.push(`%${searchWord}%`, `%${searchWord}%`)
  }

  sql += ' ORDER BY name_kr ASC LIMIT 20'
  
  return { sql, params }
}


/**
 * Process caddy search query
 * @param searchWord The search keyword for caddies
 * @returns SQL query and parameters
 */
const processCaddyQuery = (searchWord?: string) => {
  let sql = `
    SELECT
      caddy_idx as idx,
      name as name_kr,
      nick_name as name_en
    FROM caddy
    WHERE caddy_status = 'Y'
  `
  const params: string[] = []

  if (searchWord) {
    sql += ' AND (name LIKE ? OR nick_name LIKE ?)'
    params.push(`%${searchWord}%`, `%${searchWord}%`)
  }

  sql += ' ORDER BY name ASC LIMIT 20'
  
  return { sql, params }
}

export default defineEventHandler(async (event: H3Event): Promise<SearchResponse> => {
  const query = getQuery(event)
  const { searchWord, type } = query
  const searchType = type as string | undefined

  const pool = await getPool()
  const response: SearchResponse = {
    courses: [],
    hotels: [],
    caddies: []
  }
  
  try {
    // 타입이 지정되지 않았거나 'golf'인 경우 골프장 검색
    if (!searchType || searchType === 'golf') {
      const { sql, params } = processGolfQuery(searchWord as string | undefined)
      const [golfRows] = await pool.query(sql, params)
      response.courses = golfRows as GolfCourseSearchResult[]
    } else {
      response.courses = []
    }

    // 타입이 지정되지 않았거나 'hotel'인 경우 호텔 검색
    if (!searchType || searchType === 'hotel') {
      const { sql: hotelSql, params: hotelParams } = processHotelQuery(searchWord as string | undefined)
      const [hotelRows] = await pool.query(hotelSql, hotelParams)
      response.hotels = hotelRows as HotelSearchResult[]
    } else {
      response.hotels = []
    }
    
    // 타입이 지정되지 않았거나 'caddy'인 경우 캐디 검색
    if (!searchType || searchType === 'caddy') {
      const { sql: caddySql, params: caddyParams } = processCaddyQuery(searchWord as string | undefined)
      const [caddyRows] = await pool.query(caddySql, caddyParams)
      response.caddies = caddyRows as CaddySearchResult[]
    } else {
      response.caddies = []
    }

    return response
  } catch (error) {
    console.error('Error searching:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error searching'
    })
  }
})
