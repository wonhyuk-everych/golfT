import { defineEventHandler, getRouterParam, readBody, parseCookies } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'
import type { RowDataPacket, FieldPacket } from 'mysql2/promise'

// 데이터베이스에서 반환되는 캐디 정보 타입
interface DBCaddy extends RowDataPacket {
  caddyIdx: number;
  golfNameKr: string;
  golfNameEn: string;
  price: number;
  name: string;
  location: string;
  imageUrl: string;
}

interface CountRow extends RowDataPacket {
  total: number;
}

interface CaddyProduct {
  id: number;
  name: string;
  location: string;
  price: string;
  image: string;
  golfCourseName: string;
  tags?: {
    type: string;
    text: string;
  }[];
}

interface CityInfo {
  main_image: string;
  sub_title: string;
  title: string;
  product: CaddyProduct[];
  total_count: number;
}

type SortKey = 'newest' | 'price_asc' | 'price_desc'

interface CityRequestBody {
  size: number;
  searchWord?: string | null;
  filter?: string | null;
  sort?: SortKey | null;
}

interface CityInfoRow extends RowDataPacket {
  country_name: string;
  country_name_en: string;
  city_name: string;
  city_name_en: string;
  image_url: string;
}

export default defineEventHandler(async (event) => {
  if (!await testConnection()) {
    return {
      success: false,
      error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
    }
  }

  const cityCode = getRouterParam(event, 'id')
  if (!cityCode) {
    return {
      success: false,
      error: 'City code is required'
    }
  }

  const body = await readBody<CityRequestBody>(event)
  
  // Validate required parameters
  if (!body.size || typeof body.size !== 'number') {
    return {
      success: false,
      error: 'Size parameter is required and must be a number'
    }
  }

  const { 
    size,
    searchWord = null, 
    _filter = null, // 사용하지 않는 변수는 언더스코어 접두사 추가
    sort = null 
  } = body

  const pool = await getPool()

  try {
    const cookies = parseCookies(event)
    const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'
    // Base query conditions that will be used for both count and data queries

    const baseConditions = ['C.caddy_status = ?']
    const baseParams: (string | number)[] = ['Y']

    // Add city code condition
    baseConditions.push('(G.country_code = ? OR G.city_code = ?)')
    baseParams.push(cityCode.toUpperCase(), cityCode.toUpperCase())

    if (searchWord) {
      baseConditions.push('(C.name LIKE ? OR G.name_kr LIKE ? OR G.name_en LIKE ?)')
      baseParams.push(`%${searchWord}%`, `%${searchWord}%`, `%${searchWord}%`)
    }

    // Count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM caddy C
      JOIN golf_course G ON C.course_idx = G.course_idx
      WHERE ${baseConditions.join(' AND ')}
    `
    const [countRows] = await pool.query<CountRow[]>(countQuery, baseParams) as [CountRow[], FieldPacket[]]
    const total = countRows?.[0]?.total ?? 0

    // Data query
    let query = `
      SELECT
        C.caddy_idx as caddyIdx,
        G.name_kr as golfNameKr,
        G.name_en as golfNameEn,
        (C.price + C.reservation_fee) as price,
        CONCAT(C.name, ' (', C.caddy_code, ')') as name,
        CONCAT('#', (SELECT country_name FROM country_code WHERE country_code = G.country_code LIMIT 1), ' #',
          (SELECT city_name FROM country_code WHERE city_code = G.city_code LIMIT 1)) as location,
        CONCAT('#', (SELECT country_name_en FROM country_code WHERE country_code = G.country_code LIMIT 1), ' #',
          (SELECT city_name_en FROM country_code WHERE city_code = G.city_code LIMIT 1)) as locationEn,
        (SELECT image_url FROM caddy_image WHERE caddy_idx = C.caddy_idx ORDER BY sort ASC LIMIT 1) AS imageUrl
      FROM caddy C
      JOIN golf_course G ON C.course_idx = G.course_idx
      WHERE ${baseConditions.join(' AND ')}
    `

    const sortMap: Record<SortKey, string> = {
      newest: 'C.created_at DESC',
      price_asc: 'price ASC',
      price_desc: 'price DESC'
    }

    if (sort && sortMap[sort]) {
      query += ` ORDER BY ${sortMap[sort]}`
    } else {
      query += ' ORDER BY C.created_at DESC'
    }

    query += ' LIMIT ?'
    const queryParams = [...baseParams, size]

    const [rows] = await pool.query<DBCaddy[]>(query, queryParams) as [DBCaddy[], FieldPacket[]]

    const caddies = rows.map((row: DBCaddy) => ({
      id: row.caddyIdx,
      name: row.name,
      location: locale === 'ko' ? row.location : row.locationEn,
      price: String(row.price),
      image: row.imageUrl,
      golfCourseName: locale === 'ko' ? row.golfNameKr : row.golfNameEn,
      tags: [
        {
          type: 'white',
          text: locale === 'ko' ? row.golfNameKr : row.golfNameEn
        }
      ]
    }))

    if(cityCode.toUpperCase() === 'ETC') {
      const cityData: CityInfo = {
        main_image: 'city-etc',
        sub_title: '',
        title: '기타 지역',
        product: caddies,
        total_count: total
      }
  
      return cityData
    }
    
    const cityQuery = `
      SELECT
        country_name,
        country_name_en,
        city_name,
        city_name_en,
        image_url
      FROM country_code
      WHERE city_code = UPPER(?) OR country_code = UPPER(?)
    `;
    
    const [cityRows] = await pool.query<CityInfoRow[]>(cityQuery, [cityCode, cityCode]) as [CityInfoRow[], FieldPacket[]]
    const cityInfo = cityRows?.[0] ?? null

    if (!cityInfo) {
      return {
        success: false,
        error: 'City information not found'
      }
    }
    
    // Determine title and subtitle based on locale
    let title = '';
    let subTitle = '';
    
    if (locale === 'ko') {
      title = cityInfo.city_name;
      subTitle = cityInfo.country_name + '의 도시';
    } else {
      title = cityInfo.city_name_en;
      subTitle = 'City of ' + cityInfo.country_name_en;
    }
    
    // Special case for ML and VN city codes
    if (cityCode.toUpperCase() === 'ML' || cityCode.toUpperCase() === 'VN') {
      title = '';
    }

    const cityData: CityInfo = {
      main_image: cityInfo.image_url,
      sub_title: subTitle,
      title: title,
      product: caddies,
      total_count: total
    }

    return cityData

  } catch (error) {
    console.error('Error fetching caddies by city:', error)
    throw error
  }
})
