<template>
  <div class="callben-reservation bg-white p-4 border border-gray-200 rounded-md mt-2">
    <div class="mb-4">
      <h3 class="text-sm font-medium text-gray-700 mb-2">
        {{ isRoundTrip ? '콜밴 왕복 예약' : '콜밴 편도 예약' }}
      </h3>
    </div>

    <!-- Vehicle Type Selection -->
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-cyan-500">차량을 선택해 주세요.</span>
      </div>
      <div class="flex gap-3">
        <Listbox v-model="carType">
          <div class="relative w-full">
            <ListboxButton class="flex-1 w-full border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm text-center appearance-none" :class="{ 'error-border': props.validationErrors?.carType }" data-field="van.carType">
              <span class="block truncate">
                {{ carType === 0 ? '차량 선택' : carType === 'SUV' ? 'SUV (1~2인)' : 'VAN (3~4인)' }}
              </span>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <ListboxOption value="SUV" class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100 text-gray-900">
                <span class="block truncate">SUV (1~2인)</span>
              </ListboxOption>
              <ListboxOption value="VAN" class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100 text-gray-900">
                <span class="block truncate">VAN (3~4인)</span>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </div>
    
    <!--
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-cyan-500">출발 날짜를 선택해 주세요.</span>
      </div>
      <div class="relative" @click.stop>
        <button 
          class="w-full border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm text-center select-box-container" 
          :class="{ 'error-border': props.validationErrors?.pickupDate }"
          data-field="van.pickupDate"
          @click.stop="toggleCalendar"
          @click="removeVanErrorAnimation('pickupDate')"
        >
          {{ date !== '날짜 선택' ? formatDate(date, locale.value) : '날짜 선택' }}
        </button>
        <div v-show="showCalendar" class="absolute z-50 mt-2 bg-white shadow-lg rounded-md w-full overflow-hidden">
          <client-only>
            <VCalendar
              style="width: 100%"
              trim-weeks
              :min-date="new Date()"
              :attributes="calendarAttributes"
              @dayclick="onDayClick"
            />
          </client-only>
        </div>
      </div>
    </div>
    
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-cyan-500">출발 시간을 선택해 주세요.</span>
      </div>
      <div class="flex gap-3">
        <Listbox v-model="time">
          <div class="relative w-full">
            <ListboxButton class="flex-1 w-full border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm text-center appearance-none" :class="{ 'error-border': props.validationErrors?.pickupTime }" data-field="van.pickupTime">
              <span class="block truncate">
                {{ time === 0 ? '시간 선택' : time }}
              </span>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
              <ListboxOption v-for="hour in 24" :key="'pickup-'+(hour-1)+'-0'" :value="formatTimeString(hour-1, 0)" class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100 text-gray-900">
                <span class="block truncate">{{ formatTimeString(hour-1, 0) }}</span>
              </ListboxOption>
              <ListboxOption v-for="hour in 24" :key="'pickup-'+(hour-1)+'-30'" :value="formatTimeString(hour-1, 30)" class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100 text-gray-900">
                <span class="block truncate">{{ formatTimeString(hour-1, 30) }}</span>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </div>

    <template v-if="isRoundTrip">
      <div class="mb-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm text-cyan-500">도착 날짜를 선택해 주세요.</span>
        </div>
        <div class="relative" @click.stop>
          <button 
            class="w-full border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm text-center select-box-container" 
            :class="{ 'error-border': props.validationErrors?.returnDate }"
            data-field="van.returnDate"
            @click.stop="toggleReturnCalendar"
            @click="removeVanErrorAnimation('returnDate')"
          >
            {{ returnDate !== '날짜 선택' ? formatDate(returnDate, locale.value) : '날짜 선택' }}
          </button>
          <div v-show="showReturnCalendar" class="absolute z-50 mt-2 bg-white shadow-lg rounded-md w-full overflow-hidden">
            <client-only>
              <VCalendar
                style="width: 100%"
                trim-weeks
                :min-date="new Date()"
                :attributes="returnCalendarAttributes"
                @dayclick="onReturnDayClick"
              />
            </client-only>
          </div>
        </div>
      </div>
      
      <div class="mb-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm text-cyan-500">도착 시간을 선택해 주세요.</span>
        </div>
        <div class="flex gap-3">
          <Listbox v-model="returnTime">
            <div class="relative w-full">
              <ListboxButton class="flex-1 w-full border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm text-center appearance-none" :class="{ 'error-border': props.validationErrors?.returnTime }" data-field="van.returnTime">
                <span class="block truncate">
                  {{ returnTime === 0 ? '시간 선택' : returnTime }}
                </span>
              </ListboxButton>
              <ListboxOptions class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                <ListboxOption v-for="hour in 24" :key="'return-'+(hour-1)+'-0'" :value="formatTimeString(hour-1, 0)" class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100 text-gray-900">
                  <span class="block truncate">{{ formatTimeString(hour-1, 0) }}</span>
                </ListboxOption>
                <ListboxOption v-for="hour in 24" :key="'return-'+(hour-1)+'-30'" :value="formatTimeString(hour-1, 30)" class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100 text-gray-900">
                  <span class="block truncate">{{ formatTimeString(hour-1, 30) }}</span>
                </ListboxOption>
              </ListboxOptions>
            </div>
          </Listbox>
        </div>
      </div>
    </template>
    -->
    
    <!-- Pickup Location -->
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-cyan-500">출발지</span>
      </div>
      <div class="flex gap-3">
        <input 
          v-model="pickupLocation"
          type="text"
          readonly
          placeholder="호텔 또는 숙소 이름을 입력해주세요"
          class="flex-1 border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm"
          :class="{ 'error-border': props.validationErrors?.pickupLocation }"
          data-field="van.pickupLocation"
          @click="showPickupModal = true; removeVanErrorAnimation('pickupLocation')"
        >
      </div>
    </div>
    
    <!-- Pickup Location Modal using the component -->
    <SearchAddressPopup
      v-model="showPickupModal"
      title="출발지 선택"
      :course-idx="props.courseIdx"
      :selected-location="pickupLocation"
      @select="handlePickupSelect"
      @confirm="handlePickupConfirm"
    />

    <template v-if="isRoundTrip">
      <div class="mb-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-cyan-500">도착지</span>
      </div>
      <div class="flex gap-3">
        <input 
          v-model="dropoffLocation"
          type="text"
          readonly
          placeholder="호텔 또는 숙소 이름을 입력해주세요"
          class="flex-1 border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm"
          :class="{ 'error-border': props.validationErrors?.dropoffLocation }"
          data-field="van.dropoffLocation"
          @click="showDropoffModal = true; removeVanErrorAnimation('dropoffLocation')"
        >
      </div>
    </div>
    
      <SearchAddressPopup
        v-model="showDropoffModal"
        title="라운딩 후 도착지 선택"
        :selected-location="dropoffLocation"
        :course-idx="props.courseIdx"
        @select="handleDropoffSelect"
        @confirm="handleDropoffConfirm"
      />
    </template>

    <!-- Car Count Selection -->
    <div class="mb-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm text-cyan-500">예약 차량 수를 선택해 주세요.</span>
        </div>
        <div class="flex gap-3">
          <select 
            v-model="carCount"
            class="flex-1 border border-gray-300 rounded-md px-2 py-3 bg-white text-gray-500 text-sm text-center appearance-none"
            :class="{ 'error-border': props.validationErrors?.carCount }"
            data-field="van.carCount"
            @change="removeVanErrorAnimation('carCount')"
          >
            <option disabled value="0" selected>차량 수 선택</option>
            <option v-for="count in 6" :key="count" :value="count">
              {{ count }}대
            </option>
          </select>
        </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import 'v-calendar/dist/style.css';
