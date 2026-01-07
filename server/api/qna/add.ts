import { getPool } from '~/server/utils/db';
import { readMultipartFormData } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // 로그인 확인
    const session = await getUserSession(event);
    const memberIdx = session?.user?.member_idx;
    if (!session || !memberIdx) {
      return { success: false, error: 'loginRequired' };
    }

    // FormData 파싱
    const formData = await readMultipartFormData(event);
    if (!formData) {
      return { success: false, error: 'wrongRequest' };
    }

    // 필드 추출
    const qnaTypeIdx = formData.find(f => f.name === 'qna_type_idx')?.data.toString() || '';
    const title = formData.find(f => f.name === 'title')?.data.toString() || '';
    const content = formData.find(f => f.name === 'content')?.data.toString() || '';
    const phone = formData.find(f => f.name === 'phone')?.data.toString() || '';
    const email = formData.find(f => f.name === 'email')?.data.toString() || '';
    // 이미지 파일들 (File 객체)
    const imageFields = formData.filter(f => f.name === 'images');
    // imageFields: { filename, type, data (Buffer) }

    // 유효성 검사
    if (!qnaTypeIdx) {
      return { success: false, error: 'qnaTypeRequired' };
    }
    if (!title.trim()) {
      return { success: false, error: 'titleRequired' };
    }
    if (!content.trim()) {
      return { success: false, error: 'contentRequired' };
    }
    if (!phone.trim()) {
      return { success: false, error: 'phoneRequired' };
    }
    if (!email.trim()) {
      return { success: false, error: 'emailRequired' };
    }

    const pool = await getPool();
    const conn = await pool.getConnection();
    try {
      // 문의 글 등록
      const [qnaResult] = await conn.query(
        'INSERT INTO qna (qna_type_idx, member_idx, title, content, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
        [qnaTypeIdx, memberIdx, title.trim(), content.trim(), phone.trim(), email.trim()]
      );
      const qnaIdx = qnaResult.insertId;

      // 이미지 등록 (FTP 업로드)
      if (imageFields && imageFields.length > 0) {
        const { FtpUtils } = await import('~/utils/ftpUtils');
        const fs = await import('fs');
        const os = await import('os');
        const path = await import('path');
        const ftp = new FtpUtils();
        for (const img of imageFields) {
          // 임시 파일 경로 생성
          const tmpPath = path.join(os.tmpdir(), `${Date.now()}_${img.filename}`);
          fs.writeFileSync(tmpPath, img.data);
          // FTP 업로드
          const uploadRes = await ftp.uploadImage(tmpPath, img.type, `qna/${memberIdx}`);
          // 임시 파일 삭제
          fs.unlinkSync(tmpPath);
          if (uploadRes.success && uploadRes.url) {
            await conn.query(
              'INSERT INTO qna_image (qna_idx, image_url) VALUES (?, ?)',
              [qnaIdx, uploadRes.url]
            );
          }
        }
      }

      return { success: true, qna_idx: qnaIdx };
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    return { success: false, error: 'serverError' };
  }
});
