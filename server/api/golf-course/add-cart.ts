import { readBody } from 'h3';
import { getPool } from '~/server/utils/db'

interface AddCartData {
  courseId: number;
  courseName: string;
  date: string;
  time: string;
  golferCount: number;
  monthlyPriceIdx: number;
  timePriceIdx: number;
  priceType: string;
  vanReservation: {
    carCount: number;
    pickupLocation?: string;
    dropoffLocation?: string;
    carType?: string;
    numberOfCallVan?: number;
    roundTripYn?: string;
  };
}

export default defineEventHandler(async (event) => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // 요청 본문 읽기
    const body = await readBody<AddCartData>(event);
    
    // 필수 필드 검증
    if (!body.courseId || !body.date || !body.time || !body.golferCount) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: '필수 정보가 누락되었습니다.'
        })
      };
    }
    
    // 현재는 예시로 성공 응답만 반환
    console.log('장바구니 추가 정보 수신:', body);

    const session = await getUserSession(event)
    const memberIdx = session.user.member_idx

    if (!memberIdx) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: '로그인이 필요합니다.'
        })
      }
    } 

    //TODO callvan 가격
    const query = `
      INSERT INTO shopping_cart_golf (
        course_idx,
        member_idx,
        reservation_date,
        golf_course_time,
        number_of_reservation,
        number_of_call_van,
        round_trip_yn,
        car_type,
        pickup_location,
        dropoff_location,
        golf_monthly_price_idx,
        golf_time_price_idx,
        golf_exception_price_idx,
        golf_price_type
      )
      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `

    const [rows] = await connection.query(query, [
      body.courseId,
      memberIdx,
      body.date,
      body.time,
      body.golferCount,
      body.vanReservation.carCount,
      body.vanReservation.roundTripYn,
      body.vanReservation.carType,
      body.vanReservation.pickupLocation,
      body.vanReservation.dropoffLocation,
      body.monthlyPriceIdx,
      body.priceType === 'weekday' ? body.timePriceIdx : null,
      body.priceType === 'exception' ? body.timePriceIdx : null,
      body.priceType
    ])

    /**
    if(body.vanReservation.carCount > 0){
      const callvanQuery = `
        INSERT INTO shopping_cart_callvan (
          course_idx,
          member_idx,
          car_type,
          start_date,
          pickup_location,
          dropoff_location,
          number_of_reservation,
          number_of_call_van,
          round_trip_yn,
          total_price
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
      `

      await connection.query(callvanQuery, [
        body.courseId,
        memberIdx,
        body.vanReservation.carType,
        body.vanReservation.pickupDate,
        body.vanReservation.pickupLocation,
        body.vanReservation.dropoffLocation,
        body.golferCount,
        body.vanReservation.carCount,
        body.van.roundTrip ? 'Y' : 'N',
        body.vanReservation.vanFee
      ])
    }
    */
    await connection.commit()
    
    // 성공 응답
    return {
      success: true,
      message: '장바구니에 추가되었습니다.',
      data: {
        cartId: rows.insertId,
        ...body
      }
    };
    
  } catch (error) {
    console.error('장바구니 추가 중 오류 발생:', error);
    await connection.rollback()
    // 오류 응답
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      })
    };
  }
})
