import { defineEventHandler, getRouterParam, readBody, parseCookies } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'
import type { RowDataPacket, FieldPacket } from 'mysql2/promise'
import type { SearchProduct } from './types'

interface CityInfo {
  main_image: string;
  sub_title: string;
  title: string;
  product: SearchProduct[];
  total_count: number;
}

type SortKey = 'distance_asc' | 'price_asc' | 'price_desc'

interface CityRequestBody {
  size: number;
  searchWord?: string | null;
  filter?: string | null;
  sort?: SortKey | null;
}

interface CountRow extends RowDataPacket {
  total: number;
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
    filter = null, 
    sort = null 
  } = body

  const pool = await getPool()

  try {
    const cookies = parseCookies(event)
    const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'

    // Base query conditions that will be used for both count and data queries
    const baseConditions = ['c.course_status = ?']
    const baseParams: (string | number)[] = ['Y']

    // Add city code condition
    baseConditions.push('(c.country_code = ? OR c.city_code = ?)')
    baseParams.push(cityCode.toUpperCase(), cityCode.toUpperCase())

    if (searchWord) {
      baseConditions.push('(c.name_kr LIKE ? OR c.name_en LIKE ?)')
      baseParams.push(`%${searchWord}%`, `%${searchWord}%`)
    }

    // 공항까지 소요 시간 필터 처리
    if (filter && filter.length > 0) {
      const timeFilters = filter.split(',');
      const timeConditions: string[] = [];
      
      timeFilters.forEach(timeFilter => {
        const [min, max] = timeFilter.split('-').map(Number);
        timeConditions.push('(c.airport_time >= ? AND c.airport_time <= ?)');
        baseParams.push(min, max);
      });
      
      if (timeConditions.length > 0) {
        baseConditions.push(`(${timeConditions.join(' OR ')})`)
      }
    }

    // Count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM golf_course c
      WHERE ${baseConditions.join(' AND ')}
    `
    const [countRows] = await pool.query<CountRow[]>(countQuery, baseParams) as [CountRow[], FieldPacket[]]
    const total = countRows?.[0]?.total ?? 0

    // Data query
    let query = `
      SELECT
        c.course_idx,
        c.name_kr,
        c.name_en,
        c.city_code,
        c.address,
        c.round_start,
        p.min_price as round_price,
        c.created_at,
        '' as region_name,
        CONCAT('#', (SELECT country_name FROM country_code WHERE country_code = c.country_code LIMIT 1), ' #',
          (SELECT city_name FROM country_code WHERE city_code = c.city_code LIMIT 1)) as location,
        c.airport_time,
        c.city_time,
        gci.main_image_url as image
      FROM golf_course c
      LEFT JOIN golf_course_image gci ON c.course_idx = gci.course_idx
      LEFT JOIN golf_course_monthly_price p ON c.course_idx = p.course_idx AND p.target_year = DATE_FORMAT(NOW(), '%Y') AND p.target_month = DATE_FORMAT(NOW(), '%m')
      WHERE ${baseConditions.join(' AND ')}
    `

    const sortMap: Record<SortKey, string> = {
      distance_asc: 'c.airport_time ASC',
      price_asc: 'p.min_price ASC',
      price_desc: 'p.min_price DESC'
    }

    if (sort && sortMap[sort]) {
      query += ` ORDER BY ${sortMap[sort]}`
    } else {
      query += ' ORDER BY c.created_at DESC'
    }

    query += ' LIMIT ?'
    const queryParams = [...baseParams, size]

    const [rows] = await pool.query<SearchProduct[]>(query, queryParams) as [SearchProduct[], FieldPacket[]]

    const courses = rows.map((row) => ({
      id: row.course_idx,
      name: row.name_kr,
      location: row.location,
      price: row.round_price,
      image: row.image
    }))

    if(cityCode.toUpperCase() === 'ETC') {
      const cityData: CityInfo = {
        main_image: 'city-etc',
        sub_title: '',
        title: '기타 지역',
        product: courses,
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
      WHERE (city_code = UPPER(?) OR country_code = UPPER(?))
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
      product: courses,
      total_count: total
    }

    return cityData

  } catch (error) {
    console.error('Error fetching recommended golf courses:', error)
    throw error
  }
})
