import { readBody } from 'h3'
import { FtpUtils } from '~/utils/ftpUtils'

interface SerializableFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
  base64?: string;
}

interface ReviewData {
  type: string;
  productId: number;
  rating: number;
  content: string;
  reservationIdx: number;
  images: SerializableFile[];
}

export default defineEventHandler(async (event) => {
  try {
    // 요청 본문 읽기
    const body = await readBody<ReviewData>(event)
    
    // 필수 필드 검증
    if (!body.type || !body.productId || !body.rating || !body.content) {
      return {
        success: false,
        message: '필수 정보가 누락되었습니다.'
      }
    }

    // 세션에서 사용자 정보 가져오기
    const session = await getUserSession(event)
    const memberIdx = session?.user?.member_idx

    if (!memberIdx) {
      return {
        success: false,
        message: '인증되지 않은 사용자입니다.'
      }
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    
    try {
      await connection.beginTransaction()
      
      // 리뷰 테이블에 데이터 삽입
      const reviewQuery = `
        INSERT INTO review (
          reservation_idx,
          review_type,
          member_idx,
          product_idx,
          review_content,
          review_rate,
          use_yn
        ) VALUES (?, ?, ?, ?, ?, ?, 'Y')
      `
      
      const [reviewResult] = await connection.query(reviewQuery, [
        body.reservationIdx,
        body.type,
        memberIdx,
        body.productId,
        body.content,
        body.rating
      ]) as unknown as [{ insertId: number }]
      
      const reviewIdx = reviewResult.insertId
      
      // 이미지 처리
      if (body.images && body.images.length > 0) {
        // 파일 업로드 - base64 문자열을 Buffer로 변환
        const fileToBuffer = (file: SerializableFile): Buffer => {
          // base64 데이터에서 실제 데이터 부분만 추출 (data:image/jpeg;base64, 같은 prefix 제거)
          const base64Data = file.base64?.split(',')[1] || ''
          return Buffer.from(base64Data, 'base64')
        }
        
        const filesWithBuffer = body.images.map((file: SerializableFile) => ({
          buffer: fileToBuffer(file),
          originalname: file.name,
          mimetype: file.type,
        }))
        
        // 상품 타입에 따른 폴더 경로 설정
        let folderPath = ''
        switch (body.type) {
          case 'G':
            folderPath = `review/course_${body.productId}`
            break
          case 'H':
            folderPath = `review/hotel_${body.productId}`
            break
          case 'C':
            folderPath = `review/caddy_${body.productId}`
            break
          case 'T':
            folderPath = `review/tournament_${body.productId}`
            break
          default:
            folderPath = `review/other_${body.productId}`
        }
        
        // FTP 업로드
        const ftp = new FtpUtils()
        const imageUrls = await ftp.uploadFilesFromBuffer(filesWithBuffer, folderPath)
        
        // 이미지 URL을 DB에 저장
        const imageQuery = `
          INSERT INTO review_image (
            review_idx,
            image_url,
            use_yn
          ) VALUES (?, ?, 'Y')
        `
        
        // 각 이미지에 대해 DB에 저장
        for (let i = 0; i < imageUrls.length; i++) {
          await connection.query(imageQuery, [
            reviewIdx,
            imageUrls[i]
          ])
        }
      }
      
      await connection.commit()
      
      return {
        success: true,
        message: '리뷰가 성공적으로 등록되었습니다.',
        data: {
          reviewIdx
        }
      }
    } catch (error) {
      await connection.rollback()
      console.error('리뷰 등록 처리 중 오류 발생:', error)
      
      return {
        success: false,
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      }
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('리뷰 등록 처리 중 오류 발생:', error)
    
    return {
      success: false,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }
  }
})
