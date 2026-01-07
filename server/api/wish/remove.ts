import { defineEventHandler, readBody } from 'h3'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    // 1. Get request body
    const { wishIdx } = await readBody(event)
    
    // 2. Validate input
    if (!wishIdx || isNaN(Number(wishIdx))) {
      return { success: false, error: 'Invalid wish ID' }
    }

    // 3. Get current user
    const session = await getUserSession(event)
    const memberIdx = session?.user?.member_idx
    
    if (!memberIdx) {
      return { success: false, error: 'Unauthorized' }
    }

    // 4. Soft delete the wish (set use_yn to 'N')
    const pool = await getPool()
    const [result] = await pool.query(
      `UPDATE wish SET use_yn = 'N' 
       WHERE wish_idx = ? AND member_idx = ?`,
      [wishIdx, memberIdx]
    )

    // 5. Check if any rows were affected
    if (result.affectedRows === 0) {
      return { 
        success: false, 
        error: 'Wish not found or not owned by current user' 
      }
    }

    return {
      success: true,
      message: 'Item removed from wishlist'
    }
  } catch (error) {
    console.error('Error removing wish:', error)
    return { 
      success: false, 
      error: 'Failed to remove item from wishlist'
    }
  }
})
