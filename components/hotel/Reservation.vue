<template>
  <div class="reservation-container p-4">

    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />
    
    <!-- 환불 불가 알림 (조건부 표시) -->
    <div v-if="selectedRoom && selectedRoom.refund_yn === 'N'" class="bg-red-50 text-red-600 p-3 rounded-md mb-4">
      <p class="font-medium">환불 불가 상품</p>
      <p class="text-sm">이 객실은 예약 후 환불이 불가능합니다.</p>
    </div>

    <!-- 호텔 정보 -->
    <div class="hotel-info mb-6">
      <h2 class="text-xl font-bold">{{ hotel?.name_kr }}</h2>
      <p class="text-gray-600">{{ hotel?.name_en }}</p>
    </div>

    <!-- 체크인/체크아웃 정보 -->
    <div class="check-dates bg-gray-50 p-4 rounded-md mb-4">
      <div class="flex justify-between mb-2">
        <div>
          <p class="text-gray-500 text-sm">체크인</p>
          <p class="font-medium">{{ formatDate(checkInDate, locale.value) }}</p>
        </div>
        <div class="border-l border-gray-300 mx-4"></div>
        <div>
          <p class="text-gray-500 text-sm">체크아웃</p>
          <p class="font-medium">{{ formatDate(checkOutDate, locale.value) }}</p>
        </div>
      </div>
      <p class="text-sm text-gray-600">{{ calculateNights() }}박</p>
    </div>

    <!-- 객실 정보 -->
    <div class="room-info p-4 mb-4 flex flex-col gap-6 px-4">
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">객실 정보</span>
        <span class="text-text-secondary text-sm">{{ selectedRoom.room_name }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">객실수</span>
        <span class="text-text-secondary text-sm">{{ roomCount }}개</span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">인원</span>
        <span class="text-text-secondary text-sm">성인 {{ adult }}명</span>
        <span v-if="children > 0" class="text-text-secondary text-sm">아이 {{ children }}명</span>
        <span class="text-red-500 text-sm">* 예약 인원과 실제 투숙 인원이 다를 경우,<br>
          체크인이 불가하거나 추가 요금이 발생할 수 있습니다.</span>
      </div>
    </div>

    <Divider :offset-px="0"/>

    <!-- 추가 유료 옵션 -->
    <div v-if="paidServices.length > 0" class="additional-info mb-6 p-4">
      <div class="flex flex-col gap-2 mb-2 font-bold">
        <span>추가 유료옵션</span>
      </div>
      <div class="flex flex-col gap-2">
        <label v-for="service in paidServices" :key="service.hotel_paid_service_idx" class="flex items-center gap-2">
          <input
            v-model="selectedPaidServices"
            type="checkbox"
            :value="service.hotel_paid_service_idx"
          >
          <span>
            {{ service.service_name }} ({{ formatPriceWithRate(service.price, locale) }})
          </span>
        </label>
      </div>
    </div>

    <Divider :offset-px="0"/>

    <!-- 할인 및 결제 정보 -->
    <div class="flex flex-col gap-2 mb-6 p-4">
      <div class="flex flex-col gap-2 mb-2 font-bold">
        <span>할인 및 결제 정보</span>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-between items-center">
          <span class="text-text-secondary text-sm">총 객실 금액 ({{ roomCount }}개 x {{ calculateNights() }}박)</span>
          <span class="text-text-secondary text-sm">{{ formatPriceWithRate(totalRoomPrice, locale) }}</span>
        </div>
        <div v-if="selectedPaidServices.length > 0" class="flex flex-row justify-between items-center">
          <span class="text-text-secondary text-sm">추가 유료 옵션 ({{ selectedPaidServices.length }}개)</span>
          <span class="text-text-secondary text-sm">{{ formatPriceWithRate(selectedPaidServicesTotal, locale) }}</span>
        </div>
        <div v-if="discountAmount > 0" class="flex flex-row justify-between items-center">
          <span class="text-text-secondary text-sm">할인 금액</span>
          <span class="text-text-secondary text-sm">{{ formatPriceWithRate(discountAmount, locale) }}</span>
        </div>
      </div>
    </div>

    <Divider :offset-px="0"/>

    <div class="flex flex-col pb-6">
      <div class="flex flex-row justify-between items-center mb-2">
        <span class="font-bold text-xl text-text-primary">결제 금액</span>
        <span class="font-bold text-xl text-primary">{{ formatPriceWithRate(finalPaymentAmount, locale) }}</span>
      </div>
    </div>

    <Divider :offset-px="0"/>

    <div class="p-4 flex gap-2">
      <button
        class="w-4/12 px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
        @click="handleAddCart"
      >
        장바구니
      </button>
      <button
        class="w-8/12 px-4 py-2 bg-primary text-white rounded-md"
        @click="handlePayment"
      >
        결제하기
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { formatDate } from '~/utils/formatters';
import ToastMessage from '~/components/common/ToastMessage.vue'
import { useRouter } from 'vue-router'
import Divider from '~/components/common/Divider.vue'
import { useExchangeRate } from '~/composables/useExchangeRate'
import moment from "moment-timezone";

const { formatPriceWithRate, calculatePriceWithRate } = useExchangeRate()

// Toast 관련 상태
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const { locale } = useI18n()

interface HotelRoom {
  room_name: string;
  room_name_en: string;
  room_sale_price: number;
  room_image_url: string;
  bed_type: string;
  view_type: string;
  refund_yn: string;
  breakfast_yn: string;
  room_images: string[];
}

interface HotelInfo {
  hotel_idx: number;
  name_kr: string;
  name_en: string;
  check_in: string;
  check_out: string;
  // ... other hotel properties
}

interface HotelPaidService {
  hotel_paid_service_idx: number;
  service_name: string;
  service_name_en: string;
  price: number;
}

const selectedPaidServices = ref<number[]>([]);

const props = defineProps<{
  hotel: HotelInfo | null;
  checkInDate: Date;
  checkOutDate: Date;
  selectedRoom: HotelRoom | null;
  adult: number;
  children: number;
  roomCount: number;
  paidServices: HotelPaidService[];
}>()

// Define emits
const emit = defineEmits(['back'])

const totalRoomPrice = computed(() => {
  if (!props.selectedRoom || !props.roomCount) return 0;
  const price = Number(props.selectedRoom.room_sale_price);
  return price * props.roomCount;
});

const discountAmount = ref(0); // Placeholder for actual discount logic

const selectedPaidServicesTotal = computed(() => {
  if (!props.paidServices) return 0;
  return selectedPaidServices.value.reduce((sum: number, idx: number) => {
    const found = props.paidServices.find((s: HotelPaidService) => s.hotel_paid_service_idx === idx);
    return sum + (found ? found.price : 0);
  }, 0);
});

const finalPaymentAmount = computed(() => {
  return totalRoomPrice.value + selectedPaidServicesTotal.value - discountAmount.value;
});

const router = useRouter()

const checkinDate = moment(props.checkInDate).format("YYYY-MM-DD");
const checkoutDate = moment(props.checkOutDate).format("YYYY-MM-DD");

const handleAddCart = async () => {
  const hotel = {
    hotelIdx: props.hotel?.hotel_idx,
    checkinDate,
    checkoutDate,
    roomCount: props.roomCount,
    adult: props.adult,
    children: props.children,
    nights: calculateNights(),
    room: props.selectedRoom,
    shoppingCartHotelIdx: 0,
    finalPaymentAmount: calculatePriceWithRate(finalPaymentAmount.value),
    paidServices: selectedPaidServices.value.join(','),
    // 필요한 추가 정보 포함
  };
  
  try {
    const response = await $fetch('/api/hotel/add-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hotel),
    });

    if (response.success) {
      showToast.value = true;
      toastMessage.value = '장바구니에 추가되었습니다.';
      toastType.value = 'success';
    } else {
      showToast.value = true;
      toastMessage.value = response.message || '장바구니 추가 실패';
      toastType.value = 'error';
    }
  } catch (error) {
    showToast.value = true;
    toastMessage.value = '장바구니 추가 중 오류가 발생했습니다.';
    console.error(error);
  }
};

