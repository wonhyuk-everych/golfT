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
  const communityIdx = parseInt(params.id)
  
  if (isNaN(communityIdx)) {
    throw createError({
      statusCode: 400,
      message: '유효하지 않은 커뮤니티 ID입니다.'
    })
  }

  const body = await readBody(event)
  const { use_yn } = body

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // Update community use_yn
    const updateCommunityQuery = `
      UPDATE community
      SET use_yn = ?
      WHERE community_idx = ?
    `
    
    await connection.query(updateCommunityQuery, [use_yn, communityIdx])
    
    await connection.commit()
    
    return {
      success: true,
      message: '커뮤니티 상태가 성공적으로 업데이트되었습니다.'
    }
  } catch (error) {
    await connection.rollback()
    console.error('Error updating community:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update community'
    })
  } finally {
    connection.release()
  }
})
