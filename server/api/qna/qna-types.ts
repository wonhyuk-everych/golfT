import { defineEventHandler } from 'h3'
import { getPool } from '~/server/utils/db'

interface QnaType {
  qna_type_idx: number;
  name_kr: string;
  name_en: string;
}

export default defineEventHandler(async () => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT qna_type_idx, name_kr, name_en FROM qna_type
    `
    const [rows] = await connection.query(query)
    return {
      qnaTypes: rows as QnaType[]
    }
  } catch (error) {
    console.error('Error fetching QnA types:', error)
    throw error
  } finally {
    connection.release()
  }
})
