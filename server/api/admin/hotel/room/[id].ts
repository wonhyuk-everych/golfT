import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { getPool } from '~/server/utils/db'

// 호텔 객실 수정 API
export default defineEventHandler(async (event) => {
  // PUT 메소드만 허용
  if (event.method !== 'PUT') {
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
    
    // 룸 ID 가져오기
    const roomId = getRouterParam(event, 'id')
    
    if (!roomId) {
      throw createError({
        statusCode: 400,
        message: '객실 ID가 필요합니다.'
      })
    }
    
    // 필수 필드 검증
    if (!body.roomName || body.roomProductPrice === undefined || body.roomSalePrice === undefined) {
      throw createError({
        statusCode: 400,
        message: '필수 정보가 누락되었습니다.'
      })
    }

    const pool = getPool()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // 객실 정보 업데이트
      await connection.query(
        `UPDATE hotel_room SET
          room_name = ?,
          room_name_en = ?,
          room_product_price = ?,
          room_sale_price = ?,
          view_type = ?,
          bed_type = ?,
          adult = ?,
          children = ?,
          breakfast_yn = ?,
          use_yn = ?,
          updated_member_idx = ?,
          updated_at = NOW()
        WHERE hotel_room_idx = ?`,
        [
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
          updatedMemberIdx,
          roomId
        ]
      )

      // 이미지 정보가 제공된 경우 이미지 정보 업데이트
      if (body.roomImages && Array.isArray(body.roomImages)) {
        // 기존 이미지 정보 조회
        const [existingImages] = await connection.query(
          `SELECT 
            hotel_image_idx as hotelRoomImageIdx,
            image_url
          FROM hotel_image 
          WHERE hotel_room_idx = ?`,
          [roomId]
        )
        
        // 기존 이미지 ID 맵 생성
        const existingImageMap = new Map()
        existingImages.forEach(img => {
          existingImageMap.set(img.hotelRoomImageIdx, img.image_url)
        })
        
        // 이미지 업데이트 또는 삽입
        for (const image of body.roomImages) {
          if (image.hotelRoomImageIdx && existingImageMap.has(image.hotelRoomImageIdx)) {
            // 기존 이미지 업데이트
            await connection.query(
              `UPDATE hotel_image SET
                image_url = ?,
                sort = ?,
                main_yn = ?,
                use_yn = ?,
                updated_member_idx = ?,
                updated_at = NOW()
              WHERE hotel_image_idx = ?`,
              [
                image.image_url,
                image.sort || 0,
                image.main_yn || 'N',
                image.use_yn || 'Y',
                updatedMemberIdx,
                image.hotelRoomImageIdx
              ]
            )
            
            // 처리된 이미지 맵에서 제거
            existingImageMap.delete(image.hotelRoomImageIdx)
          } else {
            // 새 이미지 삽입
            await connection.query(
              `INSERT INTO hotel_image (
                hotel_idx,
                hotel_room_idx,
                image_url,
                image_type,
                sort,
                main_yn,
                use_yn,
                created_member_idx,
                updated_member_idx
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                body.hotelIdx,
                roomId,
                image.image_url,
                'R',
                image.sort || 0,
                image.main_yn || 'N',
                image.use_yn || 'Y',
                updatedMemberIdx,
                updatedMemberIdx
              ]
            )
          }
        }
        
        // 남은 이미지들은 use_yn = 'N'으로 설정 (삭제 대신 비활성화)
        if (existingImageMap.size > 0) {
          const remainingImageIds = Array.from(existingImageMap.keys())
          await connection.query(
            `UPDATE hotel_image SET
              use_yn = 'N',
              updated_member_idx = ?,
              updated_at = NOW()
            WHERE hotel_image_idx IN (?)`,
            [updatedMemberIdx, remainingImageIds]
          )
        }
      }
      
      await connection.commit()

      // 업데이트된 객실 정보 조회
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
          hotel_image_idx as hotelRoomImageIdx,
          image_url as imageUrl,
          sort,
          main_yn as mainYn,
          use_yn as useYn
        FROM hotel_image
        WHERE hotel_room_idx = ? AND use_yn = 'Y'
        ORDER BY main_yn DESC, sort ASC`,
        [roomId]
      )

      const room = roomRows[0]
      if (imageRows.length > 0) {
        room.roomImages = imageRows
        
        // 메인 이미지가 있으면 roomImageUrl 설정
        const mainImage = imageRows.find(img => img.mainYn === 'Y')
        if (mainImage) {
          room.roomImageUrl = mainImage.imageUrl
        } else {
          room.roomImageUrl = imageRows[0].imageUrl
        }
      }

      return { success: true, room }
    } catch (error) {
      await connection.rollback()
      console.error('Error updating hotel room:', error)
      throw createError({
        statusCode: 500,
        message: '객실 수정 중 오류가 발생했습니다.'
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error in hotel room update API:', error)
    throw error
  }
})
