import { defineEventHandler, readBody, getRouterParams, createError } from 'h3'
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

  const params = getRouterParams(event)
  const commentIdx = parseInt(params.id)
  
  if (isNaN(commentIdx)) {
    throw createError({
      statusCode: 400,
      message: '유효하지 않은 댓글 ID입니다.'
    })
  }

  const body = await readBody(event)
  const { use_yn } = body

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // Update comment use_yn
    const updateCommentQuery = `
      UPDATE community_comment
      SET use_yn = ?
      WHERE community_comment_idx = ?
    `
    
    await connection.query(updateCommentQuery, [use_yn, commentIdx])
    
    return {
      success: true,
      message: '댓글 상태가 성공적으로 업데이트되었습니다.'
    }
  } catch (error) {
    console.error('Error updating comment:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update comment'
    })
  } finally {
    connection.release()
  }
})
