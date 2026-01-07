import { defineEventHandler, getRouterParam, createError, readBody } from 'h3'
import type { H3Event } from 'h3'
import type { CaddyDetail, CaddyLocaleText } from '~/types/admin/caddy'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event: H3Event): Promise<{ caddy: CaddyDetail }> => {
  const caddyId = getRouterParam(event, 'id')

  if (!caddyId) {
    throw createError({
      statusCode: 400,
      message: '캐디 ID가 필요합니다.'
    })
  }

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT
        c.caddy_idx as caddyIdx,
        c.course_idx as courseIdx,
        c.caddy_code as caddyCode,
        c.name,
        c.nick_name as nickName,
        c.age,
        c.height,
        c.country_code as countryCode,
        c.city_code as cityCode,
        c.language,
        c.specialty,
        c.day_off as dayOff,
        c.golf_experience as golfExperience,
        c.price,
        c.reservation_fee as reservationFee,
        c.caddy_status as caddyStatus,
        c.created_at as createdAt,
        c.created_member_idx as createdMemberIdx,
        c.updated_at as updatedAt,
        c.updated_member_idx as updatedMemberIdx,
        g.name_kr as golfNameKr,
        g.name_en as golfNameEn,
        IFNULL(r.review_count, 0) AS reviewCount,
        IFNULL(r.average_rating, 0) AS averageRating,
        (SELECT long_text FROM locale_text WHERE target_category = 'caddy_caution' AND language = 'KO' AND use_yn = 'Y' LIMIT 1) AS caution
      FROM caddy c
      JOIN golf_course g ON c.course_idx = g.course_idx
      LEFT JOIN (
        SELECT
          product_idx
          , COUNT(review_idx) AS review_count
          , TRUNCATE(AVG(review_rate), 1) AS average_rating
        FROM review
        WHERE product_idx = ? AND review_type = 'C' AND use_yn = 'Y'
      ) r ON c.caddy_idx = r.product_idx
      WHERE c.caddy_idx = ?
      LIMIT 1
    `

    const imagesQuery = `
      SELECT image_url as imageUrl
      FROM caddy_image
      WHERE caddy_idx = ? AND use_yn = 'Y'
      ORDER BY sort
    `

    // 한국어 다국어 텍스트 쿼리
    const localeKoQuery = `
      SELECT
        'KO' as language,
        language.text as language,
        specialty.long_text as specialty
      FROM caddy c
      LEFT JOIN locale_text language ON c.caddy_idx = language.target_idx AND language.target_category = 'caddy.language' AND language.language = 'KO' AND language.use_yn = 'Y'
      LEFT JOIN locale_text specialty ON c.caddy_idx = specialty.target_idx AND specialty.target_category = 'caddy.specialty' AND specialty.language = 'KO' AND specialty.use_yn = 'Y'
      WHERE c.caddy_idx = ?
      LIMIT 1
    `
    
    // 영어 다국어 텍스트 쿼리
    const localeEnQuery = `
      SELECT
        'EN' as language,
        language.text as language,
        specialty.long_text as specialty
      FROM caddy c
      LEFT JOIN locale_text language ON c.caddy_idx = language.target_idx AND language.target_category = 'caddy.language' AND language.language = 'EN' AND language.use_yn = 'Y'
      LEFT JOIN locale_text specialty ON c.caddy_idx = specialty.target_idx AND specialty.target_category = 'caddy.specialty' AND specialty.language = 'EN' AND specialty.use_yn = 'Y'
      WHERE c.caddy_idx = ?
      LIMIT 1
    `

    if (event.method === 'GET') {
      const [caddyRows] = await connection.query(query, [caddyId, caddyId])
      const [imageRows] = await connection.query(imagesQuery, [caddyId])
      const [localeKoRows] = await connection.query(localeKoQuery, [caddyId])
      const [localeEnRows] = await connection.query(localeEnQuery, [caddyId])
      
      const caddies = caddyRows as CaddyDetail[]
      const images = imageRows as Array<{ imageUrl: string }>
      const localeKoData = localeKoRows as CaddyLocaleText[]
      const localeEnData = localeEnRows as CaddyLocaleText[]

      if (caddies.length === 0) {
        throw createError({
          statusCode: 404,
          message: '캐디를 찾을 수 없습니다.'
        })
      }
      
      // 다국어 텍스트 구성
      if (caddies.length > 0) {
        caddies[0].localeTexts = {}
        
        // 한국어 텍스트 추가
        if (localeKoData.length > 0) {
          caddies[0].localeTexts.KO = {
            language: localeKoData[0].language,
            specialty: localeKoData[0].specialty
          }
        }
        
        // 영어 텍스트 추가
        if (localeEnData.length > 0) {
          caddies[0].localeTexts.EN = {
            language: localeEnData[0].language,
            specialty: localeEnData[0].specialty
          }
        }
      }

      return {
        caddy: {
          ...caddies[0],
          images
        }
      }
    } else if (event.method === 'PUT') {
      // Get authenticated user session
      const session = await getUserSession(event)
      
      // Check if user is authenticated
      if (session?.user?.role !== 'A') {
        throw createError({
          statusCode: 401,
          message: '인증되지 않은 사용자입니다.'
        })
      }

      // Use authenticated member_idx from session
      const updatedMemberIdx = session.user.member_idx
      
      // Get request body
      const body = await readBody(event)
      
      // Update caddy basic information
      const updateCaddyQuery = `
        UPDATE caddy
        SET
          course_idx = ?,
          caddy_code = ?,
          name = ?,
          nick_name = ?,
          age = ?,
          height = ?,
          country_code = ?,
          city_code = ?,
          language = ?,
          specialty = ?,
          day_off = ?,
          golf_experience = ?,
          price = ?,
          reservation_fee = ?,
          caddy_status = ?,
          updated_member_idx = ?
        WHERE caddy_idx = ?
      `
      
      await connection.query(updateCaddyQuery, [
        body.courseIdx,
        body.caddyCode,
        body.name,
        body.nickName,
        body.age,
        body.height,
        body.countryCode,
        body.cityCode,
        body.language,
        body.specialty,
        body.dayOff,
        body.golfExperience,
        body.price,
        body.reservationFee,
        body.caddyStatus,
        updatedMemberIdx,
        caddyId
      ])
      
      // Handle locale text updates if provided
      if (body.localeTexts) {
        const languages = ['KO', 'EN']
        const localeFields = [
          { field: 'language', column: 'text', category: 'caddy.language' },
          { field: 'specialty', column: 'long_text', category: 'caddy.specialty' }
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
                  [caddyId, category, lang]
                )
                
                const count = countResult[0].count
                
                if (count > 0) {
                  // Update existing record
                  await connection.query(
                    `UPDATE locale_text SET ${column} = ?, updated_member_idx = ?, use_yn = 'Y' WHERE target_idx = ? AND target_category = ? AND language = ?`,
                    [value, updatedMemberIdx, caddyId, category, lang]
                  )
                } else {
                  // Insert new record
                  await connection.query(
                    `INSERT INTO locale_text (target_idx, target_category, language, ${column}, created_member_idx) VALUES (?, ?, ?, ?, ?)`,
                    [caddyId, category, lang, value, updatedMemberIdx]
                  )
                }
              }
            }
          }
        }
      }
      
      // Handle image updates if provided
      if (body.images && Array.isArray(body.images)) {
        // First, mark all existing images as not in use
        await connection.query(`
          UPDATE caddy_image
          SET use_yn = 'N'
          WHERE caddy_idx = ?
        `, [caddyId])
        
        // Then insert or update new images
        for (let i = 0; i < body.images.length; i++) {
          const image = body.images[i]
          await connection.query(`
            INSERT INTO caddy_image (caddy_idx, image_url, sort, use_yn, created_member_idx)
            VALUES (?, ?, ?, 'Y', ?)
            ON DUPLICATE KEY UPDATE
            sort = VALUES(sort), use_yn = 'Y', updated_member_idx = ?
          `, [caddyId, image.imageUrl, i, updatedMemberIdx, updatedMemberIdx])
        }
      }
      
      // Return updated caddy data
      const [updatedRows] = await connection.query(query, [caddyId, caddyId])
      const [updatedImageRows] = await connection.query(imagesQuery, [caddyId])
      const [updatedLocaleKoRows] = await connection.query(localeKoQuery, [caddyId])
      const [updatedLocaleEnRows] = await connection.query(localeEnQuery, [caddyId])
      
      const updatedCaddies = updatedRows as CaddyDetail[]
      const updatedImages = updatedImageRows as Array<{ imageUrl: string }>
      const updatedLocaleKoData = updatedLocaleKoRows as CaddyLocaleText[]
      const updatedLocaleEnData = updatedLocaleEnRows as CaddyLocaleText[]
      
      // 다국어 텍스트 구성
      if (updatedCaddies.length > 0) {
        updatedCaddies[0].localeTexts = {}
        
        // 한국어 텍스트 추가
        if (updatedLocaleKoData.length > 0) {
          updatedCaddies[0].localeTexts.KO = {
            language: updatedLocaleKoData[0].language,
            specialty: updatedLocaleKoData[0].specialty
          }
        }
        
        // 영어 텍스트 추가
        if (updatedLocaleEnData.length > 0) {
          updatedCaddies[0].localeTexts.EN = {
            language: updatedLocaleEnData[0].language,
            specialty: updatedLocaleEnData[0].specialty
          }
        }
      }
      
      return {
        caddy: {
          ...updatedCaddies[0],
          images: updatedImages
        }
      }
    }
    
    // If not GET or PUT, throw method not allowed error
    throw createError({
      statusCode: 405,
      message: '허용되지 않는 메소드입니다.'
    })
  } finally {
    connection.release()
  }
})
