import { defineEventHandler, readBody } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'

interface RefundRequest {
  reservationIdx: number;
  activeType: string; // 'G', 'H', 'C', 'V' 등
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RefundRequest>(event)
  const { reservationIdx, activeType } = body

  if (!reservationIdx || !activeType) {
    return { success: false, error: 'Invalid request.' }
  }

  if (!await testConnection()) {
    return { success: false, error: 'Database connection failed.' }
  }

  const pool = getPool()
  let table = ''
  let idxField = ''

  // 예약 타입별 테이블/필드 지정
  switch (activeType) {
    case 'G':
      table = 'reservation_golf'
      idxField = 'reservation_golf_idx'
      break
    case 'H':
      table = 'reservation_hotel'
      idxField = 'reservation_hotel_idx'
      break
    case 'C':
      table = 'reservation_caddy'
      idxField = 'reservation_caddy_idx'
      break
    case 'V':
      table = 'reservation_callvan'
      idxField = 'reservation_callvan_idx'
      break
    case 'T':
      table = 'reservation_tournament'
      idxField = 'reservation_tournament_idx'
      break
    default:
      return { success: false, error: 'Invalid reservation type.' }
  }

  try {
    const [result] = await pool.query(
      `UPDATE ${table} SET reservation_status = 'REFUND_REQUEST' WHERE ${idxField} = ?`,
      [reservationIdx]
    )
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
