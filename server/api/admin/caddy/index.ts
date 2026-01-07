import { defineEventHandler, createError, readBody, getQuery } from 'h3'
import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'
import type { CaddyDetail } from '~/types/admin/caddy'

export default defineEventHandler(async (event: H3Event): Promise<{ caddy?: CaddyDetail, success: boolean, message?: string }> => {
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
  const memberIdx = session.user.member_idx
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // PUT 요청 처리 (이미지 업데이트)
    if (event.method === 'PUT') {
      const query = getQuery(event)
      const caddyId = query.caddyIdx
      
      if (!caddyId) {
        throw createError({
          statusCode: 400,
          message: '캐디 ID가 필요합니다.'
        })
      }
      
      // 요청 본문 가져오기
      const body = await readBody(event)
      
      // 이미지 배열 확인
      if (!body.images || !Array.isArray(body.images)) {
        throw createError({
          statusCode: 400,
          message: '올바른 이미지 데이터가 필요합니다.'
        })
      }
      
      const pool = getPool()
      const connection = await pool.getConnection()
      
      try {
        // 이미지 저장
        for (let i = 0; i < body.images.length; i++) {
          const image = body.images[i]
          if (image.imageUrl) {
            await connection.query(`
              INSERT INTO caddy_image (caddy_idx, image_url, sort, use_yn, created_member_idx)
              VALUES (?, ?, ?, 'Y', ?)
            `, [caddyId, image.imageUrl, i + 1, memberIdx])
          }
        }
        
        // 업데이트된 캐디 이미지 정보 조회
        const [imageRows] = await connection.query(`
          SELECT 
            caddy_image_idx as caddyImageIdx, 
            caddy_idx as caddyIdx, 
            image_url as imageUrl, 
            sort,
            use_yn as useYn,
            created_at as createdAt,
            updated_at as updatedAt
          FROM caddy_image 
          WHERE caddy_idx = ? AND use_yn = 'Y'
          ORDER BY sort
        `, [caddyId])
        
        return {
          success: true,
          message: '이미지가 성공적으로 저장되었습니다.',
          caddy: { images: imageRows, caddyIdx: Number(caddyId) } as Partial<CaddyDetail>
        }
      } finally {
        connection.release()
      }
    }
    
    // POST 요청 처리 (캐디 신규 등록)
    if (event.method === 'POST') {
      
      // 요청 본문 가져오기
      const body = await readBody(event)
      const createdMemberIdx = memberIdx

      // 필수 항목 확인
      if (!body.courseIdx || !body.name) {
        throw createError({
          statusCode: 400,
          message: '골프장 ID와 이름은 필수 항목입니다.'
        })
      }

      // 캐디 기본 정보 삽입
      const insertCaddyQuery = `
        INSERT INTO caddy (
          course_idx,
          caddy_code,
          name,
          nick_name,
          age,
          height,
          country_code,
          city_code,
          language,
          specialty,
          day_off,
          golf_experience,
          price,
          reservation_fee,
          caddy_status,
          created_member_idx,
          updated_member_idx
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      
      const [result] = await connection.query(insertCaddyQuery, [
        body.courseIdx,
        body.caddyCode,
        body.name,
        body.nickName,
        body.age,
        body.height,
        body.countryCode,
        body.cityCode,
        body.language || null,
        body.specialty || null,
        body.dayOff,
        body.golfExperience || 'N',
        body.price,
        body.reservationFee,
        body.caddyStatus || 'Y',
        createdMemberIdx,
        createdMemberIdx
      ])
      
      // 생성된 캐디의 ID 가져오기
      const caddyId = result.insertId
      
      // 다국어 텍스트 처리
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
              
              if (value !== undefined && value !== null && value !== '') {
                // 새 레코드 삽입
                await connection.query(
                  `INSERT INTO locale_text (target_idx, target_category, language, ${column}, created_member_idx) VALUES (?, ?, ?, ?, ?)`,
                  [caddyId, category, lang, value, createdMemberIdx]
                )
              }
            }
          }
        }
      }
      
      // 생성된 캐디 정보 조회
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
          g.name_en as golfNameEn
        FROM caddy c
        JOIN golf_course g ON c.course_idx = g.course_idx
        WHERE c.caddy_idx = ?
        LIMIT 1
      `

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

      const [caddyRows] = await connection.query(query, [caddyId])
      const [localeKoRows] = await connection.query(localeKoQuery, [caddyId])
      const [localeEnRows] = await connection.query(localeEnQuery, [caddyId])
      
      const caddy = caddyRows[0] as CaddyDetail | undefined
      const localeKoData = localeKoRows[0]
      const localeEnData = localeEnRows[0]

      // 다국어 텍스트 구성
      caddy.localeTexts = {}
      
      // 한국어 텍스트 추가
      if (localeKoData) {
        caddy.localeTexts.KO = {
          language: localeKoData.language,
          specialty: localeKoData.specialty
        }
      }
      
      // 영어 텍스트 추가
      if (localeEnData) {
        caddy.localeTexts.EN = {
          language: localeEnData.language,
          specialty: localeEnData.specialty
        }
      }
      
      // 빈 이미지 배열 추가
      caddy.images = []

      return {
        caddy,
        success: true,
        message: '캐디 정보가 성공적으로 등록되었습니다.'
      }
    }
    
    // GET 요청 처리 (캐디 목록)
    if (event.method === 'GET') {
      // 캐디 목록 API 구현 (필요한 경우)
      // ...
      return {
        success: true
      }
    }

    // 지원하지 않는 HTTP 메서드
    throw createError({
      statusCode: 405,
      message: '허용되지 않는 메소드입니다.'
    })
  } catch (error) {
    console.error('Error in caddy API:', error)
    return {
      success: false,
      message: error.message || '캐디 정보 처리 중 오류가 발생했습니다.'
    }
  } finally {
    connection.release()
  }
})
