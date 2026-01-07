import { defineEventHandler, createError } from 'h3'
import { getPool } from '~/server/utils/db'
import type { Pool, RowDataPacket } from 'mysql2/promise'

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

    // 병렬로 모든 데이터 조회
    const [
      memberStats,
      productStats,
      reservationStats,
      revenueStats,
      monthlyRevenue,
      reservationTypes,
      regionStats,
      dailyNewMembers,
      pendingReservations,
      pendingQnas,
      recentReviews
    ] = await Promise.all([
      getMemberStats(pool),
      getProductStats(pool),
      getReservationStats(pool),
      getRevenueStats(pool),
      getMonthlyRevenue(pool),
      getReservationTypes(pool),
      getRegionStats(pool),
      getDailyNewMembers(pool),
      getPendingReservations(pool),
      getPendingQnas(pool),
      getRecentReviews(pool)
    ])

    return {
      members: memberStats,
      products: productStats,
      reservations: reservationStats,
      revenue: revenueStats,
      charts: {
        monthlyRevenue,
        reservationTypes,
        regionStats,
        dailyNewMembers
      },
      pending: {
        reservations: pendingReservations,
        qnas: pendingQnas
      },
      recentReviews
    }

  } catch (error) {
    console.error('Dashboard API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})

// 회원 통계
async function getMemberStats(pool: Pool) {
  const [totalResult] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM member WHERE member_status = "Y"'
  )
  
  const [thisMonthResult] = await pool.query<RowDataPacket[]>(`
    SELECT COUNT(*) as thisMonth 
    FROM member 
    WHERE member_status = "Y" 
    AND DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
  `)

  return {
    total: totalResult[0].total,
    thisMonth: thisMonthResult[0].thisMonth
  }
}

// 상품 통계
async function getProductStats(pool: Pool) {
  const [golfResult] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM golf_course WHERE course_status = "Y"'
  )
  
  const [hotelResult] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM hotel WHERE hotel_status = "Y"'
  )
  
  const [caddyResult] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM caddy WHERE caddy_status = "Y"'
  )

  const golf = golfResult[0].count
  const hotel = hotelResult[0].count
  const caddy = caddyResult[0].count

  return {
    golf,
    hotel,
    caddy,
    total: golf + hotel + caddy
  }
}

// 예약 통계
async function getReservationStats(pool: Pool) {
  const [totalResult] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM reservation_master'
  )
  
  const [thisMonthResult] = await pool.query<RowDataPacket[]>(`
    SELECT COUNT(*) as thisMonth 
    FROM reservation_master 
    WHERE DATE_FORMAT(create_date, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
  `)

  return {
    total: totalResult[0].total,
    thisMonth: thisMonthResult[0].thisMonth
  }
}

// 매출 통계
async function getRevenueStats(pool: Pool) {
  const [totalResult] = await pool.query<RowDataPacket[]>(`
    SELECT COALESCE(SUM(total_price), 0) as total 
    FROM reservation_master 
    WHERE reservation_status = 'COMPLETED'
  `)
  
  const [thisMonthResult] = await pool.query<RowDataPacket[]>(`
    SELECT COALESCE(SUM(total_price), 0) as thisMonth 
    FROM reservation_master 
    WHERE reservation_status = 'COMPLETED'
    AND DATE_FORMAT(create_date, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
  `)

  return {
    total: totalResult[0].total,
    thisMonth: thisMonthResult[0].thisMonth
  }
}

// 월별 매출 추이 (최근 6개월)
async function getMonthlyRevenue(pool: Pool) {
  const [results] = await pool.query<RowDataPacket[]>(`
    SELECT 
      DATE_FORMAT(create_date, '%Y-%m') as month,
      COALESCE(SUM(total_price), 0) as revenue
    FROM reservation_master 
    WHERE reservation_status = 'COMPLETED'
    AND create_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(create_date, '%Y-%m')
    ORDER BY month ASC
  `)

  return (results as RowDataPacket[]).map((row: any) => ({
    month: formatMonth(row.month as string),
    revenue: row.revenue as number
  }))
}

// 예약 타입별 분포
async function getReservationTypes(pool: Pool) {
  const [results] = await pool.query<RowDataPacket[]>(`
    SELECT 
      reservation_type as type,
      COUNT(*) as count
    FROM reservation_master 
    WHERE DATE_FORMAT(create_date, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
    GROUP BY reservation_type
  `)

  return (results as RowDataPacket[]).map((row: any) => ({
    type: getReservationTypeLabel(row.type as string),
    count: row.count as number
  }))
}

// 지역별 예약 현황 (TOP 5)
async function getRegionStats(pool: Pool) {
  const [results] = await pool.query<RowDataPacket[]>(`
    SELECT 
      CONCAT(cc.country_name, ' ', cc.city_name) as region,
      COUNT(*) as count
    FROM reservation_golf rg
    JOIN golf_course gc ON rg.course_idx = gc.course_idx
    JOIN country_code cc ON gc.country_code = cc.country_code AND gc.city_code = cc.city_code
    WHERE DATE_FORMAT(rg.create_date, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
    GROUP BY cc.country_code, cc.city_code, cc.country_name, cc.city_name
    ORDER BY count DESC
    LIMIT 5
  `)

  return results as RowDataPacket[]
}

// 일별 신규 회원 (최근 7일)
async function getDailyNewMembers(pool: Pool) {
  const [results] = await pool.query<RowDataPacket[]>(`
    SELECT 
      DATE_FORMAT(created_at, '%m/%d') as date,
      COUNT(*) as count
    FROM member 
    WHERE member_status = 'Y'
    AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
    ORDER BY created_at ASC
  `)

  return results as RowDataPacket[]
}

// 승인 대기 예약 (최근 10건)
async function getPendingReservations(pool: Pool) {
  const [results] = await pool.query<RowDataPacket[]>(`
    SELECT 
      reservation_idx,
      reservation_type,
      first_name,
      last_name,
      total_price,
      create_date
    FROM reservation_master 
    WHERE reservation_status = 'PENDING'
    ORDER BY create_date DESC
    LIMIT 10
  `)

  return results as RowDataPacket[]
}

// 미답변 QnA (최근 10건)
async function getPendingQnas(pool: Pool) {
  const [results] = await pool.query<RowDataPacket[]>(`
    SELECT 
      qna_idx,
      title,
      phone,
      created_at
    FROM qna 
    WHERE answer_status = 'W'
    ORDER BY created_at DESC
    LIMIT 10
  `)

  return results
}

// 최근 리뷰 (최근 10건)
async function getRecentReviews(pool: Pool) {
  const [results] = await pool.query<RowDataPacket[]>(`
    SELECT 
      review_idx,
      review_type,
      review_content,
      review_rate,
      created_at
    FROM review 
    WHERE use_yn = 'Y'
    ORDER BY created_at DESC
    LIMIT 10
  `)

  return results
}

// 유틸리티 함수들
function formatMonth(monthString: string) {
  const [year, month] = monthString.split('-')
  return `${year}년 ${parseInt(month)}월`
}

function getReservationTypeLabel(type) {
  const labels = {
    'GOLF': '골프',
    'HOTEL': '호텔',
    'CADDY': '캐디',
    'TOURNAMENT': '대회'
  }
  return labels[type] || type
}