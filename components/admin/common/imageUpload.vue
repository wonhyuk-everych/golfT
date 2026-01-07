<template>
  <div class="space-y-4">
    <h3 v-if="title" class="text-lg font-medium leading-6 text-gray-900">{{ title }}</h3>
    
    <!-- 이미지 표시 모드 (편집 아닐 때) -->
    <div v-if="!isEditing && !hasImages" class="text-center py-8 bg-gray-50 rounded-md">
      <p class="text-gray-500">등록된 이미지가 없습니다</p>
    </div>
    
    <div v-else-if="!isEditing && hasImages" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="image in images" :key="getImageKey(image)" class="border border-gray-200 rounded-md p-4">
        <div class="h-48 overflow-hidden rounded-md mb-2">
          <img :src="image.image_url" class="w-full h-full object-cover" :alt="altText">
        </div>
        <div class="flex justify-between items-center">
          <div>
            <span class="text-sm text-gray-500">순서: {{ image.sort }}</span>
            <span v-if="image.main_yn === 'Y'" class="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
              메인이미지
            </span>
            <span v-if="image.use_yn === 'N'" class="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              미사용
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 이미지 편집 모드 -->
    <div v-if="isEditing" class="space-y-4">
      <!-- 다중 파일 선택을 위한 숨김 입력 -->
      <input
        ref="multiFileInput"
        type="file"
        class="hidden"
        accept="image/*"
        multiple
        @change="handleAddFiles"
      >
      <div v-for="(image, index) in localImages" :key="index" class="flex items-center mb-4 bg-gray-50 p-3 rounded-md">
        <div class="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
          <img :src="image.image_url" class="w-full h-full object-cover" :alt="altText">
        </div>
        <div class="ml-4 flex-grow space-y-2">
          <div class="flex gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">이미지 파일</label>
              <div v-if="image.file" class="text-sm text-gray-600 mb-1">
                선택된 파일: {{ image.file.name }}
              </div>
              <div v-else-if="image.image_url" class="text-sm text-gray-600 mb-1">
                기존 이미지 URL: {{ getShortUrl(image.image_url) }}
              </div>
              <input
                type="file"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                @change="(e) => handleFileChange(e, index)"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
              <input
                v-model.number="image.sort"
                type="number"
                class="w-20 px-3 py-2 border border-gray-300 rounded-md"
              >
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
                class="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                @click="removeImage(index)" 
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        class="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
        @click="triggerMultiSelect" 
      >
        + 이미지 추가
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from '#imports'

interface ImageItem {
  // 다양한 이미지 키를 허용하되 any 대신 unknown 사용
  [key: string]: unknown;
  image_url: string;
  sort: number;
  main_yn: string;
  use_yn: string;
  file?: File | null;
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

const props = defineProps<{
  title?: string;
  images: ImageItem[];
  isEditing: boolean;
  idField?: string; // 이미지 ID 필드명 (예: event_image_idx, caddy_image_idx 등)
  altText?: string; // 이미지 alt 텍스트
  entityId?: number; // 업로드 경로에 사용할 ID (예: event_idx, caddy_idx 등)
  entityType?: string; // 업로드 경로 타입 (예: 'event', 'caddy' 등)
}>()

const emit = defineEmits<{
  (e: 'update:images', value: ImageItem[]): void;
  (e: 'upload-complete', success: boolean, error?: string): void;
}>()

// 로컬 이미지 배열 (편집용)
const localImages = ref<ImageItem[]>([])
const syncingFromProps = ref(false)
const multiFileInput = ref<HTMLInputElement | null>(null)

// 이미지가 있는지 확인
const hasImages = computed(() => {
  return props.images && props.images.length > 0
})

// props.images가 변경될 때 로컬 이미지 배열 업데이트 (emit 억제)
watch(() => props.images, async (newImages: ImageItem[]) => {
  if (props.isEditing) {
    syncingFromProps.value = true
    localImages.value = JSON.parse(JSON.stringify(newImages))
    await nextTick()
    syncingFromProps.value = false
  }
}, { immediate: true, deep: true })

// 로컬 이미지 배열이 변경될 때 부모 컴포넌트에 업데이트 (props 동기화 중엔 emit 안함)
watch(localImages, (newImages: ImageItem[]) => {
  if (props.isEditing && !syncingFromProps.value) {
    const imagesToEmit = JSON.parse(JSON.stringify(newImages))
    emit('update:images', imagesToEmit)
  }
}, { deep: true })

// 이미지 키 가져오기 (고유 식별자)
const getImageKey = (image: ImageItem): string | number => {
  if (props.idField) {
    const val = image[props.idField]
    if (typeof val === 'string' || typeof val === 'number') {
      return val
    }
  }
  return image.sort || Math.random().toString(36).substring(2, 9)
}

// URL 짧게 표시하기
const getShortUrl = (url: string): string => {
  if (!url) return ''
  if (url.length > 30) {
    return url.substring(0, 15) + '...' + url.substring(url.length - 15)
  }
  return url
}

// 파일 선택 핸들러
const handleFileChange = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    
    // 파일 크기 검사 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하여야 합니다.')
      input.value = ''
      return
    }
    
    // 이미지 파일 타입 검사
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      input.value = ''
      return
    }
    
    // 파일을 이미지 객체에 저장
    localImages.value[index].file = file
    
    // 미리보기 URL 생성
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        localImages.value[index].image_url = e.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

