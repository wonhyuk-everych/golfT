<template>
  <div class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">기본 정보</h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-sm text-gray-500">호텔 ID</p>
        <p class="font-medium">{{ hotel.hotelIdx }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">호텔명(한글)</p>
        <input v-if="isEditing" v-model="editedHotel.nameKr" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
        <p v-else class="font-medium">{{ hotel.nameKr }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">호텔명(영문)</p>
        <input v-if="isEditing" v-model="editedHotel.nameEn" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
        <p v-else class="font-medium">{{ hotel.nameEn }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">체크인 시간</p>
        <input v-if="isEditing" v-model="editedHotel.checkIn" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="number">
        <p v-else class="font-medium">{{ hotel.checkIn }}시</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">체크아웃 시간</p>
        <input v-if="isEditing" v-model="editedHotel.checkOut" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="number">
        <p v-else class="font-medium">{{ hotel.checkOut }}시</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">홈페이지</p>
        <input v-if="isEditing" v-model="editedHotel.homePage" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="url">
        <p v-else class="font-medium">
          <a v-if="hotel.homePage" :href="hotel.homePage" target="_blank" class="text-blue-600 hover:underline">
            {{ hotel.homePage }}
          </a>
          <span v-else>-</span>
        </p>
      </div>
      <div class="col-span-2">
        <p class="text-sm text-gray-500">주소</p>
        <textarea v-if="isEditing" v-model="editedHotel.address" class="form-textarea mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" rows="2" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ hotel.address || '-' }}</p>
      </div>
    </div>
  </div>

  <!-- 호텔 상태 섹션 -->
  <div class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">호텔 상태</h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-sm text-gray-500">호텔 상태</p>
        <select v-if="isEditing" v-model="editedHotel.hotelStatus" class="form-select mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition">
          <option value="Y">운영중</option>
          <option value="N">운영중지</option>
        </select>
        <p v-else>
          <span :class="getHotelStatusClass(hotel.hotelStatus)">
            {{ getHotelStatusText(hotel.hotelStatus) }}
          </span>
        </p>
      </div>
    </div>
  </div>

  <!-- 위치 정보 섹션 -->
  <div class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">위치 정보</h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-sm text-gray-500">국가</p>
        <select 
          v-if="isEditing" 
          v-model="editedHotel.countryCode" 
          class="form-select mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition"
          @change="onCountryChange($event.target.value)"
        >
          <option v-for="country in countryCodes" :key="country.countryCode" :value="country.countryCode">{{ country.countryName }}</option>
        </select>
        <p v-else class="font-medium">{{ getCountryName(hotel.countryCode) }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">도시</p>
        <select 
          v-if="isEditing" 
          v-model="editedHotel.cityCode" 
          class="form-select mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition"
        >
          <option v-for="city in filteredCityCodes" :key="city.cityCode" :value="city.cityCode">{{ city.cityName }}</option>
        </select>
        <p v-else class="font-medium">{{ getCityName(hotel.cityCode) }}</p>
      </div>
    </div>
  </div>
  
  <!-- 호텔 추가 정보 섹션 -->
  <div class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">호텔 추가 정보</h3>
    <div class="grid grid-cols-1 gap-4">
      <div>
        <p class="text-sm text-gray-500">결제 안내</p>
        <textarea v-if="isEditing" v-model="editedHotel.payInfo" class="form-textarea mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" rows="3" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ hotel.payInfo || '-' }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">환불 안내</p>
        <textarea v-if="isEditing" v-model="editedHotel.refundInfo" class="form-textarea mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" rows="3" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ hotel.refundInfo || '-' }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">서비스 문의</p>
        <textarea v-if="isEditing" v-model="editedHotel.serviceInfo" class="form-textarea mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" rows="3" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ hotel.serviceInfo || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from '#imports'

interface CountryCode {
  countryCodeIdx?: number;
  countryCode: string;
  countryName: string;
}

interface CityCode {
  cityCode: string;
  cityName: string;
  countryCode: string;
}

const props = defineProps({
  hotel: {
    type: Object,
    required: true
  },
  editedHotel: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:editedHotel'])

const editedHotel = computed(() => {
  return props.editedHotel
})

// 국가 및 도시 코드 데이터
const countryCodes = ref<CountryCode[]>([]);
const cityCodes = ref<CityCode[]>([]);
const notification = ref<{ type: 'success' | 'error', message: string } | null>(null);
const isLoading = ref(false);

// 선택된 국가에 따른 필터링된 도시 목록
const filteredCityCodes = computed(() => {
  if (!props.editedHotel.countryCode) return [];
  return cityCodes.value.filter(city => city.countryCode === props.editedHotel.countryCode);
});

// 국가 변경 시 호출되는 함수
const onCountryChange = (newCountryCode) => {
  // 국가가 변경되면 해당 국가의 첫 번째 도시를 기본값으로 설정
  const filteredCities = cityCodes.value.filter(
    city => city.countryCode === newCountryCode
  );
  
  const updatedHotel = { ...props.editedHotel };
  updatedHotel.countryCode = newCountryCode;
  
  if (filteredCities.length > 0) {
    updatedHotel.cityCode = filteredCities[0].cityCode;
  } else {
    updatedHotel.cityCode = '';
  }
  
  emit('update:editedHotel', updatedHotel);
};

// 국가 데이터 가져오기
const fetchCountryCodes = async () => {
  try {
    const { data, error: fetchError } = await useFetch('/api/admin/country-codes', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (fetchError.value) {
      showNotification('error', '국가 코드를 가져오는 중 오류가 발생했습니다.');
      return;
    }
    
    if (data.value && data.value.countryCodes) {
      countryCodes.value = data.value.countryCodes;
    }
  } catch {
    showNotification('error', '국가 코드를 가져오는 중 오류가 발생했습니다.');
  }
};

// 도시 데이터 가져오기
const fetchCityCodes = async () => {
  try {
    const { data, error: fetchError } = await useFetch('/api/admin/city-codes', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (fetchError.value) {
      showNotification('error', '도시 코드를 가져오는 중 오류가 발생했습니다.');
      return;
    }
    
    if (data.value && data.value.cityCodes) {
      cityCodes.value = data.value.cityCodes;
    }
  } catch {
    showNotification('error', '도시 코드를 가져오는 중 오류가 발생했습니다.');
  }
};

// 알림 표시 함수
const showNotification = (type: 'success' | 'error', message: string) => {
  notification.value = { type, message };
  setTimeout(() => {
    notification.value = null;
  }, 5000);
};

// 컴포넌트 마운트 시 국가 및 도시 코드 데이터 가져오기
onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchCountryCodes();
    await fetchCityCodes();
  } finally {
    isLoading.value = false;
  }
});

// 호텔 상태 클래스 반환 함수
const getHotelStatusClass = (status: string) => {
  if (status === 'Y') {
    return 'px-2 py-1 bg-green-100 text-green-800 rounded text-sm'
  }
  return 'px-2 py-1 bg-red-100 text-red-800 rounded text-sm'
}

// 호텔 상태 텍스트 반환 함수
const getHotelStatusText = (status: string) => {
  return status === 'Y' ? '운영중' : '운영중지'
}

// 국가명 반환 함수
const getCountryName = (code: string): string => {
  const country = countryCodes.value.find(c => c.countryCode === code);
  return country ? country.countryName : code;
};

// 도시명 반환 함수
const getCityName = (code: string): string => {
  const city = cityCodes.value.find(c => c.cityCode === code);
  return city ? city.cityName : code;
};
</script>
