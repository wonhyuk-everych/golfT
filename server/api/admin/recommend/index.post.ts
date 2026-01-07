import { defineEventHandler, readBody, createError } from 'h3'
import { getPool } from '~/server/utils/db'
import type { RecommendProductRequest } from '~/types/admin/recommend'

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
    const updatedMemberIdx = session.user.member_idx
    const body = await readBody(event) as RecommendProductRequest

    const { recommend_type, product_idx, product_type, sort } = body

    // 입력값 검증
    if (!recommend_type || !product_idx || !product_type || !sort) {
      throw createError({
        statusCode: 400,
        message: '필수 정보가 누락되었습니다.'
      })
    }

    // 추천 타입 검증
    if (!['best30', 'golf', 'hotel', 'caddy'].includes(recommend_type)) {
      throw createError({
        statusCode: 400,
        message: '올바르지 않은 추천 타입입니다.'
      })
    }

    // 상품 타입 검증
    if (!['golf', 'hotel', 'caddy'].includes(product_type)) {
      throw createError({
        statusCode: 400,
        message: '올바르지 않은 상품 타입입니다.'
      })
    }

    // 해당 위치에 이미 등록된 상품이 있는지 확인
    const [existingRows] = await pool.query(
      'SELECT recommend_product_idx FROM recommend_product WHERE recommend_type = ? AND sort = ?',
      [recommend_type, sort]
    )

    if (existingRows && existingRows.length > 0) {
      // 기존 상품이 있으면 업데이트
      const sql = `
        UPDATE recommend_product 
        SET product_idx = ?, product_type = ?, updated_at = NOW(), updated_member_idx = ?
        WHERE recommend_type = ? AND sort = ?
      `
      await pool.query(sql, [product_idx, product_type, updatedMemberIdx, recommend_type, sort])
    } else {
      // 새로운 상품 등록
      const sql = `
        INSERT INTO recommend_product 
        (recommend_type, product_idx, product_type, sort, created_at, created_member_idx, updated_at, updated_member_idx)
        VALUES (?, ?, ?, ?, NOW(), ?, NOW(), ?)
      `
      await pool.query(sql, [recommend_type, product_idx, product_type, sort, updatedMemberIdx, updatedMemberIdx])
    }

    return {
      message: '추천 상품이 성공적으로 등록되었습니다.',
      data: {
        recommend_type,
        product_idx,
        product_type,
        sort
      }
    }
  } catch (error) {
    console.error('Error creating/updating recommend product:', error)
    throw createError({
      statusCode: 500,
      message: '추천 상품 등록에 실패했습니다.'
    })
  }
})
