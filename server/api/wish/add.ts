import { defineEventHandler, readBody } from 'h3'
import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    // 1. Get request body
    const { type, productIdx } = await readBody(event)
    
    // 2. Validate input
    if (!type || !['G', 'H', 'C', 'S'].includes(type)) {
      return { success: false, error: 'Invalid type parameter' }
    }
    
    if (!productIdx || isNaN(Number(productIdx))) {
      return { success: false, error: 'Invalid product ID' }
    }

    // 3. Get current user
    const session = await getUserSession(event)
    const memberIdx = session?.user?.member_idx
    
    if (!memberIdx) {
      return { success: false, error: 'Unauthorized' }
    }

    // 4. Check if wish already exists
    const pool = await getPool()
    const [existingWish] = await pool.query(
      `SELECT wish_idx FROM wish 
       WHERE member_idx = ? AND product_idx = ? AND wish_type = ? AND use_yn = 'Y'`,
      [memberIdx, productIdx, type]
    )

    // 5. If wish already exists, return success (idempotent operation)
    if (existingWish.length > 0) {
      return { 
        success: true, 
        wishIdx: existingWish[0].wish_idx,
        message: 'Item already in wishlist'
      }
    }

    // 6. Insert new wish
    const [result] = await pool.query(
      `INSERT INTO wish (wish_type, member_idx, product_idx, use_yn) 
       VALUES (?, ?, ?, 'Y')`,
      [type, memberIdx, productIdx]
    )

    return {
      success: true,
      wishIdx: result.insertId,
      message: 'Item added to wishlist'
    }
  } catch (error) {
    console.error('Error adding wish:', error)
    return { 
      success: false, 
      error: 'Failed to add item to wishlist'
    }
  }
})
