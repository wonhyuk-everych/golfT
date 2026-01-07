import { getPool } from '~/server/utils/db'

interface ProductData {
  title: string;
  type: string;
  id: number;
  [key: string]: string | number | boolean | null | undefined;
}

interface ReviewData {
  review_idx: number;
  review_content: string;
  review_rate: number;
  images?: ReviewImage[];
}

interface ReviewImage {
  review_image_idx: number;
  image_url: string;
  sort: number;
}

export default defineEventHandler(async (event) => {
  try {
    const { type, id } = event.context.params || {}
    
    if (!type || !id) {
      return {
        success: false,
        message: 'Invalid parameters'
      }
    }

    const session = await getUserSession(event)
    const memberIdx = session?.user?.member_idx
    const reservation_idx = parseInt(id)

    const pool = getPool()
    let sql = ''
    const params = [reservation_idx, memberIdx]
    
    // 상품 타입에 따른 쿼리 설정
    switch (type.toUpperCase()) {
      case 'G': // 골프
        sql = `
          SELECT 
            rg.reservation_idx,
            GC.course_idx as id,
            GC.name_kr as title,
            'G' as type,
            GC.address,
            (SELECT main_image_url FROM golf_course_image WHERE course_idx = GC.course_idx LIMIT 1) AS image_url
          FROM golf_course GC
          LEFT JOIN reservation_golf rg ON GC.course_idx = rg.course_idx
          WHERE rg.reservation_golf_idx = ? AND rg.member_idx = ?
        `
        break
      case 'H': // 호텔
        sql = `
          SELECT 
            rh.reservation_idx,
            H.hotel_idx as id,
            H.name_kr as title,
            'H' as type,
            H.address,
            (SELECT image_url FROM hotel_image WHERE hotel_idx = H.hotel_idx AND use_yn = 'Y' AND main_yn = 'Y' LIMIT 1) AS image_url
          FROM hotel H
          LEFT JOIN reservation_hotel rh ON H.hotel_idx = rh.hotel_idx
          WHERE rh.reservation_hotel_idx = ? AND rh.member_idx = ?
        `
        break
      case 'C': // 캐디
        sql = `
          SELECT 
            rc.reservation_idx,
            C.caddy_idx as id,
            C.name as title,
            'C' as type,
            C.nick_name,
            (SELECT image_url FROM caddy_image WHERE caddy_idx = C.caddy_idx AND main_yn = 'Y' LIMIT 1) AS image_url
          FROM caddy C
          LEFT JOIN reservation_caddy rc ON C.caddy_idx = rc.caddy_idx
          WHERE rc.reservation_caddy_idx = ? AND rc.member_idx = ?
        `
        break
      case 'T': // 토너먼트
        sql = `
          SELECT 
            rt.reservation_idx,
            T.tournament_idx as id,
            T.title,
            'T' as type,
            T.location,
            (SELECT image_url FROM tournament_image WHERE tournament_idx = T.tournament_idx AND main_yn = 'Y' LIMIT 1) AS image_url
          FROM tournament T
          LEFT JOIN reservation_tournament rt ON T.tournament_idx = rt.tournament_idx
          WHERE rt.reservation_tournament_idx = ? AND rt.member_idx = ?
        `
        break
      default:
        return {
          success: false,
          message: 'Invalid product type'
        }
    }

    const [rows] = await pool.query(sql, params) as unknown as [ProductData[]]
    
    if (!Array.isArray(rows) || rows.length === 0) {
      return {
        success: false,
        message: 'Product not found'
      }
    }
    
    // 기존 리뷰 데이터 조회
    const productData = rows[0]
    let existingReview: ReviewData | null = null
    let reviewImages: ReviewImage[] = []
    
    if (memberIdx) {
      // 리뷰 조회 쿼리
      const reviewSql = `
        SELECT 
          review_idx, 
          review_content, 
          review_rate 
        FROM review 
        WHERE 
          member_idx = ? AND 
          product_idx = ? AND 
          reservation_idx = ? AND
          review_type = ? AND 
          use_yn = 'Y'
        LIMIT 1
      `
      
      const [reviewRows] = await pool.query(reviewSql, [memberIdx, productData.id, reservation_idx, productData.type]) as unknown as [ReviewData[]]
      
      if (Array.isArray(reviewRows) && reviewRows.length > 0) {
        existingReview = reviewRows[0]
        
        // 리뷰 이미지 조회
        const imageSql = `
          SELECT 
            review_image_idx, 
            image_url, 
            sort 
          FROM review_image 
          WHERE 
            review_idx = ? AND 
            use_yn = 'Y' 
          ORDER BY sort ASC
        `
        
        const [imageRows] = await pool.query(imageSql, [existingReview.review_idx]) as unknown as [ReviewImage[]]
        
        if (Array.isArray(imageRows) && imageRows.length > 0) {
          reviewImages = imageRows
        }
        
        // 리뷰 이미지 추가
        existingReview.images = reviewImages
      }
    }

    return {
      success: true,
      data: productData,
      existingReview: existingReview
    }
  } catch (error) {
    console.error('상품 정보 조회 오류:', error)
    return {
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : String(error)
    }
  }
})
