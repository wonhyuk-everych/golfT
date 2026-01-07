import { getQuery } from 'h3';
import { getPool } from '~/server/utils/db';

// 커뮤니티 댓글 타입 정의
interface CommunityComment {
  community_comment_idx: number;
  content: string;
  created_at: Date | string;
  name_kr: string;
  own_yn: string;
}

export default defineEventHandler(async (event) => {
  // DELETE: 댓글 삭제
  if (event.method === 'DELETE') {
    try {
      const commentId = event.context.params?.id
      if (!commentId) {
        return { success: false, error: '댓글 ID가 필요합니다' }
      }
      const session = await getUserSession(event)
      if (!session?.user?.member_idx) {
        return { success: false, error: '로그인이 필요합니다' }
      }
      const pool = getPool()
      // 본인 댓글인지 확인
      const [rows] = await pool.query('SELECT member_idx FROM community_comment WHERE community_comment_idx = ? AND use_yn = "Y"', [commentId])
      const comment = (rows as any[])[0]
      if (!comment || comment.member_idx !== session.user.member_idx) {
        return { success: false, error: '본인 댓글만 삭제할 수 있습니다.' }
      }
      // soft delete
      await pool.query('UPDATE community_comment SET use_yn = "N" WHERE community_comment_idx = ?', [commentId])
      return { success: true }
    } catch (e) {
      return { success: false, error: '댓글 삭제 중 오류 발생' }
    }
  }

  // GET: 기존 댓글 목록 조회
  try {
    // URL에서 community_idx 가져오기
    const communityId = event.context.params?.id;
    const session = await getUserSession(event)
    
    
    // 쿼리 파라미터 가져오기
    const { page = 1, limit = 10 } = getQuery(event);
    
    if (!communityId) {
      return {
        success: false,
        error: '게시글 ID가 필요합니다'
      };
    }
    
    // 페이지네이션 값 계산
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    
    // DB 커넥션 가져오기
    const pool = getPool();
    
    // 게시글 댓글 조회 (페이지네이션 적용)
    const [comments] = await pool.query(`
      SELECT
        CC.community_comment_idx,
        CC.content,
        CC.created_at,
        M.name_kr,
        CASE WHEN CC.member_idx = ? THEN 'Y' ELSE 'N' END AS own_yn
      FROM community_comment CC
      JOIN member M ON CC.member_idx = M.member_idx
      WHERE community_idx = ? AND use_yn = 'Y'
      ORDER BY created_at DESC
      LIMIT ?, ?
    `, [session?.user?.member_idx, communityId, skip, take]);
    
    // 전체 댓글 수 조회
    const [commentCountResult] = await pool.query(`
      SELECT COUNT(*) as total
      FROM community_comment
      WHERE community_idx = ? AND use_yn = 'Y'
    `, [communityId]);
    
    interface CountResult {
      total: number;
    }
    
    const totalComments = (commentCountResult as CountResult[])[0].total;
    const totalPages = Math.ceil(totalComments / Number(limit));
    const hasMoreComments = Number(page) < totalPages;
    
    return {
      success: true,
      data: {
        comments: comments as CommunityComment[],
        pagination: {
          total: totalComments,
          page: Number(page),
          limit: Number(limit),
          hasMore: hasMoreComments
        }
      }
    };
  } catch (error) {
    console.error('커뮤니티 댓글 조회 API 오류:', error);
    return {
      success: false,
      error: '댓글 조회 실패',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
});
