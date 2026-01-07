<template>
  <div class="space-y-6">
    <!-- 페이지 헤더 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">리뷰 신규 등록</h1>
          <p class="text-gray-600">관리자가 직접 리뷰를 등록합니다.</p>
        </div>
        <div class="flex space-x-2">
          <button class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400" @click="goBack">
            취소
          </button>
          <button 
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50" 
            :disabled="!canSave || isSaving"
            @click="saveReview"
          >
            {{ isSaving ? '저장 중...' : '저장' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 리뷰 작성 폼 -->
    <div class="bg-white p-6 rounded-lg shadow-md space-y-6">
      <!-- 상품 타입 선택 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">상품 타입 <span class="text-red-500">*</span></label>
        <div class="flex space-x-2">
          <button
            v-for="t in reviewTypes"
            :key="t.key"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium',
              form.reviewType === t.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="selectReviewType(t.key)"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <!-- 상품 선택 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">상품 선택 <span class="text-red-500">*</span></label>
        <div class="flex space-x-2">
          <input
            v-model="selectedProductDisplay"
            type="text"
            readonly
            placeholder="상품을 선택해주세요"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
          >
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            :disabled="!form.reviewType"
            @click="openProductSearch"
          >
            상품 검색
          </button>
        </div>
      </div>

      <!-- 회원 선택 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">회원 선택 <span class="text-red-500">*</span></label>
        <div class="flex space-x-2">
          <input
            v-model="selectedMemberDisplay"
            type="text"
            readonly
            placeholder="회원을 선택해주세요"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
          >
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            @click="openMemberSearch"
          >
            회원 검색
          </button>
        </div>
      </div>

      <!-- 평점 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">평점 <span class="text-red-500">*</span></label>
        <div class="flex items-center space-x-4">
          <input
            v-model.number="form.reviewRate"
            type="number"
            min="1"
            max="5"
            step="1"
            class="w-24 px-3 py-2 border border-gray-300 rounded-md"
          >
          <div class="flex space-x-1">
            <svg
              v-for="i in 5"
              :key="i"
              :class="[
                'w-6 h-6',
                i <= form.reviewRate ? 'text-yellow-400' : 'text-gray-300'
              ]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 내용 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">리뷰 내용 <span class="text-red-500">*</span></label>
        <textarea
          v-model="form.reviewContent"
          rows="6"
          placeholder="리뷰 내용을 입력해주세요"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- 이미지 업로드 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">이미지 업로드</label>
        <div class="space-y-3">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            @change="handleFileSelect"
          >
          <div v-if="isCompressing" class="flex items-center justify-center py-4 text-sm text-gray-600">
            <svg class="animate-spin h-5 w-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            이미지 압축 중...
          </div>
          <div v-if="selectedFiles.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div v-for="(file, idx) in selectedFiles" :key="idx" class="relative border rounded-md p-2">
              <img :src="file.preview" class="w-full h-24 object-cover rounded">
              <button
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                @click="removeFile(idx)"
              >
                ×
              </button>
              <p class="text-xs text-gray-600 mt-1 truncate">{{ file.file.name }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatFileSize(file.file.size) }}</p>
            </div>
          </div>
          <div v-if="selectedFiles.length > 0" class="text-xs text-gray-500">
            총 용량: {{ totalFileSize }} / 10MB
          </div>
        </div>
      </div>

      <!-- 노출 여부 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">노출 여부</label>
        <select v-model="form.useYn" class="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md">
          <option value="Y">노출</option>
          <option value="N">미노출</option>
        </select>
      </div>
    </div>

    <!-- 상품 검색 모달 -->
    <ProductSearchModal
      v-if="showProductModal"
      :product-type="form.reviewType"
      @select="selectProduct"
      @close="showProductModal = false"
    />

    <!-- 회원 검색 모달 -->
    <MemberSearchModal
      v-if="showMemberModal"
      @select="selectMember"
      @close="showMemberModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from '#imports'
