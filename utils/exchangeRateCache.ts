import { getPool } from '~/server/utils/db'

interface CacheEntry {
  value: number
  timestamp: number
}

interface ExchangeRateRow {
  bart_exchange_rate: number
}

// Cache storage
let exchangeRateCache: CacheEntry | null = null

// Cache duration: 1 hour (in milliseconds)
const CACHE_DURATION = 60 * 60 * 1000

/**
 * Get the Thai Baht exchange rate from cache or database
 * Caches the value for 1 hour
 * @returns The current exchange rate
 */
export async function getBartExchangeRate(): Promise<number> {
  const now = Date.now()
  
  // Check if cache exists and is still valid
  if (exchangeRateCache && (now - exchangeRateCache.timestamp) < CACHE_DURATION) {
    return exchangeRateCache.value
  }
  
  // Cache is expired or doesn't exist, fetch from database
  const pool = getPool()
  const connection = await pool.getConnection()
  
  try {
    const query = `
      SELECT bart_exchange_rate FROM bart_exchange_rate ORDER BY bart_exchange_rate_idx DESC LIMIT 1;
    `
    const [rows] = await connection.query(query) as [ExchangeRateRow[], unknown]
    
    const exchangeRate = rows[0]?.bart_exchange_rate || 0
    
    // Update cache
    exchangeRateCache = {
      value: exchangeRate,
      timestamp: now
    }
    
    return exchangeRate
  } catch (error) {
    console.error('Error fetching bart exchange rate:', error)
    // If there's an error but we have cached data, return it even if expired
    if (exchangeRateCache) {
      return exchangeRateCache.value
    }
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Clear the exchange rate cache
 * Useful for manual cache invalidation
 */
export function clearExchangeRateCache(): void {
  exchangeRateCache = null
}
