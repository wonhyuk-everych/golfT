import { defineEventHandler } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'

interface DeleteCartItemsRequest {
  golfCourses: number[];
  hotels: number[];
  caddies: number[];
  callVans: number[];
  tournaments: number[];
}

interface DeleteCartItemsResponse {
  success: boolean;
  error?: string;
  details?: string;
}

export default defineEventHandler(async (event): Promise<DeleteCartItemsResponse> => {
  try {
    const session = await getUserSession(event)
    
    if(!session?.user?.member_idx) {
      return {
        success: false,
        error: '인증되지 않은 사용자입니다.'
      }
    }

    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const memberIdx = session.user.member_idx
    const body = await readBody<DeleteCartItemsRequest>(event)
    
    const { golfCourses, hotels, caddies, callVans, tournaments } = body
    
    // Validate request body
    if (!golfCourses && !hotels && !caddies && !callVans && !tournaments) {
      return {
        success: false,
        error: '삭제할 항목이 선택되지 않았습니다.'
      }
    }
    
    const pool = getPool()
    
    try {
      // Start a transaction
      const connection = await pool.getConnection()
      await connection.beginTransaction()
      
      try {
        // Delete golf courses
        if (golfCourses && golfCourses.length > 0) {
          const placeholders = golfCourses.map(() => '?').join(',')
          const params = [...golfCourses, memberIdx]
          
          await connection.query(
            `UPDATE shopping_cart_golf 
             SET use_yn = 'N' 
             WHERE shopping_cart_golf_idx IN (${placeholders}) 
             AND member_idx = ?`,
            params
          )
        }
        
        // Delete hotels
        if (hotels && hotels.length > 0) {
          const placeholders = hotels.map(() => '?').join(',')
          const params = [...hotels, memberIdx]
          
          await connection.query(
            `UPDATE shopping_cart_hotel 
             SET use_yn = 'N' 
             WHERE shopping_cart_hotel_idx IN (${placeholders}) 
             AND member_idx = ?`,
            params
          )
        }
        
        // Delete caddies
        if (caddies && caddies.length > 0) {
          const placeholders = caddies.map(() => '?').join(',')
          const params = [...caddies, memberIdx]
          
          await connection.query(
            `UPDATE shopping_cart_caddy 
             SET use_yn = 'N' 
             WHERE shopping_cart_caddy_idx IN (${placeholders}) 
             AND member_idx = ?`,
            params
          )
        }
        
        // Delete call vans
        if (callVans && callVans.length > 0) {
          const placeholders = callVans.map(() => '?').join(',')
          const params = [...callVans, memberIdx]
          
          await connection.query(
            `UPDATE shopping_cart_callvan 
             SET use_yn = 'N' 
             WHERE shopping_cart_callvan_idx IN (${placeholders}) 
             AND member_idx = ?`,
            params
          )
        }
        
        // Delete tournaments
        if (tournaments && tournaments.length > 0) {
          const placeholders = tournaments.map(() => '?').join(',')
          const params = [...tournaments, memberIdx]
          
          await connection.query(
            `UPDATE shopping_cart_tournament 
             SET use_yn = 'N' 
             WHERE shopping_cart_tournament_idx IN (${placeholders}) 
             AND member_idx = ?`,
            params
          )
        }
        
        // Commit the transaction
        await connection.commit()
        connection.release()
        
        return {
          success: true
        }
      } catch (error) {
        // Rollback in case of error
        await connection.rollback()
        connection.release()
        throw error
      }
    } catch (error) {
      const dbError = error as { message?: string }
      console.error('Query execution error:', dbError)
      return {
        success: false,
        error: '장바구니 항목 삭제에 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }
    }
  } catch (error) {
    const err = error as { message?: string }
    console.error('Unexpected error in delete cart items API:', err)
    return {
      success: false,
      error: '예기치 않은 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})
