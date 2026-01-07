import { defineEventHandler } from 'h3'
import { getPool } from '~/server/utils/db'

interface CountryCode {
  countryCodeIdx: number;
  countryCode: string;
  countryName: string;
}

export default defineEventHandler(async () => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT DISTINCT
        country_code as countryCode,
        country_name as countryName,
        country_code_idx
      FROM country_code
      GROUP BY country_code
      ORDER BY country_name
    `

    const [rows] = await connection.query(query)
    
    return {
      countryCodes: rows as CountryCode[]
    }
  } catch (error) {
    console.error('Error fetching country codes:', error)
    throw error
  } finally {
    connection.release()
  }
})