// 다중 파일 추가 트리거
const triggerMultiSelect = () => {
  multiFileInput.value?.click()
}

// 이미지 제거
const removeImage = (index: number) => {
  if (localImages.value[index][props.idField || '']) {
    // 기존 이미지인 경우 사용 여부만 변경
    localImages.value[index].use_yn = 'N'
  } else {
    // 새로 추가된 이미지인 경우 배열에서 제거
    localImages.value.splice(index, 1)
  }
  
  // 순서 재정렬
  localImages.value.forEach((img: ImageItem, idx: number) => {
    img.sort = idx + 1
  })
}

// 다중 파일 추가 핸들러
const handleAddFiles = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const files = Array.from(input.files)
  const baseIndex = localImages.value.length

  files.forEach((file, idx) => {
    // 5MB 제한
    if (file.size > 5 * 1024 * 1024) {
      alert(`이미지 크기는 5MB 이하여야 합니다. (${file.name})`)
      return
    }
    if (!file.type.startsWith('image/')) {
      alert(`이미지 파일만 업로드 가능합니다. (${file.name})`)
      return
    }

    const newImage: ImageItem = {
      image_url: '',
      sort: baseIndex + idx + 1,
      main_yn: (baseIndex + idx) === 0 ? 'Y' : 'N',
      use_yn: 'Y',
      file
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        newImage.image_url = e.target.result as string
        localImages.value.push({ ...newImage })
      }
    }
    reader.readAsDataURL(file)
  })

  // 같은 파일 재선택 허용
  input.value = ''
}

// FTP 이미지 업로드 함수 (서버 API 사용)
type MaybeWrappedFile = {
  name?: string;
  type?: string;
  size?: number;
  data?: ArrayBuffer | Blob | Uint8Array;
}

