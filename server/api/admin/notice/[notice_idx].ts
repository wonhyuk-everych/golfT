import { getPool } from '~/server/utils/db'
const pool = getPool()

export default defineEventHandler(async (event) => {
  const noticeIdx = event.context.params.notice_idx

  if (event.req.method === 'GET') {
    // 상세 조회 (기존 notice/[id].ts 참고)
    try {
      const [noticeResult] = await pool.query(
        `SELECT notice_idx, notice_type, title, content, use_yn, created_at FROM notice WHERE notice_idx = ? LIMIT 1`,
        [noticeIdx]
      )
      if (!noticeResult || noticeResult.length === 0) {
        return { success: false, error: 'Notice not found' }
      }
      const notice = noticeResult[0]
      const [imagesResult] = await pool.query(
        `SELECT notice_image_idx, notice_idx, image_url, sort FROM notice_image WHERE notice_idx = ? AND use_yn = 'Y' ORDER BY sort ASC`,
        [noticeIdx]
      )
      return { success: true, data: { notice, images: imagesResult } }
    } catch (error) {
      console.error('Error fetching notice details:', error)
      return { success: false, error: 'DB Error' }
    }
  }

  if (event.req.method === 'PUT') {
    // 수정 및 이미지 업로드/삭제

    // 관리자 인증
    const session = await getUserSession(event);
    if (!session || session?.user?.role !== 'A') {
      throw createError({ statusCode: 401, message: '관리자 인증이 필요합니다.' });
    }

    try {
      // multipart/form-data 파싱 (QnA add.ts 방식)
      const formData = await readMultipartFormData(event);
      const notice_type = formData.find(f => f.name === 'notice_type')?.data.toString() || '';
      const title = formData.find(f => f.name === 'title')?.data.toString() || '';
      const content = formData.find(f => f.name === 'content')?.data.toString() || '';
      const use_yn = formData.find(f => f.name === 'use_yn')?.data.toString() || '';
      const remove_image_ids = formData.filter(f => f.name === 'remove_image_ids').map(f => f.data.toString());
      const images = formData.filter(f =>
        f.name === 'images' && (f.filename || f.fileName) && f.data
      );
      // DB 업데이트
      await pool.query(
        `UPDATE notice SET notice_type=?, title=?, content=?, use_yn=? WHERE notice_idx=?`,
        [notice_type, title, content, use_yn, noticeIdx]
      )
      // 이미지 삭제
      if (remove_image_ids.length > 0) {
        for (const id of remove_image_ids) {
          await pool.query(`UPDATE notice_image SET use_yn='N' WHERE notice_image_idx=?`, [id])
        }
      }
      // 신규 이미지 업로드 (프론트 append 순서와 DB sort 일치)
      if (images.length > 0) {
        // 기존 이미지 개수 파악 (삭제되지 않은 것만)
        const [imgCountRows] = await pool.query(
          `SELECT COUNT(*) as cnt FROM notice_image WHERE notice_idx=? AND use_yn='Y'`,
          [noticeIdx]
        );
        let sort = Number((imgCountRows[0]?.cnt || 0)) + 1;
        const { FtpUtils } = await import('~/utils/ftpUtils');
        const fs = await import('fs');
        const os = await import('os');
        const pathMod = await import('path');
        const ftp = new FtpUtils();
        for (const file of images) {
          // h3 readMultipartFormData 파일: .data (Buffer), .filename (string), .type (mimetype)
          const tmpPath = pathMod.join(os.tmpdir(), `${Date.now()}_${file.filename}`);
          await fs.promises.writeFile(tmpPath, file.data);
          const uploadRes = await ftp.uploadImage(tmpPath, file.type, `notice/${noticeIdx}`);
          await fs.promises.unlink(tmpPath);
          if (uploadRes.success && uploadRes.url) {
            await pool.query(
              `INSERT INTO notice_image (notice_idx, image_url, use_yn, sort) VALUES (?, ?, 'Y', ?)`,
              [noticeIdx, uploadRes.url, sort]
            );
            sort++;
          }
        }
      }
      return { success: true }
    } catch (error) {
      console.error('Error updating notice:', error)
      return { success: false, error: 'DB Error' }
    }
  }

  return { success: false, error: 'Method Not Allowed' }
})
