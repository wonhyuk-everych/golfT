import { defineEventHandler, readBody, createError } from 'h3'
import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

interface HotelImage {
  imageUrl: string;
  imageType: string;
  sort: number;
  mainYn: string;
  useYn: string;
}

interface HotelFacility {
  facilityTypeCode: string;
  facilityCode: string;
  useYn: string;
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

interface CreateHotelRequest {
  nameKr: string;
  nameEn: string;
  countryCode: string;
  cityCode: string;
  checkIn: number;
  checkOut: number;
  address: string;
  homePage: string;
  hotelStatus: string;
  payInfo?: string;
  refundInfo?: string;
  serviceInfo?: string;
  payCautionCheckImageUrl?: string;
  images?: HotelImage[];
  facilities?: HotelFacility[];
  localeTexts?: Record<string, HotelLocaleText>;
}

export default defineEventHandler(async (event: H3Event) => {
  // Get authenticated user session
  const session = await getUserSession(event)
  
  // Check if user is authenticated and has admin role
  if (session?.user?.role != 'A') {
    throw createError({
      statusCode: 401,
      message: '인증되지 않은 사용자입니다.'
    })
  }

  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: '허용되지 않는 메소드입니다.'
    })
  }

  const body = await readBody(event) as CreateHotelRequest
  
  // Validation
  if (!body.nameKr) {
    throw createError({
      statusCode: 400,
      message: '호텔 이름(한글)은 필수 입력 사항입니다.'
    })
  }

  if (!body.nameEn) {
    throw createError({
      statusCode: 400,
      message: '호텔 이름(영문)은 필수 입력 사항입니다.'
    })
  }

  if (!body.countryCode) {
    throw createError({
      statusCode: 400,
      message: '국가 코드는 필수 입력 사항입니다.'
    })
  }

  if (!body.cityCode) {
    throw createError({
      statusCode: 400,
      message: '도시 코드는 필수 입력 사항입니다.'
    })
  }

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // Use authenticated member_idx from session
    const createdMemberIdx = session.user.member_idx

    // Insert into hotel table
    const insertHotelQuery = `
      INSERT INTO hotel (
        name_kr, 
        name_en, 
        country_code, 
        city_code, 
        check_in, 
        check_out, 
        address, 
        home_page, 
        hotel_status, 
        created_member_idx, 
        updated_member_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      body.hotelStatus || 'Y', // Default to Y if not provided
      createdMemberIdx,
      createdMemberIdx
    ]

    const [hotelResult] = await connection.query(insertHotelQuery, hotelValues)
    const hotelIdx = hotelResult.insertId

    // Insert into hotel_info table for Korean
    const insertHotelInfoKrQuery = `
      INSERT INTO hotel_info (
        hotel_idx, 
        language, 
        pay_info, 
        refund_info, 
        service_info, 
        pay_caution_check_image_url, 
        created_member_idx, 
        updated_member_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    const hotelInfoKrValues = [
      hotelIdx,
      'KR',
      body.payInfo || '',
      body.refundInfo || '',
      body.serviceInfo || '',
      body.payCautionCheckImageUrl || '',
      createdMemberIdx,
      createdMemberIdx
    ]

    await connection.query(insertHotelInfoKrQuery, hotelInfoKrValues)

    // Insert into hotel_info table for English
    const insertHotelInfoEnQuery = `
      INSERT INTO hotel_info (
        hotel_idx, 
        language, 
        pay_info, 
        refund_info, 
        service_info, 
        pay_caution_check_image_url, 
        created_member_idx, 
        updated_member_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    const hotelInfoEnValues = [
      hotelIdx,
      'EN',
      body.payInfo || '',
      body.refundInfo || '',
      body.serviceInfo || '',
      body.payCautionCheckImageUrl || '',
      createdMemberIdx,
      createdMemberIdx
    ]

    await connection.query(insertHotelInfoEnQuery, hotelInfoEnValues)

    // Insert hotel facilities
    if (body.facilities && body.facilities.length > 0) {
      const insertFacilityQuery = `
        INSERT INTO hotel_facility (
          hotel_idx,
          hotel_facility_type_idx,
          use_yn,
          created_member_idx,
          updated_member_idx
        ) VALUES (?, ?, ?, ?, ?)
      `

      for (const facility of body.facilities) {
        await connection.query(insertFacilityQuery, [
          hotelIdx,
          facility.facilityCode,
          facility.useYn || 'Y',
          createdMemberIdx,
          createdMemberIdx
        ])
      }
    }

    // Insert hotel images
    if (body.images && body.images.length > 0) {
      const insertImageQuery = `
        INSERT INTO hotel_image (
          hotel_idx,
          image_url,
          image_type,
          sort,
          main_yn,
          use_yn,
          created_member_idx,
          updated_member_idx
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `

      for (const image of body.images) {
        await connection.query(insertImageQuery, [
          hotelIdx,
          image.imageUrl,
          'H',
          image.sort || 0,
          image.mainYn || 'N',
          image.useYn || 'Y',
          createdMemberIdx,
          createdMemberIdx
        ])
      }
    }

    // Insert locale texts
    if (body.localeTexts) {
      const languages = Object.keys(body.localeTexts)
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

      const insertLocaleTextQuery = `
        INSERT INTO locale_text (
          target_idx,
          target_category,
          language,
          text,
          long_text,
          use_yn,
          created_member_idx,
          updated_member_idx
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `

      for (const language of languages) {
        const localeText = body.localeTexts[language]
        if (!localeText) continue

        for (const field of localeFields) {
          const value = localeText[field.field as keyof HotelLocaleText]
          if (value !== undefined) {
            await connection.query(insertLocaleTextQuery, [
              hotelIdx,
              field.category,
              language,
              field.column === 'text' ? value : '',
              field.column === 'long_text' ? value : '',
              'Y',
              createdMemberIdx,
              createdMemberIdx
            ])
          }
        }
      }
    }

    await connection.commit()

    return {
      success: true,
      message: '호텔이 성공적으로 생성되었습니다.',
      hotelIdx
    }
  } catch (error: any) {
    await connection.rollback()
    console.error('Error creating hotel:', error)

    throw createError({
      statusCode: 500,
      message: error.message || '호텔 생성 중 오류가 발생했습니다.'
    })
  } finally {
    connection.release()
  }
})
