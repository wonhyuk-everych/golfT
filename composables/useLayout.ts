import { computed, useRoute } from '#imports'

interface LayoutConfig {
  hideHeader: boolean
  hideNav: boolean
}

const layoutConfigs: Record<string, LayoutConfig> = {
  // 기본 레이아웃 (모든 헤더와 네비게이션 표시)
  default: {
    hideHeader: false,
    hideNav: false
  },
  // 로그인 레이아웃 (모든 헤더와 네비게이션 숨김)
  login: {
    hideHeader: true,
    hideNav: true
  },
  // 검색 페이지 레이아웃 (커스텀 헤더, 네비게이션 숨김)
  search: {
    hideHeader: true,
    hideNav: true
  },
  // 골프장 상세 페이지 레이아웃 (커스텀 헤더, 네비게이션 숨김)
  course: {
    hideHeader: true,
    hideNav: true
  },
  // 골프장 홈 페이지 레이아웃
  'course-home': {
    hideHeader: true,
    hideNav: false
  },
  'course-city': {
    hideHeader: true,
    hideNav: false
  },
  // 호텔 홈 페이지 레이아웃
  'hotel-home': {
    hideHeader: true,
    hideNav: false
  },
  // 호텔 도시 페이지 레이아웃
  'hotel-city': {
    hideHeader: true,
    hideNav: false
  },
  // 호텔 상세 페이지 레이아웃
  'hotel': {
    hideHeader: true,
    hideNav: true
  },
  // 프로필 페이지 레이아웃 (커스텀 헤더, 네비게이션 숨김)
  profile: {
    hideHeader: true,
    hideNav: false
  },
  // 캐디홈 레이아웃 (커스텀 헤더, 네비게이션 표시)
  'caddy-home': {
    hideHeader: true,
    hideNav: false
  },
  'caddy-city': {
    hideHeader: true,
    hideNav: false
  },
  'caddy': {
    hideHeader: true,
    hideNav: true
  },
  'event-home': {
    hideHeader: true,
    hideNav: true
  },
  'event': {
    hideHeader: true,
    hideNav: true
  },
  'tournament': {
    hideHeader: true,
    hideNav: true
  },
  'tournament-detail': {
    hideHeader: true,
    hideNav: true
  },
  'shopping-cart': {
    hideHeader: true,
    hideNav: true
  },
  'mypage': {
    hideHeader: true,
    hideNav: true
  },
  'qna': {
    hideHeader: true,
    hideNav: true
  },
  'qna-detail': {
    hideHeader: true,
    hideNav: true
  },
  'wish': {
    hideHeader: true,
    hideNav: true
  },
  'review': {
    hideHeader: true,
    hideNav: true
  },
  'review_product': {
    hideHeader: true,
    hideNav: true
  },
  'review_write': {
    hideHeader: true,
    hideNav: true
  },
  'payment': {
    hideHeader: true,
    hideNav: true
  },
  'payment_complete': {
    hideHeader: true,
    hideNav: true
  },
  'reservation': {
    hideHeader: true,
    hideNav: true
  },
  'reservation_info': {
    hideHeader: true,
    hideNav: true
  },
  'payment_success': {
    hideHeader: true,
    hideNav: true
  },
  'payment_fail': {
    hideHeader: true,
    hideNav: true
  },
  'terms': {
    hideHeader: true,
    hideNav: true
  },
  'ai-home': {
    hideHeader: true,
    hideNav: true
  },
  'best30': {
    hideHeader: true,
    hideNav: true
  }
}

export const useLayout = () => {
  const route = useRoute()
  
  // 현재 라우트의 이름에 따라 레이아웃 설정을 가져옴
  const currentLayout = computed(() => {
    const routeName = route.name as string
    return layoutConfigs[routeName] || layoutConfigs.default
  })

  // 헤더 표시 여부
  const showHeader = computed(() => !currentLayout.value.hideHeader)
  
  // 네비게이션 표시 여부
  const showNav = computed(() => !currentLayout.value.hideNav)

  return {
    showHeader,
    showNav
  }
}
