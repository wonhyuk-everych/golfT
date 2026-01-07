<template>
  <div class="bg-white mx-auto" @click="handleDocumentClick">
    <!-- 예약 확인 팝업 -->
    <div v-if="showConfirmPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pl-4 pr-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">예약 확인</h3>
        
        <!-- 가격 상세 내역 -->
        <div class="border-b pb-3 mb-3">
          <!-- 그린피 -->
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-700">그린피 ({{ formData.golferCount }}명)</span>
            <div class="text-right">
              <span class="text-sm font-medium">{{ formatPriceWithRate(handleGolfFee() * formData.golferCount, locale) }}</span>
            </div>
          </div>
          
          <!-- 카트피 -->
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-700">카트피 ({{ formData.golferCount }}대)</span>
            <div class="text-right">
              <span class="text-sm font-medium">{{ formatPriceWithRate(course.price?.cart_sale_fee * formData.golferCount, locale) }}</span>
            </div>
          </div>
          
          <!-- 캐디피 -->
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-700">캐디피 ({{ formData.golferCount }}명)</span>
            <div class="text-right">
              <span class="text-sm font-medium">{{ formatPriceWithRate(course.price?.caddy_sale_fee * formData.golferCount, locale) }}</span>
            </div>
          </div>
          
          <!-- 콜밴 가격 (선택한 경우만) -->
          <div v-if="formData.van.oneWay || formData.van.roundTrip" class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-700">콜밴 ({{ formData.van.carCount }}대)</span>
            <div class="text-right">
              <span class="text-sm font-medium">{{ formatPriceWithRate(handleVanFee(), locale) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 총 가격 -->
        <div class="flex justify-between items-center font-bold mb-4 border-b pb-3">
          <span>총 가격</span>
          <div class="text-right">
            <span>{{ formatPriceOriginal(totalPrice, locale) }}</span>
          </div>
        </div>
        
        <p class="mb-6 text-sm">예약을 진행하시겠습니까?</p>
        <div class="flex justify-end gap-2">
          <button 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700" 
            @click="closeConfirmPopup"
          >
            닫기
          </button>
          <button 
            class="px-4 py-2 bg-primary text-white rounded-md" 
            @click="handlePayment"
          >
            예약
          </button>
        </div>
      </div>
    </div>

    <div v-if="showCartConfirmPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pl-4 pr-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
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
            @click="submitToCart"
          >
            {{ $t('common.addToCart') }}
          </button>
        </div>
      </div>
    </div>

    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />

    <div v-if="reservationSuccess" class="flex flex-col gap-4 mt-4 reservation_information-section">
      <div class="bg-white rounded-lg p-8 w-full">
        <h3 class="text-lg font-bold mb-4">예약 확인</h3>
        
        <!-- 가격 상세 내역 -->
        <div class="border-b pb-3 mb-3">
          <!-- 그린피 -->
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-700">그린피 ({{ formData.golferCount }}명)</span>
            <div class="text-right">
              <span class="text-sm font-medium">{{ formatPriceWithRate(handleGolfFee() * formData.golferCount, locale) }}</span>
            </div>
          </div>
          
          <!-- 카트피 -->
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-700">카트피 ({{ formData.golferCount }}대)</span>
            <div class="text-right">
              <span class="text-sm font-medium">{{ formatPriceWithRate(course.price?.cart_sale_fee * formData.golferCount, locale) }}</span>
            </div>
          </div>
          
          <!-- 캐디피 -->
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-700">캐디피 ({{ formData.golferCount }}명)</span>
            <div class="text-right">
              <span class="text-sm font-medium">{{ formatPriceWithRate(course.price?.caddy_sale_fee * formData.golferCount, locale) }}</span>
            </div>
          </div>
          
          <!-- 콜밴 가격 (선택한 경우만) -->
          <div v-if="formData.van.oneWay || formData.van.roundTrip" class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-700">콜밴 ({{ formData.van.carCount }}대)</span>
            <div class="text-right">
              <span class="text-sm font-medium">{{ formatPriceWithRate(handleVanFee(), locale) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 총 가격 -->
        <div class="flex justify-between items-center font-bold mb-4 border-b pb-3">
          <span>총 가격</span>
          <div class="text-right">
            <span>{{ formatPriceWithRate(totalPrice, locale) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-4 mt-4 reservation_information-section">
      <!-- Header -->
      <div class="px-8">
        <h2 class="text-base font-bold text-gray-900">⛳ 예약 정보</h2>
      </div>

      <!-- Reservation Details -->
      <div class="flex flex-col gap-4">
        <!-- Date Selection -->
        <FormSection 
          icon="/images/icon/calendar.svg" 
          label="날짜를 선택해 주세요."
        >
          <div class="relative" @click.stop>
            <button 
              class="w-full border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm text-center select-box-container" 
              :class="{ 'error-border': validationErrors.date }"
              data-field="date"
              @click.stop="toggleCalendar"
              @change="removeErrorAnimation('date')"
            >
              {{ formatDate(formData.date, locale.value) }}
            </button>
            <div v-show="showCalendar" class="absolute z-50 mt-2 bg-white shadow-lg rounded-md w-full overflow-hidden">
              <client-only>
                <VCalendar
                  style="width: 100%"
                  trim-weeks
                  :min-date="new Date()"
                  :max-date="maxBookingDate"
                  :attributes="calendarAttributes"
                  @dayclick="onDayClick"
                />
              </client-only>
            </div>
          </div>
        </FormSection>

        <!-- Time Selection -->
        <FormSection 
          icon="/images/icon/clock.svg" 
          label="시간을 선택해 주세요."
        >
          <div class="flex gap-3">
            <Listbox v-model="formData.time">
              <div class="relative w-full">
                <ListboxButton class="flex-1 w-full border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm text-center appearance-none" :class="{ 'error-border': validationErrors.time }" data-field="time">
                  <span class="block truncate">
                    {{ formData.time.price_idx === 0 || formData.time.start_time === undefined ? '시간 선택' : formData.time.start_time.substring(0, 5) }}
                  </span>
                </ListboxButton>
                <ListboxOptions class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                  <ListboxOption v-for="time in course.price.price_time" :key="time.price_idx" :value="time" class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100 text-gray-900">
                    <span class="block truncate">{{ time.start_time.substring(0, 5) }} ~ {{ time.end_time.substring(0, 5) }}</span>
                  </ListboxOption>
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </FormSection>

        <!-- People Selection -->
        <FormSection 
          icon="/images/icon/member.svg" 
          :label="'인원을 선택해 주세요. (최소 ' + minimumPerson + '명)'" 
        >
          <div class="flex gap-3">
            <Listbox v-model="formData.golferCount">
              <div class="relative w-full">
                <ListboxButton class="flex-1 w-full border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm text-center appearance-none" :class="{ 'error-border': validationErrors.golferCount }" data-field="golferCount">
                  <span class="block truncate">
                    {{ formData.golferCount === 0 ? '인원 선택' : formData.golferCount + '명' }}
                  </span>
                </ListboxButton>
                <ListboxOptions class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                  <ListboxOption v-for="count in 6" :key="'golfer-'+count" :value="count" class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100 text-gray-900">
                    <span class="block truncate">{{ count }}명</span>
                  </ListboxOption>
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </FormSection>
      </div>

      <Divider :offset-px="0" />

      <!-- Required Items Notice -->
      <div class="flex flex-col gap-2">
        <div class="flex justify-center px-8 py-1">
          <span class="text-xs text-red-500">* 아래는 필수 항목 입니다. (최소 단위 변경 불가)</span>
        </div>

        <!-- Required Services -->
        <div class="flex flex-col gap-2">
          <!-- Cart Service -->
          <div class="flex flex-col px-8 py-2">
            <div class="flex items-center gap-2 w-full">
              <div class="w-5 h-5 text-cyan-500">
                <img src="/images/icon/cart.svg" alt="cart" />
              </div>
              <span class="text-sm text-cyan-500 flex-1">카트 (1인 1카트)</span>
              <div class="flex items-center gap-1 text-sm text-gray-600">
                <div class="flex items-center gap-0.5">
                  <span>{{ formatPriceWithRate(course.price?.cart_sale_fee, locale) }}</span>
                </div>
                <span>X</span>
                <span>1대</span>
              </div>
            </div>
          </div>

          <!-- Caddy Service -->
          <div class="flex flex-col px-8 py-2">
            <div class="flex items-center gap-2 w-full">
              <div class="w-5 h-5 text-cyan-500">
                <img src="/images/icon/caddy.svg" alt="caddy" />
              </div>
              <span class="text-sm text-cyan-500 flex-1">캐디 (1인 1캐디)</span>
              <div class="flex items-center gap-1 text-sm text-gray-600">
                <div class="flex items-center gap-0.5">
                  <span>{{ formatPriceWithRate(course.price?.caddy_sale_fee, locale) }}</span>
                </div>
                <span>X</span>
                <span>1명</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider :offset-px="0" />

      <!-- Van Service -->
      <FormSection 
        icon="/images/icon/callban.svg" 
        label="콜밴"
      >
        <div class="flex gap-3">
          <button
            :class="[
              'flex-1 border rounded-md px-2 py-3 text-sm text-center transition-colors',
              formData.van.oneWay 
                ? 'border-cyan-500 bg-cyan-50 text-cyan-700' 
                : 'border-gray-300 text-gray-500'
            ]"
            @click="handleVanSelection('oneWay')"
          >
            편도
          </button>
          <button
            :class="[
              'flex-1 border rounded-md px-2 py-3 text-sm text-center transition-colors',
              formData.van.roundTrip 
                ? 'border-cyan-500 bg-cyan-50 text-cyan-700' 
                : 'border-gray-300 text-gray-500'
            ]"
            @click="handleVanSelection('roundTrip')"
          >
            왕복
          </button>
        </div>
        
        <CallvanReservation 
          v-if="formData.van.oneWay || formData.van.roundTrip" 
          :is-round-trip="formData.van.roundTrip"
          :van="formData.van" 
          :course-idx="course.id"
          :validation-errors="validationErrors.van"
          @update:van-data="handleVanDataUpdate"
          @remove-error="removeVanErrorAnimation"
        />
      </FormSection>

      <Divider :offset-px="0" />

      <div class="flex flex-col gap-4 reservation_price-section">
        <!-- Total Price -->
        <div class="flex flex-col gap-2 px-8">
          <h2 class="text-text-primary text-base font-bold">⛳ 상품 가격</h2>
          <!-- Golf Course Info -->
          <div class="flex flex-col gap-2">
            <div class="flex flex-col gap-1">
              <h2 class="text-sm text-gray-900 font-bold">
                {{ course.name_kr }}
              </h2>
              <p class="text-sm text-gray-900 font-bold">
                {{ formatDate(selectedDate, locale.value) }} / 티오프 {{ selectedTime.start_time === undefined ? '' : selectedTime.start_time.substring(0, 5) }}
              </p>
            </div>
          </div>
          
          <!-- Price Items -->
          <div class="flex flex-col gap-2 mt-4">
            <!-- Green Fee -->
            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center gap-1">
                <span class="text-sm font-bold text-cyan-600">
                  그린피
                </span>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1">
                    <span class="text-sm font-bold text-cyan-600">
                      {{ formatPriceWithRate(handleGolfFee(), locale) }}
                    </span>
                  </div>
                  <span class="text-sm font-normal text-gray-500">
                    X
                  </span>
                  <span class="text-sm font-normal text-gray-500">
                    {{ formData.golferCount }}명
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Cart Fee -->
            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center gap-1">
                <span class="text-sm font-bold text-cyan-600">
                  카트피
                </span>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1">
                    <span class="text-sm font-bold text-cyan-600">
                      {{ formatPriceWithRate(course.price?.cart_sale_fee, locale) }}
                    </span>
                  </div>
                  <span class="text-sm font-normal text-gray-500">
                    X
                  </span>
                  <span class="text-sm font-normal text-gray-500">
                    {{ formData.golferCount }}대
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Caddy Fee -->
            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center gap-1">
                <span class="text-sm font-bold text-cyan-600">
                  캐디피
                </span>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1">
                    <span class="text-sm font-bold text-cyan-600">
                      {{ formatPriceWithRate(course.price?.caddy_sale_fee, locale) }}
                    </span>
                  </div>
                  <span class="text-sm font-normal text-gray-500">
                    X
                  </span>
                  <span class="text-sm font-normal text-gray-500">
                    {{ formData.golferCount }}명
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Van Fee (if selected) -->
          <div v-if="formData.van.oneWay || formData.van.roundTrip" class="flex flex-col gap-1">

            <div class="flex justify-between items-center gap-1">
              <span class="text-sm font-bold text-cyan-600">
                콜밴 <span v-if="formData.van.carType">({{ formData.van.carType }})</span>
              </span>
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <span class="text-sm font-bold text-cyan-600">
                    {{ formatPriceWithRate(handleVanFee(), locale) }}
                  </span>
                </div>
                <span class="text-sm font-normal text-gray-500">
                 X
                </span>
                <span class="text-sm font-normal text-gray-500">
                  {{ formData.van.carCount }}대
                </span>
              </div>
            </div>
          </div>
          
          <!-- Total -->
          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center gap-1">
              <span class="text-sm font-bold text-gray-900">
                합계
              </span>
              <div class="flex items-center gap-1">
                <span class="text-sm font-bold text-gray-900">
                  {{ formatPriceOriginal(totalPrice, locale) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted, defineExpose } from 'vue';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import FormSection from './FormSection.vue';
import Divider from '~/components/common/Divider.vue';
import CallvanReservation from './CallvanReservation.vue';
import { isValidDate, formatDate } from '~/utils/formatters';
import 'v-calendar/dist/style.css';
import ToastMessage from '~/components/common/ToastMessage.vue';
import { useI18n } from 'vue-i18n'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { formatPriceWithRate, calculatePriceWithRate, formatPriceOriginal } = useExchangeRate()

const { t, locale } = useI18n()

// 유효성 검사 상태
const validationErrors = ref({
  date: false,
  time: false,
  van: {
    carCount: false,
    pickupDate: false,
    pickupTime: false,
    returnDate: false,
    returnTime: false,
    pickupLocation: false,
    dropoffLocation: false,
    carType: false
  },
  golferCount: false
});

// Form data state
const formData = ref({
  date: new Date(),
  time: 0,
  golferCount: 0,
  van: {
    oneWay: false,
    roundTrip: false,
    carCount: 0,
    vanFeePerCar: 40524,
    pickupDate: new Date(),
    pickupTime: 0,
    returnDate: new Date(),
    returnTime: 0,
    pickupLocation: '',
    dropoffLocation: '',
    carType: 0
  }
});

// 예약 상태 관리
const showConfirmPopup = ref(false);
const showCartConfirmPopup = ref(false);
const reservationSuccess = ref(false);

// 가격 정보 API 호출 함수
const fetchCoursePrice = async () => {
  if (!props.course?.id || !formData.value.date) return;
  try {
    // 6개월 이후 예약 제한 확인
    if (formData.value.date > maxBookingDate.value) {
      showMaxMonthsWarning()
      return
    }

    const params = {
      courseId: props.course.id,
      date: selectedDateByFormat.value
    };
    const response = await $fetch('/api/golf-course/price', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    if (response && response.price !== undefined) {
      emit('update:price', response.price);
      minimumPerson.value = response.price.minimum_person;
    } else {
      showToast.value = true;
      toastMessage.value = t('golf.reservation.error.notFoundReservation');
      toastType.value = 'warning';

      emit('update:price', null);
      minimumPerson.value = 0;
    }
  } catch (error) {
    console.error('가격 정보 API 호출 오류:', error);
    showToast.value = true;
    toastMessage.value = t('common.error');
    toastType.value = 'error';
  }
};

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 6개월 이내 예약 제한 경고 토스트
const showMaxMonthsWarning = () => {
  showToast.value = true
  toastMessage.value = '예약 기간은 최대 6개월 이내 입니다.'
  toastType.value = 'warning'
}

interface Course {
  total_fee: number
  weekday_green_sale_fee: number
  weekend_green_sale_fee: number
  caddy_sale_fee: number
  cart_sale_fee: number
  bart_price: number
  van_fee_per_car: number
}

interface Props {
  course: Course
}

const minimumPerson = ref(1);

const props = defineProps<Props>()

// Calendar state
const showCalendar = ref(false);

// Selected date and time for display
const selectedDate = computed(() => formData.value.date);
const selectedTime = computed(() => formData.value.time);

// 최대 예약 가능 날짜 (오늘로부터 6개월)
const maxBookingDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + 6)
  return date
})

const selectedDateByFormat = computed(() => {
  return formData.value.date instanceof Date 
      ? `${formData.value.date.getFullYear()}-${String(formData.value.date.getMonth() + 1).padStart(2, '0')}-${String(formData.value.date.getDate()).padStart(2, '0')}`
      : formData.value.date;
});

// Calculate total price
const totalPrice = computed(() => {
  if (formData.value.golferCount <= 0) return 0;
  
  // Base fees
  const greenFee = handleGolfFee() * formData.value.golferCount;
  const cartFee = props.course.price.cart_sale_fee * formData.value.golferCount;
  const caddyFee = props.course.price.caddy_sale_fee * formData.value.golferCount;
  
  let vanFee = 0
  if(formData.value.van.carCount > 0){
    vanFee = handleVanFee() * formData.value.van.carCount;
  }
  
  // Total including van fee if selected
  return calculatePriceWithRate(greenFee + cartFee + caddyFee + vanFee);  
});

// Calendar attributes for highlighting dates
const calendarAttributes = computed(() => [
  {
    key: 'today',
    highlight: {
      color: 'cyan',
      fillMode: 'light',
    },
    dates: new Date(),
  },
]);

// Event handlers
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
};

const onDayClick = (day: { date: Date }) => {
  formData.value.date = day.date;
  formData.value.time = 0;
  showCalendar.value = false;
  fetchCoursePrice();
};

// Format time string to HH:MM format
const formatTimeString = (hour: number, minute: number): string => {
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');
  return `${formattedHour}:${formattedMinute}`;
};

// People selection is now handled directly by the select dropdown

const handleVanSelection = (type: 'oneWay' | 'roundTrip') => {
  if (type === 'oneWay') {
    formData.value.van.oneWay = !formData.value.van.oneWay;
    formData.value.van.roundTrip = false;
  } else if (type === 'roundTrip') {
    formData.value.van.roundTrip = !formData.value.van.roundTrip;
    formData.value.van.oneWay = false;
  }
};

const handleVanFee = () => {
  if (formData.value.van.oneWay) {
    if(formData.value.van.carType === 'VAN'){
      return props.course.price.call_van_one_way_fee
    }
    if(formData.value.van.carType === 'SUV'){
      return props.course.price.call_suv_one_way_fee
    }
    return 0
  }

  if (formData.value.van.roundTrip) {
    if(formData.value.van.carType === 'VAN'){
      return props.course.price.call_van_round_trip_fee
    }
    if(formData.value.van.carType === 'SUV'){
      return props.course.price.call_suv_round_trip_fee
    }
    return 0
  }
}

const handleGolfFee = () => {
  if(selectedTime.value.price_idx === 0){
    return 0
  }
  return selectedTime.value.price
}

// Document click handler to close calendar when clicking outside
const handleDocumentClick = (event: Event) => {
  const target = event.target as HTMLElement;
  const isCalendarClick = target.closest('.vc-container') || 
                         target.closest('.vc-day') || 
                         target.closest('.vc-weeks');
  
  if (showCalendar.value && !isCalendarClick) {
    const isSelectBoxClick = target.closest('.select-box-container');
    
    if (!isSelectBoxClick) {
      showCalendar.value = false;
    }
  }
};

// We'll use the Escape key to close the calendar too
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showCalendar.value) {
    showCalendar.value = false;
  }
};

