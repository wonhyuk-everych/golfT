import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

/**
 * Event detail API for admin
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

  // Get event ID from route params
  const eventId = event.context.params?.id

  if (!eventId) {
    throw createError({
      statusCode: 400,
      message: 'Event ID is required'
    })
  }

  // Connect to DB
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // Get event
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
      WHERE event_idx = ?`,
      [eventId]
    )

    if (!events || (events as any[]).length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }

    const eventData = (events as any[])[0]

    // Get event images
    const [images] = await connection.query(
      `SELECT 
        event_image_idx,
        event_idx,
        image_url,
        sort,
        main_yn,
        use_yn,
        created_at,
        created_member_idx,
        updated_at,
        updated_member_idx
      FROM event_image
      WHERE event_idx = ? AND use_yn = 'Y'
      ORDER BY sort ASC`,
      [eventId]
    )

    // Add images to event object
    eventData.images = images || []

    return { event: eventData }
  } catch (error) {
    console.error('Error fetching event:', error)
    
    // Forward the error if it's already a HTTP error
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  } finally {
    connection.release()
  }
})
