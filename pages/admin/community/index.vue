<!-- Community Management Page -->
<template>
  <div class="space-y-6">
    <!-- 검색 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">커뮤니티 검색</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">게시글 상태</label>
          <select
            v-model="searchParams.useYn"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option value="Y">활성화</option>
            <option value="N">비활성화</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">국가</label>
          <select
            v-model="searchParams.countryCodeIdx"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option v-for="country in countryCodes" :key="country.countryCodeIdx" :value="country.countryCodeIdx">
              {{ country.countryName }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">제목 또는 내용</label>
          <input
            v-model="searchParams.searchWord"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="게시글 제목 또는 내용 입력"
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
            <tr v-for="community in communities" :key="community.community_idx" class="hover:bg-gray-50 cursor-pointer" @click="handleRowClick(community.community_idx)">
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(community.use_yn)">
                  {{ getStatusText(community.use_yn) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ community.community_idx }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ community.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ community.country_name || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ community.member_name || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(community.created_at) }}</td>
            </tr>
            <tr v-if="communities.length === 0">
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
import { ref, onMounted } from '#imports'
import type { Community, CommunitySearchParams } from '~/types/admin/community'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface CountryCode {
  countryCodeIdx: number;
  countryCode: string;
  countryName: string;
}

const searchParams = ref<CommunitySearchParams>({
  searchWord: '',
  countryCodeIdx: '',
  useYn: ''
})

const communities = ref<Community[]>([])
const countryCodes = ref<CountryCode[]>([])

const tableHeaders = [
  { key: 'use_yn', label: '상태' },
  { key: 'community_idx', label: 'ID' },
  { key: 'title', label: '제목' },
  { key: 'country_name', label: '국가' },
  { key: 'member_name', label: '작성자' },
  { key: 'created_at', label: '작성일' }
]

const handleReset = () => {
  searchParams.value = {
    searchWord: '',
    countryCodeIdx: '',
    useYn: ''
  }
}

const handleSearch = async () => {
  try {
    const response = await $fetch('/api/admin/community/search', {
      method: 'GET',
      params: {
        ...searchParams.value,
        // Only include non-empty values
        searchWord: searchParams.value.searchWord || undefined,
        countryCodeIdx: searchParams.value.countryCodeIdx || undefined,
        useYn: searchParams.value.useYn || undefined
      }
    })
    communities.value = response.communities
  } catch (error) {
    console.error('커뮤니티 검색 중 오류 발생:', error)
  }
}

const handleRowClick = (communityIdx: number) => {
  navigateTo(`/admin/community/${communityIdx}`)
}

const fetchCountryCodes = async () => {
  try {
    const response = await $fetch('/api/admin/country-codes')
    countryCodes.value = response.countryCodes
  } catch (error) {
    console.error('국가 코드 조회 중 오류 발생:', error)
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ko-KR')
}



const getStatusClass = (status: string) => {
  return {
    'px-2 py-1 text-xs rounded-full': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getStatusText = (status: string) => {
  return status === 'Y' ? '활성화' : '비활성화'
}

// Load data on page load
onMounted(() => {
  fetchCountryCodes()
  handleSearch()
})
</script>