const handlePayment = () => {
  // sessionStorage 초기화
  sessionStorage.setItem('hotelReservation', '');
  sessionStorage.setItem('golfReservation', '');
  sessionStorage.setItem('callvanReservation', '');
  sessionStorage.setItem('caddyReservation', '');
  sessionStorage.setItem('tournamentReservation', '');

  const paidServiceIdxText = selectedPaidServices.value.join(',');


  // 호텔 예약 정보 객체 구성
  const hotel = {
    hotelIdx: props.hotel?.hotel_idx,
    hotelNameKr: props.hotel?.name_kr,
    hotelNameEn: props.hotel?.name_en,
    hotelImageUrl: props.hotel?.image,
    checkInDate: props.checkInDate,
    checkOutDate: props.checkOutDate,
    roomIdx: props.selectedRoom?.hotel_room_idx,
    roomName: props.selectedRoom?.room_name,
    roomBedType: props.selectedRoom?.bed_type,
    roomSalePrice: props.selectedRoom?.room_sale_price,
    roomCount: props.roomCount,
    adult: props.adult,
    children: props.children,
    shoppingCartHotelIdx: 0,
    finalPaymentAmount: calculatePriceWithRate(finalPaymentAmount.value),
    paidServices: paidServiceIdxText,
    // 필요한 추가 정보 포함
  }

  const hotelReservation = [hotel];

  // sessionStorage에 저장
  sessionStorage.setItem('hotelReservation', JSON.stringify(hotelReservation));

  // params/query 없이 결제 페이지로 이동
  router.push({
    name: 'payment'
  });
};

// Calculate number of nights
const calculateNights = () => {
  if (!props.checkInDate || !props.checkOutDate) return 0
  
  const checkIn = new Date(props.checkInDate)
  const checkOut = new Date(props.checkOutDate)
  
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// Function to go back to room selection
const goBack = () => {
  emit('back')
}
</script>

<style scoped>
.reservation-container {
  background-color: white;
}
</style>