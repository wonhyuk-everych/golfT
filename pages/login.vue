<template>
  <div id="app">

    <NavigationBar mode="back_title" :show-bell="false" :title="$t('login.title')" back-color="black"/>

    <!-- Mobile Container -->
    <div class="max-w-md mx-auto bg-white min-h-screen relative pt-16">

      <!-- Main Content -->
      <div class="px-4 space-y-4">
        <!-- Logo Section -->
        <div class="flex justify-center py-8">
          <div class="w-32 h-12 flex items-center justify-center">
            <!-- Golf T Logo -->
            <img src="~/assets/images/logo.png" alt="logo" class="w-full h-full">
          </div>
        </div>

        <!-- Login Form -->
        <div class="space-y-6">
          <div class="space-y-4">
            <!-- Error Message -->
            <div v-if="loginError" class="text-red-500 text-sm text-center px-2">
              {{ loginError }}
            </div>

            <!-- ID Input -->
            <div class="px-2">
              <div class="w-full">
                <input 
                  v-model="loginData.username"
                  type="text" 
                  :placeholder="$t('login.idPlaceholder')"
                  :class="[
                    'w-full px-2 py-3 text-sm border rounded-md transition-colors',
                    loginData.username ? 'border-blue-400 text-gray-900' : 'border-gray-300 text-gray-400'
                  ]"
                  @focus="activeField = 'username'"
                  @blur="activeField = ''"
                >
              </div>
            </div>

            <!-- Password Input -->
            <div class="px-2">
              <div class="w-full">
                <input 
                  v-model="loginData.password"
                  type="password" 
                  :placeholder="$t('login.passwordPlaceholder')"
                  :class="[
                    'w-full px-2 py-3 text-sm border rounded-md transition-colors',
                    loginData.password ? 'border-blue-400 text-gray-900' : 'border-gray-300 text-gray-400'
                  ]"
                  @focus="activeField = 'password'"
                  @blur="activeField = ''"
                >
              </div>
            </div>

            <!-- Login Button -->
            <div class="px-2">
              <button 
                :disabled="loading"
                class="w-full bg-blue-500 text-white py-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                @click="handleLogin"
              >
                {{ loading ? $t('login.loading') : $t('login.login') }}
              </button>
            </div>

            <!-- Social Login Divider -->
            <div class="flex items-center px-2 py-2">
              <div class="flex-grow h-px bg-gray-300" />
              <div class="px-3 text-sm text-gray-500">{{ $t('login.or') }}</div>
              <div class="flex-grow h-px bg-gray-300" />
            </div>

            <!-- Kakao Login Button -->
            <div class="px-2">
              <button 
                :disabled="loading"
                class="w-full bg-[#FEE500] text-[#3A1D1D] py-3 rounded-md text-sm font-medium hover:bg-[#FFDE00] transition-colors disabled:opacity-50 flex items-center justify-center"
                @click="handleKakaoLogin"
              >
                <img src="~/assets/icons/kakao-logo.svg" alt="kakao" class="w-5 h-5 mr-2">
                {{ $t('login.kakaoLogin') }}
              </button>
            </div>

            <!-- Google Login Button -->
            <div class="px-2 mt-2">
              <button 
                :disabled="loading"
                class="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center"
                @click="handleGoogleLogin"
              >
                <img src="~/assets/icons/google-logo.svg" alt="google" class="w-5 h-5 mr-2">
                {{ $t('login.googleLogin') }}
              </button>
            </div>

            <!-- Naver Login Button -->
            <div class="px-2 mt-2">
              <button 
                :disabled="loading"
                class="w-full bg-[#03C75A] text-white py-3 rounded-md text-sm font-medium hover:bg-[#02B350] transition-colors disabled:opacity-50 flex items-center justify-center"
                @click="handleNaverLogin"
              >
                <img src="~/assets/icons/naver-logo.svg" alt="naver" class="w-5 h-5 mr-2">
                {{ $t('login.naverLogin') }}
              </button>
            </div>
          </div>

          <!-- Additional Options 
          <div class="flex justify-center items-center space-x-4 px-2 py-2">
            <button class="text-sm text-gray-700 hover:text-gray-900" @click="findId">
              {{ $t('login.findId') }}
            </button>
            <div class="w-px h-3.5 bg-gray-400" />
            <button class="text-sm text-gray-700 hover:text-gray-900" @click="findPassword">
              {{ $t('login.findPassword') }}
            </button>
            <div class="w-px h-3.5 bg-gray-400" />
            <button class="text-sm text-gray-700 hover:text-gray-900" @click="signUp">
              {{ $t('login.signUp') }}
            </button>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, useRuntimeConfig } from '#imports'
import NavigationBar from '~/components/common/NavigationBar.vue'
import { useI18n } from 'vue-i18n'
import type { FetchError } from 'ofetch'

definePageMeta({
  layout: 'login',
  title: '로그인'
})

const { fetch: refreshSession } = useUserSession()
const router = useRouter()
const route = useRoute()

// 로그인 데이터 (새 UI에 맞게 변경)
const loginData = ref({
  username: '', // 기존 id 필드에 매핑됨
  password: ''
})

const { t } = useI18n()

const activeField = ref('')
const loginError = ref('')
const loading = ref(false)

// Public OAuth config from runtimeConfig
const {
  public: { oauth }
} = useRuntimeConfig()

// 로그인 처리 함수
const handleLogin = async () => {
  try {
    loading.value = true
    loginError.value = ''
    
    // API 호출 시 필드명 매핑 (username -> id)
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        id: loginData.value.username,
        password: loginData.value.password
      }
    })

    if (response.success) {
      loginData.value = { username: '', password: '' }
      await refreshSession()
      await navigateTo('/profile')
    } else {
      loginError.value = response.message
    }
  } catch (e: unknown) {
    const err = e as FetchError<{ message?: string }>
    const message = err?.data?.message || err?.message || t('login.error')
    loginError.value = message
  } finally {
    loading.value = false
  }
}

// 뒤로가기 기능
const goBack = () => {
  router.back()
}

// 아이디 찾기
const findId = () => {
  router.push('/find-id')
}

// 비밀번호 찾기
const findPassword = () => {
  router.push('/find-password')
}

// 회원가입
const signUp = () => {
  router.push('/signup')
}

// 카카오 로그인 처리
const handleKakaoLogin = () => {
  // 카카오 인증 페이지로 리다이렉트
  const { clientId, redirectUri } = oauth.kakao
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
  
  window.location.href = KAKAO_AUTH_URL
}

// 구글 로그인 처리
const handleGoogleLogin = () => {
  // 구글 인증 페이지로 리다이렉트
  const { clientId, redirectUri } = oauth.google
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`
  
  window.location.href = GOOGLE_AUTH_URL
}

// 네이버 로그인 처리
const handleNaverLogin = () => {
  // 네이버 인증 페이지로 리다이렉트
  const { clientId, redirectUri } = oauth.naver
  const STATE = Math.random().toString(36).substring(2, 15)
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${STATE}`
  
  window.location.href = NAVER_AUTH_URL
}

// 쿼리 파라미터에 따른 알림 처리 (소셜 로그인 콜백에서 리다이렉트되는 경우)
onMounted(() => {
  const reason = route.query.reason
  if (reason === 'withdrawn') {
    loginError.value = '이미 탈퇴한 회원입니다.'
  }
})
</script>
