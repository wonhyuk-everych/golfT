import { defineEventHandler, getQuery, createError } from 'h3'
import { getPool } from '~/server/utils/db'

interface AdminReviewListItem {
  review_idx: number
  review_type: 'G' | 'H' | 'C'
  product_idx: number
  product_title: string | null
  member_idx: number
  member_name: string | null
  review_content: string | null
  review_rate: number
  use_yn: 'Y' | 'N'
  created_at: string
  updated_at: string
  first_image_url: string | null
}

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

  const pool = getPool()

  try {
    const query = getQuery(event)

    const type = ((query.type as string) || 'G').toUpperCase() as 'G' | 'H' | 'C'
    const keyword = (query.keyword as string) || ''
    const useYn = ((query.useYn as string) || '').toUpperCase() as '' | 'Y' | 'N'

    const page = Math.max(1, parseInt((query.page as string) || '1'))
    const pageSize = Math.min(100, Math.max(1, parseInt((query.pageSize as string) || '20')))
    const offset = (page - 1) * pageSize

    // Dynamic product joins
    const productJoin = `
      LEFT JOIN golf_course GC ON (R.review_type = 'G' AND R.product_idx = GC.course_idx)
      LEFT JOIN hotel H ON (R.review_type = 'H' AND R.product_idx = H.hotel_idx)
      LEFT JOIN caddy C ON (R.review_type = 'C' AND R.product_idx = C.caddy_idx)
    `

    const productTitleExpr = `CASE 
      WHEN R.review_type = 'G' THEN GC.name_kr
      WHEN R.review_type = 'H' THEN H.name_kr
      WHEN R.review_type = 'C' THEN C.name
      ELSE NULL
    END AS product_title`

    const whereClauses: string[] = [
      `R.review_type = ?`
    ]
    const params: any[] = [type]

    if (useYn === 'Y' || useYn === 'N') {
      whereClauses.push('R.use_yn = ?')
      params.push(useYn)
    }

    if (keyword && keyword.trim().length > 0) {
      // Search on product title, member name, review content, or exact product_idx if numeric
      whereClauses.push(`(
        ${productTitleExpr.replace(' AS product_title', '')} LIKE ?
        OR M.name_kr LIKE ?
        OR R.review_content LIKE ?
        ${/^\d+$/.test(keyword.trim()) ? 'OR R.product_idx = ?' : ''}
      )`)
      const likeParam = `%${keyword.trim()}%`
      params.push(likeParam, likeParam, likeParam)
      if (/^\d+$/.test(keyword.trim())) {
        params.push(parseInt(keyword.trim(), 10))
      }
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const baseSelect = `
      SELECT
        R.review_idx,
        R.review_type,
        R.product_idx,
        ${productTitleExpr},
        M.member_idx,
        M.name_kr AS member_name,
        R.review_content,
        R.review_rate,
        R.use_yn,
        DATE_FORMAT(R.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
        DATE_FORMAT(R.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
        (
          SELECT image_url FROM review_image RI 
          WHERE RI.review_idx = R.review_idx AND RI.use_yn = 'Y' 
          ORDER BY RI.review_image_idx ASC LIMIT 1
        ) AS first_image_url
      FROM review R
      JOIN member M ON R.member_idx = M.member_idx
      ${productJoin}
      ${whereSql}
      ORDER BY R.created_at DESC, R.review_idx DESC
      LIMIT ? OFFSET ?
    `

    const [rows] = await pool.query(baseSelect, [...params, pageSize, offset])
    const items = rows as AdminReviewListItem[]

    // total count
    const countSql = `
      SELECT COUNT(1) AS total
      FROM review R
      JOIN member M ON R.member_idx = M.member_idx
      ${productJoin}
      ${whereSql}
    `
    const [cntRows] = await pool.query(countSql, params)
    const total = (cntRows as any)[0]?.total || 0

    return {
      page,
      pageSize,
      total,
      reviews: items
    }
  } catch (error) {
    console.error('Error fetching admin review list:', error)
    throw createError({
      statusCode: 500,
      message: '리뷰 목록을 불러오는데 실패했습니다.'
    })
  }
})
