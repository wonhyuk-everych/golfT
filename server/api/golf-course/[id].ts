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

    if (!id) {
      return { success: false, error: 'Course ID is required' }
    }

    // GET - Fetch golf course details
    if (method === 'GET') {
      const sql = `
       SELECT
        c.course_idx as id
        , c.name_kr
        , c.name_en
        , c.description
        , c.course_holes
        , c.course_par
        , c.course_length
        , c.course_info
        , c.facility_info
        , CC.country_name as country_code
        , CC.city_name as city_code
        , c.nearest_airport
        , c.nearest_city
        , c.airport_time
        , c.city_time
        , c.website
        , c.address
        , c.phone
        , c.fax
        , c.course_designer
        , c.booking_status
        , gci.main_image_url
        , gci.course_image_url
        , gci.clubhouse_image_url
        , gci.restaurant_image_url
        , gci.shelter_image_url
        , gci.proshop_image_url
        , gci.description_image_url
        , caddy_covenants.text AS caddy_covenants
        , caddy_rule.text AS caddy_rule
        , rain_check.text AS rain_check
        , gallery_fee.text AS gallery_fee
        , IFNULL(r.review_count, 0) as review_count
        , IFNULL(r.review_rating, 0) as review_rating
        , IFNULL((SELECT bart_exchange_rate FROM bart_exchange_rate ORDER BY created_at DESC LIMIT 1), 0.023) AS bart_price
      FROM golf_course c
      LEFT JOIN country_code CC ON c.country_code = CC.country_code AND CC.city_code = c.city_code
      LEFT JOIN golf_course_image gci ON c.course_idx = gci.course_idx
      LEFT JOIN locale_text caddy_covenants ON c.course_idx = caddy_covenants.target_idx AND caddy_covenants.target_category = 'golf_course.caddy_covenants' AND caddy_covenants.language = UPPER(?) AND caddy_covenants.use_yn = 'Y'
      LEFT JOIN locale_text caddy_rule ON c.course_idx = caddy_rule.target_idx AND caddy_rule.target_category = 'golf_course.caddy_rule' AND caddy_rule.language = UPPER(?) AND caddy_rule.use_yn = 'Y'
      LEFT JOIN locale_text rain_check ON c.course_idx = rain_check.target_idx AND rain_check.target_category = 'golf_course.rain_check' AND rain_check.language = UPPER(?) AND rain_check.use_yn = 'Y'
      LEFT JOIN locale_text gallery_fee ON c.course_idx = gallery_fee.target_idx AND gallery_fee.target_category = 'golf_course.gallery_fee' AND gallery_fee.language = UPPER(?) AND gallery_fee.use_yn = 'Y'
      LEFT JOIN (
          SELECT
            product_idx
            , COUNT(review_idx) AS review_count
            , TRUNCATE(AVG(review_rate), 1) AS review_rating
          FROM review
          WHERE product_idx = ? AND review_type = 'G' AND use_yn = 'Y'
      ) r ON c.course_idx = r.product_idx
      WHERE c.course_idx = ? AND course_status = 'Y'
      `

      try {
        const pool = getPool()
        const [rows] = await pool.query(sql, [locale, locale, locale, locale, id, id])

        const course = rows[0]

        if (!course) {
          return { success: false, error: 'Course not found' }
        }

        // Fetch extra images
        const extraImagesSql = `
          SELECT image_url
          FROM golf_course_extra_image
          WHERE course_idx = ?
          ORDER BY created_at DESC
        `
        const [extraImages] = await pool.query(extraImagesSql, [id])
        course.extra_images = extraImages
        
        // Fetch facilities
        const facilitiesSql = `
          SELECT
              LT.text,
              GFT.icon_name
          FROM golf_course_facility GCF
          JOIN golf_facility_type GFT on GFT.golf_facility_type_idx = GCF.golf_facility_type_idx
          JOIN locale_text LT ON GFT.golf_facility_type_idx = LT.target_idx AND LT.target_category = 'golf_facility_type' AND LT.language = ? AND LT.use_yn = 'Y'
          WHERE GCF.course_idx = ? AND GCF.use_yn = 'Y'
        `
        const [facilities] = await pool.query(facilitiesSql, [locale, id])
        course.facilities = facilities

        // Fetch minPrice
        const minPriceSql = `
          SELECT MIN(price) as min_price
          FROM golf_course_time_price
          WHERE golf_monthly_price_idx = (SELECT golf_monthly_price_idx
              FROM golf_course_monthly_price
              WHERE target_year = DATE_FORMAT(NOW(), '%Y') AND target_month = DATE_FORMAT(NOW(), '%m') AND course_idx = ? LIMIT 1)
            AND course_idx = ? AND use_yn = 'Y'
        `
        const [minPrice] = await pool.query(minPriceSql, [id, id])
        course.min_price = minPrice[0].min_price

        const session = await getUserSession(event)
        const memberIdx = session?.user?.member_idx

        if(memberIdx){
          //wish check
          const wishCheckSql = `
            SELECT 
              IFNULL((SELECT wish_idx FROM wish WHERE wish_type = 'G' AND product_idx = ? AND member_idx = ? AND use_yn = 'Y' LIMIT 1), 0) AS wish_idx
          `
          const [wishCheck] = await pool.query(wishCheckSql, [id, memberIdx])
          course.is_wished = wishCheck[0].wish_idx > 0
          course.wish_idx = wishCheck[0].wish_idx
        }

        return { success: true, data: course }
      } catch (error) {
        const queryError = error as DatabaseError
        console.error('Query execution error:', queryError)
        return {
          success: false,
          error: 'Failed to fetch golf course details',
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
    console.error('Unexpected error in golf course API:', err)
    return {
      success: false,
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})
