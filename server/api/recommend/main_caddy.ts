import { defineEventHandler, parseCookies } from 'h3'
import { getPool } from '~/server/utils/db'

interface CaddyRecommendation {
  caddyIdx: number
  courseIdx: number
  golfNameKr: string
  golfNameEn: string
  price: number
  name: string
  location: string
  locationEn: string
  imageUrl: string
}

interface CaddyRecommendationResponse {
  total: number
  caddies: {
    id: number
    courseId: number
    golfCourseName: string
    price: number | string
    name: string
    location: string
    image: string
  }[]
}

export default defineEventHandler(async (event): Promise<CaddyRecommendationResponse> => {
  const pool = await getPool()

  const cookies = parseCookies(event)
  const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'

  try {
    // 1) Load recommended product list for caddy
    const [recoRows] = await pool.query(
      `
        SELECT recommend_product_idx, product_idx, product_type, sort
        FROM recommend_product
        WHERE recommend_type = 'caddy'
        ORDER BY (sort IS NULL), sort ASC, recommend_product_idx DESC
        LIMIT 6
      `
    )

    interface RecommendRow { recommend_product_idx: number; product_idx: number; product_type: string; sort: number | null }
    const recoList = (recoRows as RecommendRow[])
    if (!recoList.length) {
      return { total: 0, caddies: [] }
    }

    const caddyIds = recoList.map(r => r.product_idx)
    const placeholders = caddyIds.map(() => '?').join(',')

    // 2) Fetch caddy details in batch
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
        WHERE C.caddy_status = 'Y' AND C.caddy_idx IN (${placeholders})
      `,
      caddyIds
    )

    const list = (rows as CaddyRecommendation[]).map((row) => ({
      id: row.caddyIdx,
      courseId: row.courseIdx,
      golfCourseName: locale === 'ko' ? row.golfNameKr : row.golfNameEn,
      price: row.price,
      name: row.name,
      location: locale === 'ko' ? row.location : row.locationEn,
      image: row.imageUrl || ''
    }))
    const map = new Map<number, {
      id: number
      courseId: number
      golfCourseName: string
      price: number | string
      name: string
      location: string
      image: string
    }>(list.map((i) => [i.id, i]))

    // 3) Recompose in recommended order
    const caddies: {
      id: number
      courseId: number
      golfCourseName: string
      price: number | string
      name: string
      location: string
      image: string
    }[] = []
    for (const r of recoList) {
      const v = map.get(r.product_idx)
      if (v) caddies.push(v)
    }

    return {
      total: caddies.length,
      caddies
    }
  } catch (error) {
    console.error('Error fetching recommended caddies:', error)
    throw error
  }
})
