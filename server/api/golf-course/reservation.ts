import { readBody } from 'h3';

interface ReservationData {
  courseId: number;
  courseName: string;
  date: string;
  time: string;
  golferCount: number;
  totalPrice: number;
  van: {
    oneWay: boolean;
    roundTrip: boolean;
    carCount: number;
    vanFee: number;
    pickupDate?: string;
    pickupTime?: string;
    returnDate?: string;
    returnTime?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    carType?: string;
  };
}

export default defineEventHandler(async (event) => {
  try {
    // 요청 본문 읽기
    const body = await readBody<ReservationData>(event);
    
    // 필수 필드 검증
    if (!body.courseId || !body.date || !body.time || !body.golferCount) {
      return {
        success: false,
        message: '필수 정보가 누락되었습니다.'
      };
    }
    
    // 현재는 예시로 성공 응답만 반환
    console.log('예약 정보 수신:', body);

    

    
    // 성공 응답
    return {
      success: true,
      message: '예약이 성공적으로 완료되었습니다.',
      data: {
        reservationId: Date.now(), // 임시 예약 ID (실제로는 DB에서 생성된 ID 사용)
        ...body
      }
    };
    
  } catch (error) {
    console.error('예약 처리 중 오류 발생:', error);
    
    // 오류 응답
    return {
      success: false,
      message: '예약 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    };
  }
})
