import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { getPool } from '~/server/utils/db'

interface ReviewUpdateBody {
  review_content?: string
  review_rate?: number
  use_yn?: 'Y' | 'N'
  remove_image_ids?: number[]
}

export default defineEventHandler(async (event) => {
  // Authentication check
  const session = await getUserSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Check if user is authenticated
  if (session?.user?.role != 'A') {
    throw createError({
      statusCode: 401,
      message: '인증되지 않은 사용자입니다.'
    })
  }

  const reviewIdParam = getRouterParam(event, 'id')
  const reviewId = reviewIdParam ? parseInt(reviewIdParam, 10) : NaN
  if (!reviewId || Number.isNaN(reviewId)) {
    throw createError({ statusCode: 400, message: '유효한 리뷰 ID가 필요합니다.' })
  }

  const body = await readBody<ReviewUpdateBody>(event)
  if (!body || (!body.review_content && body.review_rate === undefined && !body.use_yn && !body.remove_image_ids)) {
    throw createError({ statusCode: 400, message: '수정할 항목이 없습니다.' })
  }

  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    // 존재 여부 확인
    const [existRows] = await conn.query('SELECT review_idx FROM review WHERE review_idx = ? LIMIT 1', [reviewId])
    if (!(Array.isArray(existRows) && existRows.length > 0)) {
      throw createError({ statusCode: 404, message: '리뷰를 찾을 수 없습니다.' })
    }

    // 리뷰 본문/평점/노출 여부 업데이트
    const setParts: string[] = []
    const params: any[] = []

    if (typeof body.review_content === 'string') {
      setParts.push('review_content = ?')
      params.push(body.review_content)
    }
    if (typeof body.review_rate === 'number') {
      setParts.push('review_rate = ?')
      params.push(body.review_rate)
    }
    if (body.use_yn === 'Y' || body.use_yn === 'N') {
      setParts.push('use_yn = ?')
      params.push(body.use_yn)
    }

    if (setParts.length > 0) {
      const updateSql = `UPDATE review SET ${setParts.join(', ')}, updated_at = NOW() WHERE review_idx = ?`
      params.push(reviewId)
      await conn.query(updateSql, params)
    }

    // 이미지 비활성화 처리
    if (Array.isArray(body.remove_image_ids) && body.remove_image_ids.length > 0) {
      await conn.query(
        'UPDATE review_image SET use_yn = "N", updated_at = NOW() WHERE review_image_idx IN (?) AND review_idx = ?',
        [body.remove_image_ids, reviewId]
      )
    }

    await conn.commit()
    return { success: true, message: '리뷰가 수정되었습니다.' }
  } catch (error) {
    await conn.rollback()
    console.error('Error updating admin review:', error)
    throw createError({ statusCode: 500, message: '리뷰 수정에 실패했습니다.' })
  } finally {
    conn.release()
  }
})
