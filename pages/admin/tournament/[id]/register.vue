<!-- Tournament Registration List Page -->
<template>
  <div class="space-y-6">
    <!-- 페이지 헤더 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">대회 신청자 조회</h1>
        <p class="mt-1 text-sm text-gray-500">대회 ID: {{ tournamentId }}</p>
      </div>
      <button
        class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        @click="handleBack"
      >
        ← 목록으로
      </button>
    </div>

    <!-- 검색 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">신청자 검색</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">신청 시작일</label>
          <input
            v-model="searchParams.startDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">신청 종료일</label>
          <input
            v-model="searchParams.endDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">신청 정보 검색</label>
          <input
            v-model="searchParams.searchWord"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="신청 정보 내용 검색"
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
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h3 class="text-lg font-semibold">신청 목록 ({{ registrations.length }}건)</h3>
          <button
            v-if="selectedReservations.length > 0"
            class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2"
            @click="showStatusModal = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            상태 변경 ({{ selectedReservations.length }}건)
          </button>
        </div>
        <button
          v-if="registrations.length > 0"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
          @click="handleExcelDownload"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          엑셀 다운로드
        </button>
      </div>
      
      <div v-if="loading" class="px-6 py-8 text-center text-gray-500">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3">로딩 중...</span>
        </div>
      </div>

      <div v-else-if="error" class="px-6 py-8 text-center text-red-500">
        {{ error }}
      </div>
      
      <div v-else-if="registrations.length === 0" class="px-6 py-8 text-center text-gray-500">
        검색 결과가 없습니다
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                <input
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  :checked="isAllSelected"
                  @change="toggleAllSelection"
                >
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                예약번호
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                예약상태
              </th>
              <th
                v-for="(field, index) in formFields"
                :key="index"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {{ field.title }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                신청일
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                첨부 이미지
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="registration in registrations"
              :key="registration.reservation_tournament_idx"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                <input
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  v-model="selectedReservations"
                  :value="registration.reservation_idx"
                >
              </td>
              <td class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                {{ registration.reservation_idx }}
              </td>
              <td class="px-4 py-3 text-sm whitespace-nowrap">
                <span
                  :class="getReservationStatusClass(registration.reservation_status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getReservationStatusLabel(registration.reservation_status) }}
                </span>
              </td>
              <td
                v-for="(field, index) in registration.form_data.result"
                :key="index"
                class="px-4 py-3 text-sm text-gray-900"
              >
                {{ field.value }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                {{ formatDateTime(registration.create_date) }}
              </td>
              <td class="px-4 py-3 text-sm whitespace-nowrap">
                <div v-if="registration.images" class="flex flex-wrap gap-1">
                  <a
                    v-for="(image, imgIndex) in getImageUrls(registration.images)"
                    :key="imgIndex"
                    :href="image"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 underline"
                  >
                    이미지{{ imgIndex + 1 }}
                  </a>
                </div>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 상태 변경 모달 -->
    <div
      v-if="showStatusModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showStatusModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">예약 상태 변경</h3>
        <p class="text-sm text-gray-600 mb-4">
          선택한 {{ selectedReservations.length }}건의 예약 상태를 변경합니다.
        </p>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">변경할 상태</label>
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">상태를 선택하세요</option>
            <option value="PENDING">예약 대기</option>
            <option value="COMPLETE">예약 완료</option>
            <option value="USED">이용 완료</option>
            <option value="REFUND_REQUEST">환불 요청</option>
            <option value="CANCELLED">환불 완료</option>
          </select>
        </div>

        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            @click="showStatusModal = false"
          >
            취소
          </button>
          <button
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="!selectedStatus || updating"
            @click="handleBulkStatusUpdate"
          >
            {{ updating ? '처리 중...' : '수정' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'
import type { TournamentRegistration, TournamentRegistrationSearchParams } from '~/types/admin/tournament'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const tournamentId = route.params.id as string

const searchParams = ref<TournamentRegistrationSearchParams>({
  searchWord: '',
  startDate: '',
  endDate: ''
})

const registrations = ref<TournamentRegistration[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Bulk status update state
const selectedReservations = ref<number[]>([])
const showStatusModal = ref(false)
const selectedStatus = ref('')
const updating = ref(false)

// Extract form fields from first registration (all registrations have same structure)
const formFields = computed(() => {
  if (registrations.value.length > 0 && registrations.value[0].form_data?.result) {
    return registrations.value[0].form_data.result.map(field => ({
      title: field.title,
      type: field.type
    }))
  }
  return []
})

// Check if all reservations are selected
const isAllSelected = computed(() => {
  return registrations.value.length > 0 && 
         selectedReservations.value.length === registrations.value.length
})

// Toggle all checkbox selection
const toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedReservations.value = []
  } else {
    selectedReservations.value = registrations.value.map((r: TournamentRegistration) => r.reservation_idx)
  }
}

const handleReset = () => {
  searchParams.value = {
    searchWord: '',
    startDate: '',
    endDate: ''
  }
}

const handleSearch = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await $fetch(`/api/admin/tournament/${tournamentId}/register`, {
      method: 'GET',
      params: {
        ...searchParams.value,
        // Only include non-empty values
        searchWord: searchParams.value.searchWord || undefined,
        startDate: searchParams.value.startDate || undefined,
        endDate: searchParams.value.endDate || undefined
      }
    })
    registrations.value = response.registrations
  } catch (err) {
    console.error('신청자 조회 중 오류 발생:', err)
    error.value = (err as Error)?.message || '신청자 조회 중 오류가 발생했습니다.'
    registrations.value = []
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  navigateTo('/admin/tournament')
}

const handleBulkStatusUpdate = async () => {
  if (!selectedStatus.value || selectedReservations.value.length === 0) {
    return
  }

  try {
    updating.value = true
    
    const response = await $fetch(`/api/admin/tournament/${tournamentId}/register`, {
      method: 'PUT',
      body: {
        reservationIds: selectedReservations.value,
        status: selectedStatus.value
      }
    })

    if (response.success) {
      alert(`${response.updatedCount}건의 예약 상태가 변경되었습니다.`)
      
      // Reset selections and close modal
      selectedReservations.value = []
      selectedStatus.value = ''
      showStatusModal.value = false
      
      // Refresh the list
      await handleSearch()
    }
  } catch (err) {
    console.error('상태 변경 중 오류 발생:', err)
    alert('상태 변경 중 오류가 발생했습니다.')
  } finally {
    updating.value = false
  }
}

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getReservationStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': '예약 대기',
    'COMPLETE': '예약 완료',
    'USED': '이용 완료',
    'REFUND_REQUEST': '환불 요청',
    'CANCELLED': '환불 완료'
  }
  return statusMap[status] || status
}

const getReservationStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',      // 예약 대기 - 노란색
    'COMPLETE': 'bg-blue-100 text-blue-800',         // 예약 완료 - 파란색
    'USED': 'bg-green-100 text-green-800',           // 이용 완료 - 초록색
    'REFUND_REQUEST': 'bg-orange-100 text-orange-800', // 환불 요청 - 주황색
    'CANCELLED': 'bg-gray-100 text-gray-800'         // 환불 완료 - 회색
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}


const getImageUrls = (images: string) => {
  if (!images) return []
  return images.split(',').map(url => url.trim()).filter(url => url)
}

const handleExcelDownload = async () => {
  try {
    // Dynamically import xlsx library
    const XLSX = await import('xlsx')
    
    // Prepare headers
    const headers = ['예약번호', '예약상태']
    formFields.value.forEach(field => {
      headers.push(field.title)
    })
    headers.push('신청일')
    headers.push('첨부 이미지')
    
    // Prepare data rows
    const rows = registrations.value.map(registration => {
      const row: (string | number)[] = [
        registration.reservation_idx,
        getReservationStatusLabel(registration.reservation_status)
      ]
      
      // Add form data values
      registration.form_data.result.forEach(field => {
        row.push(field.value)
      })
      
      // Add create date
      row.push(formatDateTime(registration.create_date))
      
      // Add images
      const imageUrls = getImageUrls(registration.images || '')
      row.push(imageUrls.length > 0 ? imageUrls.join(', ') : '-')
      
      return row
    })
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
    
    // Set column widths
    const colWidths = headers.map(() => ({ wch: 20 }))
    worksheet['!cols'] = colWidths
    
    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '신청자 목록')
    
    // Generate filename with current date
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '')
    const filename = `tournament_${tournamentId}_registrations_${dateStr}.xlsx`
    
    // Download file
    XLSX.writeFile(workbook, filename)
  } catch (error) {
    console.error('엑셀 다운로드 중 오류 발생:', error)
    alert('엑셀 다운로드 중 오류가 발생했습니다.')
  }
}

// Load registrations on page load
onMounted(() => {
  handleSearch()
})
</script>
