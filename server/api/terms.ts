import { defineEventHandler } from 'h3'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // Only allow predefined columns to prevent SQL injection
    const url = new URL(event.node.req.url || '', 'http://localhost')
    const typeParam = url.searchParams.get('type') || 'use'
    const columnMap: Record<string, string> = {
      use: 'use_terms',
      privacy: 'private_info_terms',
      payment: 'payment_service_terms'
    }

    const column = columnMap[typeParam] || columnMap.use

    const query = `SELECT ${column} AS html FROM terms LIMIT 1;`
    const [rows] = await connection.query(query) as [Array<{ html: string }>, unknown]

    return { html: rows?.[0]?.html || '' }
  } catch (error) {
    console.error('Error fetching terms:', error)
    throw error
  } finally {
    connection.release()
  }
})
