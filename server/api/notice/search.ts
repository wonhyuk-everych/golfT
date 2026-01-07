import { getPool } from '~/server/utils/db'
const pool = getPool()

/**
 * API to fetch notice list with optional type filter
 */
export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const noticeType = (query.notice_type as string) || null

    // Calculate pagination offset
    const offset = (page - 1) * limit

    // Base SQL for notices
    let sql = `
      SELECT 
        notice_idx,
        notice_type,
        title,
        content,
        created_at
      FROM notice
      WHERE use_yn = 'Y'
    `
    
    // Add notice type filter if provided
    if (noticeType) {
      sql += ` AND notice_type = ?`
    }
    
    // Add order by and pagination
    sql += `
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `

    // Set query parameters
    const queryParams = noticeType
      ? [noticeType, limit, offset]
      : [limit, offset]

    // Execute query
    const [notices] = await pool.query(sql, queryParams)

    // Count total notices for pagination
    let countSql = `
      SELECT COUNT(*) as total
      FROM notice
      WHERE use_yn = 'Y'
    `
    
    // Add notice type filter to count query if provided
    if (noticeType) {
      countSql += ` AND notice_type = ?`
    }

    const [totalResult] = await pool.query(
      countSql,
      noticeType ? [noticeType] : []
    )
    const total = totalResult[0].total

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // Return notices with pagination info
    return {
      success: true,
      data: {
        notices,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage
        },
        noticeTypes: [
          { type: 'N', name: '일반' },
          { type: 'R', name: '예약' },
          { type: 'T', name: '대회' },
          { type: 'E', name: '이벤트' }
        ]
      }
    }
  } catch (error) {
    console.error('Error fetching notices:', error)
    return {
      success: false,
      error: 'Failed to fetch notices'
    }
  }
})
