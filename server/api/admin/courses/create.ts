import { defineEventHandler, readBody, createError } from 'h3'
import { getPool } from '~/server/utils/db'
import type { GolfCourse } from '~/types/admin/course'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, message: '허용되지 않는 메소드입니다.' })
  }

  const session = await getUserSession(event)
  if (session?.user?.role !== 'A') {
    throw createError({ statusCode: 401, message: '인증되지 않은 사용자입니다.' })
  }
  const updatedMemberIdx = session.user.member_idx

  const body = await readBody(event) as GolfCourse
  if (!body.nameKr || !body.nameEn) {
    throw createError({ statusCode: 400, message: '필수 항목이 누락되었습니다.' })
  }

  const pool = getPool()
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    // 1. 골프장 메인 정보 insert
    const [result] = await connection.query(
      `INSERT INTO golf_course (
        name_kr, name_en, country_code, city_code, hole_count, round_start, address, phone, website, promotion_url, description, nearest_airport, airport_time, nearest_city, city_time, map_url, course_designer, course_holes, course_par, course_length, fairway_info, green_info, single_play, single_play_date, double_play, double_play_date, course_status, booking_status, created_at, created_member_idx, updated_at, updated_member_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)`,
      [
        body.nameKr, body.nameEn, body.countryCode, body.cityCode, body.holeCount, body.roundStart, body.address, body.phone, body.website, body.promoUrl, body.description, body.nearbyAirport, body.airportTime, body.nearbyCity, body.cityTime, body.mapUrl, body.courseDesigner, body.courseHoles, body.coursePar, body.courseLength, body.fairwayInfo, body.greenInfo, body.singlePlay, body.singlePlayDate, body.doublePlay, body.doublePlayDate, body.courseStatus, body.bookingStatus, updatedMemberIdx, updatedMemberIdx
      ]
    )
    const courseIdx = result.insertId

    // 3. 이미지 정보 insert
    await connection.query(
      `INSERT INTO golf_course_image (
        course_idx, logo_url, main_image_url, course_image_url, clubhouse_image_url, restaurant_image_url, shelter_image_url, proshop_image_url, description_image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        courseIdx, body.logoUrl, body.mainImageUrl, body.courseImageUrl, body.clubhouseImageUrl, body.restaurantImageUrl, body.shelterImageUrl, body.proshopImageUrl, body.descriptionImageUrl
      ]
    )

    // 4. 부가 이미지 insert (최대 10개)
    if (body.extraImages && Array.isArray(body.extraImages)) {
      for (const img of body.extraImages.slice(0, 10)) {
        await connection.query(
          `INSERT INTO golf_course_extra_image (course_idx, image_url, image_type) VALUES (?, ?, ?)`,
          [courseIdx, img.imageUrl, img.imageType]
        )
      }
    }

    // 5. 시설 정보 insert
    if (body.facilities && Array.isArray(body.facilities)) {
      for (const f of body.facilities) {
        await connection.query(
          `INSERT INTO golf_course_facility (course_idx, golf_facility_type_idx, use_yn) VALUES (?, ?, 'Y')`,
          [courseIdx, f.golf_facility_type_idx]
        )
      }
    }

    // 6. 다국어 텍스트 insert
    if (body.localeTexts && typeof body.localeTexts === 'object') {
      for (const lang of Object.keys(body.localeTexts)) {
        const locale = body.localeTexts[lang]
        if (locale) {
          if (locale.caddyCovenants) {
            await connection.query(
              `INSERT INTO locale_text (target_idx, target_category, language, text, use_yn) VALUES (?, 'golf_course.caddy_covenants', ?, ?, 'Y')`,
              [courseIdx, lang.toUpperCase(), locale.caddyCovenants]
            )
          }
          if (locale.caddyRule) {
            await connection.query(
              `INSERT INTO locale_text (target_idx, target_category, language, long_text, use_yn) VALUES (?, 'golf_course.caddy_rule', ?, ?, 'Y')`,
              [courseIdx, lang.toUpperCase(), locale.caddyRule]
            )
          }
          if (locale.rainCheck) {
            await connection.query(
              `INSERT INTO locale_text (target_idx, target_category, language, text, use_yn) VALUES (?, 'golf_course.rain_check', ?, ?, 'Y')`,
              [courseIdx, lang.toUpperCase(), locale.rainCheck]
            )
          }
          if (locale.galleryFee) {
            await connection.query(
              `INSERT INTO locale_text (target_idx, target_category, language, text, use_yn) VALUES (?, 'golf_course.gallery_fee', ?, ?, 'Y')`,
              [courseIdx, lang.toUpperCase(), locale.galleryFee]
            )
          }
        }
      }
    }

    await connection.commit()
    return { courseIdx }
  } catch (err) {
    await connection.rollback()
    throw createError({ statusCode: 500, message: '골프장 등록에 실패했습니다.' })
  } finally {
    connection.release()
  }
})
