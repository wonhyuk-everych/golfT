import { useI18n } from 'vue-i18n'

export function useLocalization() {
  const i18n = useI18n()
  
  // Nuxt의 useCookie 사용 (SSR 안전)
  const localeCookie = useCookie('user-locale', {
    default: () => 'ko',
    maxAge: 60 * 60 * 24 * 365 // 1년
  })
  
  // 초기화 시 쿠키에서 언어 설정 복원
  const initializeLocale = () => {
    if (localeCookie.value && ['ko', 'en'].includes(localeCookie.value)) {
      i18n.locale.value = localeCookie.value
    }
  }
  
  // Function to change the current locale
  const changeLocale = (locale: string) => {
    i18n.locale.value = locale
    localeCookie.value = locale
  }
  
  // Get the current locale
  const currentLocale = computed(() => i18n.locale.value)
  
  // Get all available locales
  const availableLocales = computed(() => {
    return [
      { code: 'ko', name: '한국어' },
      { code: 'en', name: 'English' }
    ]
  })
  
  // 초기화
  initializeLocale()
  
  return {
    t: i18n.t,
    changeLocale,
    currentLocale,
    availableLocales
  }
}