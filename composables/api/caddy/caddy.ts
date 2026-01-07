import type { UseFetchOptions } from 'nuxt/app'

interface CityRequestParams {
  size: number
  searchWord?: string
  sort?: string
  filter?: string
}

interface CartItem {
  caddyIdx: string | string[]
  totalPrice: number
}

export const useCaddyApi = () => {
  /**
   * 도시별 캐디 정보를 가져오는 API
   * @param code 도시 코드
   * @param params 요청 파라미터 (size, searchWord, sort, filter)
   * @param options useFetch 옵션
   */
  const getCityDetail = async <T>(
    code: string, 
    params: CityRequestParams, 
    options: UseFetchOptions<T> = {}
  ) => {
    return await useFetch<T>(`/api/caddy/city/${code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      key: `caddy-city-${code}-${params.size}-${params.searchWord || ''}-${params.sort || ''}-${params.filter || ''}`,
      body: params,
      ...options
    })
  }
  
  /**
   * 캐디 상세 정보를 가져오는 API
   * @param id 캐디 ID
   * @param options useFetch 옵션
   */
  const getCaddyDetail = async <T>(
    id: string | string[], 
    options: UseFetchOptions<T> = {}
  ) => {
    return await useFetch<T>(`/api/caddy/${id}`, options)
  }
  
  /**
   * 캐디 리뷰를 가져오는 API
   * @param productId 캐디 ID
   * @param options useFetch 옵션
   */
  const getCaddyReviews = async <T>(
    productId: string | string[], 
    options: UseFetchOptions<T> = {}
  ) => {
    return await useFetch<T>(`/api/caddy/review`, {
      params: { product_idx: productId },
      ...options
    })
  }
  
  /**
   * 장바구니에 캐디를 추가하는 API
   * @param cartItem 장바구니 아이템 정보
   * @param options useFetch 옵션
   */
  const addToCart = async <T>(
    cartItem: CartItem,
    options: UseFetchOptions<T> = {}
  ) => {
    return await useFetch<T>('/api/caddy/add-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartItem),
      ...options
    })
  }
  
  
  return {
    getCityDetail,
    getCaddyDetail,
    getCaddyReviews,
    addToCart
  }
}
