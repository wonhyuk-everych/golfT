import { defineEventHandler, readBody, createError } from 'h3'
import { getPool } from '~/server/utils/db'

// 호텔 객실 생성 API
export default defineEventHandler(async (event) => {
  // POST 메소드만 허용
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: '허용되지 않는 메소드입니다.'
    })
  }

  try {
    // 인증된 사용자 세션 확인
    const session = await getUserSession(event)
      
    // Check if user is authenticated
    if (session?.user?.role != 'A') {
      throw createError({
        statusCode: 401,
        message: '인증되지 않은 사용자입니다.'
      })
    }

    // Use authenticated member_idx from session
    const updatedMemberIdx = session.user.member_idx

    // 요청 본문 파싱
    const body = await readBody(event)
    
    // 필수 필드 검증
    if (!body.hotelIdx || !body.roomName || body.roomProductPrice === undefined || body.roomSalePrice === undefined) {
      throw createError({
        statusCode: 400,
        message: '필수 정보가 누락되었습니다.'
      })
    }

    const pool = getPool()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 객실 추가
      const [result] = await connection.query(
        `INSERT INTO hotel_room (
          hotel_idx, 
          room_name, 
          room_name_en, 
          room_product_price, 
          room_sale_price, 
          view_type, 
          bed_type, 
          adult,
          children,
          breakfast_yn, 
          use_yn, 
          created_member_idx
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          body.hotelIdx,
          body.roomName,
          body.roomNameEn || '',
          body.roomProductPrice,
          body.roomSalePrice,
          body.viewType || '',
          body.bedType || '',
          body.adult ?? 0,
          body.children ?? 0,
          body.breakfastYn || 'N',
          body.useYn || 'Y',
          updatedMemberIdx
        ]
      )

      const roomId = result.insertId

      // 이미지 정보가 제공된 경우 이미지 정보 추가
      if (body.roomImages && Array.isArray(body.roomImages) && body.roomImages.length > 0) {
        // 이미지 배치 삽입을 위한 값 준비
        const imageValues = body.roomImages.map((img, index) => [
          body.hotelIdx,          // hotel_idx
          roomId,                // hotel_room_idx
          img.image_url,         // image_url
          'R',                   // image_type
          img.sort || index,     // sort (순서)
          updatedMemberIdx,      // created_member_idx
          updatedMemberIdx       // updated_member_idx
        ])
        
        // 배치 삽입 쿼리 실행
        await connection.query(
          `INSERT INTO hotel_image (
            hotel_idx,
            hotel_room_idx,
            image_url,
            image_type,
            sort,
            created_member_idx,
            updated_member_idx
          ) VALUES ?`,
          [imageValues]
        )
      }
      
      await connection.commit()

      // 생성된 객실 정보 조회
      const [roomRows] = await connection.query(
        `SELECT 
          hr.hotel_room_idx as hotelRoomIdx,
          hr.hotel_idx as hotelIdx,
          hr.room_name as roomName,
          hr.room_name_en as roomNameEn,
          hr.room_product_price as roomProductPrice,
          hr.room_sale_price as roomSalePrice,
          hr.view_type as viewType,
          hr.bed_type as bedType,
          hr.adult as adult,
          hr.children as children,
          hr.breakfast_yn as breakfastYn,
          hr.use_yn as useYn
        FROM hotel_room hr
        WHERE hr.hotel_room_idx = ?`,
        [roomId]
      )

      // 객실 이미지 조회
      const [imageRows] = await connection.query(
        `SELECT
          image_url as imageUrl
        FROM hotel_image
        WHERE hotel_room_idx = ? AND use_yn = 'Y'
        ORDER BY main_yn DESC, sort ASC`,
        [roomId]
      )

      const room = roomRows[0]
      if (imageRows.length > 0) {
        room.roomImages = imageRows
      }

      return { success: true, room }
    } catch (error) {
      await connection.rollback()
      console.error('Error creating hotel room:', error)
      throw createError({
        statusCode: 500,
        message: '객실 생성 중 오류가 발생했습니다.'
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error in hotel room API:', error)
    throw error
  }
})
