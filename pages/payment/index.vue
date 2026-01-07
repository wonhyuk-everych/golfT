<template>
  <div>
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('payment.title')" back-color="black"/>
    
    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />

    <div class="px-4 py-6 mt-[65px]">
      <div class="payment-list">

        <div v-if="reservationHotel.length > 0">
          <PaymentHotel v-for="hotel in reservationHotel" :key="hotel.shoppingCartHotelIdx" :reservation-hotel="hotel" :bart-exchange-rate="bartExchangeRate" />
        </div>

        <div v-if="reservationGolf.length > 0">
          <PaymentGolf v-for="golf in reservationGolf" :key="golf.shoppingCartGolfIdx" :reservation-golf="golf" :bart-exchange-rate="bartExchangeRate" />
        </div>

        <div v-if="reservationCaddy.length > 0">
          <PaymentCaddy v-for="caddy in reservationCaddy" :key="caddy.shoppingCartCaddyIdx" :reservation-caddy="caddy" :bart-exchange-rate="bartExchangeRate" />
        </div>

        <div v-if="reservationCallvan.length > 0">
          <PaymentCallvan v-for="callvan in reservationCallvan" :key="callvan.shoppingCartCallvanIdx" :reservation-callvan="callvan" :bart-exchange-rate="bartExchangeRate" />
        </div>

        <div v-if="reservationTournament.length > 0">
          <PaymentTournament v-for="tournament in reservationTournament" :key="tournament.shoppingCartTournamentIdx" :reservation-tournament="tournament" :bart-exchange-rate="bartExchangeRate" />
        </div>
      </div>
      
      <div>
        <!-- 예약자 정보 -->
        <div class="flex flex-col px-0 py-6 gap-4">
          <div class="flex flex-col gap-2 mb-2 font-bold">
            <span>{{ $t('payment.reservationInfo') }}</span>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex gap-4">
              <div class="flex-1 flex flex-col gap-3 pl-4">
                <div class="flex gap-2">
                  <label class="text-sm font-normal text-primary tracking-[-0.02em] leading-6">{{ $t('payment.lastName') }}</label>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <input 
                    v-model="form.lastName"
                    type="text" 
                    placeholder="Hong"
                    class="w-full border border-primary rounded-[5px] px-2 py-3 text-sm text-center text-text-secondary placeholder-text-secondary focus:outline-none focus:border-[#16CBFA] focus:text-[#1A1A1A]"
                  >
                  <span v-if="validationErrors.lastName" class="text-xs text-red-500 w-full text-left mt-1">{{ validationErrors.lastName }}</span>
                </div>
              </div>
              <div class="flex-1 flex flex-col gap-3 pr-4">
                <div class="flex gap-2">
                  <label class="text-sm font-normal text-primary tracking-[-0.02em] leading-6">{{ $t('payment.firstName') }}</label>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <input 
                    v-model="form.firstName"
                    type="text" 
                    placeholder="Gildong"
                    class="w-full border border-primary rounded-[5px] px-2 py-3 text-sm text-center text-text-secondary placeholder-text-secondary focus:outline-none focus:border-[#16CBFA] focus:text-[#1A1A1A]"
                  >
                  <span v-if="validationErrors.firstName" class="text-xs text-red-500 w-full text-left mt-1">{{ validationErrors.firstName }}</span>
                </div>
              </div>
            </div>
            <!-- 이메일 -->
            <div class="flex flex-col gap-3 px-4">
              <div class="flex gap-2">
                <label class="text-sm font-normal text-primary leading-6">{{ $t('payment.email') }}</label>
              </div>
              <div class="flex gap-3">
                <div class="flex-1 flex flex-col items-end gap-1">
                  <input 
                    v-model="form.email"
                    type="email" 
                    placeholder="email@example.com"
                    class="w-full border border-primary rounded-[5px] px-2 py-3 text-sm text-center text-text-secondary placeholder-text-secondary focus:outline-none focus:border-[#16CBFA] focus:text-[#1A1A1A]"
                  >
                  <span v-if="validationErrors.email" class="text-xs text-red-500 w-full text-left mt-1">{{ validationErrors.email }}</span>
                </div>
              </div>
            </div>
            <!-- 휴대폰 번호 -->
            <div class="flex flex-col gap-3 px-4">
              <div class="flex gap-2">
                <label class="text-sm font-normal text-primary leading-6">{{ $t('payment.phoneNumber') }}</label>
              </div>
              <div class="flex gap-3">
                <div class="w-[80px] flex flex-col justify-center items-center gap-1">
                  <select 
                    v-model="form.countryCode"
                    class="w-full border border-primary rounded-[5px] px-2 py-3 text-sm text-center text-text-secondary placeholder-text-secondary focus:outline-none focus:border-[#16CBFA] bg-white"
                  >
                    <option value="+82">+82</option>
                  </select>
                </div>
                <div class="flex-1 flex flex-col justify-center items-center gap-1">
                  <input 
                    v-model="form.phoneNumber"
                    type="tel" 
                    placeholder="010-1234-1234"
                    class="w-full border border-primary rounded-[5px] px-2 py-3 text-sm text-center text-text-secondary placeholder-text-secondary focus:outline-none focus:border-[#16CBFA]"
                  >
                </div>
              </div>
              <span v-if="validationErrors.phoneNumber" class="text-xs text-red-500 w-full text-left mt-1">{{ validationErrors.phoneNumber }}</span>
            </div>
          </div>
        </div>
        <!-- 결제 -->
        <div class="additional-info mb-6">
          <div class="flex flex-col gap-2 mb-2 font-bold">
            <span>{{ $t('payment.discountAndPaymentInfo') }}</span>
          </div>
          <div class="flex flex-col gap-4 pt-4">
            <div class="flex flex-col gap-2 border-b border-gray-200 pb-4">
              <div class="flex justify-between items-center border-t border-gray-200 mt-4 mb-4 pt-4">
                <span class="font-bold font-xl text-text-primary">{{ $t('payment.totalPaymentAmount') }}</span>
                <span class="font-bold font-xl text-primary">{{ formatPriceOriginal(finalPaymentAmount, locale) }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-3 pt-4">
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input v-model="agreePersonalInfo" type="checkbox" class="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary shrink-0">
                <span class="flex-grow text-text-primary">{{ $t('payment.agreePersonalInfo') }}</span>
                <a class="ml-auto text-xs text-text-secondary hover:text-text-primary shrink-0" @click.prevent="showPersonalInfoModal = true">{{ $t('payment.view') }}</a>
              </label>
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input v-model="agreePaymentGateway" type="checkbox" class="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary shrink-0">
                <span class="flex-grow text-text-primary">{{ $t('payment.agreePaymentGateway') }}</span>
                <a class="ml-auto text-xs text-text-secondary hover:text-text-primary shrink-0" @click.prevent="showPaymentGatewayModal = true">{{ $t('payment.view') }}</a>
              </label>

              <!-- Personal Info Terms Modal -->
              <div v-if="showPersonalInfoModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 flex flex-col max-h-[80vh]">
                  <div class="p-6 overflow-y-auto flex-1 text-sm text-gray-800" style="max-height:60vh;">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div class="whitespace-pre-wrap" v-html="privateInfoTerms" />
                  </div>
                  <button class="w-full py-3 bg-primary text-white rounded-b-lg font-semibold text-base hover:bg-primary/80" @click="showPersonalInfoModal = false">{{ $t('common.close') || '닫기' }}</button>
                </div>
              </div>

              <!-- Payment Gateway Terms Modal -->
              <div v-if="showPaymentGatewayModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 flex flex-col max-h-[80vh]">
                  <div class="p-6 overflow-y-auto flex-1 text-sm text-gray-800" style="max-height:60vh;">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div class="whitespace-pre-wrap" v-html="paymentServiceTerms" />
                  </div>
                  <button class="w-full py-3 bg-primary text-white rounded-b-lg font-semibold text-base hover:bg-primary/80" @click="showPaymentGatewayModal = false">{{ $t('common.close') || '닫기' }}</button>
                </div>
              </div>
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input v-model="agreeAge" type="checkbox" class="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary shrink-0">
                <span class="flex-grow text-text-primary">{{ $t('payment.agreeAge') }}</span>
              </label>
            </div>
          </div>
          <div class="px-4 py-6 mt-auto">
            <!-- Toss Payment Button 컴포넌트 추가 -->
            <TossPaymentButton 
              :disabled="!(agreePersonalInfo && agreePaymentGateway && agreeAge)"
              :total-price-string="formatPriceOriginal(finalPaymentAmount, locale)"
              :order-name="generateOrderName"
              :amount="finalPaymentAmount"
              :customer-name="`${form.lastName}${form.firstName}`"
              :customer-email="form.email"
              :validate-payment="validateAndPreparePayment"
              @payment-fail="onPaymentFail"
            />
            <!--
            <button 
              v-else
              :disabled="!agreePersonalInfo || !agreePaymentGateway || !agreeAge"
              class="w-full bg-primary text-white py-3 rounded-md font-semibold text-base hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
              @click="validateAndPreparePayment()"
            >
              {{ formatPriceOriginal(finalPaymentAmount, locale) }} {{ $t('payment.payment') }}
            </button>
            -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import NavigationBar from '~/components/common/NavigationBar.vue'
import PaymentHotel from '~/components/payment/PaymentHotel.vue'
import PaymentGolf from '~/components/payment/PaymentGolf.vue'
import PaymentCaddy from '~/components/payment/PaymentCaddy.vue'
import PaymentCallvan from '~/components/payment/PaymentCallvan.vue'
import PaymentTournament from '~/components/payment/PaymentTournament.vue'
import { useExchangeRate } from '~/composables/useExchangeRate'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const { formatPriceOriginal } = useExchangeRate()

// 주문 ID 저장
const orderId = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  countryCode: '+82',
})

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const agreePersonalInfo = ref(false)
const agreePaymentGateway = ref(false)
const agreeAge = ref(false)

