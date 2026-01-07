// 추천 상품 관련 타입 정의

export interface RecommendProduct {
  recommend_product_idx: number
  recommend_type: 'best30' | 'golf' | 'hotel' | 'caddy'
  product_idx: number
  product_type: 'golf' | 'hotel' | 'caddy'
  sort: number | null
  created_at: string
  created_member_idx: number | null
  updated_at: string
  updated_member_idx: number | null
  // 조인된 상품 정보
  product_name?: string
  product_price?: number | string
  product_image?: string
  product_location?: string
}

export interface RecommendProductWithDetails extends RecommendProduct {
  product_name: string
  product_price: number | string
  product_image: string
  product_location: string
}

export interface ProductSearchResult {
  id: number
  name: string
  price: number | string
  image: string
  location: string
  type: 'golf' | 'hotel' | 'caddy'
}

export interface RecommendProductRequest {
  recommend_type: 'best30' | 'golf' | 'hotel' | 'caddy'
  product_idx: number
  product_type: 'golf' | 'hotel' | 'caddy'
  sort: number
}

export interface ProductSearchParams {
  type: 'golf' | 'hotel' | 'caddy'
  keyword: string
}

export type RecommendType = 'best30' | 'golf' | 'hotel' | 'caddy'
export type ProductType = 'golf' | 'hotel' | 'caddy'
