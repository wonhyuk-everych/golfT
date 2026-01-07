<template>
  <div class="border-b border-gray-200 pb-5">
    <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">대회 이미지</h3>
    
    <div v-if="isEditing" class="mt-4">
          <!-- 썸네일 이미지 (T) - 최대 1개 -->
          <div class="mb-6 border-b border-gray-200 pb-6">
            <h4 class="text-md font-medium text-gray-800 mb-3">썸네일 이미지 (T) - 최대 1개</h4>
            <div class="space-y-4">
              <div v-if="getThumbnailImages().length > 0" class="flex items-center bg-gray-50 p-3 rounded-md">
                <div class="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img v-if="getThumbnailImages()[0].file" :src="getImagePreview(getThumbnailImages()[0].file)" class="w-full h-full object-cover" alt="썸네일 이미지">
                  <img v-else-if="getThumbnailImages()[0].image_url" :src="getThumbnailImages()[0].image_url" class="w-full h-full object-cover" alt="썸네일 이미지">
                  <span v-else class="text-gray-400">이미지 없음</span>
                </div>
                <div class="ml-4 flex-grow space-y-2">
                  <div class="flex gap-4">
                    <div class="flex-grow">
                      <label class="block text-sm font-medium text-gray-700 mb-1">이미지 파일 *</label>
                      <div v-if="getThumbnailImages()[0].file" class="text-sm text-gray-600 mb-1">
                        선택된 파일: {{ getThumbnailImages()[0].file.name }}
                      </div>
                      <div v-else-if="getThumbnailImages()[0].image_url" class="text-sm text-gray-600 mb-1">
                        기존 이미지 URL: {{ getThumbnailImages()[0].image_url }}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md"
                        :class="{ 'border-red-500': validationErrors?.['image_file_T_0'] }"
                        @change="(e) => handleFileChange(e, 'T', 0)"
                      >
                      <p v-if="validationErrors?.['image_file_T_0']" class="mt-1 text-sm text-red-600">
                        {{ validationErrors['image_file_T_0'] }}
                      </p>
                    </div>
                  </div>
                  <div class="flex gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">사용여부</label>
                      <select v-model="getThumbnailImages()[0].use_yn" class="px-3 py-2 border border-gray-300 rounded-md">
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                      </select>
                    </div>
                    <div class="flex items-end">
                      <button 
                        class="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                        @click="removeImage('T', 0)"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                v-if="getThumbnailImages().length === 0"
                class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                @click="addImage('T')"
              >
                + 썸네일 이미지 추가
              </button>
              <p v-if="getThumbnailImages().length === 0" class="text-sm text-gray-500">
                썸네일 이미지는 최대 1개만 등록할 수 있습니다.
              </p>
            </div>
          </div>

      <!-- 메인 이미지 (M) -->
      <div class="mb-6 border-b border-gray-200 pb-6">
        <h4 class="text-md font-medium text-gray-800 mb-3">메인 이미지 (M)</h4>
        <div class="space-y-4">
          <div v-for="(image, index) in getMainImages()" :key="`M-${index}`" class="flex items-center bg-gray-50 p-3 rounded-md">
            <div class="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
              <img v-if="image.file" :src="getImagePreview(image.file)" class="w-full h-full object-cover" :alt="`메인 이미지 ${index + 1}`">
              <img v-else-if="image.image_url" :src="image.image_url" class="w-full h-full object-cover" :alt="`메인 이미지 ${index + 1}`">
              <span v-else class="text-gray-400">이미지 없음</span>
            </div>
            <div class="ml-4 flex-grow space-y-2">
              <div class="flex gap-4">
                <div class="flex-grow">
                  <label class="block text-sm font-medium text-gray-700 mb-1">이미지 파일 *</label>
                  <div v-if="image.file" class="text-sm text-gray-600 mb-1">
                    선택된 파일: {{ image.file.name }}
                  </div>
                  <div v-else-if="image.image_url" class="text-sm text-gray-600 mb-1">
                    기존 이미지 URL: {{ image.image_url }}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    :class="{ 'border-red-500': validationErrors?.[`image_file_M_${index}`] }"
                    @change="(e) => handleFileChange(e, 'M', index)"
                  >
                  <p v-if="validationErrors?.[`image_file_M_${index}`]" class="mt-1 text-sm text-red-600">
                    {{ validationErrors[`image_file_M_${index}`] }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                  <input v-model.number="image.sort" type="number" class="w-20 px-3 py-2 border border-gray-300 rounded-md">
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
                    @click="removeImage('M', index)"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button 
            class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            @click="addImage('M')"
          >
            + 메인 이미지 추가
          </button>
        </div>
      </div>

      <!-- 설명 이미지 (E) -->
      <div class="mb-6">
        <h4 class="text-md font-medium text-gray-800 mb-3">설명 이미지 (E)</h4>
        <div class="space-y-4">
          <div v-for="(image, index) in getExplanationImages()" :key="`E-${index}`" class="flex items-center bg-gray-50 p-3 rounded-md">
            <div class="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
              <img v-if="image.file" :src="getImagePreview(image.file)" class="w-full h-full object-cover" :alt="`설명 이미지 ${index + 1}`">
              <img v-else-if="image.image_url" :src="image.image_url" class="w-full h-full object-cover" :alt="`설명 이미지 ${index + 1}`">
              <span v-else class="text-gray-400">이미지 없음</span>
            </div>
            <div class="ml-4 flex-grow space-y-2">
              <div class="flex gap-4">
                <div class="flex-grow">
                  <label class="block text-sm font-medium text-gray-700 mb-1">이미지 파일 *</label>
                  <div v-if="image.file" class="text-sm text-gray-600 mb-1">
                    선택된 파일: {{ image.file.name }}
                  </div>
                  <div v-else-if="image.image_url" class="text-sm text-gray-600 mb-1">
                    기존 이미지 URL: {{ image.image_url }}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    :class="{ 'border-red-500': validationErrors?.[`image_file_E_${index}`] }"
                    @change="(e) => handleFileChange(e, 'E', index)"
                  >
                  <p v-if="validationErrors?.[`image_file_E_${index}`]" class="mt-1 text-sm text-red-600">
                    {{ validationErrors[`image_file_E_${index}`] }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                  <input v-model.number="image.sort" type="number" class="w-20 px-3 py-2 border border-gray-300 rounded-md">
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
                    @click="removeImage('E', index)"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button 
            class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            @click="addImage('E')"
          >
            + 설명 이미지 추가
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="mt-4">
      <!-- 썸네일 이미지 표시 -->
      <div v-if="getThumbnailImagesView().length > 0" class="mb-6">
        <h4 class="text-md font-medium text-gray-800 mb-3">썸네일 이미지 (T)</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="image in getThumbnailImagesView()" :key="image.tournament_image_idx" class="border border-gray-200 rounded-md p-4">
            <div class="h-48 overflow-hidden rounded-md mb-2">
              <img :src="image.image_url" class="w-full h-full object-cover" alt="썸네일 이미지">
            </div>
            <div class="flex justify-between items-center">
              <div>
                <span v-if="image.use_yn === 'N'" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  미사용
                </span>
                <span v-else class="text-sm text-gray-600">
                  사용중
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 메인 이미지 표시 -->
      <div v-if="getMainImagesView().length > 0" class="mb-6">
        <h4 class="text-md font-medium text-gray-800 mb-3">메인 이미지 (M)</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="image in getMainImagesView()" :key="image.tournament_image_idx" class="border border-gray-200 rounded-md p-4">
            <div class="h-48 overflow-hidden rounded-md mb-2">
              <img :src="image.image_url" class="w-full h-full object-cover" alt="메인 이미지">
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
      </div>

      <!-- 설명 이미지 표시 -->
      <div v-if="getExplanationImagesView().length > 0" class="mb-6">
        <h4 class="text-md font-medium text-gray-800 mb-3">설명 이미지 (E)</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="image in getExplanationImagesView()" :key="image.tournament_image_idx" class="border border-gray-200 rounded-md p-4">
            <div class="h-48 overflow-hidden rounded-md mb-2">
              <img :src="image.image_url" class="w-full h-full object-cover" alt="설명 이미지">
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
      </div>

      <div v-if="!modelValue || modelValue.length === 0" class="text-center py-8 bg-gray-50 rounded-md">
        <p class="text-gray-500">등록된 이미지가 없습니다</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TournamentImage as BaseTournamentImage } from '~/types/admin/tournament'

interface TournamentImage extends BaseTournamentImage {
  file?: File | null
}

interface Props {
  modelValue: TournamentImage[]
  isEditing: boolean
  validationErrors?: Record<string, string>
}

interface Emits {
  (e: 'update:modelValue', value: TournamentImage[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 이미지 타입별 필터링 함수 (편집 모드)
const getThumbnailImages = () => {
  return props.modelValue?.filter((img: TournamentImage) => img.image_type === 'T') || []
}

const getMainImages = () => {
  return props.modelValue?.filter((img: TournamentImage) => img.image_type === 'M') || []
}

const getExplanationImages = () => {
  return props.modelValue?.filter((img: TournamentImage) => img.image_type === 'E') || []
}

// 이미지 타입별 필터링 함수 (보기 모드)
const getThumbnailImagesView = () => {
  return props.modelValue?.filter((img: TournamentImage) => img.image_type === 'T') || []
}

const getMainImagesView = () => {
  return props.modelValue?.filter((img: TournamentImage) => img.image_type === 'M') || []
}

const getExplanationImagesView = () => {
  return props.modelValue?.filter((img: TournamentImage) => img.image_type === 'E') || []
}

// 타입별 이미지 추가
const addImage = (imageType: string) => {
  const currentImages = [...props.modelValue]
  const imagesOfType = currentImages.filter((img: TournamentImage) => img.image_type === imageType)
  
  // 썸네일 이미지는 최대 1개만 허용
  if (imageType === 'T' && imagesOfType.length >= 1) {
    alert('썸네일 이미지는 최대 1개만 등록할 수 있습니다.')
    return
  }
  
  const newImage: TournamentImage = {
    image_url: '',
    image_type: imageType,
    // 썸네일은 항상 sort=1, main_yn=Y
    sort: imageType === 'T' ? 1 : imagesOfType.length + 1,
    main_yn: imageType === 'T' ? 'Y' : (imagesOfType.length === 0 ? 'Y' : 'N'),
    use_yn: 'Y',
    file: null
  }
  
  currentImages.push(newImage)
  emit('update:modelValue', currentImages)
}

// 타입별 이미지 삭제
const removeImage = (imageType: string, index: number) => {
  const currentImages = [...props.modelValue]
  const imagesOfType = currentImages.filter((img: TournamentImage) => img.image_type === imageType)
  const imageToRemove = imagesOfType[index]
  const globalIndex = currentImages.indexOf(imageToRemove)
  
  if (globalIndex !== -1) {
    currentImages.splice(globalIndex, 1)
  }
  
  // 해당 타입의 순서 재정렬
  const remainingImages = currentImages.filter((img: TournamentImage) => img.image_type === imageType)
  remainingImages.forEach((img: TournamentImage, idx: number) => {
    img.sort = idx + 1
  })
  
  emit('update:modelValue', currentImages)
}

// 타입별 파일 선택 핸들러
const handleFileChange = (event: Event, imageType: string, index: number) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    const currentImages = [...props.modelValue]
    const imagesOfType = currentImages.filter((img: TournamentImage) => img.image_type === imageType)
    if (imagesOfType[index]) {
      imagesOfType[index].file = file
      emit('update:modelValue', currentImages)
    }
  }
}

// 이미지 미리보기 URL 생성
const getImagePreview = (file: File): string => {
  return URL.createObjectURL(file)
}
</script>
