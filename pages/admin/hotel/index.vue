<!-- Hotel Management Page -->
<template>
  <div class="space-y-6">
    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/hotel/create"
        class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow"
      >
        신규 호텔 등록
      </NuxtLink>
    </div>
    <!-- 검색 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">호텔 검색</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">호텔 상태</label>
          <select
            v-model="searchParams.hotelStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option value="Y">운영중</option>
            <option value="N">운영중지</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">국가</label>
          <select
            v-model="searchParams.countryCode"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            :disabled="isLoading"
          >
            <option value="">전체</option>
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.name }}
            </option>
          </select>
          <div v-if="isLoading" class="text-xs text-gray-500 mt-1">로딩 중...</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">도시</label>
          <select
            v-model="searchParams.cityCode"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            :disabled="isLoading"
          >
            <option value="">전체</option>
            <option v-for="city in filteredCities" :key="city.code" :value="city.code">
              {{ city.name }}
            </option>
          </select>
          <div v-if="isLoading" class="text-xs text-gray-500 mt-1">로딩 중...</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">호텔 ID, 호텔명(한글), 호텔명(영문)</label>
          <input
            v-model="searchParams.searchWord"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="호텔 ID, 호텔명(한글), 호텔명(영문) 입력"
          >
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          class="mr-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
          @click="handleReset"
        >
          초기화
        </button>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          @click="handleSearch"
        >
          검색
        </button>
      </div>
    </div>

    <!-- 검색 결과 테이블 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in tableHeaders" :key="header.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ header.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="hotel in hotels" :key="hotel.hotelIdx" class="hover:bg-gray-50 cursor-pointer" @click="handleRowClick(hotel.hotelIdx)">
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getHotelStatusClass(hotel.hotelStatus)">
                  {{ getHotelStatusText(hotel.hotelStatus) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ hotel.hotelIdx }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ hotel.nameKr }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ hotel.nameEn }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatPrice(hotel.price) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ hotel.countryName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ hotel.cityName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ hotel.roomCount }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(hotel.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(hotel.updatedAt) }}</td>
            </tr>
            <tr v-if="hotels.length === 0">
              <td :colspan="tableHeaders.length" class="px-6 py-4 text-center text-gray-500">
                검색 결과가 없습니다
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 페이지네이션 -->
      <div v-if="totalPages > 0" class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          항목 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> - <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> / 총 <span class="font-medium">{{ totalItems }}</span>개
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <!-- 이전 페이지 버튼 -->
            <button
              :disabled="currentPage === 1"
              :class="{
                'cursor-not-allowed opacity-50': currentPage === 1,
                'hover:bg-gray-50': currentPage !== 1
              }"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
              @click="goToPage(currentPage - 1)"
            >
              <span class="sr-only">이전</span>
              <!-- 왼쪽 화살표 아이콘 -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- 페이지 번호 -->
            <template v-for="page in displayedPages" :key="page">
              <button
                v-if="page !== '...'"
                :class="{
                  'bg-blue-50 border-blue-500 text-blue-600': page === currentPage,
                  'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': page !== currentPage
                }"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                ...
              </span>
            </template>
            
            <!-- 다음 페이지 버튼 -->
            <button
              :disabled="currentPage === totalPages"
              :class="{
                'cursor-not-allowed opacity-50': currentPage === totalPages,
                'hover:bg-gray-50': currentPage !== totalPages
              }"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
              @click="goToPage(currentPage + 1)"
            >
              <span class="sr-only">다음</span>
              <!-- 오른쪽 화살표 아이콘 -->
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from '#imports'
import { useRouter } from 'vue-router'

import type { Hotel, HotelSearchParams } from '~/types/admin/hotel'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const searchParams = ref<HotelSearchParams>({
  searchWord: '',
  hotelStatus: '',
  countryCode: '',
  cityCode: '',
  page: 1,
  pageSize: 10
})

const hotels = ref<Hotel[]>([])

// 페이지네이션 상태
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItems = ref<number>(0)
const totalPages = ref<number>(0)

const router = useRouter()

const tableHeaders = [
  { key: 'hotelStatus', label: '호텔 상태' },
  { key: 'hotelIdx', label: '호텔 ID' },
  { key: 'nameKr', label: '호텔명(한글)' },
  { key: 'nameEn', label: '호텔명(영문)' },
  { key: 'price', label: '최저 가격' },
  { key: 'countryName', label: '국가' },
  { key: 'cityName', label: '도시' },
  { key: 'roomCount', label: '객실 수' },
  { key: 'createdAt', label: '등록일시' },
  { key: 'updatedAt', label: '수정일시' }
]

