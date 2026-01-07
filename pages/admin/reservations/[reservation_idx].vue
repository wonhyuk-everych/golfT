<template>
  <div class="max-w-5xl mx-auto py-8">
    <!-- 취소 확인 모달 -->  
    <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">예약 취소 확인</h3>
        <p class="mb-4">{{ cancelModalMessage }}</p>
        
        <!-- 취소 이유 입력 필드 -->
        <div class="mb-4">
          <label for="cancelReason" class="block text-sm font-medium text-gray-700 mb-1">취소 이유</label>
          <textarea 
            id="cancelReason" 
            v-model="cancelReason" 
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            rows="3"
            placeholder="취소 이유를 입력해주세요"
          />
        </div>
        
        <div class="flex justify-end gap-3">
          <button 
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors duration-200"
            @click="showCancelModal = false">
            취소
          </button>
          <button 
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!cancelReason.trim()" 
            @click="confirmCancellation">
            확인
          </button>
        </div>
      </div>
    </div>
    
    <!-- 상태 변경 모달 -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">예약 상태 변경</h3>
        <p class="mb-4">{{ statusModalMessage }}</p>
        
        <!-- 상태 선택 필드 -->
        <div class="mb-4">
          <label for="newStatus" class="block text-sm font-medium text-gray-700 mb-1">새 상태</label>
          <select 
            id="newStatus" 
            v-model="newStatus" 
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PENDING">대기</option>
            <option value="REFUND_REQUEST">환불 요청</option>
            <option value="CANCELLED">취소</option>
            <option value="PARTIALLY_CANCELLED">부분 취소</option>
            <option value="COMPLETE">완료</option>
          </select>
        </div>
        
        <div class="flex justify-end gap-3">
          <button 
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors duration-200"
            @click="showStatusModal = false">
            취소
          </button>
          <button 
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="confirmStatusChange">
            확인
          </button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="text-center py-20 text-lg text-gray-500">로딩 중...</div>
    <div v-else>
      <!-- 예약번호/상태/회원 상단 요약 -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-6">
        <div class="space-y-2">
          <div class="text-xl font-bold">예약번호 <span class="text-blue-700">{{ detail.master?.reservation_idx }}</span></div>
          <div class="text-gray-600 text-sm">예약일시: {{ detail.master?.reservation_date || '-' }}</div>
        </div>
        <div class="flex flex-col items-stretch md:items-end gap-4">
          <div
            v-if="detail.master?.reservation_status"
            class="flex flex-col md:flex-row md:items-center md:justify-end gap-2 text-sm text-gray-600"
          >
            <span class="font-semibold uppercase tracking-wide text-gray-500">예약 상태</span>
            <span :class="statusBadgeClass(detail.master.reservation_status)">{{ getStatusText(detail.master.reservation_status) }}</span>
          </div>
          <div class="flex flex-wrap gap-2 justify-start md:justify-end">
            <button 
              class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 shadow-sm"
              @click="openStatusModal('all', null, '전체 예약')">
              상태 변경
            </button>
            <button 
              v-if="detail.master?.reservation_status !== 'CANCELLED'"
              class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 shadow-sm"
              @click="openCancelModal('all', null, '전체 예약')">
              전체 예약 취소
            </button>
          </div>
          <div class="bg-gray-50 rounded px-4 py-2 shadow text-gray-700">
            <span class="font-semibold">회원:</span>
            {{ detail.member?.name || '-' }} (ID: {{ detail.member?.user_id || '-' }}, 번호: {{ detail.member?.member_idx || '-' }})
          </div>
        </div>
      </div>

      <!-- 결제 정보 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border">
        <div class="font-semibold text-lg mb-2">결제 정보</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><span class="text-gray-500">결제수단</span><div>{{ detail.master?.pay_type || '-' }}</div></div>
          <div><span class="text-gray-500">총 결제금액</span><div>{{ detail.master?.original_price?.toLocaleString() || '-' }}</div></div>
          <div><span class="text-gray-500">실 결제금액</span><div>{{ detail.master?.total_price?.toLocaleString() || '-' }}</div></div>
          <div><span class="text-gray-500">이메일</span><div>{{ detail.master?.email || '-' }}</div></div>
          <div><span class="text-gray-500">전화번호</span><div>{{ detail.master?.phone_number || '-' }}</div></div>
          <div><span class="text-gray-500">취소일시</span><div>{{ detail.master?.cancel_date || '-' }}</div></div>
          <div v-if="detail.master?.reservation_status === 'CANCELLED'"><span class="text-gray-500">취소 사유</span><div>{{ detail.master?.cancel_reason || '-' }}</div></div>
        </div>
      </div>

      <!-- 골프장 상세 -->
      <div v-if="detail.golf && detail.golf.length" class="bg-white rounded-lg shadow-sm p-6 mb-6 border">
        <div class="font-semibold text-lg mb-2 flex items-center justify-between">
          <span>골프장 예약 정보</span>
        </div>
        <div>
          <div v-for="g in detail.golf" :key="g.reservation_golf_idx" class="border-b last:border-b-0 py-4 text-sm">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div
                v-if="g.reservation_status"
                class="flex items-center gap-2 text-sm text-gray-700"
              >
                <span class="font-semibold uppercase tracking-wide text-gray-500">예약 상태</span>
                <span :class="statusBadgeClass(g.reservation_status)">{{ getStatusText(g.reservation_status) }}</span>
              </div>
              <div class="flex gap-2">
                <button 
                  class="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm font-semibold transition-colors duration-200 shadow-sm"
                  @click="openStatusModal('golf', g.reservation_golf_idx, g.golf_course_name)">
                  상태 변경
                </button>
                <button 
                  v-if="detail.master?.reservation_status !== 'CANCELLED'"
                  class="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-md text-sm font-semibold transition-colors duration-200 shadow-sm"
                  @click="openCancelModal('golf', g.reservation_golf_idx, g.golf_course_name)">
                  취소
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div><span class="text-gray-500">골프장</span> <div class="font-medium">{{ g.name_kr }}</div></div>
              <div><span class="text-gray-500">예약일</span> <div>{{ formatDateBookingDay(g.reservation_date, locale.value) }}</div></div>
              <div>
                <span class="text-gray-500">예약 시간</span> 
                <div v-if="g.start_time && g.end_time">
                  {{ g.start_time.substring(0, 5) }} ~ {{ g.end_time.substring(0, 5) }}
                </div>
                <div v-else>-</div>
              </div>
              <div><span class="text-gray-500">예약 인원</span> <div>{{ g.number_of_reservation }}명</div></div>
              <div v-if="g.reservation_status === 'CANCELLED'"><span class="text-gray-500">취소 사유</span> <div class="text-red-600">{{ g.cancel_reason || '-' }}</div></div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div><span class="text-gray-500">그린피</span> <div>{{ g.golf_course_sale_fee?.toLocaleString() }}원</div></div>
              <div><span class="text-gray-500">카트비</span> <div>{{ g.cart_sale_fee?.toLocaleString() }}원</div></div>
              <div><span class="text-gray-500">캐디비</span> <div>{{ g.caddy_sale_fee?.toLocaleString() }}원</div></div>
              <div><span class="text-gray-500">총 가격</span> <div class="font-medium text-blue-700">{{ g.total_price?.toLocaleString() }}원</div></div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span class="text-gray-500">콜밴 예약</span> 
                <div v-if="g.number_of_call_van && g.number_of_call_van > 0" class="text-green-600">
                  {{ g.number_of_call_van }}대 예약됨
                </div>
                <div v-else>예약 없음</div>
              </div>
              <div v-if="g.number_of_call_van && g.number_of_call_van > 0">
                <span class="text-gray-500">차량 타입</span> 
                <div>{{ g.car_type || '-' }}</div>
              </div>
              <div v-if="g.number_of_call_van && g.number_of_call_van > 0">
                <span class="text-gray-500">이동 타입</span> 
                <div>{{ g.round_trip_yn === 'Y' ? '왕복' : '편도' }}</div>
              </div>
              <div v-if="g.number_of_call_van && g.number_of_call_van > 0">
                <span class="text-gray-500">콜밴 요금</span> 
                <div>{{ g.callvan_sale_fee?.toLocaleString() || '-' }}원</div>
              </div>
            </div>
            
            <div v-if="g.number_of_call_van && g.number_of_call_van > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <span class="text-gray-500">출발 위치</span> 
                <div>{{ g.pickup_location || '-' }}</div>
              </div>
              <div>
                <span class="text-gray-500">도착 위치</span> 
                <div>{{ g.dropoff_location || '-' }}</div>
              </div>
            </div>
            
            <div class="mt-3">
              <span class="text-gray-500">가격 타입</span> 
              <div class="inline-block ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                {{ g.golf_price_type === 'exception' ? '특별 가격' : '주중 가격' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 호텔 상세 -->
      <div v-if="detail.hotel && detail.hotel.length" class="bg-white rounded-lg shadow-sm p-6 mb-6 border">
        <div class="font-semibold text-lg mb-2 flex items-center">호텔 예약 정보</div>
        <div>
          <div v-for="h in detail.hotel" :key="h.reservation_hotel_idx" class="border-b last:border-b-0 py-4 text-sm">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div
                v-if="h.reservation_status"
                class="flex items-center gap-2 text-sm text-gray-700"
              >
                <span class="font-semibold uppercase tracking-wide text-gray-500">예약 상태</span>
                <span :class="statusBadgeClass(h.reservation_status)">{{ getStatusText(h.reservation_status) }}</span>
              </div>
              <button 
                v-if="detail.master?.reservation_status !== 'CANCELLED'"
                class="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-md text-sm font-semibold transition-colors duration-200 shadow-sm"
                @click="openCancelModal('hotel', h.reservation_hotel_idx, h.name_kr)">
                부분 예약 취소
              </button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div><span class="text-gray-500">체크인</span> <div>{{ formatDateLocale(h.check_in_date, locale.value) }}</div></div>
              <div><span class="text-gray-500">체크아웃</span> <div>{{ formatDateLocale(h.check_out_date, locale.value) }}</div></div>
              <div><span class="text-gray-500">호텔ID</span> <div>{{ h.name_kr }}</div></div>
              <div><span class="text-gray-500">객실수</span> <div>{{ h.number_of_room }}</div></div>
              <div><span class="text-gray-500">가격</span> <div>{{ h.total_price?.toLocaleString() }}</div></div>
              <div v-if="h.reservation_status === 'CANCELLED'"><span class="text-gray-500">취소 사유</span> <div class="text-red-600">{{ h.cancel_reason || '-' }}</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 캐디 상세 -->
      <div v-if="detail.caddy && detail.caddy.length" class="bg-white rounded-lg shadow-sm p-6 mb-6 border">
        <div class="font-semibold text-lg mb-2 flex items-center">캐디 예약 정보</div>
        <div>
          <div v-for="c in detail.caddy" :key="c.reservation_caddy_idx" class="border-b last:border-b-0 py-4 text-sm">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div
                v-if="c.reservation_status"
                class="flex items-center gap-2 text-sm text-gray-700"
              >
                <span class="font-semibold uppercase tracking-wide text-gray-500">예약 상태</span>
                <span :class="statusBadgeClass(c.reservation_status)">{{ getStatusText(c.reservation_status) }}</span>
              </div>
              <button 
                v-if="detail.master?.reservation_status !== 'CANCELLED'"
                class="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-md text-sm font-semibold transition-colors duration-200 shadow-sm"
                @click="openCancelModal('caddy', c.reservation_caddy_idx, c.name || '캐디')">
                부분 예약 취소
              </button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div><span class="text-gray-500">예약일</span> <div>{{ formatDateLocale(c.reservation_date, locale.value) }}</div></div>
              <div><span class="text-gray-500">캐디ID</span> <div>{{ c.name }}</div></div>
              <div><span class="text-gray-500">골프장ID</span> <div>{{ c.course_idx }}</div></div>
              <div><span class="text-gray-500">가격</span> <div>{{ c.total_price?.toLocaleString() }}</div></div>
              <div v-if="c.reservation_status === 'CANCELLED'"><span class="text-gray-500">취소 사유</span> <div class="text-red-600">{{ c.cancel_reason || '-' }}</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 대회 상세 -->
      <div v-if="detail.tournament && detail.tournament.length" class="bg-white rounded-lg shadow-sm p-6 mb-6 border">
        <div class="font-semibold text-lg mb-2 flex items-center">대회 예약 정보</div>
        <div>
          <div v-for="t in detail.tournament" :key="t.reservation_tournament_idx" class="border-b last:border-b-0 py-4 text-sm relative">
            <button 
              v-if="detail.master?.reservation_status !== 'CANCELLED'"
              class="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded text-xs font-medium transition-colors duration-200"
              @click="openCancelModal('tournament', t.reservation_tournament_idx, t.title || '대회')">
              부분 예약 취소
            </button>
            
            <!-- 기본 정보 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div><span class="text-gray-500">예약일</span> <div>{{ formatDateLocale(t.create_date, locale.value) }}</div></div>
              <div><span class="text-gray-500">대회ID</span> <div>{{ t.tournament_idx }}</div></div>
              <div><span class="text-gray-500">회원번호</span> <div>{{ t.member_idx }}</div></div>
              <div><span class="text-gray-500">가격</span> <div class="font-medium text-blue-700">{{ t.total_price?.toLocaleString() }}원</div></div>
              <div><span class="text-gray-500">예약상태</span> <div><span :class="statusBadgeClass(t.reservation_status)">{{ getStatusText(t.reservation_status) }}</span></div></div>
              <div v-if="t.reservation_status === 'CANCELLED'"><span class="text-gray-500">취소 사유</span> <div class="text-red-600">{{ t.cancel_reason || '-' }}</div></div>
            </div>
            
            <!-- 대회 폼 데이터 -->
            <div v-if="t.form_data" class="mt-3 bg-gray-50 p-3 rounded-md">
              <div class="font-medium mb-2 text-gray-700">대회 정보</div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="(field, index) in parseFormData(t.form_data)" :key="index">
                  <span class="text-gray-500">{{ field.title }}</span>
                  <div>{{ field.value || '-' }}</div>
                </div>
              </div>
            </div>
            
            <!-- 이미지 섹션 -->
            <div v-if="t.images" class="mt-4">
              <div class="font-medium mb-2 text-gray-700">첨부 이미지</div>
              <div class="flex flex-wrap gap-2">
                <div v-for="(image, index) in t.images.split(',')" :key="index" class="relative">
                  <img :src="image" class="h-24 w-auto object-cover rounded border" @click="openImageModal(image)">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 이미지 모달 -->
        <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="showImageModal = false">
          <div class="relative max-w-4xl max-h-[90vh] overflow-auto">
            <button class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg" @click.stop="showImageModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img :src="currentImage" class="max-h-[90vh] max-w-full object-contain" @click.stop>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from '#imports'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formatDateLocale, formatDateBookingDay } from '~/utils/formatters'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { locale } = useI18n()

