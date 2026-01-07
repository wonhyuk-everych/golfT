<!-- Caddy Management Page -->
<template>
  <div class="space-y-6">
    <!-- 검색 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">캐디 검색</h2>
        <button
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none"
          @click="navigateTo('/admin/caddy/create')"
        >
          캐디 신규 등록
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">캐디 상태</label>
          <select
            v-model="searchParams.caddyStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option value="Y">활동중</option>
            <option value="N">비활동</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">지역</label>
          <select
            v-model="searchParams.cityCode"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            :disabled="isLoading"
          >
            <option value="">전체</option>
            <option v-for="region in regions" :key="region.code" :value="region.code">
              {{ region.name }}
            </option>
          </select>
          <div v-if="isLoading" class="text-xs text-gray-500 mt-1">로딩 중...</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">캐디 ID, 이름, 닉네임</label>
          <input
            v-model="searchParams.searchWord"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="캐디 ID, 이름, 닉네임 입력"
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
            <tr v-for="caddy in caddies" :key="caddy.caddyIdx" class="hover:bg-gray-50 cursor-pointer" @click="handleRowClick(caddy.caddyIdx)">
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getCaddyStatusClass(caddy.caddyStatus)">
                  {{ getCaddyStatusText(caddy.caddyStatus) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ caddy.caddyIdx }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ caddy.courseIdx }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ caddy.caddyCode }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ caddy.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ caddy.nickName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ caddy.age }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ caddy.cityCode }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ caddy.price }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ caddy.reservationFee }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(caddy.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(caddy.updatedAt) }}</td>
            </tr>
            <tr v-if="caddies.length === 0">
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

import type { Caddy, CaddySearchParams } from '~/types/admin/caddy'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const searchParams = ref<CaddySearchParams>({
  searchWord: '',
  courseIdx: undefined,
  caddyCode: undefined,
  caddyStatus: '',
  cityCode: '',
  page: 1,
  pageSize: 10
})

const caddies = ref<Caddy[]>([])

// 페이지네이션 상태
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItems = ref<number>(0)
const totalPages = ref<number>(0)

const tableHeaders = [
  { key: 'caddyStatus', label: '상태' },
  { key: 'caddyIdx', label: '캐디 ID' },
  { key: 'courseIdx', label: '골프장 ID' },
  { key: 'caddyCode', label: '캐디 코드' },
  { key: 'name', label: '이름' },
  { key: 'nickName', label: '닉네임' },
  { key: 'age', label: '나이' },
  { key: 'cityCode', label: '지역' },
  { key: 'price', label: '캐디 팁' },
  { key: 'reservationFee', label: '예약 수수료' },
  { key: 'createdAt', label: '등록일시' },
  { key: 'updatedAt', label: '수정일시' }
]

// 지역 데이터
const regions = ref<{ code: string; name: string }[]>([])
const isLoading = ref<boolean>(true)

// API에서 국가 데이터 가져오기
const fetchCountryCodes = async () => {
  try {
    isLoading.value = true
    const response = await $fetch('/api/admin/country-codes')
    regions.value = response.countryCodes.map((country: { countryCode: string; countryName: string }) => ({
      code: country.countryCode,
      name: country.countryName
    }))
  } catch (error) {
    console.error('국가 코드 가져오기 오류:', error)
  } finally {
    isLoading.value = false
  }
}

const handleReset = () => {
  searchParams.value = {
    searchWord: '',
    courseIdx: undefined,
    caddyCode: undefined,
    caddyStatus: '',
    cityCode: '',
    page: 1,
    pageSize: 10
  }
  handleSearch()
}

const handleSearch = async () => {
  try {
    const response = await $fetch('/api/admin/caddy/search', {
      method: 'GET',
      params: {
        ...searchParams.value,
        // Only include non-empty values
        searchWord: searchParams.value.searchWord || undefined,
        courseIdx: searchParams.value.courseIdx || undefined,
        caddyCode: searchParams.value.caddyCode || undefined,
        caddyStatus: searchParams.value.caddyStatus || undefined,
        cityCode: searchParams.value.cityCode || undefined,
        page: searchParams.value.page,
        pageSize: searchParams.value.pageSize
      }
    })
    
    // 응답 데이터 설정
    caddies.value = response.caddies
    totalItems.value = response.total
    currentPage.value = response.page
    pageSize.value = response.pageSize
    totalPages.value = response.totalPages
  } catch (error) {
    console.error('캐디 검색 중 오류 발생:', error)
  }
}

const handleRowClick = (caddyIdx: number) => {
  navigateTo(`/admin/caddy/${caddyIdx}`)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ko-KR')
}

const getCaddyStatusClass = (status: string) => {
  return {
    'px-2 py-1 text-xs rounded-full': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getCaddyStatusText = (status: string) => {
  return status === 'Y' ? '활동중' : '비활동'
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

// 페이지 로드 시 국가 데이터 가져오고 검색 실행
onMounted(async () => {
  await fetchCountryCodes()
  handleSearch()
})
</script>