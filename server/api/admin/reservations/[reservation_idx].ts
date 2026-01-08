import { getPool } from '~/server/utils/db'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session || session?.user?.role !== 'A') {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const { reservation_idx } = event.context.params
  const pool = getPool()

  // 예약 마스터/회원 정보
  const [masterRows] = await pool.query(
    `SELECT rm.*, m.member_idx, m.name_kr, m.id FROM reservation_master rm LEFT JOIN member m ON m.member_idx = rm.member_idx WHERE rm.reservation_idx = ?`,
    [reservation_idx]
  )
  const master = masterRows[0] || null
  const member = master ? { member_idx: master.member_idx, name: master.name_kr, user_id: master.id } : null

  // 골프장
  const [golf] = await pool.query(`SELECT DATE_FORMAT(rg.reservation_date, '%Y-%m-%d') as reservation_date_str, rg.*, c.name_kr FROM reservation_golf rg LEFT JOIN golf_course c ON rg.course_idx = c.course_idx WHERE reservation_idx = ?`, [reservation_idx])
  
  // 골프장 예약 시간 정보 가져오기
  const golfWithTimes = await Promise.all((golf as any[]).map(async (g) => {
    if (g.golf_time_price_idx) {
      const [timeRows] = await pool.query<any[]>(
        `SELECT start_time, end_time FROM golf_course_time_price WHERE golf_monthly_price_idx = ? AND golf_time_price_idx = ?`, 
        [g.golf_monthly_price_idx, g.golf_time_price_idx]
      )
      if (timeRows && timeRows.length > 0) {
        return { ...g, start_time: timeRows[0].start_time, end_time: timeRows[0].end_time }
      }
    }
    return g
  }))
  // 호텔
  const [hotel] = await pool.query(`SELECT rh.*, h.name_kr FROM reservation_hotel rh LEFT JOIN hotel h ON rh.hotel_idx = h.hotel_idx WHERE reservation_idx = ?`, [reservation_idx])
  // 캐디
  const [caddy] = await pool.query(`SELECT rc.*, cd.caddy_idx, cd.name FROM reservation_caddy rc LEFT JOIN caddy cd ON rc.caddy_idx = cd.caddy_idx WHERE reservation_idx = ?`, [reservation_idx])
  // 콜밴
  const [callvan] = await pool.query(`SELECT rc.*, gc.name_kr FROM reservation_callvan rc LEFT JOIN golf_course gc ON rc.course_idx = gc.course_idx WHERE reservation_idx = ?`, [reservation_idx])
  // 대회
  const [tournament] = await pool.query(`SELECT rt.*, t.title FROM reservation_tournament rt LEFT JOIN tournament t ON rt.tournament_idx = t.tournament_idx WHERE reservation_idx = ?`, [reservation_idx])

  return {
    master,
    member,
    golf: golfWithTimes,
    hotel,
    caddy,
    callvan,
    tournament
  }
})
