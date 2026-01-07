import { defineEventHandler, getRouterParam, createError, readBody } from 'h3'
import { H3Event } from 'h3'
import { GolfCourse } from '~/types/admin/course'
import { getPool } from '~/server/utils/db'

interface LocaleTextRow {
  language: string;
  caddyCovenants?: string;
  caddyRule?: string;
  rainCheck?: string;
  galleryFee?: string;
}

export default defineEventHandler(async (event: H3Event): Promise<{ course: GolfCourse & { extraImages: { imageUrl: string; imageType: string }[], facilities: { golf_facility_type_idx: number }[] } }> => {
  const courseId = getRouterParam(event, 'id')

  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: '골프장 ID가 필요합니다.'
    })
  }

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT
        c.course_idx as courseIdx,
        c.booking_status as bookingStatus,
        c.course_status as courseStatus,
        c.course_id as courseId,
        c.name_kr as nameKr,
        c.name_en as nameEn,
        c.country_code as countryCode,
        c.city_code as cityCode,
        c.hole_count as holeCount,
        c.round_start as roundStart,
        c.address,
        c.phone,
        c.website,
        c.promotion_url as promoUrl,
        c.description,
        c.nearest_airport as nearbyAirport,
        c.airport_time as airportTime,
        c.nearest_city as nearbyCity,
        c.city_time as cityTime,
        c.map_url as mapUrl,
        c.course_designer as courseDesigner,
        c.course_holes as courseHoles,
        c.course_par as coursePar,
        c.course_length as courseLength,
        c.fairway_info as fairwayInfo,
        c.green_info as greenInfo,
        c.single_play as singlePlay,
        c.single_play_date as singlePlayDate,
        c.double_play as doublePlay,
        c.double_play_date as doublePlayDate,
        c.created_at as createdAt,
        c.updated_at as updatedAt,
        p.weekday_green_fee as weekdayGreenFee,
        p.weekday_green_sale_fee as weekdayGreenSaleFee,
        p.weekend_green_fee as weekendGreenFee,
        p.weekend_green_sale_fee as weekendGreenSaleFee,
        p.caddy_fee as caddyFee,
        p.caddy_sale_fee as caddySaleFee,
        p.cart_fee as cartFee,
        p.cart_sale_fee as cartSaleFee,
        p.total_fee as totalFee,
        i.logo_url as logoUrl,
        i.main_image_url as mainImageUrl,
        i.course_image_url as courseImageUrl,
        i.clubhouse_image_url as clubhouseImageUrl,
        i.restaurant_image_url as restaurantImageUrl,
        i.shelter_image_url as shelterImageUrl,
        i.proshop_image_url as proshopImageUrl,
        i.description_image_url as descriptionImageUrl
      FROM golf_course c
      LEFT JOIN golf_course_price p ON c.course_idx = p.course_idx
      LEFT JOIN golf_course_image i ON c.course_idx = i.course_idx
      WHERE c.course_idx = ?
      LIMIT 1
    `

    const extraImagesQuery = `
      SELECT 
        image_idx as imageIdx,
        image_url as imageUrl,
        image_type as imageType
      FROM golf_course_extra_image
      WHERE course_idx = ?
      ORDER BY image_idx
    `

    const facilitiesQuery = `
      SELECT
        golf_facility_type_idx
      FROM golf_course_facility GCF
      WHERE GCF.course_idx = ? AND GCF.use_yn = 'Y'
    `

    // 한국어 다국어 텍스트 쿼리
    const localeKoQuery = `
      SELECT
        'KO' as language,
        caddy_covenants.text as caddyCovenants,
        caddy_rule.long_text as caddyRule,
        rain_check.text as rainCheck,
        gallery_fee.text as galleryFee
      FROM golf_course c
      LEFT JOIN locale_text caddy_covenants ON c.course_idx = caddy_covenants.target_idx AND caddy_covenants.target_category = 'golf_course.caddy_covenants' AND caddy_covenants.language = 'KO' AND caddy_covenants.use_yn = 'Y'
      LEFT JOIN locale_text caddy_rule ON c.course_idx = caddy_rule.target_idx AND caddy_rule.target_category = 'golf_course.caddy_rule' AND caddy_rule.language = 'KO' AND caddy_rule.use_yn = 'Y'
      LEFT JOIN locale_text rain_check ON c.course_idx = rain_check.target_idx AND rain_check.target_category = 'golf_course.rain_check' AND rain_check.language = 'KO' AND rain_check.use_yn = 'Y'
      LEFT JOIN locale_text gallery_fee ON c.course_idx = gallery_fee.target_idx AND gallery_fee.target_category = 'golf_course.gallery_fee' AND gallery_fee.language = 'KO' AND gallery_fee.use_yn = 'Y'
      WHERE c.course_idx = ?
      LIMIT 1
    `
    
    // 영어 다국어 텍스트 쿼리
    const localeEnQuery = `
      SELECT
        'EN' as language,
        caddy_covenants.text as caddyCovenants,
        caddy_rule.long_text as caddyRule,
        rain_check.text as rainCheck,
        gallery_fee.text as galleryFee
      FROM golf_course c
      LEFT JOIN locale_text caddy_covenants ON c.course_idx = caddy_covenants.target_idx AND caddy_covenants.target_category = 'golf_course.caddy_covenants' AND caddy_covenants.language = 'EN' AND caddy_covenants.use_yn = 'Y'
      LEFT JOIN locale_text caddy_rule ON c.course_idx = caddy_rule.target_idx AND caddy_rule.target_category = 'golf_course.caddy_rule' AND caddy_rule.language = 'EN' AND caddy_rule.use_yn = 'Y'
      LEFT JOIN locale_text rain_check ON c.course_idx = rain_check.target_idx AND rain_check.target_category = 'golf_course.rain_check' AND rain_check.language = 'EN' AND rain_check.use_yn = 'Y'
      LEFT JOIN locale_text gallery_fee ON c.course_idx = gallery_fee.target_idx AND gallery_fee.target_category = 'golf_course.gallery_fee' AND gallery_fee.language = 'EN' AND gallery_fee.use_yn = 'Y'
      WHERE c.course_idx = ?
      LIMIT 1
    `

    if (event.method === 'GET') {
      const [courseRows] = await connection.query(query, [courseId])
      const [extraImageRows] = await connection.query(extraImagesQuery, [courseId])
      const [facilityRows] = await connection.query(facilitiesQuery, [courseId])
      const [localeKoRows] = await connection.query(localeKoQuery, [courseId])
      const [localeEnRows] = await connection.query(localeEnQuery, [courseId])
      
      const courses = courseRows as GolfCourse[]
      const extraImages = extraImageRows as Array<{ imageIdx: number; imageUrl: string; imageType: string }>
      const facilities = facilityRows as Array<{ golf_facility_type_idx: number }>
      const localeKoData = localeKoRows as LocaleTextRow[]
      const localeEnData = localeEnRows as LocaleTextRow[]

      if (courses.length === 0) {
        throw createError({
          statusCode: 404,
          message: '골프장을 찾을 수 없습니다.'
        })
      }
      
      // 다국어 텍스트 구성
      if (courses.length > 0) {
        courses[0].localeTexts = {}
        
        // 한국어 텍스트 추가
        if (localeKoData.length > 0) {
          courses[0].localeTexts.KO = {
            caddyCovenants: localeKoData[0].caddyCovenants,
            caddyRule: localeKoData[0].caddyRule,
            rainCheck: localeKoData[0].rainCheck,
            galleryFee: localeKoData[0].galleryFee
          }
        }
        
        // 영어 텍스트 추가
        if (localeEnData.length > 0) {
          courses[0].localeTexts.EN = {
            caddyCovenants: localeEnData[0].caddyCovenants,
            caddyRule: localeEnData[0].caddyRule,
            rainCheck: localeEnData[0].rainCheck,
            galleryFee: localeEnData[0].galleryFee
          }
        }
      }

      return {
        course: {
          ...courses[0],
          extraImages,
          facilities
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

      // Use authenticated member_idx from session
      const updatedMemberIdx = session.user.member_idx

      const body = await readBody(event)

      // Update golf_course table
      const courseUpdateQuery = `
        UPDATE golf_course SET
          booking_status = ?,
          course_status = ?,
          course_id = ?,
          name_kr = ?,
          name_en = ?,
          country_code = ?,
          city_code = ?,
          hole_count = ?,
          round_start = ?,
          address = ?,
          phone = ?,
          website = ?,
          promotion_url = ?,
          description = ?,
          nearest_airport = ?,
          airport_time = ?,
          nearest_city = ?,
          city_time = ?,
          map_url = ?,
          course_designer = ?,
          course_holes = ?,
          course_par = ?,
          course_length = ?,
          fairway_info = ?,
          green_info = ?,
          single_play = ?,
          single_play_date = ?,
          double_play = ?,
          double_play_date = ?,
          updated_member_idx = ?
        WHERE course_idx = ?
      `

      const courseValues = [
        body.bookingStatus,
        body.courseStatus,
        body.courseId,
        body.nameKr,
        body.nameEn,
        body.countryCode,
        body.cityCode,
        body.holeCount,
        body.roundStart,
        body.address,
        body.phone,
        body.website,
        body.promoUrl,
        body.description,
        body.nearbyAirport,
        body.airportTime,
        body.nearbyCity,
        body.cityTime,
        body.mapUrl,
        body.courseDesigner,
        body.courseHoles,
        body.coursePar,
        body.courseLength,
        body.fairwayInfo,
        body.greenInfo,
        body.singlePlay,
        body.singlePlayDate,
        body.doublePlay,
        body.doublePlayDate,
        updatedMemberIdx,
        courseId
      ]

      await connection.query(courseUpdateQuery, courseValues)

      // Update golf_course_facility table
      if (body.facilities && Array.isArray(body.facilities)) {
        // First, delete all existing facilities for this course
        const deleteFacilitiesQuery = `
          UPDATE golf_course_facility
          SET use_yn = 'N',
              updated_member_idx = ?
          WHERE course_idx = ?
        `
        await connection.query(deleteFacilitiesQuery, [updatedMemberIdx, courseId])
        
        // Then insert new facilities
        if (body.facilities.length > 0) {
          const insertFacilitiesQuery = `
            INSERT INTO golf_course_facility 
              (course_idx, golf_facility_type_idx, use_yn, created_member_idx, updated_member_idx) 
            VALUES 
              (?, ?, 'Y', ?, ?)
            ON DUPLICATE KEY UPDATE 
              use_yn = 'Y',
              updated_member_idx = ?
          `
          
          // Insert each facility
          for (const facility of body.facilities) {
            if (facility.golf_facility_type_idx) {
              await connection.query(insertFacilitiesQuery, [
                courseId,
                facility.golf_facility_type_idx,
                updatedMemberIdx,
                updatedMemberIdx,
                updatedMemberIdx
              ])
            }
          }
        }
      }

      // Update golf_course_image table
      const imageFields = [
        { bodyKey: 'mainImageUrl', dbKey: 'main_image_url' },
        { bodyKey: 'logoUrl', dbKey: 'logo_url' },
        { bodyKey: 'courseImageUrl', dbKey: 'course_image_url' },
        { bodyKey: 'clubhouseImageUrl', dbKey: 'clubhouse_image_url' },
        { bodyKey: 'restaurantImageUrl', dbKey: 'restaurant_image_url' },
        { bodyKey: 'shelterImageUrl', dbKey: 'shelter_image_url' },
        { bodyKey: 'proshopImageUrl', dbKey: 'proshop_image_url' },
        { bodyKey: 'descriptionImageUrl', dbKey: 'description_image_url' },
      ];

      // Prepare update values
      const imageUpdateValues = {};
      for (const { bodyKey, dbKey } of imageFields) {
        if (body[bodyKey] !== undefined) {
          imageUpdateValues[dbKey] = body[bodyKey];
        }
      }

      if (Object.keys(imageUpdateValues).length > 0) {
        // Check if record exists
        const [imgRows] = await connection.query(
          'SELECT image_idx FROM golf_course_image WHERE course_idx = ?',
          [courseId]
        );
        if (imgRows.length > 0) {
          // UPDATE
          const setClause = Object.keys(imageUpdateValues)
            .map(key => `${key} = ?`)
            .join(', ');
          const updateSql = `UPDATE golf_course_image SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE course_idx = ?`;
          await connection.query(updateSql, [
            ...Object.values(imageUpdateValues),
            courseId
          ]);
        } else {
          // INSERT
          const columns = Object.keys(imageUpdateValues).join(', ');
          const placeholders = Object.keys(imageUpdateValues).map(() => '?').join(', ');
          const insertSql = `INSERT INTO golf_course_image (course_idx, ${columns}) VALUES (?, ${placeholders})`;
          await connection.query(insertSql, [
            courseId,
            ...Object.values(imageUpdateValues)
          ]);
        }
      }

      // Handle extra images if provided
      if (body.extraImages && Array.isArray(body.extraImages)) {
        // 1. If there are removedExtraImageIds, delete those images
        if (body.removedExtraImageIds && Array.isArray(body.removedExtraImageIds) && body.removedExtraImageIds.length > 0) {
          const deleteExtraImagesQuery = `
            DELETE FROM golf_course_extra_image
            WHERE image_idx IN (?) AND course_idx = ?
          `
          await connection.query(deleteExtraImagesQuery, [body.removedExtraImageIds, courseId])
        }

        // 2. Insert new extra images (limit to 10 images maximum)
        if (body.extraImages.length > 0) {
          // First get count of existing images for this course (excluding ones we just deleted)
          const [countResult] = await connection.query(
            'SELECT COUNT(*) as count FROM golf_course_extra_image WHERE course_idx = ?',
            [courseId]
          )
          
          interface CountResult {
            count: number
          }
          const existingCount = (countResult as CountResult[])[0]?.count || 0
          
          // Calculate how many new images we can add (maximum 10 total)
          const remainingSlots = 10 - existingCount
          
          // Filter to only new images (those without imageIdx)
          const newImages = body.extraImages.filter(img => !img.imageIdx)
          const imagesToInsert = newImages.slice(0, remainingSlots)
          
          if (imagesToInsert.length > 0) {
            const insertExtraImageQuery = `
              INSERT INTO golf_course_extra_image 
                (course_idx, image_url, image_type, created_at, updated_at) 
              VALUES 
                (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `
            
            // Insert each new image
            for (const image of imagesToInsert) {
              await connection.query(insertExtraImageQuery, [
                courseId,
                image.imageUrl,
                image.imageType || '이미지'
              ])
            }
          }
        }
      }

      // Update locale texts if provided
      if (body.localeTexts) {
        const languages = ['KO', 'EN']
        const localeFields = [
          { field: 'caddyCovenants', column: 'text', category: 'golf_course.caddy_covenants' },
          { field: 'caddyRule', column: 'long_text', category: 'golf_course.caddy_rule' },
          { field: 'rainCheck', column: 'text', category: 'golf_course.rain_check' },
          { field: 'galleryFee', column: 'text', category: 'golf_course.gallery_fee' }
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
                  [courseId, category, lang]
                )
                
                const count = countResult[0].count
                
                if (count > 0) {
                  // Update existing record
                  await connection.query(
                    `UPDATE locale_text SET ${column} = ?, updated_member_idx = ?, use_yn = 'Y' WHERE target_idx = ? AND target_category = ? AND language = ?`,
                    [value, updatedMemberIdx, courseId, category, lang]
                  )
                } else {
                  // Insert new record
                  await connection.query(
                    `INSERT INTO locale_text (target_idx, target_category, language, ${column}, created_member_idx) VALUES (?, ?, ?, ?, ?)`,
                    [courseId, category, lang, value, updatedMemberIdx]
                  )
                }
              }
            }
          }
        }
      }

      // Return updated course data
      const [updatedCourse] = await connection.query(query, [courseId])
      const [updatedExtraImages] = await connection.query(extraImagesQuery, [courseId])
      const [updatedFacilities] = await connection.query(facilitiesQuery, [courseId])
      const [updatedLocaleKoRows] = await connection.query(localeKoQuery, [courseId])
      const [updatedLocaleEnRows] = await connection.query(localeEnQuery, [courseId])
      
      // Process updated course data
      const courses = updatedCourse as GolfCourse[]
      const localeKoData = updatedLocaleKoRows as LocaleTextRow[]
      const localeEnData = updatedLocaleEnRows as LocaleTextRow[]
      
      // Add locale texts to the response
      if (courses.length > 0) {
        courses[0].localeTexts = {}
        
        // Add Korean locale texts
        if (localeKoData.length > 0) {
          courses[0].localeTexts.KO = {
            caddyCovenants: localeKoData[0].caddyCovenants,
            caddyRule: localeKoData[0].caddyRule,
            rainCheck: localeKoData[0].rainCheck,
            galleryFee: localeKoData[0].galleryFee
          }
        }
        
        // Add English locale texts
        if (localeEnData.length > 0) {
          courses[0].localeTexts.EN = {
            caddyCovenants: localeEnData[0].caddyCovenants,
            caddyRule: localeEnData[0].caddyRule,
            rainCheck: localeEnData[0].rainCheck,
            galleryFee: localeEnData[0].galleryFee
          }
        }
      }

      return {
        course: {
          ...(updatedCourse as GolfCourse[])[0],
          extraImages: updatedExtraImages as Array<{ imageUrl: string; imageType: string }>,
          facilities: updatedFacilities as Array<{ golf_facility_type_idx: number }>
        }
      }
    }

    throw createError({
      statusCode: 405,
      message: '허용되지 않는 메소드입니다.'
    })
  } finally {
    connection.release()
  }
})
