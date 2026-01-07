import { readBody } from 'h3';
import { getPool } from '~/server/utils/db';

// 댓글 추가 요청 타입 정의
interface AddCommentRequest {
  community_idx: number;
  content: string;
}

export default defineEventHandler(async (event) => {
  try {
    // 세션 확인 (로그인 여부 확인)
    const session = await getUserSession(event)
    const memberIdx = session.user.member_idx
    
    if (!session || !memberIdx) {
      return {
        success: false,
        error: '로그인이 필요합니다'
      };
    }
    
    // 요청 바디에서 데이터 가져오기
    const body = await readBody(event) as AddCommentRequest;
    
    if (!body.community_idx || !body.content) {
      return {
        success: false,
        error: '필수 정보가 누락되었습니다'
      };
    }
    
    // DB 커넥션 가져오기
    const pool = getPool();

    //오늘 날짜로 10개이상 등록한 댓글이 있는지 조사
    const query = `SELECT COUNT(*) AS count FROM community_comment WHERE community_idx = ? AND member_idx = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)`;
    const [rows] = await pool.query(query, [body.community_idx, memberIdx]);
    const count = (rows as Array<{ count: number }>)[0].count;
    if (count > 5) {
      return {
        success: false,
        error: 'tooManyComments'
      }
    }
    
    // 댓글 추가
    const [result] = await pool.query(`
      INSERT INTO community_comment (
        community_idx,
        member_idx,
        content,
        use_yn,
        created_at
      ) VALUES (?, ?, ?, 'Y', NOW())
    `, [body.community_idx, memberIdx, body.content]);


    // 댓글 알림
    /**
    const notificationQuery = `
      INSERT INTO community_alarm (
        community_idx,
        member_idx,
        content
      ) VALUES (?, ?, ?)
    `;
    await pool.query(notificationQuery, [body.community_idx, memberIdx, body.content]);
     */
    
    // 추가된 댓글 정보 조회
    const [commentData] = await pool.query(`
      SELECT
        CC.community_comment_idx,
        CC.content,
        CC.created_at,
        M.name_kr
      FROM community_comment CC
      JOIN member M ON CC.member_idx = M.member_idx
      WHERE CC.community_comment_idx = ?
    `, [(result as any).insertId]);
    
    return {
      success: true,
      message: '댓글이 추가되었습니다',
      data: {
        comment: commentData[0]
      }
    };
  } catch (error) {
    console.error('댓글 추가 API 오류:', error);
    return {
      success: false,
      error: '댓글 추가 실패',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
});
