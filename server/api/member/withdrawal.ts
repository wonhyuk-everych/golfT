import { createError } from 'h3'
import { defineEventHandler } from '#imports'
import { getPool } from '~/server/utils/db'
import type { ResultSetHeader } from 'mysql2'

export default defineEventHandler(async (event) => {
  // 세션 확인 (로그인 사용자만 회원 탈퇴 가능)
  const session = await getUserSession(event)
  const memberId = session?.user?.member_idx
  if (!memberId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const pool = getPool()
    const sql = 'UPDATE member SET member_status = ? WHERE member_idx = ?'
    const [result] = await pool.query<ResultSetHeader>(sql, ['N', memberId])
    if (!result || result.affectedRows === 0) {
      throw createError({ statusCode: 404, message: '회원을 찾을 수 없습니다.' })
    }
    return { success: true }
  } catch (error) {
    console.error('회원 탈퇴 처리 중 오류:', error)
    throw createError({ statusCode: 500, message: '회원 탈퇴 처리에 실패했습니다.' })
  }
})
