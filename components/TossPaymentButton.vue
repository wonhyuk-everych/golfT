<template>
  <div class="toss-payment-container">
    <button 
      class="toss-payment-button"
      :disabled="isLoading || disabled"
      @click="requestPayment" 
    >
      <span v-if="isLoading">{{ $t('tossPayment.processing') }}</span>
      <span v-else>{{ totalPriceString }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
// Nuxt 3에서는 composables를 자동으로 사용할 수 있습니다

// Toss Payments SDK 타입 정의
interface PaymentResponse {
  paymentKey: string;
  orderId: string;
  amount: number;
}

interface TossPayments {
  requestPayment: (method: string, data: PaymentRequestData) => Promise<PaymentResponse>;
}

interface PaymentRequestData {
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
}

// Nuxt 앱 타입 확장
declare module '#app' {
  interface NuxtApp {
    $tossPayments: TossPayments;
  }
}

// 플러그인 타입 확장
declare module 'nuxt/app' {
  interface NuxtApp {
    $tossPayments: TossPayments;
  }
}
const props = defineProps({
  // disabled
  disabled: {
    type: Boolean,
    default: false
  },
  // price 
  totalPriceString: {
    type: String,
    required: true
  },
  orderName: {
    type: Function,
    required: true
  },
  // 결제 금액 (원)
  amount: {
    type: Number,
    required: true
  },
  // 고객 정보
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    default: ''
  },
  validatePayment: {
    type: Function,
    required: true
  },
  // 성공 및 실패 페이지 URL
  successUrl: {
    type: String,
    default: '/payment/success'
  },
  failUrl: {
    type: String,
    default: '/payment/fail'
  }
})

const isLoading = ref(false)
const nuxtApp = useNuxtApp()

// 이벤트 정의
interface PaymentError {
  message: string;
  code?: string;
  orderId?: string;
}

const emit = defineEmits<{
  (e: 'payment-fail', error?: PaymentError): void
}>()

// 결제 요청 함수
const requestPayment = async () => {
  // 타입 안전성을 위해 타입 가드 추가
  const tossPayments = nuxtApp.$tossPayments as TossPayments | undefined
  
  if (!tossPayments) {
    console.error('Toss Payments SDK가 로드되지 않았습니다.')
    emit('payment-fail', { message: 'Toss Payments SDK가 로드되지 않았습니다.' })
    return
  }
  
  try {
    isLoading.value = true
    
    // 부모 컴포넌트의 validateAndPreparePayment 메소드 호출
    // 부모 컴포넌트에서 orderId 가져오기
    const orderId = await props.validatePayment()
    
    if (!orderId) {
      console.error('주문 ID를 가져오지 못했습니다.')
      emit('payment-fail', { message: '주문 ID를 가져오지 못했습니다.' })
      return
    }

    // 결제 요청 데이터 준비
    const paymentData = {
      amount: props.amount,
      orderId: orderId, // 부모 컴포넌트에서 가져온 orderId 사용
      orderName: props.orderName(),
      customerName: props.customerName,
      customerEmail: props.customerEmail,
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/payment/fail`,
    }

    // Toss Payments SDK를 사용하여 결제 요청
    tossPayments.requestPayment('카드', paymentData)
  } catch (error) {
    console.error('결제 요청 중 오류가 발생했습니다:', error)
    // 결제 실패 시 이벤트 발생
    emit('payment-fail', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.toss-payment-container {
  margin: 1rem 0;
}

.toss-payment-button {
  width: 100%;        
  background-color: #0064FF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.toss-payment-button:hover {
  background-color: #0052CC;
}

.toss-payment-button:disabled {
  background-color: #CCCCCC;
  cursor: not-allowed;
}
</style>
