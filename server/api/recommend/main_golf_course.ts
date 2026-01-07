import { defineEventHandler, getQuery, parseCookies } from 'h3'
import type { GolfCourseListResponse } from '~/types/admin/course'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event): Promise<GolfCourseListResponse> => {
  const { excludeId, limit } = getQuery(event)
  const pool = await getPool()

  let limitNum = 6
  if(limit) {
    limitNum = Number(limit)
  }

  const cookies = parseCookies(event)
  const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'

  try {
    // 1) Load recommended product list for golf
    const params: Array<string | number> = []
    let recoSql = `
      SELECT recommend_product_idx, product_idx, product_type, sort
      FROM recommend_product
      WHERE recommend_type = 'golf'
    `
    const excludeIdNum = typeof excludeId !== 'undefined' ? Number(excludeId) : undefined
    if (typeof excludeIdNum === 'number' && !Number.isNaN(excludeIdNum)) {
      recoSql += ` AND product_idx != ?`
      params.push(excludeIdNum)
    }
    recoSql += `
      ORDER BY (sort IS NULL), sort ASC, recommend_product_idx DESC
      LIMIT ${limitNum}
    `

    const [recoRows] = await pool.query(recoSql, params)

    interface RecommendRow { recommend_product_idx: number; product_idx: number; product_type: string; sort: number | null }
    const recoList = (recoRows as RecommendRow[])
    if (!recoList.length) {
      return { total: 0, courses: [] } as unknown as GolfCourseListResponse
    }

    const golfIds = recoList.map(r => r.product_idx)

    // 2) Fetch golf details in batch
    const placeholders = golfIds.map(() => '?').join(',')
    interface DBGolfRow {
      course_idx: number
      name_kr: string
      name_en: string
      location: string
      locationEn: string
      image: string | null
      round_price: number | null
      created_at: Date
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
          p.min_price as round_price,
          c.created_at
        FROM golf_course c
        LEFT JOIN golf_course_image gci ON c.course_idx = gci.course_idx
        LEFT JOIN golf_course_monthly_price p ON c.course_idx = p.course_idx
          AND p.target_year = DATE_FORMAT(NOW(), '%Y')
          AND p.target_month = DATE_FORMAT(NOW(), '%m')
        WHERE c.course_status = 'Y' AND c.course_idx IN (${placeholders})
      `,
      golfIds
    )

    const list = (rows as DBGolfRow[]).map((row) => ({
      id: row.course_idx,
      name: locale === 'ko' ? row.name_kr : row.name_en,
      location: locale === 'ko' ? row.location : row.locationEn,
      price: row.round_price ?? 0,
      isNew: isNewCourse(row.created_at),
      image: row.image || ''
    }))
    const map = new Map<number, {
      id: number
      name: string
      location: string
      price: number
      isNew: boolean
      image: string
    }>(list.map((i) => [i.id, i]))

    // 3) Recompose in recommended order
    const courses: {
      id: number
      name: string
      location: string
      price: number
      isNew: boolean
      image: string
    }[] = []
    for (const r of recoList) {
      const v = map.get(r.product_idx)
      if (v) courses.push(v)
    }

    return {
      total: courses.length,
      courses
    } as unknown as GolfCourseListResponse
  } catch (error) {
    console.error('Error fetching recommended golf courses:', error)
    throw error
  }
})

// 2주 이내에 등록된 골프장은 NEW 표시
function isNewCourse(createdAt: Date): boolean {
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  return new Date(createdAt) > twoWeeksAgo
}