const route = useRoute()
const reservationIdx = route.params.reservation_idx as string
const loading = ref(true)
const detail = ref<any>({})

// 취소 모달 관련 상태
const showCancelModal = ref(false)
const cancelModalMessage = ref('')
const cancelItemType = ref('')
const cancelItemIdx = ref<number | null>(null)
const cancelReason = ref('')

// 상태 변경 모달 관련 상태
const showStatusModal = ref(false)
const statusModalMessage = ref('')
const statusItemType = ref('')
const statusItemIdx = ref<number | null>(null)
const newStatus = ref('PENDING')

// 이미지 모달 관련 상태
const showImageModal = ref(false)
const currentImage = ref('')

const fetchDetail = async () => {
  loading.value = true
  detail.value = await $fetch(`/api/admin/reservations/${reservationIdx}`)
  loading.value = false
}

onMounted(fetchDetail)

// 취소 모달 열기
function openCancelModal(itemType: string, itemIdx: number | null, itemName: string) {
  cancelItemType.value = itemType
  cancelItemIdx.value = itemIdx
  cancelReason.value = '' // 취소 이유 초기화
  
  if (itemType === 'all') {
    cancelModalMessage.value = `해당 결제를 취소하시겠습니까?`
  } else {
    cancelModalMessage.value = `${itemName} 예약을 취소하시겠습니까?`
  }
  
  showCancelModal.value = true
}

