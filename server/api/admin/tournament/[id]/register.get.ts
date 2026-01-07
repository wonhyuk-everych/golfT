import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'
import type { TournamentRegistration } from '~/types/admin/tournament'

/**
 * Tournament registration list API for admin
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

  // Get tournament ID from route params
  const tournamentId = event.context.params?.id

  if (!tournamentId) {
    throw createError({
      statusCode: 400,
      message: 'Tournament ID is required'
    })
  }

  // Get query parameters
  const query = getQuery(event)
  const searchWord = query.searchWord as string | undefined
  const startDate = query.startDate as string | undefined
  const endDate = query.endDate as string | undefined

  // Connect to DB
  const pool = getPool()

  try {
    // Build query
    let sql = `
      SELECT 
        reservation_tournament_idx,
        reservation_idx,
        tournament_idx,
        member_idx,
        form_data,
        images,
        total_price,
        reservation_status,
        cancel_reason,
        create_date,
        update_date
      FROM reservation_tournament
      WHERE tournament_idx = ?
    `
    
    const params: (string | number)[] = [tournamentId]

    // Add search filters
    if (searchWord) {
      sql += ` AND JSON_SEARCH(form_data, 'one', ?, NULL, '$**.value') IS NOT NULL`
      params.push(`%${searchWord}%`)
    }

    if (startDate) {
      sql += ` AND DATE(create_date) >= ?`
      params.push(startDate)
    }

    if (endDate) {
      sql += ` AND DATE(create_date) <= ?`
      params.push(endDate)
    }

    sql += ` ORDER BY create_date DESC`

    const [registrations] = await pool.query(sql, params)

    // Parse form_data JSON for each registration
    const parsedRegistrations = (registrations as any[]).map((reg) => {
      return {
        ...reg,
        form_data: typeof reg.form_data === 'string' ? JSON.parse(reg.form_data) : reg.form_data
      }
    })

    return { 
      registrations: parsedRegistrations as TournamentRegistration[]
    }
  } catch (error: any) {
    console.error('Error fetching tournament registrations:', error)
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || 'Internal server error'
    })
  }
})
