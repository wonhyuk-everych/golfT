import { getPool } from '~/server/utils/db'

// 이벤트 데이터 타입 정의
interface EventData {
  event_idx: number;
  title: string;
  start_date: Date | string;
  end_date: Date | string;
  image_url: string;
}

export default defineEventHandler(async (event) => {
  try {
    // 현재 날짜 가져오기
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식

    // DB 커넥션 가져오기
    const pool = getPool();
    
    // 진행중 이벤트 조회 (현재 날짜보다 종료일이 크거나 같은 이벤트)
    const [ongoingRows] = await pool.query(`
      SELECT
        E.event_idx,
        E.title,
        E.start_date,
        E.end_date,
        I.image_url
      FROM event E
      JOIN event_image I ON E.event_idx = I.event_idx
      WHERE E.event_status = 'Y' AND I.use_yn = 'Y' AND I.main_yn = 'Y'
        AND E.end_date >= ?
      ORDER BY E.start_date DESC
      LIMIT 10
    `, [formattedToday]);

    // 종료된 이벤트 조회 (현재 날짜보다 종료일이 작은 이벤트)
    const [endedRows] = await pool.query(`
      SELECT
        E.event_idx,
        E.title,
        E.start_date,
        E.end_date,
        I.image_url
      FROM event E
      JOIN event_image I ON E.event_idx = I.event_idx
      WHERE E.event_status = 'Y' AND I.use_yn = 'Y' AND I.main_yn = 'Y'
        AND E.end_date < ?
      ORDER BY E.end_date DESC
      LIMIT 10
    `, [formattedToday]);

    // 결과 변환
    return {
      ongoingEvents: ongoingRows as EventData[],
      endedEvents: endedRows as EventData[]
    };
  } catch (error) {
    console.error('이벤트 데이터 조회 중 오류 발생:', error);
    
    // 오류 발생 시 빈 배열 반환
    return {
      ongoingEvents: [],
      endedEvents: [],
      error: '데이터베이스 연결 오류가 발생했습니다.'
    };
  }
})
