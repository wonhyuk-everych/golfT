import { defineEventHandler } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'

interface DatabaseError {
  message: string;
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
}

interface ReservationMaster {
  reservation_idx: number;
  reservation_date: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  pay_type: string;
  total_price: number;
  original_price: number;
}

interface GolfCourseCartItem {
  reservation_golf_idx: number;
  reservation_idx: number;
  course_idx: number;
  name_kr: string;
  name_en: string;
  ImageUrl: string | null;
  reservation_date: string;
  golf_course_time: string;
  number_of_reservation: number;
  number_of_call_van: number;
  round_trip_yn: string;
  golfCourseSaleFee: number;
  caddySaleFee: number;
  cartSaleFee: number;
  callVanSaleFee: number;
  total_price: number;
  course_status: string;
}

interface HotelCartItem {
  reservation_hotel_idx: number;
  reservation_idx: number;
  hotel_idx: number;
  name_kr: string;
  name_en: string;
  ImageUrl: string | null;
  check_in_date: string;
  check_in_time: string;
  check_out_date: string;
  check_out_time: string;
  room_idx: number;
  room_name: string;
  room_name_en: string;
  bed_type: string;
  number_of_reservation: number;
  number_of_room: number;
  total_price: number;
  hotel_status: string;
}

interface CaddyCartItem {
  reservation_caddy_idx: number;
  reservation_idx: number;
  caddy_idx: number;
  course_idx: number;
  name: string;
  nick_name: string;
  caddy_code: string;
  name_kr: string;
  name_en: string;
  ImageUrl: string | null;
  reservation_date: string;
  golf_course_time: string;
  total_price: number;
}

interface CallVanCartItem {
  reservation_callvan_idx: number;
  reservation_idx: number;
  course_idx: number;
  round_trip_yn: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  pickup_location: string;
  dropoff_location: string;
  number_of_reservation: number;
  number_of_call_van: number;
  total_price: number;
}

interface TournamentCartItem {
  reservation_tournament_idx: number;
  reservation_idx: number;
  tournament_idx: number;
  title: string;
  ImageUrl: string | null;
  form_data: string;
  images: string;
  image_title: string;
  total_price: number;
}

interface Response {
  success: boolean;
  error?: string;
  details?: string;
  data?: {
    masterData: ReservationMaster;
    golfCourses: GolfCourseCartItem[];
    hotels: HotelCartItem[];
    caddies: CaddyCartItem[];
    callVans: CallVanCartItem[];
    tournaments: TournamentCartItem[];
  };
}

