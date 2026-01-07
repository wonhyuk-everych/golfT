import { defineEventHandler, readBody, createError } from 'h3'
import type { H3Event } from 'h3'
import { getPool } from '~/server/utils/db'

interface SaveBody {
  hotelRoomIdx: number
  year: number
  month: number
  monthly: {
    minPrice: number | null
  }
  weekSlots: Array<{
    daysOfWeek: number[] // 0..6 (Sun..Sat)
    price: number
  }>
  exceptionSlots: Array<{
    date: string // 'YYYY-MM-DD'
    price: number
  }>
}

export default defineEventHandler(async (event: H3Event) => {
  // Admin auth
  const session = await getUserSession(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })
  if (session?.user?.role !== 'A') throw createError({ statusCode: 401, message: '인증되지 않은 사용자입니다.' })
  const memberIdx = session.user.member_idx

  const body = await readBody<SaveBody>(event)
  if (!body || !body.hotelRoomIdx || !body.year || !body.month) {
    throw createError({ statusCode: 400, message: 'hotelRoomIdx, year, month, monthly 정보가 필요합니다.' })
  }
  if (body.month < 1 || body.month > 12) {
    throw createError({ statusCode: 400, message: 'month는 1-12 범위여야 합니다.' })
  }
  const minPrice = body.monthly?.minPrice
  if (minPrice == null || Number.isNaN(minPrice)) {
    throw createError({ statusCode: 400, message: '월 최소 가격(minPrice)을 입력하세요.' })
  }

  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    // Find room to get hotel_idx
    const [roomRows] = await conn.query(
      `SELECT hotel_idx FROM hotel_room WHERE hotel_room_idx = ? LIMIT 1`,
      [body.hotelRoomIdx]
    )
    const room = (roomRows as Array<{ hotel_idx: number }>)[0]
    if (!room) throw createError({ statusCode: 404, message: '객실을 찾을 수 없습니다.' })

    // Check existing monthly row
    const [mRows] = await conn.query(
      `SELECT hotel_price_idx FROM hotel_monthly_price 
       WHERE hotel_idx = ? AND hotel_room_idx = ? AND target_year = ? AND target_month = ? AND use_yn = 'Y' LIMIT 1`,
      [room.hotel_idx, body.hotelRoomIdx, body.year, body.month]
    )
    const existingMonthly = (mRows as Array<{ hotel_price_idx: number }>)[0]

    let monthlyId: number
    if (existingMonthly) {
      // Update
      await conn.query(
        `UPDATE hotel_monthly_price SET min_price = ?, updated_member_idx = ?
         WHERE hotel_price_idx = ?`,
        [minPrice, memberIdx, existingMonthly.hotel_price_idx]
      )
      monthlyId = existingMonthly.hotel_price_idx
    } else {
      const [res] = await conn.query(
        `INSERT INTO hotel_monthly_price (
           hotel_idx, hotel_room_idx, target_year, target_month, min_price, use_yn, created_member_idx, updated_member_idx
         ) VALUES (?, ?, ?, ?, ?, 'Y', ?, ?)`,
        [room.hotel_idx, body.hotelRoomIdx, body.year, body.month, minPrice, memberIdx, memberIdx]
      )
      // @ts-expect-error - mysql2 ResultSetHeader has insertId on this driver
      monthlyId = res.insertId
      if (!monthlyId) {
        const [re] = await conn.query(
          `SELECT hotel_price_idx FROM hotel_monthly_price 
           WHERE hotel_idx = ? AND hotel_room_idx = ? AND target_year = ? AND target_month = ? AND use_yn = 'Y' LIMIT 1`,
          [room.hotel_idx, body.hotelRoomIdx, body.year, body.month]
        )
        const row = (re as Array<{ hotel_price_idx: number }>)[0]
        if (!row) throw createError({ statusCode: 500, message: '월별 가격 생성 실패' })
        monthlyId = row.hotel_price_idx
      }
    }

    // Replace week prices
    await conn.query(
      `UPDATE hotel_week_price SET use_yn = 'N', updated_member_idx = ? WHERE hotel_monthly_price_idx = ?`,
      [memberIdx, monthlyId]
    )

    if (Array.isArray(body.weekSlots)) {
      const insertWeekSql = `
        INSERT INTO hotel_week_price (
          hotel_monthly_price_idx, hotel_idx, hotel_room_idx, day_of_week, price, use_yn, created_member_idx, updated_member_idx
        ) VALUES (?, ?, ?, ?, ?, 'Y', ?, ?)
      `
      for (const slot of body.weekSlots) {
        if (!slot || !slot.price || !Array.isArray(slot.daysOfWeek)) continue
        for (const dow of slot.daysOfWeek) {
          await conn.query(insertWeekSql, [
            monthlyId,
            room.hotel_idx,
            body.hotelRoomIdx,
            dow,
            slot.price,
            memberIdx,
            memberIdx,
          ])
        }
      }
    }

    // Replace exception prices
    await conn.query(
      `UPDATE hotel_exception_price SET use_yn = 'N', updated_member_idx = ? WHERE hotel_monthly_price_idx = ?`,
      [memberIdx, monthlyId]
    )

    if (Array.isArray(body.exceptionSlots)) {
      const insertExcSql = `
        INSERT INTO hotel_exception_price (
          hotel_monthly_price_idx, hotel_idx, hotel_room_idx, exception_date, price, use_yn, created_member_idx, updated_member_idx
        ) VALUES (?, ?, ?, ?, ?, 'Y', ?, ?)
      `
      for (const ex of body.exceptionSlots) {
        if (!ex || !ex.date || !ex.price) continue
        await conn.query(insertExcSql, [
          monthlyId,
          room.hotel_idx,
          body.hotelRoomIdx,
          ex.date,
          ex.price,
          memberIdx,
          memberIdx,
        ])
      }
    }

    await conn.commit()
    return { success: true, hotelMonthlyPriceIdx: monthlyId }
  } catch (err) {
    await conn.rollback()
    console.error('Error saving hotel room prices:', err)
    throw createError({ statusCode: 500, message: '가격 저장 중 오류가 발생했습니다.' })
  } finally {
    conn.release()
  }
})
