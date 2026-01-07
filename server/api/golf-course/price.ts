import { getPool, testConnection } from '~/server/utils/db'
import { readBody } from 'h3'
import type { RowDataPacket } from 'mysql2/promise'

interface Price extends RowDataPacket {
  golf_monthly_price_idx: number
  caddy_sale_fee: number
  cart_sale_fee: number
  call_suv_one_way_fee: number
  call_suv_round_trip_fee: number
  call_van_one_way_fee: number
  call_van_round_trip_fee: number
  minimum_person: number
  refund_policy: string
  cancel_policy: string
  price_time: PriceTime[]
  price_type: string
}

interface PriceTime extends RowDataPacket {
  price_idx: number
  start_time: string
  end_time: string
  price: number
}

export default defineEventHandler(async (event) => {
  try {
    if (event.method !== 'POST') {
      return {
        success: false,
        message: 'POST method only.'
      }
    }

    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const body = await readBody(event)
    const { courseId, date } = body || {}
    if (!courseId || !date) {
      return { success: false, error: 'courseId, date are required' }
    }

    const pool = getPool()

    // 1. 월별 기본 가격 정보 조회
    const [monthlyRows] = await pool.query<Price[]>(
      `SELECT 
        golf_monthly_price_idx, caddy_sale_fee, cart_sale_fee, call_suv_one_way_fee, 
        call_suv_round_trip_fee, call_van_one_way_fee, call_van_round_trip_fee, refund_policy, cancel_policy,
        minimum_person
       FROM golf_course_monthly_price
       WHERE target_year = YEAR(?) AND target_month = MONTH(?) AND course_idx = ? AND use_yn = 'Y'`,
      [date, date, courseId]
    )
    const monthly = monthlyRows[0] as Price
    if (!monthly) {
      return { success: false, error: 'No monthly price found for this course and date' }
    }

    // 2. 예외 가격 조회
    const [exceptionRows] = await pool.query<PriceTime[]>(
      `SELECT golf_exception_price_idx as price_idx, start_time, end_time, price
       FROM golf_course_exception_price
       WHERE golf_monthly_price_idx = ? AND course_idx = ? AND exception_date = ? AND use_yn = 'Y'`,
      [monthly.golf_monthly_price_idx, courseId, date]
    )
    if (exceptionRows.length > 0) {
      monthly.price_time = exceptionRows
      monthly.price_type = 'exception'
      return {
        success: true,
        price: monthly
      }
    }

    // 3. 요일별 가격 조회
    const dayOfWeek = new Date(date).getDay() // 0: 일요일 ~ 6: 토요일
    const [timeRows] = await pool.query<PriceTime[]>(
      `SELECT golf_time_price_idx as price_idx, start_time, end_time, price
       FROM golf_course_time_price
       WHERE golf_monthly_price_idx = ? AND course_idx = ? AND day_of_week = ? AND use_yn = 'Y'`,
      [monthly.golf_monthly_price_idx, courseId, dayOfWeek]
    )
    if (timeRows.length > 0) {
      monthly.price_time = timeRows
      monthly.price_type = 'weekday'
      return {
        success: true,
        price: monthly
      }
    }
    
    return {
      success: false,
      error: 'No price found for this course and date',
    }
  } catch (error) {
    const err = error as Error
    console.error('Error in price API:', err)
    return {
      success: false,
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})
