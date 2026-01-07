<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">캐디 이미지</h2>
    
    <div v-if="!isEditing && !hasAnyImages" class="text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-md">
      <p class="text-gray-500">등록된 이미지가 없습니다.</p>
    </div>
    
    <div v-else-if="!isEditing && hasAnyImages" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="image in caddy.images" :key="image.caddyImageIdx" class="relative">
        <img 
          :src="image.imageUrl" 
          :alt="`캐디 이미지 ${image.sort}`" 
          class="w-full h-40 object-cover rounded-md"
        >
        <span class="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
          {{ image.sort }}
        </span>
      </div>
    </div>
    
    <!-- 이미지 편집 UI -->
    <div v-if="isEditing" class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="relative border border-gray-300 rounded-md p-2"
        >
          <img 
            :src="image.imageUrl" 
            :alt="`캐디 이미지 ${image.sort}`" 
            class="w-full h-40 object-cover rounded-md mb-2"
          >
          
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <span class="mr-2">순서:</span>
              <input 
                v-model.number="image.sort" 
                type="number" 
                min="1"
                class="w-16 px-2 py-1 border border-gray-300 rounded-md"
              >
            </div>
            
            <button 
              type="button"
              class="text-red-500 hover:text-red-700"
              @click="removeImage(index)" 
            >
              삭제
            </button>
          </div>
        </div>
        
        <!-- 이미지 추가 버튼 -->
        <div 
          class="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-gray-50"
          @click="openFileInput"
        >
          <span class="text-4xl text-gray-400">+</span>
          <span class="text-gray-500 mt-2">이미지 추가</span>
        </div>
      </div>
      
      <!-- 파일 입력 (숨김) -->
      <input 
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        multiple
        @change="handleFileUpload"
      >
      
      <div v-if="uploadError" class="text-red-500 mt-2">
        {{ uploadError }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from '#imports'
import type { CaddyDetail, CaddyImage } from '~/types/admin/caddy'

const props = defineProps<{
  caddy: CaddyDetail
  editedCaddy: CaddyDetail
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:edited-caddy', value: CaddyDetail): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const uploadError = ref<string | null>(null)
const images = ref<CaddyImage[]>([])

const hasAnyImages = computed(() => {
  return props.caddy.images && props.caddy.images.length > 0
})

// 편집 모드 진입 시 이미지 초기화
watch(() => props.isEditing, (isEditing) => {
  if (isEditing && props.editedCaddy.images) {
    // 깊은 복사를 통해 로컬 이미지 배열 초기화
    images.value = JSON.parse(JSON.stringify(props.editedCaddy.images))
  }
}, { immediate: true })

// 이미지 변경 시 부모 컴포넌트에 업데이트
watch(images, () => {
  if (props.isEditing) {
    const updatedCaddy = { ...props.editedCaddy, images: [...images.value] }
    emit('update:edited-caddy', updatedCaddy)
  }
}, { deep: true })

// 파일 입력 열기
const openFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 이미지 제거
const removeImage = (index: number) => {
  if (images.value) {
    // 이미지에 caddyImageIdx가 있으면 삭제 표시만 하고, 없으면 배열에서 제거
    if (images.value[index].caddyImageIdx) {
      images.value[index].useYn = 'N'
    } else {
      images.value.splice(index, 1)
    }
    
    // 남아있는 이미지의 순서 재정렬
    const activeImages = images.value.filter(img => img.useYn !== 'N')
    activeImages.forEach((img, idx) => {
      img.sort = idx + 1
    })
  }
}

// 파일 업로드 처리
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  uploadError.value = null
  
  try {
    // 각 파일을 이미지로 변환
    for (let i = 0; i < target.files.length; i++) {
      const file = target.files[i]
      
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        uploadError.value = '이미지 크기는 5MB 이하여야 합니다.'
        continue
      }
      
      // 이미지 파일 확인
      if (!file.type.startsWith('image/')) {
        uploadError.value = '이미지 파일만 업로드 가능합니다.'
        continue
      }
      
      const imageUrl = await readFileAsDataURL(file)
      
      // 이미지 배열이 없으면 초기화
      if (!images.value) {
        images.value = []
      }
      
      // 활성화된 이미지 수 계산 (삭제 표시된 이미지 제외)
      const activeImagesCount = images.value.filter(img => img.useYn !== 'N').length
      
      // 새 이미지 추가
      images.value.push({
        caddyImageIdx: 0, // 새 이미지는 0으로 설정
        caddyIdx: props.editedCaddy.caddyIdx,
        imageUrl,
        sort: activeImagesCount + 1,
        useYn: 'Y',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // 파일 데이터 추가 (API 전송용)
        file: file
      })
    }
  } catch (error) {
    console.error('파일 업로드 오류:', error)
    uploadError.value = '이미지 업로드 중 오류가 발생했습니다.'
  }
  
  // 파일 입력 초기화
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 파일을 DataURL로 읽기
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// FTP 이미지 업로드 함수 (서버 API 사용)
const uploadImageToFtp = async (file: any, caddyIdx?: number): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // 파일 유효성 검사
    if (!file || typeof file !== 'object') {
      console.error('유효하지 않은 파일 객체:', file)
      return { success: false, error: '유효하지 않은 파일 객체입니다.' }
    }
    
    // File 객체인지 확인
    if (!(file instanceof File) && !(file instanceof Blob)) {
      console.error('파일이 File 또는 Blob 형식이 아님:', file)
      
      if (file.name && file.type && file.size) {
        console.log('File has name, type, and size properties, attempting to convert to Blob')
        try {
          // 파일 데이터가 있는 경우 Blob로 변환 시도
          if (file.data) {
            const blob = new Blob([file.data], { type: file.type })
            file = blob
          } else {
            return { success: false, error: '파일 데이터가 없습니다.' }
          }
        } catch (e) {
          console.error('Blob 변환 오류:', e)
          return { success: false, error: '파일 변환 중 오류가 발생했습니다.' }
        }
      } else {
        return { success: false, error: '유효하지 않은 파일 형식입니다.' }
      }
    }
    
    // 업로드 경로 생성
    const uploadPath = caddyIdx ? `caddy/${caddyIdx}` : 'caddy'
    
    // FormData 생성 및 파일 추가
    const formData = new FormData()
    
    // 파일명 확인 및 추가
    const fileName = file.name || `image_${Date.now()}.jpg`
    
    // 파일 추가 - 이름을 명시적으로 지정
    formData.append('file', file, fileName)
    formData.append('uploadPath', uploadPath)
    
    // API 요청 전송
    console.log('Sending API request to /api/admin/upload/image')
    const response = await fetch('/api/admin/upload/image', {
      method: 'POST',
      body: formData
    })
    
    // 응답 처리
    const result = await response.json()
    return result
  } catch (error) {
    console.error('File upload error:', error)
    return { success: false, error: '파일 업로드 중 오류가 발생했습니다.' }
  }
}

