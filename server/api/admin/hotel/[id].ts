import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

interface HotelRoom {
  hotelRoomIdx: number;
  roomName: string;
  roomNameEn: string;
  roomProductPrice: number;
  roomSalePrice: number;
  refundYn: string;
  viewType: string;
  bedType: string;
  adult: number;
  children: number;
  breakfastYn: string;
  useYn: string;
  roomImages?: {imageUrl: string, sort: number, mainYn: string}[]
}

interface HotelFacility {
  hotelFacilityIdx: number;
  facilityType: string;
  facilityName: string;
}

interface HotelImage {
  hotelImageIdx: number;
  imageUrl: string;
  imageType: string;
  sort: number;
  mainYn: string;
}

interface HotelLocaleText {
  explain?: string;
  explainShort?: string;
  tour?: string;
  transportation?: string;
  language?: string;
  roomType?: string;
  roomFacility?: string;
  extraCharge?: string;
  caution?: string;
}

interface Hotel {
  hotelIdx: number;
  nameKr: string;
  nameEn: string;
  countryCode: string;
  cityCode: string;
  checkIn: number;
  checkOut: number;
  address: string;
  homePage: string;
  hotelStatus: string;
  createdAt: string;
  updatedAt: string;
  payInfo: string;
  refundInfo: string;
  serviceInfo: string;
  payCautionCheckImageUrl: string;
  localeTexts?: Record<string, HotelLocaleText>;
}

