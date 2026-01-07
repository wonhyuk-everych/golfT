import { defineEventHandler, createError } from 'h3'
import { getPool } from '~/server/utils/db'
// 인증 필요시 아래 주석 해제 후 getUserSession 사용
// import { getUserSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // const session = await getUserSession(event)
  // if (!session) {
  //   throw createError({ statusCode: 401, message: 'Unauthorized' })
  // }

  const memberId = event.context.params?.id
  if (!memberId) {
    throw createError({ statusCode: 400, message: '회원 ID가 필요합니다.' })
  }

  const body = await readBody(event)
  const { name_kr } = body
  if (!name_kr) {
    throw createError({ statusCode: 400, message: '이름이 필요합니다.' })
  }

  try {
    const pool = getPool()
    const sql = 'UPDATE member SET name_kr = ? WHERE member_idx = ?'
    const [result] = await pool.query(sql, [name_kr, memberId])
    if (result.affectedRows === 0) {
      throw createError({ statusCode: 404, message: '회원을 찾을 수 없습니다.' })
    }
    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 500, message: '이름 변경에 실패했습니다.' })
  }
})