import { useRouter } from 'vue-router'
import imageCompression from 'browser-image-compression'
import ProductSearchModal from '~/components/admin/review/ProductSearchModal.vue'
import MemberSearchModal from '~/components/admin/review/MemberSearchModal.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const router = useRouter()

const reviewTypes = [
  { key: 'G' as const, label: '골프장' },
  { key: 'H' as const, label: '호텔' },
  { key: 'C' as const, label: '캐디' }
]

const form = ref({
  reviewType: '' as '' | 'G' | 'H' | 'C',
  productIdx: null as number | null,
  memberIdx: null as number | null,
  reviewRate: 5,
  reviewContent: '',
  useYn: 'Y' as 'Y' | 'N'
})

const selectedProduct = ref<{ idx: number; name: string } | null>(null)
const selectedMember = ref<{ idx: number; name: string; id: string } | null>(null)
const selectedFiles = ref<Array<{ file: File; preview: string }>>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isSaving = ref(false)
const isCompressing = ref(false)

const showProductModal = ref(false)
const showMemberModal = ref(false)

// Device detection for compression
const isMobileDevice = ref(false)
const isIOSDevice = ref(false)

if (import.meta.client) {
  const ua = navigator.userAgent
  isIOSDevice.value = /iP(hone|od|ad)/i.test(ua)
  isMobileDevice.value = /Mobi|Android|iP(hone|od|ad)/i.test(ua)
}

const selectedProductDisplay = computed(() => {
  if (!selectedProduct.value) return ''
  return `${selectedProduct.value.name} (IDX: ${selectedProduct.value.idx})`
})

const selectedMemberDisplay = computed(() => {
  if (!selectedMember.value) return ''
  return `${selectedMember.value.name} (ID: ${selectedMember.value.id})`
})

const canSave = computed(() => {
  return form.value.reviewType &&
    form.value.productIdx &&
    form.value.memberIdx &&
    form.value.reviewContent.trim().length > 0
})

const totalFileSize = computed(() => {
  const totalBytes = selectedFiles.value.reduce((acc, item) => acc + item.file.size, 0)
  return `${(totalBytes / (1024 * 1024)).toFixed(2)}MB`
})

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
}

const selectReviewType = (type: 'G' | 'H' | 'C') => {
  form.value.reviewType = type
  // 상품 타입 변경시 선택된 상품 초기화
  form.value.productIdx = null
  selectedProduct.value = null
}

const openProductSearch = () => {
  if (!form.value.reviewType) {
    alert('먼저 상품 타입을 선택해주세요.')
    return
  }
  showProductModal.value = true
}

const openMemberSearch = () => {
  showMemberModal.value = true
}

const selectProduct = (product: { idx: number; name: string }) => {
  selectedProduct.value = product
  form.value.productIdx = product.idx
  showProductModal.value = false
}

const selectMember = (member: { idx: number; name: string; id: string }) => {
  selectedMember.value = member
  form.value.memberIdx = member.idx
  showMemberModal.value = false
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files) return

  const files = Array.from(target.files)
  
  // Check max file count
  if (files.length + selectedFiles.value.length > 10) {
    alert('최대 10개까지 업로드할 수 있습니다.')
    if (target) target.value = ''
    return
  }

  isCompressing.value = true

  try {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue

      // Compress image
      const compressed = await compressImage(file)
      
      // Create preview
      const preview = URL.createObjectURL(compressed)
      
      selectedFiles.value.push({
        file: compressed,
        preview
      })
    }

    // Check total size
    const totalBytes = selectedFiles.value.reduce((acc, item) => acc + item.file.size, 0)
    if (totalBytes > 10 * 1024 * 1024) {
      alert('파일 총 용량은 10MB를 초과할 수 없습니다.')
      // Remove newly added files
      const removeCount = files.length
      for (let i = 0; i < removeCount; i++) {
        const removed = selectedFiles.value.pop()
        if (removed?.preview) {
          URL.revokeObjectURL(removed.preview)
        }
      }
    }
  } catch (error) {
    console.error('이미지 압축 실패:', error)
    alert('이미지 업로드 중 오류가 발생했습니다.')
  } finally {
    isCompressing.value = false
    // Reset input
    if (target) target.value = ''
  }
}

