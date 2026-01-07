import { defineEventHandler, getQuery, parseCookies } from 'h3'
import { getPool } from '~/server/utils/db'

interface HotelResponse {
  items: HotelItem[]
  total: number
}

interface HotelItem {
  id: number
  name: string
  image: string
  location: string
  price: number
  isNew: boolean
}

export default defineEventHandler(async (event): Promise<HotelResponse> => {
  const { excludeId } = getQuery(event)
  const pool = await getPool()

  const cookies = parseCookies(event)
  const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'

  try {
    // 1) Load recommended product list for hotel
    const params: Array<string | number> = []
    let recoSql = `
      SELECT recommend_product_idx, product_idx, product_type, sort
      FROM recommend_product
      WHERE recommend_type = 'hotel'
    `
    const excludeIdNum = typeof excludeId !== 'undefined' ? Number(excludeId) : undefined
    if (typeof excludeIdNum === 'number' && !Number.isNaN(excludeIdNum)) {
      recoSql += ` AND product_idx != ?`
      params.push(excludeIdNum)
    }
    recoSql += `
      ORDER BY (sort IS NULL), sort ASC, recommend_product_idx DESC
      LIMIT 6
    `

    const [recoRows] = await pool.query(recoSql, params)

    interface RecommendRow { recommend_product_idx: number; product_idx: number; product_type: string; sort: number | null }
    const recoList = (recoRows as RecommendRow[])
    if (!recoList.length) {
      return { items: [], total: 0 }
    }

    const hotelIds = recoList.map(r => r.product_idx)

    // 2) Fetch hotel details in batch
    const placeholders = hotelIds.map(() => '?').join(',')
    interface DBHotel {
      hotel_idx: number
      name_kr: string
      name_en: string
      image_url: string | null
      location: string
      locationEn: string
      price: number | null
      created_at: Date
    }
    const [rows] = await pool.query(
      `
        SELECT
          H.hotel_idx,
          H.name_kr,
          H.name_en,
          (SELECT image_url FROM hotel_image WHERE hotel_idx = H.hotel_idx AND use_yn = 'Y' AND main_yn = 'Y' AND image_type = 'H' LIMIT 1) AS image_url,
          CONCAT('#', (SELECT country_name FROM country_code WHERE country_code = H.country_code LIMIT 1), ' #',
            (SELECT city_name FROM country_code WHERE city_code = H.city_code LIMIT 1)) as location,
          CONCAT('#', (SELECT country_name_en FROM country_code WHERE country_code = H.country_code LIMIT 1), ' #',
            (SELECT city_name_en FROM country_code WHERE city_code = H.city_code LIMIT 1)) as locationEn,
          (SELECT min_price FROM hotel_monthly_price WHERE hotel_idx = H.hotel_idx AND target_year = DATE_FORMAT(NOW(), '%Y') AND target_month = DATE_FORMAT(NOW(), '%m') AND use_yn = 'Y' LIMIT 1) AS price,
          H.created_at
        FROM hotel H
        WHERE H.hotel_status = 'Y' AND H.hotel_idx IN (${placeholders})
      `,
      hotelIds
    )

    const list = (rows as DBHotel[]).map((row) => ({
      id: row.hotel_idx,
      name: locale === 'ko' ? row.name_kr : row.name_en,
      image: row.image_url || '',
      location: locale === 'ko' ? row.location : row.locationEn,
      price: row.price ?? 0,
      isNew: isNewHotel(row.created_at)
    }))
    const map = new Map<number, HotelItem>(list.map((i) => [i.id, i]))

    // 3) Recompose in recommended order
    const items: HotelItem[] = []
    for (const r of recoList) {
      const v = map.get(r.product_idx)
      if (v) items.push(v)
    }
    
    return {
      items,
      total: items.length
    }
  } catch (error) {
    console.error('Error fetching main hotels:', error)
    return {
      items: [],
      total: 0
    }
  }
})

// 2주 이내에 등록된 호텔은 NEW 표시
function isNewHotel(createdAt: Date): boolean {
  if (!createdAt) return false
  
  const now = new Date()
  const twoWeeksAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000))
  return createdAt > twoWeeksAgo
}
