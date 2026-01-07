import { defineEventHandler, getQuery } from 'h3'
import { getPool } from '~/server/utils/db'

// Constants
const PAGE_SIZE = 20

export default defineEventHandler(async (event) => {
  // 1. Parse query params
  const { type, page = 1 } = getQuery(event)
  if (!type || !['G', 'H', 'C'].includes(type as string)) {
    return { error: 'Invalid type parameter' }
  }
  const pageNum = Number(page) || 1
  const offset = (pageNum - 1) * PAGE_SIZE

  // 2. Get current user
  const session = await getUserSession(event)

  const cookies = parseCookies(event)
  const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'

  const memberIdx = session?.user?.member_idx
  if (!memberIdx) {
    return { error: 'Unauthorized' }
  }

  // 3. 상품별 wish 조인 쿼리로 데이터 조회
  const pool = await getPool()
  let items = []
  let total = 0

  if (type === 'G') {
    // Golf Courses + wish 조인
    const [rows] = await pool.query(
      `SELECT
        w.wish_idx,
        c.course_idx AS id,
        c.name_kr,
        c.name_en,
        c.city_code,
        p.min_price as round_price,
        c.created_at,
        CONCAT('#', (SELECT country_name FROM country_code WHERE country_code = c.country_code LIMIT 1), ' #',
        (SELECT city_name FROM country_code WHERE city_code = c.city_code LIMIT 1))as location,
        CONCAT('#', (SELECT country_name_en FROM country_code WHERE country_code = c.country_code LIMIT 1), ' #',
        (SELECT city_name_en FROM country_code WHERE city_code = c.city_code LIMIT 1))as locationEn,
        gci.main_image_url as image
      FROM wish w
      INNER JOIN golf_course c ON w.product_idx = c.course_idx
      LEFT JOIN golf_course_image gci ON c.course_idx = gci.course_idx
      LEFT JOIN golf_course_monthly_price p ON c.course_idx = p.course_idx AND p.target_year = DATE_FORMAT(NOW(), '%Y') AND p.target_month = DATE_FORMAT(NOW(), '%m')
      WHERE w.member_idx = ? AND w.wish_type = 'G' AND w.use_yn = 'Y' AND c.course_status = 'Y'
      ORDER BY w.wish_idx DESC
      LIMIT ? OFFSET ?`,
      [memberIdx, PAGE_SIZE, offset]
    )
    items = rows.map((row: any) => ({
      id: row.id,
      name: locale === 'ko' ? row.name_kr : row.name_en,
      location: locale === 'ko' ? row.location : row.locationEn,
      image: row.image,
      price: row.round_price,
      createdAt: row.created_at,
      wishId: row.wish_idx
    }))
    // 전체 개수 조회
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as cnt FROM wish w INNER JOIN golf_course c ON w.product_idx = c.course_idx WHERE w.member_idx = ? AND w.wish_type = 'G' AND w.use_yn = 'Y' AND c.course_status = 'Y'`,
      [memberIdx]
    )
    total = countRows[0].cnt
  } else if (type === 'H') {
    // Hotels + wish 조인
    const [rows] = await pool.query(
      `SELECT
        w.wish_idx,
        H.hotel_idx AS id,
        H.name_kr,
        H.name_en,
        (SELECT image_url FROM hotel_image WHERE hotel_idx = H.hotel_idx AND use_yn = 'Y' AND main_yn = 'Y' LIMIT 1) AS image_url,
        CONCAT('#', (SELECT country_name FROM country_code WHERE country_code = H.country_code LIMIT 1), ' #',
        (SELECT city_name FROM country_code WHERE city_code = H.city_code LIMIT 1))as location,
        CONCAT('#', (SELECT country_name_en FROM country_code WHERE country_code = H.country_code LIMIT 1), ' #',
        (SELECT city_name_en FROM country_code WHERE city_code = H.city_code LIMIT 1))as locationEn,
        (SELECT HR.room_sale_price FROM hotel_room HR WHERE HR.hotel_idx = H.hotel_idx AND HR.use_yn = 'Y' ORDER BY HR.room_sale_price LIMIT 1) AS price,
        H.created_at
      FROM wish w
      INNER JOIN hotel H ON w.product_idx = H.hotel_idx
      WHERE w.member_idx = ? AND w.wish_type = 'H' AND w.use_yn = 'Y' AND H.hotel_status = 'Y'
      ORDER BY w.wish_idx DESC
      LIMIT ? OFFSET ?`,
      [memberIdx, PAGE_SIZE, offset]
    )
    items = rows.map((row: any) => ({
      id: row.id,
      name: locale === 'ko' ? row.name_kr : row.name_en,
      location: locale === 'ko' ? row.location : row.locationEn,
      image: row.image_url,
      price: row.price,
      createdAt: row.created_at,
      wishId: row.wish_idx
    }))
    // 전체 개수 조회
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as cnt FROM wish w INNER JOIN hotel H ON w.product_idx = H.hotel_idx WHERE w.member_idx = ? AND w.wish_type = 'H' AND w.use_yn = 'Y' AND H.hotel_status = 'Y'`,
      [memberIdx]
    )
    total = countRows[0].cnt
  } else if (type === 'C') {
    // Caddies + wish 조인
    const [rows] = await pool.query(
      `SELECT
        w.wish_idx,
        C.caddy_idx as id,
        G.name_kr as golfNameKr,
        G.name_en as golfNameEn,
        (C.price + C.reservation_fee) as price,
        CONCAT(C.name, ' (', C.caddy_code, ')') as name,
        CONCAT('#', (SELECT country_name FROM country_code WHERE country_code = G.country_code LIMIT 1), ' #',
          (SELECT city_name FROM country_code WHERE city_code = G.city_code LIMIT 1))as location,
        CONCAT('#', (SELECT country_name_en FROM country_code WHERE country_code = G.country_code LIMIT 1), ' #',
          (SELECT city_name_en FROM country_code WHERE city_code = G.city_code LIMIT 1))as locationEn,
        (SELECT image_url FROM caddy_image WHERE caddy_idx = C.caddy_idx ORDER BY sort ASC LIMIT 1) AS imageUrl,
        C.created_at
      FROM wish w
      INNER JOIN caddy C ON w.product_idx = C.caddy_idx
      JOIN golf_course G ON C.course_idx = G.course_idx
      WHERE w.member_idx = ? AND w.wish_type = 'C' AND w.use_yn = 'Y' AND C.caddy_status = 'Y'
      ORDER BY w.wish_idx DESC
      LIMIT ? OFFSET ?`,
      [memberIdx, PAGE_SIZE, offset]
    )
    items = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      location: locale === 'ko' ? row.location : row.locationEn,
      image: row.imageUrl,
      price: row.price,
      createdAt: row.created_at,
      wishId: row.wish_idx,
      tags: [
        {
          type: 'white',
          text: locale === 'ko' ? row.golfNameKr : row.golfNameEn,
        }
      ]
    }))
    // 전체 개수 조회
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as cnt FROM wish w INNER JOIN caddy C ON w.product_idx = C.caddy_idx WHERE w.member_idx = ? AND w.wish_type = 'C' AND w.use_yn = 'Y' AND C.caddy_status = 'Y'`,
      [memberIdx]
    )
    total = countRows[0].cnt
  }

  return {
    items,
    total
  }
})