// Modal states
const showPersonalInfoModal = ref(false)
const showPaymentGatewayModal = ref(false)

const bartExchangeRate = ref(1)

// 예약 정보
const reservationHotel = ref([])
const reservationGolf = ref([])
const reservationCallvan = ref([])
const reservationCaddy = ref([])
const reservationTournament = ref([])

const finalPaymentAmount = ref(0)

const privateInfoTerms = ref('')
const paymentServiceTerms = ref('')

const validationErrors = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
})

const validateReservationInfo = () => {
  let valid = true
  validationErrors.value = { firstName: '', lastName: '', email: '', phoneNumber: '' }
  const firstName = form.value.firstName?.trim()
  const lastName = form.value.lastName?.trim()
  const email = form.value.email?.trim()
  const phoneNumber = form.value.phoneNumber?.trim()

  if (!firstName) {
    validationErrors.value.firstName = t('payment.firstNameRequired')
    valid = false
  }
  if (!lastName) {
    validationErrors.value.lastName = t('payment.lastNameRequired')
    valid = false
  }
  if (!email) {
    validationErrors.value.email = t('payment.emailRequired')
    valid = false
  } else {
    const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/
    if (!emailRegex.test(email)) {
      validationErrors.value.email = t('payment.emailInvalid')
      valid = false
    }
  }
  if (!phoneNumber) {
    validationErrors.value.phoneNumber = t('payment.phoneNumberRequired')
    valid = false
  } else {
    const phoneRegex = /^[0-9\-\s]+$/
    if (!phoneRegex.test(phoneNumber)) {
      validationErrors.value.phoneNumber = t('payment.phoneNumberInvalid')
      valid = false
    }
  }
  return valid
}

