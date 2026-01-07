import { getPool } from '~/server/utils/db';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  // 1. Session/Admin check
  const session = await getUserSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
  if (session?.user?.role !== 'A') {
    throw createError({
      statusCode: 401,
      message: '인증되지 않은 사용자입니다.'
    });
  }

  // 2. Parse query params
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const status = query.status as string | undefined;
  const keyword = query.keyword as string | undefined;
  const startDate = query.startDate as string | undefined;
  const endDate = query.endDate as string | undefined;

  // 3. Build SQL
  const pool = getPool();
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (status) {
    where += ' AND rm.reservation_status = ?';
    params.push(status);
  }
  if (startDate) {
    where += ' AND rm.create_date >= ?';
    params.push(startDate + ' 00:00:00');
  }
  if (endDate) {
    where += ' AND rm.create_date <= ?';
    params.push(endDate + ' 23:59:59');
  }
  if (keyword) {
    where += ` AND (
      rm.reservation_idx LIKE ? OR
      rm.first_name LIKE ? OR
      rm.last_name LIKE ? OR
      rm.phone_number LIKE ?
    )`;
    for (let i = 0; i < 4; i++) params.push(`%${keyword}%`);
  }

  // 상품수 계산 (각 타입별 테이블에서 count)
  const countCase = `
    (
      (SELECT COUNT(*) FROM reservation_golf rg WHERE rg.reservation_idx = rm.reservation_idx) +
      (SELECT COUNT(*) FROM reservation_hotel rh WHERE rh.reservation_idx = rm.reservation_idx) +
      (SELECT COUNT(*) FROM reservation_caddy rc WHERE rc.reservation_idx = rm.reservation_idx) +
      (SELECT COUNT(*) FROM reservation_tournament rt WHERE rt.reservation_idx = rm.reservation_idx)
    ) AS product_count
  `;

  // 상품 취소 갯수 계산
  const cancelCountCase = `
    (
      (SELECT COUNT(*) FROM reservation_golf rg WHERE rg.reservation_idx = rm.reservation_idx AND rg.reservation_status = 'CANCELLED') +
      (SELECT COUNT(*) FROM reservation_hotel rh WHERE rh.reservation_idx = rm.reservation_idx AND rh.reservation_status = 'CANCELLED') +
      (SELECT COUNT(*) FROM reservation_caddy rc WHERE rc.reservation_idx = rm.reservation_idx AND rc.reservation_status = 'CANCELLED') +
      (SELECT COUNT(*) FROM reservation_tournament rt WHERE rt.reservation_idx = rm.reservation_idx AND rt.reservation_status = 'CANCELLED')
    ) AS cancel_count
  `;

  // 서비스 타입 텍스트 생성 (각 타입별 count가 1 이상인 경우 텍스트 추가)
  const serviceTypesCase = `
    CONCAT_WS(', ',
      IF((SELECT COUNT(*) FROM reservation_golf rg WHERE rg.reservation_idx = rm.reservation_idx) > 0, '골프', NULL),
      IF((SELECT COUNT(*) FROM reservation_hotel rh WHERE rh.reservation_idx = rm.reservation_idx) > 0, '호텔', NULL),
      IF((SELECT COUNT(*) FROM reservation_caddy rc WHERE rc.reservation_idx = rm.reservation_idx) > 0, '캐디', NULL),
      IF((SELECT COUNT(*) FROM reservation_tournament rt WHERE rt.reservation_idx = rm.reservation_idx) > 0, '대회', NULL)
    ) AS service_types
  `;

  // 이용일시 (각 타입별 대표 일시)
  const useDateCase = `
    LEAST(
        COALESCE((SELECT MIN(rg.reservation_date) FROM reservation_golf rg WHERE rg.reservation_idx = rm.reservation_idx), '9999-12-31'),
        COALESCE((SELECT MIN(rh.check_in_date) FROM reservation_hotel rh WHERE rh.reservation_idx = rm.reservation_idx), '9999-12-31'),
        COALESCE((SELECT MIN(rc.reservation_date) FROM reservation_caddy rc WHERE rc.reservation_idx = rm.reservation_idx), '9999-12-31'),
        COALESCE((SELECT MIN(rt.create_date) FROM reservation_tournament rt WHERE rt.reservation_idx = rm.reservation_idx), '9999-12-31')
    ) AS use_date
  `;

  // 닉네임은 member 테이블 조인 필요 (없으면 '')
  const sql = `
    SELECT
      rm.reservation_idx,
      rm.reservation_status,
      rm.reservation_type,
      rm.total_price,
      ${countCase},
      ${cancelCountCase},
      ${serviceTypesCase},
      IFNULL(m.name_kr, '') AS nickname,
      rm.reservation_date,
      ${useDateCase},
      rm.cancel_date
    FROM reservation_master rm
    LEFT JOIN member m ON m.member_idx = rm.member_idx
    ${where}
    ORDER BY rm.reservation_date DESC
    LIMIT ? OFFSET ?
  `;
  params.push(pageSize, offset);

  console.log('sql:', sql)
  
  const [rows] = await pool.query(sql, params);

  // total count
  const [countRows] = await pool.query(
    `SELECT COUNT(*) as total FROM reservation_master rm LEFT JOIN member m ON m.member_idx = rm.member_idx ${where}`,
    params.slice(0, params.length - 2)
  );

  return {
    reservations: rows,
    total: countRows[0]?.total || 0,
    page,
    pageSize
  };
});
