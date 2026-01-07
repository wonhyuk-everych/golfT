import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getPool } from '~/server/utils/db'

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

  const reviewId = getRouterParam(event, 'id')
  if (!reviewId) {
    throw createError({ statusCode: 400, message: '리뷰 ID가 필요합니다.' })
  }

  const pool = getPool()

  try {
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

    const sql = `
      SELECT
        R.review_idx,
        R.review_type,
        R.member_idx,
        M.name_kr AS member_name,
        R.reservation_idx,
        R.product_idx,
        ${productTitleExpr},
        R.review_content,
        R.review_rate,
        R.use_yn,
        DATE_FORMAT(R.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
        DATE_FORMAT(R.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at
      FROM review R
      JOIN member M ON R.member_idx = M.member_idx
      ${productJoin}
      WHERE R.review_idx = ?
      LIMIT 1
    `

    const [rows] = await pool.query(sql, [reviewId])
    const review = (rows as any[])[0]
    if (!review) {
      throw createError({ statusCode: 404, message: '리뷰를 찾을 수 없습니다.' })
    }

    // images
    const [imageRows] = await pool.query(
      `SELECT review_image_idx, image_url, use_yn, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
       FROM review_image WHERE review_idx = ? AND use_yn = 'Y' ORDER BY review_image_idx ASC`,
      [reviewId]
    )

    return {
      review: {
        ...review,
        images: imageRows
      }
    }
  } catch (error) {
    console.error('Error fetching admin review detail:', error)
    throw createError({ statusCode: 500, message: '리뷰 상세 조회에 실패했습니다.' })
  }
})
