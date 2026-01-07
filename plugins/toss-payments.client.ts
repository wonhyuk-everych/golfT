import { defineNuxtPlugin } from '#app'
import { loadTossPayments } from '@tosspayments/payment-sdk'

export default defineNuxtPlugin(async (nuxtApp) => {
  // 클라이언트 사이드에서만 실행
  if (import.meta.client) {
    // 환경 변수에서 Toss Payments 클라이언트 키를 가져옵니다
    const runtimeConfig = nuxtApp.$config.public
    const clientKey = runtimeConfig.tossPaymentsClientKey
    
    try {
      const tossPayments = await loadTossPayments(clientKey)
      
      // Nuxt 앱에 tossPayments 객체를 제공합니다
      nuxtApp.provide('tossPayments', tossPayments)
    } catch (error) {
      console.error('Toss Payments SDK 로드 중 오류가 발생했습니다:', error)
    }
  }
})
