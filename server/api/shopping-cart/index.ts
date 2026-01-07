import { defineEventHandler } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { calculatePriceWithRate, setExchangeRate } = useExchangeRate()

interface DatabaseError {
  message: string;
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
}

export interface GolfCourseCartItem {
  shopping_cart_golf_idx: number;
  course_idx: number;
  name_kr: string;
  name_en: string;
  Image_url: string | null;
  reservation_date: string;
  golf_course_time: string;
  number_of_reservation: number;
  number_of_call_van: number;
  round_trip_yn: string;
  golf_course_sale_fee: number;
  caddy_sale_fee: number;
  cart_sale_fee: number;
  callvan_sale_fee: number;
  course_status: string;
  car_type: string;
  pickup_location: string;
  dropoff_location: string;
  total_price?: number;
  golf_monthly_price_idx: number;
  golf_time_price_idx: number;
  golf_price_type: string;
}

export interface HotelCartItem {
  shopping_cart_hotel_idx: number;
  hotel_idx: number;
  name_kr: string;
  name_en: string;
  Image_url: string | null;
  check_in_date: string;
  check_in_time: string;
  check_out_date: string;
  check_out_time: string;
  room_idx: number;
  room_name: string;
  room_name_en: string;
  bed_type: string;
  adult: number;
  children: number;
  piad_services: string;
  number_of_reservation: number;
  number_of_room: number;
  total_price: number;
  hotel_status: string;
}

export interface CaddyCartItem {
  shopping_cart_caddy_idx: number;
  caddy_idx: number;
  course_idx: number;
  name: string;
  nick_name: string;
  caddy_code: string;
  name_kr: string;
  name_en: string;
  Image_url: string | null;
  reservation_date: string;
  golf_course_time: string;
  total_price: number;
}

export interface TournamentCartItem {
  shopping_cart_tournament_idx: number;
  tournament_idx: number;
  title: string;
  image_url: string | null;
  price: number;
  image_use_yn: string;
  image_title: string;
  images: string[];
  form_data: string;
}

interface ShoppingCartResponse {
  success: boolean;
  error?: string;
  details?: string;
  data?: {
    golfCourses: GolfCourseCartItem[];
    hotels: HotelCartItem[];
    caddies: CaddyCartItem[];
    tournaments: TournamentCartItem[];
    bartExchangeRate: number;
  };
}

