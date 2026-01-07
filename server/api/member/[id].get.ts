import { defineEventHandler, createError } from 'h3'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Authenticate user
  const session = await getUserSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const memberId = event.context.params?.id

  if (!memberId) {
    throw createError({
      statusCode: 400,
      message: '회원 ID가 필요합니다.'
    })
  }

  try {
    const pool = getPool()
    const sql = `
      SELECT name_kr, phone, birthday, gender
      FROM member
      WHERE member_idx = ?
    `
    const [rows] = await pool.query(sql, [memberId])

    if (!rows || rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: '회원을 찾을 수 없습니다.'
      })
    }

    return rows[0]
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: '회원 정보를 불러오는 중 오류가 발생했습니다.'
    })
  }
})
