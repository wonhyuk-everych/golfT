import { defineEventHandler, getQuery, createError } from 'h3'
import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

interface MonthlyPriceRow {
  golf_monthly_price_idx: number
  course_idx: number
  target_year: number
  target_month: number
  min_price: number | null
  caddy_fee: number | null
  caddy_sale_fee: number | null
  cart_fee: number | null
  cart_sale_fee: number | null
  call_suv_one_way_fee: number | null
  call_suv_round_trip_fee: number | null
  call_van_one_way_fee: number | null
  call_van_round_trip_fee: number | null
  refund_policy: string | null
  cancel_policy: string | null
  minimum_person: number | null
}

interface TimePriceRow {
  golf_time_price_idx: number
  day_of_week: number
  start_time: string
  end_time: string
  price: number
}

interface ExceptionPriceRow {
  golf_exception_price_idx: number
  exception_date: string
  start_time: string
  end_time: string
  price: number
}

export default defineEventHandler(async (event: H3Event) => {
  // Authentication check (admin only)
  const session = await getUserSession(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  if (session?.user?.role != 'A') {
    throw createError({ statusCode: 401, message: '인증되지 않은 사용자입니다.' })
  }

  const q = getQuery(event)
  const courseIdx = Number(q.courseIdx)
  const year = Number(q.year)
  const month = Number(q.month)

  if (!courseIdx || !year || !month || month < 1 || month > 12) {
    throw createError({ statusCode: 400, message: 'courseIdx, year, month 파라미터가 필요합니다.' })
  }

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // 1) Monthly price
    const [monthlyRows] = await connection.query(
      `SELECT 
        golf_monthly_price_idx,
        course_idx,
        target_year,
        target_month,
        min_price,
        caddy_fee,
        caddy_sale_fee,
        cart_fee,
        cart_sale_fee,
        call_suv_one_way_fee,
        call_suv_round_trip_fee,
        call_van_one_way_fee,
        call_van_round_trip_fee,
        refund_policy,
        cancel_policy,
        minimum_person
      FROM golf_course_monthly_price
      WHERE course_idx = ? AND target_year = ? AND target_month = ? AND use_yn = 'Y'
      LIMIT 1`,
      [courseIdx, year, month]
    )

    const monthly = (monthlyRows as MonthlyPriceRow[])[0] || null

    // Defaults if no monthly row yet
    let monthlyId: number | null = null
    if (monthly) {
      monthlyId = monthly.golf_monthly_price_idx
    }

    // 2) Time-based prices
    let timePrices: TimePriceRow[] = []
    if (monthlyId) {
      const [timeRows] = await connection.query(
        `SELECT 
          golf_time_price_idx,
          day_of_week,
          DATE_FORMAT(start_time, '%H:%i') as start_time,
          DATE_FORMAT(end_time, '%H:%i') as end_time,
          price
        FROM golf_course_time_price
        WHERE golf_monthly_price_idx = ? AND use_yn = 'Y'
        ORDER BY day_of_week ASC, start_time ASC`,
        [monthlyId]
      )
      timePrices = timeRows as TimePriceRow[]
    }

    // 3) Exception (date-specific) prices within the month
    let exceptionPrices: ExceptionPriceRow[] = []
    if (monthlyId) {
      const endDate = new Date(year, month, 0)
      const monthStr = String(month).padStart(2, '0')
      const startStr = `${year}-${monthStr}-01`
      const lastDay = endDate.getDate()
      const endStr = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`

      const [exceptionRows] = await connection.query(
        `SELECT 
          golf_exception_price_idx,
          DATE_FORMAT(exception_date, '%Y-%m-%d') as exception_date,
          DATE_FORMAT(start_time, '%H:%i') as start_time,
          DATE_FORMAT(end_time, '%H:%i') as end_time,
          price
        FROM golf_course_exception_price
        WHERE golf_monthly_price_idx = ? AND use_yn = 'Y' AND exception_date BETWEEN ? AND ?
        ORDER BY exception_date ASC, start_time ASC`,
        [monthlyId, startStr, endStr]
      )
      exceptionPrices = exceptionRows as ExceptionPriceRow[]
    }

    return {
      monthly,
      timePrices,
      exceptionPrices
    }
  } finally {
    connection.release()
  }
})
