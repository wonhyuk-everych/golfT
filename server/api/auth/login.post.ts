import { z } from 'zod'
import { H3Event } from 'h3'
import { defineEventHandler, readValidatedBody, createError, setUserSession } from '#imports'
import { getPool } from '~/server/utils/db'

import bcrypt from 'bcryptjs'

// 회원 테이블 타입 정의
interface Member {
  member_idx: number;
  id: string;
  password: string;
  grade: string;
  birthday?: string;
  gender?: string;
  email?: string;
  name_kr?: string;
  name_en?: string;
  phone?: string;
  member_status?: string;
}

const bodySchema = z.object({
  id: z.string(),
  password: z.string()
})

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { id, password } = await readValidatedBody(event, bodySchema.parse)
    const pool = getPool()

    const plain = password
    const hash = await bcrypt.hash(plain, 12)
    console.log({ plain, hash, ok: await bcrypt.compare(plain, hash) })

    // DB에서 사용자 조회
    const [rows] = await pool.execute(
      'SELECT member_idx, id, password, grade, birthday, gender, email, name_kr, name_en, phone, member_status FROM member WHERE id = ?',
      [id]
    )

    const members = rows as Member[]
    
    if (members.length === 0) {

      throw createError({
        statusCode: 401,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.'
      })
    }

    const member = members[0]

    // 탈퇴 회원 확인
    if (member.member_status === 'N') {
      throw createError({
        statusCode: 403,
        message: '이미 탈퇴한 회원입니다.'
      })
    }

    // 비밀번호 검증: bcrypt 비교
    const ok = await bcrypt.compare(password, member.password)
    if (!ok) {
      throw createError({
        statusCode: 401,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.'
      })
    }

    // 세션에 사용자 정보 저장
    await setUserSession(event, {
      user: {
        id: member.id,
        member_idx: member.member_idx,
        name_kr: member.name_kr,
        name_en: member.name_en,
        email: member.email,
        role: member.grade,
      }
    })

    return {
      success: true,
      user: {
        id: member.id,
        member_idx: member.member_idx,
        name_kr: member.name_kr,
        name_en: member.name_en,
        email: member.email,
        role: member.grade
      }
    }
  } catch (error: unknown) {
    const err = error as { statusCode?: number, message?: string }
    if (err.statusCode === 401 || err.statusCode === 403) {
      throw error
    }
    
    console.error('로그인 처리 중 오류 발생:', error)
    throw createError({
      statusCode: 500,
      message: '로그인 처리 중 오류가 발생했습니다.'
    })
  }
})