import SearchAddressPopup from './SearchAddressPopup.vue';
import { formatDate } from '~/utils/formatters';

const { locale } = useI18n()

// Define props
const props = defineProps<{
  isRoundTrip: boolean;
  courseIdx: number;
  validationErrors?: {
    carCount: boolean;
    pickupDate: boolean;
    pickupTime: boolean;
    returnDate: boolean;
    returnTime: boolean;
    pickupLocation: boolean;
    dropoffLocation: boolean;
    carType: boolean;
  };
}>();

// 이벤트 정의
const emit = defineEmits<{
  'update:van-data': [vanData: {
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    pickupLocation: string;
    dropoffLocation: string;
    carType: string;
    carCount: number;
  }];
  'remove-error': [fieldName: string];
}>();

// 에러 애니메이션 제거 함수
const removeVanErrorAnimation = (fieldName: string) => {
  emit('remove-error', fieldName);
};

// State
const date = ref('날짜 선택');
const time = ref(0);
const returnDate = ref('날짜 선택');
const returnTime = ref(0);
const pickupLocation = ref('');
const dropoffLocation = ref('');
const carType = ref(0);
const carCount = ref(0);
const showCalendar = ref(false);
const showReturnCalendar = ref(false);
const showPickupModal = ref(false);
const showDropoffModal = ref(false);




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