// 국가 및 도시 데이터
const countries = ref<{ code: string; name: string }[]>([])
const cities = ref<{ code: string; name: string; countryCode: string }[]>([])
const isLoading = ref<boolean>(true)
const filteredCities = computed(() => {
  if (!searchParams.value.countryCode) {
    return cities.value
  }
  return cities.value.filter(city => city.countryCode === searchParams.value.countryCode)
})

// API에서 국가 및 도시 데이터 가져오기
const fetchCountryCodes = async () => {
  try {
    isLoading.value = true
    const response = await $fetch('/api/admin/country-codes')
    countries.value = response.countryCodes.map((country: { countryCode: string; countryName: string }) => ({
      code: country.countryCode,
      name: country.countryName
    }))
  } catch (error) {
    console.error('국가 코드 가져오기 오류:', error)
  }
}

const fetchCityCodes = async () => {
  try {
    const response = await $fetch('/api/admin/city-codes')
    cities.value = response.cityCodes.map((city: { cityCode: string; cityName: string; countryCode: string }) => ({
      code: city.cityCode,
      name: city.cityName,
      countryCode: city.countryCode
    }))
  } catch (error) {
    console.error('도시 코드 가져오기 오류:', error)
  } finally {
    isLoading.value = false
  }
}

const handleReset = () => {
  searchParams.value = {
    searchWord: '',
    hotelStatus: '',
    countryCode: '',
    cityCode: '',
    page: 1,
    pageSize: 10
  }
}

const handleSearch = async () => {
  try {
    const response = await $fetch('/api/admin/hotel/search', {
      method: 'GET',
      params: {
        ...searchParams.value,
        // Only include non-empty values
        searchWord: searchParams.value.searchWord || undefined,
        hotelStatus: searchParams.value.hotelStatus || undefined,
        countryCode: searchParams.value.countryCode || undefined,
        cityCode: searchParams.value.cityCode || undefined,
        page: searchParams.value.page,
        pageSize: searchParams.value.pageSize
      }
    })
    
    // 응답 데이터 설정
    hotels.value = response.hotels
    totalItems.value = response.total
    currentPage.value = response.page
    pageSize.value = response.pageSize
    totalPages.value = response.totalPages
  } catch (error) {
    console.error('호텔 검색 중 오류 발생:', error)
  }
}

const handleRowClick = (hotelIdx: string) => {
  navigateTo(`/admin/hotel/${hotelIdx}`)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ko-KR')
}

const formatPrice = (price: number | null) => {
  if (price === null) return '-'
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
}

const getHotelStatusClass = (status: string) => {
  return {
    'px-2 py-1 text-xs rounded-full': true,
    'bg-blue-100 text-blue-800': status === 'Y',
    'bg-gray-100 text-gray-800': status === 'N'
  }
}

const getHotelStatusText = (status: string) => {
  return status === 'Y' ? '운영중' : '운영중지'
}

// 페이지네이션 관련 함수
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  searchParams.value.page = page
  handleSearch()
}

// 화면에 표시할 페이지 번호 계산
const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisiblePages = 5
  
  if (totalPages.value <= maxVisiblePages) {
    // 전체 페이지 수가 최대 표시 페이지 수보다 작거나 같으면 모든 페이지 표시
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // 현재 페이지 주변의 페이지만 표시하고 나머지는 '...'으로 표시
    const leftSide = Math.floor(maxVisiblePages / 2)
    const rightSide = maxVisiblePages - leftSide - 1
    
    // 현재 페이지가 왼쪽에 가까운 경우
    if (currentPage.value <= leftSide + 1) {
      for (let i = 1; i <= maxVisiblePages - 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages.value)
    }
    // 현재 페이지가 오른쪽에 가까운 경우
    else if (currentPage.value >= totalPages.value - rightSide) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages.value - maxVisiblePages + 2; i <= totalPages.value; i++) {
        pages.push(i)
      }
    }
    // 현재 페이지가 중간에 있는 경우
    else {
      pages.push(1)
      pages.push('...')
      for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages.value)
    }
  }
  
  return pages
})

// 페이지 로드 시 국가/도시 데이터 가져오고 검색 실행
onMounted(async () => {
  await Promise.all([
    fetchCountryCodes(),
    fetchCityCodes()
  ])
  handleSearch()
})
</script>