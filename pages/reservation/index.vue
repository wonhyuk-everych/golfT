<template>
  <div class="reservation-page">
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('reservation.title')" back-color="black" />

    <div class="pt-16">
      <nav class="bg-white w-full border-b flex">
        <div 
          v-for="type in reservationTypes"
          :key="type.type"
          class="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer flex-1"
          @click="activeType = type.type"
        >
          <span 
            class="text-base font-bold tracking-tighter" 
            :class="activeType === type.type ? 'text-primary' : 'text-text-primary'"
          >
            {{ type.name }}
          </span>
          <div 
            v-if="activeType === type.type" 
            class="w-full h-[2px] bg-primary"
          />
        </div>
      </nav>

      
      <div class="flex flex-col gap-5 px-4 py-5">
        <div v-for="reservation in reservations" :key="reservation.reservationIdx" class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 p-5 space-y-4">
          <!-- 상단 헤더 -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-sm font-medium px-3 py-1.5 rounded-full" :class="getStatusClass(reservation.reservationStatus)">{{ $t('reservation.reservationStatus.' + reservation.reservationStatus) }}</span>
              </div>
              <div class="flex items-center space-x-1.5 cursor-pointer hover:opacity-80 transition-all" @click="navigateToReservation(reservation.reservationIdx)">
                <span class="text-xs font-medium text-primary">{{ $t('reservation.detail') }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <!-- 구분선 -->
            <hr class="border-gray-100">
            
            <!-- 골프장 정보 -->
            <div class="py-2 space-y-4">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 bg-cover bg-center overflow-hidden"
                    :style="{ backgroundImage: activeType === 'V' ? `url(${callvanImg})` : `url(${reservation.image})` }">
                </div>
                <div class="flex-1">
                  <h3 class="text-base text-primary font-semibold">{{ reservation.productName }}</h3>
                  <p class="text-sm text-secondary mt-0.5">{{ reservation.productNameEn }}</p>
                </div>
              </div>
              
              <!-- 이용일자 -->
              <div v-if="activeType === 'G' || activeType === 'H' || activeType === 'C'" class="space-y-1">
                <p class="text-xs text-secondary">이용일자</p>
                <div v-if="activeType === 'H'" class="flex items-center space-x-2">
                  <span class="text-sm text-primary">{{ formatDateLocale(reservation.reservationDate1, locale.value) }} ~ {{ formatDateLocale(reservation.reservationDate2, locale.value) }}</span>
                </div>
                <div v-if="activeType === 'G'" class="flex items-center space-x-2">
                  <span class="text-sm text-primary">{{ formatDateLocale(reservation.reservationDate1, locale.value) }} / {{ reservation.reservationDate2?.substring(0, 5) }}</span>
                </div>
                <div v-if="activeType === 'C'" class="flex items-center space-x-2">
                  <span class="text-sm text-primary">{{ formatDateLocale(reservation.reservationDate1, locale.value) }}</span>
                </div>
                <div v-if="reservation.number_of_call_van > 0" class="flex items-center space-x-2">
                  <span class="text-sm text-primary">{{ reservation.round_trip_yn === 'Y' ? $t('shoppingCart.golfCourse.roundTrip') : $t('shoppingCart.golfCourse.oneWay') }}</span>
                  <span class="text-sm text-primary">{{ reservation.car_type }}</span>
                  <span class="text-sm text-primary">{{ reservation.number_of_call_van }} {{ $t('shoppingCart.golfCourse.car') }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 버튼 영역 -->
          <div v-if="reservation.reservationStatus === 'PENDING'" class="flex pt-2">
            <button 
              class="flex-1 bg-primary text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-opacity-90 transition-all duration-300 shadow-sm hover:shadow"
              @click="refundRequest(reservation)"
            >
              {{ $t('reservation.changeCancel') }}
            </button>
          </div>
          <!--리뷰 버튼-->
          <div v-if="reservation.reservationStatus === 'USED'" class="flex pt-2">
            <button 
              class="flex-1 bg-primary text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-opacity-90 transition-all duration-300 shadow-sm hover:shadow"
              @click="reviewWrite(reservation)"
            >
              {{ $t('reservation.reviewWrite') }}
            </button>
          </div>
        </div>    
      </div>
      <div v-if="hasMore && !loading" class="flex justify-center mt-4">
        <button class="px-6 py-2 rounded bg-primary text-white font-bold" @click="loadMore">{{ $t('reservation.loadMore') }}</button>
      </div>
      <div v-if="loading" class="flex justify-center mt-4">
        <span>{{ $t('reservation.loading') }}</span>
      </div>
    </div>

    <Dialog v-model="isDialogOpen" class="fixed z-50 inset-0 flex items-center justify-center" :open="isDialogOpen">
      <div class="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true"></div>
      <DialogPanel class="bg-white rounded-lg p-6 max-w-sm w-full mx-auto z-10">
        <DialogTitle class="text-lg font-bold mb-2">{{ $t('reservation.cancelPopup') }}</DialogTitle>
        <div class="mb-4">
          <div>{{ $t('reservation.productName') }}: <span class="font-semibold">{{ selectedReservation?.productName }}</span></div>
          <div>
            {{ $t('reservation.reservationDate') }}: 
            <span class="font-semibold">{{ formatDateLocale(selectedReservation?.reservationDate1, locale.value) }}</span>
          </div>
          <div class="mt-2">{{ $t('reservation.cancelMessage') }}</div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            @click="isDialogOpen = false"
            :disabled="dialogLoading"
          >{{ $t('reservation.no') }}</button>
          <button
            class="bg-primary text-white px-4 py-2 rounded"
            @click="confirmRefund"
            :disabled="dialogLoading"
          >{{ $t('reservation.yes') }}</button>
        </div>
      </DialogPanel>
    </Dialog>

    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '~/components/common/NavigationBar.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { formatDateLocale } from '~/utils/formatters'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import ToastMessage from '~/components/common/ToastMessage.vue'

const router = useRouter()

// Callvan 대표 이미지 import
import callvanImg from '@/assets/images/shoppingcart_callvan.jpg'

definePageMeta({
  name: 'reservation'
})

const route = useRoute()
const reservationType = route.query.activeType || 'G'

const { locale, t } = useI18n()

const reservationTypes = ref([
  { type: 'G', name: t('reservation.golf') },
  { type: 'H', name: t('reservation.hotel') },
  { type: 'C', name: t('reservation.caddy') },
  { type: 'T', name: t('reservation.tournament') }
])

const activeType = ref(reservationType)

interface Reservation {
  image?: string;
  reservationIdx: number;
  productName: string;
  productNameEn: string;
  reservationDate1: string; 
  reservationDate2: string;
  reservationStatus: string;
}

const reservations = ref<Reservation[]>([])
const page = ref(1)
const pageSize = 20
const hasMore = ref(true)
const loading = ref(false)

const fetchReservation = async (reset = false) => {
  if (loading.value || (!hasMore.value && !reset)) return
  loading.value = true
  try {
    const res = await $fetch('/api/reservation', {
      query: {
        reservation_type: activeType.value,
        page: page.value,
        pageSize
      }
    })
    // Defensive: check for error
    if (res.error) {
      hasMore.value = false;
      // Optionally show error message: e.g. toast or alert
      return;
    }
    const newReservations = (res.reservations || []).map((r: any) => ({
      image: r.image,
      reservationIdx: r.reservationIdx,
      productName: r.productName,
      productNameEn: r.productNameEn,
      reservationDate1: r.reservationDate1,
      reservationDate2: r.reservationDate2,
      reservationStatus: r.reservationStatus,
    }));
    if (reset) {
      reservations.value = newReservations;
    } else {
      reservations.value = reservations.value.concat(newReservations);
    }
    // Paging: hasMore if we got a full page
    hasMore.value = (page.value * pageSize) < (res.total || 0);
  } catch (e) {
    // 오류 처리
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

// 탭 변경 시 초기화 및 첫 페이지 로드
watch(() => activeType.value, () => {
  page.value = 1
  hasMore.value = true
  fetchReservation(true)
})

onMounted(() => {
  fetchReservation(true)
})

// 더보기 버튼 클릭
const loadMore = () => {
  if (loading.value || !hasMore.value) return
  page.value += 1
  fetchReservation()
}

const navigateToReservation = (reservationId: number) => {
  router.push({
    path: `/reservation/${reservationId}`,
    state: { reservationType: activeType.value }
  })
};

const isDialogOpen = ref(false)
const selectedReservation = ref<Reservation | null>(null)
const dialogLoading = ref(false)

// Toast 관련 상태
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const getStatusClass = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    case 'CONFIRMED': return 'bg-green-50 text-green-700 border border-green-200'
    case 'CANCELLED': return 'bg-red-50 text-red-700 border border-red-200'
    case 'PARTIALLY_CANCELLED': return 'bg-orange-50 text-orange-700 border border-orange-200'
    case 'REFUND_REQUEST': return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'COMPLETE': return 'bg-purple-50 text-purple-700 border border-purple-200'
    default: return 'bg-gray-50 text-gray-700 border border-gray-200'
  }
}

const refundRequest = (reservation: Reservation) => {
  selectedReservation.value = reservation
  isDialogOpen.value = true
}

const reviewWrite = (reservation: Reservation) => {
  navigateTo(`/review/write?reservationIdx=${reservation.reservationIdx}&reservationType=${activeType.value}`)
}

const confirmRefund = async () => {
  if (!selectedReservation.value) return
  dialogLoading.value = true
  try {
    const res = await $fetch('/api/reservation/refund', {
      method: 'POST',
      body: {
        reservationIdx: selectedReservation.value.reservationIdx,
        activeType: activeType.value
      }
    })
    if (res.success) {
      showToast.value = true;
      toastMessage.value = t('reservation.refundSuccess');
      toastType.value = 'success';
      fetchReservation(true)
    } else {
      showToast.value = true;
      toastMessage.value = t('reservation.refundError');
      toastType.value = 'error';
    }
  } catch (e) {
    showToast.value = true;
    toastMessage.value = t('common.error');
    toastType.value = 'error';
  } finally {
    dialogLoading.value = false
    isDialogOpen.value = false
    selectedReservation.value = null
  }
}
</script>

<style>

</style>