// 예약 아이템 타입 정의
interface ReservationItem {
  reservation_status: string;
}

interface GolfItem extends ReservationItem {
  reservation_golf_idx: number;
  golf_course_name: string;
}

interface HotelItem extends ReservationItem {
  reservation_hotel_idx: number;
}

interface CaddyItem extends ReservationItem {
  reservation_caddy_idx: number;
}

interface TournamentItem extends ReservationItem {
  reservation_tournament_idx: number;
}

// 상태 변경 모달 열기
function openStatusModal(itemType: string, itemIdx: number | null, itemName: string) {
  statusItemType.value = itemType
  statusItemIdx.value = itemIdx
  
  // 현재 상태를 기본값으로 설정
  if (itemType === 'all' && detail.value.master) {
    newStatus.value = detail.value.master.reservation_status
  } else if (itemType === 'golf' && detail.value.golf) {
    const item = detail.value.golf.find((g: GolfItem) => g.reservation_golf_idx === itemIdx)
    if (item) newStatus.value = item.reservation_status
  } else if (itemType === 'hotel' && detail.value.hotel) {
    const item = detail.value.hotel.find((h: HotelItem) => h.reservation_hotel_idx === itemIdx)
    if (item) newStatus.value = item.reservation_status
  } else if (itemType === 'caddy' && detail.value.caddy) {
    const item = detail.value.caddy.find((c: CaddyItem) => c.reservation_caddy_idx === itemIdx)
    if (item) newStatus.value = item.reservation_status
  } else if (itemType === 'tournament' && detail.value.tournament) {
    const item = detail.value.tournament.find((t: TournamentItem) => t.reservation_tournament_idx === itemIdx)
    if (item) newStatus.value = item.reservation_status
  }
  
  if (itemType === 'all') {
    statusModalMessage.value = `전체 예약 상태를 변경하시겠습니까?`
  } else {
    statusModalMessage.value = `${itemName} 예약 상태를 변경하시겠습니까?`
  }
  
  showStatusModal.value = true
}

