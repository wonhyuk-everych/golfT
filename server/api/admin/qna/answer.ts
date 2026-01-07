import { defineEventHandler, readBody, createError } from 'h3';
import { getPool } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  // 관리자 인증
  const session = await getUserSession(event);
  if (!session || session?.user?.role !== 'A') {
    throw createError({ statusCode: 401, message: '관리자 인증이 필요합니다.' });
  }

  const body = await readBody(event);
  const qna_idx = Number(body.qna_idx);
  const answer = (body.answer || '').trim();
  const answer_member_idx = session.user.member_idx;

  if (!qna_idx || !answer) {
    throw createError({ statusCode: 400, message: 'qna_idx와 answer는 필수입니다.' });
  }

  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    // 답변 저장 (answer, answer_date, answer_member_idx, answer_status)
    await connection.query(
      `UPDATE qna SET answer = ?, answer_date = NOW(), answer_member_idx = ?, answer_status = 'C' WHERE qna_idx = ?`,
      [answer, answer_member_idx, qna_idx]
    );
    return { success: true };
  } catch (e: any) {
    throw createError({ statusCode: 500, message: e?.message || '답변 저장 중 오류가 발생했습니다.' });
  } finally {
    connection.release();
  }
});
