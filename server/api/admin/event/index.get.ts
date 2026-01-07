import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

/**
 * Events list API for admin
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

  // Connect to DB
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // Get events
    const [events] = await connection.query(
      `SELECT 
        event_idx,
        title,
        start_date,
        end_date,
        event_status,
        created_at,
        created_member_idx,
        updated_at,
        updated_member_idx
      FROM event
      ORDER BY event_idx DESC`
    )

    return { events }
  } catch (error) {
    console.error('Error fetching events:', error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  } finally {
    connection.release()
  }
})