export default defineEventHandler(async (event: H3Event): Promise<{ hotel: Hotel & { rooms: HotelRoom[], facilities: HotelFacility[], images: HotelImage[] } }> => {
  const hotelId = getRouterParam(event, 'id')

  if (!hotelId) {
    throw createError({
      statusCode: 400,
      message: '호텔 ID가 필요합니다.'
    })
  }

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT
        H.hotel_idx as hotelIdx,
        H.name_kr as nameKr,
        H.name_en as nameEn,
        H.country_code as countryCode,
        H.city_code as cityCode,
        H.check_in as checkIn,
        H.check_out as checkOut,
        H.address,
        H.home_page as homePage,
        H.hotel_status as hotelStatus,
        H.created_at as createdAt,
        H.updated_at as updatedAt,
        HI_KR.pay_info as payInfo,
        HI_KR.refund_info as refundInfo,
        HI_KR.service_info as serviceInfo,
        HI_KR.pay_caution_check_image_url as payCautionCheckImageUrl,
        'KO' as language,
        IFNULL(explain_hotel.long_text, '') as explainText,
        IFNULL(explain_short.text, '') as explainShortText,
        IFNULL(hotel_tour.long_text, '') as tourText,
        IFNULL(hotel_transportation.long_text, '') as transportationText,
        IFNULL(hotel_language.long_text, '') as languageText,
        IFNULL(room_type.long_text, '') as roomTypeText,
        IFNULL(room_facility.long_text, '') as roomFacilityText,
        IFNULL(extra_charge.long_text, '') as extraChargeText,
        IFNULL(caution.long_text, '') as cautionText
      FROM hotel H
      LEFT JOIN hotel_info HI_KR ON H.hotel_idx = HI_KR.hotel_idx AND HI_KR.language = 'KR'
      LEFT JOIN locale_text explain_hotel ON H.hotel_idx = explain_hotel.target_idx AND explain_hotel.target_category = 'hotel.explain' AND explain_hotel.language = 'KO' AND explain_hotel.use_yn = 'Y'
      LEFT JOIN locale_text explain_short ON H.hotel_idx = explain_short.target_idx AND explain_short.target_category = 'hotel.explain_short' AND explain_short.language = 'KO' AND explain_short.use_yn = 'Y'
      LEFT JOIN locale_text hotel_tour ON H.hotel_idx = hotel_tour.target_idx AND hotel_tour.target_category = 'hotel.tour' AND hotel_tour.language = 'KO' AND hotel_tour.use_yn = 'Y'
      LEFT JOIN locale_text hotel_transportation ON H.hotel_idx = hotel_transportation.target_idx AND hotel_transportation.target_category = 'hotel.transportation' AND hotel_transportation.language = 'KO' AND hotel_transportation.use_yn = 'Y'
      LEFT JOIN locale_text hotel_language ON H.hotel_idx = hotel_language.target_idx AND hotel_language.target_category = 'hotel.language' AND hotel_language.language = 'KO' AND hotel_language.use_yn = 'Y'
      LEFT JOIN locale_text room_type ON H.hotel_idx = room_type.target_idx AND room_type.target_category = 'hotel.room_type' AND room_type.language = 'KO' AND room_type.use_yn = 'Y'
      LEFT JOIN locale_text room_facility ON H.hotel_idx = room_facility.target_idx AND room_facility.target_category = 'hotel.room_facility' AND room_facility.language = 'KO' AND room_facility.use_yn = 'Y'
      LEFT JOIN locale_text extra_charge ON H.hotel_idx = extra_charge.target_idx AND extra_charge.target_category = 'hotel.extra_charge' AND extra_charge.language = 'KO' AND extra_charge.use_yn = 'Y'
      LEFT JOIN locale_text caution ON H.hotel_idx = caution.target_idx AND caution.target_category = 'hotel.caution' AND caution.language = 'KO' AND caution.use_yn = 'Y'
      WHERE H.hotel_idx = ?
      LIMIT 1
    `
    
    const queryEn = `
      SELECT
        H.hotel_idx as hotelIdx,
        'EN' as language,
        IFNULL(explain_hotel.long_text, '') as explainText,
        IFNULL(explain_short.text, '') as explainShortText,
        IFNULL(hotel_tour.long_text, '') as tourText,
        IFNULL(hotel_transportation.long_text, '') as transportationText,
        IFNULL(hotel_language.long_text, '') as languageText,
        IFNULL(room_type.long_text, '') as roomTypeText,
        IFNULL(room_facility.long_text, '') as roomFacilityText,
        IFNULL(extra_charge.long_text, '') as extraChargeText,
        IFNULL(caution.long_text, '') as cautionText
      FROM hotel H
      LEFT JOIN locale_text explain_hotel ON H.hotel_idx = explain_hotel.target_idx AND explain_hotel.target_category = 'hotel.explain' AND explain_hotel.language = 'EN' AND explain_hotel.use_yn = 'Y'
      LEFT JOIN locale_text explain_short ON H.hotel_idx = explain_short.target_idx AND explain_short.target_category = 'hotel.explain_short' AND explain_short.language = 'EN' AND explain_short.use_yn = 'Y'
      LEFT JOIN locale_text hotel_tour ON H.hotel_idx = hotel_tour.target_idx AND hotel_tour.target_category = 'hotel.tour' AND hotel_tour.language = 'EN' AND hotel_tour.use_yn = 'Y'
      LEFT JOIN locale_text hotel_transportation ON H.hotel_idx = hotel_transportation.target_idx AND hotel_transportation.target_category = 'hotel.transportation' AND hotel_transportation.language = 'EN' AND hotel_transportation.use_yn = 'Y'
      LEFT JOIN locale_text hotel_language ON H.hotel_idx = hotel_language.target_idx AND hotel_language.target_category = 'hotel.language' AND hotel_language.language = 'EN' AND hotel_language.use_yn = 'Y'
      LEFT JOIN locale_text room_type ON H.hotel_idx = room_type.target_idx AND room_type.target_category = 'hotel.room_type' AND room_type.language = 'EN' AND room_type.use_yn = 'Y'
      LEFT JOIN locale_text room_facility ON H.hotel_idx = room_facility.target_idx AND room_facility.target_category = 'hotel.room_facility' AND room_facility.language = 'EN' AND room_facility.use_yn = 'Y'
      LEFT JOIN locale_text extra_charge ON H.hotel_idx = extra_charge.target_idx AND extra_charge.target_category = 'hotel.extra_charge' AND extra_charge.language = 'EN' AND extra_charge.use_yn = 'Y'
      LEFT JOIN locale_text caution ON H.hotel_idx = caution.target_idx AND caution.target_category = 'hotel.caution' AND caution.language = 'EN' AND caution.use_yn = 'Y'
      WHERE H.hotel_idx = ?
      LIMIT 1
    `

    const roomsQuery = `
      SELECT
        hotel_room_idx as hotelRoomIdx,
        room_name as roomName,
        room_name_en as roomNameEn,
        room_product_price as roomProductPrice,
        room_sale_price as roomSalePrice,
        refund_yn as refundYn,
        view_type as viewType,
        bed_type as bedType,
        adult,
        children,
        breakfast_yn as breakfastYn,
        use_yn as useYn
      FROM hotel_room
      WHERE hotel_idx = ?
      ORDER BY hotel_room_idx ASC
    `

    const imagesQuery = `
      SELECT
        hotel_image_idx as hotelImageIdx,
        image_url as imageUrl,
        image_type as imageType,
        sort,
        main_yn as mainYn
      FROM hotel_image
      WHERE hotel_idx = ? AND image_type = 'H' AND use_yn = 'Y'
      ORDER BY sort ASC, created_at DESC
    `

    const roomImagesQuery = `
      SELECT
        image_url as imageUrl,
        sort,
        main_yn as mainYn
      FROM hotel_image HI
      WHERE HI.hotel_idx = ? AND HI.hotel_room_idx = ? AND HI.use_yn = 'Y'
      ORDER BY HI.sort
    `

    const facilitiesQuery = `
      SELECT
        HF.hotel_facility_type_idx as hotel_facility_type_idx,
        HFT_name.text as facility_name,
        HFT.facility_type as facility_type
      FROM hotel H
      JOIN hotel_facility HF ON H.hotel_idx = HF.hotel_idx AND HF.use_yn = 'Y'
      JOIN hotel_facility_type HFT ON HF.hotel_facility_type_idx = HFT.hotel_facility_type_idx
      JOIN locale_text HFT_name ON HFT.hotel_facility_type_idx = HFT_name.target_idx 
        AND HFT_name.target_category = 'hotel_facility_type' 
        AND HFT_name.language = UPPER('KO')
        AND HFT_name.use_yn = 'Y'
      WHERE H.hotel_idx = ?
      ORDER BY HFT.facility_type, HF.hotel_facility_type_idx
    `

    if (event.method === 'GET') {
      const [hotelRows] = await connection.query(query, [hotelId])
      const [hotelEnRows] = await connection.query(queryEn, [hotelId])
      const [roomRows] = await connection.query(roomsQuery, [hotelId])
      const [imageRows] = await connection.query(imagesQuery, [hotelId])
      const [facilitiesRows] = await connection.query(facilitiesQuery, [hotelId])
      
      const hotels = hotelRows as Hotel[]
      interface LocaleTextRow {
        hotelIdx: number;
        language: string;
        explainText?: string;
        explainShortText?: string;
        tourText?: string;
        transportationText?: string;
        languageText?: string;
        roomTypeText?: string;
        roomFacilityText?: string;
        extraChargeText?: string;
        cautionText?: string;
      }
      
      const hotelEnData = hotelEnRows as LocaleTextRow[]
      const rooms = roomRows as HotelRoom[]
      const images = imageRows as HotelImage[]
      
      // Fetch room images for each room
      for (const room of rooms) {
        const [roomImageRows] = await connection.query(roomImagesQuery, [hotelId, room.hotelRoomIdx])
        room.roomImages = roomImageRows as {imageUrl: string, sort: number, mainYn: string}[]
      }
      
      // Organize locale texts by language
      if (hotels.length > 0) {
        hotels[0].localeTexts = {
          KO: {
            explain: hotels[0].explainText,
            explainShort: hotels[0].explainShortText,
            tour: hotels[0].tourText,
            transportation: hotels[0].transportationText,
            language: hotels[0].languageText,
            roomType: hotels[0].roomTypeText,
            roomFacility: hotels[0].roomFacilityText,
            extraCharge: hotels[0].extraChargeText,
            caution: hotels[0].cautionText
          }
        }
        
        // Add English locale texts if available
        if (hotelEnData.length > 0) {
          hotels[0].localeTexts.EN = {
            explain: hotelEnData[0].explainText,
            explainShort: hotelEnData[0].explainShortText,
            tour: hotelEnData[0].tourText,
            transportation: hotelEnData[0].transportationText,
            language: hotelEnData[0].languageText,
            roomType: hotelEnData[0].roomTypeText,
            roomFacility: hotelEnData[0].roomFacilityText,
            extraCharge: hotelEnData[0].extraChargeText,
            caution: hotelEnData[0].cautionText
          }
        }
        
        // Remove the individual locale text fields from the hotel object
        delete hotels[0].explainText
        delete hotels[0].explainShortText
        delete hotels[0].tourText
        delete hotels[0].transportationText
        delete hotels[0].languageText
        delete hotels[0].roomTypeText
        delete hotels[0].roomFacilityText
        delete hotels[0].extraChargeText
        delete hotels[0].cautionText
        delete hotels[0].language

      }

      // 시설 타입별로 분류 (H: 호텔 시설, R: 객실 시설, E: 유료 옵션)
      const hotelFacilities: Facility[] = []
      const roomFacilities: Facility[] = []
      const extraOptions: Facility[] = []
      
      // 시설 타입별로 분류
      interface Facility {
        hotel_facility_type_idx: number;
        facility_name: string;
        facility_type: 'H' | 'R' | 'E';
      }
      
      facilitiesRows.forEach((facility: Facility) => {
        switch(facility.facility_type) {
          case 'H':
            hotelFacilities.push(facility)
            break
          case 'R':
            roomFacilities.push(facility)
            break
          case 'E':
            extraOptions.push(facility)
            break
        }
      })
      
      // 시설 정보 추가
      hotels[0].hotel_facilities = hotelFacilities
      hotels[0].room_facilities = roomFacilities
      hotels[0].extra_options = extraOptions


      if (hotels.length === 0) {
        throw createError({
          statusCode: 404,
          message: '호텔을 찾을 수 없습니다.'
        })
      }

      return {
        hotel: {
          ...hotels[0],
          rooms,
          images
        }
      }
    } else if (event.method === 'PUT') {
      // Get authenticated user session
      const session = await getUserSession(event)
      
      // Check if user is authenticated
      if (session?.user?.role != 'A') {
        throw createError({
          statusCode: 401,
          message: '인증되지 않은 사용자입니다.'
        })
      }
      
      const body = await readBody(event)
      
      // Use authenticated member_idx from session
      const updatedMemberIdx = session.user.member_idx

      // Update hotel table
      const hotelUpdateQuery = `
        UPDATE hotel SET
          name_kr = ?,
          name_en = ?,
          country_code = ?,
          city_code = ?,
          check_in = ?,
          check_out = ?,
          address = ?,
          home_page = ?,
          hotel_status = ?,
          updated_member_idx = ?
        WHERE hotel_idx = ?
      `

      const hotelValues = [
        body.nameKr,
        body.nameEn,
        body.countryCode,
        body.cityCode,
        body.checkIn,
        body.checkOut,
        body.address,
        body.homePage,
        body.hotelStatus,
        updatedMemberIdx,
        hotelId
      ]

      await connection.query(hotelUpdateQuery, hotelValues)

      // Update hotel_info table for Korean
      const hotelInfoKrUpdateQuery = `
        UPDATE hotel_info SET
          pay_info = ?,
          refund_info = ?,
          service_info = ?,
          pay_caution_check_image_url = ?,
          updated_member_idx = ?
        WHERE hotel_idx = ? AND language = 'KR'
      `

      const hotelInfoKrValues = [
        body.payInfo,
        body.refundInfo,
        body.serviceInfo,
        body.payCautionCheckImageUrl,
        updatedMemberIdx,
        hotelId
      ]

      await connection.query(hotelInfoKrUpdateQuery, hotelInfoKrValues)

      // Update hotel_info table for English
      const hotelInfoEnUpdateQuery = `
        UPDATE hotel_info SET
          pay_info = ?,
          refund_info = ?,
          service_info = ?,
          pay_caution_check_image_url = ?,
          updated_member_idx = ?
        WHERE hotel_idx = ? AND language = 'EN'
      `

      const hotelInfoEnValues = [
        body.payInfoEn,
        body.refundInfoEn,
        body.serviceInfoEn,
        body.payCautionCheckImageUrl,
        updatedMemberIdx,
        hotelId
      ]

      await connection.query(hotelInfoEnUpdateQuery, hotelInfoEnValues)

      // Handle facility updates if provided
      if (body.facilities && Array.isArray(body.facilities)) {
        // First, set all existing facilities to not used
        await connection.query(
          'UPDATE hotel_facility SET use_yn = "N", updated_member_idx = ? WHERE hotel_idx = ?',
          [updatedMemberIdx, hotelId]
        )

        // Then insert or update facilities
        for (const facility of body.facilities) {
          const facilityUpsertQuery = `
            INSERT INTO hotel_facility (
              hotel_idx,
              hotel_facility_type_idx,
              use_yn,
              created_member_idx,
              updated_member_idx
            ) VALUES (?, ?, 'Y', ?, ?)
            ON DUPLICATE KEY UPDATE
              use_yn = 'Y',
              updated_member_idx = ?
          `

          const facilityValues = [
            hotelId,
            facility.facilityCode,
            updatedMemberIdx,
            updatedMemberIdx,
            updatedMemberIdx
          ]

          await connection.query(facilityUpsertQuery, facilityValues)
        }
      }
      
      // Handle multilingual information updates
      if (body.localeTexts) {
        const languages = ['KO', 'EN']
        const localeFields = [
          { field: 'explain', column: 'long_text', category: 'hotel.explain' },
          { field: 'explainShort', column: 'text', category: 'hotel.explain_short' },
          { field: 'tour', column: 'long_text', category: 'hotel.tour' },
          { field: 'transportation', column: 'long_text', category: 'hotel.transportation' },
          { field: 'language', column: 'long_text', category: 'hotel.language' },
          { field: 'roomType', column: 'long_text', category: 'hotel.room_type' },
          { field: 'roomFacility', column: 'long_text', category: 'hotel.room_facility' },
          { field: 'extraCharge', column: 'long_text', category: 'hotel.extra_charge' },
          { field: 'caution', column: 'long_text', category: 'hotel.caution' }
        ]

        for (const lang of languages) {
          if (body.localeTexts[lang]) {
            for (const fieldInfo of localeFields) {
              const { field, column, category } = fieldInfo
              const value = body.localeTexts[lang][field]
              
              if (value !== undefined) {
                // Check if data exists
                const [countResult] = await connection.query(
                  'SELECT COUNT(*) as count FROM locale_text WHERE target_idx = ? AND target_category = ? AND language = ?',
                  [hotelId, category, lang]
                )
                
                const count = countResult[0].count
                
                if (count > 0) {
                  // Update existing record
                  await connection.query(
                    `UPDATE locale_text SET ${column} = ?, updated_member_idx = ?, use_yn = 'Y' WHERE target_idx = ? AND target_category = ? AND language = ?`,
                    [value, updatedMemberIdx, hotelId, category, lang]
                  )
                } else {
                  // Insert new record
                  await connection.query(
                    `INSERT INTO locale_text (target_idx, target_category, language, ${column}, created_member_idx) VALUES (?, ?, ?, ?, ?)`,
                    [hotelId, category, lang, value, updatedMemberIdx]
                  )
                }
              }
            }
          }
        }
      }

      // 이미지 처리 (event 이미지 방식 참고)
      if (body.images && body.images.length > 0) {
        // 기존 이미지 삭제
        await connection.query(
          `DELETE FROM hotel_image WHERE hotel_idx = ? AND image_type = 'H'`,
          [hotelId]
        );

        // 새 이미지 삽입: useYn === 'N' 인 항목 제외
        const filteredImages = (body.images as { imageUrl: string; sort: number; mainYn: string; useYn?: string }[])
          .filter(img => img.useYn !== 'N');
        if (filteredImages.length > 0) {
          const imageValues = filteredImages.map(img => [
            hotelId,
            img.imageUrl,
            'H',
            img.sort,
            img.mainYn,
            updatedMemberIdx,
            updatedMemberIdx
          ]);

          await connection.query(
            `INSERT INTO hotel_image (
              hotel_idx,
              image_url,
              image_type,
              sort,
              main_yn,
              created_member_idx,
              updated_member_idx
            ) VALUES ?`,
            [imageValues]
          );
        }
      }

      return {
        hotel: {
          hotelIdx: parseInt(hotelId),
          ...body,
          rooms: body.rooms || [],
          facilities: body.facilities || [],
          images: body.images || []
        }
      }
    } else {
      throw createError({
        statusCode: 405,
        message: '허용되지 않는 메소드입니다.'
      })
    }
  } catch (error) {
    console.error('Hotel API Error:', error)
    throw createError({
      statusCode: 500,
      message: '서버 오류가 발생했습니다.'
    })
  } finally {
    connection.release()
  }
})
