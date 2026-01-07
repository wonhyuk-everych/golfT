import { FtpUtils } from '~/utils/ftpUtils'
import { readFiles } from 'h3-formidable'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Parse multipart form data
    const { fields, files } = await readFiles(event, {
      multiples: false,
      keepExtensions: true
    })

    // Get the uploaded file
    const uploadedFile = files.file?.[0]
    if (!uploadedFile) {
      return {
        success: false,
        error: '업로드된 파일이 없습니다.'
      }
    }

    // Get the upload path from the form data
    const uploadPath = fields.uploadPath?.[0] || ''

    // Create FTP utility instance
    const ftpUtils = new FtpUtils()

    // Upload the file
    const result = await ftpUtils.uploadImage(
      uploadedFile.filepath,
      uploadedFile.mimetype || 'image/jpeg',
      uploadPath
    )

    return result
  } catch (error) {
    console.error('File upload error:', error)
    return {
      success: false,
      error: '파일 업로드 중 오류가 발생했습니다.'
    }
  }
})
