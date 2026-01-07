import { readBody } from 'h3';
import { getPool } from '~/server/utils/db'
import { parseKoreanDate } from '~/utils/formatters'

interface AddCartData {
  caddyIdx: number;
  totalPrice: number;
}

export default defineEventHandler(async (event) => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // 요청 본문 읽기
    const body = await readBody<AddCartData>(event);
    
    // 필수 필드 검증
    if (!body.caddyIdx || !body.totalPrice) {
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

    const query = `
      INSERT INTO shopping_cart_caddy (
        caddy_idx,
        member_idx,
        reservation_date,
        golf_course_time,
        total_price,
        use_yn
      )
      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `

    const [rows] = await connection.query(query, [
      body.caddyIdx,
      memberIdx,
      parseKoreanDate('2025년6월25일 (수)').date,
      1,
      body.totalPrice,
      'Y'
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
