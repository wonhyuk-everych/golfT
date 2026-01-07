import { readBody } from 'h3';
import { getPool } from '~/server/utils/db'
import { parseKoreanDate } from '~/utils/formatters'

interface Room {
  room_name: string;
  room_name_en: string;
  room_sale_price: number;
  room_image_url: string;
  room_images: Array<{ image_url: string }>;
  bed_type: string;
  view_type: string;
  refund_yn: string;
  breakfast_yn: string;
}

interface AddCartData {
  hotelIdx: number;
  room: Room;
  checkinDate: string;
  checkoutDate: string;
  roomCount: number;
  adult: number;
  children: number;
  nights: number;
  paidServices: string;
  finalPaymentAmount: number;
}

export default defineEventHandler(async (event) => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // 요청 본문 읽기
    const body = await readBody<AddCartData>(event);
    
    // 필수 필드 검증
    if (!body.hotelIdx || !body.room || !body.checkinDate || !body.checkoutDate || !body.roomCount || !body.adult || !body.nights) {
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
    
    //TODO 가격 한번 더 DB 에서 체크 로직 필요

    const query = `
      INSERT INTO shopping_cart_hotel (
        hotel_idx,
        member_idx,
        check_in_date,
        check_out_date,
        hotel_room_idx,
        number_of_room,
        number_of_reservation,
        adult,
        children,
        paid_services,
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
        ?,
        ?
      )
    `

    const [rows] = await connection.query(query, [
      body.hotelIdx,
      memberIdx,
      body.checkinDate,
      body.checkoutDate,
      body.room.hotel_room_idx,
      body.roomCount,
      body.nights,
      body.adult,
      body.children,
      body.paidServices,
      body.finalPaymentAmount,
    ])

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
