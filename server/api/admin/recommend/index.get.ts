import { defineEventHandler, getQuery, createError } from 'h3'
import { getPool } from '~/server/utils/db'
import type { RecommendProductWithDetails } from '~/types/admin/recommend'

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

  try {
    const pool = getPool()
    const query = getQuery(event)
    const { type = 'best30' } = query

    // 추천 타입별 최대 개수 설정
    const maxCounts = {
      best30: 30,
      golf: 6,
      hotel: 6,
      caddy: 6
    }

    const maxCount = maxCounts[type as keyof typeof maxCounts] || 30

    // 추천 상품 조회 쿼리
    let sql = `
      SELECT 
        rp.recommend_product_idx,
        rp.recommend_type,
        rp.product_idx,
        rp.product_type,
        rp.sort,
        rp.created_at,
        rp.updated_at,
        CASE 
          WHEN rp.product_type = 'golf' THEN gc.name_kr
          WHEN rp.product_type = 'hotel' THEN h.name_kr
          WHEN rp.product_type = 'caddy' THEN CONCAT(c.name, ' (', c.caddy_code, ')')
        END as product_name,
        CASE 
          WHEN rp.product_type = 'golf' THEN gcp.min_price
          WHEN rp.product_type = 'hotel' THEN hmp.min_price
          WHEN rp.product_type = 'caddy' THEN (c.price + c.reservation_fee)
        END as product_price,
        CASE 
          WHEN rp.product_type = 'golf' THEN gci.main_image_url
          WHEN rp.product_type = 'hotel' THEN hi.image_url
          WHEN rp.product_type = 'caddy' THEN ci.image_url
        END as product_image,
        CASE 
          WHEN rp.product_type = 'golf' THEN CONCAT(
            (SELECT country_name FROM country_code WHERE country_code = gc.country_code LIMIT 1), ' ',
            (SELECT city_name FROM country_code WHERE city_code = gc.city_code LIMIT 1)
          )
          WHEN rp.product_type = 'hotel' THEN CONCAT(
            (SELECT country_name FROM country_code WHERE country_code = h.country_code LIMIT 1), ' ',
            (SELECT city_name FROM country_code WHERE city_code = h.city_code LIMIT 1)
          )
          WHEN rp.product_type = 'caddy' THEN CONCAT(
            (SELECT country_name FROM country_code WHERE country_code = gc2.country_code LIMIT 1), ' ',
            (SELECT city_name FROM country_code WHERE city_code = gc2.city_code LIMIT 1)
          )
        END as product_location
      FROM recommend_product rp
      LEFT JOIN golf_course gc ON rp.product_type = 'golf' AND rp.product_idx = gc.course_idx AND gc.course_status = 'Y'
      LEFT JOIN golf_course_image gci ON gc.course_idx = gci.course_idx
      LEFT JOIN golf_course_monthly_price gcp ON gc.course_idx = gcp.course_idx 
        AND gcp.target_year = DATE_FORMAT(NOW(), '%Y') 
        AND gcp.target_month = DATE_FORMAT(NOW(), '%m')
      LEFT JOIN hotel h ON rp.product_type = 'hotel' AND rp.product_idx = h.hotel_idx AND h.hotel_status = 'Y'
      LEFT JOIN hotel_image hi ON h.hotel_idx = hi.hotel_idx AND hi.use_yn = 'Y' AND hi.main_yn = 'Y'
      LEFT JOIN hotel_monthly_price hmp ON h.hotel_idx = hmp.hotel_idx 
        AND hmp.target_year = DATE_FORMAT(NOW(), '%Y') 
        AND hmp.target_month = DATE_FORMAT(NOW(), '%m') 
        AND hmp.use_yn = 'Y'
      LEFT JOIN caddy c ON rp.product_type = 'caddy' AND rp.product_idx = c.caddy_idx AND c.caddy_status = 'Y'
      LEFT JOIN golf_course gc2 ON c.course_idx = gc2.course_idx
      LEFT JOIN caddy_image ci ON c.caddy_idx = ci.caddy_idx
      WHERE rp.recommend_type = ?
      ORDER BY (rp.sort IS NULL), rp.sort ASC, rp.recommend_product_idx DESC
    `

    const [rows] = await pool.query(sql, [type])
    const products = rows as RecommendProductWithDetails[]

    // 빈 슬롯 생성 (최대 개수까지)
    const slots = Array.from({ length: maxCount }, (_, index) => {
      const existingProduct = products.find(p => p.sort === index + 1)
      return existingProduct || {
        sort: index + 1,
        recommend_product_idx: null,
        recommend_type: type,
        product_idx: null,
        product_type: null,
        product_name: null,
        product_price: null,
        product_image: null,
        product_location: null,
        created_at: null,
        updated_at: null
      }
    })

    return {
      type,
      maxCount,
      products: slots
    }
  } catch (error) {
    console.error('Error fetching recommend products:', error)
    throw createError({
      statusCode: 500,
      message: '추천 상품 목록을 불러오는데 실패했습니다.'
    })
  }
})
