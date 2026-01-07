import { ref, onMounted } from 'vue'

// Shared cache across all component instances
const cachedRate = ref<number>(0)
const cacheTimestamp = ref<number>(0)
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

/**
 * Composable for managing Thai Baht exchange rate with caching
 * Caches the rate for 1 hour and shares it across all component instances
 */
export const useExchangeRate = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const setExchangeRate = (rate: number, timestamp: number = Date.now()) => {
    if (typeof rate !== 'number' || rate <= 0) {
      return
    }

    cachedRate.value = rate
    cacheTimestamp.value = timestamp
  }

  /**
   * Fetch exchange rate from API
   */
  const fetchExchangeRate = async () => {
    const now = Date.now()
    
    // Check if cache is still valid
    if (cachedRate.value > 0 && (now - cacheTimestamp.value) < CACHE_DURATION) {
      return cachedRate.value
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/payment/bart-rate')
      setExchangeRate(response.bartRate, now)
      return cachedRate.value
    } catch (err) {
      error.value = 'Failed to fetch exchange rate'
      console.error('Error fetching exchange rate:', err)
      // Return cached value if available, even if expired
      return cachedRate.value || 0
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Format price with cached exchange rate
   */
  const formatPriceWithRate = (price: number, locale: string = 'ko'): string => {
    if (!price) return '0'
    
    const currencyFormat = locale === 'ko' ? 'ko-KR' : 'en-US'
    const formattedPrice = new Intl.NumberFormat(currencyFormat).format(price)
    
    // Calculate Thai Baht based on cached exchange rate
    const bahtPrice = Math.round(price * cachedRate.value)
    const formattedBaht = new Intl.NumberFormat(currencyFormat).format(bahtPrice)
    
    // Return formatted string based on locale
    if (locale === 'ko') {
      return `${formattedBaht} 원`
    } else {
      return `₩ ${formattedBaht}`
    }
  }

  const formatPriceOriginal = (price: number, locale: string = 'ko'): string => {
    if (!price) return '0'
    
    const currencyFormat = locale === 'ko' ? 'ko-KR' : 'en-US'
    const formattedPrice = new Intl.NumberFormat(currencyFormat).format(price)
    
    if (locale === 'ko') {
      return `${formattedPrice} 원`
    } else {
      return `₩ ${formattedPrice}`
    }
  }

  const calculatePriceWithRate = (price: number): number => {
    console.log(price, cachedRate.value)
    return Math.round(price * cachedRate.value)
  }

  /**
   * Clear the cache manually
   */
  const clearCache = () => {
    cachedRate.value = 0
    cacheTimestamp.value = 0
  }

  // Auto-fetch on mount if cache is empty or expired
  onMounted(async () => {
    if (cachedRate.value === 0 || (Date.now() - cacheTimestamp.value) >= CACHE_DURATION) {
      await fetchExchangeRate()
    }
  })

  return {
    exchangeRate: cachedRate,
    isLoading,
    error,
    fetchExchangeRate,
    setExchangeRate,
    formatPriceWithRate,
    formatPriceOriginal,
    calculatePriceWithRate,
    clearCache
  }
}
