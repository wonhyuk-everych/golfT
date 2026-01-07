import { getQuery, createError, readBody, getMethod } from 'h3'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  // Support both GET (query) and POST (JSON body)
  const method = getMethod(event).toUpperCase()
  let city: string | undefined
  let count: string | number | undefined
  let difficulty: string | undefined

  if (method === 'POST') {
    const body = await readBody(event)
    city = body?.city
    count = body?.count
    difficulty = body?.difficulty
  } else {
    const q = getQuery(event) as {
      city?: string
      count?: string | number
      difficulty?: string
    }
    city = q.city
    count = q.count
    difficulty = q.difficulty
  }

  if (!city || !count || !difficulty) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters: city, count, difficulty',
    })
  }

  // Normalize inputs
  const cityRaw = String(city).trim()
  let normalizedCity: '방콕' | '파타야' | null = null
  if (cityRaw.includes('방콕')) normalizedCity = '방콕'
  else if (cityRaw.includes('파타야')) normalizedCity = '파타야'
  const normalizedCountNum = Number(String(count).replace(/[^0-9]/g, ''))
  const normalizedCountKey = `${normalizedCountNum}회`
  const normalizedDifficulty = String(difficulty).trim()

  // Validate basic domain
  const allowedCities = ['방콕', '파타야'] as const
  const allowedCounts = [2, 3, 4] as const
  const allowedDifficulties = ['가성비', '상급', '최상급'] as const

  if (!normalizedCity || !allowedCities.includes(normalizedCity)) {
    throw createError({ statusCode: 400, statusMessage: `Unsupported city. The city text must include one of: ${allowedCities.join(', ')}` })
  }
  if (!allowedCounts.includes(normalizedCountNum as (typeof allowedCounts)[number])) {
    throw createError({ statusCode: 400, statusMessage: `Unsupported count. Allowed: ${allowedCounts.join(', ')}` })
  }
  if (!allowedDifficulties.includes(normalizedDifficulty as (typeof allowedDifficulties)[number])) {
    throw createError({ statusCode: 400, statusMessage: `Unsupported difficulty. Allowed: ${allowedDifficulties.join(', ')}` })
  }

  // Load JSON data (bundler-safe)
  let data: any
  try {
    // Prefer URL relative to this module so Nitro bundles the asset
    const dataUrl = new URL('./ai_data.json', import.meta.url)
    const raw = await readFile(fileURLToPath(dataUrl), 'utf-8')
    data = JSON.parse(raw)
  } catch (err) {
    // Fallback: dynamic import (also bundler-aware)
    try {
      // @ts-ignore - Node import assertion handled by bundler
      const mod = await import('./ai_data.json')
      data = (mod as any).default ?? mod
    } catch (err2) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load AI data' })
    }
  }

  const packagesRoot = data?.golf_packages
  const cityNode = packagesRoot?.[normalizedCity]
  const countNode = cityNode?.[normalizedCountKey]
  const difficultyNode = countNode?.[normalizedDifficulty]

  if (!difficultyNode) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No matching package found for the provided parameters',
    })
  }

  const courses: string[] = difficultyNode.courses || []
  const krwPrices: number[] = difficultyNode.pricing?.krw?.green_cart_caddie || []

  if (!Array.isArray(courses) || !Array.isArray(krwPrices) || courses.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'No course data available for the selection' })
  }

  // Pair each course with its corresponding KRW price (by index)
  const result: string[] = courses.map((course: string, idx: number) => {
    const price = krwPrices[idx]
    // If price missing, return without price or as 0 for clarity
    const safePrice = Number.isFinite(price) ? price : 0
    return `${course}-${safePrice}`
  })

  return result
})