// 취소 확인
async function confirmCancellation() {
  // 취소 이유가 비어있으면 처리하지 않음
  if (!cancelReason.value.trim()) {
    return
  }
  
  try {
    const response = await $fetch('/api/admin/reservations/cancel', {
      method: 'POST',
      body: {
        reservation_idx: reservationIdx,
        item_type: cancelItemType.value,
        item_idx: cancelItemIdx.value,
        cancel_reason: cancelReason.value.trim()
      }
    })
    
    if(response.success){
      alert(response.message);
    }
    showCancelModal.value = false
    
    // 성공 후 데이터 다시 불러오기
    await fetchDetail()
  } catch (error) {
    console.error('Cancellation error:', error)
    alert('예약 취소 중 오류가 발생했습니다.')
    showCancelModal.value = false
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'PENDING': return '대기'
    case 'CONFIRMED': return '확정'
    case 'CANCELLED': return '취소'
    case 'PARTIALLY_CANCELLED': return '부분 취소'
    case 'REFUND_REQUEST': return '환불 요청'
    case 'COMPLETE': return '완료'
    default: return status
  }
}

function statusBadgeClass(status: string) {
  const baseClass = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-sm';
  switch (status) {
    case 'PENDING':
      return `${baseClass} bg-yellow-100 text-yellow-800 border border-yellow-200`;
    case 'CONFIRMED':
      return `${baseClass} bg-emerald-100 text-emerald-800 border border-emerald-200`;
    case 'CANCELLED':
      return `${baseClass} bg-red-100 text-red-800 border border-red-200`;
    case 'PARTIALLY_CANCELLED':
      return `${baseClass} bg-rose-100 text-rose-800 border border-rose-200`;
    case 'REFUND_REQUEST':
      return `${baseClass} bg-orange-100 text-orange-800 border border-orange-200`;
    case 'COMPLETE':
      return `${baseClass} bg-blue-100 text-blue-800 border border-blue-200`;
    default:
      return `${baseClass} bg-gray-100 text-gray-700 border border-gray-200`;
  }
}

// 대회 폼 데이터 파싱 함수
function parseFormData(formDataString: unknown) {
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

// 이미지 모달 열기
function openImageModal(imageUrl: string) {
  currentImage.value = imageUrl
  showImageModal.value = true
}

// 상태 변경 확인
async function confirmStatusChange() {
  try {
    const response = await $fetch('/api/admin/reservations/update-status', {
      method: 'POST',
      body: {
        reservation_idx: reservationIdx,
        item_type: statusItemType.value,
        item_idx: statusItemIdx.value,
        status: newStatus.value
      }
    })
    
    if(response.success){
      alert(response.message);
    }
    showStatusModal.value = false
    
    // 성공 후 데이터 다시 불러오기
    await fetchDetail()
  } catch (error) {
    console.error('Status update error:', error)
    alert('예약 상태 변경 중 오류가 발생했습니다.')
    showStatusModal.value = false
  }
}
</script>

<style scoped>
</style>
