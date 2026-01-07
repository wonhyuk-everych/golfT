import { defineEventHandler, readBody, createError } from 'h3'
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

  // Check if user is authenticated as admin
  if (session?.user?.role != 'A') {
    throw createError({
      statusCode: 401,
      message: '인증되지 않은 사용자입니다.'
    })
  }

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // Parse JSON body
    const body = await readBody(event)
    
    const {
      review_type: reviewType,
      product_idx: productIdx,
      member_idx: memberIdx,
      review_rate: reviewRate,
      review_content: reviewContent,
      use_yn: useYn = 'Y',
      image_urls: imageUrls = []
    } = body

    // Validate required fields
    if (!reviewType || !productIdx || !memberIdx || !reviewContent) {
      throw createError({
        statusCode: 400,
        message: '필수 항목을 모두 입력해주세요.'
      })
    }

    if (!['G', 'H', 'C'].includes(reviewType)) {
      throw createError({
        statusCode: 400,
        message: '잘못된 리뷰 타입입니다.'
      })
    }

    if (reviewRate < 1 || reviewRate > 5) {
      throw createError({
        statusCode: 400,
        message: '평점은 1~5 사이의 값이어야 합니다.'
      })
    }

    await connection.beginTransaction()

    // Insert review
    const insertReviewSql = `
      INSERT INTO review (
        review_type,
        member_idx,
        reservation_idx,
        product_idx,
        review_content,
        review_rate,
        use_yn,
        created_at,
        updated_at
      ) VALUES (?, ?, 0, ?, ?, ?, ?, NOW(), NOW())
    `

    const [result] = await connection.query(insertReviewSql, [
      reviewType,
      memberIdx,
      productIdx,
      reviewContent,
      reviewRate,
      useYn
    ])

    const reviewIdx = (result as { insertId: number }).insertId

    // Handle image URLs from FTP upload
    if (imageUrls && imageUrls.length > 0) {
      for (const imageUrl of imageUrls) {
        // Insert image record
        const insertImageSql = `
          INSERT INTO review_image (
            review_idx,
            image_url,
            use_yn,
            created_at
          ) VALUES (?, ?, 'Y', NOW())
        `
        await connection.query(insertImageSql, [reviewIdx, imageUrl])
      }
    }

    await connection.commit()

    return {
      success: true,
      reviewIdx,
      message: '리뷰가 성공적으로 등록되었습니다.'
    }
  } catch (error) {
    await connection.rollback()
    console.error('Error creating review:', error)
    throw createError({
      statusCode: 500,
      message: '리뷰 등록에 실패했습니다.'
    })
  } finally {
    connection.release()
  }
})
