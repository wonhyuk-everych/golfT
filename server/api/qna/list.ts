import { getQuery } from 'h3';
import { getPool } from '~/server/utils/db';

interface QnaListParams {
  page?: number;
  limit?: number;
  qna_type_idx?: number;
}

interface CountRow { total: number }
interface QnaListRow {
  qna_idx: number;
  qna_type_name_kr: string;
  qna_type_name_en: string;
  title: string;
  created_at: string | Date;
  answer_status: number | string;
  member_name_kr: string | null;
}

// 이름 마스킹 유틸
// - 1자: 그대로
// - 2자: 마지막 글자만 * 처리
// - 3자 이상: 첫 글자와 마지막 글자를 제외하고 전부 * 처리
const maskKrName = (name?: string | null): string => {
  if (!name) return '';
  const str = String(name);
  const len = str.length;
  if (len <= 1) return str;
  if (len === 2) return str[0] + '*';
  return str[0] + '*'.repeat(len - 2) + str[len - 1];
};

export default defineEventHandler(async (event) => {
  try {
    // 쿼리 파라미터
    const { page = 1, limit = 10, qna_type_idx } = getQuery(event) as QnaListParams;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const pool = getPool();

    // WHERE 절 동적 구성
    let whereClause = 'WHERE 1=1';
    const queryParams: (string | number)[] = [];
    if (qna_type_idx) {
      whereClause += ' AND qna.qna_type_idx = ?';
      queryParams.push(Number(qna_type_idx));
    }

    // 전체 개수 조회
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM qna ${whereClause}`,
      queryParams
    );
    const total = (countResult as CountRow[])[0]?.total ?? 0;

    // 리스트 데이터 조회
    const [rows] = await pool.query(
      `SELECT qna_idx,
              qna_type.name_kr as qna_type_name_kr,
              qna_type.name_en as qna_type_name_en,
              title,
              qna.created_at,
              answer_status,
              member.name_kr as member_name_kr
       FROM qna
       JOIN qna_type ON qna.qna_type_idx = qna_type.qna_type_idx
       JOIN member ON qna.member_idx = member.member_idx
       ${whereClause}
       ORDER BY qna.qna_idx DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, take, skip]
    );

    // member_name_kr 마스킹 처리
    const maskedRows = (rows as QnaListRow[]).map((r) => ({
      ...r,
      member_name_kr: maskKrName(r.member_name_kr),
    }));

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      list: maskedRows,
    };
  } catch (err) {
    return { error: 'QnA 리스트 조회 중 오류가 발생했습니다.' };
  }
});
