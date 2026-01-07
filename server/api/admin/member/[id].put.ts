import { defineEventHandler, readBody, createError } from 'h3'
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
    const updatedMemberIdx = session.user.member_idx
    const body = await readBody(event)

    if (!memberId) {
      throw createError({
        statusCode: 400,
        message: '회원 ID가 필요합니다.'
      })
    }

    // Only allow updating grade and member_status
    const { grade, member_status } = body

    // Validate the inputs
    if (!grade || !member_status) {
      throw createError({
        statusCode: 400,
        message: '회원 등급과 상태 정보는 필수입니다.'
      })
    }

    // Validate grade is either 'M' or 'A'
    if (grade !== 'M' && grade !== 'A') {
      throw createError({
        statusCode: 400,
        message: '회원 등급은 M(일반 회원) 또는 A(관리자)만 가능합니다.'
      })
    }

    // Validate member_status is either 'Y' or 'N'
    if (member_status !== 'Y' && member_status !== 'N') {
      throw createError({
        statusCode: 400,
        message: '회원 상태는 Y(활성) 또는 N(비활성)만 가능합니다.'
      })
    }

    const sql = `
      UPDATE member 
      SET grade = ?, member_status = ?, updated_at = NOW() 
      WHERE member_idx = ?
    `

    await pool.query(sql, [grade, member_status, memberId])

    // Fetch updated member data
    const [rows] = await pool.query('SELECT * FROM member WHERE member_idx = ?', [memberId])
    
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
      message: '회원 정보가 성공적으로 업데이트되었습니다.',
      member
    }
  } catch (error) {
    console.error('Error updating member:', error)
    throw createError({
      statusCode: 500,
      message: '회원 정보 업데이트에 실패했습니다.'
    })
  }
})
