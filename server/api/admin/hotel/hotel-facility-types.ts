import { defineEventHandler } from 'h3'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT
        hotel_facility_type_idx,
        facility_type,
        text
      FROM hotel_facility_type
      JOIN locale_text ON hotel_facility_type_idx = target_idx 
        AND target_category = 'hotel_facility_type' 
        AND language = 'KO'
        AND use_yn = 'Y'
      ORDER BY facility_type, hotel_facility_type_idx
    `

    const [rows] = await connection.query(query)
    
    return {
      facilityTypes: rows
    }
  } catch (error) {
    console.error('Error fetching hotel facility types:', error)
    throw error
  } finally {
    connection.release()
  }
})
