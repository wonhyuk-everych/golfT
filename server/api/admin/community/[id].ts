import { defineEventHandler, getRouterParams, createError } from 'h3'
import { getPool } from '~/server/utils/db'
import type { Community, CommunityComment, CommunityImage } from '~/types/admin/community'

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

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    // Get community details
    const communityQuery = `
      SELECT 
        c.community_idx,
        c.country_code_idx,
        c.member_idx,
        c.title,
        c.content,
        cc.country_name,
        c.use_yn,
        c.created_at,
        m.name_kr as member_name
      FROM 
        community c
        LEFT JOIN country_code cc ON c.country_code_idx = cc.country_code_idx
        LEFT JOIN member m ON c.member_idx = m.member_idx
      WHERE 
        c.community_idx = ?
    `
    
    const [communityRows] = await connection.query(communityQuery, [communityIdx])
    
    if (!communityRows || (communityRows as any[]).length === 0) {
      throw createError({
        statusCode: 404,
        message: '해당 커뮤니티 게시글을 찾을 수 없습니다.'
      })
    }

    // Get community comments
    const commentsQuery = `
      SELECT 
        cc.community_comment_idx,
        cc.community_idx,
        cc.member_idx,
        cc.content,
        cc.use_yn,
        cc.created_at,
        m.name_kr as member_name
      FROM 
        community_comment cc
        LEFT JOIN member m ON cc.member_idx = m.member_idx
      WHERE 
        cc.community_idx = ?
      ORDER BY 
        cc.created_at ASC
    `
    
    const [commentRows] = await connection.query(commentsQuery, [communityIdx])
    
    // Get community images
    const imagesQuery = `
      SELECT 
        community_image_idx,
        community_idx,
        image_url,
        sort,
        use_yn,
        created_at
      FROM 
        community_image
      WHERE 
        community_idx = ?
      ORDER BY 
        sort ASC
    `
    
    const [imageRows] = await connection.query(imagesQuery, [communityIdx])
    
    return {
      community: {
        ...(communityRows as any[])[0],
        comments: commentRows as CommunityComment[],
        images: imageRows as CommunityImage[]
      }
    }
  } catch (error) {
    console.error('Error fetching community details:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch community details'
    })
  } finally {
    connection.release()
  }
})
