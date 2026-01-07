<!-- Tournament Detail Page -->
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

    <!-- 대회 정보 -->
    <div v-else-if="tournament" class="space-y-6 bg-white rounded-lg p-6">
      <!-- 기본 정보 섹션 -->
      <div class="border-b border-gray-200 pb-5">
        <h3 class="text-lg font-medium leading-6 text-gray-900">기본 정보</h3>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">대회 ID</label>
            <input
              v-model="tournament.tournament_idx"
              disabled
              class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">대회 상태</label>
            <select
              v-if="isEditing"
              v-model="editedTournament.tournament_status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :disabled="isSaving"
            >
              <option value="Y">노출</option>
              <option value="N">숨김</option>
            </select>
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <span :class="getStatusClass(tournament.tournament_status)">
                {{ getStatusText(tournament.tournament_status) }}
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">타이틀(한글)</label>
            <input
              v-if="isEditing"
              v-model="editedTournament.title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ tournament.title }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">타이틀(영문)</label>
            <input
              v-if="isEditing"
              v-model="editedTournament.title_en"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ tournament.title_en }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">판매가</label>
            <input
              v-if="isEditing"
              v-model.number="editedTournament.price"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ formatPrice(tournament.price) }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">판매가 설명</label>
            <input
              v-if="isEditing"
              v-model="editedTournament.price_explain"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ tournament.price_explain }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">시작일</label>
            <input
              v-if="isEditing"
              v-model="editedTournament.start_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ formatDate(tournament.start_date) }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">종료일</label>
            <input
              v-if="isEditing"
              v-model="editedTournament.end_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ formatDate(tournament.end_date) }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이미지 업로드 사용</label>
            <select
              v-if="isEditing"
              v-model="editedTournament.image_use_yn"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ tournament.image_use_yn === 'Y' ? '사용' : '미사용' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이미지 업로드 타이틀</label>
            <input
              v-if="isEditing"
              v-model="editedTournament.image_title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :disabled="editedTournament.image_use_yn !== 'Y'"
            >
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ tournament.image_title || '-' }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이미지 필수 유무</label>
            <div v-if="isEditing" class="flex items-center h-10">
              <input
                v-model="editedTournament.image_important_yn"
                type="checkbox"
                true-value="Y"
                false-value="N"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                :disabled="editedTournament.image_use_yn !== 'Y'"
              >
              <span class="ml-2 text-sm text-gray-600">이미지 업로드 필수</span>
            </div>
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ tournament.image_important_yn === 'Y' ? '필수' : '선택' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 콘텐츠 섹션 -->
      <ContentSection 
        :model-value="isEditing ? (editedTournament ? editedTournament.content : '[]') : (tournament ? tournament.content : '[]')" 
        :is-editing="isEditing"
        @update:model-value="val => { if (editedTournament) editedTournament.content = val; }" 
      />

      <!-- 이미지 섹션 -->
      <ImageUploadSection 
        :model-value="isEditing ? editedTournament.images : tournament.images"
        :is-editing="isEditing"
        @update:model-value="val => { if (isEditing && editedTournament) editedTournament.images = val; }"
      />

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
import ContentSection from '~/components/admin/tournament/ContentSection.vue'
import ImageUploadSection from '~/components/admin/tournament/ImageUploadSection.vue'
import { useRoute, useRouter } from 'vue-router'
import type { Tournament } from '~/types/admin/tournament'

interface TournamentImage {
  tournament_image_idx?: number;
  tournament_idx?: number;
  image_url: string;
  image_type: string; // T: 썸네일, M: 메인, E: 설명
  sort: number;
  main_yn: string;
  use_yn: string;
  created_at?: string;
  created_member_idx?: number;
  updated_at?: string;
  updated_member_idx?: number | null;
  file?: File | null; // 파일 객체 추가
}

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface ApiResponse {
  tournament: Tournament
}

const route = useRoute()
const router = useRouter()
const tournament = ref<Tournament | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isEditing = ref(false)
const editedTournament = ref<Tournament | null>(null)
const isSaving = ref(false)

const fetchTournament = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await $fetch<ApiResponse>(`/api/admin/tournament/${route.params.id}`)
    tournament.value = response.tournament
  } catch (err) {
    error.value = '대회 정보를 불러오는데 실패했습니다.'
    console.error('Error fetching tournament:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchTournament()
})

const startEditing = () => {
  editedTournament.value = JSON.parse(JSON.stringify(tournament.value))
  isEditing.value = true
}

const cancelEditing = () => {
  editedTournament.value = null
  isEditing.value = false
}

const saveChanges = async () => {
  if (isSaving.value || !editedTournament.value) return
  
  try {
    isSaving.value = true
    error.value = null

    // 파일 업로드 처리
    if (editedTournament.value.images) {
      for (const image of editedTournament.value.images) {
        if (image.file) {
          // 파일이 있으면 FTP 업로드 진행
          const uploadResult = await uploadImageToFtp(image.file, editedTournament.value.tournament_idx)
          
          if (uploadResult.success && uploadResult.url) {
            // 업로드 성공 시 URL 업데이트
            image.image_url = uploadResult.url
          } else {
            // 업로드 실패 시 에러 처리
            throw new Error(uploadResult.error || '이미지 업로드 실패')
          }
        }
      }
    }

    // 대회 정보 저장 (파일 객체는 제외하고 전송)
    const tournamentDataToSave = JSON.parse(JSON.stringify(editedTournament.value))
    if (tournamentDataToSave.images) {
      tournamentDataToSave.images = tournamentDataToSave.images.map((img: TournamentImage) => {
        const { file, ...imageData } = img
        return imageData
      })
    }
    
    const response = await $fetch<ApiResponse>(`/api/admin/tournament/${route.params.id}`, {
      method: 'PUT',
      body: tournamentDataToSave
    })
    
    tournament.value = response.tournament
    editedTournament.value = null
    isEditing.value = false
    
    alert('대회 정보가 성공적으로 업데이트되었습니다.')
  } catch (err) {
    console.error('Error updating tournament:', err)
    error.value = '대회 정보 업데이트에 실패했습니다.'
  } finally {
    isSaving.value = false
  }
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
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getStatusText = (status: string) => {
  return status === 'Y' ? '노출' : '숨김'
}

// FTP 이미지 업로드 함수 (서버 API 사용)
const uploadImageToFtp = async (file: File, tournamentIdx?: number): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // 업로드 경로 설정 (tournament/{tournament_idx})
    const uploadPath = tournamentIdx ? `tournament/${tournamentIdx}` : 'tournament'
    
    // FormData 생성
    const formData = new FormData()
    formData.append('file', file)
    formData.append('uploadPath', uploadPath)
    
    // 이미지 업로드 API 호출
    const response = await fetch('/api/admin/upload/image', {
      method: 'POST',
      body: formData
    })
    
    const result = await response.json()
    return result
  } catch (err) {
    console.error('이미지 업로드 실패:', err)
    return {
      success: false,
      error: '이미지 업로드 중 오류가 발생했습니다.'
    }
  }
}
</script>
