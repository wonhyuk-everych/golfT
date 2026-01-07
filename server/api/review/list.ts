import { parseCookies } from 'h3'
import { getPool } from '~/server/utils/db'

interface ReviewRow {
  product_id: number
  product_name: string
  product_name_en: string
  review: string
  review_rate: number
  review_date: string
  review_idx: number
  review_image: string | null
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const cookies = parseCookies(event)
  const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'

  const session = await getUserSession(event)
  const memberIdx = session?.user?.member_idx

  // Params
  const reviewType = (query.review_type || 'G').toUpperCase()
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const pageSize = Math.min(20, parseInt(query.pageSize as string) || 20)
  const offset = (page - 1) * pageSize

  let productJoin = ''
  let productIdCol = ''
  let productNameCol = ''
  let productNameEnCol = ''

  // 상품 타입별 JOIN 및 컬럼 설정
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
  const sql = `
    SELECT
      ${productIdCol},
      ${productNameCol},
      ${productNameEnCol},
      R.review_content AS review,
      R.review_rate AS review_rate,
      DATE_FORMAT(R.updated_at, '%Y-%m-%d') AS review_date,
      R.review_idx AS review_idx,
      (SELECT image_url FROM review_image WHERE review_idx = R.review_idx AND use_yn = 'Y' ORDER BY review_image_idx ASC LIMIT 1) AS review_image
    FROM review R
    JOIN member M ON R.member_idx = M.member_idx
    ${productJoin}
    WHERE R.review_type = ? AND R.use_yn = 'Y' AND M.member_idx = ?
    ORDER BY R.updated_at DESC, R.review_idx DESC
    LIMIT ? OFFSET ?
  `

  try {
    const [rows] = await pool.query(sql, [reviewType, memberIdx, pageSize, offset]) as [ReviewRow[]]
    // i18n 적용: product_name 컬럼 선택
    const localizedRows = rows.map(row => ({
      ...row,
      product_name: locale === 'en' ? row.product_name_en : row.product_name
    }))
    return {
      page,
      pageSize,
      reviews: localizedRows
    }
  } catch (e) {
    return { error: 'DB error', detail: e instanceof Error ? e.message : e }
  }
})
