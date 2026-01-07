import { defineEventHandler, getQuery } from 'h3'
import type { H3Event } from 'h3'
import type { HotelListResponse, Hotel } from '~/types/admin/hotel'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event: H3Event): Promise<HotelListResponse> => {
  const query = getQuery(event)
  const { 
    searchWord,
    hotelStatus,
    countryCode,
    cityCode,
    page = 1,
    pageSize = 10
  } = query
  
  // Convert pagination params to numbers
  const currentPage = Number(page)
  const itemsPerPage = Number(pageSize)

  // Type guard for status values
  const isValidStatus = (status: unknown): status is 'Y' | 'N' => {
    return status === 'Y' || status === 'N'
  }

  // Safely type the status values
  const validHotelStatus = hotelStatus && isValidStatus(hotelStatus) ? hotelStatus : undefined

  // Build SQL query with parameters
  const conditions: string[] = []
  const params: (string | number)[] = []

  if (validHotelStatus) {
    conditions.push('H.hotel_status = ?')
    params.push(validHotelStatus)
  }

  if (countryCode) {
    conditions.push('H.country_code = ?')
    params.push(countryCode)
  }

  if (cityCode) {
    conditions.push('H.city_code = ?')
    params.push(cityCode)
  }

  // 호텔 ID/이름 통합 검색
  const searchConditions: string[] = []
  if (searchWord) {
    searchConditions.push('H.hotel_idx = ?')
    params.push(searchWord)

    searchConditions.push('H.name_kr LIKE ?')
    params.push(`%${searchWord}%`)

    searchConditions.push('H.name_en LIKE ?')
    params.push(`%${searchWord}%`)
  }

  if (searchConditions.length > 0) {
    conditions.push(`(${searchConditions.join(' OR ')})`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // Execute count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hotel H
      ${whereClause}
    `
    const [countResult] = await connection.query(countQuery, params)
    const total = (countResult as Array<{ total: number }>)[0].total

    // Execute search query with the provided SQL structure
    // Calculate pagination values
    const offset = (currentPage - 1) * itemsPerPage
    const totalPages = Math.ceil(total / itemsPerPage)
    
    const searchQuery = `
      SELECT
        H.hotel_idx,
        H.hotel_status,
        H.name_kr,
        H.name_en,
        (SELECT HR.room_product_price FROM hotel_room HR WHERE HR.hotel_idx = H.hotel_idx AND HR.use_yn = 'Y' ORDER BY HR.room_product_price LIMIT 1) AS price,
        (SELECT country_name FROM country_code WHERE country_code = H.country_code LIMIT 1) AS country_name,
        (SELECT city_name FROM country_code WHERE city_code = H.city_code LIMIT 1) AS city_name,
        (SELECT COUNT(*) FROM hotel_room WHERE H.hotel_idx = hotel_room.hotel_idx AND use_yn = 'Y') AS room_count,
        H.created_at,
        H.updated_at
      FROM hotel H
      ${whereClause}
      ORDER BY H.updated_at DESC
      LIMIT ? OFFSET ?
    `
    
    // Add pagination parameters
    params.push(itemsPerPage, offset)

    console.log('searchQuery:', searchQuery)
    console.log('params:', params)
    const [rows] = await connection.query(searchQuery, params)
    
    // Map the raw SQL results to our Hotel interface
    const hotels = (rows as Array<Record<string, string | number | null>>).map(row => ({
      hotelIdx: row.hotel_idx,
      hotelStatus: row.hotel_status,
      nameKr: row.name_kr,
      nameEn: row.name_en,
      price: row.price,
      countryName: row.country_name,
      cityName: row.city_name,
      roomCount: row.room_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })) as Hotel[]

    return {
      hotels,
      total,
      page: currentPage,
      pageSize: itemsPerPage,
      totalPages
    }
  } finally {
    connection.release()
  }
})
