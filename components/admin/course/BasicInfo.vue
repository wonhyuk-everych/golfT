<template>
  <div class="space-y-6">
    <!-- 기본 정보 섹션 -->
    <div class="border-b pb-4">
      <h3 class="text-lg font-medium mb-4">기본 정보</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">골프장 ID</p>
          <p class="font-medium">{{ course.courseIdx }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">골프장명(한글)</p>
          <input v-if="isEditing" v-model="editedCourse.nameKr" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.nameKr }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">골프장명(영문)</p>
          <input v-if="isEditing" v-model="editedCourse.nameEn" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.nameEn }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">홀 수</p>
          <input v-if="isEditing" v-model="editedCourse.holeCount" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="number">
          <p v-else class="font-medium">{{ course.holeCount }}홀</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">전화번호</p>
          <input v-if="isEditing" v-model="editedCourse.phone" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="tel">
          <p v-else class="font-medium">{{ course.phone || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">홈페이지</p>
          <input v-if="isEditing" v-model="editedCourse.website" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="url">
          <p v-else class="font-medium">
            <a v-if="course.website" :href="course.website" target="_blank" class="text-blue-600 hover:underline">
              {{ course.website }}
            </a>
            <span v-else>-</span>
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500">홍보 URL</p>
          <input v-if="isEditing" v-model="editedCourse.promoUrl" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="url">
          <p v-else class="font-medium">
            <a v-if="course.promoUrl" :href="course.promoUrl" target="_blank" class="text-blue-600 hover:underline">
              {{ course.promoUrl }}
            </a>
            <span v-else>-</span>
          </p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-500">상세 설명</p>
          <textarea v-if="isEditing" v-model="editedCourse.description" class="form-textarea mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" rows="4"></textarea>
          <p v-else class="font-medium whitespace-pre-wrap">{{ course.description || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- 예약 상태 섹션 -->
    <div class="border-b pb-4">
      <h3 class="text-lg font-medium mb-4">예약 상태</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">라운드 시작</p>
          <select v-if="isEditing" v-model="editedCourse.roundStart" class="form-select mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition">
            <option value="Y">가능</option>
            <option value="N">불가능</option>
          </select>
          <p v-else>
            <span :class="getCourseStartClass(course.roundStart)">
              {{ getCourseStartText(course.roundStart) }}
            </span>
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500">예약 상태</p>
          <select v-if="isEditing" v-model="editedCourse.bookingStatus" class="form-select mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition">
            <option value="Y">예약 가능</option>
            <option value="N">예약 불가</option>
          </select>
          <p v-else>
            <span :class="getBookingStatusClass(course.bookingStatus)">
              {{ getBookingStatusText(course.bookingStatus) }}
            </span>
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500">코스 상태</p>
          <select v-if="isEditing" v-model="editedCourse.courseStatus" class="form-select mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition">
            <option value="Y">운영중</option>
            <option value="N">운영중지</option>
          </select>
          <p v-else>
            <span :class="getCourseStatusClass(course.courseStatus)">
              {{ getCourseStatusText(course.courseStatus) }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- 코스 정보 섹션 -->
    <div class="border-b pb-4">
      <h3 class="text-lg font-medium mb-4">코스 정보</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">코스 디자이너</p>
          <input v-if="isEditing" v-model="editedCourse.courseDesigner" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.courseDesigner || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">코스 정보 홀</p>
          <input v-if="isEditing" v-model="editedCourse.courseHoles" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.courseHoles || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">코스 정보 파</p>
          <input v-if="isEditing" v-model="editedCourse.coursePar" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.coursePar || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">코스 정보 길이</p>
          <input v-if="isEditing" v-model="editedCourse.courseLength" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.courseLength || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">그린정보 페어웨이</p>
          <input v-if="isEditing" v-model="editedCourse.fairwayInfo" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.fairwayInfo || '-' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">그린정보 그린</p>
          <input v-if="isEditing" v-model="editedCourse.greenInfo" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.greenInfo || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- 플레이 옵션 섹션 -->
    <div class="border-b pb-4">
      <h3 class="text-lg font-medium mb-4">플레이 옵션</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">1인 플레이</p>
          <select v-if="isEditing" v-model="editedCourse.singlePlay" class="form-select mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition">
            <option value="Y">가능</option>
            <option value="N">불가능</option>
          </select>
          <p v-else class="font-medium">{{ course.singlePlay ? '가능' : '불가능' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">1인 플레이 날짜</p>
          <input v-if="isEditing" v-model="editedCourse.singlePlayDate" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.singlePlayDate }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">2인 플레이</p>
          <select v-if="isEditing" v-model="editedCourse.doublePlay" class="form-select mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition">
            <option value="Y">가능</option>
            <option value="N">불가능</option>
          </select>
          <p v-else class="font-medium">{{ course.doublePlay ? '가능' : '불가능' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">2인 플레이 날짜</p>
          <input v-if="isEditing" v-model="editedCourse.doublePlayDate" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.doublePlayDate }}</p>
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
            v-model="editedCourse.countryCode" 
            class="form-select mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition"
            @change="onCountryChange($event.target.value)"
          >
            <option v-for="country in countryCodes" :key="country.countryCode" :value="country.countryCode">{{ country.countryName }}</option>
          </select>
          <p v-else class="font-medium">{{ getCountryName(course.countryCode) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">지역</p>
          <select 
            v-if="isEditing" 
            v-model="editedCourse.cityCode" 
            class="form-select mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition"
          >
            <option v-for="city in filteredCityCodes" :key="city.cityCode" :value="city.cityCode">{{ city.cityName }}</option>
          </select>
          <p v-else class="font-medium">{{ getCityName(course.cityCode) }}</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-500">주소</p>
          <input v-if="isEditing" v-model="editedCourse.address" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
          <p v-else class="font-medium">{{ course.address || '-' }}</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-500">위치 좌표</p>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-500">위도</p>
              <input v-if="isEditing" v-model="editedCourse.latitude" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
              <p v-else class="font-medium">{{ course.latitude || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">경도</p>
              <input v-if="isEditing" v-model="editedCourse.longitude" class="form-input mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white transition" type="text">
              <p v-else class="font-medium">{{ course.longitude || '-' }}</p>
            </div>
          </div>
        </div>
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
  course: {
    type: Object,
    required: true
  },
  editedCourse: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  getCourseStartClass: {
    type: Function,
    required: true
  },
  getCourseStartText: {
    type: Function,
    required: true
  },
  getBookingStatusClass: {
    type: Function,
    required: true
  },
  getBookingStatusText: {
    type: Function,
    required: true
  },
  getCourseStatusClass: {
    type: Function,
    required: true
  },
  getCourseStatusText: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:editedCourse'])

const editedCourse = computed(() => {
  return props.editedCourse
})

// 국가 및 지역 코드 데이터
const countryCodes = ref<CountryCode[]>([]);
const cityCodes = ref<CityCode[]>([]);
const notification = ref<{ type: 'success' | 'error', message: string } | null>(null);
const isLoading = ref(false);

// 선택된 국가에 따른 필터링된 도시 목록
const filteredCityCodes = computed(() => {
  if (!props.editedCourse.countryCode) return [];
  return cityCodes.value.filter(city => city.countryCode === props.editedCourse.countryCode);
});

// 국가 변경 시 호출되는 함수
const onCountryChange = (newCountryCode) => {
  // 국가가 변경되면 해당 국가의 첫 번째 도시를 기본값으로 설정
  const filteredCities = cityCodes.value.filter(
    city => city.countryCode === newCountryCode
  );
  
  const updatedCourse = { ...props.editedCourse };
  updatedCourse.countryCode = newCountryCode;
  
  if (filteredCities.length > 0) {
    updatedCourse.cityCode = filteredCities[0].cityCode;
  } else {
    updatedCourse.cityCode = '';
  }
  
  emit('update:editedCourse', updatedCourse);
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

// 컴포넌트 마운트 시 국가 및 지역 코드 데이터 가져오기
onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchCountryCodes();
    await fetchCityCodes();
  } finally {
    isLoading.value = false;
  }
});

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
