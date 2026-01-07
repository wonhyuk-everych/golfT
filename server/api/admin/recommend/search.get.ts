import { defineEventHandler, getQuery, createError } from 'h3'
import { getPool } from '~/server/utils/db'
import type { ProductSearchResult } from '~/types/admin/recommend'

export default defineEventHandler(async (event) => {
  // Authentication check
  const session = await getUserSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Check if user is authenticated
  if (session?.user?.role != 'A') {
    throw createError({
      statusCode: 401,
      message: '인증되지 않은 사용자입니다.'
    })
  }

  try {
    const pool = getPool()
    const query = getQuery(event)
    const { type, keyword } = query

    if (!type || !keyword) {
      throw createError({
        statusCode: 400,
        message: '상품 타입과 검색어가 필요합니다.'
      })
    }

    let results: ProductSearchResult[] = []

    if (type === 'golf') {
      // 골프장 검색
      const sql = `
        SELECT 
          gc.course_idx as id,
          gc.name_kr as name,
          COALESCE(gcp.min_price, 0) as price,
          COALESCE(gci.main_image_url, '') as image,
          CONCAT(
            (SELECT country_name FROM country_code WHERE country_code = gc.country_code LIMIT 1), ' ',
            (SELECT city_name FROM country_code WHERE city_code = gc.city_code LIMIT 1)
          ) as location,
          'golf' as type
        FROM golf_course gc
        LEFT JOIN golf_course_image gci ON gc.course_idx = gci.course_idx
        LEFT JOIN golf_course_monthly_price gcp ON gc.course_idx = gcp.course_idx 
          AND gcp.target_year = DATE_FORMAT(NOW(), '%Y') 
          AND gcp.target_month = DATE_FORMAT(NOW(), '%m')
        WHERE gc.course_status = 'Y' 
          AND (gc.name_kr LIKE ? OR gc.name_en LIKE ? OR gc.course_idx = ?)
        ORDER BY gc.name_kr
        LIMIT 20
      `
      
      const searchPattern = `%${keyword}%`
      const courseIdx = isNaN(Number(keyword)) ? 0 : Number(keyword)
      const [rows] = await pool.query(sql, [searchPattern, searchPattern, courseIdx])
      results = rows as ProductSearchResult[]

    } else if (type === 'hotel') {
      // 호텔 검색
      const sql = `
        SELECT 
          h.hotel_idx as id,
          h.name_kr as name,
          (SELECT min_price FROM hotel_monthly_price WHERE hotel_idx = h.hotel_idx AND target_year = DATE_FORMAT(NOW(), '%Y') AND target_month = DATE_FORMAT(NOW(), '%m') AND use_yn = 'Y' LIMIT 1) AS price,
          (SELECT image_url FROM hotel_image WHERE hotel_idx = h.hotel_idx AND use_yn = 'Y' AND main_yn = 'Y' AND image_type = 'H' LIMIT 1) AS image,
          CONCAT(
            (SELECT country_name FROM country_code WHERE country_code = h.country_code LIMIT 1), ' ',
            (SELECT city_name FROM country_code WHERE city_code = h.city_code LIMIT 1)
          ) as location,
          'hotel' as type
        FROM hotel h
        WHERE h.hotel_status = 'Y' 
          AND (h.name_kr LIKE ? OR h.name_en LIKE ? OR h.hotel_idx = ?)
        ORDER BY h.name_kr
        LIMIT 20
      `
      
      const searchPattern = `%${keyword}%`
      const hotelIdx = isNaN(Number(keyword)) ? 0 : Number(keyword)
      const [rows] = await pool.query(sql, [searchPattern, searchPattern, hotelIdx])
      results = rows as ProductSearchResult[]

    } else if (type === 'caddy') {
      // 캐디 검색
      const sql = `
        SELECT 
          c.caddy_idx as id,
          CONCAT(c.name, ' (', c.caddy_code, ')') as name,
          (c.price + c.reservation_fee) as price,
          (SELECT image_url FROM caddy_image WHERE caddy_idx = c.caddy_idx ORDER BY sort ASC LIMIT 1) AS image,
          CONCAT(
            (SELECT country_name FROM country_code WHERE country_code = gc.country_code LIMIT 1), ' ',
            (SELECT city_name FROM country_code WHERE city_code = gc.city_code LIMIT 1)
          ) as location,
          'caddy' as type
        FROM caddy c
        JOIN golf_course gc ON c.course_idx = gc.course_idx
        WHERE c.caddy_status = 'Y' 
          AND (c.name LIKE ? OR c.caddy_code LIKE ? OR c.caddy_idx = ?)
        ORDER BY c.name
        LIMIT 20
      `
      
      const searchPattern = `%${keyword}%`
      const caddyIdx = isNaN(Number(keyword)) ? 0 : Number(keyword)
      const [rows] = await pool.query(sql, [searchPattern, searchPattern, caddyIdx])
      results = rows as ProductSearchResult[]
    }

    return {
      type,
      keyword,
      results
    }
  } catch (error) {
    console.error('Error searching products:', error)
    throw createError({
      statusCode: 500,
      message: '상품 검색에 실패했습니다.'
    })
  }
})
