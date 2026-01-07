import { defineEventHandler, readBody } from 'h3'
import { getPool } from '~/server/utils/db'

// 주문 ID 생성 함수
const generateOrderId = () => {
  return `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const pool = getPool()

  try {

    console.log('=== 결제 체크 API 호출 ===')
    console.log('예약자 정보:', body.firstName, body.lastName, body.email, body.phoneNumber)
    console.log('환율:', body.bartExchangeRate)
    console.log('호텔:', body.reservationHotel)
    console.log('골프장:', body.reservationGolf)
    console.log('콜밴:', body.reservationCallvan)
    console.log('캐디:', body.reservationCaddy)
    console.log('대회:', body.reservationTournament)
    console.log('최종 결제금액:', body.finalPaymentAmount)

    // 검증 결과 에러 메시지 저장
    const errors: string[] = [];

    // 오늘 날짜 (yyyy-mm-dd, 시간 무시)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if(body.reservationHotel.length !== 0){
      //호텔
      //1. 체크인, 체크 아웃 날짜가 오늘 날짜 이후인지 확인
      if (Array.isArray(body.reservationHotel)) {
        for (const hotel of body.reservationHotel) {
          const checkInDate = new Date(hotel.checkInDate);
          const checkOutDate = new Date(hotel.checkOutDate);
          if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            errors.push(`[호텔] 올바르지 않은 날짜 형식: ${hotel.checkInDate}, ${hotel.checkOutDate}`);
          } else {
            if (checkInDate < today) {
              errors.push(`[호텔] 체크인 날짜가 오늘 이전입니다: ${hotel.checkInDate}`);
            }
            if (checkOutDate <= checkInDate) {
              errors.push(`[호텔] 체크아웃 날짜가 체크인 날짜와 같거나 이전입니다: ${hotel.checkOutDate}`);
            }
          }
        }
      }

      //2. 호텔이 정상적으로 운용 되고 있는 호텔 인지 확인
      for (const hotel of body.reservationHotel) {
        // 1. 호텔이 정상적으로 운용 되고 있는 호텔 인지 확인 & 가격 체크
        try {
          const query = `
            SELECT room_sale_price FROM hotel_room WHERE hotel_room_idx = ? AND hotel_idx = ? AND use_yn = 'Y'
          `;
          const [rows] = await pool.query(query, [hotel.roomIdx, hotel.hotelIdx]);
          if ((rows as Array<any>).length === 0) {
            errors.push('[호텔] 정상적인 호텔이 아닙니다');
          }
        } catch (error) {
          console.error('Error fetching hotel:', error);
          throw error;
        }

      }
    }
    

    //골프장
    if(body.reservationGolf.length !== 0){
      //1. 예약 날짜가 오늘 날짜 이후 인지 확인
      if (Array.isArray(body.reservationGolf)) {
        for (const golf of body.reservationGolf) {
          const reservationDate = new Date(golf.reservationDate);
          if (isNaN(reservationDate.getTime())) {
            errors.push(`[골프장] 올바르지 않은 예약 날짜 형식: ${golf.reservationDate}`);
          } else {
            if (reservationDate < today) {
              errors.push(`[골프장] 예약 날짜가 오늘 이전입니다: ${golf.reservationDate}`);
            }
          }
        }
      }

      //2. 골프장이 정상적으로 운용 되고 있는 골프장 인지 확인
      for (const golf of body.reservationGolf) {
        // 2. 골프장이 정상적으로 운용 되고 있는 골프장 인지 확인
        try {
          const query = `
            SELECT COUNT(*) AS count FROM golf_course WHERE course_idx = ? AND course_status = 'Y' AND booking_status = 'Y'
          `;
          const [rows] = await pool.query(query, [golf.courseIdx]);
          if ((rows as Array<{ count: number }>)[0].count === 0) {
            errors.push('[골프장] 정상적인 골프장이 아닙니다');
          }
        } catch (error) {
          console.error('Error fetching golf course:', error);
          throw error;
        }

        // 3. 가격 체크
        /*try {
          const query = `
            SELECT weekday_green_sale_fee, weekend_green_sale_fee FROM golf_course_price WHERE course_idx = ?;
          `;
          const [rows] = await pool.query(query, [golf.courseIdx]);
          if ((rows as Array<any>).length === 0) {
            errors.push('[골프장] 정상적인 골프장이 아닙니다');
          } else {
            const price = (rows as Array<{ weekday_green_sale_fee: number, weekend_green_sale_fee: number }>)[0];
            if ((price.weekday_green_sale_fee * golf.numberOfReservation) !== golf.golfCourseSaleFee &&
              (price.weekend_green_sale_fee * golf.numberOfReservation) !== golf.golfCourseSaleFee) {
              errors.push('[골프장] 가격이 일치하지 않습니다');
            }
          }
        } catch (error) {
          console.error('Error fetching golf course:', error);
          throw error;
        }*/
      }
    }
    
    // 대회
    if(body.reservationTournament.length !== 0){
      
      for(const tournament of body.reservationTournament){
        try {
          //1.가격이 정상적인 대회인지 확인
          const query = `
            SELECT price FROM tournament WHERE tournament_idx = ? AND tournament_status = 'Y'
          `;
          const [rows] = await pool.query(query, [tournament.tournamentIdx]);
          if ((rows as Array<any>).length === 0) {
            errors.push('[대회] 정상적인 대회가 아닙니다');
          } else {
            const tournamentPrice = (rows as Array<{ price: number }>)[0];
            if (tournamentPrice.price !== tournament.finalPaymentAmount) {
              errors.push('[캐디] 가격이 일치하지 않습니다');
            }
          }
        } catch (error) {
          console.error('Error fetching caddy:', error);
          throw error;
        }
      }
    }

    //캐디
    if(body.reservationCaddy.length !== 0){
      //1. 정상적으로 운용 되고 있는 캐디 인지 확인
      for (const caddy of body.reservationCaddy) {
        // 1. 정상적으로 운용 되고 있는 캐디 인지 확인 및 가격 체크
        try {
          const query = `
            SELECT price FROM caddy WHERE caddy_idx = ?;
          `;
          const [rows] = await pool.query(query, [caddy.caddyIdx]);
          if ((rows as Array<any>).length === 0) {
            errors.push('[캐디] 정상적인 캐디가 아닙니다');
          } else {
            const caddyPrice = (rows as Array<{ price: number }>)[0];
            if (caddyPrice.price !== caddy.finalPaymentAmount) {
              errors.push('[캐디] 가격이 일치하지 않습니다');
            }
          }
        } catch (error) {
          console.error('Error fetching caddy:', error);
          throw error;
        }
      }
    }

    //최종 결제금액
    //1. 환율이 정상적인지 확인
    try {
      const query = `
        SELECT bart_exchange_rate FROM bart_exchange_rate ORDER BY bart_exchange_rate_idx DESC LIMIT 1;
      `;
      const [rows] = await pool.query(query);
      const bartRate = rows[0].bart_exchange_rate;
      if (bartRate <= 0) {
        errors.push('[최종 결제금액] 환율이 정상적인 값이 아닙니다');
      }
    } catch (error) {
      errors.push('[최종 결제금액] 환율이 정상적인 값이 아닙니다');
      throw error;
    }

    //2. 최종 합계 가격이 맞는지 확인
    const totalAmount = body.reservationHotel.reduce((acc: number, hotel: any) => acc + hotel.finalPaymentAmount, 0) +
      body.reservationGolf.reduce((acc: number, golf: any) => acc + golf.finalPaymentAmount, 0) +
      body.reservationCallvan.reduce((acc: number, callvan: any) => acc + callvan.finalPaymentAmount, 0) +
      body.reservationCaddy.reduce((acc: number, caddy: any) => acc + caddy.finalPaymentAmount, 0) +
      body.reservationTournament.reduce((acc: number, tournament: any) => acc + tournament.finalPaymentAmount, 0);

    if (totalAmount !== body.finalPaymentAmount) {
      errors.push('[최종 결제금액] 최종 합계 가격이 일치하지 않습니다');
    }

    if(errors.length > 0) {
      return {
        success: false,
        message: errors.join('\n')
      }
    }

    // 주문 ID 생성
    const orderId = generateOrderId()

    // 세션에 body 값과 orderId 저장
    const paymentData = {
      body,
      orderId
    }
    await useStorage('paymentSession').setItem(`session:${orderId}`, paymentData)

    console.log('세션에 결제 정보 저장 완료:', orderId)

    return {
      success: true,
      message: '품목별 결제 체크 완료',
      orderId: orderId
    }
  } catch (error) {
    console.error('Error in payment check API:', error)
    return {
      success: false,
      message: '품목별 결제 체크 중 오류가 발생했습니다.'
    }
  }
})