// 모든 이미지 업로드 처리
const uploadAllImages = async (): Promise<boolean> => {
  try {
    console.log('Starting uploadAllImages for caddy images')
    
    // 파일이 있는 이미지만 필터링
    const imagesToUpload = images.value.filter((img) => {
      return img.file && img.useYn === 'Y'
    })
    
    console.log(`Found ${imagesToUpload.length} caddy images to upload`)
    
    if (imagesToUpload.length === 0) {
      // 업로드할 파일이 없으면 바로 성공 처리
      return true
    }
    
    // 모든 이미지 업로드 처리
    for (const image of imagesToUpload) {
      if (image.file) {
        if (typeof image.imageUrl === 'string' && image.imageUrl.startsWith('data:')) {
          try {
            // 데이터 URL에서 Blob 생성
            const response = await fetch(image.imageUrl)
            const blob = await response.blob()
            
            // 파일이 있으면 FTP 업로드 진행
            const uploadResult = await uploadImageToFtp(blob, props.editedCaddy.caddyIdx)
            
            if (uploadResult.success && uploadResult.url) {
              // 업로드 성공 시 URL 업데이트
              image.imageUrl = uploadResult.url
              
              // 파일 참조 제거 (이미 업로드됨)
              image.file = null
            } else {
              // 업로드 실패 시 오류 처리
              uploadError.value = uploadResult.error || '이미지 업로드 실패'
              return false
            }
          } catch (error) {
            console.error('Blob 생성 오류:', error)
            uploadError.value = 'Blob 생성 중 오류가 발생했습니다.'
            return false
          }
        } else {
          // 일반 파일 업로드 시도
          try {
            const uploadResult = await uploadImageToFtp(image.file, props.editedCaddy.caddyIdx)
            
            if (uploadResult.success && uploadResult.url) {
              // 업로드 성공 시 URL 업데이트
              image.imageUrl = uploadResult.url
              image.file = null
            } else {
              // 업로드 실패 시 오류 처리
              uploadError.value = uploadResult.error || '이미지 업로드 실패'
              return false
            }
          } catch (error) {
            console.error('파일 업로드 오류:', error)
            uploadError.value = '파일 업로드 중 오류가 발생했습니다.'
            return false
          }
        }
      }
    }
    
    return true
  } catch (error) {
    console.error('이미지 업로드 오류:', error)
    uploadError.value = '이미지 업로드 중 오류가 발생했습니다.'
    return false
  }
}

// 이미지 저장 함수 (부모 컴포넌트에서 호출할 수 있도록 expose)
const saveImages = async (): Promise<boolean> => {
  try {
    // 모든 이미지 업로드 처리
    const uploadSuccess = await uploadAllImages()
    if (!uploadSuccess) {
      return false
    }
    
    return true
  } catch (error) {
    console.error('이미지 저장 오류:', error)
    uploadError.value = '이미지 저장 중 오류가 발생했습니다.'
    return false
  }
}

// 외부에서 접근 가능한 메서드 노출
defineExpose({
  saveImages
})
</script>
