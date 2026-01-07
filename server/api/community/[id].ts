import { getPool } from '~/server/utils/db';
import { FtpUtils } from '~/utils/ftpUtils';

interface SerializableFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
  base64?: string;
}

interface CommunityForm {
  title: string;
  content: string;
  newImages: SerializableFile[];
  removeImages: number[];
}

// 커뮤니티 이미지 타입 정의
interface CommunityImage {
  community_image_idx: number;
  image_url: string;
}

// 커뮤니티 댓글 타입 정의
interface CommunityComment {
  community_comment_idx: number;
  content: string;
  created_at: Date | string;
  name_kr: string;
  own_yn: 'Y' | 'N';
}

export default defineEventHandler(async (event) => {
  // PUT: 게시글 수정
  if (event.method === 'PUT') {
    try {
      const communityIdx = event.context.params?.id;
      if (!communityIdx) {
        return { success: false, error: '게시글 ID가 필요합니다' };
      }
      const pool = getPool();
      const session = await getUserSession(event)
      if (!session?.user) {
        return { success: false, error: '로그인이 필요합니다' };
      }
      // 게시글의 작성자 정보 조회
      const [postDetails] = await pool.query(`
        SELECT C.community_idx, C.title, C.content, C.created_at, C.member_idx, M.name_kr
        FROM community C
        JOIN member M ON C.member_idx = M.member_idx
        WHERE C.community_idx = ? AND C.use_yn = 'Y'
      `, [communityIdx]);
      if (!Array.isArray(postDetails) || postDetails.length === 0) {
        return { success: false, error: '존재하지 않는 게시글입니다' };
      }
      const post = postDetails[0];
      // member_idx 기준으로 본인 글인지 확인
      if (session?.user?.member_idx !== post.member_idx) {
        return { success: false, error: '본인만 수정할 수 있습니다.' };
      }
      // 요청 body에서 수정할 데이터 추출
      // FormData 파싱 (멀티파트)
      const form = await readBody<CommunityForm>(event);

      if (!form.title || !form.content) {
        return { success: false, error: '제목과 내용을 모두 입력해주세요.' }
      }
      // DB 텍스트 업데이트
      await pool.query(
        'UPDATE community SET title = ?, content = ? WHERE community_idx = ? AND use_yn = "Y"',
        [form.title, form.content, communityIdx]
      )
      // 기존 이미지 DB에서만 삭제
      if (form.removeImages?.length > 0) {
        for (const idx of form.removeImages) {
          await pool.query('DELETE FROM community_image WHERE community_idx = ? AND community_image_idx = ?', [communityIdx, idx])
        }
      }

      // 새 이미지 저장 및 DB 등록
      if(form.newImages?.length > 0){
        // 파일 업로드 - base64 문자열을 Buffer로 변환
        const fileToBuffer = (file: SerializableFile): Buffer => {
          // base64 데이터에서 실제 데이터 부분만 추출 (data:image/jpeg;base64, 같은 prefix 제거)
          const base64Data = file.base64?.split(',')[1] || '';
          return Buffer.from(base64Data, 'base64');
        };
        
        const filesWithBuffer = form.newImages.map((file: SerializableFile) => ({
          buffer: fileToBuffer(file),
          originalname: file.name,
          mimetype: file.type,
        }));
        
        const ftp = new FtpUtils()
        const imageUrls = await ftp.uploadFilesFromBuffer(filesWithBuffer, `community/${communityIdx}`)
  
        let sort = 1
        for (const img of imageUrls) {
          await pool.query(
            'INSERT INTO community_image (community_idx, image_url, sort) VALUES (?, ?, ?)',
            [communityIdx, img, sort]
          );
          sort++;
        }
      }

      return { success: true };

    } catch (error) {
      console.error('게시글 수정 오류:', error);
      return { success: false, error: '게시글 수정 실패', message: error instanceof Error ? error.message : '알 수 없는 오류' };
    }
  }

  try {
    // URL에서 community_idx 가져오기
    const communityIdx = event.context.params?.id;
    
    if (!communityIdx) {
      return {
        success: false,
        error: '게시글 ID가 필요합니다'
      };
    }
    
    // DB 커넥션 가져오기
    const pool = getPool();
    const session = await getUserSession(event)
    
    // 게시글 상세 정보 조회
    const [postDetails] = await pool.query(`
      SELECT
        C.community_idx,
        C.title,
        C.content,
        C.created_at,
        M.name_kr,
        CC.city_name,
        CC.city_name_en,
        C.member_idx
      FROM community C
      JOIN member M ON C.member_idx = M.member_idx
      JOIN country_code CC ON C.country_code_idx = CC.country_code_idx
      WHERE
        C.community_idx = ?
        AND C.use_yn = 'Y'
    `, [communityIdx]);
    
    // 게시글이 없는 경우
    if (Array.isArray(postDetails) && postDetails.length === 0) {
      return {
        success: false,
        error: '존재하지 않는 게시글입니다'
      };
    }
    
    // 게시글 이미지 조회
    const [images] = await pool.query(`
      SELECT community_image_idx, image_url 
      FROM community_image 
      WHERE community_idx = ? AND use_yn = 'Y' 
      ORDER BY sort
    `, [communityIdx]);
    
    // 게시글 댓글 조회 (최초 10개)
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
      LIMIT 10
    `, [session?.user?.member_idx, communityIdx]);
    
    // 전체 댓글 수 조회
    const [commentCountResult] = await pool.query(`
      SELECT COUNT(*) as total
      FROM community_comment
      WHERE community_idx = ? AND use_yn = 'Y'
    `, [communityIdx]);
    
    interface CountResult {
      total: number;
    }
    
    const totalComments = (commentCountResult as CountResult[])[0].total;
    const hasMoreComments = totalComments > comments.length;
    
    // isAuthor 계산 (세션에서 member_idx 추출)
    let isAuthor: 'Y' | 'N' = 'N';
    const post = (postDetails as any[])[0];
    if (session?.user?.member_idx && post && post.member_idx && session?.user?.member_idx === post.member_idx) {
      isAuthor = 'Y';
    }
    
    return {
      success: true,
      data: {
        post,
        images: images as CommunityImage[],
        comments: comments as CommunityComment[],
        commentPagination: {
          total: totalComments,
          hasMore: hasMoreComments
        },
        isAuthor
      }
    };
  } catch (error) {
    console.error('커뮤니티 상세 조회 API 오류:', error);
    return {
      success: false,
      error: '게시글 상세 정보 조회 실패',
      message: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
});
