import { defineEventHandler, getQuery, createError } from 'h3';
import { getPool } from '~/server/utils/db';
// import type { Qna } from '~/types/admin/qna'; // Uncomment if you have a Qna type
export default defineEventHandler(async (event) => {
  // Authentication check (pattern after community admin search)
  const session = await getUserSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
  if (session?.user?.role !== 'A') {
    throw createError({
      statusCode: 401,
      message: '인증되지 않은 사용자입니다.',
    });
  }

  const query = getQuery(event);
  const qna_type_idx = query.qna_type_idx ? Number(query.qna_type_idx) : undefined;
  const answer_status = query.answer_status;
  const searchWord = (query.searchWord as string) || '';
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const take = limit;

  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params: (string | number)[] = [];
    if (qna_type_idx) {
      whereClause += ' AND qna.qna_type_idx = ?';
      params.push(qna_type_idx);
    }
    if (answer_status === 'C') {
      whereClause += " AND qna.answer_status = 'C'";
    } else if (answer_status === 'W') {
      whereClause += " AND (qna.answer_status IS NULL OR qna.answer_status = 'W')";
    }
    if (searchWord) {
      whereClause += ' AND (qna.title LIKE ? OR qna.content LIKE ?)';
      params.push(`%${searchWord}%`, `%${searchWord}%`);
    }

    // Get total count
    const [countResult] = await connection.query(
      `SELECT COUNT(*) as total FROM qna ${whereClause}`,
      params
    );
    const total = (countResult as any)[0].total;

    // Get QnA list
    const [rows] = await connection.query(
      `SELECT qna.qna_idx,
              qna_type.name_kr as qna_type_name_kr,
              qna_type.name_en as qna_type_name_en,
              qna.title,
              qna.content,
              qna.created_at,
              qna.answer_status,
              member.name_kr as member_name_kr
       FROM qna
       JOIN qna_type ON qna.qna_type_idx = qna_type.qna_type_idx
       JOIN member ON qna.member_idx = member.member_idx
       ${whereClause}
       ORDER BY qna.updated_at DESC
       LIMIT ? OFFSET ?`,
      [...params, take, skip]
    );

    return {
      total,
      page,
      limit,
      list: rows,
    };
  } catch (err) {
    return { error: 'QnA 목록 조회 중 오류가 발생했습니다.' };
  } finally {
    connection.release();
  }
});
