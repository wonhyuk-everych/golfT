import { readBody } from 'h3';
import { FtpUtils } from '~/utils/ftpUtils'

interface SerializableFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
  base64?: string;
}

interface TournamentReservationData {
  tournament_idx: number;
  form_data: {
    result: Array<{
      title: string;
      type: string;
      value: string;
    }>;
  };
  images: SerializableFile[];
  total_price: number;
}

export default defineEventHandler(async (event) => {
  try {
    // 요청 본문 읽기
    const body = await readBody<TournamentReservationData>(event);
    
    // 필수 필드 검증
    if (!body.tournament_idx || !body.form_data || typeof body.total_price === 'undefined') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: '필수 정보가 누락되었습니다.'
        })
      };
    }

    const session = await getUserSession(event)
    const memberIdx = session?.user?.member_idx

    if (!memberIdx) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: '인증되지 않은 사용자입니다.'
        })
      };
    }

    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.beginTransaction()
    
    try {
      // 이미지 업로드 처리
      let imageFiles = ''
      if(Array.isArray(body.images) && body.images.length > 0){
        // 파일 업로드 - base64 문자열을 Buffer로 변환
        const fileToBuffer = (file: SerializableFile): Buffer => {
          // base64 데이터에서 실제 데이터 부분만 추출 (data:image/jpeg;base64, 같은 prefix 제거)
          const base64Data = file.base64?.split(',')[1] || '';
          return Buffer.from(base64Data, 'base64');
        };
        
        const filesWithBuffer = body.images.map((file: SerializableFile) => ({
          buffer: fileToBuffer(file),
          originalname: file.name,
          mimetype: file.type,
        }));
        
        const ftp = new FtpUtils()
        const imageUrls = await ftp.uploadFilesFromBuffer(filesWithBuffer, `tournament/${body.tournament_idx}/users`)
  
        //파일 경로를 쉼표로 구분하여 문자열로 변환
        imageFiles = imageUrls.join(',')
      }

      // 예약번호 생성 (현재 타임스탬프 기반)
      const reservationIdx = `T${Date.now()}`

      const query = `
        INSERT INTO reservation_tournament (
          reservation_idx,
          tournament_idx,
          member_idx,
          form_data,
          images,
          total_price
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
      `
      
      await connection.query(query, [
        reservationIdx,
        body.tournament_idx,
        memberIdx,
        JSON.stringify(body.form_data),
        imageFiles,
        body.total_price
      ])
      
      await connection.commit()
      
      return {
        success: true,
        message: '토너먼트 예약이 성공적으로 완료되었습니다.',
        data: {
          reservationId: Date.now(), // 임시 예약 ID (실제로는 DB에서 생성된 ID 사용)
          ...body
        }
      };
    } catch (error) {
        console.error('토너먼트 예약 처리 중 오류 발생:', error);
        
        // 오류 응답
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          })
        };
      } finally {
        connection.release()
      }  
  } catch (error) {
    console.error('토너먼트 신청 처리 중 오류 발생:', error);
    
    // 오류 응답
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      })
    };
  }
})
