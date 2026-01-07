import { defineEventHandler } from 'h3'
import { getPool } from '~/server/utils/db'

interface CityCode {
  cityCode: string;
  cityName: string;
  countryCode: string;
}

export default defineEventHandler(async () => {
  const pool = getPool()
  const connection = await pool.getConnection()
  
  try {
    const query = `
      SELECT DISTINCT
        city_code as cityCode,
        city_name as cityName,
        country_code as countryCode
      FROM country_code
      WHERE city_code IS NOT NULL AND city_code != ''
      ORDER BY city_name
    `
    
    const [rows] = await connection.query(query)
    
    return {
      cityCodes: rows as CityCode[]
    }
  } catch (error) {
    console.error('Error fetching city codes:', error)
    throw error
  } finally {
    connection.release()
  }
})
