<template>
  <div class="review-write-page pb-20">
    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />
    
    <NavigationBar mode="back_title" :show-bell="false" :title="isEditMode ? $t('review.update') : $t('review.write')" back-color="black" />
    
    <div class="pt-20 px-4">
      <!-- 로딩 상태 표시 -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>

      <!-- 오류 메시지 -->
      <div v-else-if="error" class="p-4 text-center text-red-500">
        {{ error }}
      </div>
      
      <!-- 리뷰 작성 폼 -->
      <div v-else class="review-content px-4 py-4">
        <!-- 상품 정보 -->
        <div class="flex items-center gap-4 mb-4">
          <div v-if="productData?.image_url">
            <img :src="productData.image_url" alt="Product Image" class="w-40 h-40 object-cover rounded-md">
          </div>
          <div>
            <div class="font-medium">{{ productData?.title }}</div>
            <div class="text-gray-600">{{ getProductTypeName() }}</div>
          </div>
        </div>
      </div>
      
      <!-- 별점 입력 -->
      <div class="px-4 py-2">
        <div class="mb-2 text-sm font-medium">{{ $t('review.rating') }}</div>
        <div class="flex items-center">
          <div class="flex">
            <button 
              v-for="star in 5" 
              :key="star" 
              class="text-2xl focus:outline-none"
              :class="star <= rating ? 'text-yellow-400' : 'text-gray-300'"
              @click="rating = star"
            >
              ★
            </button>
          </div>
          <span class="ml-2 text-gray-600">{{ rating }}/5</span>
        </div>
      </div>
      
      <!-- 내용 입력 -->
      <div class="px-4 py-2">
        <div class="mb-2 text-sm font-medium">{{ $t('review.content') }}</div>
        <div class="border border-gray-300 rounded-md" style="height: 286px;">
          <textarea 
            v-model="reviewContent" 
            :placeholder="$t('review.contentPlaceholder')"
            maxlength="500"
            class="w-full h-full p-3 text-sm text-gray-700 border-none rounded-md resize-none focus:outline-none focus:ring-0" 
          />
        </div>
        <div class="text-right text-xs text-gray-500 mt-1">
          {{ reviewContent.length }}/500
        </div>
      </div>
      
      <!-- 이미지 업로드 -->
      <div class="px-4 py-2">
        <div class="mb-2 text-sm font-medium">{{ $t('review.images') }}</div>
        <imageUpload 
            v-model="uploadedFiles" 
            @error="onUploadError" 
            @files-ready="onFilesReady"
            @file-removed="onFileRemoved" 
          />
      </div>
      
      <!-- 하단 버튼 -->
      <div class="flex gap-4 p-4 mt-6">
        <button 
          class="flex-1 py-3 px-2 text-sm text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
          @click="router.back()" 
        >
          {{ $t('common.cancel') }}
        </button>
        <button 
          class="flex-1 py-3 px-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed relative"
          :disabled="isSubmitting"
          @click="submitReview" 
        >
          <div v-if="isSubmitting" class="absolute left-0 bottom-0 h-1 bg-white" :style="{ width: `${progressValue}%` }" />
          {{ isSubmitting ? (isEditMode ? $t('review.updating') : $t('review.submitting')) : (isEditMode ? $t('review.update') : $t('review.submit')) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import NavigationBar from '~/components/common/NavigationBar.vue'
import imageUpload from '~/components/common/imageUpload.vue'
import ToastMessage from '~/components/common/ToastMessage.vue'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'

interface FileWithPreview extends File {
  idx: number;
  preview: string;
}

interface SerializableFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
  base64?: string;
}

interface ProductData {
  title: string;
  type: string;
  id: number;
  reservationIdx: number;
  [key: string]: string | number | boolean | null | undefined;
}

interface ReviewImage {
  review_image_idx: number;
  image_url: string;
  sort: number;
}

interface ExistingReview {
  review_idx: number;
  review_content: string;
  review_rate: number;
  images?: ReviewImage[];
}

definePageMeta({
  name: 'review_write'
})

const route = useRoute()
const { locale, t } = useI18n()

const reservationType = route.query.reservationType || 'G'
const reservationIdx = route.query.reservationIdx

// 상태 관리
const isLoading = ref(false)
const error = ref('')
const productData = ref<ProductData | null>(null)
const rating = ref(0)
const reviewContent = ref('')
const uploadedFiles = ref<FileWithPreview[]>([])
const serializableFiles = ref<SerializableFile[]>([])
const removedImages = ref<number[]>([])
const isSubmitting = ref(false)
const progressValue = ref(0)
const existingReview = ref<ExistingReview | null>(null)
const isEditMode = ref(false)
const reviewIdx = ref<number | null>(null)

// 토스트 메시지 상태
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 상품 타입에 따른 이름 반환
const getProductTypeName = (): string => {
  switch (reservationType) {
    case 'G':
      return t('review.golf')
    case 'H':
      return t('review.hotel')
    case 'C':
      return t('review.caddy')
    case 'T':
      return t('review.tournament')
    default:
      return ''
  }
}

// 상품 정보 가져오기
const fetchProductData = async () => {
  if (!reservationIdx) {
    error.value = t('common.wrongRequest')
    return
  }
  
  isLoading.value = true
  try {
    // API 호출로 상품 정보 가져오기
    const response = await $fetch(`/api/reservation/${reservationType}/${reservationIdx}`)
    if (response.success && response.data) {
      productData.value = response.data
      
      // 기존 리뷰 데이터가 있는지 확인
      if (response.existingReview) {
        existingReview.value = response.existingReview
        reviewIdx.value = response.existingReview.review_idx
        isEditMode.value = true
        
        // 기존 리뷰 데이터로 폼 초기화
        rating.value = response.existingReview.review_rate
        reviewContent.value = response.existingReview.review_content
        
        // 기존 이미지가 있으면 처리
        if (response.existingReview.images && response.existingReview.images.length > 0) {
          // 이미지 URL을 FileWithPreview 형태로 변환
          const files: FileWithPreview[] = response.existingReview.images.map((img) => {
            return {
              name: `image-${img.review_image_idx}.jpg`,
              type: 'image/jpeg',
              size: 0,
              lastModified: Date.now(),
              preview: img.image_url,
              idx: img.review_image_idx,
              webkitRelativePath: '',
              arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
              slice: () => new Blob(),
              stream: () => new ReadableStream(),
              text: () => Promise.resolve(''),
            }
          })
          
          uploadedFiles.value = files
        }
      }
    } else {
      throw new Error(response.message || 'Failed to fetch product data')
    }
  } catch (err: unknown) {
    console.error('상품 정보 가져오기 오류:', err)
    error.value = t('common.wrongRequest')
  } finally {
    isLoading.value = false
  }
}

// 이미지 업로드 관련 함수
const onFilesReady = (files: SerializableFile[]) => {
  serializableFiles.value = files
}

// 이미지 삭제 처리
const onFileRemoved = (file: FileWithPreview) => {
  // 삭제된 이미지를 removedImages 배열에 추가
  if (file.idx && file.idx > 0) {
    removedImages.value.push(file.idx)
  }
}

const onUploadError = (errorMessage: string) => {
  showToast.value = true
  toastMessage.value = errorMessage
  toastType.value = 'error'
}

// 리뷰 제출
const submitReview = async () => {
  // 유효성 검사
  if (rating.value === 0) {
    showToast.value = true
    toastMessage.value = t('review.ratingRequired')
    toastType.value = 'error'
    return
  }
  
  if (!reviewContent.value.trim()) {
    showToast.value = true
    toastMessage.value = t('review.contentRequired')
    toastType.value = 'error'
    return
  }
  
  if (reviewContent.value.length > 500) {
    showToast.value = true
    toastMessage.value = t('review.contentTooLong')
    toastType.value = 'error'
    return
  }
  
  try {
    isSubmitting.value = true
    progressValue.value = 0
    
    // 진행 상태 애니메이션 시작
    const progressInterval = setInterval(() => {
      if (progressValue.value < 90) {
        progressValue.value += 5
      }
    }, 200)
    
    // API 호출로 리뷰 제출
    const endpoint = isEditMode.value ? '/api/review/update' : '/api/review/create'
    
    interface ReviewRequestBody {
      reservationIdx: string | string[];
      type: string | string[];
      productId: number | undefined;
      rating: number;
      content: string;
      images: SerializableFile[];
      reviewIdx?: number | null;
      removeImages?: number[];
    }
    
    const requestBody: ReviewRequestBody = {
      reservationIdx: reservationIdx,
      type: reservationType,
      productId: productData.value?.id,
      rating: rating.value,
      content: reviewContent.value,
      images: serializableFiles.value
    }
    
    // 수정 모드에서는 삭제된 이미지 정보도 추가
    if (isEditMode.value) {
      requestBody.removeImages = removedImages.value
    }
    
    // 수정 모드인 경우 리뷰 ID 추가
    if (isEditMode.value && reviewIdx.value) {
      requestBody.reviewIdx = reviewIdx.value
    }
    
    const response = await $fetch(endpoint, {
      method: 'POST',
      body: requestBody
    })

    if (response.success) {
      // 완료 시 프로그레스바 100%로 설정
      progressValue.value = 100
      
      // 인터벌 정리
      clearInterval(progressInterval)
      
      isSubmitting.value = false
      showToast.value = true
      toastMessage.value = isEditMode.value ? t('review.updateSuccess') : t('review.submitSuccess')
      toastType.value = 'success'
      
      // 성공 후 리뷰 목록 페이지로 이동
      setTimeout(() => {
        navigateTo('/review')
      }, 1500)
    } else {
      throw new Error(response.message || `Failed to ${isEditMode.value ? 'update' : 'submit'} review`)
    }
  } catch (err: unknown) {
    console.error(`리뷰 ${isEditMode.value ? '수정' : '제출'} 오류:`, err)
    showToast.value = true
    toastMessage.value = isEditMode.value ? t('review.updateError') : t('review.submitError')
    toastType.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

// 컴포넌트 마운트 시 상품 정보 가져오기
onMounted(() => {
  fetchProductData()
})
</script>

<style scoped>
/* 프로그레스 바 트랜지션 효과 */
.h-1 {
  transition: width 0.3s ease-in-out;
}

/* 입력 필드 포커스 스타일 */
textarea:focus {
  outline: none;
  border-color: #3B82F6;
}

/* 버튼 트랜지션 효과 */
button {
  transition: all 0.2s ease;
}

/* 이미지 스타일 */
.review-content img {
  max-width: 100%;
  height: auto;
}
</style>