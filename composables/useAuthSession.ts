import { ref } from '#imports'

// 사용자 세션 타입 정의
export interface UserSessionData {
  id: string
  member_idx: number
  name_kr?: string
  name_en?: string
  email?: string
  role?: string
}

// 전역 상태로 사용할 변수들
const user = ref<UserSessionData | null>(null)
const loggedIn = ref(false)
const isLoading = ref(false)

export const useAuthSession = () => {
  // 세션 정보 가져오기
  const fetchSession = async () => {
    try {
      isLoading.value = true
      const response = await $fetch('/api/auth/check-session')
      
      if (response.success && response.session?.user) {
        user.value = response.session.user
        loggedIn.value = true
      } else {
        user.value = null
        loggedIn.value = false
      }
      
      return { user: user.value, loggedIn: loggedIn.value }
    } catch (error) {
      console.error('Failed to fetch session:', error)
      user.value = null
      loggedIn.value = false
      return { user: null, loggedIn: false }
    } finally {
      isLoading.value = false
    }
  }

  // 로그아웃
  const clearSession = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      user.value = null
      loggedIn.value = false
    }
  }

  return {
    user,
    loggedIn,
    isLoading,
    fetch: fetchSession,
    clear: clearSession
  }
}
