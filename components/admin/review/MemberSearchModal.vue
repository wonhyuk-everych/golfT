<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-16 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- 헤더 -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">회원 검색</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="$emit('close')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 검색 필터 -->
        <div class="mb-4">
          <div class="flex space-x-2">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="회원 ID 또는 이름으로 검색"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleSearch"
            >
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              @click="handleSearch"
            >
              검색
            </button>
          </div>
        </div>

        <!-- 검색 결과 -->
        <div class="border rounded-md overflow-hidden">
          <div class="max-h-96 overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IDX</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">선택</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="member in members" :key="member.member_idx" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ member.member_idx }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ member.id }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ member.name_kr || member.name_en || '-' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ member.email || '-' }}</td>
                  <td class="px-4 py-3">
                    <span :class="getStatusClass(member.member_status)">
                      {{ getStatusText(member.member_status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button
                      class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      @click="selectMember(member)"
                    >
                      선택
                    </button>
                  </td>
                </tr>
                <tr v-if="!isLoading && members.length === 0">
                  <td colspan="6" class="px-4 py-6 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
                <tr v-if="isLoading">
                  <td colspan="6" class="px-4 py-6 text-center text-gray-500">
                    검색 중...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 결과 카운트 -->
        <div v-if="members.length > 0" class="mt-4 text-sm text-gray-600">
          총 {{ members.length }}건
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from '#imports'

const emit = defineEmits<{
  select: [member: { idx: number; name: string; id: string }]
  close: []
}>()

const searchKeyword = ref('')
const members = ref<Array<{
  member_idx: number
  id: string
  name_kr: string | null
  name_en: string | null
  email: string | null
  member_status: string
}>>([])
const isLoading = ref(false)

const getStatusClass = (status: string) => {
  const base = 'px-2 py-1 rounded text-xs font-medium'
  if (status === 'Y') return `${base} bg-green-100 text-green-800`
  return `${base} bg-gray-200 text-gray-700`
}

const getStatusText = (status: string) => {
  return status === 'Y' ? '정상' : '중지'
}

const fetchMembers = async () => {
  try {
    isLoading.value = true
    const queryParams = new URLSearchParams({
      searchWord: searchKeyword.value
    })

    const res = await $fetch(`/api/admin/member?${queryParams.toString()}`)
    members.value = (res as { members: typeof members.value }).members || []
  } catch (e) {
    console.error('회원 검색 실패:', e)
    alert('회원 검색에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  fetchMembers()
}

const selectMember = (member: typeof members.value[0]) => {
  emit('select', {
    idx: member.member_idx,
    name: member.name_kr || member.name_en || member.id,
    id: member.id
  })
}
</script>

<style scoped>
</style>
