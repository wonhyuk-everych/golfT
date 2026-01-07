import { defineEventHandler } from 'h3'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT bart_exchange_rate FROM bart_exchange_rate ORDER BY bart_exchange_rate_idx DESC LIMIT 1;
    `
    const [rows] = await connection.query(query)
    return {
      bartRate: rows[0].bart_exchange_rate
    }
  } catch (error) {
    console.error('Error fetching bart rate:', error)
    throw error
  } finally {
    connection.release()
  }
})
