import { getPool } from '~/server/utils/db'
const pool = getPool()

/**
 * API to fetch notice list with optional filters: type, use_yn, title/content keyword
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const noticeType = (query.notice_type as string) || null
    const useYn = (query.use_yn as string) || null
    const searchWord = (query.searchWord as string) || null
    const offset = (page - 1) * limit

    // Build SQL
    let sql = `
      SELECT 
        notice_idx,
        notice_type,
        title,
        content,
        use_yn,
        created_at
      FROM notice
      WHERE 1=1
    `
    const params: any[] = []
    if (noticeType) {
      sql += ' AND notice_type = ?'
      params.push(noticeType)
    }
    if (useYn) {
      sql += ' AND use_yn = ?'
      params.push(useYn)
    }
    if (searchWord) {
      sql += ' AND (title LIKE ? OR content LIKE ?)'
      params.push(`%${searchWord}%`, `%${searchWord}%`)
    }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [notices] = await pool.query(sql, params)

    // Count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM notice WHERE 1=1'
    const countParams: any[] = []
    if (noticeType) {
      countSql += ' AND notice_type = ?'
      countParams.push(noticeType)
    }
    if (useYn) {
      countSql += ' AND use_yn = ?'
      countParams.push(useYn)
    }
    if (searchWord) {
      countSql += ' AND (title LIKE ? OR content LIKE ?)'
      countParams.push(`%${searchWord}%`, `%${searchWord}%`)
    }
    const [countRows] = await pool.query(countSql, countParams)
    const total = countRows[0]?.total || 0

    return {
      list: notices,
      total,
      page,
      limit
    }
  } catch (error) {
    console.error(error)
    return { list: [], total: 0, page: 1, limit: 10, error: 'DB Error' }
  }
})
