<template>
  <div class="bg-white w-full mx-auto">
    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />

    <!-- 날짜 선택 섹션 -->
    <div class="px-4 py-6 flex flex-col items-center gap-2">
      <div class="flex justify-between items-center w-full gap-2">
        <!-- 체크인 날짜 -->
        <div 
          class="flex-1 bg-white border border-gray-300 rounded px-6 py-4 cursor-pointer"
          @click="openCalendar('checkin')"
        >
          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">체크인</span>
              <img src="/images/icon/calendar.svg" alt="calendar" class="w-[16px] h-[16px]">
            </div>
            <div class="flex items-center gap-0 text-base text-gray-500">
              <span>{{ formatDate(checkinDate) }}</span>
            </div>
          </div>
        </div>

        <!-- 체크아웃 날짜 -->
        <div 
          class="flex-1 bg-white border border-gray-300 rounded px-6 py-4 cursor-pointer"
          @click="openCalendar('checkout')"
        >
          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">체크아웃</span>
              <img src="/images/icon/calendar.svg" alt="calendar" class="w-[16px] h-[16px]">
            </div>
            <div class="flex items-center gap-0 text-base text-gray-500">
              <span>{{ formatDate(checkoutDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 필터 섹션 -->
    <div class="bg-white px-2">
      <div class="flex justify-between items-center px-4 py-2">
        <div class="flex gap-4">
          <!-- 객실 필터 -->
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 flex items-center justify-center">
              <img src="~/assets/icons/hotel_room.svg" alt="room" class="w-[16px] h-[16px]">
            </div>
            <div class="flex items-center gap-1">
              <span class="text-sm text-black">객실</span>
              <span class="text-sm text-black">{{ roomCount }}</span>
            </div>
          </div>

          <!-- 구분선 -->
          <div class="w-px h-4 bg-gray-300"></div>

          <!-- 성인 필터 -->
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 flex items-center justify-center">
              <img src="~/assets/icons/hotel_human.svg" alt="human" class="w-[16px] h-[16px]">
            </div>
            <div class="flex items-center gap-1">
              <span class="text-sm text-black">성인</span>
              <span class="text-sm text-black">{{ adultCount }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-sm text-black">아동</span>
              <span class="text-sm text-black">{{ childrenCount }}</span>
            </div>
          </div>
        </div>

        <!-- 조건 변경 버튼 -->
        <button 
          class="flex items-center gap-2"
          @click="showFilterModal = true"
        >
          <span class="text-sm text-blue-500">조건 변경</span>
        </button>
      </div>
    </div>

    <!-- 날짜 선택 캘린더 모달 -->
    <div v-if="showCalendar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-4 m-4 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">날짜 선택</h3>
          <button class="text-gray-500" @click="showCalendar = false">
            <img src="~/assets/icons/close.svg" alt="close" class="w-[24px] h-[24px]">
          </button>
        </div>
        
        <div class="mb-4 flex justify-between text-sm">
          <div class="flex flex-col">
            <span class="text-gray-500">체크인</span>
            <span class="font-medium">{{ formatDate(dateRange.start) }}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-gray-500">체크아웃</span>
            <span class="font-medium">{{ formatDate(dateRange.end) }}</span>
          </div>
        </div>
        
        <client-only>
          <VCalendar
            style="width: 100%"
            trim-weeks
            :min-date="today"
            :max-date="maxBookingDate"
            :attributes="calendarAttributes"
            @dayclick="onDayClick"
          />
        </client-only>
        
        <div class="flex justify-end mt-4">
          <button 
            class="py-2 px-4 bg-blue-500 text-white rounded text-sm"
            @click="confirmDateRange"
          >
            확인
          </button>
        </div>
      </div>
    </div>

    <!--조회 버튼 -->
    <div class="flex justify-end mt-4 px-4 py-2 mb-4">
      <button 
        class="w-full h-12 bg-blue-500 text-white rounded text-sm"
        @click="fetchRoomPrice"
      >
        객실 조회
      </button>
    </div>

    <!-- 필터 모달 -->
    <div v-if="showFilterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 m-4 w-full max-w-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">조건 변경</h3>
          <button class="text-gray-500" @click="showFilterModal = false">
            <img src="~/assets/icons/close.svg" alt="close" class="w-[24px] h-[24px]">
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- 객실 수 조정 -->
          <div class="flex justify-between items-center">
            <span class="text-sm">객실</span>
            <div class="flex items-center gap-3">
              <button 
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                :disabled="roomCount <= 0"
                @click="decrementRoom" 
              >
                -
              </button>
              <span class="w-8 text-center">{{ roomCount }}</span>
              <button 
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                @click="incrementRoom"
              >
                +
              </button>
            </div>
          </div>

          <!-- 성인 수 조정 -->
          <div class="flex justify-between items-center">
            <span class="text-sm">성인</span>
            <div class="flex items-center gap-3">
              <button 
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                :disabled="adultCount <= 0"
                @click="decrementAdult" 
              >
                -
              </button>
              <span class="w-8 text-center">{{ adultCount }}</span>
              <button 
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                @click="incrementAdult"
              >
                +
              </button>
            </div>
          </div>

          <!-- 아동 수 조정-->
          <div class="flex justify-between items-center">
            <span class="text-sm">아동</span>
            <div class="flex items-center gap-3">
              <button 
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                :disabled="childrenCount <= 0"
                @click="decrementChildren" 
              >
                -
              </button>
              <span class="w-8 text-center">{{ childrenCount }}</span>
              <button 
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                @click="incrementChildren"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-2 mt-6">
          <button 
            class="flex-1 py-2 px-4 border border-gray-300 rounded text-sm"
            @click="showFilterModal = false"
          >
            취소
          </button>
          <button 
            class="flex-1 py-2 px-4 bg-blue-500 text-white rounded text-sm"
            @click="applyFilters"
          >
            적용
          </button>
        </div>
      </div>
    </div>

    <RoomList 
      v-if="queryRoom" 
      :hotel="hotel" 
      :bart_price="hotel.bart_price" 
      :nights="calculateNights(dateRange.start, dateRange.end)"
      @select-room="selectRoom" 
      @select-room-to-cart="popupRoomToCart" 
    /> 

    <div v-if="showCartConfirmPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pl-4 pr-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">{{ $t('common.addToCart') }}</h3>
        
        <p class="mb-6 text-sm">{{ $t('common.addToCartMessage') }}</p>
        <div class="flex justify-end gap-2">
          <button 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700" 
            @click="closeCartConfirmPopup"
          >
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="px-4 py-2 bg-primary text-white rounded-md" 
            @click="selectRoomToCart"
          >
            {{ $t('common.addToCart') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import 'v-calendar/style.css'
import RoomList from './RoomList.vue'
import { formatDate } from '~/utils/formatters'
import ToastMessage from '~/components/common/ToastMessage.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Room {
  room_name: string;
  room_name_en: string;
  room_sale_price: number;
  room_image_url: string;
  room_images: Array<{ image_url: string }>;
  bed_type: string;
  view_type: string;
  refund_yn: string;
  breakfast_yn: string;
}

interface Props {
  hotel: Hotel
}

const props = defineProps<Props>()

const selectRoomInfomation = ref(null)

// 반응형 데이터
const showFilterModal = ref(false)
const showCartConfirmPopup = ref(false)
const roomCount = ref(1) // 기본값 1로 설정
const adultCount = ref(2) // 기본값 2로 설정
const childrenCount = ref(0) // 기본값 0으로 설정

// 캘린더 모달 상태
const showCalendar = ref(false)
const calendarMode = ref('checkin') // 'checkin' 또는 'checkout'

// Toast 관련 상태
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 날짜 데이터
const today = new Date()
// 기본 체크인은 오늘로부터 +3일, 체크아웃은 그 다음날로 설정
const defaultCheckin = new Date(today)
defaultCheckin.setDate(defaultCheckin.getDate() + 3)
const defaultCheckout = new Date(defaultCheckin)
defaultCheckout.setDate(defaultCheckout.getDate() + 1)

// 날짜 범위 데이터
const dateRange = ref({ start: defaultCheckin, end: defaultCheckout })
const checkinDate = computed(() => dateRange.value.start)
const checkoutDate = computed(() => dateRange.value.end)

const queryRoom = ref(false)

// 최대 숙박 일수 제한
const MAX_NIGHTS = 30

const addDays = (d: Date, days: number) => {
  const nd = new Date(d)
  nd.setDate(nd.getDate() + days)
  return nd
}

// 공통 경고 토스트 노출
const showMaxNightsWarning = () => {
  showToast.value = true
  toastMessage.value = '최대 30일까지만 조회할 수 있습니다.'
  toastType.value = 'warning'
}

// 6개월 이내 예약 제한 경고 토스트
const showMaxMonthsWarning = () => {
  showToast.value = true
  toastMessage.value = '예약 기간은 최대 6개월 이내 입니다.'
  toastType.value = 'warning'
}

// 범위를 최대 30박으로 보정
const enforceMaxNights = (start: Date, end: Date): { end: Date; exceeded: boolean } => {
  const nights = calculateNights(start, end)
  if (nights > MAX_NIGHTS) {
    return { end: addDays(start, MAX_NIGHTS), exceeded: true }
  }
  return { end, exceeded: false }
}

// 최대 예약 가능 날짜 (오늘로부터 6개월)
const maxBookingDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + 6)
  return date
})

// 캘린더 속성 설정
const calendarAttributes = computed(() => [
  { 
    key: 'today',
    highlight: {
      color: 'blue',
      fillMode: 'light',
    },
    dates: new Date(),
  },
  { 
    key: 'range', 
    dates: { start: checkinDate.value, end: checkoutDate.value }, 
    highlight: { color: 'blue', fillMode: 'light' } 
  },
  { 
    key: 'checkin', 
    dates: checkinDate.value, 
    highlight: { color: 'blue', fillMode: 'solid' }, 
    popover: { label: '체크인' } 
  },
  { 
    key: 'checkout', 
    dates: checkoutDate.value, 
    highlight: { color: 'blue', fillMode: 'solid' }, 
    popover: { label: '체크아웃' } 
  }
])

// 캘린더 관련 메서드
const openCalendar = (mode: 'checkin' | 'checkout') => {
  calendarMode.value = mode
  showCalendar.value = true
}

// 날짜 클릭 이벤트 핸들러
const onDayClick = (day: { date: Date }) => {
  if (calendarMode.value === 'checkin') {
    // 체크인 날짜 선택 시
    const newStart = day.date
    const newEnd = checkoutDate.value
    
    // 체크인 날짜가 체크아웃 날짜보다 이후면 체크아웃 날짜를 체크인 다음날로 설정
    if (newStart >= newEnd) {
      const nextDay = new Date(newStart)
      nextDay.setDate(nextDay.getDate() + 1)
      const { end, exceeded } = enforceMaxNights(newStart, nextDay)
      dateRange.value = { start: newStart, end }
      if (exceeded) showMaxNightsWarning()
    } else {
      // 기존 체크아웃과의 차이가 30박을 초과하는지 확인
      const { end, exceeded } = enforceMaxNights(newStart, newEnd)
      dateRange.value = { start: newStart, end }
      if (exceeded) showMaxNightsWarning()
    }
    
    calendarMode.value = 'checkout' // 체크인 선택 후 체크아웃 모드로 전환
  } else {
    // 체크아웃 날짜 선택 시
    const newEnd = day.date
    const newStart = checkinDate.value
    
    // 체크아웃 날짜가 체크인 날짜보다 이전이면 무시
    if (newEnd <= newStart) return
    
    // 최대 30박 제한 적용
    const { end, exceeded } = enforceMaxNights(newStart, newEnd)
    dateRange.value = { start: newStart, end }
    if (exceeded) showMaxNightsWarning()

    calendarMode.value = 'checkin'
  }
}

const confirmDateRange = () => {
  showCalendar.value = false
  emitDateChange()
}

const emitDateChange = () => {
  emit('update:dates', { 
    checkinDate: dateRange.value.start, 
    checkoutDate: dateRange.value.end,
    roomCount: roomCount.value,
    adult: adultCount.value,
    children: childrenCount.value
  })
}

const fetchRoomPrice = async () => {
  queryRoom.value = true;
  if (!props.hotel?.hotel_idx || !dateRange.value.start || !dateRange.value.end) return;
  try {
    // 6개월 이후 예약 제한 확인 (체크아웃 기준)
    if (dateRange.value.end > maxBookingDate.value) {
      showMaxMonthsWarning()
      return
    }

    // 최대 30박 제한 확인
    const { exceeded } = enforceMaxNights(dateRange.value.start, dateRange.value.end)
    if (exceeded) {
      showMaxNightsWarning()
      return
    }

    // API 전송용 날짜 포맷터 (YYYY-MM-DD)
    const toYMD = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const params = {
      hotelIdx: props.hotel.hotel_idx,
      checkinDate: toYMD(dateRange.value.start),
      checkoutDate: toYMD(dateRange.value.end),
      roomCount: roomCount.value,
      adultCount: adultCount.value,
      childrenCount: childrenCount.value,
    };
    // 실제 API 호출 (GET or POST, 여기서는 GET 예시)
    type RoomFetchResponse = { success: boolean; data?: { rooms: Room[] } ; error?: string }
    const response = await $fetch<RoomFetchResponse>('/api/hotel/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: params
    });

    if (response.success && response.data) {
      // eslint-disable-next-line vue/no-mutating-props
      props.hotel.rooms = response.data.rooms;
    }
  } catch (error) {
    console.error('가격 정보 API 호출 오류:', error);
  }
};

// 객실 및 인원 관련 메서드
const incrementRoom = () => {
  roomCount.value++
}

const decrementRoom = () => {
  if (roomCount.value > 1) { // 최소 1개 객실 유지
    roomCount.value--
  }
}

const incrementAdult = () => {
  adultCount.value++
}

const decrementAdult = () => {
  if (adultCount.value > 1) { // 최소 1명 성인 유지
    adultCount.value--
  }
}

const incrementChildren = () => {
  childrenCount.value++
}

const decrementChildren = () => {
  if (childrenCount.value > 0) { // 최소 0명 아동 유지
    childrenCount.value--
  }
}

const applyFilters = () => {
  showFilterModal.value = false
  // 필터 적용 로직 추가
  // 이벤트 발생으로 부모 컴포넌트에 변경 알림
  emit('update:filters', { roomCount: roomCount.value, adultCount: adultCount.value })
}

// 이벤트 정의
const emit = defineEmits(['update:filters', 'update:dates', 'select-room', 'select-room-to-cart'])

// 객실 선택 처리
const selectRoom = (room: Room) => {

  // 로그인 상태 확인
  if (!checkLoginStatus()) {
    return;
  }
  
  emit('select-room', {
    room,
    checkinDate: dateRange.value.start,
    checkoutDate: dateRange.value.end,
    roomCount: roomCount.value,
    adult: adultCount.value,
    children: childrenCount.value,
    nights: calculateNights(dateRange.value.start, dateRange.value.end)
  })
}

const popupRoomToCart = (room: Room) => {
  showCartConfirmPopup.value = true;
  selectRoomInfomation.value = room;
}

// 로그인 상태 확인 메소드
const checkLoginStatus = () => {
  if (!loggedIn.value) {
    showToast.value = true;
    toastMessage.value = t('common.loginRequired');
    toastType.value = 'warning';
    return false;
  }
  return true;
};

// useUserSession 추가
const { loggedIn } = useUserSession();

const selectRoomToCart = async () => {
  showCartConfirmPopup.value = false;

  // 로그인 상태 확인
  if (!checkLoginStatus()) {
    return;
  }

  const finalPaymentAmount = selectRoomInfomation.value.room_sale_price * 
    roomCount.value * calculateNights(dateRange.value.start, dateRange.value.end);

  try{
    const reservationData = {
      room: selectRoomInfomation.value,
      hotelIdx: props.hotel.hotel_idx,
      checkinDate: dateRange.value.start,
      checkoutDate: dateRange.value.end,
      roomCount: roomCount.value,
      adult: adultCount.value,
      children: childrenCount.value,
      nights: calculateNights(dateRange.value.start, dateRange.value.end),
      finalPaymentAmount: finalPaymentAmount
    };

    // API 호출
    const response = await $fetch('/api/hotel/add-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservationData)
    });

    // 응답 처리
    if (!response.success) {
      throw new Error(response.message);
    }

    showToast.value = true;
    toastMessage.value = t('common.addToCartSuccess');
    toastType.value = 'success';

  } catch (error) {
    console.error('장바구니 추가 중 오류:', error);
    showToast.value = true;
    toastMessage.value = t('common.addToCartError');
    toastType.value = 'error';
  }
}

const closeCartConfirmPopup = () => {
  showCartConfirmPopup.value = false;
}

const moveToCart = () => {
  navigateTo('/shopping_cart')
}

// 숙박 일수 계산 함수
const calculateNights = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
</script>

<style scoped>
/* 추가적인 커스텀 스타일이 필요한 경우 여기에 작성 */
:deep(.vc-container) {
  --vc-accent-600: #3b82f6; /* Tailwind blue-500 */
  --vc-accent-500: #60a5fa; /* Tailwind blue-400 */
}

:deep(.vc-header) {
  padding: 10px 0;
}

:deep(.vc-weekday) {
  font-weight: 600;
  color: #4b5563; /* Tailwind gray-600 */
}

:deep(.vc-day) {
  height: 36px;
  padding: 2px;
}

:deep(.vc-day-content) {
  font-weight: 500;
}

:deep(.vc-highlights) {
  z-index: -1;
}
</style>