import { defineEventHandler, getMethod, getRouterParam, parseCookies } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const method = getMethod(event)
    const id = getRouterParam(event, 'id')
    
    // Get locale from cookies
    const cookies = parseCookies(event)
    const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'
    console.log('locale ==>', locale)
    
    // No need for cookies in this endpoint

    if (!id) {
      return { success: false, error: 'Caddy ID is required' }
    }

    // GET - Fetch caddy details
    if (method === 'GET') {
      const sql = `
        SELECT
          C.caddy_idx,
          C.caddy_code,
          C.name,
          C.nick_name,
          G.name_kr as golfNameKr,
          G.name_en as golfNameEn,
          C.age,
          C.height,
          C.day_off,
          C.golf_experience,
          C.price,
          C.reservation_fee,
          IFNULL(r.review_count, 0) AS review_count,
          IFNULL(r.average_rating, 0) AS average_rating,
          (SELECT long_text FROM locale_text WHERE target_category = 'caddy_caution' AND language = UPPER(?) AND use_yn = 'Y' LIMIT 1) AS caution,
          LT.text AS language,
          LT2.long_text AS specialty
        FROM caddy C
        JOIN golf_course G ON C.course_idx = G.course_idx
        LEFT JOIN locale_text LT ON C.caddy_idx = LT.target_idx AND LT.target_category = 'caddy.language' AND LT.language = UPPER(?) AND LT.use_yn = 'Y'
        LEFT JOIN locale_text LT2 ON C.caddy_idx = LT2.target_idx AND LT2.target_category = 'caddy.specialty' AND LT2.language = UPPER(?) AND LT2.use_yn = 'Y'
        LEFT JOIN (
          SELECT
            product_idx
            , COUNT(review_idx) AS review_count
            , TRUNCATE(AVG(review_rate), 1) AS average_rating
          FROM review
          WHERE product_idx = ? AND review_type = 'C' AND use_yn = 'Y'
        ) r ON C.caddy_idx = r.product_idx
        WHERE C.caddy_idx = ? AND C.caddy_status = 'Y'
      `

      try {
        const pool = getPool()
        const [rows] = await pool.query(sql, [locale, locale, locale, id, id])

        const caddy = rows[0]

        if (!caddy) {
          return { success: false, error: 'Caddy not found' }
        }

        // Fetch caddy images
        const imagesSql = `
          SELECT image_url
          FROM caddy_image
          WHERE caddy_idx = ? AND use_yn = 'Y'
          ORDER BY sort
        `
        const [images] = await pool.query(imagesSql, [id])
        caddy.images = images

        const session = await getUserSession(event)
        const memberIdx = session?.user?.member_idx

        if(memberIdx){
          //wish check
          const wishCheckSql = `
            SELECT 
              IFNULL((SELECT wish_idx FROM wish WHERE wish_type = 'C' AND product_idx = ? AND member_idx = ? AND use_yn = 'Y' LIMIT 1), 0) AS wish_idx
          `
          const [wishCheck] = await pool.query(wishCheckSql, [id, memberIdx])
          caddy.is_wished = wishCheck[0].wish_idx > 0
          caddy.wish_idx = wishCheck[0].wish_idx
        }

        return { success: true, data: caddy }
      } catch (error) {
        const queryError = error as Error
        console.error('Query execution error:', queryError)
        return {
          success: false,
          error: 'Failed to fetch caddy details',
          details: process.env.NODE_ENV === 'development' ? queryError.message : undefined
        }
      }
    }

    return {
      success: false,
      error: `Method ${method} not supported`
    }
  } catch (error) {
    const err = error as Error
    console.error('Unexpected error in caddy API:', err)
    return {
      success: false,
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})