// Image compression function
const compressImage = async (file: File): Promise<File> => {
  try {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
    
    const isLargeFile = file.size > 5 * 1024 * 1024
    const targetSizeMB = isMobileDevice.value ? 0.8 : 1

    const options = {
      maxSizeMB: targetSizeMB,
      maxWidthOrHeight: isMobileDevice.value
        ? (isLargeFile ? 1400 : 1600)
        : (isLargeFile ? 1800 : 2000),
      initialQuality: isLargeFile ? 0.65 : 0.75,
      useWebWorker: !isIOSDevice.value,
    }

    let compressed: File

    try {
      compressed = await imageCompression(file, options)
    } catch (firstError) {
      console.warn('Primary compression failed, retrying with fallback options.', firstError)
      const retryOptions = {
        ...options,
        useWebWorker: false,
        maxWidthOrHeight: isMobileDevice.value
          ? Math.min(options.maxWidthOrHeight as number, 1400)
          : Math.min(options.maxWidthOrHeight as number, 1800),
        initialQuality: Math.min(options.initialQuality as number, 0.6),
      }
      compressed = await imageCompression(file, retryOptions)
    }

    const compressedSizeMB = compressed.size / (1024 * 1024)

    if (isLargeFile && compressedSizeMB > targetSizeMB + 0.2) {
      const fallbackOptions = {
        ...options,
        maxSizeMB: Math.max(targetSizeMB * 0.8, 0.5),
        maxWidthOrHeight: isMobileDevice.value ? 1200 : 1600,
        initialQuality: 0.55,
        useWebWorker: false,
      }
      compressed = await imageCompression(compressed, fallbackOptions)
    }

    return compressed as File
  } catch (error) {
    console.error('Image compression failed, using original file.', error)
    return file
  }
}

const removeFile = (index: number) => {
  const removed = selectedFiles.value[index]
  if (removed.preview) {
    URL.revokeObjectURL(removed.preview)
  }
  selectedFiles.value.splice(index, 1)
}

// FTP 이미지 업로드 함수
const uploadImageToFtp = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('uploadPath', 'review')
    
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

const saveReview = async () => {
  if (!canSave.value) {
    alert('필수 항목을 모두 입력해주세요.')
    return
  }

  try {
    isSaving.value = true

    // Upload images to FTP first
    const imageUrls: string[] = []
    
    if (selectedFiles.value.length > 0) {
      for (const item of selectedFiles.value) {
        const uploadResult = await uploadImageToFtp(item.file)
        
        if (uploadResult.success && uploadResult.url) {
          imageUrls.push(uploadResult.url)
        } else {
          throw new Error(uploadResult.error || '이미지 업로드 실패')
        }
      }
    }

    // Create review with image URLs
    await $fetch('/api/admin/review/create', {
      method: 'POST',
      body: {
        review_type: form.value.reviewType,
        product_idx: form.value.productIdx,
        member_idx: form.value.memberIdx,
        review_rate: form.value.reviewRate,
        review_content: form.value.reviewContent,
        use_yn: form.value.useYn,
        image_urls: imageUrls
      }
    })

    alert('리뷰가 성공적으로 등록되었습니다.')
    router.push('/admin/review')
  } catch (e) {
    console.error('리뷰 등록 실패:', e)
    alert('리뷰 등록에 실패했습니다.')
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  if (confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
    router.push('/admin/review')
  }
}

// Cleanup blob URLs on unmount
onUnmounted(() => {
  selectedFiles.value.forEach((file) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
  })
})
</script>

<style scoped>
</style>
