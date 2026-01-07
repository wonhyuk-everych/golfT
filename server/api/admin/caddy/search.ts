import { defineEventHandler, getQuery } from 'h3'
import type { H3Event } from 'h3'
import type { CaddyListResponse, Caddy } from '~/types/admin/caddy'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event: H3Event): Promise<CaddyListResponse> => {
  const query = getQuery(event)
  const { 
    searchWord,
    courseIdx,
    caddyCode,
    caddyStatus,
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
  const validCaddyStatus = caddyStatus && isValidStatus(caddyStatus) ? caddyStatus : undefined

  // Build SQL query with parameters
  const conditions: string[] = []
  const params: (string | number)[] = []

  if (courseIdx) {
    conditions.push('c.course_idx = ?')
    params.push(courseIdx)
  }

  if (caddyCode) {
    conditions.push('c.caddy_code = ?')
    params.push(caddyCode)
  }

  if (validCaddyStatus) {
    conditions.push('c.caddy_status = ?')
    params.push(validCaddyStatus)
  }

  if (cityCode) {
    conditions.push('c.city_code = ? OR c.country_code = ?')
    params.push(cityCode, cityCode)
  }

  // 캐디 ID/이름/닉네임 통합 검색
  const searchConditions: string[] = []
  if (searchWord) {
    searchConditions.push('c.caddy_idx = ?')
    params.push(searchWord)

    searchConditions.push('c.name LIKE ?')
    params.push(`%${searchWord}%`)

    searchConditions.push('c.nick_name LIKE ?')
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
      FROM caddy c
      ${whereClause}
    `
    const [countResult] = await connection.query(countQuery, params)
    const total = (countResult as Array<{total: number}>)[0].total

    // Calculate pagination values
    const offset = (currentPage - 1) * itemsPerPage
    const totalPages = Math.ceil(total / itemsPerPage)
    
    // Execute search query with pagination
    const searchQuery = `
      SELECT
        c.caddy_idx as caddyIdx,
        (SELECT name_kr FROM golf_course WHERE course_idx = c.course_idx) as courseIdx,
        c.caddy_code as caddyCode,
        c.name,
        c.nick_name as nickName,
        c.age,
        c.height,
        (SELECT country_name FROM country_code WHERE country_code = c.country_code LIMIT 1) as countryCode,
        (SELECT city_name FROM country_code WHERE city_code = c.city_code LIMIT 1) as cityCode,
        c.language,
        c.specialty,
        c.day_off as dayOff,
        c.golf_experience as golfExperience,
        c.price,
        c.reservation_fee as reservationFee,
        c.caddy_status as caddyStatus,
        c.created_at as createdAt,
        c.created_member_idx as createdMemberIdx,
        c.updated_at as updatedAt,
        c.updated_member_idx as updatedMemberIdx
      FROM caddy c
      ${whereClause}
      ORDER BY c.updated_at DESC
      LIMIT ? OFFSET ?
    `
    
    // Add pagination parameters
    params.push(itemsPerPage, offset)

    console.log('searchQuery:', searchQuery)
    console.log('params:', params)
    const [rows] = await connection.query(searchQuery, params)
    const caddies = rows as Caddy[]

    return {
      caddies,
      total,
      page: currentPage,
      pageSize: itemsPerPage,
      totalPages
    }
  } finally {
    connection.release()
  }
})
