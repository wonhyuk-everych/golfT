<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">기본 정보</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 캐디 ID -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">캐디 ID</label>
        <input
          v-if="isEditing"
          :value="editedCaddy.caddyIdx"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          disabled
        >
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">{{ caddy.caddyIdx }}</p>
      </div>

      <!-- 골프장 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">골프장</label>
        <select
          v-if="isEditing"
          :value="editedCaddy.courseIdx"
          @change="updateField('courseIdx', Number($event.target.value))"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option v-for="course in golfCourses" :key="course.courseIdx" :value="course.courseIdx">
            {{ course.nameKr }}
          </option>
        </select>
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
          {{ getGolfCourseName(caddy.courseIdx) }}
        </p>
      </div>

      <!-- 캐디 코드 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">캐디 코드</label>
        <input
          v-if="isEditing"
          :value="editedCaddy.caddyCode"
          @input="updateField('caddyCode', $event.target.value)"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">{{ caddy.caddyCode }}</p>
      </div>

      <!-- 캐디 상태 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">캐디 상태</label>
        <select
          v-if="isEditing"
          :value="editedCaddy.caddyStatus"
          @change="updateField('caddyStatus', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="Y">활동중</option>
          <option value="N">비활동</option>
        </select>
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
          <span :class="getCaddyStatusClass(caddy.caddyStatus)">
            {{ getCaddyStatusText(caddy.caddyStatus) }}
          </span>
        </p>
      </div>

      <!-- 이름 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">이름</label>
        <input
          v-if="isEditing"
          :value="editedCaddy.name"
          @input="updateField('name', $event.target.value)"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">{{ caddy.name }}</p>
      </div>

      <!-- 닉네임 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
        <input
          v-if="isEditing"
          :value="editedCaddy.nickName"
          @input="updateField('nickName', $event.target.value)"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">{{ caddy.nickName }}</p>
      </div>

      <!-- 나이 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">나이</label>
        <input
          v-if="isEditing"
          :value="editedCaddy.age"
          @input="updateField('age', $event.target.value)"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">{{ caddy.age }}</p>
      </div>

      <!-- 키 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">키</label>
        <input
          v-if="isEditing"
          :value="editedCaddy.height"
          @input="updateField('height', $event.target.value)"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">{{ caddy.height }}</p>
      </div>

      <!-- 국가 코드 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">국가</label>
        <select
          v-if="isEditing"
          :value="editedCaddy.countryCode"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
          @change="onCountryChange($event.target.value)"
        >
          <option v-for="country in countryCodes" :key="country.countryCode" :value="country.countryCode">
            {{ country.countryName }}
          </option>
        </select>
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
          {{ getCountryName(caddy.countryCode) }}
        </p>
      </div>

      <!-- 지역 코드 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">지역</label>
        <select
          v-if="isEditing"
          :value="editedCaddy.cityCode"
          @change="updateField('cityCode', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option v-for="city in filteredCityCodes" :key="city.cityCode" :value="city.cityCode">
            {{ city.cityName }}
          </option>
        </select>
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
          {{ getCityName(caddy.cityCode) }}
        </p>
      </div>

      <!-- 휴일 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">휴일</label>
        <input
          v-if="isEditing"
          :value="editedCaddy.dayOff"
          @input="updateField('dayOff', $event.target.value)"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">{{ caddy.dayOff }}</p>
      </div>

      <!-- 골프 경력 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">골프 경력</label>
        <select
          v-if="isEditing"
          :value="editedCaddy.golfExperience"
          @change="updateField('golfExperience', $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="Y">있음</option>
          <option value="N">없음</option>
        </select>
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
          {{ caddy.golfExperience === 'Y' ? '있음' : '없음' }}
        </p>
      </div>

      <!-- 캐디 팁 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">캐디 팁</label>
        <input
          v-if="isEditing"
          :value="editedCaddy.price"
          @input="updateField('price', $event.target.value)"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">{{ formatPrice(caddy.price) }}</p>
      </div>

      <!-- 예약 수수료 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">예약 수수료</label>
        <input
          v-if="isEditing"
          :value="editedCaddy.reservationFee"
          @input="updateField('reservationFee', $event.target.value)"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
        <p v-else class="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">{{ formatPrice(caddy.reservationFee) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from '#imports'
import type { CaddyDetail } from '~/types/admin/caddy'

interface CountryCode {
  countryCodeIdx: number;
  countryCode: string;
  countryName: string;
}

interface CityCode {
  cityCode: string;
  cityName: string;
  countryCode: string;
}

interface GolfCourse {
  courseIdx: number;
  nameKr: string;
}

const props = defineProps<{
  caddy: CaddyDetail
  editedCaddy: CaddyDetail
  isEditing: boolean
  getCaddyStatusClass: (status: string) => Record<string, boolean>
  getCaddyStatusText: (status: string) => string
  getRegionName: (code: string) => string
  formatDate: (dateString: string) => string
  formatPrice: (price: number | null | undefined) => string
}>()

// API에서 가져온 국가, 도시, 골프장 데이터
const countryCodes = ref<CountryCode[]>([])
const cityCodes = ref<CityCode[]>([])
const golfCourses = ref<GolfCourse[]>([])
const isLoading = ref(false)

// 선택된 국가에 따른 필터링된 도시 목록
const filteredCityCodes = computed(() => {
  if (!props.editedCaddy.countryCode) return []
  return cityCodes.value.filter(city => city.countryCode === props.editedCaddy.countryCode)
})

// 국가 변경 시 호출되는 함수
const emit = defineEmits(['update:editedCaddy'])

// 필드 업데이트 함수
const updateField = (field, value) => {
  const updatedCaddy = { ...props.editedCaddy }
  updatedCaddy[field] = value
  emit('update:editedCaddy', updatedCaddy)
}

const onCountryChange = (newCountryCode) => {
  // 국가가 변경되면 해당 국가의 첫 번째 도시를 기본값으로 설정
  const filteredCities = cityCodes.value.filter(
    city => city.countryCode === newCountryCode
  )
  
  const updatedCaddy = { ...props.editedCaddy }
  updatedCaddy.countryCode = newCountryCode
  
  if (filteredCities.length > 0) {
    updatedCaddy.cityCode = filteredCities[0].cityCode
  } else {
    updatedCaddy.cityCode = ''
  }
  
  emit('update:editedCaddy', updatedCaddy)
}

// 국가 이름 가져오기
const getCountryName = (code: string): string => {
  const country = countryCodes.value.find(c => c.countryCode === code)
  return country ? country.countryName : code
}

// 도시 이름 가져오기
const getCityName = (code: string): string => {
  const city = cityCodes.value.find(c => c.cityCode === code)
  return city ? city.cityName : code
}

// 골프장 이름 가져오기
const getGolfCourseName = (idx: number): string => {
  const course = golfCourses.value.find(c => c.courseIdx === idx)
  return course ? course.nameKr : String(idx)
}

onMounted(async () => {
  isLoading.value = true
  try {
    // 국가 코드 가져오기
    const countryResponse = await $fetch('/api/admin/country-codes')
    countryCodes.value = countryResponse.countryCodes || []
    
    // 도시 코드 가져오기
    const cityResponse = await $fetch('/api/admin/city-codes')
    cityCodes.value = cityResponse.cityCodes || []
    
    // 골프장 데이터 가져오기
    const golfCoursesResponse = await $fetch('/api/admin/caddy/golf-courses')
    golfCourses.value = golfCoursesResponse.golfCourses || []
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
