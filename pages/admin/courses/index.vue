<!-- Golf Course Management Page -->
<template>
  <div class="space-y-6">
    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/courses/create"
        class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow"
      >
        신규 골프장 추가
      </NuxtLink>
    </div>
    <!-- 검색 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">골프장 검색</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">예약상태</label>
          <select
            v-model="searchParams.bookingStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option value="Y">예약가능</option>
            <option value="N">예약불가</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">골프장 상태</label>
          <select
            v-model="searchParams.courseStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option value="Y">운영중</option>
            <option value="N">운영중지</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">지역</label>
          <select
            v-model="searchParams.regionCode"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option v-for="region in regions" :key="region.code" :value="region.code">
              {{ region.name }}
            </option>
            <option v-if="regions.length === 0" disabled>로딩 중...</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">라운드 시작</label>
          <select
            v-model="searchParams.roundStart"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
          <option value="">전체</option>
            <option value="Y">가능</option>
            <option value="N">불가능</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">골프장 ID, 골프장명(한글), 골프장명(영문)</label>
          <input
            v-model="searchParams.searchWord"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="골프장 ID, 골프장명(한글), 골프장명(영문) 입력"
          />
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
            <tr v-for="course in courses" :key="course.courseIdx" class="hover:bg-gray-50 cursor-pointer" @click="handleRowClick(course.courseIdx)">
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getBookingStatusClass(course.bookingStatus)">
                  {{ getBookingStatusText(course.bookingStatus) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getCourseStatusClass(course.courseStatus)">
                  {{ getCourseStatusText(course.courseStatus) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ course.courseIdx }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ course.nameKr }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ course.nameEn }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ course.countryCode }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ course.regionCode }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ course.holeCount }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ course.roundStart }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(course.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(course.updatedAt) }}</td>
            </tr>
            <tr v-if="courses.length === 0">
              <td :colspan="tableHeaders.length" class="px-6 py-4 text-center text-gray-500">
                검색 결과가 없습니다
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 페이지네이션 컴포넌트 -->
      <div v-if="totalPages > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              총 <span class="font-medium">{{ totalItems }}</span> 개 항목 중 
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> - 
              <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> 번째 항목
            </p>
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
                  {{ page }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'

import type { GolfCourse, GolfCourseSearchParams } from '~/types/admin/course'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const searchParams = ref<GolfCourseSearchParams>({
  searchWord: '',
  bookingStatus: '',
  courseStatus: '',
  regionCode: '',
  roundStart: ''
})

// 페이징 관련 상태
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalItems = ref<number>(0)
const totalPages = ref<number>(0)

const courses = ref<GolfCourse[]>([])

const tableHeaders = [
  { key: 'bookingStatus', label: '예약상태' },
  { key: 'courseStatus', label: '골프장 상태' },
  { key: 'courseIdx', label: '골프장 ID' },
  { key: 'nameKr', label: '골프장명(한글)' },
  { key: 'nameEn', label: '골프장명(영문)' },
  { key: 'countryCode', label: '국가' },
  { key: 'regionCode', label: '지역' },
  { key: 'holeCount', label: '홀 수' },
  { key: 'roundStart', label: '라운드 시작' },
  { key: 'createdAt', label: '등록일시' },
  { key: 'updatedAt', label: '수정일시' }
]

// 지역 데이터 (API에서 가져옴)
const regions = ref<{ code: string, name: string }[]>([])

// 국가 코드 데이터 가져오기
const fetchCountryCodes = async () => {
  try {
    const response = await $fetch('/api/admin/country-codes')
    if (response && response.countryCodes) {
      regions.value = response.countryCodes.map((country: { countryCode: string, countryName: string }) => ({
        code: country.countryCode,
        name: country.countryName
      }))
    }
  } catch (error) {
    console.error('국가 코드 데이터 가져오기 실패:', error)
  }
}

// 페이지 로드 시 국가 코드 데이터 가져오기 및 검색 실행
onMounted(() => {
  fetchCountryCodes()
  handleSearch()
})



const handleReset = () => {
  searchParams.value = {
    searchWord: '',
    bookingStatus: '',
    courseStatus: '',
    regionCode: '',
    roundStart: ''
  }
  currentPage.value = 1
}

const handleSearch = async () => {
  try {
    const response = await $fetch('/api/admin/courses/search', {
      method: 'GET',
      params: {
        ...searchParams.value,
        // Only include non-empty values
        searchWord: searchParams.value.searchWord || undefined,
        bookingStatus: searchParams.value.bookingStatus || undefined,
        courseStatus: searchParams.value.courseStatus || undefined,
        regionCode: searchParams.value.regionCode || undefined,
        roundStart: searchParams.value.roundStart || undefined,
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })
    courses.value = response.courses
    totalItems.value = response.total
    totalPages.value = response.totalPages
    currentPage.value = response.page
  } catch (error) {
    console.error('골프장 검색 중 오류 발생:', error)
  }
}

const handleRowClick = (courseIdx: number) => {
  navigateTo(`/admin/courses/${courseIdx}`)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ko-KR')
}

const getBookingStatusClass = (status: string) => {
  return {
    'px-2 py-1 text-xs rounded-full': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getBookingStatusText = (status: string) => {
  return status === 'Y' ? '예약가능' : '예약불가'
}

const getCourseStatusClass = (status: string) => {
  return {
    'px-2 py-1 text-xs rounded-full': true,
    'bg-blue-100 text-blue-800': status === 'Y',
    'bg-gray-100 text-gray-800': status === 'N'
  }
}

const getCourseStatusText = (status: string) => {
  return status === 'Y' ? '운영중' : '운영중지'
}

// 페이지 이동 처리
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  handleSearch()
}

// 화면에 표시할 페이지 번호 계산
const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const maxDisplayPages = 5 // 최대 표시할 페이지 번호 수
  
  if (totalPages.value <= maxDisplayPages) {
    // 전체 페이지가 표시할 페이지 수보다 적으면 모든 페이지 표시
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // 현재 페이지 주변의 페이지만 표시하고 나머지는 '...'으로 표시
    const leftBound = Math.max(1, currentPage.value - Math.floor(maxDisplayPages / 2))
    const rightBound = Math.min(totalPages.value, leftBound + maxDisplayPages - 1)
    
    // 첫 페이지 표시
    pages.push(1)
    
    // 왼쪽 줄임표 표시 여부
    if (leftBound > 2) {
      pages.push('...')
    }
    
    // 중간 페이지 표시
    for (let i = Math.max(2, leftBound); i <= Math.min(totalPages.value - 1, rightBound); i++) {
      pages.push(i)
    }
    
    // 오른쪽 줄임표 표시 여부
    if (rightBound < totalPages.value - 1) {
      pages.push('...')
    }
    
    // 마지막 페이지 표시
    if (totalPages.value > 1) {
      pages.push(totalPages.value)
    }
  }
  
  return pages
})
</script>
