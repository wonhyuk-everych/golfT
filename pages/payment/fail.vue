<template>
  <div>
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('payment.complete.fail')" back-color="black" />
    <div class="payment-result-container">
      <div class="payment-result fail">
        <h1>{{ $t('tossPayment.failTitle') }}</h1>
        <p>{{ $t('tossPayment.failMessage') }}</p>
        
        <div v-if="errorInfo" class="error-info">
          <h2>{{ $t('tossPayment.errorDetails') }}</h2>
          <div class="error-details">
            <div class="detail-row">
              <span class="label">{{ $t('tossPayment.errorCode') }}:</span>
              <span class="value">{{ errorInfo.code }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ $t('tossPayment.errorMessage') }}:</span>
              <span class="value">{{ errorInfo.message }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ $t('tossPayment.orderId') }}:</span>
              <span class="value">{{ errorInfo.orderId }}</span>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button class="button primary" @click="retryPayment">{{ $t('tossPayment.tryAgain') }}</button>
          <NuxtLink to="/" class="button secondary">{{ $t('common.backToHome') }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nuxt 3에서는 composables를 자동으로 사용할 수 있습니다
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  name: 'payment_fail'
})

interface ErrorInfo {
  code: string
  message: string
  orderId: string
}

const route = useRoute()
const router = useRouter()
const errorInfo = ref<ErrorInfo | null>(null)

// 오류 정보 가져오기
onMounted(() => {
  sessionStorage.removeItem('paymentCheck');

  const { code, message, orderId } = route.query
  
  if (code && message) {
    errorInfo.value = {
      code: code as string,
      message: message as string,
      orderId: (orderId as string) || '-'
    }
  }
})

// 결제 다시 시도
const retryPayment = () => {
  // 결제 페이지로 돌아가기
  // 실제 구현 시에는 이전 결제 정보를 유지하면서 다시 결제 페이지로 이동해야 합니다
  router.push('/payment')
}
</script>

<style scoped>
.payment-result-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.payment-result {
  max-width: 600px;
  width: 100%;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.fail {
  background-color: #f8f9fa;
  border-top: 4px solid #dc3545;
}

h1 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.error-info {
  margin-top: 2rem;
  text-align: left;
}

.error-details {
  background-color: #fff;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #555;
}

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
  border: none;
  cursor: pointer;
}

.primary {
  background-color: #0064FF;
  color: white;
}

.primary:hover {
  background-color: #0052CC;
}

.secondary {
  background-color: #f1f3f5;
  color: #495057;
}

.secondary:hover {
  background-color: #e9ecef;
}
</style>
