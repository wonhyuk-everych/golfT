import { defineEventHandler, getQuery } from 'h3'
import type { H3Event } from 'h3'
import type { GolfCourseListResponse, GolfCourse } from '~/types/admin/course'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event: H3Event): Promise<GolfCourseListResponse> => {
  const query = getQuery(event)
  const { 
    searchWord,
    bookingStatus, 
    courseStatus, 
    regionCode, 
    roundStart,
    page = '1',
    pageSize = '10'
  } = query
  
  // Convert pagination parameters to numbers
  const currentPage = parseInt(page as string, 10) || 1
  const itemsPerPage = parseInt(pageSize as string, 10) || 10
  const offset = (currentPage - 1) * itemsPerPage

  // Type guard for status values
  const isValidStatus = (status: unknown): status is 'Y' | 'N' => {
    return status === 'Y' || status === 'N'
  }

  // Safely type the status values
  const validBookingStatus = bookingStatus && isValidStatus(bookingStatus) ? bookingStatus : undefined
  const validCourseStatus = courseStatus && isValidStatus(courseStatus) ? courseStatus : undefined

  // Build SQL query with parameters
  const conditions: string[] = []
  const params: (string | number)[] = []

  if (validBookingStatus) {
    conditions.push('c.booking_status = ?')
    params.push(validBookingStatus)
  }

  if (validCourseStatus) {
    conditions.push('c.course_status = ?')
    params.push(validCourseStatus)
  }

  if (regionCode) {
    conditions.push('c.city_code = ? OR c.country_code = ?')
    params.push(regionCode, regionCode)
  }

  if (roundStart) {
    conditions.push('c.round_start = ?')
    params.push(roundStart)
  }

  // 골프장 ID/이름 통합 검색
  const searchConditions: string[] = []
  if (searchWord) {
    searchConditions.push('c.course_idx = ?')
    params.push(searchWord)

    searchConditions.push('c.name_kr LIKE ?')
    params.push(`%${searchWord}%`)

    searchConditions.push('c.name_en LIKE ?')
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
      FROM golf_course c
      ${whereClause}
    `
    const [countResult] = await connection.query(countQuery, params)
    const total = (countResult as Array<{ total: number }>)[0].total

    // Execute search query
    const searchQuery = `
      SELECT
        c.course_idx as courseIdx,
        c.name_kr as nameKr,
        c.name_en as nameEn,
        c.country_code as countryCode,
        c.city_code as cityCode,
        c.hole_count as holeCount,
        c.round_start as roundStart,
        c.booking_status as bookingStatus,
        c.course_status as courseStatus,
        c.created_at as createdAt,
        c.updated_at as updatedAt
      FROM golf_course c
      ${whereClause}
      ORDER BY c.updated_at DESC
      LIMIT ? OFFSET ?
    `
    
    // Add pagination parameters
    params.push(itemsPerPage, offset)

    console.log('searchQuery:', searchQuery)
    console.log('params:', params)
    const [rows] = await connection.query(searchQuery, params)
    const courses = rows as GolfCourse[]

    return {
      courses,
      total,
      page: currentPage,
      pageSize: itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage)
    }
  } finally {
    connection.release()
  }
})
