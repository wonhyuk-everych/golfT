import { defineEventHandler, getQuery, createError } from 'h3'
import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

interface MonthlyRow {
  hotel_price_idx: number
  hotel_idx: number
  hotel_room_idx: number
  target_year: number
  target_month: number
  min_price: number
}

interface WeekRow {
  day_of_week: number
  price: number
}

interface ExceptionRow {
  exception_date: string
  price: number
}

export default defineEventHandler(async (event: H3Event) => {
  // Authentication check
  const session = await getUserSession(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  if (session?.user?.role != 'A') {
    throw createError({ statusCode: 401, message: '인증되지 않은 사용자입니다.' })
  }

  const q = getQuery(event)
  const hotelRoomIdx = Number(q.hotelRoomIdx)
  const year = Number(q.year)
  const month = Number(q.month)

  if (!hotelRoomIdx || !year || !month || month < 1 || month > 12) {
    throw createError({ statusCode: 400, message: 'hotelRoomIdx, year, month 파라미터가 필요합니다.' })
  }

  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    // Get room basic info (and hotel_idx)
    const [roomRows] = await conn.query(
      `SELECT hr.hotel_idx, hr.room_name
       FROM hotel_room hr
       WHERE hr.hotel_room_idx = ? LIMIT 1`,
      [hotelRoomIdx]
    )
    const room = (roomRows as Array<{ hotel_idx: number; room_name: string }>)[0]
    if (!room) {
      throw createError({ statusCode: 404, message: '객실을 찾을 수 없습니다.' })
    }

    // Monthly
    const [monthlyRows] = await conn.query(
      `SELECT 
         hotel_price_idx,
         hotel_idx,
         hotel_room_idx,
         target_year,
         target_month,
         min_price
       FROM hotel_monthly_price
       WHERE hotel_idx = ? AND hotel_room_idx = ? AND target_year = ? AND target_month = ? AND use_yn = 'Y'
       LIMIT 1`,
      [room.hotel_idx, hotelRoomIdx, year, month]
    )
    const monthly = (monthlyRows as MonthlyRow[])[0] || null

    let monthlyId: number | null = null
    if (monthly) monthlyId = monthly.hotel_price_idx

    // Week prices
    let weekPrices: WeekRow[] = []
    if (monthlyId) {
      const [weekRows] = await conn.query(
        `SELECT day_of_week, price
         FROM hotel_week_price
         WHERE hotel_monthly_price_idx = ? AND use_yn = 'Y'
         ORDER BY day_of_week ASC`,
        [monthlyId]
      )
      weekPrices = weekRows as WeekRow[]
    }

    // Exception prices (in month range)
    let exceptionPrices: ExceptionRow[] = []
    if (monthlyId) {
      const endDate = new Date(year, month, 0)
      const monthStr = String(month).padStart(2, '0')
      const startStr = `${year}-${monthStr}-01`
      const lastDay = endDate.getDate()
      const endStr = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`

      const [excRows] = await conn.query(
        `SELECT DATE_FORMAT(exception_date, '%Y-%m-%d') as exception_date, price
         FROM hotel_exception_price
         WHERE hotel_monthly_price_idx = ? AND use_yn = 'Y' AND exception_date BETWEEN ? AND ?
         ORDER BY exception_date ASC`,
        [monthlyId, startStr, endStr]
      )
      exceptionPrices = excRows as ExceptionRow[]
    }

    return {
      room: {
        hotel_idx: room.hotel_idx,
        hotel_room_idx: hotelRoomIdx,
        room_name: room.room_name
      },
      monthly, // can be null
      weekPrices,
      exceptionPrices
    }
  } finally {
    conn.release()
  }
})
