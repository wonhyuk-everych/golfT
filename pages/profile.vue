<template>
  <div class="min-h-screen pb-20">

    <NavigationBar mode="back_title" :show-bell="false" :title="$t('profile.title')" back-color="black"/>

    <div class="flex flex-col bg-white gap-6 pt-6 pl-6 mt-[65px]">
      <!-- 프로필 상단 -->
      <div class="flex flex-col gap-4">
        <!-- 프로필 정보 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- 프로필 이미지 -->
            <div class="w-14 h-14 bg-red-400 rounded-full flex items-center justify-center">
              <div class="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              </div>
            </div>
            <!-- 사용자 정보 -->
            <div class="flex flex-col gap-0.5 py-1">
              <h2 class="text-black text-xl font-bold leading-6 tracking-tight">
                {{ user?.name_kr }}
              </h2>
              <p class="text-gray-400 text-sm leading-5 tracking-tight">
                멤버쉽
              </p>
            </div>
          </div>
          <!-- 화살표 아이콘 -->
          <button class="w-6 h-6 flex items-center justify-center" @click="navigateToMypage">
            <img src="~/assets/icons/profile-arrow-right.svg" alt="arrow" class="w-7 h-7" />
          </button>
        </div>

        <!-- 포인트/쿠폰 정보 -->
        <!--
        <div class="flex gap-2">
          <button 
            class="flex-1 border border-gray-200 rounded-md px-2 py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <span class="text-gray-500 text-sm leading-5 tracking-tight">{{ $t('profile.point') }}</span>
            <span class="text-black text-sm leading-5 tracking-tight">100</span>
          </button>
          <button 
            class="flex-1 border border-gray-200 rounded-md px-2 py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <span class="text-gray-500 text-sm leading-5 tracking-tight">{{ $t('profile.coupon') }}</span>
            <span class="text-black text-sm leading-5 tracking-tight">1장</span>
          </button>
        </div>
        -->
      </div>

      <!-- 메뉴 섹션 -->
      <div class="flex justify-between items-center gap-10 py-1">
        <!-- 위시리스트 -->
        <button 
          class="flex flex-col items-center gap-1.5 w-14 hover:opacity-70 transition-opacity"
          @click="navigateToWish"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <img src="~/assets/icons/mypage_wish.svg" alt="wish" class="w-5 h-5 text-gray-700" />
          </div>
          <span class="text-black text-xs leading-4 text-center tracking-tight">{{ $t('profile.wishlist') }}</span>
        </button>

        <!-- 내 리뷰 -->
        <button 
          class="flex flex-col items-center gap-1.5 w-14 hover:opacity-70 transition-opacity"
          @click="navigateToReview"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <img src="~/assets/icons/mypage_review.svg" alt="review" class="w-5 h-5 text-black" />
          </div>
          <span class="text-black text-xs leading-4 text-center tracking-tight">{{ $t('profile.review') }}</span>
        </button>

        <!-- 알림함 -->
        <button 
          class="flex flex-col items-center gap-1.5 w-14 hover:opacity-70 transition-opacity relative"
        >
          <div class="w-6 h-6 flex items-center justify-center">
            <img src="~/assets/icons/mypage_alarm.svg" alt="alarm" class="w-5 h-5 text-black" />
          </div>
          <span class="text-black text-xs leading-4 text-center tracking-tight">{{ $t('profile.alarm') }}</span>
        </button>
      </div>
    </div>

    <Divider :offset-px="0"/>

    <!-- 예약 정보 섹션 -->
    <div class="flex flex-col bg-white gap-6">
      <!-- 섹션 타이틀 -->
      <div class="px-6">
        <h3 class="text-black text-base leading-6 tracking-tight font-bold">{{ $t('profile.reservation') }}</h3>
      </div>

      <!-- 예약 메뉴 리스트 -->
      <div class="flex flex-col gap-3">
        <!-- 골프장 -->
        <button 
          @click="navigateToReservation('G')"
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('profile.golfCourse') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>

        <!-- 호텔 -->
        <button 
          @click="navigateToReservation('H')"
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('profile.hotel') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>

        <!-- 캐디 -->
        <button 
          @click="navigateToReservation('C')"
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('profile.caddy') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>

        <!--대회 -->
        <button 
          @click="navigateToReservation('T')"
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('profile.tournament') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>
      </div>
    </div>

    <Divider :offset-px="0"/>

    <!-- 예약 정보 섹션 -->
    <div class="flex flex-col bg-white gap-6">
      <!-- 섹션 타이틀 -->
      <div class="px-6">
        <h3 class="text-black text-base leading-6 tracking-tight font-bold">{{ $t('profile.customerService') }}</h3>
      </div>

      <!-- 예약 메뉴 리스트 -->
      <div class="flex flex-col gap-3">
        <!-- 공지사항 -->
        <button 
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
          @click="navigateToNotice"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('profile.notice') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>

        <!-- 1:1 카카오 문의 -->
        <button 
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
          @click="navigateToKakao"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('profile.kakao') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>

        <!-- 고객센터 연결 -->
        <!--
        <button 
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('profile.customerService') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>
        -->

        <!-- QnA-->
        <button 
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
          @click="navigateToQnA"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('profile.qna') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>
      </div>
    </div>

    <Divider :offset-px="0"/>

    <!-- 설정 섹션 -->
    <div class="flex flex-col bg-white gap-6">
      <!-- 섹션 타이틀 -->
      <div class="px-6">
        <h3 class="text-black text-base leading-6 tracking-tight font-bold">{{ $t('profile.settings') }}</h3>
      </div>

      <!-- 설정 메뉴 리스트 -->
      <div class="flex flex-col gap-3">
        <!-- 언어 변경 
        <button 
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
          @click="handleLanguageChange"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('profile.language') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>-->

        <!-- 로그아웃 -->
        <button 
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
          @click="handleLogout"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('profile.logout') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'
import NavigationBar from '~/components/common/NavigationBar.vue'
import Divider from '~/components/common/Divider.vue'

definePageMeta({
  middleware: ['auth'],
  title: '마이페이지'
})

useLayout('profile')

const { user, fetch: refreshSession } = useUserSession()

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    })
    await refreshSession()
    await navigateTo('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const handleLanguageChange = () => {
  navigateTo('/settings/language')
}

const navigateToNotice = () => {
  navigateTo('/notice')
}

const navigateToMypage = () => {
  navigateTo('/mypage')
}

const navigateToQnA = () => {
  navigateTo('/qna')
}

const navigateToWish = () => {
  navigateTo('/wish')
}

const navigateToReview = () => {
  navigateTo('/review')
}

const navigateToReservation = (type: string) => {
  navigateTo(`/reservation?activeType=${type}`)
}

const navigateToKakao = () => {
  if (import.meta.client) {
    location.href = 'https://golft.channel.io/'
  }
}

onMounted(async () => {
  await refreshSession()
})
</script>
