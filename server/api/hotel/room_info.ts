import { defineEventHandler, getMethod, getQuery, parseCookies } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'
import type { RowDataPacket } from 'mysql2'

interface DatabaseError extends Error {
  code?: string;
  sqlMessage?: string;
}

export default defineEventHandler(async (event) => {
  try {
    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const method = getMethod(event)

    // Get locale from cookies
    const cookies = parseCookies(event)
    const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'

    // Read params (support GET only for now)
    const query = getQuery(event) as { hotel_room_idx?: string | number }
    const hotel_room_idx = query?.hotel_room_idx ? Number(query.hotel_room_idx) : undefined

    if (method !== 'GET') {
      return { success: false, error: `Method ${method} not supported` }
    }

    if (!hotel_room_idx || Number.isNaN(hotel_room_idx)) {
      return { success: false, error: 'hotel_room_idx is required' }
    }

    const pool = await getPool()

    const facilitiesSql = `
      SELECT
        HFT_name.text,
        HFT.facility_type
      FROM hotel_room H
      JOIN hotel_room_facility HF ON H.hotel_room_idx = HF.hotel_room_idx AND HF.use_yn = 'Y'
      JOIN hotel_facility_type HFT ON HF.hotel_facility_type_idx = HFT.hotel_facility_type_idx
      JOIN locale_text HFT_name ON HFT.hotel_facility_type_idx = HFT_name.target_idx
        AND HFT_name.target_category = 'hotel_facility_type'
        AND HFT_name.language = UPPER(?)
        AND HFT_name.use_yn = 'Y'
      WHERE H.hotel_room_idx = ?
    `
    type FacilityRow = RowDataPacket & { text: string; facility_type: 'H' | 'R' | 'E' }
    const [rows] = await pool.query<FacilityRow[]>(facilitiesSql, [locale, hotel_room_idx])

    const room_facilities: string[] = []
    const extra_options: string[] = []

    rows.forEach((r: FacilityRow) => {
      if (r.facility_type === 'R') room_facilities.push(r.text)
      if (r.facility_type === 'E') extra_options.push(r.text)
    })

    return {
      success: true,
      data: { room_facilities, extra_options }
    }
  } catch (error) {
    const err = error as DatabaseError
    console.error('Unexpected error in hotel room_info API:', err)
    return {
      success: false,
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
});