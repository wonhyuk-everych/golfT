import { getQuery } from 'h3';
import { getPool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const { qna_idx } = getQuery(event);
  if (!qna_idx) {
    return { 
      success: false,
      error: '잘못된 요청 입니다.' 
    };
  }

  const session = await getUserSession(event);
  const memberIdx = session?.user?.member_idx;

  if (!memberIdx) {
    return { 
      success: false,
      error: '로그인 후 이용해주세요.' 
    };
  }

  const pool = getPool();

  //내 QnA 인지 확인
  const [myQnaRows] = await pool.query(
    `SELECT qna.qna_idx FROM qna WHERE qna.qna_idx = ? AND qna.member_idx = ? LIMIT 1`,
    [qna_idx, memberIdx]
  );

  if (myQnaRows.length === 0) {
    return { 
      success: false,
      error: '다른 사용자의 문의는 보실수 없습니다.' 
    };
  }

  // QnA 상세 정보 조회
  const [qnaRows] = await pool.query(
    `SELECT qna.qna_idx,
            qna_type.name_kr as qna_type_name_kr,
            qna_type.name_en as qna_type_name_en,
            qna.title,
            qna.content,
            qna.answer,
            qna.answer_date,
            admin_member.name_kr as admin_member_name_kr,
            qna.created_at,
            qna.answer_status,
            member.name_kr as member_name_kr
     FROM qna
     JOIN qna_type ON qna.qna_type_idx = qna_type.qna_type_idx
     JOIN member ON qna.member_idx = member.member_idx
     LEFT JOIN member admin_member ON qna.answer_member_idx = admin_member.member_idx
     WHERE qna.qna_idx = ?
     LIMIT 1`,
    [qna_idx]
  );

  // QnA 이미지 리스트 조회
  const [imageRows] = await pool.query(
    `SELECT image_url FROM qna_image WHERE qna_idx = ? ORDER BY qna_idx`,
    [qna_idx]
  );

  return {
    success: true,
    qna: qnaRows[0] || null,
    images: imageRows || []
  };
});
