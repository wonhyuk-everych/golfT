import { defineEventHandler, readBody, createError } from 'h3'
import type { RowDataPacket } from 'mysql2'
import { getPool } from '~/server/utils/db'
import { clearExchangeRateCache } from '~/utils/exchangeRateCache'

interface UpdateBartRateBody {
  bartRate: number
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

  const body = await readBody<UpdateBartRateBody>(event)
  const bartRate = Number(body?.bartRate)

  if (!Number.isFinite(bartRate) || bartRate <= 0) {
    throw createError({
      statusCode: 400,
      message: '유효한 환율 값을 입력해주세요.'
    })
  }

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT bart_exchange_rate_idx
       FROM bart_exchange_rate
       ORDER BY bart_exchange_rate_idx DESC
       LIMIT 1`
    )

    if (!rows || rows.length === 0) {
      await connection.query(
        `INSERT INTO bart_exchange_rate (bart_exchange_rate)
         VALUES (?)`,
        [bartRate]
      )
    } else {
      const latestIdx = (rows[0] as { bart_exchange_rate_idx: number }).bart_exchange_rate_idx
      await connection.query(
        `UPDATE bart_exchange_rate
         SET bart_exchange_rate = ?, created_at = NOW()
         WHERE bart_exchange_rate_idx = ?`,
        [bartRate, latestIdx]
      )
    }

    await connection.commit()

    // Invalidate in-memory cache so that the new value is served
    clearExchangeRateCache()

    return {
      success: true,
      bartRate
    }
  } catch (error) {
    await connection.rollback()
    console.error('Failed to update Bart exchange rate:', error)
    throw createError({
      statusCode: 500,
      message: '바트 환율을 업데이트하지 못했습니다.'
    })
  } finally {
    connection.release()
  }
})
