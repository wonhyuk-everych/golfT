export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()

  // admin 페이지에 접근하려는 경우 role 체크
  if (to.path.startsWith('/admin')) {
      if (user.value?.role !== 'A') {
      // 관리자 URL 존재를 숨기기 위해 404로 위장
      return abortNavigation(createError({ statusCode: 404, statusMessage: 'Not Found' }))
    }
  }
  
  // 프로필 페이지에 접근하려는 경우 로그인 체크
  if (to.path === '/profile' && !loggedIn.value) {
    return navigateTo('/login')
  }
  
  // 기타 보호된 페이지에 로그인하지 않은 경우 메인 페이지로 이동
  if (!loggedIn.value) {
    return navigateTo('/')
  }
})
