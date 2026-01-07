import { getPool } from '~/server/utils/db';
import { FtpUtils } from '~/utils/ftpUtils';

interface SerializableFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
  base64?: string;
}

interface Community {
  title: string;
  content: string;
  country_code_idx: number;
  member_idx: number;
  images: SerializableFile[];
}

export default defineEventHandler(async (event) => {
  try {
    // 로그인 확인
    const session = await getUserSession(event)
    const memberIdx = session.user.member_idx
    
    if (!session || !memberIdx) {
      return {
        success: false,
        error: 'loginRequired'
      };
    }
    
    // FormData 파싱
    const formData = await readBody<Community>(event);
    if (!formData) {
      return {
        success: false,
        error: 'wrongRequest'
      }
    }
    
    // 필수 필드 추출
    const title = formData.title || ''
    const content = formData.content || ''
    const countryCodeIdx = formData.country_code_idx || ''
    
    // 유효성 검사
    if (!title.trim()) {
      return {
        success: false,
        error: 'titleRequired'
      }
    }
    
    if (!content.trim()) {
      return {
        success: false,
        error: 'contentRequired'
      }
    }
    
    if (!countryCodeIdx) {
      return {
        success: false,
        error: 'regionRequired'
      }
    }
    
    // 게시글 데이터 생성
    const postData = {
      title: title.trim(),
      content: content.trim(),
      country_code_idx: countryCodeIdx,
      member_idx: memberIdx,
      created_at: new Date().toISOString()
    }

    // DB 커넥션 가져오기
    const pool = getPool();

    //오늘 날짜로 10개이상 등록한 글이 있는지 조사
    const query = `SELECT COUNT(*) AS count FROM community WHERE member_idx = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE)`;
    const [rows] = await pool.query(query, [memberIdx]);
    const count = (rows as Array<{ count: number }>)[0].count;
    if (count > 5) {
      return {
        success: false,
        error: 'tooManyPosts'
      }
    }
    
    // 게시글 저장
    const [post] = await pool.query(`
      INSERT INTO community (
        title,
        content,
        country_code_idx,
        member_idx,
        created_at
      ) VALUES (?, ?, ?, ?, NOW())
    `, [postData.title, postData.content, postData.country_code_idx, postData.member_idx])
    
    if (!post) {
      return {
        success: false,
        error: 'postFailed'
      }
    }

    const communityIdx = post.insertId;
    if(formData.images.length > 0){
      // 파일 업로드 - base64 문자열을 Buffer로 변환
      const fileToBuffer = (file: SerializableFile): Buffer => {
        // base64 데이터에서 실제 데이터 부분만 추출 (data:image/jpeg;base64, 같은 prefix 제거)
        const base64Data = file.base64?.split(',')[1] || '';
        return Buffer.from(base64Data, 'base64');
      };
      
      const filesWithBuffer = formData.images.map((file: SerializableFile) => ({
        buffer: fileToBuffer(file),
        originalname: file.name,
        mimetype: file.type,
      }));
      
      const ftp = new FtpUtils()
      const imageUrls = await ftp.uploadFilesFromBuffer(filesWithBuffer, `community/${communityIdx}`)

      let sort = 1
      for (const img of imageUrls) {
        await pool.query(
          'INSERT INTO community_image (community_idx, image_url, sort) VALUES (?, ?, ?)',
          [communityIdx, img, sort]
        );
        sort++;
      }
    }
    
    
    // 사용자 정보 조회
    const [userData] = await pool.query(`
      SELECT name_kr
      FROM member
      WHERE member_idx = ?
    `, [memberIdx])
    
    if (!userData) {
      return {
        success: false,
        error: 'userInfoError'
      }
    }
    
    // 지역 정보 조회
    const [regionData] = await pool.query(`
      SELECT city_name, city_name_en
      FROM country_code
      WHERE country_code_idx = ?
    `, [countryCodeIdx])
    
    if (!regionData) {
      return {
        success: false,
        error: 'regionInfoError'
      }
    }
    
    // 응답 데이터 구성
    const responseData = {
      ...postData,
      community_idx: communityIdx,
      name_kr: userData?.name_kr || '',
      city_name: regionData?.city_name || '',
      city_name_en: regionData?.city_name_en || '',
      comment_count: 0
    }
    
    return {
      success: true,
      data: {
        post: responseData
      }
    }
  } catch (error) {
    console.error('게시글 등록 API 오류:', error)
    return {
      success: false,
      error: 'serverError'
    }
  }
})
