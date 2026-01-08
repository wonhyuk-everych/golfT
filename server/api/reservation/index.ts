import { parseCookies } from 'h3'
import { getPool } from '~/server/utils/db'

interface Reservation {
  image?: string;
  reservationIdx: number;
  productName: string;
  productNameEn: string;
  reservationDate1: string;
  reservationDate2: string;
  reservationStatus: string;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const cookies = parseCookies(event)
  const locale = cookies['user-locale'] || cookies['i18n_redirected'] || 'ko'

  const session = await getUserSession(event)
  const memberIdx = session?.user?.member_idx

  // Params
  // Safely parse reservation_type as string
  const reservationType = typeof query.reservation_type === 'string' ? query.reservation_type.toUpperCase() : 'G'
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const pageSize = Math.min(20, parseInt(query.pageSize as string) || 20)
  const offset = (page - 1) * pageSize

  const pool = getPool()
  let sql = ''
  let countSql = ''
  const params: [number, number, number] = [memberIdx, pageSize, offset]
  const countParams: [number] = [memberIdx]

  switch (reservationType) {
    case 'H':
      sql = `
        SELECT
          RH.reservation_hotel_idx AS product_idx,
          RH.check_in_date AS reservation_date,
          RH.check_out_date AS reservation_date2,
          CASE WHEN RH.check_in_date < NOW() THEN 'USED' ELSE RH.reservation_status END AS reservation_status,
          H.name_kr,
          H.name_en,
          (SELECT image_url FROM hotel_image WHERE hotel_idx = RH.hotel_idx AND use_yn = 'Y' AND main_yn = 'Y' LIMIT 1) AS image,
          H.hotel_idx AS idx
        FROM reservation_hotel RH
        JOIN hotel H ON H.hotel_idx = RH.hotel_idx
        JOIN reservation_master RM ON RH.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ?
        ORDER BY RH.reservation_hotel_idx DESC, RH.check_in_date
        LIMIT ? OFFSET ?`
      countSql = `
        SELECT COUNT(*) as total
        FROM reservation_hotel RH
        JOIN hotel H ON H.hotel_idx = RH.hotel_idx
        JOIN reservation_master RM ON RH.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ?`
      break
    case 'C':
      sql = `
        SELECT
          RC.reservation_caddy_idx AS product_idx,
          CASE WHEN RC.reservation_date < NOW() THEN 'USED' ELSE RC.reservation_status END AS reservation_status,
          '' AS reservation_date2,
          C.name AS name_kr,
          C.nick_name AS name_en,
          (SELECT image_url FROM caddy_image WHERE caddy_idx = RC.caddy_idx AND main_yn = 'Y' LIMIT 1) AS image,
          C.caddy_idx AS idx
        FROM reservation_caddy RC
        JOIN caddy C ON C.caddy_idx = RC.caddy_idx
        JOIN reservation_master RM ON RC.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ?
        ORDER BY RC.reservation_caddy_idx DESC, RC.reservation_date
        LIMIT ? OFFSET ?`
      countSql = `
        SELECT COUNT(*) as total
        FROM reservation_caddy RC
        JOIN caddy C ON C.caddy_idx = RC.caddy_idx
        JOIN reservation_master RM ON RC.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ?`
      break
    case 'V':
      sql = `
        SELECT
          RC.reservation_callvan_idx AS product_idx,
          RC.start_date AS reservation_date,
          '' AS reservation_date2,
          RC.reservation_status,
          GC.name_kr,
          GC.name_en,
          NULL AS image,
          GC.course_idx AS idx
        FROM reservation_callvan RC
        JOIN golf_course GC ON RC.course_idx = GC.course_idx
        JOIN reservation_master RM ON RC.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ?
        ORDER BY RC.reservation_callvan_idx DESC, RC.start_date
        LIMIT ? OFFSET ?`
      countSql = `
        SELECT COUNT(*) as total
        FROM reservation_callvan RC
        JOIN golf_course GC ON RC.course_idx = GC.course_idx
        JOIN reservation_master RM ON RC.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ?`
      break
    case 'G':
    default:
      sql = `
        SELECT
          RG.reservation_golf_idx AS product_idx,
          DATE_FORMAT(RG.reservation_date, '%Y-%m-%d') AS reservation_date,
          (
          CASE
            WHEN RG.golf_price_type = 'weekday' THEN (SELECT start_time FROM golf_course_time_price CTP WHERE RG.golf_time_price_idx = CTP.golf_time_price_idx)
            ELSE (SELECT start_time FROM golf_course_exception_price CEP WHERE RG.golf_exception_price_idx = CEP.golf_exception_price_idx)
          END
          ) AS reservation_date2,
          CASE WHEN RG.reservation_date < NOW() THEN 'USED' ELSE RG.reservation_status END AS reservation_status,
          GC.name_kr,
          GC.name_en,
          (SELECT main_image_url FROM golf_course_image WHERE course_idx = GC.course_idx LIMIT 1) AS image,
          GC.course_idx AS idx
        FROM reservation_golf RG
        JOIN golf_course GC ON RG.course_idx = GC.course_idx
        JOIN reservation_master RM ON RG.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ?
        ORDER BY RG.reservation_golf_idx DESC, RG.reservation_date
        LIMIT ? OFFSET ?`
      countSql = `
        SELECT COUNT(*) as total
        FROM reservation_golf RG
        JOIN golf_course GC ON RG.course_idx = GC.course_idx
        JOIN reservation_master RM ON RG.reservation_idx = RM.reservation_idx
        WHERE RM.member_idx = ?`
      break
    case 'T':
      sql = `
        SELECT
          RT.reservation_tournament_idx AS product_idx,
          '' AS reservation_date,
          '' AS reservation_date2,
          RT.reservation_status,
          T.title AS name_kr,
          T.title_en AS name_en,
          (SELECT image_url FROM tournament_image WHERE tournament_idx = RT.tournament_idx AND main_yn = 'Y' LIMIT 1) AS image,
          T.tournament_idx AS idx
        FROM reservation_tournament RT
        JOIN tournament T ON T.tournament_idx = RT.tournament_idx
        WHERE RT.member_idx = ?
        ORDER BY RT.reservation_tournament_idx DESC
        LIMIT ? OFFSET ?`
      countSql = `
        SELECT COUNT(*) as total
        FROM reservation_tournament RT
        JOIN tournament T ON T.tournament_idx = RT.tournament_idx
        WHERE RT.member_idx = ?`
      break
  }

  try {
    // Define a type for the row result
    type ReservationRow = {
      product_idx: number;
      reservation_date: string;
      reservation_date2?: string;
      reservation_status: string;
      name_kr: string;
      name_en: string;
      image?: string | null;
      idx: number;
    }
    // Query for data and total count
    const [rowsRaw] = await pool.query(sql, params) as unknown as [ReservationRow[]]
    const [countRowsRaw] = await pool.query(countSql, countParams) as unknown as [{ total: number }[]]
    const rows = Array.isArray(rowsRaw) ? rowsRaw : []
    const countRows = Array.isArray(countRowsRaw) ? countRowsRaw : []
    const total = countRows[0]?.total || 0
    // Map to Reservation interface
    const reservations: Reservation[] = rows.map(row => ({
      image: row.image || undefined,
      reservationIdx: row.product_idx,
      productName: locale === 'en' ? row.name_en : row.name_kr,
      productNameEn: row.name_en,
      reservationDate1: row.reservation_date,
      reservationDate2: row.reservation_date2 || '',
      reservationStatus: row.reservation_status,
    }))
    return {
      page,
      pageSize,
      total,
      reservations
    }
  } catch (e) {
    return { error: 'DB error', detail: e instanceof Error ? e.message : e }
  }
})