import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'
import type { Tournament, TournamentImage } from '~/types/admin/tournament'

/**
 * Tournament detail API for admin
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

  // Connect to DB
  const pool = getPool()

  try {
    // Get tournament details
    const [tournaments] = await pool.query(
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
    const [images] = await pool.query(
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
    tournament.images = images as TournamentImage[]

    return { tournament }
  } catch (error) {
    console.error('Error fetching tournament:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
})
