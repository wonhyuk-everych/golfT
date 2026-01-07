import { getPool } from '~/server/utils/db'

// 지역 정보 타입 정의
interface RegionData {
  country_code_idx: number;
  city_name: string;
  city_name_en: string;
}

export default defineEventHandler(async (_event) => {
  try {
    // DB 커넥션 가져오기
    const pool = getPool()
    
    // 지역 데이터 조회
    const [regions] = await pool.query(`
      SELECT country_code_idx, city_name, city_name_en 
      FROM country_code
      ORDER BY city_name ASC
    `)
    
    return {
      success: true,
      data: {
        regions: regions as RegionData[]
      }
    }
  } catch (error) {
    console.error('지역 데이터 API 오류:', error)
    return {
      success: false,
      error: '서버 오류가 발생했습니다'
    }
  }
})
