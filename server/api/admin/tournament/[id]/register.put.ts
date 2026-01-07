import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event: H3Event) => {
  const tournamentId = event.context.params?.id
  const body = await readBody(event)
  const { reservationIds, status } = body

  if (!tournamentId) {
    throw createError({
      statusCode: 400,
      message: 'Tournament ID is required'
    })
  }

  if (!reservationIds || !Array.isArray(reservationIds) || reservationIds.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Reservation IDs are required'
    })
  }

  if (!status) {
    throw createError({
      statusCode: 400,
      message: 'Status is required'
    })
  }

  // Validate status
  const validStatuses = ['PENDING', 'COMPLETE', 'USED', 'REFUND_REQUEST', 'CANCELLED']
  if (!validStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid status value'
    })
  }

  // Connect to DB
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // Update reservation status for all selected reservations
    const placeholders = reservationIds.map(() => '?').join(',')
    const query = `
      UPDATE reservation_tournament 
      SET reservation_status = ?
      WHERE reservation_idx IN (${placeholders})
      AND tournament_idx = ?
    `
    
    const params = [status, ...reservationIds, tournamentId]
    const [result] = await connection.query(query, params)

    return {
      success: true,
      message: 'Reservation status updated successfully',
      updatedCount: (result as any).affectedRows
    }
  } catch (error) {
    console.error('Error updating reservation status:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update reservation status'
    })
  } finally {
    connection.release()
  }
})
