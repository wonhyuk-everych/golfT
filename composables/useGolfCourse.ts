import { ref } from 'vue'
import type { GolfCourseWithDetails } from '~/server/api/golf-course/types'

export interface GolfCourse {
  main_image_url: string;
  course_image_url: string;
  clubhouse_image_url: string;
  restaurant_image_url: string;
  shelter_image_url: string;
  proshop_image_url: string;
  description_image_url: string;
  name_kr: string;
  course_holes: string;
  country_code: string;
  region_code: string;
  nearest_airport: string;
  airport_time: number;
  total_fee: number;
  course_idx: number;
  promotion_url: string;
}

interface SearchParams {
  name?: string;
  maxAirportTime?: number;
}

export const useGolfCourse = () => {
  const courses = ref<GolfCourse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const searchCourses = async (params: SearchParams = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = new URLSearchParams()
      if (params.name) {
        queryParams.append('name', params.name)
      }
      if (params.maxAirportTime) {
        queryParams.append('maxAirportTime', params.maxAirportTime.toString())
      }

      const response = await fetch(`/api/golf-course?${queryParams.toString()}`)
      const result = await response.json()
      
      if (result.success) {
        courses.value = result.data
      } else {
        throw new Error(result.error || '골프장 검색에 실패했습니다.')
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.'
      courses.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    loading,
    error,
    searchCourses
  }
}
