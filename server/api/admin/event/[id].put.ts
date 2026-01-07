import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

interface EventImage {
  event_image_idx?: number
  event_idx?: number
  image_url: string
  sort: number
  main_yn: string
  use_yn: string
}

interface Event {
  event_idx: number
  title: string
  start_date: string
  end_date: string
  event_status: string
  created_at?: string
  created_member_idx?: number
  updated_at?: string | null
  updated_member_idx?: number | null
  images?: EventImage[]
}

/**
 * Event update API for admin
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

  const updatedMemberIdx = session.user.member_idx
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

  // Get request body
  const body = await readBody(event) as Event
  
  if (!body) {
    throw createError({
      statusCode: 400,
      message: 'Request body is required'
    })
  }

  // Connect to DB
  const pool = getPool()
  
  // Start transaction
  const connection = await pool.getConnection()
  await connection.beginTransaction()

  try {
    // Format dates to MySQL compatible format (YYYY-MM-DD)
    const formatDate = (dateString: string) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };
    
    // Update event data
    await connection.query(
      `UPDATE event SET
        title = ?,
        start_date = ?,
        end_date = ?,
        event_status = ?,
        updated_at = NOW(),
        updated_member_idx = ?
      WHERE event_idx = ?`,
      [
        body.title,
        formatDate(body.start_date),
        formatDate(body.end_date),
        body.event_status,
        updatedMemberIdx,
        eventId
      ]
    )

    // Handle images if provided
    if (body.images && body.images.length > 0) {
      // Delete existing images
      await connection.query(
        `DELETE FROM event_image WHERE event_idx = ?`,
        [eventId]
      )

      // Insert new images
      const imageValues = body.images.map(img => [
        eventId,
        img.image_url,
        img.sort,
        img.main_yn,
        img.use_yn,
        updatedMemberIdx
      ])

      await connection.query(
        `INSERT INTO event_image (
          event_idx,
          image_url,
          sort,
          main_yn,
          use_yn,
          created_member_idx
        ) VALUES ?`,
        [imageValues]
      )
    }

    // Commit transaction
    await connection.commit()

    // Get the updated event with images
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

    if (!events || (events as Event[]).length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }

    const eventData = (events as Event[])[0]

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
      WHERE event_idx = ?
      ORDER BY sort ASC`,
      [eventId]
    )

    // Add images to event object
    eventData.images = images

    return { event: eventData }
  } catch (error) {
    // Rollback transaction in case of error
    await connection.rollback()
    
    console.error('Error updating event:', error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  } finally {
    connection.release()
  }
})
