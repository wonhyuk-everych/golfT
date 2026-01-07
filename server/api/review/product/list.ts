import { parseCookies } from 'h3'
import { getPool } from '~/server/utils/db'

interface ProductReviewRow {
  product_id: number
  product_name: string
  product_name_en: string
  review: string
  review_rate: number
  review_date: string
  review_idx: number
  review_image: string | null
  member_name: string
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const cookies = parseCookies(event)
  const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'

  const productId = parseInt(query.product_id as string)
  if (!productId) {
    return { error: 'Missing product_id' }
  }

  const reviewType = (query.review_type || 'G').toUpperCase()
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const pageSize = Math.min(20, parseInt(query.pageSize as string) || 20)
  const offset = (page - 1) * pageSize

  let productJoin = ''
  let productIdCol = ''
  let productNameCol = ''
  let productNameEnCol = ''

  switch (reviewType) {
    case 'H':
      productJoin = 'JOIN hotel H ON R.product_idx = H.hotel_idx'
      productIdCol = 'H.hotel_idx AS product_id'
      productNameCol = 'H.name_kr AS product_name'
      productNameEnCol = 'H.name_en AS product_name_en'
      break
    case 'C':
      productJoin = 'JOIN caddy C ON R.product_idx = C.caddy_idx'
      productIdCol = 'C.caddy_idx AS product_id'
      productNameCol = 'C.name AS product_name'
      productNameEnCol = 'C.name AS product_name_en'
      break
    case 'G':
    default:
      productJoin = 'JOIN golf_course G ON R.product_idx = G.course_idx'
      productIdCol = 'G.course_idx AS product_id'
      productNameCol = 'G.name_kr AS product_name'
      productNameEnCol = 'G.name_en AS product_name_en'
      break
  }

  const pool = getPool()

  // Count total
  const countSql = `
    SELECT COUNT(*) as total, ROUND(AVG(review_rate), 1) as average_rating
    FROM review R
    ${productJoin}
    WHERE R.product_idx = ? AND R.review_type = ?
  `
  const [countRows] = await pool.query(countSql, [productId, reviewType])
  const total = (countRows as any)[0]?.total || 0
  const averageRating = (countRows as any)[0]?.average_rating || 0

  // List
  const sql = `
    SELECT
      ${productIdCol},
      ${productNameCol},
      ${productNameEnCol},
      R.review_content,
      R.review_rate,
      DATE_FORMAT(R.created_at, '%Y.%m.%d') as review_date,
      R.review_idx,
      CONCAT(
          LEFT(M.name_kr, 1),
          REPEAT('*', CHAR_LENGTH(M.name_kr) - 1)
        ) AS member_name
    FROM review R
    ${productJoin}
    LEFT JOIN member M ON R.member_idx = M.member_idx
    WHERE R.product_idx = ? AND R.review_type = ?
    ORDER BY R.review_idx DESC
    LIMIT ? OFFSET ?
  `
  const [rows] = await pool.query(sql, [productId, reviewType, pageSize, offset])

  // 각 리뷰별 이미지 배열 추가
  const reviewsWithImages = await Promise.all(
    (rows as ProductReviewRow[]).map(async (review: any) => {
      const [imgRows] = await pool.query(
        'SELECT image_url FROM review_image WHERE review_idx = ? AND use_yn = \'Y\' ORDER BY review_image_idx ASC',
        [review.review_idx]
      );
      return {
        ...review,
        review_image: imgRows.map((img: any) => img.image_url)
      }
    })
  );

  console.log(reviewsWithImages)

  return {
    reviews: reviewsWithImages,
    total,
    averageRating,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
})