// 주문 ID 설정 함수
const setOrderId = (id: string) => {
  orderId.value = id
  return id
}

// 주문명 생성 함수
const generateOrderName = () => {
  let orderName = ''
  
  if (reservationHotel.value.length > 0) {
    orderName += `${reservationHotel.value[0].hotelNameKr}`
  } else if (reservationGolf.value.length > 0) {
    orderName += `${reservationGolf.value[0].nameKr}`
  } else if (reservationTournament.value.length > 0) {
    orderName += `${reservationTournament.value[0].title}`
  }
  
  // 여러 상품이 있는 경우 외 n건 표시
  const totalItems = reservationHotel.value.length + 
                    reservationGolf.value.length + 
                    reservationCallvan.value.length + 
                    reservationCaddy.value.length + 
                    reservationTournament.value.length
  
  if (totalItems > 1) {
    orderName += ` ${t('payment.payProductField', { count: totalItems - 1 })}`
  }
  
  return orderName
}

// 결제 전 유효성 검사 및 준비
const validateAndPreparePayment = async () => {
  if (!validateReservationInfo()) return
  
  try {
    const response = await $fetch('/api/payment/check', {
      method: 'POST',
      body: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        phoneNumber: form.value.phoneNumber,
        bartExchangeRate: bartExchangeRate.value,
        reservationHotel: reservationHotel.value,
        reservationGolf: reservationGolf.value,
        reservationCallvan: reservationCallvan.value,
        reservationCaddy: reservationCaddy.value,
        reservationTournament: reservationTournament.value,
        finalPaymentAmount: finalPaymentAmount.value
      }
    })

    if (response.success) {
      // 폼 유효성 검사 통과
      if (response.orderId) {
        setOrderId(response.orderId)
        sessionStorage.setItem('paymentCheck', response.orderId);
        return response.orderId
      }
    } else {
      showToast.value = true
      toastMessage.value = response.message
      toastType.value = 'error'
    }
  } catch (error) {
    console.error('Check API error:', error)
    showToast.value = true
    toastMessage.value = t('common.error')
    toastType.value = 'error'
  }

  return null
}