const returnCalendarAttributes = computed(() => [
  {
    key: 'today',
    highlight: {
      color: 'cyan',
      fillMode: 'light',
    },
    dates: new Date(),
  },
]);

// Format time string to HH:MM format
const formatTimeString = (hour: number, minute: number): string => {
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');
  return `${formattedHour}:${formattedMinute}`;
};

// Event handlers
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
};

const toggleReturnCalendar = () => {
  showReturnCalendar.value = !showReturnCalendar.value;
};

const onDayClick = (day: { date: Date }) => {
  date.value = day.date;
  showCalendar.value = false;
};

const onReturnDayClick = (day: { date: Date }) => {
  returnDate.value = day.date;
  showReturnCalendar.value = false;
};

// Document click handler to close calendar when clicking outside
const handleDocumentClick = (event: MouseEvent) => {
  // If calendar is open and we're not clicking inside a calendar element
  const target = event.target as HTMLElement;
  const isCalendarClick = target.closest('.vc-container') || 
                         target.closest('.vc-day') || 
                         target.closest('.vc-weeks');
  
  // Don't close if clicking on calendar elements
  if ((showCalendar.value || showReturnCalendar.value) && !isCalendarClick) {
    // Check if we're clicking on the SelectBox itself
    const isSelectBoxClick = target.closest('.select-box-container');
    
    // Only close if we're not clicking on the SelectBox
    if (!isSelectBoxClick) {
      showCalendar.value = false;
      showReturnCalendar.value = false;
    }
  }
};

// We'll use the Escape key to close the calendar too
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && (showCalendar.value || showReturnCalendar.value)) {
    showCalendar.value = false;
    showReturnCalendar.value = false;
  }
};

// Handle pickup location selection from the popup component
const handlePickupSelect = (location) => {
  pickupLocation.value = location.name;
};

const handleDropoffSelect = (location) => {
  dropoffLocation.value = location.name;
};

// Handle pickup location confirmation from the popup component
const handlePickupConfirm = (locationName) => {
  pickupLocation.value = locationName;
  showPickupModal.value = false;
};

const handleDropoffConfirm = (locationName) => {
  dropoffLocation.value = locationName;
  showDropoffModal.value = false;
};

// 필드 값이 변경될 때마다 이벤트 발생
const updateVanData = () => {
  emit('update:van-data', {
    pickupDate: date.value,
    pickupTime: time.value,
    returnDate: returnDate.value,
    returnTime: returnTime.value,
    pickupLocation: pickupLocation.value,
    dropoffLocation: dropoffLocation.value,
    carType: carType.value,
    carCount: carCount.value
  });
};

// 필드 값 변경 감지
watch([date, time, returnDate, returnTime, pickupLocation, dropoffLocation, carType, carCount], () => {
  updateVanData();
});

onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
  document.addEventListener('click', handleDocumentClick);
  // 초기 데이터 전송
  updateVanData();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey);
  document.removeEventListener('click', handleDocumentClick);
});

</script>

<style>

</style>