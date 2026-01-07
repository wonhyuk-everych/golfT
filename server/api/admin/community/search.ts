import { defineEventHandler, getQuery, createError } from 'h3'
import { getPool } from '~/server/utils/db'
import type { Community } from '~/types/admin/community'

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

  const query = getQuery(event)
  const searchWord = query.searchWord as string || ''
  const countryCodeIdx = parseInt(query.countryCodeIdx as string) || 0
  const memberIdx = parseInt(query.memberIdx as string) || 0
  const useYn = query.useYn as string || ''

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    let sqlQuery = `
      SELECT 
        c.community_idx,
        c.country_code_idx,
        c.member_idx,
        c.title,
        c.content,
        cc.country_name,
        c.use_yn,
        c.created_at,
        m.name_kr as member_name
      FROM 
        community c
        LEFT JOIN country_code cc ON c.country_code_idx = cc.country_code_idx
        LEFT JOIN member m ON c.member_idx = m.member_idx
      WHERE 1=1
    `
    
    const params: any[] = []

    if (searchWord) {
      sqlQuery += ' AND (c.title LIKE ? OR c.content LIKE ?)'
      params.push(`%${searchWord}%`, `%${searchWord}%`)
    }

    if (countryCodeIdx) {
      sqlQuery += ' AND c.country_code_idx = ?'
      params.push(countryCodeIdx)
    }

    if (memberIdx) {
      sqlQuery += ' AND c.member_idx = ?'
      params.push(memberIdx)
    }

    if (useYn) {
      sqlQuery += ' AND c.use_yn = ?'
      params.push(useYn)
    }

    sqlQuery += ' ORDER BY c.created_at DESC'

    const [rows] = await connection.query(sqlQuery, params)
    
    return {
      communities: rows as Community[]
    }
  } catch (error) {
    console.error('Error searching communities:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to search communities'
    })
  } finally {
    connection.release()
  }
})
