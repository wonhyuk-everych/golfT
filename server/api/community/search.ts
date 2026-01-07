import { getQuery } from 'h3';
import { getPool } from '~/server/utils/db';

// 검색 파라미터 타입 정의
interface SearchParams {
  page?: number;
  limit?: number;
  country_code_idx?: number;
  keyword?: string;
}

// 커뮤니티 게시글 타입 정의
interface CommunityPost {
  community_idx: number;
  title: string;
  created_at: Date | string;
  name_kr: string;
  city_name: string;
  city_name_en: string;
  comment_count: number;
}

// 도시 정보 타입 정의
interface CityData {
  country_code_idx: number;
  city_name: string;
  city_name_en: string;
}

export default defineEventHandler(async (event) => {
  try {
    // 쿼리 파라미터 가져오기
    const { page = 1, limit = 10, country_code_idx, keyword } = getQuery(event) as SearchParams;
    
    // 페이지네이션 값 계산
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    
    // DB 커넥션 가져오기
    const pool = getPool();
    
    // 도시 목록 조회
    const [cities] = await pool.query(`
      SELECT country_code_idx, city_name, city_name_en 
      FROM country_code
    `);
    
    // WHERE 절 구성
    let whereClause = 'WHERE C.use_yn = "Y"';
    const queryParams: (string | number)[] = [];
    
    // 국가/도시 필터 추가
    if (country_code_idx) {
      whereClause += ' AND C.country_code_idx = ?';
      queryParams.push(Number(country_code_idx));
    }
    
    // 키워드 검색 필터 추가
    if (keyword) {
      whereClause += ' AND (C.title LIKE ? OR C.content LIKE ?)';
      queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }
    
    // 전체 게시글 수 조회 (페이지네이션용)
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total
      FROM community C
      ${whereClause}
    `, queryParams);
    
    interface CountResult {
      total: number;
    }
    
    const totalCount = (countResult as CountResult[])[0].total;
    
    // 커뮤니티 게시글 조회 (페이지네이션 적용)
    const [posts] = await pool.query(`
      SELECT 
        C.community_idx,
        C.title,
        C.created_at,
        M.name_kr,
        CC.city_name,
        CC.city_name_en,
        (SELECT COUNT(*) FROM community_comment WHERE community_idx = C.community_idx AND use_yn = 'Y') as comment_count
      FROM community C
      JOIN member M ON C.member_idx = M.member_idx
      JOIN country_code CC ON C.country_code_idx = CC.country_code_idx
      ${whereClause}
      ORDER BY C.created_at DESC
      LIMIT ?, ?
    `, [...queryParams, skip, take]);
    
    // 페이지네이션 메타데이터 계산
    const totalPages = Math.ceil(totalCount / take);
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;
    
    return {
      success: true,
      data: {
        cities: cities as CityData[],
        posts: posts as CommunityPost[],
        pagination: {
          total: totalCount,
          page: Number(page),
          limit: take,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }
    };
  } catch (error) {
    console.error('커뮤니티 검색 API 오류:', error);
    return {
      success: false,
      error: '커뮤니티 데이터 조회 실패',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
});
