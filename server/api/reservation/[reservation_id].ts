import { defineEventHandler } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'

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
    const reservation_id = getRouterParam(event, 'reservation_id')
    const body = await readBody(event)
    const reservationType = body.reservationType

    const pool = getPool()
    let reservation: any = null;
    let option: any = null;

    if (reservationType === 'G') {
      const [rows]: any = await pool.query(
        `SELECT
          RG.reservation_golf_idx AS product_idx,
          DATE_FORMAT(RG.reservation_date, '%Y-%m-%d') AS reservation_date,
          RG.number_of_reservation AS number_of_reservation,
          (
          CASE
            WHEN RG.golf_price_type = 'weekday' THEN (SELECT start_time FROM golf_course_time_price CTP WHERE RG.golf_time_price_idx = CTP.golf_time_price_idx)
            ELSE (SELECT start_time FROM golf_course_exception_price CEP WHERE RG.golf_exception_price_idx = CEP.golf_exception_price_idx)
          END
          ) AS reservation_time,
          RG.golf_course_sale_fee,
          RG.cart_sale_fee,
          RG.caddy_sale_fee,
          RG.callvan_sale_fee,
          RG.number_of_call_van,
          GC.name_kr AS product_name,
          GC.name_en AS product_name_en,
          (SELECT main_image_url FROM golf_course_image WHERE course_idx = GC.course_idx LIMIT 1) AS image,
          RG.reservation_status,
          CONCAT(RM.first_name, ' ', RM.last_name) AS reservation_name,
          RM.phone_number,
          RM.pay_type,
          RM.email,
          RM.total_price,
          RM.original_price,
          RM.reservation_date AS payment_date,
          RG.car_type,
          RG.round_trip_yn,
          RG.dropoff_location,
          RG.pickup_location,
          RG.number_of_call_van
        FROM reservation_golf RG
        JOIN golf_course GC ON RG.course_idx = GC.course_idx
        JOIN reservation_master RM ON RG.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ? AND RG.reservation_golf_idx = ?`,
        [memberIdx, reservation_id]
      );
      reservation = rows[0];
    }

    if (reservationType === 'H') {
      const [rows]: any = await pool.query(
        `SELECT
          RH.reservation_hotel_idx AS product_idx,
          RH.check_in_date,
          RH.check_out_date,
          RH.number_of_reservation,
          RH.number_of_room,
          HR.room_name,
          HR.room_name_en,
          RH.adult,
          RH.children,
          RH.paid_services,
          HR.bed_type,
          H.hotel_idx,
          H.name_kr AS product_name,
          H.name_en AS product_name_en,
          (SELECT image_url FROM hotel_image WHERE H.hotel_idx = RH.hotel_idx AND use_yn = 'Y' AND main_yn = 'Y' LIMIT 1) AS image,
          RH.reservation_status,
          CONCAT(RM.first_name, ' ', RM.last_name) AS reservation_name,
          RM.phone_number,
          RM.pay_type,
          RM.email,
          RM.total_price,
          RM.original_price,
          RM.reservation_date AS payment_date
        FROM reservation_hotel RH
        JOIN hotel H ON H.hotel_idx = RH.hotel_idx
        JOIN hotel_room HR ON RH.hotel_room_idx = HR.hotel_room_idx
        JOIN reservation_master RM ON RH.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ? AND RH.reservation_hotel_idx = ?`,
        [memberIdx, reservation_id]
      );
      reservation = rows[0];

      if (reservation.paid_services) {
        const [serviceRows]: any = await pool.query(
          `SELECT hotel_paid_service_idx, service_name, service_name_en, price 
           FROM hotel_paid_service 
           WHERE hotel_paid_service_idx IN (${reservation.paid_services}) 
             AND hotel_idx = ? 
             AND use_yn = 'Y'`,
          [reservation.hotel_idx]
        );
        option = serviceRows;
      }
    }

    if (reservationType === 'C') {
      const [rows]: any = await pool.query(
        `SELECT
          RC.reservation_caddy_idx AS product_idx,
          RC.reservation_date,
          RC.reservation_status,
          C.name AS product_name,
          C.nick_name AS product_name_en,
          GC.name_kr,
          GC.name_en,
          (SELECT image_url FROM caddy_image WHERE C.caddy_idx = RC.caddy_idx AND main_yn = 'Y' LIMIT 1) AS image,
          CONCAT(RM.first_name, ' ', RM.last_name) AS reservation_name,
          RM.phone_number,
          RM.pay_type,
          RM.email,
          RM.total_price,
          RM.original_price,
          RM.reservation_date AS payment_date
        FROM reservation_caddy RC
        JOIN caddy C ON C.caddy_idx = RC.caddy_idx
        JOIN golf_course GC ON C.course_idx = GC.course_idx
        JOIN reservation_master RM ON RC.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ? AND RC.reservation_caddy_idx = ?`,
        [memberIdx, reservation_id]
      );
      reservation = rows[0];
    }

    if (reservationType === 'V') {
      const [rows]: any = await pool.query(
        `SELECT
          RC.reservation_callvan_idx AS product_idx,
          RC.start_date AS reservation_date,
          RC.start_date,
          RC.end_date,
          RC.start_time,
          RC.end_time,
          RC.round_trip_yn,
          RC.number_of_reservation,
          RC.number_of_call_van,
          RC.dropoff_location,
          RC.pickup_location,
          GC.name_kr AS product_name,
          GC.name_en AS product_name_en,
          RC.reservation_status,
          CONCAT(RM.first_name, ' ', RM.last_name) AS reservation_name,
          RM.phone_number,
          RM.pay_type,
          RM.email,
          RM.total_price,
          RM.original_price,
          RM.reservation_date AS payment_date
        FROM reservation_callvan RC
        JOIN golf_course GC ON RC.course_idx = GC.course_idx
        JOIN reservation_master RM ON RC.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ? AND RC.reservation_callvan_idx = ?`,
        [memberIdx, reservation_id]
      );
      reservation = rows[0];
    }

    if (reservationType === 'T') {
      const [rows]: any = await pool.query(
        `SELECT
          RT.reservation_tournament_idx AS product_idx,
          (SELECT image_url FROM tournament_image WHERE tournament_idx = RT.tournament_idx AND main_yn = 'Y' LIMIT 1) AS image,
          T.title AS product_name,
          T.title_en AS product_name_en,
          RT.form_data,
          RT.reservation_status,
          RT.images,
          T.image_title
        FROM reservation_tournament RT
        JOIN tournament T ON T.tournament_idx = RT.tournament_idx
        WHERE RT.member_idx = ? AND RT.reservation_tournament_idx = ?`,
        [memberIdx, reservation_id]
      );
      reservation = rows[0];
    }

    return {
      success: true,
      data: reservation,
      option: option
    }

    
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return {
      success: false,
      error: 'Failed to fetch reservation.'
    }
  }
})