import { getPool } from '~/server/utils/db'
const pool = getPool()

/**
 * API to fetch a specific notice by ID
 */
export default defineEventHandler(async (event) => {
  try {
    const noticeId = event.context.params.id

    // Fetch notice details
    const [noticeResult] = await pool.query(
      `
      SELECT 
        notice_idx,
        notice_type,
        title,
        content,
        created_at
      FROM notice
      WHERE notice_idx = ? AND use_yn = 'Y'
      LIMIT 1
      `,
      [noticeId]
    )

    // Check if notice exists
    if (!noticeResult || noticeResult.length === 0) {
      return {
        success: false,
        error: 'Notice not found'
      }
    }

    const notice = noticeResult[0]

    // Fetch notice images
    const [imagesResult] = await pool.query(
      `
      SELECT 
        notice_image_idx,
        notice_idx,
        image_url,
        sort
      FROM notice_image
      WHERE notice_idx = ? AND use_yn = 'Y'
      ORDER BY sort ASC
      `,
      [noticeId]
    )

    return {
      success: true,
      data: {
        notice,
        images: imagesResult
      }
    }
  } catch (error) {
    console.error('Error fetching notice details:', error)
    return {
      success: false,
      error: 'Failed to fetch notice details'
    }
  }
})
