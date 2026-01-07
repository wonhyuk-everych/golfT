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

interface ReviewUpdateData {
  reviewIdx: number;
  type: string;
  productId: number;
  rating: number;
  content: string;
  reservationIdx: number;
  images: SerializableFile[];
  removeImages?: number[];
}

export default defineEventHandler(async (event) => {
  try {
    // 요청 본문 읽기
    const body = await readBody<ReviewUpdateData>(event)
    
    // 필수 필드 검증
    if (!body.reviewIdx || !body.type || !body.productId || !body.rating || !body.content) {
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
      
      // 리뷰가 존재하는지 확인하고 해당 사용자의 것인지 검증
      const checkQuery = `
        SELECT review_idx FROM review 
        WHERE review_idx = ? AND member_idx = ? AND use_yn = 'Y'
      `
      
      const [checkResult] = await connection.query(checkQuery, [
        body.reviewIdx,
        memberIdx
      ]) as unknown as [{ review_idx: number }[]]
      
      if (!Array.isArray(checkResult) || checkResult.length === 0) {
        return {
          success: false,
          message: '수정할 권한이 없거나 리뷰가 존재하지 않습니다.'
        }
      }
      
      // 리뷰 테이블 데이터 업데이트
      const reviewQuery = `
        UPDATE review SET
          review_content = ?,
          review_rate = ?
        WHERE review_idx = ? AND member_idx = ?
      `
      
      await connection.query(reviewQuery, [
        body.content,
        body.rating,
        body.reviewIdx,
        memberIdx
      ])
      
      // 이미지 처리
      // 삭제할 이미지가 있는 경우 처리
      if (body.removeImages && body.removeImages.length > 0) {
        await connection.query(
          'UPDATE review_image SET use_yn = "N" WHERE review_image_idx IN (?)',
          [body.removeImages]
        )
      }
      
      // 새 이미지 처리
      if (body.images && body.images.length > 0) {
        
        // 새 이미지 처리 - base64 문자열을 Buffer로 변환
        const fileToBuffer = (file: SerializableFile): Buffer => {
          // 이미 서버에 있는 이미지인 경우 (preview만 있고 base64가 없는 경우) 건너뜀
          if (!file.base64) {
            return Buffer.from('');
          }
          
          // base64 데이터에서 실제 데이터 부분만 추출 (data:image/jpeg;base64, 같은 prefix 제거)
          const base64Data = file.base64.split(',')[1] || '';
          return Buffer.from(base64Data, 'base64');
        }
        
        // 새 이미지만 필터링 (base64 데이터가 있는 이미지)
        const newImages = body.images.filter(img => img.base64);
        
        if (newImages.length > 0) {
          const filesWithBuffer = newImages.map((file: SerializableFile) => ({
            buffer: fileToBuffer(file),
            originalname: file.name,
            mimetype: file.type,
          }));
          
          // 상품 타입에 따른 폴더 경로 설정
          let folderPath = '';
          switch (body.type) {
            case 'G':
              folderPath = `review/course_${body.productId}`;
              break;
            case 'H':
              folderPath = `review/hotel_${body.productId}`;
              break;
            case 'C':
              folderPath = `review/caddy_${body.productId}`;
              break;
            case 'T':
              folderPath = `review/tournament_${body.productId}`;
              break;
            default:
              folderPath = `review/other_${body.productId}`;
          }
          
          // FTP 업로드
          const ftp = new FtpUtils();
          const imageUrls = await ftp.uploadFilesFromBuffer(filesWithBuffer, folderPath);
          
          // 이미지 URL을 DB에 저장
          const imageQuery = `
            INSERT INTO review_image (
              review_idx,
              image_url,
              use_yn
            ) VALUES (?, ?, 'Y')
          `;
          
          // 각 이미지에 대해 DB에 저장
          for (let i = 0; i < imageUrls.length; i++) {
            await connection.query(imageQuery, [
              body.reviewIdx,
              imageUrls[i]
            ]);
          }
        }
        
        // 기존 이미지는 별도로 처리할 필요 없음 - 삭제된 이미지만 removeImages로 처리
      }
      
      await connection.commit();
      
      return {
        success: true,
        message: '리뷰가 성공적으로 수정되었습니다.',
        data: {
          reviewIdx: body.reviewIdx
        }
      };
    } catch (error) {
      await connection.rollback();
      console.error('리뷰 수정 처리 중 오류 발생:', error);
      
      return {
        success: false,
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('리뷰 수정 처리 중 오류 발생:', error);
    
    return {
      success: false,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    };
  }
});
