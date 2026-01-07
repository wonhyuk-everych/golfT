import { getPool } from '~/server/utils/db'

// 이벤트 상세 데이터 타입 정의
interface EventDetail {
  event_idx: number;
  title: string;
  images: string[];
}

// DB 결과 타입 정의
interface EventRow {
  event_idx: number;
  title: string;
}

interface ImageRow {
  image_url: string;
}

export default defineEventHandler(async (event) => {
  try {
    // 이벤트 ID 가져오기
    const eventId = event.context.params?.id
    
    if (!eventId) {
      return {
        error: '이벤트 ID가 제공되지 않았습니다.'
      }
    }

    // DB 커넥션 가져오기
    const pool = getPool()
    
    // 이벤트 기본 정보 조회
    const [eventRows] = await pool.query(`
      SELECT
        E.event_idx,
        E.title
      FROM event E
      WHERE E.event_idx = ? AND E.event_status = 'Y'
    `, [eventId])
    
    // 이벤트가 존재하지 않는 경우
    if (!eventRows || (eventRows as EventRow[]).length === 0) {
      return {
        error: '존재하지 않는 이벤트입니다.'
      }
    }
    
    // 이벤트 이미지 리스트 조회
    const [imageRows] = await pool.query(`
      SELECT
        I.image_url
      FROM event_image I
      WHERE I.event_idx = ? AND I.use_yn = 'Y' AND I.main_yn = 'N'
      ORDER BY I.sort
    `, [eventId])
    
    // 이벤트 상세 데이터 구성
    const eventDetail: EventDetail = {
      event_idx: (eventRows as EventRow[])[0].event_idx,
      title: (eventRows as EventRow[])[0].title,
      images: (imageRows as ImageRow[]).map(row => row.image_url)
    }
    
    return eventDetail
  } catch (error) {
    console.error('이벤트 상세 조회 중 오류 발생:', error)
    
    return {
      error: '이벤트 상세 조회 중 오류가 발생했습니다.'
    }
  }
})
