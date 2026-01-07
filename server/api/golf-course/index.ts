import { defineEventHandler, getQuery, readBody } from 'h3'
import { getPool, testConnection } from '~/server/utils/db'
import type { GolfCourse, GolfCoursePrice, GolfCourseImage } from './types'

interface ExtraImage {
  image_url: string;
  image_type: string;
}

interface CreateGolfCourseBody {
  course_data: Partial<GolfCourse>;
  price_data?: Partial<GolfCoursePrice>;
  image_data?: Partial<GolfCourseImage>;
  extra_images?: ExtraImage[];
}

interface DatabaseError {
  message: string;
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
}

export default defineEventHandler(async (event) => {
  try {
    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const query = getQuery(event)
    const { name, maxAirportTime } = query

    let sql = `
      SELECT 
        gci.main_image_url,
        gci.course_image_url,
        gci.clubhouse_image_url,
        gci.restaurant_image_url,
        gci.shelter_image_url,
        gci.proshop_image_url,
        gci.description_image_url,
        gc.course_idx,
        gc.name_kr,
        gc.course_holes,
        gc.country_code,
        gc.city_code,
        gc.nearest_airport,
        gc.airport_time,
        gcp.min_price
      FROM golf_course gc
      LEFT JOIN golf_course_monthly_price gcp ON gc.course_idx = gcp.course_idx AND gcp.target_year = DATE_FORMAT(NOW(), '%Y') AND gcp.target_month = DATE_FORMAT(NOW(), '%m')
      LEFT JOIN golf_course_image gci ON gc.course_idx = gci.course_idx
      WHERE 1=1
    `
    const params: any[] = []

    if (name) {
      sql += ' AND gc.name_kr LIKE ?'
      params.push(`%${name}%`)
    }

    if (maxAirportTime) {
      sql += ' AND gc.airport_time BETWEEN ? AND ?'
      params.push((Number(maxAirportTime)-30), Number(maxAirportTime))
    }

    try {
      const pool = getPool()
      const [rows] = await pool.query(sql, params)
      return { success: true, data: rows }
    } catch (error) {
      const queryError = error as DatabaseError
      console.error('Query execution error:', queryError)
      return {
        success: false,
        error: '골프장 정보를 가져오는데 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? queryError.message : undefined
      }
    }
  } catch (error) {
    const err = error as Error
    console.error('Unexpected error in golf course API:', err)
    return {
      success: false,
      error: '예기치 않은 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})

// GET /api/golf-course/[id] - Get golf course details by ID
export const getById = defineEventHandler(async (event) => {
  try {
    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const courseIdx = event.context.params?.id

    if (!courseIdx) {
      return { success: false, error: 'Course ID is required' }
    }

    const sql = `
      SELECT
        c.name_kr
        , c.course_holes
        , c.country_code
        , c.city_code
        , c.nearest_airport
        , c.nearest_city
        , c.airport_time
        , c.city_time
        , c.promotion_url
        , p.min_price
        , gci.main_image_url
        , gci.course_image_url
        , gci.clubhouse_image_url
        , gci.restaurant_image_url
        , gci.shelter_image_url
        , gci.proshop_image_url
        , gci.description_image_url
      FROM golf_course c
      LEFT JOIN golf_course_monthly_price p ON c.course_idx = p.course_idx AND p.target_year = DATE_FORMAT(NOW(), '%Y') AND p.target_month = DATE_FORMAT(NOW(), '%m')
      LEFT JOIN golf_course_image gci ON c.course_idx = gci.course_idx
      WHERE c.course_idx = ?
    `

    try {
      const pool = getPool()
      const [rows] = await pool.query(sql, [courseIdx])
      const course = rows[0]

      if (!course) {
        return { success: false, error: 'Course not found' }
      }

      if (course.extra_images) {
        course.extra_images = JSON.parse(`[${course.extra_images}]`)
      }

      return { success: true, data: course }
    } catch (error) {
      const queryError = error as DatabaseError
      console.error('Query execution error:', queryError)
      return {
        success: false,
        error: '골프장 정보를 가져오는데 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? queryError.message : undefined
      }
    }
  } catch (error) {
    const err = error as Error
    console.error('Unexpected error in golf course API:', err)
    return {
      success: false,
      error: '예기치 않은 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})

// POST /api/golf-course - Create new golf course
export const POST = defineEventHandler(async (event) => {
  try {
    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const body = await readBody<CreateGolfCourseBody>(event)
    const {
      course_data,
      price_data,
      image_data,
      extra_images
    } = body

    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      const [courseResult] = await connection.query(
        'INSERT INTO golf_course SET ?',
        [course_data]
      )
      const courseIdx = (courseResult as any).insertId

      if (price_data) {
        price_data.course_idx = courseIdx
        await connection.query(
          'INSERT INTO golf_course_price SET ?',
          [price_data]
        )
      }

      if (image_data) {
        image_data.course_idx = courseIdx
        await connection.query(
          'INSERT INTO golf_course_image SET ?',
          [image_data]
        )
      }

      if (extra_images && extra_images.length > 0) {
        const extraImageValues = extra_images.map((img: ExtraImage) => [
          courseIdx,
          img.image_url,
          img.image_type
        ])
        await connection.query(
          'INSERT INTO golf_course_extra_image (course_idx, image_url, image_type) VALUES ?',
          [extraImageValues]
        )
      }

      await connection.commit()
      return { success: true, data: { course_idx: courseIdx } }
    } catch (error) {
      await connection.rollback()
      const queryError = error as DatabaseError
      console.error('Query execution error:', queryError)
      return {
        success: false,
        error: '골프장을 생성하는데 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? queryError.message : undefined
      }
    } finally {
      connection.release()
    }
  } catch (error) {
    const err = error as Error
    console.error('Unexpected error in golf course API:', err)
    return {
      success: false,
      error: '예기치 않은 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})

// PUT /api/golf-course/[id] - Update golf course
export const PUT = defineEventHandler(async (event) => {
  try {
    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const courseIdx = event.context.params?.id
    const body = await readBody<CreateGolfCourseBody>(event)
    const {
      course_data,
      price_data,
      image_data,
      extra_images
    } = body

    if (!courseIdx) {
      return { success: false, error: 'Course ID is required' }
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      if (course_data) {
        await connection.query(
          'UPDATE golf_course SET ? WHERE course_idx = ?',
          [course_data, courseIdx]
        )
      }

      if (price_data) {
        await connection.query(
          'UPDATE golf_course_price SET ? WHERE course_idx = ?',
          [price_data, courseIdx]
        )
      }

      if (image_data) {
        await connection.query(
          'UPDATE golf_course_image SET ? WHERE course_idx = ?',
          [image_data, courseIdx]
        )
      }

      if (extra_images) {
        await connection.query(
          'DELETE FROM golf_course_extra_image WHERE course_idx = ?',
          [courseIdx]
        )

        if (extra_images.length > 0) {
          const extraImageValues = extra_images.map((img: ExtraImage) => [
            courseIdx,
            img.image_url,
            img.image_type
          ])
          await connection.query(
            'INSERT INTO golf_course_extra_image (course_idx, image_url, image_type) VALUES ?',
            [extraImageValues]
          )
        }
      }

      await connection.commit()
      return { success: true }
    } catch (error) {
      await connection.rollback()
      const queryError = error as DatabaseError
      console.error('Query execution error:', queryError)
      return {
        success: false,
        error: '골프장을 수정하는데 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? queryError.message : undefined
      }
    } finally {
      connection.release()
    }
  } catch (error) {
    const err = error as Error
    console.error('Unexpected error in golf course API:', err)
    return {
      success: false,
      error: '예기치 않은 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})

// DELETE /api/golf-course/[id] - Delete golf course
export const DELETE = defineEventHandler(async (event) => {
  try {
    if (!await testConnection()) {
      return {
        success: false,
        error: 'Database connection failed. Please ensure MySQL is running and the credentials are correct.'
      }
    }

    const courseIdx = event.context.params?.id

    if (!courseIdx) {
      return { success: false, error: 'Course ID is required' }
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      await connection.query('DELETE FROM golf_course_extra_image WHERE course_idx = ?', [courseIdx])
      await connection.query('DELETE FROM golf_course_image WHERE course_idx = ?', [courseIdx])
      await connection.query('DELETE FROM golf_course_price WHERE course_idx = ?', [courseIdx])
      await connection.query('DELETE FROM golf_course WHERE course_idx = ?', [courseIdx])

      await connection.commit()
      return { success: true }
    } catch (error) {
      await connection.rollback()
      const queryError = error as DatabaseError
      console.error('Query execution error:', queryError)
      return {
        success: false,
        error: '골프장을 삭제하는데 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? queryError.message : undefined
      }
    } finally {
      connection.release()
    }
  } catch (error) {
    const err = error as Error
    console.error('Unexpected error in golf course API:', err)
    return {
      success: false,
      error: '예기치 않은 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }
})
