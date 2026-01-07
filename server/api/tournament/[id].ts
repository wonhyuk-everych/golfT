import { getPool } from '~/server/utils/db'

// 토너먼트 상세 데이터 타입 정의
interface TournamentDetail {
  tournament_idx: number;
  title: string;
  title_en: string;
  price: number;
  price_explain: string;
  image_use_yn: string;
  image_title: string;
  image_important_yn: string;
  start_date: string;
  end_date: string;
  content: string;
  tournament_status: string; // 'Y' 진행중, 'N' 종료
  image_main_list: string[]; // 메인 이미지 리스트 (M)
  image_explain_list: string[]; // 설명 이미지 리스트 (E)
  is_ended: boolean; // 종료 여부 (status=N 또는 종료일 지남)
}

// DB 결과 타입 정의
interface TournamentRow {
  tournament_idx: number;
  title: string;
  title_en: string;
  price: number;
  image_use_yn: string;
  image_title: string;
  image_important_yn: string;
  start_date: string;
  end_date: string;
  content: string;
  tournament_status: string;
}

interface ImageRow {
  image_url: string;
  image_type: string;
}

export default defineEventHandler(async (event) => {
  try {
    // 토너먼트 ID 가져오기
    const tournamentId = event.context.params?.id
    
    if (!tournamentId) {
      return {
        error: '토너먼트 ID가 제공되지 않았습니다.'
      }
    }

    // DB 커넥션 가져오기
    const pool = getPool()
    
    // 토너먼트 기본 정보 조회
    const [tournamentRows] = await pool.query(`
      SELECT
        E.tournament_idx,
        E.title,
        E.title_en,
        E.price,
        E.price_explain,
        E.image_use_yn,
        E.image_title,
        E.image_important_yn,
        E.start_date,
        DATE_FORMAT(E.end_date, '%Y-%m-%d') as end_date,
        E.content,
        E.tournament_status
      FROM tournament E
      WHERE E.tournament_idx = ? AND E.tournament_status = 'Y'
    `, [tournamentId])
    
    // 토너먼트가 존재하지 않는 경우
    if (!tournamentRows || (tournamentRows as TournamentRow[]).length === 0) {
      return {
        error: '존재하지 않는 토너먼트입니다.'
      }
    }
    
    // 토너먼트 이미지 리스트 조회 (타입별)
    const [imageRows] = await pool.query(`
      SELECT
        I.image_url,
        I.image_type
      FROM tournament_image I
      WHERE I.tournament_idx = ? AND I.use_yn = 'Y'
      ORDER BY I.image_type, I.sort
    `, [tournamentId])
    
    // 토너먼트 상세 데이터 구성
    const t = (tournamentRows as TournamentRow[])[0]

    // 종료 여부 계산: 상태가 'N' 이거나 종료일(YYYY-MM-DD 기준)이 오늘 이전인 경우
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    const todayStr = `${y}-${m}-${d}`
    const endDateStr = t.end_date
    const isEnded = t.tournament_status === 'N' || (endDateStr !== '' && endDateStr < todayStr)

    // 이미지 타입별로 분리
    const allImages = imageRows as ImageRow[]
    const mainImages = allImages.filter(img => img.image_type === 'M').map(img => img.image_url)
    const explainImages = allImages.filter(img => img.image_type === 'E').map(img => img.image_url)

    const tournamentDetail: TournamentDetail = {
      tournament_idx: t.tournament_idx,
      title: t.title,
      title_en: t.title_en,
      price: t.price,
      price_explain: t.price_explain,
      image_use_yn: t.image_use_yn,
      image_title: t.image_title,
      image_important_yn: t.image_important_yn,
      start_date: t.start_date,
      end_date: t.end_date,
      content: t.content,
      tournament_status: t.tournament_status,
      image_main_list: mainImages,
      image_explain_list: explainImages,
      is_ended: isEnded,
    }

    return tournamentDetail
  } catch (error) {
    console.error('토너먼트 상세 조회 중 오류 발생:', error)
    
    return {
      error: '토너먼트 상세 조회 중 오류가 발생했습니다.'
    }
  }
})
