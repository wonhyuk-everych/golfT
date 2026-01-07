import { defineEventHandler } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    // 현재 세션 정보 가져오기
    const session = useUserSession()
    
    console.log('Current session:', session)
    
    // 세션 데이터 디버깅을 위한 추가 로그
    if (session) {
      console.log('Session details - ID:', session.id)
      console.log('Session details - User:', session.user)
    }
    
    // 세션에 user 객체가 있는지 확인
    const hasValidSession = !!session && !!session.user
    
    return {
      success: true,
      session,
      hasSession: hasValidSession,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('세션 확인 중 오류 발생:', error)
    return {
      success: false,
      error: 'Failed to check session',
      timestamp: new Date().toISOString()
    }
  }
})
