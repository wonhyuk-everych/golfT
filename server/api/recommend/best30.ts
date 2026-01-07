import { defineEventHandler, parseCookies } from 'h3'
import { getPool } from '~/server/utils/db'

interface RecommendProductRow {
  recommend_product_idx: number
  product_idx: number
  product_type: 'golf' | 'hotel' | 'caddy' | string
  sort: number | null
}

interface Best30ItemBase {
  id: number
  type: 'golf' | 'hotel' | 'caddy'
  name: string
  image: string
  location: string
  // optional extras per type
  price?: number | string
  courseId?: number
  golfCourseName?: string
}

interface Best30Response {
  total: number
  items: Best30ItemBase[]
}

export default defineEventHandler(async (event): Promise<Best30Response> => {
  const pool = await getPool()

  const cookies = parseCookies(event)
  const locale = (cookies['user-locale'] || cookies['i18n_redirected'] || 'ko') as 'ko' | 'en'

  try {
    // 1) Load best30 product list (preserve order by sort if provided)
    const [recoRows] = await pool.query(
      `
        SELECT
          recommend_product_idx,
          product_idx,
          product_type,
          sort
        FROM recommend_product
        WHERE recommend_type = 'best30'
        ORDER BY (sort IS NULL), sort ASC, recommend_product_idx DESC
        LIMIT 30
      `
    )

    const recoList = (recoRows as RecommendProductRow[])

    if (!recoList.length) {
      return { total: 0, items: [] }
    }

    // 2) Split by type for batch fetching
    const golfIds: number[] = []
    const hotelIds: number[] = []
    const caddyIds: number[] = []

    for (const r of recoList) {
      if (r.product_type === 'golf') golfIds.push(r.product_idx)
      else if (r.product_type === 'hotel') hotelIds.push(r.product_idx)
      else if (r.product_type === 'caddy') caddyIds.push(r.product_idx)
    }

    // 3) Build fetchers
    const placeholders = (arr: number[]) => arr.map(() => '?').join(',')

    // Golf details
    let golfMap = new Map<number, Best30ItemBase>()
    if (golfIds.length) {
      interface DBGolfRow {
        course_idx: number
        name_kr: string
        name_en: string
        location: string
        locationEn: string
        image: string | null
        round_price: number | null
      }
      const [rows] = await pool.query(
        `
          SELECT
            c.course_idx,
            c.name_kr,
            c.name_en,
            CONCAT('#', (SELECT country_name FROM country_code WHERE country_code = c.country_code LIMIT 1), ' #',
              (SELECT city_name FROM country_code WHERE city_code = c.city_code LIMIT 1)) as location,
            CONCAT('#', (SELECT country_name_en FROM country_code WHERE country_code = c.country_code LIMIT 1), ' #',
              (SELECT city_name_en FROM country_code WHERE city_code = c.city_code LIMIT 1)) as locationEn,
            gci.main_image_url as image,
            p.min_price as round_price
          FROM golf_course c
          LEFT JOIN golf_course_image gci ON c.course_idx = gci.course_idx
          LEFT JOIN golf_course_monthly_price p ON c.course_idx = p.course_idx
            AND p.target_year = DATE_FORMAT(NOW(), '%Y')
            AND p.target_month = DATE_FORMAT(NOW(), '%m')
          WHERE c.course_status = 'Y' AND c.course_idx IN (${placeholders(golfIds)})
        `,
        golfIds
      )

      const list = (rows as DBGolfRow[]).map((row) => {
        const item: Best30ItemBase = {
          id: row.course_idx,
          type: 'golf',
          name: locale === 'ko' ? row.name_kr : row.name_en,
          location: locale === 'ko' ? row.location : row.locationEn,
          image: row.image || '',
          price: row.round_price ?? 0
        }
        return item
      })
      golfMap = new Map(list.map((i) => [i.id, i]))
    }

    // Hotel details
    let hotelMap = new Map<number, Best30ItemBase>()
    if (hotelIds.length) {
      interface DBHotelRow {
        hotel_idx: number
        name_kr: string
        name_en: string
        image_url: string | null
        location: string
        locationEn: string
        price: number | null
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
            (SELECT min_price FROM hotel_monthly_price WHERE hotel_idx = H.hotel_idx AND target_year = DATE_FORMAT(NOW(), '%Y') AND target_month = DATE_FORMAT(NOW(), '%m') AND use_yn = 'Y' LIMIT 1) AS price
          FROM hotel H
          WHERE H.hotel_status = 'Y' AND H.hotel_idx IN (${placeholders(hotelIds)})
        `,
        hotelIds
      )

      const list = (rows as DBHotelRow[]).map((row) => {
        const item: Best30ItemBase = {
          id: row.hotel_idx,
          type: 'hotel',
          name: locale === 'ko' ? row.name_kr : row.name_en,
          image: row.image_url || '',
          location: locale === 'ko' ? row.location : row.locationEn,
          price: row.price ?? 0
        }
        return item
      })
      hotelMap = new Map(list.map((i) => [i.id, i]))
    }

    // Caddy details
    let caddyMap = new Map<number, Best30ItemBase>()
    if (caddyIds.length) {
      interface DBCaddyRow {
        caddyIdx: number
        courseIdx: number
        golfNameKr: string
        golfNameEn: string
        price: number | null
        name: string
        location: string
        locationEn: string
        imageUrl: string | null
      }
      const [rows] = await pool.query(
        `
          SELECT
            C.caddy_idx as caddyIdx,
            G.course_idx as courseIdx,
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
          WHERE C.caddy_status = 'Y' AND C.caddy_idx IN (${placeholders(caddyIds)})
        `,
        caddyIds
      )

      const list = (rows as DBCaddyRow[]).map((row) => {
        const item: Best30ItemBase = {
          id: row.caddyIdx,
          type: 'caddy',
          name: row.name,
          image: row.imageUrl || '',
          location: locale === 'ko' ? row.location : row.locationEn,
          price: row.price ?? 0,
          courseId: row.courseIdx,
          golfCourseName: locale === 'ko' ? row.golfNameKr : row.golfNameEn
        }
        return item
      })
      caddyMap = new Map(list.map((i) => [i.id, i]))
    }

    // 4) Recompose in original order
    const items: Best30ItemBase[] = []
    for (const r of recoList) {
      if (r.product_type === 'golf') {
        const v = golfMap.get(r.product_idx)
        if (v) items.push(v)
      } else if (r.product_type === 'hotel') {
        const v = hotelMap.get(r.product_idx)
        if (v) items.push(v)
      } else if (r.product_type === 'caddy') {
        const v = caddyMap.get(r.product_idx)
        if (v) items.push(v)
      }
    }

    return { total: items.length, items }
  } catch (error) {
    console.error('Error fetching best30 recommendations:', error)
    return { total: 0, items: [] }
  }
})

