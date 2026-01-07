<!-- Event List Page -->
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">이벤트 관리</h2>
      <NuxtLink to="/admin/event/create" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        + 신규 이벤트 등록
      </NuxtLink>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="bg-white p-6 rounded-lg shadow-md flex justify-center items-center">
      <p class="text-gray-500">로딩 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="bg-white p-6 rounded-lg shadow-md">
      <p class="text-red-500 text-center">{{ error }}</p>
    </div>

    <!-- 데이터 테이블 -->
    <div v-else class="bg-white rounded-lg shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              타이틀
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              기간
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              등록일
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="events.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              등록된 이벤트가 없습니다
            </td>
          </tr>
          <tr v-for="event in events" :key="event.event_idx" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ event.event_idx }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ event.title }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(event.start_date) }} ~ {{ formatDate(event.end_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(event.event_status)">
                {{ getStatusText(event.event_status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDateTime(event.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <NuxtLink :to="`/admin/event/${event.event_idx}`" class="text-blue-600 hover:text-blue-900">
                상세보기
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface Event {
  event_idx: number
  title: string
  start_date: string
  end_date: string
  event_status: string
  created_at: string
  created_member_idx: number
  updated_at: string | null
  updated_member_idx: number | null
}

interface ApiResponse {
  events: Event[]
}

const events = ref<Event[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const fetchEvents = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await $fetch<ApiResponse>('/api/admin/event')
    events.value = response.events
  } catch (err) {
    error.value = '이벤트 목록을 불러오는데 실패했습니다.'
    console.error('Error fetching events:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchEvents()
})

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ko-KR')
}

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('ko-KR')
}

const getStatusClass = (status: string) => {
  return {
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getStatusText = (status: string) => {
  return status === 'Y' ? '노출' : '숨김'
}
</script>
