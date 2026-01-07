<!-- Event Creation Page -->
<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg p-6 shadow-md">
      <h2 class="text-xl font-semibold mb-4">신규 이벤트 등록</h2>

      <!-- 기본 정보 섹션 -->
      <div class="border-b border-gray-200 pb-5 mb-5">
        <h3 class="text-lg font-medium leading-6 text-gray-900">기본 정보</h3>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이벤트 상태</label>
            <select
              v-model="newEvent.event_status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Y">노출</option>
              <option value="N">숨김</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">타이틀 *</label>
            <input
              v-model="newEvent.title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              :class="{ 'border-red-500': validationErrors.title }"
            />
            <p v-if="validationErrors.title" class="mt-1 text-sm text-red-600">
              {{ validationErrors.title }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">시작일</label>
            <input
              v-model="newEvent.start_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">종료일</label>
            <input
              v-model="newEvent.end_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <!-- 이미지 섹션 -->
      <div class="mb-5">
        <h3 class="text-lg font-medium leading-6 text-gray-900">이벤트 이미지</h3>
        
        <div class="mt-4">
          <div v-for="(image, index) in newEvent.images" :key="index" class="flex items-center mb-4 bg-gray-50 p-3 rounded-md">
            <div class="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
              <img v-if="image.file" :src="getImagePreview(image.file)" class="w-full h-full object-cover" :alt="`이벤트 이미지 ${index + 1}`">
              <img v-else-if="image.image_url" :src="image.image_url" class="w-full h-full object-cover" :alt="`이벤트 이미지 ${index + 1}`">
              <span v-else class="text-gray-400">이미지 없음</span>
            </div>
            <div class="ml-4 flex-grow space-y-2">
              <div class="flex gap-4">
                <div class="flex-grow">
                  <label class="block text-sm font-medium text-gray-700 mb-1">이미지 파일 *</label>
                  <div v-if="image.file" class="text-sm text-gray-600 mb-1">
                    선택된 파일: {{ image.file.name }}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    :class="{ 'border-red-500': validationErrors[`image_file_${index}`] }"
                    @change="(e) => handleFileChange(e, index)"
                  />
                  <p v-if="validationErrors[`image_file_${index}`]" class="mt-1 text-sm text-red-600">
                    {{ validationErrors[`image_file_${index}`] }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                  <input v-model.number="image.sort" type="number" class="w-20 px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div class="flex gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">메인이미지</label>
                  <select v-model="image.main_yn" class="px-3 py-2 border border-gray-300 rounded-md">
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">사용여부</label>
                  <select v-model="image.use_yn" class="px-3 py-2 border border-gray-300 rounded-md">
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div class="flex items-end">
                  <button 
                    @click="removeImage(index)" 
                    class="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            @click="addImage" 
            class="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            + 이미지 추가
          </button>
        </div>
      </div>

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
          @click="saveEvent"
        >
          {{ isSaving ? '저장 중...' : '이벤트 저장하기' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from '#imports'
import { useRouter } from 'vue-router'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface EventImage {
  event_image_idx?: number
  event_idx?: number
  image_url: string
  sort: number
  main_yn: string
  use_yn: string
  file?: File | null // 파일 객체 추가
}

interface Event {
  event_idx?: number
  title: string
  start_date: string
  end_date: string
  event_status: string
  created_at?: string
  created_member_idx?: number
  updated_at?: string | null
  updated_member_idx?: number | null
  images: EventImage[]
}

const router = useRouter()
const isSaving = ref(false)
const validationErrors = reactive<Record<string, string>>({})

// Initialize new event
const newEvent = reactive<Event>({
  title: '',
  start_date: '',
  end_date: '',
  event_status: 'Y',
  images: []
})

const addImage = () => {
  const newImage: EventImage = {
    image_url: '',
    sort: newEvent.images.length + 1,
    main_yn: newEvent.images.length === 0 ? 'Y' : 'N',
    use_yn: 'Y',
    file: null // 파일 객체 초기화
  }
  
  newEvent.images.push(newImage)
}

const removeImage = (index: number) => {
  newEvent.images.splice(index, 1)
  
  // 순서 재정렬
  newEvent.images.forEach((img, idx) => {
    img.sort = idx + 1
  })
}

const validateForm = (): boolean => {
  validationErrors.title = !newEvent.title ? '타이틀을 입력해주세요.' : ''
  
  // Validate images
  if (newEvent.images && newEvent.images.length > 0) {
    newEvent.images.forEach((img, index) => {
      const key = `image_file_${index}`
      validationErrors[key] = !img.file ? '이미지 파일을 선택해주세요.' : ''
    })
  }
  
  // Check if there are any errors
  return !Object.values(validationErrors).some(error => error)
}

// 파일 선택 핸들러
const handleFileChange = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    if (newEvent.images) {
      newEvent.images[index].file = file
    }
  }
}

// 이미지 미리보기 URL 생성
const getImagePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

// FTP 이미지 업로드 함수 (서버 API 사용)
const uploadImageToFtp = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // FormData 생성
    const formData = new FormData()
    formData.append('file', file)
    formData.append('uploadPath', 'event')
    
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

const saveEvent = async () => {
  if (!validateForm()) return
  
  try {
    isSaving.value = true
    
    // 이미지 파일 업로드 처리
    if (newEvent.images && newEvent.images.length > 0) {
      for (const image of newEvent.images) {
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
    
    // 이벤트 정보 저장 (파일 객체는 제외하고 전송)
    const eventDataToSave = JSON.parse(JSON.stringify(newEvent))
    if (eventDataToSave.images) {
      eventDataToSave.images = eventDataToSave.images.map((img: EventImage) => {
        const { file, ...imageData } = img
        return imageData
      })
    }
    
    const response = await $fetch('/api/admin/event/create', {
      method: 'POST',
      body: eventDataToSave
    })
    
    alert('이벤트가 성공적으로 생성되었습니다.')
    
    // Redirect to the newly created event's detail page
    if (response.event && response.event.event_idx) {
      router.push(`/admin/event/${response.event.event_idx}`)
    } else {
      router.push('/admin/event')
    }
  } catch (error) {
    console.error('이벤트 생성 중 오류 발생:', error)
    alert('이벤트 생성에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.back()
}

// Add an initial empty image
onMounted(() => {
  addImage()
})
</script>
