export interface HotelSearchParams {
  searchWord?: string
  hotelStatus?: 'Y' | 'N' | ''
  countryCode?: string
  cityCode?: string
  page?: number
  pageSize?: number
}

export interface Hotel {
  hotelIdx: string
  hotelStatus: string
  nameKr: string
  nameEn: string
  price: number | null
  countryName: string
  cityName: string
  roomCount: number
  createdAt: string
  updatedAt: string
}

export interface HotelListResponse {
  hotels: Hotel[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
