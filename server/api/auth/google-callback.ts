import type { H3Event } from 'h3'
import { defineEventHandler, getQuery, createError, sendRedirect, setUserSession } from '#imports'
import { getPool } from '~/server/utils/db'
import { oauthConfig } from '~/server/config/oauth'

// Google OAuth 응답 타입 정의
interface GoogleUserInfo {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  locale?: string;
}

// DB에서 가져온 회원 정보 타입 정의
interface Member {
  member_idx: number;
  id: string;
  grade: string;
  name_kr?: string;
  name_en?: string;
  email?: string;
  phone?: string;
  member_status?: string;
}

// DB 쿼리 결과 타입 정의
interface QueryResult {
  insertId: number;
  affectedRows: number;
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 구글 인증 코드 받기
    const query = getQuery(event)
    const code = query.code as string
    
    if (!code) {
      throw createError({
        statusCode: 400,
        message: '인증 코드가 없습니다.'
      })
    }
    
    // 구글 API 설정 및 검증
    const { clientId, clientSecret, redirectUri } = oauthConfig.google
    if (!clientId || !clientSecret || !redirectUri) {
      throw createError({
        statusCode: 500,
        message: 'Google OAuth 설정이 올바르지 않습니다. 환경변수를 확인해주세요.'
      })
    }

    // URLSearchParams는 문자열만 허용하므로 안전하게 구성
    const params = new URLSearchParams()
    params.set('grant_type', 'authorization_code')
    params.set('client_id', clientId)
    params.set('client_secret', clientSecret)
    params.set('redirect_uri', redirectUri)
    params.set('code', code)

    // 액세스 토큰 요청
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('구글 토큰 요청 실패:', errorData)
      throw createError({
        statusCode: 401,
        message: '구글 로그인 인증에 실패했습니다.'
      })
    }

    const { access_token } = await tokenResponse.json()

    // 사용자 정보 요청
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    if (!userInfoResponse.ok) {
      console.error('구글 사용자 정보 요청 실패')
      throw createError({
        statusCode: 401,
        message: '구글 사용자 정보를 가져오는데 실패했습니다.'
      })
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json()
    const googleId = `google_${userInfo.sub}`
    const email = userInfo.email || null
    const name = userInfo.name || null
    
    // DB 연결
    const pool = getPool()
    
    // 기존 회원 확인
    const [existingUsers] = await pool.execute(
      'SELECT member_idx, id, grade, name_kr, name_en, email, member_status FROM member WHERE id = ? OR (email = ? AND email IS NOT NULL)',
      [googleId, email]
    )
    
    let member: Member
    
    if ((existingUsers as Member[]).length === 0) {
      // 신규 회원 등록
      const [result] = await pool.execute(
        'INSERT INTO member (id, password, grade, email, name_kr) VALUES (?, ?, ?, ?, ?)',
        [googleId, '', 'M', email, name]
      )
      
      const insertId = (result as QueryResult).insertId
      
      // 새로 등록된 회원 정보 조회
      const [newUsers] = await pool.execute(
        'SELECT member_idx, id, grade, name_kr, name_en, email, member_status FROM member WHERE member_idx = ?',
        [insertId]
      )
      
      member = (newUsers as Member[])[0]
    } else {
      member = (existingUsers as Member[])[0]
      
      // 구글 계정으로 로그인한 적이 없는 이메일 계정인 경우 ID 업데이트
      if (member.id !== googleId && email) {
        await pool.execute(
          'UPDATE member SET id = ? WHERE email = ?',
          [googleId, email]
        )
        member.id = googleId
      }
    }
    
    // 탈퇴 회원 확인 후 세션 설정
    if (member.member_status === 'N') {
      return sendRedirect(event, '/login?reason=withdrawn')
    }
    // 세션에 사용자 정보 저장
    await setUserSession(event, {
      user: {
        id: member.id,
        member_idx: member.member_idx,
        name_kr: member.name_kr || null,
        name_en: member.name_en || null,
        email: member.email || null,
        role: member.grade,
      }
    })
    
    // 로그인 성공 후 리다이렉트
    return sendRedirect(event, '/')
  } catch (error: unknown) {
    console.error('구글 로그인 처리 중 오류 발생:', error)
    const err = error as { statusCode?: number, message?: string }
    
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || '구글 로그인 처리 중 오류가 발생했습니다.'
    })
  }
})
