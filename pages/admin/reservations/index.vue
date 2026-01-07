<template>
  <div class="space-y-6">
    <!-- 검색 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">예약 검색</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 예약 상태 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">예약 상태</label>
          <select v-model="searchParams.status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">전체</option>
            <option value="PENDING">대기</option>
            <option value="REFUND_REQUEST">환불 요청</option>
            <option value="CANCELLED">취소</option>
            <option value="PARTIALLY_CANCELLED">부분 취소</option>
            <option value="COMPLETE">완료</option>
          </select>
        </div>
        <!-- 예약 날짜 범위 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">예약 날짜 범위</label>
          <input type="date" v-model="searchParams.startDate" class="w-full px-3 py-2 border border-gray-300 rounded-md mb-1" />
          <input type="date" v-model="searchParams.endDate" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <!-- 키워드 검색 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">검색어</label>
          <input
            v-model="searchParams.keyword"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="닉네임, 예약자명, 휴대전화, 예약번호"
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

    <!-- 예약 리스트 테이블 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">예약번호</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">예약 상태</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">예약 서비스</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">예약/취소</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총액</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">닉네임</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">예약 일시</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이용 일시</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">취소 일시</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="reservation in reservations" :key="reservation.reservation_idx" class="hover:bg-gray-50 cursor-pointer" @click="goToDetail(reservation.reservation_idx)">
              <td class="px-6 py-4 whitespace-nowrap">{{ reservation.reservation_idx }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(reservation.reservation_status)">
                  {{ getStatusText(reservation.reservation_status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ reservation.service_types }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ reservation.product_count }} / {{ reservation.cancel_count }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatPrice(reservation.total_price) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ reservation.nickname }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDateTime(reservation.reservation_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(reservation.use_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(reservation.cancel_date) }}</td>
            </tr>
            <tr v-if="reservations.length === 0">
              <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                검색 결과가 없습니다
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 페이지네이션 -->
      <div v-if="totalPages > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              총 <span class="font-medium">{{ totalItems }}</span>건
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> -
              <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> 건
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                :disabled="currentPage === 1"
                :class="{ 'cursor-not-allowed opacity-50': currentPage === 1, 'hover:bg-gray-50': currentPage !== 1 }"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
                @click="goToPage(currentPage - 1)"
              >
                <span class="sr-only">이전</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <template v-for="page in displayedPages" :key="page">
                <button
                  v-if="page !== '...'"
                  :class="{ 'bg-blue-50 border-blue-500 text-blue-600': page === currentPage, 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': page !== currentPage }"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <span v-else class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {{ page }}
                </span>
              </template>
              <button
                :disabled="currentPage === totalPages"
                :class="{ 'cursor-not-allowed opacity-50': currentPage === totalPages, 'hover:bg-gray-50': currentPage !== totalPages }"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
                @click="goToPage(currentPage + 1)"
              >
                <span class="sr-only">다음</span>
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

<script lang="ts" setup>
import { ref, computed, onMounted } from '#imports'
import { useRouter } from 'vue-router'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

function getToday() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}
function getMonthPrev() {
  const d = new Date()
  d.setMonth(d.getMonth() - 3)
  return d.toISOString().slice(0, 10)
}

const searchParams = ref({
  status: '',
  startDate: getMonthPrev(),
  endDate: getToday(),
  keyword: ''
})

const reservations = ref<any[]>([])
const totalItems = ref(0)
const pageSize = 10
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))


const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const maxDisplayPages = 5
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + maxDisplayPages - 1)
  if (end - start < maxDisplayPages - 1) {
    start = Math.max(1, end - maxDisplayPages + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  if (start > 1) pages.unshift('...')
  if (end < totalPages.value) pages.push('...')
  return pages
})

const handleSearch = async () => {
  currentPage.value = 1
  await fetchReservations()
}

const handleReset = () => {
  searchParams.value = { status: '', startDate: getToday(), endDate: getMonthLater(), keyword: '' }
  currentPage.value = 1
  fetchReservations()
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  fetchReservations()
}

const fetchReservations = async () => {
  const params = new URLSearchParams({
    page: String(currentPage.value),
    status: searchParams.value.status,
    startDate: searchParams.value.startDate,
    endDate: searchParams.value.endDate,
    keyword: searchParams.value.keyword
  })
  const res = await $fetch(`/api/admin/reservations/list?${params.toString()}`)
  reservations.value = res.reservations
  totalItems.value = res.total
}

const router = useRouter()
function goToDetail(reservationIdx: string) {
  router.push(`/admin/reservations/${reservationIdx}`)
}

onMounted(() => {
  fetchReservations()
})

function getStatusText(status: string) {
  switch (status) {
    case 'PENDING': return '대기'
    case 'COMPLETE': return '확정'
    case 'CANCELLED': return '취소'
    case 'PARTIALLY_CANCELLED': return '부분 취소'
    default: return status
  }
}
function getStatusClass(status: string) {
  switch (status) {
    case 'PENDING': return 'text-yellow-600 font-semibold'
    case 'COMPLETE': return 'text-green-600 font-semibold'
    case 'CANCELLED': return 'text-red-600 font-semibold'
    case 'PARTIALLY_CANCELLED': return 'text-red-600 font-semibold'
    default: return ''
  }
}
function getTypeText(type: string) {
  switch (type) {
    case '골프': return '골프'
    case '호텔': return '호텔'
    case '캐디': return '캐디'
    case '콜밴': return '콜밴'
    case '대회': return '대회'
    default: return type
  }
}
function formatDate(date: string) {
  if (!date) return '-'
  return date.split('T')[0]
}
function formatDateTime(date: string) {
  if (!date) return '-'
  return date.replace('T', ' ').slice(0, 16)
}
</script>

<style>
</style>