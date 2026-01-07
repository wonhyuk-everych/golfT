<template>
  <div>
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('payment.complete.success')" back-color="black" />
    <div class="payment-result-container">
      <div class="payment-processing">
        <div class="spinner"></div>
        <p class="processing-text">{{ $t('payment.payProgress') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

definePageMeta({
  name: 'payment_success'
})

// Define all possible response types from the API
type PaymentSuccessResponse = {
  success: true
  reservation_idx: string
  message: string
}

type PaymentErrorResponse = {
  success: false
  code: string
  message: string
}

// Union type for all possible responses
type PaymentResponse = PaymentSuccessResponse | PaymentErrorResponse

const route = useRoute()

// 결제 정보 가져오기
onMounted(async () => {
  sessionStorage.removeItem('paymentCheck');

  // URL 파라미터에서 결제 정보 추출
  const { paymentKey, orderId, amount } = route.query

  if (paymentKey && orderId && amount) {
    fetchPaymentInfo()
  }
})

const fetchPaymentInfo = async () => {
  try {
      const response = await $fetch<PaymentResponse>('/api/payment/complete', {
          method: 'POST',
          body: {
            orderId: route.query.orderId,
            amount: route.query.amount,
            paymentKey: route.query.paymentKey
          }
    })

    if(response.success){
        navigateTo(`/payment/complete/${response.reservation_idx}`, { replace: true })
    }else{
        navigateTo('/payment/fail?code=' + response.code + '&message=' + response.message, { replace: true })
    }
  } catch (error) {
    console.error('결제 정보 조회 중 오류가 발생했습니다:', error)
    navigateTo('/payment/fail?code=0&message=결제 정보 조회 중 오류가 발생했습니다.', { replace: true })
  }
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

.payment-processing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 100, 255, 0.2);
  border-radius: 50%;
  border-top-color: #0064FF;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.processing-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.payment-result {
  max-width: 600px;
  width: 100%;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.success {
  background-color: #f8f9fa;
  border-top: 4px solid #28a745;
}

h1 {
  color: #28a745;
  margin-bottom: 1rem;
}

.payment-info {
  margin-top: 2rem;
  text-align: left;
}

.payment-details {
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
}

.button {
  display: inline-block;
  background-color: #0064FF;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: #0052CC;
}
</style>
