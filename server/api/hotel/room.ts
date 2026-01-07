import { defineEventHandler, getQuery, parseCookies, readBody } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'

interface DatabaseError extends Error {
  code?: string;
  sqlMessage?: string;
}

interface RoomParams {
  hotelIdx: string | number
  checkinDate: string
  checkoutDate: string
  roomCount?: number | string
  adultCount?: number | string
  childrenCount?: number | string
}

export default defineEventHandler(async (event) => {
  try {
    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const method = (event.node.req.method || 'GET').toUpperCase()
    let hotelIdx: string | number | undefined
    let checkinDate: string | undefined
    let checkoutDate: string | undefined
    let roomCount: number | string | undefined = 1
    let adultCount: number | string | undefined = 2
    let childrenCount: number | string | undefined = 0

    if (method === 'POST') {
      const body = await readBody<Partial<RoomParams>>(event).catch(() => ({} as Partial<RoomParams>))
      ;({ hotelIdx, checkinDate, checkoutDate, roomCount = 1, adultCount = 2, childrenCount = 0 } = body || {})
    } else {
      const query = getQuery(event) as Partial<RoomParams>
      ;({ hotelIdx, checkinDate, checkoutDate, roomCount = 1, adultCount = 2, childrenCount = 0 } = query || {})
    }

    // Get locale from cookies
    const cookies = parseCookies(event)
    const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'
    
    // Validate required parameters
    if (!hotelIdx) {
      return { success: false, error: 'Hotel ID is required' }
    }
    
    if (!checkinDate || !checkoutDate) {
      return { success: false, error: 'Check-in and check-out dates are required' }
    }

    // Validate date range: check-in before check-out and maximum 30 nights
    const ci = new Date(checkinDate as string)
    const co = new Date(checkoutDate as string)
    if (isNaN(ci.getTime()) || isNaN(co.getTime())) {
      return { success: false, error: 'Invalid date format. Use YYYY-MM-DD' }
    }
    // Nights = difference in days (checkout exclusive)
    const msPerDay = 24 * 60 * 60 * 1000
    const nights = Math.round((co.getTime() - ci.getTime()) / msPerDay)
    if (nights <= 0) {
      return { success: false, error: 'Check-out must be after check-in' }
    }
    if (nights > 30) {
      return { success: false, error: 'Maximum stay is 30 nights' }
    }

    const pool = await getPool()

    const endInclusive = new Date(co.getTime() - 1) // day before checkout
    const months: Array<{ y: number; m: number }> = []
    {
      const cur = new Date(ci.getFullYear(), ci.getMonth(), 1)
      const last = new Date(endInclusive.getFullYear(), endInclusive.getMonth(), 1)
      while (cur.getTime() <= last.getTime()) {
        months.push({ y: cur.getFullYear(), m: cur.getMonth() + 1 })
        cur.setMonth(cur.getMonth() + 1)
      }
    }

    const existsClauses = months
      .map((ym, idx) => `AND EXISTS (SELECT 1 FROM hotel_monthly_price mp${idx + 1}\n        WHERE mp${idx + 1}.hotel_room_idx = hr.hotel_room_idx\n        AND mp${idx + 1}.hotel_idx = hr.hotel_idx\n        AND mp${idx + 1}.target_year = ? AND mp${idx + 1}.target_month = ?)`)
      .join('\n      ')

    const roomsSql = `
      WITH RECURSIVE date_range AS (
        SELECT DATE(?) AS target_date
        UNION ALL
        SELECT DATE_ADD(target_date, INTERVAL 1 DAY)
        FROM date_range
        WHERE DATE_ADD(target_date, INTERVAL 1 DAY) < DATE(?)
      )
      SELECT
        hr.hotel_room_idx,
        hr.room_name,
        hr.room_name_en,
        hr.adult,
        hr.children,
        hr.breakfast_yn,
        hr.bed_type,
        hr.view_type,
        hr.refund_yn,
        SUM(COALESCE(ep.price, wp.price)) AS room_sale_price
      FROM hotel_room hr
      JOIN hotel_monthly_price mp
        ON mp.hotel_room_idx = hr.hotel_room_idx
        AND mp.hotel_idx = hr.hotel_idx
      JOIN date_range dr
        ON mp.target_year = YEAR(dr.target_date)
        AND mp.target_month = MONTH(dr.target_date)
      LEFT JOIN hotel_week_price wp
        ON wp.hotel_monthly_price_idx = mp.hotel_price_idx
        AND wp.day_of_week = DAYOFWEEK(dr.target_date) - 1 AND wp.use_yn = 'Y'
      LEFT JOIN hotel_exception_price ep
        ON ep.hotel_monthly_price_idx = mp.hotel_price_idx
        AND ep.exception_date = dr.target_date AND ep.use_yn = 'Y'
      WHERE hr.hotel_idx = ?
        AND hr.use_yn = 'Y'
        AND hr.adult >= ?
        AND hr.children >= ?
        AND COALESCE(ep.price, wp.price) IS NOT NULL
      ${existsClauses}
      GROUP BY
        hr.hotel_room_idx
      ORDER BY room_sale_price ASC;
    `

    const params: (string | number)[] = [
      checkinDate,
      checkoutDate,
      hotelIdx,
      Number(adultCount),
      Number(childrenCount),
      ...months.flatMap(ym => [ym.y, ym.m])
    ]

    console.log('roomsSql:', roomsSql)
    console.log('params:', params)

    const [roomsRows] = await pool.query(roomsSql, params)

    // 객실이 없는 경우
    if (!roomsRows || roomsRows.length === 0) {
      return { 
        success: true, 
        data: { 
          rooms: [],
          checkinDate,
          checkoutDate,
          roomCount,
          adultCount,
          childrenCount
        } 
      }
    }

    // 각 객실별 이미지 조회
    for (const room of roomsRows) {
      const roomImages = []
      const roomImagesSql = `
        SELECT
          HI.image_url
        FROM hotel_image HI
        WHERE HI.hotel_idx = ? AND HI.hotel_room_idx = ? AND HI.use_yn = 'Y'
        ORDER BY HI.sort
      `
      const [roomImagesRows] = await pool.query(roomImagesSql, [hotelIdx, room.hotel_room_idx])
      if (roomImagesRows.length > 0) {
        roomImages.push(...roomImagesRows)
      }
      room.room_images = roomImages
    }

    // 바트 환율 정보 조회
    const bartRateSql = `
      SELECT bart_exchange_rate 
      FROM bart_exchange_rate 
      ORDER BY created_at DESC 
      LIMIT 1
    `
    const [bartRateRows] = await pool.query(bartRateSql)
    const bartPrice = bartRateRows.length > 0 ? bartRateRows[0].bart_exchange_rate : 0.023

    return { 
      success: true, 
      data: { 
        rooms: roomsRows,
        checkinDate,
        checkoutDate,
        roomCount,
        adultCount,
        childrenCount,
        bartPrice
      } 
    }
  } catch (error) {
    const err = error as DatabaseError
    console.error('Unexpected error in hotel room API:', err)
    return {
      success: false,
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})
