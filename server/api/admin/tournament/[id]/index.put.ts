import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'
import type { Tournament } from '~/types/admin/tournament'

/**
 * Tournament update API for admin
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

  // Get tournament ID from route params
  const tournamentId = event.context.params?.id

  if (!tournamentId) {
    throw createError({
      statusCode: 400,
      message: 'Tournament ID is required'
    })
  }

  // Get request body
  const body = await readBody(event) as Tournament
  
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
    
    // Update tournament data
    await connection.query(
      `UPDATE tournament SET
        title = ?,
        title_en = ?,
        price = ?,
        price_explain = ?,
        start_date = ?,
        end_date = ?,
        tournament_status = ?,
        image_use_yn = ?,
        image_title = ?,
        image_important_yn = ?,
        content = ?,
        updated_at = NOW(),
        updated_member_idx = ?
      WHERE tournament_idx = ?`,
      [
        body.title,
        body.title_en,
        body.price,
        body.price_explain,
        formatDate(body.start_date),
        formatDate(body.end_date),
        body.tournament_status,
        body.image_use_yn,
        body.image_title,
        body.image_important_yn,
        body.content,
        updatedMemberIdx,
        tournamentId
      ]
    )

    // Handle images if provided
    if (body.images && body.images.length > 0) {
      // Delete existing images
      await connection.query(
        `DELETE FROM tournament_image WHERE tournament_idx = ?`,
        [tournamentId]
      )

      // Insert new images
      const imageValues = body.images.map(img => [
        tournamentId,
        img.image_url,
        img.image_type,
        img.sort,
        img.main_yn,
        img.use_yn,
        updatedMemberIdx
      ])

      await connection.query(
        `INSERT INTO tournament_image (
          tournament_idx,
          image_url,
          image_type,
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

    // Get the updated tournament with images
    const [tournaments] = await connection.query(
      `SELECT 
        tournament_idx,
        title,
        title_en,
        price,
        price_explain,
        start_date,
        end_date,
        tournament_status,
        image_use_yn,
        image_title,
        image_important_yn,
        content,
        created_at,
        created_member_idx,
        updated_at,
        updated_member_idx
      FROM tournament
      WHERE tournament_idx = ?`,
      [tournamentId]
    )

    if (!tournaments || (tournaments as Tournament[]).length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Tournament not found'
      })
    }

    const tournament = (tournaments as Tournament[])[0]

    // Get tournament images
    const [images] = await connection.query(
      `SELECT 
        tournament_image_idx,
        tournament_idx,
        image_url,
        image_type,
        sort,
        main_yn,
        use_yn,
        created_at,
        created_member_idx,
        updated_at,
        updated_member_idx
      FROM tournament_image
      WHERE tournament_idx = ?
      ORDER BY image_type, sort ASC`,
      [tournamentId]
    )

    // Add images to tournament object
    tournament.images = images

    return { tournament }
  } catch (error) {
    // Rollback transaction in case of error
    await connection.rollback()
    
    console.error('Error updating tournament:', error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  } finally {
    connection.release()
  }
})
