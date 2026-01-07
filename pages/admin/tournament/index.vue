<!-- Tournament Management Page -->
<template>
  <div class="space-y-6">
    <!-- 검색 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">대회 검색</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">대회 상태</label>
          <select
            v-model="searchParams.tournamentStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option value="Y">노출</option>
            <option value="N">숨김</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">대회 시작일</label>
          <input
            v-model="searchParams.startDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">대회 종료일</label>
          <input
            v-model="searchParams.endDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">대회 ID, 타이틀(한글), 타이틀(영문)</label>
          <input
            v-model="searchParams.searchWord"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="대회 ID, 타이틀(한글), 타이틀(영문) 입력"
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

    <!-- 추가 버튼 -->
    <div class="flex justify-end">
      <button
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        @click="handleCreate"
      >
        + 신규 대회 등록
      </button>
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
            <tr v-for="tournament in tournaments" :key="tournament.tournament_idx" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="handleRowClick(tournament.tournament_idx)">
                <span :class="getStatusClass(tournament.tournament_status)">
                  {{ getStatusText(tournament.tournament_status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="handleRowClick(tournament.tournament_idx)">{{ tournament.tournament_idx }}</td>
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="handleRowClick(tournament.tournament_idx)">{{ tournament.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="handleRowClick(tournament.tournament_idx)">{{ tournament.title_en }}</td>
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="handleRowClick(tournament.tournament_idx)">{{ formatPrice(tournament.price) }}</td>
              <td class="px-6 py-4 whitespace-nowrap" @click.stop>
                <button
                  class="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                  @click="handleViewRegistrations(tournament.tournament_idx)"
                >
                  신청자 조회
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="handleRowClick(tournament.tournament_idx)">{{ formatDate(tournament.start_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="handleRowClick(tournament.tournament_idx)">{{ formatDate(tournament.end_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="handleRowClick(tournament.tournament_idx)">{{ formatDate(tournament.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="handleRowClick(tournament.tournament_idx)">{{ formatDate(tournament.updated_at) }}</td>
            </tr>
            <tr v-if="tournaments.length === 0">
              <td :colspan="tableHeaders.length" class="px-6 py-4 text-center text-gray-500">
                검색 결과가 없습니다
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'
import type { Tournament, TournamentSearchParams } from '~/types/admin/tournament'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const searchParams = ref<TournamentSearchParams>({
  searchWord: '',
  tournamentStatus: '',
  startDate: '',
  endDate: ''
})

const tournaments = ref<Tournament[]>([])

const tableHeaders = [
  { key: 'tournament_status', label: '대회 상태' },
  { key: 'tournament_idx', label: '대회 ID' },
  { key: 'title', label: '타이틀(한글)' },
  { key: 'title_en', label: '타이틀(영문)' },
  { key: 'price', label: '판매가' },
  { key: 'registrations', label: '신청자 조회' },
  { key: 'start_date', label: '시작일' },
  { key: 'end_date', label: '종료일' },
  { key: 'created_at', label: '등록일시' },
  { key: 'updated_at', label: '수정일시' }
]

const handleReset = () => {
  searchParams.value = {
    searchWord: '',
    tournamentStatus: '',
    startDate: '',
    endDate: ''
  }
}

const handleSearch = async () => {
  try {
    const response = await $fetch('/api/admin/tournament/search', {
      method: 'GET',
      params: {
        ...searchParams.value,
        // Only include non-empty values
        searchWord: searchParams.value.searchWord || undefined,
        tournamentStatus: searchParams.value.tournamentStatus || undefined,
        startDate: searchParams.value.startDate || undefined,
        endDate: searchParams.value.endDate || undefined
      }
    })
    tournaments.value = response.tournaments
  } catch (error) {
    console.error('대회 검색 중 오류 발생:', error)
  }
}

const handleRowClick = (tournamentIdx: number) => {
  navigateTo(`/admin/tournament/${tournamentIdx}`)
}

const handleCreate = () => {
  navigateTo('/admin/tournament/create')
}

const handleViewRegistrations = (tournamentIdx: number) => {
  navigateTo(`/admin/tournament/${tournamentIdx}/register`)
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ko-KR')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

const getStatusClass = (status: string) => {
  return {
    'px-2 py-1 text-xs rounded-full': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getStatusText = (status: string) => {
  return status === 'Y' ? '노출' : '숨김'
}

// Load tournaments on page load
onMounted(() => {
  handleSearch()
})
</script>
