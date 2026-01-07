<template>
  <div>
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('payment.complete.title')" back-color="black" />

    <div class="pt-16">
      <div v-for="caddy in reservationData.ReservationCaddy" :key="caddy.reservation_caddy_idx">
        <div v-if="caddy" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
          <!-- Main Content -->
          <div class="flex flex-col gap-4 py-2">
            <!-- Caddy Info -->
            <div class="flex items-center gap-4">
              <!-- Caddy Image -->
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                <img 
                  :src="caddy.ImageUrl" 
                  :alt="caddy.name" 
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
              <!-- Caddy Names -->
              <div class="flex flex-col gap-0.5">
                <h3 class="text-base font-bold text-gray-900">{{ caddy.name }} ({{ caddy.caddy_code }})</h3>
                <p class="text-sm font-normal text-gray-500">{{ caddy.name_kr }} / {{ caddy.name_en }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-for="golf in reservationData.ReservationGolf" :key="golf.reservation_golf_idx">
        <div v-if="golf" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
          <div class="flex flex-col gap-4 py-2">
            <!-- Golf Course Info -->
            <div class="flex items-center gap-4">
              <!-- Course Image -->
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                <img 
                  :src="golf.ImageUrl"
                  :alt="golf.name_kr" 
                  class="w-full h-full object-cover rounded-lg"
                >
              </div>
              <!-- Course Names -->
              <div class="flex flex-col gap-0.5">
                <h3 class="text-base font-bold text-gray-900">{{ golf.name_kr }}</h3>
                <p class="text-sm font-normal text-gray-500">{{ golf.name_en }}</p>
              </div>
            </div>

            <!-- Round Date & Time -->
            <div class="flex flex-col gap-0.5">
              <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.golfCourse.roundDate') }}</p>
              <div class="flex items-center gap-2">
                <span class="text-sm font-normal text-gray-900">{{ formatDateLocale(golf.reservation_date, locale.value) }}</span>
                <span class="text-sm font-normal text-gray-900">/</span>
                <span class="text-sm font-normal text-gray-900">{{ golf.golf_course_time.substring(0, 5) }}</span>
              </div>
            </div>
            <div v-if="golf.number_of_call_van > 0" class="flex flex-col gap-0.5">
              <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.golfCourse.callVanTitle') }}</p>
              <div class="flex items-center gap-2">
                <span class="text-sm font-normal text-gray-900">{{ golf.round_trip_yn === 'Y' ? $t('shoppingCart.golfCourse.roundTrip') : $t('shoppingCart.golfCourse.oneWay') }}</span>
                <span class="text-sm font-normal text-gray-900">/</span>
                <span class="text-sm font-normal text-gray-900">{{ golf.car_type }}</span>
                <span class="text-sm font-normal text-gray-900">/</span>
                <span class="text-sm font-normal text-gray-900">{{ golf.number_of_call_van }} {{ $t('shoppingCart.golfCourse.car') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-for="hotel in reservationData.ReservationHotel" :key="hotel.reservation_hotel_idx">
        <div v-if="hotel" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
          <!-- Main Content -->
          <div class="flex flex-col gap-4 py-2">
            <!-- Hotel Info -->
            <div class="flex items-center gap-4">
              <!-- Hotel Image -->
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                <img 
                  :src="hotel.ImageUrl" 
                  :alt="hotel.hotel_name_kr" 
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
              <!-- Hotel Names -->
              <div class="flex flex-col gap-0.5">
                <h3 class="text-base font-bold text-gray-900">{{ hotel.name_kr }}</h3>
                <p class="text-sm font-normal text-gray-500">{{ hotel.name_en }}</p>
              </div>
            </div>

            <!-- Round Date & Time -->
            <div class="flex flex-col gap-0.5">
              <p class="text-xs font-normal text-gray-500">{{ $t('reservation.info.reservationInfo') }}</p>
              <div class="flex items-center gap-2">
                <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.hotel.checkIn') }} : {{ formatDateLocale(hotel.check_in_date, locale.value) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.hotel.checkOut') }} : {{ formatDateLocale(hotel.check_out_date, locale.value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-for="callvan in reservationData.ReservationCallvan" :key="callvan.reservation_callvan_idx">
        <div v-if="callvan" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
          <!-- Main Content -->
          <div class="flex flex-col gap-4 py-2">
            <!-- Callvan Info -->
            <div class="flex items-center gap-4">
              <!-- Callvan Image -->
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                <img 
                  src="~@/assets/images/shoppingcart_callvan.jpg"
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
              <!-- Callvan Names -->
              <div class="flex flex-col gap-0.5">
                <h3 class="text-base font-bold text-gray-900">{{ callvan.round_trip_yn ? $t('shoppingCart.callvan.roundTrip') : $t('shoppingCart.callvan.oneWay') }}</h3>
              </div>
            </div>

            <!-- Round Date & Time -->
            <div class="flex flex-col gap-0.5">
              <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.callvan.depature') }}1</p>
              <div class="flex items-center gap-2">
                <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.depatureDate') }}: {{ formatDateLocale(callvan.start_date, locale.value) }}</span>
                <!--
                <span class="text-sm font-normal text-gray-900">/</span>
                <span class="text-sm font-normal text-gray-900">{{ callvan.start_time }}</span>
                -->
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.number') }}: {{ callvan.number_of_reservation }}</span>
              </div>
            </div>

            <!-- Callvan Info -->
            <div v-if="callvan.round_trip_yn" class="flex flex-col gap-0.5">
              <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.callvan.depature') }}2</p>
              <!--
              <div class="flex items-center gap-2">
                <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.depatureDate') }}: {{ formatDateLocale(callvan.end_date, locale.value) }}</span>
                <span class="text-sm font-normal text-gray-900">/</span>
                <span class="text-sm font-normal text-gray-900">{{ callvan.end_time }}</span>     
              </div>
              -->
              <div class="flex items-center gap-2">
                <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.number') }}: {{ callvan.number_of_reservation }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-for="tournament in reservationData.ReservationTournament" :key="tournament.reservation_tournament_idx">
        <div v-if="tournament" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
          <div class="flex flex-col gap-4 py-2">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                <img 
                  :src="tournament.ImageUrl" 
                  :alt="tournament.title" 
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div class="flex flex-col gap-0.5">
                <h3 class="text-base font-bold text-gray-900">{{ tournament.title }}</h3>
              </div>
            </div>
            <div v-if="tournament.form_data" class="flex flex-col gap-0.5">
              <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.tournament.formTitle') }}</p>
              <div v-for="(field, index) in parseFormData(tournament.form_data)" :key="index" class="flex items-center gap-2">
                <span class="text-sm font-normal text-gray-900">{{ field.title }}: {{ field.value || '-' }}</span>
              </div>
            </div>
            <div v-if="tournament.images" class="flex flex-col gap-0.5">
              <p class="text-xs font-normal text-gray-500">{{ tournament.image_title }}</p>
              <div class="flex flex-row flex-wrap gap-2 mt-1">
                <img 
                  v-for="(image, index) in parseImages(tournament.images)" 
                  :key="index"
                  :src="image" 
                  :alt="tournament.image_title" 
                  class="w-[90px] h-[90px] object-cover rounded-lg cursor-pointer"
                  @click="openImagePopup"
                >
              </div>
              <ImagePopup 
                :images="parseImages(tournament.images)" 
                :is-open="isImagePopupOpen" 
                @close="closeImagePopup" 
              />
            </div>
          </div>
        </div>
      </div>
        


      <!-- 예약 정보 카드 (피그마 스타일 반영) -->
      <div class="bg-white p-6 flex flex-col gap-6 mt-6 w-full mx-auto">
        <h2 class="text-lg font-bold text-gray-900 mb-2">{{ $t('payment.complete.reservationInfo') }}</h2>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <span class="text-gray-500 text-sm min-w-[80px]">{{ $t('payment.complete.name') }}</span>
            <span class="text-gray-900 text-base font-medium">{{ reservationData.ReservationMaster.first_name }} {{ reservationData.ReservationMaster.last_name }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-gray-500 text-sm min-w-[80px]">{{ $t('payment.complete.email') }}</span>
            <span class="text-gray-900 text-base font-medium">{{ reservationData.ReservationMaster.email }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-gray-500 text-sm min-w-[80px]">{{ $t('payment.complete.phoneNumber') }}</span>
            <span class="text-gray-900 text-base font-medium">{{ reservationData.ReservationMaster.phone_number }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 flex flex-col gap-6 mt-6 w-full mx-auto">
        <h2 class="text-lg font-bold text-gray-900 mb-2">{{ $t('payment.complete.paymentInfo') }}</h2>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <span class="text-gray-500 text-sm min-w-[80px]">{{ $t('payment.complete.paymentDate') }}</span>
            <span class="text-gray-900 text-base font-medium">{{ formatDateLocale(reservationData.ReservationMaster.reservation_date, locale.value) }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-gray-500 text-sm min-w-[80px]">{{ $t('payment.complete.paymentMethod') }}</span>
            <span class="text-gray-900 text-base font-medium">{{ reservationData.ReservationMaster.pay_type }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-gray-500 text-sm min-w-[80px]">{{ $t('payment.complete.totalPaymentAmount') }}</span>
            <span class="text-gray-900 text-base font-medium">{{ formatNumber(reservationData.ReservationMaster.total_price) }} 원</span>
          </div>
        </div>
      </div>

      <div class="flex w-full mx-auto gap-3 p-4">
        <button
          class="flex-1 py-3 rounded-lg border border-primary text-primary bg-white font-bold shadow"
          @click="goHome"
        >
          {{ $t('payment.complete.goHome') }}
        </button>
        <button
          class="flex-1 py-3 rounded-lg bg-primary text-white font-bold shadow"
          @click="goReservation"
        >
          {{ $t('payment.complete.goReservation') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavigationBar from '~/components/common/NavigationBar.vue'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { formatNumber, formatDateLocale } from '~/utils/formatters'
import ImagePopup from '~/components/common/ImagePopup.vue'

definePageMeta({
  name: 'payment_complete'
})

const { locale, t } = useI18n()

const loading = ref(true)
const error = ref<string | null>(null)

const reservationData = ref({
  ReservationMaster: {},
  ReservationGolf: [],
  ReservationHotel: [],
  ReservationCaddy: [],
  ReservationCallvan: [],
  ReservationTournament: []
})


onMounted(() => {
  clearAllSessionStorage()
  fetchReservation()
  
  // Add a popstate event listener to redirect to home when back button is pressed
  window.addEventListener('popstate', () => {
    navigateTo('/', { replace: true })
  })
})

const route = useRoute()
const reservationId = route.params.id

const fetchReservation = async () => {
  loading.value = true
  error.value = null
  
  try {
    const data = await $fetch(`/api/payment/complete/${reservationId}`)
    
    if (data && data.success) {
      reservationData.value = data.data || {
        ReservationMaster: {},
        ReservationGolf: [],
        ReservationHotel: [],
        ReservationCaddy: [],
        ReservationCallvan: [],
        ReservationTournament: []
      }
    } else {
      error.value = data.error
    }
  } catch (err) {
    console.error('Failed to fetch shopping cart:', err)
    error.value = '예약 정보를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const goHome = () => {
  navigateTo('/', { replace: true })
}

const goReservation = () => {
  navigateTo('/reservation', { replace: true })
}

const clearAllSessionStorage = () => {
  sessionStorage.removeItem('hotelReservation');
  sessionStorage.removeItem('golfReservation');
  sessionStorage.removeItem('callvanReservation');
  sessionStorage.removeItem('caddyReservation');
  sessionStorage.removeItem('tournamentReservation');
}

// Parse the tournament form data JSON string and return only text and select fields
const parseFormData = (formDataString) => {
  try {
    const formData = formDataString.result
    
    // Check if the data has the expected structure
    if (formData && Array.isArray(formData)) {
      // Filter only text and select fields and extract title and value
      return formData
        .filter((field: { type: string }) => field.type === 'text' || field.type === 'select')
        .map((field: { title: string; value: string }) => ({
          title: field.title,
          value: field.value
        }))
    }
    return []
  } catch (error) {
    console.error('Error parsing form data:', error)
    return []
  }
}

const parseImages = (imagesString: string) => {
  try {
    const images = imagesString;
    
    // 쉼표로 구분하여 배열로 리턴
    return images.split(',')
  } catch (error) {
    console.error('Error parsing images:', error)
    return []
  }
}

const isImagePopupOpen = ref(false)

// Open image popup with the selected room
const openImagePopup = () => {
  isImagePopupOpen.value = true
}

// Close image popup
const closeImagePopup = () => {
  isImagePopupOpen.value = false
}
</script>

<style>

</style>