export default defineEventHandler(async (event): Promise<Response> => {
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
    const id = getRouterParam(event, 'id')

    const pool = getPool()
    
    try {
      const masterSql = `
        SELECT
            reservation_idx,
            reservation_date,
            member_idx,
            first_name,
            last_name,
            email,
            phone_number,
            pay_type,
            total_price,
            original_price
        FROM reservation_master 
        WHERE reservation_idx = ?
      `
      
      const masterResult = await pool.query(masterSql, [id])
      const masterData = masterResult[0][0]
      
      // Get golf courses in shopping cart
      const golfCourseSql = `
        SELECT
          SG.reservation_golf_idx,
          SG.reservation_idx,
          GC.name_kr,
          GC.name_en,
          GC.course_idx,
          (SELECT main_image_url FROM golf_course_image WHERE course_idx = GC.course_idx LIMIT 1) AS ImageUrl,
          SG.reservation_date,
          CASE
            WHEN SG.golf_price_type = 'weekday' THEN (SELECT start_time FROM golf_course_time_price CTP WHERE SG.golf_time_price_idx = CTP.golf_time_price_idx)
            ELSE (SELECT start_time FROM golf_course_exception_price CEP WHERE SG.golf_exception_price_idx = CEP.golf_exception_price_idx)
          END AS golf_course_time,
          SG.number_of_reservation,
          SG.round_trip_yn,
          SG.number_of_call_van,
          SG.car_type
        FROM reservation_golf SG
        JOIN golf_course GC ON SG.course_idx = GC.course_idx
        WHERE SG.reservation_idx = ?
      `
      
      // Get hotels in shopping cart
      const hotelSql = `
        SELECT
          SH.reservation_hotel_idx,
          SH.reservation_idx,
          H.hotel_idx,
          H.name_kr,
          H.name_en,
          (SELECT image_url FROM hotel_image WHERE hotel_idx = H.hotel_idx AND use_yn = 'Y' AND main_yn = 'Y' LIMIT 1) AS ImageUrl,
          SH.check_in_date,
          H.check_in AS check_in_time,
          SH.check_out_date,
          H.check_out AS check_out_time,
          HR.room_name,
          HR.room_name_en,
          SH.number_of_reservation,
          SH.number_of_room
        FROM reservation_hotel SH
        JOIN hotel H ON SH.hotel_idx = H.hotel_idx
        JOIN hotel_room HR ON SH.hotel_room_idx = HR.hotel_room_idx
        WHERE SH.reservation_idx = ?
      `
      
      // Get caddies in shopping cart
      const caddySql = `
        SELECT
          SC.reservation_caddy_idx,
          SC.reservation_idx,
          C.course_idx,
          C.name,
          C.nick_name,
          C.caddy_code,
          C.caddy_idx,
          GC.name_kr,
          GC.name_en,
          (SELECT image_url FROM caddy_image WHERE caddy_idx = C.caddy_idx AND main_yn = 'Y' LIMIT 1) AS ImageUrl,
          SC.reservation_date,
          SC.golf_course_time
        FROM reservation_caddy SC
        JOIN caddy C ON SC.caddy_idx = C.caddy_idx
        JOIN golf_course GC ON C.course_idx = GC.course_idx
        WHERE SC.reservation_idx = ?
      `
      
      // Get call vans in shopping cart
      const callVanSql = `
        SELECT
          SC.reservation_callvan_idx,
          SC.reservation_idx,
          course_idx,
          round_trip_yn,
          start_date,
          end_date,
          start_time,
          end_time,
          number_of_reservation,
          number_of_call_van
        FROM reservation_callvan SC
        WHERE SC.reservation_idx = ?
      `

      const callTournament = `
        SELECT
          RT.reservation_tournament_idx,
          RT.reservation_idx,
          RT.tournament_idx,
          T.title,
          (SELECT image_url FROM tournament_image WHERE tournament_idx = T.tournament_idx AND main_yn = 'Y' LIMIT 1) AS ImageUrl,
          RT.form_data,
          RT.images,
          T.image_title,
          RT.total_price
        FROM reservation_tournament RT
        JOIN tournament T ON RT.tournament_idx = T.tournament_idx
        WHERE RT.reservation_idx = ?
      `
      
      // Execute all queries in parallel for better performance
      const [golfCoursesResult, hotelsResult, caddiesResult, callVansResult, callTournamentResult] = await Promise.all([
        pool.query(golfCourseSql, [id]),
        pool.query(hotelSql, [id]),
        pool.query(caddySql, [id]),
        pool.query(callVanSql, [id]),
        pool.query(callTournament, [id])
      ])

      // Extract rows from results
      const golfCourses = golfCoursesResult[0]
      const hotels = hotelsResult[0]
      const caddies = caddiesResult[0]
      const callVans = callVansResult[0]
      const tournaments = callTournamentResult[0]
      
      return {
        success: true,
        data: {
          ReservationGolf: golfCourses as GolfCourseCartItem[],
          ReservationHotel: hotels as HotelCartItem[],
          ReservationCaddy: caddies as CaddyCartItem[],
          ReservationCallvan: callVans as CallVanCartItem[],
          ReservationTournament: tournaments as TournamentCartItem[],
          ReservationMaster: masterData as ReservationMaster
        }
      }
    } catch (error) {
      const queryError = error as DatabaseError
      console.error('Query execution error:', queryError)
      return {
        success: false,
        error: '예기치 않은 오류가 발생했습니다.',
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
