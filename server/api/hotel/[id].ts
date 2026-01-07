import { defineEventHandler, getMethod, getRouterParam, parseCookies } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'

interface DatabaseError extends Error {
  code?: string;
  sqlMessage?: string;
}

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
      return { success: false, error: 'Hotel ID is required' }
    }

    // GET - Fetch hotel details
    if (method === 'GET') {
      // 호텔 기본 정보 조회 쿼리
      const hotelSql = `
        SELECT
          H.hotel_idx
          , H.name_kr
          , H.name_en
          , explain_hotel.long_text AS explain_hotel
          , explain_short.text AS explain_short
          , CC.country_name as country_code
          , CC.city_name AS city_code
          , H.check_in
          , H.check_out
          , H.address
          , H.home_page
          , HI.pay_info
          , HI.refund_info
          , HI.service_info
          , HI.hotel_facility_info
          , HI.room_facility_info
          , IFNULL(r.review_count, 0) AS review_count
          , IFNULL(r.average_rating, 0) AS average_rating
          , HI.pay_caution_check_image_url AS check_info
          , HI2.image_url AS image
          , (SELECT HR.room_sale_price FROM hotel_room HR WHERE HR.hotel_idx = H.hotel_idx AND HR.use_yn = 'Y' ORDER BY HR.room_sale_price LIMIT 1) AS price
          , IFNULL(hotel_tour.long_text, '') AS tour
          , IFNULL(hotel_transportation.long_text, '') AS transportation
          , IFNULL(hotel_language.long_text, '') AS language
          , IFNULL(room_type.long_text, '') AS room_type
          , IFNULL(room_facility.long_text, '') AS room_facility
          , IFNULL(extra_charge.long_text, '') AS extra_charge
          , IFNULL(caution.long_text, '') AS caution
          , IFNULL((SELECT bart_exchange_rate FROM bart_exchange_rate ORDER BY created_at DESC LIMIT 1), 0.023) AS bart_price
        FROM hotel H
        JOIN hotel_info HI ON H.hotel_idx = HI.hotel_idx
        LEFT JOIN country_code CC ON H.country_code = CC.country_code AND CC.city_code = H.city_code
        LEFT JOIN hotel_image HI2 ON H.hotel_idx = HI2.hotel_idx AND HI2.use_yn = 'Y'
        LEFT JOIN locale_text explain_hotel ON H.hotel_idx = explain_hotel.target_idx AND explain_hotel.target_category = 'hotel.explain' AND explain_hotel.language = UPPER(?) AND explain_hotel.use_yn = 'Y'
        LEFT JOIN locale_text explain_short ON H.hotel_idx = explain_short.target_idx AND explain_short.target_category = 'hotel.explain_short' AND explain_short.language = UPPER(?) AND explain_short.use_yn = 'Y'
        LEFT JOIN locale_text hotel_tour ON H.hotel_idx = hotel_tour.target_idx AND hotel_tour.target_category = 'hotel.tour' AND hotel_tour.language = UPPER(?) AND hotel_tour.use_yn = 'Y'
        LEFT JOIN locale_text hotel_transportation ON H.hotel_idx = hotel_transportation.target_idx AND hotel_transportation.target_category = 'hotel.transportation' AND hotel_transportation.language = UPPER(?) AND hotel_transportation.use_yn = 'Y'
        LEFT JOIN locale_text hotel_language ON H.hotel_idx = hotel_language.target_idx AND hotel_language.target_category = 'hotel.language' AND hotel_language.language = UPPER(?) AND hotel_language.use_yn = 'Y'
        LEFT JOIN locale_text room_type ON H.hotel_idx = room_type.target_idx AND room_type.target_category = 'hotel.room_type' AND room_type.language = UPPER(?) AND room_type.use_yn = 'Y'
        LEFT JOIN locale_text room_facility ON H.hotel_idx = room_facility.target_idx AND room_facility.target_category = 'hotel.room_facility' AND room_facility.language = UPPER(?) AND room_facility.use_yn = 'Y'
        LEFT JOIN locale_text extra_charge ON H.hotel_idx = extra_charge.target_idx AND extra_charge.target_category = 'hotel.extra_charge' AND extra_charge.language = UPPER(?) AND extra_charge.use_yn = 'Y'
        LEFT JOIN locale_text caution ON H.hotel_idx = caution.target_idx AND caution.target_category = 'hotel.caution' AND caution.language = UPPER(?) AND caution.use_yn = 'Y'
        LEFT JOIN (
          SELECT
            product_idx
            , COUNT(review_idx) AS review_count
            , TRUNCATE(AVG(review_rate), 1) AS average_rating
          FROM review
          WHERE product_idx = ? AND review_type = 'H' AND use_yn = 'Y'
        ) r ON H.hotel_idx = r.product_idx
        WHERE H.hotel_idx = ? AND H.hotel_status = 'Y'
      `

      try {
        const pool = getPool()
        const [hotelRows] = await pool.query(hotelSql, [locale, locale, locale, locale, locale, locale, locale, locale, locale, id, id])
        const hotel = hotelRows[0]

        if (!hotel) {
          return { success: false, error: 'Hotel not found' }
        }

        // 호텔 이미지 조회 쿼리
        const imagesSql = `
          SELECT
            image_url
          FROM hotel_image
          WHERE hotel_idx = ? AND use_yn = 'Y' AND main_yn = 'N' AND image_type = 'H'
          ORDER BY sort
        `
        const [imagesRows] = await pool.query(imagesSql, [id])
        hotel.images = imagesRows

        // 메인 이미지 조회 쿼리
        const mainImageSql = `
          SELECT
            image_url
          FROM hotel_image
          WHERE hotel_idx = ? AND use_yn = 'Y' AND main_yn = 'Y'
          LIMIT 1
        `
        const [mainImageRows] = await pool.query(mainImageSql, [id])
        hotel.main_image = mainImageRows.length > 0 ? mainImageRows[0].image_url : null

        // 호텔 시설 정보 조회 쿼리 (시설 타입별로 구분)
        const facilitiesSql = `
          SELECT
            HFT_name.text,
            HFT.facility_type
          FROM hotel H
          JOIN hotel_facility HF ON H.hotel_idx = HF.hotel_idx AND HF.use_yn = 'Y'
          JOIN hotel_facility_type HFT ON HF.hotel_facility_type_idx = HFT.hotel_facility_type_idx
          JOIN locale_text HFT_name ON HFT.hotel_facility_type_idx = HFT_name.target_idx 
            AND HFT_name.target_category = 'hotel_facility_type' 
            AND HFT_name.language = UPPER(?)
            AND HFT_name.use_yn = 'Y'
          WHERE H.hotel_idx = ?
        `
        const [facilitiesRows] = await pool.query(facilitiesSql, [locale, id])
        
        // 시설 타입별로 분류 (H: 호텔 시설, R: 객실 시설, E: 유료 옵션)
        const hotelFacilities: string[] = []
        const roomFacilities: string[] = []
        const extraOptions: string[] = []
        
        interface Facility {
          text: string;
          facility_type: 'H' | 'R' | 'E';
        }
        
        facilitiesRows.forEach((facility: Facility) => {
          switch(facility.facility_type) {
            case 'H':
              hotelFacilities.push(facility.text)
              break
            case 'R':
              roomFacilities.push(facility.text)
              break
            case 'E':
              extraOptions.push(facility.text)
              break
          }
        })
        
        // 시설 정보 추가
        hotel.hotel_facilities = hotelFacilities
        hotel.room_facilities = roomFacilities
        hotel.extra_options = extraOptions

        // 호텔 유료 서비스(부가서비스) 조회 쿼리
        // 호텔 유료 서비스(부가서비스) 조회 쿼리
        const paidServicesSql = `
          SELECT hotel_paid_service_idx, service_name, service_name_en, price
          FROM hotel_paid_service
          WHERE hotel_idx = ? AND use_yn = 'Y'
        `;
        const [paidServicesRows] = await pool.query(paidServicesSql, [id]);
        
        hotel.paid_services = paidServicesRows;

        const session = await getUserSession(event)
        const memberIdx = session?.user?.member_idx

        if(memberIdx){
          //wish check
          const wishCheckSql = `
            SELECT 
              IFNULL((SELECT wish_idx FROM wish WHERE wish_type = 'H' AND product_idx = ? AND member_idx = ? AND use_yn = 'Y' LIMIT 1), 0) AS wish_idx
          `
          const [wishCheck] = await pool.query(wishCheckSql, [id, memberIdx])
          hotel.is_wished = wishCheck[0].wish_idx > 0
          hotel.wish_idx = wishCheck[0].wish_idx
        }

        return { success: true, data: hotel }
      } catch (error) {
        const queryError = error as DatabaseError
        console.error('Query execution error:', queryError)
        return {
          success: false,
          error: 'Failed to fetch hotel details',
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
    console.error('Unexpected error in hotel API:', err)
    return {
      success: false,
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})
