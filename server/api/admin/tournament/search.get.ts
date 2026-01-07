import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

/**
 * Tournament search API for admin
 */
export default defineEventHandler(async (event: H3Event) => {
  // Authentication check
  const session = await getUserSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Check if user is authenticated
  if (session?.user?.role != 'A') {
    throw createError({
      statusCode: 401,
      message: '인증되지 않은 사용자입니다.'
    })
  }

  // Get query parameters
  const query = getQuery(event)
  const searchWord = query.searchWord as string | undefined
  const tournamentStatus = query.tournamentStatus as string | undefined
  const startDate = query.startDate as string | undefined
  const endDate = query.endDate as string | undefined

  // Connect to DB
  const pool = getPool()

  try {
    let sql = `
      SELECT 
        t.tournament_idx,
        t.title,
        t.title_en,
        t.price,
        t.start_date,
        t.end_date,
        t.tournament_status,
        t.content,
        t.created_at,
        t.created_member_idx,
        t.updated_at,
        t.updated_member_idx
      FROM tournament t
      WHERE 1=1
    `

    // Add search conditions
    const params: (string | number)[] = []

    if (searchWord) {
      sql += ` AND (t.tournament_idx LIKE ? OR t.title LIKE ? OR t.title_en LIKE ?)`
      params.push(`%${searchWord}%`, `%${searchWord}%`, `%${searchWord}%`)
    }

    if (tournamentStatus) {
      sql += ` AND t.tournament_status = ?`
      params.push(tournamentStatus)
    }

    if (startDate) {
      sql += ` AND t.start_date >= ?`
      params.push(startDate)
    }

    if (endDate) {
      sql += ` AND t.end_date <= ?`
      params.push(endDate)
    }

    sql += ` ORDER BY t.tournament_idx DESC`

    // Execute query
    const [tournaments] = await pool.query(sql, params)

    return { tournaments }
  } catch (error) {
    console.error('Error searching tournaments:', error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})
