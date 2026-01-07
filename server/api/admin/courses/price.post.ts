import { defineEventHandler, readBody, createError } from 'h3'
import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

interface SaveBody {
  courseIdx: number
  year: number
  month: number
  monthly: {
    minPrice?: number | null
    caddyFee?: number | null
    caddySaleFee?: number | null
    cartFee?: number | null
    cartSaleFee?: number | null
    callSuvOneWayFee?: number | null
    callSuvRoundTripFee?: number | null
    callVanOneWayFee?: number | null
    callVanRoundTripFee?: number | null
    refundPolicy?: string | null
    cancelPolicy?: string | null
    minimumPerson?: number | null
  }
  timeSlots: Array<{
    daysOfWeek: number[] // 0..6 (Sun..Sat)
    startTime: string // 'HH:mm'
    endTime: string   // 'HH:mm'
    price: number
  }>
  exceptionSlots: Array<{
    date: string // 'YYYY-MM-DD'
    startTime: string
    endTime: string
    price: number
  }>
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
  const updatedMemberIdx = session.user.member_idx

  const body = await readBody(event) as SaveBody
  if (!body || !body.courseIdx || !body.year || !body.month) {
    throw createError({ statusCode: 400, message: 'courseIdx, year, month, monthly 정보가 필요합니다.' })
  }
  if (body.month < 1 || body.month > 12) {
    throw createError({ statusCode: 400, message: 'month는 1-12 범위여야 합니다.' })
  }

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // Upsert monthly price row (use_yn = 'Y' unique)
    const insertMonthlySql = `
      INSERT INTO golf_course_monthly_price (
        course_idx, target_year, target_month, min_price,
        caddy_fee, caddy_sale_fee, cart_fee, cart_sale_fee,
        call_suv_one_way_fee, call_suv_round_trip_fee,
        call_van_one_way_fee, call_van_round_trip_fee,
        refund_policy, cancel_policy, minimum_person,
        use_yn, created_member_idx, updated_member_idx
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Y', ?, ?)
      ON DUPLICATE KEY UPDATE
        min_price = VALUES(min_price),
        caddy_fee = VALUES(caddy_fee),
        caddy_sale_fee = VALUES(caddy_sale_fee),
        cart_fee = VALUES(cart_fee),
        cart_sale_fee = VALUES(cart_sale_fee),
        call_suv_one_way_fee = VALUES(call_suv_one_way_fee),
        call_suv_round_trip_fee = VALUES(call_suv_round_trip_fee),
        call_van_one_way_fee = VALUES(call_van_one_way_fee),
        call_van_round_trip_fee = VALUES(call_van_round_trip_fee),
        refund_policy = VALUES(refund_policy),
        cancel_policy = VALUES(cancel_policy),
        minimum_person = VALUES(minimum_person),
        updated_member_idx = VALUES(updated_member_idx)
    `

    const m = body.monthly || {}

    await connection.query(insertMonthlySql, [
      body.courseIdx,
      body.year,
      body.month,
      m.minPrice ?? null,
      m.caddyFee ?? null,
      m.caddySaleFee ?? null,
      m.cartFee ?? null,
      m.cartSaleFee ?? null,
      m.callSuvOneWayFee ?? null,
      m.callSuvRoundTripFee ?? null,
      m.callVanOneWayFee ?? null,
      m.callVanRoundTripFee ?? null,
      m.refundPolicy ?? null,
      m.cancelPolicy ?? null,
      m.minimumPerson ?? null,
      updatedMemberIdx,
      updatedMemberIdx,
    ])

    // Get monthly id (select again)
    const [monthlyRows] = await connection.query(
      `SELECT golf_monthly_price_idx FROM golf_course_monthly_price 
       WHERE course_idx = ? AND target_year = ? AND target_month = ? AND use_yn = 'Y' LIMIT 1`,
      [body.courseIdx, body.year, body.month]
    )
    const monthlyId = (monthlyRows as Array<{ golf_monthly_price_idx: number }>)[0]?.golf_monthly_price_idx
    if (!monthlyId) {
      throw createError({ statusCode: 500, message: '월별 가격 정보를 생성/조회하지 못했습니다.' })
    }

    // Replace time-based prices for this monthly
    await connection.query(
      `UPDATE golf_course_time_price SET use_yn = 'N', updated_member_idx = ? WHERE golf_monthly_price_idx = ?`,
      [updatedMemberIdx, monthlyId]
    )

    if (Array.isArray(body.timeSlots)) {
      const insertTimeSql = `
        INSERT INTO golf_course_time_price (
          golf_monthly_price_idx, course_idx, day_of_week, start_time, end_time, price, use_yn, created_member_idx, updated_member_idx
        ) VALUES (?, ?, ?, ?, ?, ?, 'Y', ?, ?)
      `

      for (const slot of body.timeSlots) {
        if (!slot || !slot.startTime || !slot.endTime || !slot.price || !Array.isArray(slot.daysOfWeek)) continue
        for (const dow of slot.daysOfWeek) {
          await connection.query(insertTimeSql, [
            monthlyId,
            body.courseIdx,
            dow,
            slot.startTime + ':00',
            slot.endTime + ':00',
            slot.price,
            updatedMemberIdx,
            updatedMemberIdx,
          ])
        }
      }
    }

    // Replace exception prices for this monthly
    await connection.query(
      `UPDATE golf_course_exception_price SET use_yn = 'N', updated_member_idx = ? WHERE golf_monthly_price_idx = ?`,
      [updatedMemberIdx, monthlyId]
    )

    if (Array.isArray(body.exceptionSlots)) {
      const insertExcSql = `
        INSERT INTO golf_course_exception_price (
          golf_monthly_price_idx, course_idx, exception_date, start_time, end_time, price, use_yn, created_member_idx, updated_member_idx
        ) VALUES (?, ?, ?, ?, ?, ?, 'Y', ?, ?)
      `
      for (const ex of body.exceptionSlots) {
        if (!ex || !ex.date || !ex.startTime || !ex.endTime || !ex.price) continue
        await connection.query(insertExcSql, [
          monthlyId,
          body.courseIdx,
          ex.date,
          ex.startTime + ':00',
          ex.endTime + ':00',
          ex.price,
          updatedMemberIdx,
          updatedMemberIdx,
        ])
      }
    }

    await connection.commit()

    return { success: true, golfMonthlyPriceIdx: monthlyId }
  } catch (err) {
    await connection.rollback()
    console.error('Error saving course prices:', err)
    throw createError({ statusCode: 500, message: '가격 저장 중 오류가 발생했습니다.' })
  } finally {
    connection.release()
  }
})
