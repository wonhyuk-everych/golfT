export interface GolfCourseSearchParams {
  courseId?: string
  nameKr?: string
  nameEn?: string
  bookingStatus?: 'Y' | 'N' | ''
  courseStatus?: 'Y' | 'N' | ''
  regionCode?: string
  roundStart?: string
}

export interface GolfCourseLocaleText {
  caddyCovenants?: string
  caddyRule?: string
  rainCheck?: string
  galleryFee?: string
}

export interface GolfCourse {
  courseIdx: string
  nameKr: string
  nameEn: string
  countryCode: string
  regionCode: string
  holeCount: number
  roundStart: string
  bookingStatus: 'Y' | 'N'
  courseStatus: 'Y' | 'N'
  createdAt: string
  updatedAt: string
  
  // 그린피 정보
  weekdayGreenFee?: number | null
  weekdayGreenSaleFee?: number | null
  weekendGreenFee?: number | null
  weekendGreenSaleFee?: number | null
  
  // 캐디피 정보
  caddyFee?: number | null
  caddySaleFee?: number | null
  
  // 카트피 정보
  cartFee?: number | null
  cartSaleFee?: number | null
  
  // 총 요금
  totalFee?: number | null
  
  // 골프장 주요시설
  facilities?: { golf_facility_type_idx: number }[]
  
  // 다국어 텍스트
  localeTexts?: Record<string, GolfCourseLocaleText>
}

export interface GolfCourseListResponse {
  courses: GolfCourse[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