// 유효성 검사 함수
const validateForm = () => {
  // 초기화
  validationErrors.value = {
    date: false,
    time: false,
    golferCount: false,
    van: {
      carCount: false,
      pickupDate: false,
      pickupTime: false,
      returnDate: false,
      returnTime: false,
      pickupLocation: false,
      dropoffLocation: false,
      carType: false
    },
  };
  
  let isValid = true;
  let firstErrorField = null;
  
  // 날짜 검사 (과거 날짜인지 확인)
  // 유틸리티 함수를 사용하여 날짜 유효성 검사
  if (!isValidDate(formData.value.date)) {
    validationErrors.value.date = true;
    isValid = false;
    firstErrorField = 'date';
  }
  
  // 시간 검사
  if (formData.value.time === 0 || formData.value.time === '0') {
    validationErrors.value.time = true;
    isValid = false;
    if (!firstErrorField) firstErrorField = 'time';
  }
  
  // 인원 검사
  if (formData.value.golferCount < minimumPerson.value) {
    validationErrors.value.golferCount = true;
    isValid = false;
    if (!firstErrorField) firstErrorField = 'golferCount';
  }

  //밴 유효성 체크
  if (formData.value.van.oneWay || formData.value.van.roundTrip) {

    //차량 타입 체크
    if(formData.value.van.carType === 0 || formData.value.van.carType === '0'){
      validationErrors.value.van.carType = true;
      isValid = false;
      if (!firstErrorField) firstErrorField = 'van.carType';
    }
    /*
    //출발 날짜 체크
    if(!isValidDate(formData.value.van.pickupDate)){
      validationErrors.value.van.pickupDate = true;
      isValid = false;
      if (!firstErrorField) firstErrorField = 'van.pickupDate';
    }

    //출발 시간 체크
    if(formData.value.van.pickupTime === 0 || formData.value.van.pickupTime === '0'){
      validationErrors.value.van.pickupTime = true;
      isValid = false;
      if (!firstErrorField) firstErrorField = 'van.pickupTime';
    }  
    */

    //출발지 체크
    if(formData.value.van.pickupLocation === ''){
      validationErrors.value.van.pickupLocation = true;
      isValid = false;
      if (!firstErrorField) firstErrorField = 'van.pickupLocation';
    }

    //차량 수 체크
    if(formData.value.van.carCount === 0){
      validationErrors.value.van.carCount = true;
      isValid = false;
      if (!firstErrorField) firstErrorField = 'van.carCount';
    }

    if(formData.value.van.roundTrip){
      /*
      //도착 날짜 체크
      if(!isValidDate(formData.value.van.returnDate)){
        validationErrors.value.van.returnDate = true;
        isValid = false;
        if (!firstErrorField) firstErrorField = 'van.returnDate';
      }

      //도착 시간 체크
      if(formData.value.van.returnTime === 0 || formData.value.van.returnTime === '0'){
        validationErrors.value.van.returnTime = true;
        isValid = false;
        if (!firstErrorField) firstErrorField = 'van.returnTime';
      }  
      */
      //도착지 체크
      if(formData.value.van.dropoffLocation === ''){
        validationErrors.value.van.dropoffLocation = true;
        isValid = false;
        if (!firstErrorField) firstErrorField = 'van.dropoffLocation';
      }
    }
  }

  // 유효성 검사 실패 시 해당 필드로 스크롤
  if (!isValid && firstErrorField) {
    const element = document.querySelector(`[data-field="${firstErrorField}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 애니메이션 효과 추가
      showErrorAnimation(firstErrorField);
    }
  }

  return isValid;
};

// 에러 애니메이션 표시
const showErrorAnimation = (fieldName: string) => {
  const element = document.querySelector(`[data-field="${fieldName}"]`);
  if (element) {
    // 에러 클래스 추가
    element.classList.add('error-animation');
  }
};

// 에러 애니메이션 제거
const removeErrorAnimation = (fieldName: string) => {
  validationErrors.value[fieldName] = false;
};

// 밴 관련 에러 애니메이션 제거
const removeVanErrorAnimation = (fieldName: string) => {
  validationErrors.value.van[fieldName] = false;
};

// 예약 제출 함수
const submitReservation = () => {

  // 로그인 상태 확인
  if (!checkLoginStatus()) {
    return;
  }

  // 유효성 검사
  if (!validateForm()) {
    return;
  }
  
  // 예약 확인 팝업 표시
  showConfirmPopup.value = true;
};

const popupCartConfirm = () => {
  showCartConfirmPopup.value = true;
}

// 장바구니 제출 함수
const submitToCart = () => {

  // 로그인 상태 확인
  if (!checkLoginStatus()) {
    return;
  }

  // 유효성 검사
  if (!validateForm()) {
    showCartConfirmPopup.value = false;
    return;
  }

  // API 호출
  addToCart();
}

// 예약 확인 팝업 닫기
const closeConfirmPopup = () => {
  showConfirmPopup.value = false;
};

// 장바구니 확인 팝업 닫기
const closeCartConfirmPopup = () => {
  showCartConfirmPopup.value = false;
};

// useUserSession 추가
const { loggedIn } = useUserSession();

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

// 장바구니 추가 후 API 호출
const addToCart = async () => {
  showCartConfirmPopup.value = false;
  
  try {
    const reservationData = {
      courseId: props.course.id,
      courseName: props.course.name_kr,
      date: selectedDateByFormat.value,
      time: formData.value.time.start_time,
      golferCount: formData.value.golferCount,
      monthlyPriceIdx: props.course.price.golf_monthly_price_idx,
      timePriceIdx: selectedTime.value.price_idx,
      priceType: props.course.price.price_type,
      vanReservation: {
        carCount: formData.value.van.carCount,
        pickupLocation: formData.value.van.pickupLocation,
        dropoffLocation: formData.value.van.dropoffLocation,
        carType: formData.value.van.carType,
        numberOfCallVan: formData.value.van.carCount,
        roundTripYn: formData.value.van.roundTrip ? 'Y' : 'N'
      }
    };

    // API 호출
    const response = await $fetch('/api/golf-course/add-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservationData)
    });
    
    // 응답 처리
    if (!response.success) {
      throw new Error(response.error);
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
};

const moveToCart = () => {
  navigateTo('/shopping_cart');
}

const handleVanDataUpdate = (vanData) => {
  // formData.van에 받은 데이터 업데이트
  formData.value.van.pickupDate = vanData.pickupDate;
  formData.value.van.pickupTime = vanData.pickupTime;
  formData.value.van.returnDate = vanData.returnDate;
  formData.value.van.returnTime = vanData.returnTime;
  formData.value.van.pickupLocation = vanData.pickupLocation;
  formData.value.van.dropoffLocation = vanData.dropoffLocation;
  formData.value.van.carType = vanData.carType;
  formData.value.van.carCount = vanData.carCount;
};

onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
  fetchCoursePrice();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey);
});

// 외부에서 접근 가능한 함수와 상태 노출
defineExpose({
  submitReservation,
  popupCartConfirm,
  reservationSuccess
});

const emit = defineEmits(['reservation-complete', 'update:price']);
const router = useRouter()

const handlePayment = () => {

  // sessionStorage 초기화
  sessionStorage.setItem('hotelReservation', '');
  sessionStorage.setItem('golfReservation', '');
  sessionStorage.setItem('callvanReservation', '');
  sessionStorage.setItem('caddyReservation', '');
  sessionStorage.setItem('tournamentReservation', '');

  // 골프 예약 정보 객체 구성
  const golf = {
    courseIdx: props.course?.id,
    nameKr: props.course?.name_kr,
    nameEn: props.course?.name_en,
    imageUrl: props.course?.main_image_url,
    reservationDate: selectedDateByFormat.value,
    golfCourseTime: formData.value.time.start_time,
    numberOfReservation: formData.value.golferCount,
    monthlyPriceIdx: props.course.price.golf_monthly_price_idx,
    timePriceIdx: selectedTime.value.price_idx,
    priceType: props.course.price.price_type,
    golfCourseSaleFee: handleGolfFee(),
    cartSaleFee: props.course.price.cart_sale_fee,
    caddySaleFee: props.course.price.caddy_sale_fee,
    callVanSaleFee: handleVanFee(),
    shoppingCartGolfIdx: 0,
    finalPaymentAmount: totalPrice.value,
    carType: formData.value.van.carType,
    pickupLocation: formData.value.van.pickupLocation,
    dropoffLocation: formData.value.van.dropoffLocation,
    roundTripYn: formData.value.van.roundTrip ? 'Y' : 'N',
    numberOfCallVan: formData.value.van.carCount
  }

  const callvan = {
    callvanIdx: 0,
    courseIdx: props.course?.id,
    carType: formData.value.van.carType,
    roundTripYn: formData.value.van.roundTrip ? 'Y' : 'N',
    startDate: selectedDateByFormat.value,
    endDate: formData.value.van.returnDate,
    startTime: formData.value.van.pickupTime,
    endTime: formData.value.van.returnTime,
    pickupLocation: formData.value.van.pickupLocation,
    dropoffLocation: formData.value.van.dropoffLocation,
    numberOfReservation: formData.value.golferCount,
    numberOfCallVan: formData.value.van.carCount,
    shoppingCartCallvanIdx: 0,
    finalPaymentAmount: handleVanFee()
  }

  const golfReservation = [golf];
  sessionStorage.setItem('golfReservation', JSON.stringify(golfReservation));

  /**
  if(formData.value.van.carCount > 0){
    const callvanReservation = [callvan];
    sessionStorage.setItem('callvanReservation', JSON.stringify(callvanReservation));
  }
  */

  // params/query 없이 결제 페이지로 이동
  router.push({
    name: 'payment'
  });
}

</script>

<style>
.calendar-enter-active, .calendar-leave-active {
  transition: opacity 0.3s;
}
.calendar-enter-from, .calendar-leave-to {
  opacity: 0;
}

/* 유효성 검사 에러 애니메이션 */
.error-border {
  border: 2px solid #ff3b30 !important;
}

.error-animation {
  animation: shake 0.5s, pulse-border 3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes pulse-border {
  0%, 100% { border-color: #ff3b30; }
  50% { border-color: #ff8c85; }
}
</style>