import { defineEventHandler } from 'h3'
import { getPool } from '~/server/utils/db'

interface GolfCourse {
  courseIdx: number;
  nameKr: string;
}

export default defineEventHandler(async () => {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    const query = `
      SELECT 
        course_idx as courseIdx, 
        name_kr as nameKr 
      FROM golf_course 
      WHERE course_status = 'Y'
      ORDER BY name_kr
    `

    const [rows] = await connection.query(query)
    
    return {
      golfCourses: rows as GolfCourse[]
    }
  } catch (error) {
    console.error('Error fetching golf courses:', error)
    throw error
  } finally {
    connection.release()
  }
})
