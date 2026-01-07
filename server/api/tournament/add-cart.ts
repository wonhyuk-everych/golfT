import { readBody } from 'h3';
import { FtpUtils } from '~/utils/ftpUtils';

interface SerializableFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
  base64?: string;
}

interface TournamentAddCartData {
  tournament_idx: number;
  form_data: {
    result: Array<{
      title: string;
      type: string;
      value: string;
    }>;
  };
  image_files: SerializableFile[];
}

export default defineEventHandler(async (event) => {
  try {
    // 요청 본문 읽기
    const body = await readBody<TournamentAddCartData>(event);
    
    // 필수 필드 검증
    if (!body.tournament_idx || !body.form_data || !body.form_data.result) {
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

    let imageFiles = ''
    if(body.image_files.length > 0){
      // 파일 업로드 - base64 문자열을 Buffer로 변환
      const fileToBuffer = (file: SerializableFile): Buffer => {
        // base64 데이터에서 실제 데이터 부분만 추출 (data:image/jpeg;base64, 같은 prefix 제거)
        const base64Data = file.base64?.split(',')[1] || '';
        return Buffer.from(base64Data, 'base64');
      };
      
      const filesWithBuffer = body.image_files.map((file: SerializableFile) => ({
        buffer: fileToBuffer(file),
        originalname: file.name,
        mimetype: file.type,
      }));
      
      const ftp = new FtpUtils()
      const userHash = await ftp.sha256Hash('user_' + memberIdx)
      const imageUrls = await ftp.uploadFilesFromBuffer(filesWithBuffer, `tournament/${body.tournament_idx}/users/${userHash}`)

      //파일 경로를 쉼표로 구분하여 문자열로 변환
      imageFiles = imageUrls.join(',')
    }
    
    try {
      const query = `
        INSERT INTO shopping_cart_tournament (
          tournament_idx,
          member_idx,
          form_data,
          images
        )
        VALUES (
          ?,
          ?,
          ?,
          ?
        )
      `
      
      await connection.query(query, [
        body.tournament_idx,
        memberIdx,
        JSON.stringify(body.form_data),
        imageFiles
      ])
      
      await connection.commit()
      
      return {
        success: true,
        data: {
          ...body
        }
      };
    } catch (error) {
        console.error('토너먼트 추가 처리 중 오류 발생:', error);
        
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
    console.error('토너먼트 추가 처리 중 오류 발생:', error);
    
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