// Toss Payments 결제 실패 처리
const onPaymentFail = () => {
  showToast.value = true
  toastMessage.value = t('tossPayment.failMessage')
  toastType.value = 'error'
}

onMounted(() => {
  // Get BART exchange rate
  fetchBartRate()
  fetchTerms()

  // hotel
  const hotelData = sessionStorage.getItem('hotelReservation');
  reservationHotel.value = hotelData ? JSON.parse(hotelData) : [];

  for (const hotel of reservationHotel.value) {
    finalPaymentAmount.value += hotel.finalPaymentAmount;
  }

  // golf
  const golfData = sessionStorage.getItem('golfReservation');
  reservationGolf.value = golfData ? JSON.parse(golfData) : [];

  for (const golf of reservationGolf.value) {
    finalPaymentAmount.value += golf.finalPaymentAmount;
  }

  // callvan
  const callvanData = sessionStorage.getItem('callvanReservation');
  reservationCallvan.value = callvanData ? JSON.parse(callvanData) : [];

  for (const callvan of reservationCallvan.value) {
    finalPaymentAmount.value += callvan.finalPaymentAmount;
  }

  // caddy
  const caddyData = sessionStorage.getItem('caddyReservation');
  reservationCaddy.value = caddyData ? JSON.parse(caddyData) : [];

  for (const caddy of reservationCaddy.value) {
    finalPaymentAmount.value += caddy.finalPaymentAmount;
  }

  // tournament
  const tournamentData = sessionStorage.getItem('tournamentReservation');
  reservationTournament.value = tournamentData ? JSON.parse(tournamentData) : [];

  for (const tournament of reservationTournament.value) {
    finalPaymentAmount.value += tournament.finalPaymentAmount;
  }

  if(finalPaymentAmount.value == 0){
    navigateTo('/', { replace: true });
    return;
  }
});

const fetchBartRate = async () => {
  try {
    const response = await $fetch('/api/payment/bart-rate')
    bartExchangeRate.value = response.bartRate
  } catch (error) {
    console.error('Error fetching bart rate:', error)
  }
}

const fetchTerms = async () => {
  try {
    const response = await $fetch('/api/payment/terms')
    privateInfoTerms.value = response.privateInfoTerms
    paymentServiceTerms.value = response.paymentServiceTerms
  } catch (error) {
    console.error('Error fetching terms:', error)
  }
}
</script>

<style scoped>
.payment-list {
  margin-bottom: 24px;
}
</style>