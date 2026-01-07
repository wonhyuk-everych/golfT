import { defineEventHandler, createError } from 'h3'
import { getPool } from '~/server/utils/db'

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

  try {
    const pool = getPool()
    const recommendProductIdx = event.context.params?.id

    if (!recommendProductIdx) {
      throw createError({
        statusCode: 400,
        message: '추천 상품 ID가 필요합니다.'
      })
    }

    // 추천 상품 존재 여부 확인
    const [existingRows] = await pool.query(
      'SELECT recommend_product_idx FROM recommend_product WHERE recommend_product_idx = ?',
      [recommendProductIdx]
    )

    if (!existingRows || existingRows.length === 0) {
      throw createError({
        statusCode: 404,
        message: '추천 상품을 찾을 수 없습니다.'
      })
    }

    // 추천 상품 삭제
    await pool.query(
      'DELETE FROM recommend_product WHERE recommend_product_idx = ?',
      [recommendProductIdx]
    )

    return {
      message: '추천 상품이 성공적으로 삭제되었습니다.'
    }
  } catch (error) {
    console.error('Error deleting recommend product:', error)
    throw createError({
      statusCode: 500,
      message: '추천 상품 삭제에 실패했습니다.'
    })
  }
})
