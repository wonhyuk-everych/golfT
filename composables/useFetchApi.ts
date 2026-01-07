/**
 * 공통으로 사용할 useFetch 메소드
 * API 호출에 대한 공통 설정 및 에러 처리를 담당
 */
import type { UseFetchOptions } from 'nuxt/app'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthSession } from './useAuthSession'

export const useFetchApi = () => {
  const { getAccessToken } = useAuthSession()
  const { locale } = useI18n()
  const router = useRouter()

  /**
   * 공통 fetch 메소드
   * @param url API 엔드포인트
   * @param options fetch 옵션
   * @returns fetch 결과
   */
  const fetchApi = async <T>(url: string, options: UseFetchOptions<T> = {}) => {
    try {
      // 기본 옵션 설정
      const defaultOptions: UseFetchOptions<T> = {
        // 쿠키 포함
        credentials: 'include',
        // 기본 헤더 설정
        headers: {
          'Accept-Language': locale.value || 'ko',
          ...options.headers
        },
        // 에러 처리
        onResponseError: (context) => {
          const { response } = context
          
          if (response.status === 401) {
            // 인증 오류 처리
            alert('인증이 필요합니다. 다시 로그인해주세요.')
            router.push('/login')
          } else if (response.status === 403) {
            // 권한 오류 처리
            alert('접근 권한이 없습니다.')
          } else if (response.status >= 500) {
            // 서버 오류 처리
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
          }
          
          // 사용자 정의 에러 핸들러가 있으면 실행
          if (options.onResponseError) {
            options.onResponseError(context)
          }
        },
        ...options
      }

      // API 호출
      return await useFetch(url, defaultOptions)
    } catch (error) {
      // 네트워크 오류 등 예외 처리
      console.error('API 호출 중 오류 발생:', error)
      alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.')
      throw error
    }
  }

  /**
   * GET 요청
   * @param url API 엔드포인트
   * @param options fetch 옵션
   * @returns fetch 결과
   */
  const get = <T>(url: string, options: UseFetchOptions<T> = {}) => {
    return fetchApi<T>(url, { method: 'GET', ...options })
  }

  /**
   * POST 요청
   * @param url API 엔드포인트
   * @param body 요청 본문
   * @param options fetch 옵션
   * @returns fetch 결과
   */
  const post = <T>(url: string, body: unknown, options: UseFetchOptions<T> = {}) => {
    return fetchApi<T>(url, { method: 'POST', body, ...options })
  }

  /**
   * PUT 요청
   * @param url API 엔드포인트
   * @param body 요청 본문
   * @param options fetch 옵션
   * @returns fetch 결과
   */
  const put = <T>(url: string, body: unknown, options: UseFetchOptions<T> = {}) => {
    return fetchApi<T>(url, { method: 'PUT', body, ...options })
  }

  /**
   * PATCH 요청
   * @param url API 엔드포인트
   * @param body 요청 본문
   * @param options fetch 옵션
   * @returns fetch 결과
   */
  const patch = <T>(url: string, body: unknown, options: UseFetchOptions<T> = {}) => {
    return fetchApi<T>(url, { method: 'PATCH', body, ...options })
  }

  /**
   * DELETE 요청
   * @param url API 엔드포인트
   * @param options fetch 옵션
   * @returns fetch 결과
   */
  const del = <T>(url: string, options: UseFetchOptions<T> = {}) => {
    return fetchApi<T>(url, { method: 'DELETE', ...options })
  }

  return {
    fetchApi,
    get,
    post,
    put,
    patch,
    delete: del
  }
}
