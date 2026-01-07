import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT
        GF.golf_facility_type_idx,
        GF.icon_name,
        LT.text
      FROM golf_facility_type GF
      JOIN locale_text LT ON GF.golf_facility_type_idx = LT.target_idx
      AND target_category = 'golf_facility_type' AND language = 'KO' AND GF.use_yn = 'Y' AND LT.use_yn = 'Y';
    `

    const [rows] = await connection.query(query)
    
    return {
      facilityTypes: rows
    }
  } catch (error) {
    console.error('Error fetching golf course facility types:', error)
    throw error
  } finally {
    connection.release()
  }
})
