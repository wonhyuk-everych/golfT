import { defineEventHandler, readBody } from 'h3'
import { getPool } from '~/server/utils/db'
import { FtpUtils } from '~/utils/ftpUtils'

export default defineEventHandler(async (event) => {
  //session 에 저장된 정보를 불러 온다
  const session = await getUserSession(event)
  const memberIdx = session?.user?.member_idx
  if (!memberIdx) {
    return {
      success: false,
      code: '0',
      message: '로그인이 필요합니다.'
    }
  }

  const pool = getPool()
  const connection = await pool.getConnection()
  try {
    const payResult = await readBody(event)
    const paymentKey = payResult.paymentKey

    
    const data = await useStorage('paymentSession').getItem(`session:${payResult.orderId}`)

    //캐시 삭제
    await useStorage('paymentSession').removeItem(`session:${payResult.orderId}`)

    const body = data?.body
    const orderId = data?.orderId

    if(payResult.orderId !== orderId && payResult.amount !== body?.finalPaymentAmount){
      return {
        success: false,
        code: '0',
        message: '결제 정보가 일치하지 않습니다.'
      }
    }

    //결제 승인하기
    const config = useRuntimeConfig(event)
    const encodedSecretKey = Buffer.from(`${config.tossPaymentsSecretKey}:`).toString('base64')

    const tossResponse = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: body.finalPaymentAmount,
        orderId: orderId,
        currency: 'KRW'
      })
    })

    // 응답 데이터 파싱
    const tossData = await tossResponse.json()
    const payType = tossData.method
    
    await connection.beginTransaction()

    await connection.query(
      `INSERT INTO payment_log (
        order_id, member_idx, payment_request, payment_result
      ) VALUES (?, ?, ?, ?)`,
      [orderId, memberIdx, JSON.stringify(body), JSON.stringify(tossData)]
    )

    // 예약번호 생성
    const reservationIdx = orderId
    const now = new Date() // 최신 로컬타임 사용

    // HTTP 상태 코드 확인 또는 응답 내 에러 확인
    if (!tossResponse.ok || tossData.code) {
      await connection.commit()
      return {
        success: false,
        code: tossData.code || '0',
        message: tossData.message || '결제 승인에 실패했습니다.'
      }
    }

    if (tossData.status !== 'DONE') {
      await connection.commit()
      return {
        success: false,
        code: '0',
        message: '결제 승인에 실패했습니다.'
      }
    }

    // reservation_master insert
    await connection.query(
      `INSERT INTO reservation_master (
        reservation_idx, toss_payment_key, pay_type, member_idx, total_price, original_price, reservation_date, first_name, last_name, email, phone_number, result_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [reservationIdx, paymentKey, payType, memberIdx, body.finalPaymentAmount || 0, body.finalPaymentAmount || 0, now, body.firstName, body.lastName, body.email, body.phoneNumber, JSON.stringify(tossData)]
    )

    // 골프장 예약
    if (body.reservationGolf?.length) {
      for (const item of body.reservationGolf) {
        await connection.query(
          `INSERT INTO reservation_golf (
            reservation_idx, course_idx, member_idx, reservation_date, number_of_reservation, number_of_call_van, round_trip_yn,
            golf_course_sale_fee, cart_sale_fee, caddy_sale_fee, callvan_sale_fee, total_price, car_type, pickup_location, dropoff_location,
            golf_monthly_price_idx, golf_time_price_idx, golf_exception_price_idx, golf_price_type
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            reservationIdx,
            item.courseIdx,
            memberIdx,
            item.reservationDate,
            item.numberOfReservation,
            item.numberOfCallVan,
            item.roundTripYn,
            item.golfCourseSaleFee,
            item.cartSaleFee,
            item.caddySaleFee,
            item.callVanSaleFee,
            item.finalPaymentAmount,
            item.carType,
            item.pickupLocation,
            item.dropoffLocation,
            item.monthlyPriceIdx,
            item.priceType === 'weekday' ? item.timePriceIdx : null,
            item.priceType === 'exception' ? item.timePriceIdx : null,
            item.priceType
          ]
        )

        if(item.shoppingCartGolfIdx && item.shoppingCartGolfIdx > 0){
          await connection.query(
            `UPDATE shopping_cart_golf SET use_yn = 'N' WHERE shopping_cart_golf_idx = ?`,
            [item.shoppingCartGolfIdx]
          )
        }
      }
    }

    // 호텔 예약
    if (body.reservationHotel?.length) {
      for (const item of body.reservationHotel) {
        await connection.query(
          `INSERT INTO reservation_hotel (
              reservation_idx, hotel_idx, member_idx, check_in_date, check_out_date, hotel_room_idx, 
              number_of_room, number_of_reservation, adult, children, paid_services, total_price
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            reservationIdx,
            item.hotelIdx,
            memberIdx,
            item.checkInDate,
            item.checkOutDate,
            item.roomIdx,
            item.roomCount,
            (item.adult + item.children),
            item.adult,
            item.children,
            item.paidServices,
            item.finalPaymentAmount
          ]
        )

        if(item.shoppingCartHotelIdx && item.shoppingCartHotelIdx > 0){
          await connection.query(
            `UPDATE shopping_cart_hotel SET use_yn = 'N' WHERE shopping_cart_hotel_idx = ?`,
            [item.shoppingCartHotelIdx]
          )
        }
      }
    }

    // 콜밴 예약
    if (body.reservationCallvan?.length) {
      for (const item of body.reservationCallvan) {
        await connection.query(
          `INSERT INTO reservation_callvan (
            reservation_idx, course_idx, member_idx, car_type, start_date, start_time, pickup_location, dropoff_location, end_date, end_time, round_trip_yn, number_of_reservation, number_of_call_van, total_price
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            reservationIdx,
            item.courseIdx,
            memberIdx,
            item.carType,
            item.startDate,
            item.startTime,
            item.pickupLocation,
            item.dropoffLocation,
            item.endDate || null,
            item.endTime || null,
            item.roundTripYn,
            item.numberOfReservation,
            item.numberOfCallVan,
            item.finalPaymentAmount
          ]
        )

        if(item.shoppingCartCallvanIdx && item.shoppingCartCallvanIdx > 0){
          await connection.query(
            `UPDATE shopping_cart_callvan SET use_yn = 'N' WHERE shopping_cart_callvan_idx = ?`,
            [item.shoppingCartCallvanIdx]
          )
        }
      }
    }

    // 캐디 예약
    if (body.reservationCaddy?.length) {
      for (const item of body.reservationCaddy) {
        await connection.query(
          `INSERT INTO reservation_caddy (
            reservation_idx, caddy_idx, course_idx, member_idx, reservation_date, golf_course_time, total_price
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            reservationIdx,
            item.caddyIdx,
            item.courseIdx,
            memberIdx,
            item.reservationDate,
            parseInt(item.golfCourseTime),
            item.finalPaymentAmount
          ]
        )

        if(item.shoppingCartCaddyIdx && item.shoppingCartCaddyIdx > 0){
          await connection.query(
            `UPDATE shopping_cart_caddy SET use_yn = 'N' WHERE shopping_cart_caddy_idx = ?`,
            [item.shoppingCartCaddyIdx]
          )
        }
      }
    }

    //대회 예약
    if (body.reservationTournament?.length) {
      for (const item of body.reservationTournament) {

        let imageFiles = ''
        if(Array.isArray(item.images) && item.images.length > 0){
          // 파일 업로드 - base64 문자열을 Buffer로 변환
          const fileToBuffer = (file: string): Buffer => {
            // base64 데이터에서 실제 데이터 부분만 추출 (data:image/jpeg;base64, 같은 prefix 제거)
            const base64Data = file.split(',')[1] || '';
            return Buffer.from(base64Data, 'base64');
          };
          
          const filesWithBuffer = item.images.map((file: string) => ({
            buffer: fileToBuffer(file),
            originalname: file,
            mimetype: 'image/jpeg',
          }));
          
          const ftp = new FtpUtils()
          const userHash = await ftp.sha256Hash('user_' + memberIdx)
          const imageUrls = await ftp.uploadFilesFromBuffer(filesWithBuffer, `tournament/${item.tournamentIdx}/users/${userHash}`)
    
          //파일 경로를 쉼표로 구분하여 문자열로 변환
          imageFiles = imageUrls.join(',')
        }else{
          imageFiles = item.images
        }

        await connection.query(
          `INSERT INTO reservation_tournament (
          reservation_idx,
          tournament_idx,
          member_idx,
          form_data,
          images,
          total_price
          )
          VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
          )`,
          [
            reservationIdx,
            item.tournamentIdx,
            memberIdx,
            JSON.stringify(item.formData),
            imageFiles,
            item.finalPaymentAmount
          ]
        )

        if(item.shoppingCartTournamentIdx && item.shoppingCartTournamentIdx > 0){
          await connection.query(
            `UPDATE shopping_cart_tournament SET use_yn = 'N' WHERE shopping_cart_tournament_idx = ?`,
            [item.shoppingCartTournamentIdx]
          )
        }
      }
    }

    await connection.commit()
    return {
      success: true,
      reservation_idx: reservationIdx,
      message: '예약이 완료되었습니다.'
    }
  } catch (error) {
    await connection.rollback()
    console.error(error)
    return {
      success: false,
      code: '0',
      message: '예약 처리 중 오류가 발생했습니다.'
    }
  } finally {
    connection.release()
  }
})