export default defineEventHandler(async (event): Promise<ShoppingCartResponse> => {
  try {
    const session = await getUserSession(event)
    
    if(!session?.user?.member_idx) {
      return {
        success: false,
        error: '인증되지 않은 사용자입니다.'
      }
    }

    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const memberIdx = session.user.member_idx

    const pool = getPool()
    
    try {
      // Get golf courses in shopping cart
      const golfCourseSql = `
        SELECT
          SG.shopping_cart_golf_idx,
          GC.name_kr,
          GC.name_en,
          GC.course_idx,
          (SELECT main_image_url FROM golf_course_image GI WHERE GI.course_idx = GC.course_idx LIMIT 1) AS Image_url,
          SG.reservation_date,
          CASE
            WHEN SG.golf_price_type = 'weekday' THEN (SELECT start_time FROM golf_course_time_price CTP WHERE SG.golf_time_price_idx = CTP.golf_time_price_idx)
            ELSE (SELECT start_time FROM golf_course_exception_price CEP WHERE SG.golf_exception_price_idx = CEP.golf_exception_price_idx)
          END AS golf_course_time,
          SG.number_of_reservation,
          SG.number_of_call_van,
          SG.round_trip_yn,
          (
            CASE
              WHEN SG.golf_price_type = 'weekday' THEN (SELECT price FROM golf_course_time_price CTP WHERE SG.golf_time_price_idx = CTP.golf_time_price_idx)
              ELSE (SELECT price FROM golf_course_exception_price CEP WHERE SG.golf_exception_price_idx = CEP.golf_exception_price_idx)
            END
          ) AS golf_course_sale_fee,
          GCMP.caddy_sale_fee AS caddy_sale_fee,
          GCMP.cart_sale_fee AS cart_sale_fee,
          (
            CASE
                WHEN SG.car_type = 'VAN' AND SG.round_trip_yn = 'Y' THEN GCMP.call_van_round_trip_fee
                WHEN SG.car_type = 'VAN' AND SG.round_trip_yn = 'N' THEN GCMP.call_van_one_way_fee
                WHEN SG.car_type = 'SUV' AND SG.round_trip_yn = 'Y' THEN GCMP.call_suv_round_trip_fee
                WHEN SG.car_type = 'SUV' AND SG.round_trip_yn = 'N' THEN GCMP.call_suv_one_way_fee
                ELSE 0
            END
          ) AS callvan_sale_fee,
          GC.course_status,
          SG.car_type,
          SG.pickup_location,
          SG.dropoff_location,
          SG.golf_monthly_price_idx,
          (
            CASE WHEN SG.golf_price_type = 'weekday' THEN SG.golf_time_price_idx
            ELSE SG.golf_exception_price_idx
            END
          )AS golf_time_price_idx,
          SG.golf_price_type
        FROM shopping_cart_golf SG
        JOIN golf_course GC ON SG.course_idx = GC.course_idx
        JOIN golf_course_monthly_price GCMP on SG.golf_monthly_price_idx = GCMP.golf_monthly_price_idx
        WHERE SG.member_idx = ? AND SG.use_yn = 'Y' AND SG.reservation_date >= NOW()
      `
      
      // Get hotels in shopping cart
      const hotelSql = `
        SELECT
          SH.shopping_cart_hotel_idx,
          H.hotel_idx,
          H.name_kr,
          H.name_en,
          (SELECT image_url FROM hotel_image WHERE hotel_idx = H.hotel_idx AND use_yn = 'Y' LIMIT 1) AS Image_url,
          SH.check_in_date,
          H.check_in AS check_in_time,
          SH.check_out_date,
          H.check_out AS check_out_time,
          SH.hotel_room_idx AS room_idx,
          HR.room_name,
          HR.room_name_en,
          HR.bed_type,
          SH.number_of_reservation,
          SH.number_of_room,
          SH.adult,
          SH.children,
          SH.paid_services,
          SH.total_price,
          H.hotel_status
        FROM shopping_cart_hotel SH
        JOIN hotel H ON SH.hotel_idx = H.hotel_idx
        JOIN hotel_room HR ON SH.hotel_room_idx = HR.hotel_room_idx
        WHERE SH.member_idx = ? AND SH.use_yn = 'Y' AND SH.check_in_date >= NOW()
      `
      
      // Get caddies in shopping cart
      const caddySql = `
        SELECT
          SC.shopping_cart_caddy_idx,
          C.course_idx,
          C.name,
          C.nick_name,
          C.caddy_code,
          C.caddy_idx,
          GC.name_kr,
          GC.name_en,
          (SELECT image_url FROM caddy_image WHERE caddy_idx = C.caddy_idx AND use_yn = 'Y' ORDER BY main_yn DESC, sort ASC LIMIT 1) AS Image_url,
          SC.reservation_date,
          SC.golf_course_time,
          SC.total_price
        FROM shopping_cart_caddy SC
        JOIN caddy C ON SC.caddy_idx = C.caddy_idx
        JOIN golf_course GC ON C.course_idx = GC.course_idx
        WHERE SC.member_idx = ? AND SC.use_yn = 'Y'
      `
      
      // Get tournaments in shopping cart
      const tournamentSql = `
        SELECT
          sct.shopping_cart_tournament_idx,
          T.tournament_idx,
          T.title,
          (SELECT image_url FROM tournament_image WHERE tournament_idx = T.tournament_idx AND main_yn = 'Y' LIMIT 1) AS image_url,
          T.price,
          T.image_use_yn,
          T.image_title,
          sct.images,
          sct.form_data
        FROM tournament T
        LEFT JOIN shopping_cart_tournament sct ON T.tournament_idx = sct.tournament_idx
        WHERE sct.member_idx = ? AND sct.use_yn = 'Y'
      `
      
      // Execute all queries in parallel for better performance
      const [golfCoursesResult, hotelsResult, caddiesResult, tournamentsResult] = await Promise.all([
        pool.query(golfCourseSql, [memberIdx]),
        pool.query(hotelSql, [memberIdx]),
        pool.query(caddySql, [memberIdx]),
        pool.query(tournamentSql, [memberIdx])
      ])

      const bartExchangeRate = await pool.query(`SELECT bart_exchange_rate FROM bart_exchange_rate ORDER BY bart_exchange_rate_idx DESC LIMIT 1`)
      const bartRateRows = bartExchangeRate[0] as Array<{ bart_exchange_rate: number }>
      const bartRate = bartRateRows?.[0]?.bart_exchange_rate ?? 0
      setExchangeRate(bartRate)
      
      // Extract rows from results
      const golfCourses = golfCoursesResult[0] as GolfCourseCartItem[]
      const hotels = hotelsResult[0] as HotelCartItem[]
      const caddies = caddiesResult[0] as CaddyCartItem[]
      const tournaments = tournamentsResult[0] as TournamentCartItem[]
      
      // Calculate total_price for each golf course
      if (golfCourses && Array.isArray(golfCourses)) {
        golfCourses.forEach(course => {
          const total_price = (
            course.golf_course_sale_fee * course.number_of_reservation +
            course.caddy_sale_fee * course.number_of_reservation +
            course.cart_sale_fee * course.number_of_reservation +
            course.callvan_sale_fee * course.number_of_call_van
          )
          course.total_price = calculatePriceWithRate(total_price)
        })
      }
      
      return {
        success: true,
        data: {
          golfCourses,
          hotels,
          caddies,
          tournaments,
          bartExchangeRate: bartRate
        }
      }
    } catch (error) {
      const queryError = error as DatabaseError
      console.error('Query execution error:', queryError)
      return {
        success: false,
        error: '장바구니 정보를 가져오는데 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? queryError.message : undefined
      }
    }
  } catch (error) {
    const err = error as Error
    console.error('Unexpected error in shopping cart API:', err)
    return {
      success: false,
      error: '예기치 않은 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})
