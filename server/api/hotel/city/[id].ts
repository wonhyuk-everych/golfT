import { defineEventHandler, getRouterParam, readBody, parseCookies } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'
import { useRuntimeConfig } from '#imports'

// 데이터베이스에서 반환되는 호텔 정보 타입
interface DBHotel {
  hotel_idx: number;
  name_kr: string;
  country_code: string;
  city_code: string;
  image_url: string;
  price: number;
  created_at: Date;
}

interface HotelProduct {
  id: number;
  name: string;
  location: string;
  price: string;
  image: string;
}

interface CityInfo {
  main_image: string;
  sub_title: string;
  title: string;
  product: HotelProduct[];
  total_count: number;
}

interface CityRequestBody {
  size: number;
  searchWord?: string | null;
  filter?: string | null;
  sort?: string | null;
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
    const baseConditions = ['H.hotel_status = ?']
    const baseParams: (string | number)[] = ['Y']

    // Add city code condition
    baseConditions.push('(H.city_code = ? OR H.country_code = ?)')
    baseParams.push(cityCode.toUpperCase(), cityCode.toUpperCase())

    if (searchWord) {
      baseConditions.push('(H.name_kr LIKE ? OR H.name_en LIKE ?)')
      baseParams.push(`%${searchWord}%`, `%${searchWord}%`)
    }

    // Count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hotel H
      WHERE ${baseConditions.join(' AND ')}
    `
    const [[{ total }]] = await pool.query(countQuery, baseParams)

    // Data query
    let query = `
      SELECT
        H.hotel_idx,
        H.name_kr,
        H.country_code,
        CONCAT('#', (SELECT country_name FROM country_code WHERE country_code = H.country_code LIMIT 1), ' #',
          (SELECT city_name FROM country_code WHERE city_code = H.city_code LIMIT 1)) as location,
        (SELECT image_url FROM hotel_image WHERE hotel_idx = H.hotel_idx AND use_yn = 'Y' AND main_yn = 'Y' LIMIT 1) AS image_url,
        (SELECT min_price FROM hotel_monthly_price WHERE hotel_idx = H.hotel_idx AND target_year = DATE_FORMAT(NOW(), '%Y') AND target_month = DATE_FORMAT(NOW(), '%m') AND use_yn = 'Y' LIMIT 1) AS price,
        H.created_at
      FROM hotel H
      WHERE ${baseConditions.join(' AND ')}
    `

    if (sort) {
      query += ` ORDER BY ${sort}`
    } else {
      query += ' ORDER BY H.created_at DESC'
    }

    query += ' LIMIT ?'
    const queryParams = [...baseParams, size]

    const [rows] = await pool.query(query, queryParams)

    const hotels = rows.map((row: DBHotel) => ({
      id: row.hotel_idx,
      name: row.name_kr,
      location: row.location,
      price: row.price,
      image: row.image_url
    }))

    if(cityCode.toUpperCase() === 'ETC') {
      const cityData: CityInfo = {
        main_image: 'city-etc',
        sub_title: '',
        title: '기타 지역',
        product: hotels,
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
    
    const [[cityInfo]] = await pool.query(cityQuery, [cityCode, cityCode]);
    
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
      product: hotels,
      total_count: total
    }

    return cityData

  } catch (error) {
    console.error('Error fetching hotels by city:', error)
    throw error
  }
})
