import { defineEventHandler } from 'h3'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT private_info_terms, payment_service_terms FROM terms LIMIT 1;
    `
    const [rows] = await connection.query(query)
    return {
      privateInfoTerms: rows[0].private_info_terms,
      paymentServiceTerms: rows[0].payment_service_terms
    }
  } catch (error) {
    console.error('Error fetching terms:', error)
    throw error
  } finally {
    connection.release()
  }
})
