<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-6 py-16">
    <!-- 404 Illustration / Icon -->
    <div class="relative mb-10">
      <div class="w-28 h-28 rounded-full bg-black/80 flex items-center justify-center shadow-lg">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="absolute -inset-2 rounded-full blur-2xl bg-gradient-to-tr from-black/10 to-black/0" />
    </div>

    <!-- Title -->
    <h1 class="text-3xl sm:text-4xl font-bold mb-3 text-center">
      <span v-if="is404">페이지를 찾을 수 없어요</span>
      <span v-else>문제가 발생했어요</span>
    </h1>

    <!-- Subtitle / message -->
    <p class="text-gray-500 text-center max-w-xl mb-8">
      <span v-if="is404">
        요청하신 페이지가 존재하지 않거나 이동되었어요. 아래 버튼을 사용해 홈으로 이동하거나 이전 페이지로 돌아가세요.
      </span>
      <span v-else>
        예기치 못한 오류가 발생했어요. 잠시 후 다시 시도하시거나 홈으로 이동하세요.
      </span>
      <br>
      <small class="block mt-2 text-gray-400">{{ error.statusCode }} – {{ error.statusMessage || error.message }}</small>
    </p>

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <button
        class="px-5 h-11 rounded-full bg-black text-white flex items-center gap-2 hover:bg-black/90 transition"
        @click="goHome"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L12 3L21 12" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 10V21H19V10" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>홈으로</span>
      </button>
      <button
        class="px-5 h-11 rounded-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition"
        @click="goBack"
      >
        이전으로
      </button>
      <button
        v-if="!is404"
        class="px-5 h-11 rounded-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition"
        @click="refresh"
      >
        새로고침
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from 'nuxt/app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error?.statusCode === 404)

const goHome = () => {
  clearError({ redirect: '/' })
}

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
  } else {
    clearError({ redirect: '/' })
  }
}

const refresh = () => {
  if (import.meta.client) location.reload()
}
</script>
