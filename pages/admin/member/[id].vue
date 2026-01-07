<!-- Member Detail Page -->
<template>
  <div class="space-y-6">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="bg-white p-6 rounded-lg shadow-md flex justify-center items-center">
      <p class="text-gray-500">로딩 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="bg-white p-6 rounded-lg shadow-md">
      <div class="text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200" @click="router.back()">
          목록으로 돌아가기
        </button>
      </div>
    </div>

    <!-- 회원 정보 -->
    <div v-else-if="member" class="space-y-6 bg-white rounded-lg p-6">
      <!-- 기본 정보 섹션 -->
      <div class="border-b border-gray-200 pb-5">
        <h3 class="text-lg font-medium leading-6 text-gray-900">기본 정보</h3>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">회원 ID</label>
            <input
              v-model="member.member_idx"
              disabled
              class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">회원 등급</label>
            <select
              v-if="isEditing"
              v-model="editedMember.grade"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="M">일반 회원</option>
              <option value="A">관리자</option>
            </select>
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <span :class="getGradeClass(member.grade)">
                {{ getGradeText(member.grade) }}
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">회원 상태</label>
            <select
              v-if="isEditing"
              v-model="editedMember.member_status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Y">활성</option>
              <option value="N">비활성</option>
            </select>
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <span :class="getStatusClass(member.member_status)">
                {{ getStatusText(member.member_status) }}
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ member.id }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">가입 타입</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <span :class="getRegistrationTypeClass(getRegistrationType(member.id))">
                {{ getRegistrationType(member.id) }}
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이름(한글)</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ member.name_kr || '-' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이름(영문)</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ member.name_en || '-' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ member.birthday || '-' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">성별</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ member.gender || '-' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ member.email || '-' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">휴대전화</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ member.phone || '-' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">가입일시</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ formatDate(member.created_at) }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">수정일시</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ formatDate(member.updated_at) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 버튼 섹션 -->
      <div class="mt-6 flex justify-end space-x-4">
        <button v-if="!isEditing" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" @click="startEditing">
          수정
        </button>
        <template v-else>
          <button :disabled="isSaving" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed" @click="saveChanges">
            {{ isSaving ? '저장 중...' : '저장' }}
          </button>
          <button :disabled="isSaving" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" @click="cancelEditing">
            취소
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'
import { useRoute, useRouter } from 'vue-router'
import type { Member, MemberUpdate } from '~/types/admin/member'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface ApiResponse {
  member: Member
}

const route = useRoute()
const router = useRouter()
const member = ref<Member | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isEditing = ref(false)
const editedMember = ref<MemberUpdate | null>(null)
const isSaving = ref(false)

const fetchMember = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await $fetch<ApiResponse>(`/api/admin/member/${route.params.id}`)
    member.value = response.member
  } catch (err) {
    error.value = '회원 정보를 불러오는데 실패했습니다.'
    console.error('Error fetching member:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchMember()
})

const startEditing = () => {
  if (!member.value) return
  
  editedMember.value = {
    grade: member.value.grade,
    member_status: member.value.member_status
  }
  isEditing.value = true
}

const cancelEditing = () => {
  editedMember.value = null
  isEditing.value = false
}

const saveChanges = async () => {
  if (isSaving.value || !editedMember.value) return
  
  try {
    isSaving.value = true
    
    const response = await $fetch(`/api/admin/member/${route.params.id}`, {
      method: 'PUT',
      body: editedMember.value
    })
    
    member.value = response.member
    editedMember.value = null
    isEditing.value = false
    
    alert('회원 정보가 성공적으로 업데이트되었습니다.')
  } catch (err) {
    console.error('Error updating member:', err)
    alert('회원 정보 업데이트에 실패했습니다.')
  } finally {
    isSaving.value = false
  }
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
</script>
