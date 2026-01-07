import { getPool } from '~/server/utils/db'
import { readMultipartFormData } from 'h3'

const pool = getPool()

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    return { success: false, error: 'Method Not Allowed' }
  }

  // 관리자 인증
  const session = await getUserSession(event)
  if (!session || session?.user?.role !== 'A') {
    throw createError({ statusCode: 401, message: '관리자 인증이 필요합니다.' })
  }

  try {
    const formData = await readMultipartFormData(event)
    const notice_type = formData.find(f => f.name === 'notice_type')?.data.toString() || ''
    const title = formData.find(f => f.name === 'title')?.data.toString() || ''
    const content = formData.find(f => f.name === 'content')?.data.toString() || ''
    const use_yn = formData.find(f => f.name === 'use_yn')?.data.toString() || ''
    const images = formData.filter(f => f.name === 'images' && (f.filename || f.fileName) && f.data)

    // 1. 공지사항 등록
    const [result] = await pool.query(
      `INSERT INTO notice (notice_type, title, content, use_yn, created_at) VALUES (?, ?, ?, ?, NOW())`,
      [notice_type, title, content, use_yn]
    )
    const noticeIdx = result.insertId

    // 2. 이미지 업로드 (FTP)
    if (images.length > 0) {
      const { FtpUtils } = await import('~/utils/ftpUtils')
      const fs = await import('fs')
      const os = await import('os')
      const pathMod = await import('path')
      const ftp = new FtpUtils()
      let sort = 1
      for (const file of images) {
        const tmpPath = pathMod.join(os.tmpdir(), `${Date.now()}_${file.filename}`)
        await fs.promises.writeFile(tmpPath, file.data)
        const uploadRes = await ftp.uploadImage(tmpPath, file.type, `notice/${noticeIdx}`)
        await fs.promises.unlink(tmpPath)
        if (uploadRes.success && uploadRes.url) {
          await pool.query(
            `INSERT INTO notice_image (notice_idx, image_url, use_yn, sort) VALUES (?, ?, 'Y', ?)`,
            [noticeIdx, uploadRes.url, sort]
          )
          sort++
        }
      }
    }
    return { success: true, notice_idx: noticeIdx }
  } catch (error) {
    console.error('Error adding notice:', error)
    return { success: false, error: 'DB Error' }
  }
})
