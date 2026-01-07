import { defineEventHandler, createError } from 'h3'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Authentication check
  const session = await getUserSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Check if user is authenticated as admin
  if (session?.user?.role != 'A') {
    throw createError({
      statusCode: 401,
      message: '인증되지 않은 사용자입니다.'
    })
  }

  try {
    const pool = getPool()
    const memberId = event.context.params?.id

    if (!memberId) {
      throw createError({
        statusCode: 400,
        message: '회원 ID가 필요합니다.'
      })
    }

    const sql = `
      SELECT * 
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

    // Do not expose password in the response
    const member = rows[0]
    member.password = '********' // Mask password

    return {
      member
    }
  } catch (error) {
    console.error('Error fetching member details:', error)
    throw createError({
      statusCode: 500,
      message: '회원 정보를 불러오는데 실패했습니다.'
    })
  }
})
