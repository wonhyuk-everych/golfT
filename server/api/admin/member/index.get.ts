import { defineEventHandler, getQuery, createError } from 'h3'
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
    const query = getQuery(event)
    
    const {
      searchWord = '',
      memberStatus = '',
      grade = '',
      startDate = '',
      endDate = ''
    } = query

    let sql = `
      SELECT * 
      FROM member
      WHERE 1=1
    `
    const params = []

    // Apply filters
    if (searchWord) {
      sql += `
        AND (
          id LIKE ? 
          OR name_kr LIKE ? 
          OR name_en LIKE ? 
          OR email LIKE ? 
          OR phone LIKE ?
        )
      `
      const searchPattern = `%${searchWord}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern)
    }

    if (memberStatus) {
      sql += ` AND member_status = ? `
      params.push(memberStatus)
    }

    if (grade) {
      sql += ` AND grade = ? `
      params.push(grade)
    }

    if (startDate) {
      sql += ` AND created_at >= ? `
      params.push(`${startDate} 00:00:00`)
    }

    if (endDate) {
      sql += ` AND created_at <= ? `
      params.push(`${endDate} 23:59:59`)
    }

    // Add sorting
    sql += ` ORDER BY created_at DESC`

    const [members] = await pool.query(sql, params)

    return {
      members
    }
  } catch (error) {
    console.error('Error fetching members:', error)
    throw createError({
      statusCode: 500,
      message: '회원 목록을 불러오는데 실패했습니다.'
    })
  }
})
