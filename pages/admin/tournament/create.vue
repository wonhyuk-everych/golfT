<!-- Tournament Creation Page -->
<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-4">신규 대회 등록</h2>

      <!-- 기본 정보 섹션 -->
      <div class="border-b border-gray-200 pb-5 mb-5">
        <h3 class="text-lg font-medium leading-6 text-gray-900">기본 정보</h3>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">대회 상태</label>
            <select
              v-model="newTournament.tournament_status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Y">노출</option>
              <option value="N">숨김</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">타이틀(한글) *</label>
            <input
              v-model="newTournament.title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': validationErrors.title }"
            >
            <p v-if="validationErrors.title" class="mt-1 text-sm text-red-600">
              {{ validationErrors.title }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">타이틀(영문) *</label>
            <input
              v-model="newTournament.title_en"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': validationErrors.title_en }"
            >
            <p v-if="validationErrors.title_en" class="mt-1 text-sm text-red-600">
              {{ validationErrors.title_en }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">판매가 *</label>
            <input
              v-model.number="newTournament.price"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': validationErrors.price }"
            >
            <p v-if="validationErrors.price" class="mt-1 text-sm text-red-600">
              {{ validationErrors.price }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">판매가 설명</label>
            <input
              v-model="newTournament.price_explain"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': validationErrors.price_explain }"
            >
            <p v-if="validationErrors.price_explain" class="mt-1 text-sm text-red-600">
              {{ validationErrors.price_explain }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">시작일</label>
            <input
              v-model="newTournament.start_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">종료일</label>
            <input
              v-model="newTournament.end_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이미지 업로드 사용</label>
            <select
              v-model="newTournament.image_use_yn"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이미지 업로드 타이틀</label>
            <input
              v-model="newTournament.image_title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :disabled="newTournament.image_use_yn !== 'Y'"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이미지 필수 유무</label>
            <div class="flex items-center h-10">
              <input
                v-model="newTournament.image_important_yn"
                type="checkbox"
                true-value="Y"
                false-value="N"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                :disabled="newTournament.image_use_yn !== 'Y'"
              >
              <span class="ml-2 text-sm text-gray-600">이미지 업로드 필수</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 콘텐츠 섹션 -->
      <ContentSection 
        :model-value="newTournament.content || '[]'" 
        :is-editing="true"
        @update:model-value="val => { newTournament.content = val; }" 
      />
      <p v-if="validationErrors.content" class="mt-1 text-sm text-red-600">
        {{ validationErrors.content }}
      </p>

      <!-- 이미지 섹션 -->
      <ImageUploadSection 
        v-model="newTournament.images"
        :is-editing="true"
        :validation-errors="validationErrors"
      />

      <!-- 버튼 섹션 -->
      <div class="flex justify-end space-x-4 mt-6">
        <button 
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          @click="goBack"
        >
          취소
        </button>
        <button 
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          :disabled="isSaving"
          @click="saveTournament"
        >
          {{ isSaving ? '저장 중...' : '대회 저장하기' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from '#imports'
import { useRouter } from 'vue-router'
import type { Tournament } from '~/types/admin/tournament'
import ContentSection from '~/components/admin/tournament/ContentSection.vue'
import ImageUploadSection from '~/components/admin/tournament/ImageUploadSection.vue'

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

const router = useRouter()
const isSaving = ref(false)
const validationErrors = reactive<Record<string, string>>({})

// Initialize new tournament
const newTournament = reactive<Tournament>({
  title: '',
  title_en: '',
  price: 0,
  tournament_status: 'Y',
  content: '[]',
  start_date: '',
  end_date: '',
  image_use_yn: 'N',
  image_title: '',
  image_important_yn: 'N',
  images: []
})

const validateForm = (): boolean => {
  validationErrors.title = !newTournament.title ? '타이틀(한글)을 입력해주세요.' : ''
  validationErrors.title_en = !newTournament.title_en ? '타이틀(영문)을 입력해주세요.' : ''
  validationErrors.price = !newTournament.price ? '판매가를 입력해주세요.' : ''
  validationErrors.content = !newTournament.content ? '대회 콘텐츠를 입력해주세요.' : ''
  
  // Validate images by type
  if (newTournament.images && newTournament.images.length > 0) {
    const thumbnailImages = newTournament.images.filter(img => img.image_type === 'T')
    const mainImages = newTournament.images.filter(img => img.image_type === 'M')
    const explanationImages = newTournament.images.filter(img => img.image_type === 'E')
    
    thumbnailImages.forEach((img, index) => {
      const key = `image_file_T_${index}`
      validationErrors[key] = !img.file ? '이미지 파일을 선택해주세요.' : ''
    })
    
    mainImages.forEach((img, index) => {
      const key = `image_file_M_${index}`
      validationErrors[key] = !img.file ? '이미지 파일을 선택해주세요.' : ''
    })
    
    explanationImages.forEach((img, index) => {
      const key = `image_file_E_${index}`
      validationErrors[key] = !img.file ? '이미지 파일을 선택해주세요.' : ''
    })
  }
  
  // Check if there are any errors
  return !Object.values(validationErrors).some(error => error)
}

const saveTournament = async () => {
  if (!validateForm()) return
  
  try {
    isSaving.value = true
    
    // 이미지 파일 업로드 처리
    if (newTournament.images && newTournament.images.length > 0) {
      for (const image of newTournament.images) {
        if (image.file) {
          // 파일이 있으면 FTP 업로드 진행
          const uploadResult = await uploadImageToFtp(image.file)
          
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
    const tournamentDataToSave = JSON.parse(JSON.stringify(newTournament))
    if (tournamentDataToSave.images) {
      tournamentDataToSave.images = tournamentDataToSave.images.map((img: TournamentImage) => {
        const { file, ...imageData } = img
        return imageData
      })
    }
    
    const response = await $fetch('/api/admin/tournament/create', {
      method: 'POST',
      body: tournamentDataToSave
    })
    
    alert('대회가 성공적으로 생성되었습니다.')
    
    // Redirect to the newly created tournament's detail page
    if (response.tournament && response.tournament.tournament_idx) {
      router.push(`/admin/tournament/${response.tournament.tournament_idx}`)
    } else {
      router.push('/admin/tournament')
    }
  } catch (error) {
    console.error('대회 생성 중 오류 발생:', error)
    alert('대회 생성에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.back()
}

// FTP 이미지 업로드 함수 (서버 API 사용)
const uploadImageToFtp = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // FormData 생성
    const formData = new FormData()
    formData.append('file', file)
    formData.append('uploadPath', 'tournament')
    
    // 이미지 업로드 API 호출
    const response = await fetch('/api/admin/upload/image', {
      method: 'POST',
      body: formData
    })
    
    const result = await response.json()
    return result
  } catch (err) {
    console.error('이미지 업로드 실패:', err)
    return { success: false, error: '이미지 업로드 중 오류가 발생했습니다.' }
  }
}

// Add initial empty images for each type
onMounted(() => {
  newTournament.images = [
    { image_url: '', image_type: 'T', sort: 1, main_yn: 'Y', use_yn: 'Y', file: null }, // 썸네일: 항상 sort=1, main_yn=Y
    { image_url: '', image_type: 'M', sort: 1, main_yn: 'Y', use_yn: 'Y', file: null },
    { image_url: '', image_type: 'E', sort: 1, main_yn: 'Y', use_yn: 'Y', file: null }
  ]
})
</script>
