import { defineEventHandler, createError } from 'h3'
import type { RowDataPacket } from 'mysql2'
import { getPool } from '~/server/utils/db'

interface BartExchangeRateRow extends RowDataPacket {
  bart_exchange_rate_idx: number
  bart_exchange_rate: number
  created_at: string
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const role = (session?.user as { role?: string } | undefined)?.role
  if (role !== 'A') {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const [rows] = await connection.query<BartExchangeRateRow[]>(
      `SELECT bart_exchange_rate_idx, bart_exchange_rate, created_at
       FROM bart_exchange_rate
       ORDER BY bart_exchange_rate_idx DESC
       LIMIT 1`
    )

    if (!rows || rows.length === 0) {
      return {
        bartRate: null,
        createdAt: null
      }
    }

    const latest = rows[0]

    return {
      bartRate: Number(latest.bart_exchange_rate),
      createdAt: latest.created_at
    }
  } catch (error) {
    console.error('Failed to fetch Bart exchange rate:', error)
    throw createError({
      statusCode: 500,
      message: '바트 환율 정보를 불러오는데 실패했습니다.'
    })
  } finally {
    connection.release()
  }
})
