<!-- Member Management Page -->
<template>
  <div class="space-y-6">
    <!-- 검색 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">회원 검색</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">회원 상태</label>
          <select
            v-model="searchParams.memberStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option value="Y">활성</option>
            <option value="N">비활성</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">회원 등급</label>
          <select
            v-model="searchParams.grade"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">전체</option>
            <option value="M">일반 회원</option>
            <option value="A">관리자</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">가입일 시작</label>
          <input
            v-model="searchParams.startDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">가입일 종료</label>
          <input
            v-model="searchParams.endDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">회원 검색</label>
          <input
            v-model="searchParams.searchWord"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="ID, 이름, 이메일, 휴대전화로 검색"
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
            <tr v-for="member in members" :key="member.member_idx" class="hover:bg-gray-50 cursor-pointer" @click="handleRowClick(member.member_idx)">
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(member.member_status)">
                  {{ getStatusText(member.member_status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getGradeClass(member.grade)">
                  {{ getGradeText(member.grade) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRegistrationTypeClass(getRegistrationType(member.id))">
                  {{ getRegistrationType(member.id) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ member.member_idx }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ member.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ member.name_kr || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ member.email || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ member.phone || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(member.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(member.updated_at) }}</td>
            </tr>
            <tr v-if="members.length === 0">
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
import type { Member, MemberSearchParams } from '~/types/admin/member'
import { useRouter } from 'vue-router'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const router = useRouter()

const searchParams = ref<MemberSearchParams>({
  searchWord: '',
  memberStatus: '',
  grade: '',
  startDate: '',
  endDate: ''
})

const members = ref<Member[]>([])
const isLoading = ref(false)

const tableHeaders = [
  { key: 'member_status', label: '회원 상태' },
  { key: 'grade', label: '회원 등급' },
  { key: 'registration_type', label: '가입 타입' },
  { key: 'member_idx', label: '회원 ID' },
  { key: 'id', label: '아이디' },
  { key: 'name_kr', label: '이름' },
  { key: 'email', label: '이메일' },
  { key: 'phone', label: '휴대전화' },
  { key: 'created_at', label: '가입일시' },
  { key: 'updated_at', label: '수정일시' }
]

const handleReset = () => {
  searchParams.value = {
    searchWord: '',
    memberStatus: '',
    grade: '',
    startDate: '',
    endDate: ''
  }
}

const handleSearch = async () => {
  try {
    isLoading.value = true
    
    const queryParams = new URLSearchParams()
    
    if (searchParams.value.searchWord) {
      queryParams.append('searchWord', searchParams.value.searchWord)
    }
    
    if (searchParams.value.memberStatus) {
      queryParams.append('memberStatus', searchParams.value.memberStatus)
    }
    
    if (searchParams.value.grade) {
      queryParams.append('grade', searchParams.value.grade)
    }
    
    if (searchParams.value.startDate) {
      queryParams.append('startDate', searchParams.value.startDate)
    }
    
    if (searchParams.value.endDate) {
      queryParams.append('endDate', searchParams.value.endDate)
    }
    
    const response = await $fetch('/api/admin/member?' + queryParams.toString())
    members.value = response.members
  } catch (err) {
    console.error('회원 검색 중 오류가 발생했습니다:', err)
    alert('회원 검색 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

const handleRowClick = (memberId: number) => {
  router.push(`/admin/member/${memberId}`)
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  return {
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getStatusText = (status: string) => {
  return status === 'Y' ? '활성' : '비활성'
}

const getGradeClass = (grade: string) => {
  return {
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-blue-100 text-blue-800': grade === 'A',
    'bg-gray-100 text-gray-800': grade === 'M'
  }
}

const getGradeText = (grade: string) => {
  return grade === 'A' ? '관리자' : '일반 회원'
}

const getRegistrationType = (id: string): string => {
  if (!id) return '일반'
  
  if (id.startsWith('naver_')) {
    return '네이버'
  } else if (id.startsWith('google_')) {
    return '구글'
  } else if (id.startsWith('kakao_')) {
    return '카카오'
  }
  
  return '일반'
}

const getRegistrationTypeClass = (type: string) => {
  return {
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-green-100 text-green-800': type === '네이버',
    'bg-yellow-100 text-yellow-800': type === '카카오',
    'bg-blue-100 text-blue-800': type === '구글',
    'bg-gray-100 text-gray-800': type === '일반'
  }
}

// Load members on page load
onMounted(() => {
  handleSearch()
})
</script>
