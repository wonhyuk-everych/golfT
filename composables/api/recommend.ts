/**
 * 추천 관련 API를 위한 composable
 */
export const useRecommendApi = () => {
  /**
   * Best30 추천 상품을 가져오는 API
   */
  const getBest30 = async () => {
    return await useFetch('/api/recommend/best30')
  }

  /**
   * 추천 골프 코스를 가져오는 API
   */
  const getRecommendedGolfCourses = async (params?: { limit?: number; excludeId?: string | number }) => {
    return await useFetch('/api/recommend/main_golf_course', { params })
  }

  /**
   * 추천 호텔을 가져오는 API
   */
  const getRecommendedHotels = async (params?: { limit?: number; excludeId?: string | number }) => {
    return await useFetch('/api/recommend/main_hotel', { params })
  }
  
  /**
   * 추천 캐디를 가져오는 API
   */
  const getRecommendedCaddies = async (params?: { limit?: number; excludeId?: string | number }) => {
    return await useFetch('/api/recommend/main_caddy', { params })
  }
  
  /**
   * 골프 리뷰 조회
   */
  const getGolfReviews = async (params?: { product_idx?: string | number; page?: number; limit?: number }) => {
    return await useFetch('/api/golf-course/review', { params })
  }

  /**
   * 호텔 리뷰 조회
   */
  const getHotelReviews = async (params?: { product_idx?: string | number; page?: number; limit?: number }) => {
    return await useFetch('/api/hotel/review', { params })
  }

  /**
   * 캐디 리뷰 조회
   */
  const getCaddyReviews = async (params?: { product_idx?: string | number; page?: number; limit?: number }) => {
    return await useFetch('/api/caddy/review', { params })
  }
  
  return {
    getBest30,
    getRecommendedGolfCourses,
    getRecommendedHotels,
    getRecommendedCaddies,
    getGolfReviews,
    getHotelReviews,
    getCaddyReviews,
  }
}