const uploadImageToFtp = async (file: File | Blob | MaybeWrappedFile, idx?: number, path?: string): Promise<UploadResult> => {
  try {
    // 파일 유효성 검사
    if (!file || typeof file !== 'object') {
      console.error('유효하지 않은 파일 객체:', file)
      return { success: false, error: '유효하지 않은 파일 객체입니다.' }
    }
    
    // File 객체인지 확인
    if (!(file instanceof File) && !(file instanceof Blob)) {
      console.error('파일이 File 또는 Blob 형식이 아님:', file)
      
      const maybe = file as MaybeWrappedFile
      if (maybe.name && maybe.type && maybe.size) {
        console.log('File has name, type, and size properties, attempting to convert to Blob')
        try {
          // 파일 데이터가 있는 경우 Blob로 변환 시도
          if (maybe.data) {
            const blob = new Blob([maybe.data], { type: maybe.type })
            file = blob as Blob
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
    const uploadPath = path ? `${path}/${idx || ''}` : ''
    
    // FormData 생성 및 파일 추가
    const formData = new FormData()
    
    // 파일명 확인 및 추가
    const fileName = (file as File).name || `image_${Date.now()}.jpg`
    
    // 파일 추가 - 이름을 명시적으로 지정
    formData.append('file', file as Blob, fileName)
    formData.append('uploadPath', uploadPath || '')
    
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
    console.log('Starting uploadAllImages')
    
    // 파일이 있는 이미지만 필터링
    const imagesToUpload = localImages.value.filter((img: ImageItem) => {
      // 파일 유효성 검사 추가
      if (!img.file) return false  
      return true
    })
    
    console.log(`Found ${imagesToUpload.length} images to upload`)
    
    if (imagesToUpload.length === 0) {
      // 업로드할 파일이 없으면 바로 성공 처리
      // 그래도 이미지 정보는 전송
      const imagesToEmit = JSON.parse(JSON.stringify(localImages.value))
      emit('update:images', imagesToEmit)
      emit('upload-complete', true)
      return true
    }
    
    // 이미지 업로드 결과를 추적하기 위한 배열
    const updatedImages = [...localImages.value]
    
    // 모든 이미지 업로드 처리
    for (let i = 0; i < imagesToUpload.length; i++) {
      const image = imagesToUpload[i]
      const imageIndex = localImages.value.findIndex((img: ImageItem) => 
        getImageKey(img) === getImageKey(image)
      )
      
      if (imageIndex === -1 || !image.file) continue
      
      try {
        let uploadResult;
        
        if (typeof image.image_url === 'string' && image.image_url.startsWith('data:')) {
          // 데이터 URL에서 Blob 생성
          const response = await fetch(image.image_url)
          const blob = await response.blob()
          
          // Blob으로 FTP 업로드 진행
          uploadResult = await uploadImageToFtp(
            blob, 
            props.entityId, 
            props.entityType
          )
        } else {
          // 일반 파일 업로드
          uploadResult = await uploadImageToFtp(
            image.file, 
            props.entityId, 
            props.entityType
          )
        }
        
        if (uploadResult.success && uploadResult.url) {
          // 업로드 성공 시 URL 업데이트 - 직접 배열 업데이트
          updatedImages[imageIndex] = {
            ...updatedImages[imageIndex],
            image_url: uploadResult.url,
            file: null
          }
        } else {
          // 업로드 실패 시 오류 처리
          emit('upload-complete', false, uploadResult.error || '이미지 업로드 실패')
          return false
        }
      } catch (error) {
        console.error('이미지 업로드 오류:', error)
        emit('upload-complete', false, '이미지 업로드 중 오류가 발생했습니다.')
        return false
      }
    }
    
    // 모든 이미지 업로드가 완료된 후 로컬 이미지 상태 업데이트
    // 이렇게 하면 반응형 업데이트가 한 번에 이루어짐
    localImages.value = updatedImages
    
    // 약간의 지연 후 최종 이미지 정보 업데이트 (반응형 업데이트가 완료되도록)
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // 최종 이미지 정보 업데이트 - 깊은 복사로 참조 끊기
    const finalImagesToEmit = JSON.parse(JSON.stringify(localImages.value))
    
    try {
      // 최종 이미지 정보 emit
      emit('update:images', finalImagesToEmit)
      emit('upload-complete', true)
      
      // 커스텀 이벤트 발생 (필요한 경우)
      const updateEvent = new CustomEvent('image-update', { 
        detail: { images: finalImagesToEmit } 
      })
      document.dispatchEvent(updateEvent)
      
      console.log('Image upload complete, emitted updated images:', finalImagesToEmit)
    } catch (error) {
      console.error('[uploadAllImages] Error emitting events:', error)
    }
    
    return true
  } catch (error) {
    console.error('이미지 업로드 오류:', error)
    emit('upload-complete', false, '이미지 업로드 중 오류가 발생했습니다.')
    return false
  }
}

// 외부에서 호출할 수 있도록 함수 노출
defineExpose({
  uploadAllImages
})
</script>
