export interface CaddySearchParams {
  searchWord?: string
  courseIdx?: number
  caddyCode?: number
  caddyStatus?: 'Y' | 'N' | ''
  cityCode?: string
  page?: number
  pageSize?: number
}

export interface Caddy {
  caddyIdx: number
  courseIdx: number
  caddyCode: number
  name: string
  nickName: string | null
  age: number | null
  height: number | null
  countryCode: string | null
  cityCode: string
  language: string | null
  specialty: string | null
  dayOff: string | null
  golfExperience: 'Y' | 'N' | null
  price: number
  reservationFee: number
  caddyStatus: 'Y' | 'N'
  createdAt: string
  createdMemberIdx: number
  updatedAt: string
  updatedMemberIdx: number | null
}

export interface CaddyListResponse {
  caddies: Caddy[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CaddyLocaleText {
  language?: string | null
  specialty?: string | null
}

export interface CaddyImage {
  imageUrl: string
}

export interface CaddyDetail extends Caddy {
  golfNameKr?: string
  golfNameEn?: string
  reviewCount?: number
  averageRating?: number
  caution?: string
  localeTexts?: Record<string, CaddyLocaleText>
  images?: CaddyImage[]
}
