import { parseCookies } from 'h3'
import type { GolfCourseReview } from './types'
import { getPool } from '~/server/utils/db'

// Database row interfaces
interface ReviewRow {
  product_id: number
  product_name: string
  review: string
  review_rate: number
  reviewer: string
  review_date: Date
  review_idx: number
}

interface ImageRow {
  image_url: string
}

export default defineEventHandler(async (event) => {
  // 요청에서 product_idx 가져오기
  const query = getQuery(event)
  const productIdx = query.product_idx ? Number(query.product_idx) : null

  const cookies = parseCookies(event)
  const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'

  try {
    const pool = getPool()
    
    // 리뷰 데이터 조회
    let queryString = `
      SELECT
        G.course_idx AS product_id,
        G.name_kr AS product_name,
        G.name_en AS product_name_en,
        R.review_content AS review,
        R.review_rate AS review_rate,
        CONCAT(
          LEFT(M.name_kr, 1),
          REPEAT('*', CHAR_LENGTH(M.name_kr) - 1)
        ) AS reviewer,
        R.updated_at AS review_date,
        R.review_idx AS review_idx
      FROM review R
      JOIN member M ON R.member_idx = M.member_idx
      JOIN golf_course G ON R.product_idx = G.course_idx
      WHERE R.review_type = 'G' AND R.use_yn = 'Y'
    `
    
    // product_idx가 있으면 필터링 조건 추가
    if (productIdx) {
      queryString += ` AND G.course_idx = ?`
    }
    
    // 정렬 및 페이지네이션 추가
    queryString += ` ORDER BY R.updated_at DESC, R.review_idx DESC LIMIT 6`
    
    // 쿼리 실행
    const [reviewRows] = productIdx
      ? await pool.query(queryString, [productIdx])
      : await pool.query(queryString)
    
    // 각 리뷰에 대한 이미지 조회 및 데이터 구성
    const reviews: GolfCourseReview[] = await Promise.all(
      (reviewRows as ReviewRow[]).map(async (row) => {
        // 리뷰 이미지 조회
        const [imageRows] = await pool.query(`
          SELECT image_url 
          FROM review_image 
          WHERE review_idx = ? AND use_yn = 'Y' 
          ORDER BY review_image_idx ASC
        `, [row.review_idx])
        
        // 이미지 URL 배열 구성
        const images = (imageRows as ImageRow[]).map(img => img.image_url)
        
        // 리뷰 데이터 구성
        return {
          id: row.product_id,
          productName: locale === 'ko' ? row.product_name : row.product_name_en,
          review: row.review,
          reviewRate: row.review_rate,
          reviewer: row.reviewer,
          image: images.length > 0 ? images : ['https://golft.speedgabia.com/images/review/hotel_1/c572345b0d77483185bd08af3e7a2587_1754397501504.jpg'],
          reviewDate: row.review_date
        }
      })
    )

    //리뷰 총 갯수
    const [totalRows] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        ROUND(AVG(review_rate), 1) AS review_avg
      FROM review R
      JOIN member M ON R.member_idx = M.member_idx
      JOIN golf_course G ON R.product_idx = G.course_idx
      WHERE R.product_idx = ? AND R.review_type = 'G' AND R.use_yn = 'Y'
    `,[productIdx])

    const total = (totalRows as any)[0]?.total || 0
    const reviewAvg = (totalRows as any)[0]?.review_avg || 0
    
    return {reviews, total, reviewAvg}
  } catch (error) {
    console.error('Error fetching review data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching review data',
      data: error
    })
  }
})
