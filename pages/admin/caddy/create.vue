<template>
  <div class="space-y-6">
    <!-- 에러 상태 -->
    <div v-if="error" class="bg-white p-6 rounded-lg shadow-md">
      <div class="text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200" @click="router.back()">
          목록으로 돌아가기
        </button>
      </div>
    </div>

    <!-- 캐디 정보 입력 폼 -->
    <div v-else class="space-y-6 bg-white rounded-lg p-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">캐디 신규 등록</h1>
      </div>

      <!-- 기본 정보 컴포넌트 -->
      <BasicInfo 
        :caddy="caddy" 
        :edited-caddy="editedCaddy" 
        :is-editing="true"
        :get-caddy-status-class="getCaddyStatusClass"
        :get-caddy-status-text="getCaddyStatusText"
        :get-region-name="getRegionName"
        :format-date="formatDate"
        :format-price="formatPrice"
        @update:edited-caddy="updatedCaddy => editedCaddy = updatedCaddy"
      />

      <!-- 다국어 정보 컴포넌트 -->
      <LocaleInfo
        :caddy="caddy"
        :edited-caddy="editedCaddy"
        :is-editing="true"
        @update:edited-caddy="updatedCaddy => editedCaddy = updatedCaddy"
      />
      
      <!-- 캐디 이미지 컴포넌트 -->
      <CaddyImage 
        ref="caddyImageRef"
        :caddy="caddy" 
        :edited-caddy="editedCaddy" 
        :is-editing="true"
        @update:edited-caddy="updatedCaddy => editedCaddy = updatedCaddy"
      />

      <!-- 버튼 섹션 -->
      <div class="mt-6 flex justify-end space-x-4">
        <button :disabled="isSaving" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" @click="router.back()">
          취소
        </button>
        <button :disabled="isSaving" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed" @click="saveNewCaddy">
          {{ isSaving ? '등록 중...' : '등록' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'
import { useRouter } from 'vue-router'
import type { CaddyDetail } from '~/types/admin/caddy'
import BasicInfo from '~/components/admin/caddy/BasicInfo.vue'
import LocaleInfo from '~/components/admin/caddy/LocaleInfo.vue'
import CaddyImage from '~/components/admin/caddy/CaddyImage.vue'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const router = useRouter()
const error = ref<string | null>(null)
const isSaving = ref(false)
const caddyImageRef = ref(null)

// 빈 캐디 객체 초기화
const caddy = ref<CaddyDetail>({
  caddyIdx: 0,
  courseIdx: 0,
  caddyCode: null,
  caddyStatus: 'Y',
  name: '',
  nickName: '',
  age: null,
  height: null,
  countryCode: 'TH', // 기본값 태국
  cityCode: 'TH', // 기본값 태국
  dayOff: '',
  golfExperience: 'N',
  price: null,
  reservationFee: null,
  images: [],
  localeTexts: {
    KO: { language: '', specialty: '' },
    EN: { language: '', specialty: '' }
  },
  cautionText: '',
  useYn: 'Y',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
} as CaddyDetail)

// 편집용 캐디 객체 - 실제로 사용자가 입력하고 수정하는 데이터
const editedCaddy = ref<CaddyDetail>(JSON.parse(JSON.stringify(caddy.value)))

// 지역 데이터
const regions = [
  { code: 'TH', name: '태국' },
  { code: 'VN', name: '베트남' },
  { code: 'PH', name: '필리핀' },
  { code: 'MY', name: '말레이시아' },
  { code: 'ID', name: '인도네시아' },
  { code: 'KH', name: '캄보디아' }
]

interface ApiResponse {
  caddy: CaddyDetail
  success: boolean
  message?: string
}

const saveNewCaddy = async () => {
  if (!validateForm()) {
    return
  }

  try {
    isSaving.value = true
    error.value = null
    
    // 캐디 정보 생성 요청
    const response = await $fetch<ApiResponse>('/api/admin/caddy', {
      method: 'POST',
      body: editedCaddy.value
    })
    
    if (!response.success) {
      throw new Error(response.message || '캐디 정보 등록에 실패했습니다.')
    }
    
    // 생성된 캐디 객체 가져오기
    const createdCaddy = response.caddy
    
    // 이미지가 있으면 업로드 처리
    if (caddyImageRef.value && typeof caddyImageRef.value.saveImages === 'function') {
      // 생성된 caddyIdx 설정
      editedCaddy.value.caddyIdx = createdCaddy.caddyIdx
      
      console.log('Uploading caddy images...')
      const imageUploadSuccess = await caddyImageRef.value.saveImages()
      
      if (!imageUploadSuccess) {
        throw new Error('이미지 업로드에 실패했습니다.')
      }
      
      // 업로드된 이미지를 DB에 저장
      if (editedCaddy.value.images && editedCaddy.value.images.length > 0) {
        try {
          // PUT 요청으로 이미지 데이터베이스 저장 요청
          const saveImageResponse = await $fetch(`/api/admin/caddy?caddyIdx=${createdCaddy.caddyIdx}`, {
            method: 'PUT',
            body: {
              images: editedCaddy.value.images
            }
          })
        } catch (imageErr) {
          console.error('이미지 DB 저장 오류:', imageErr)
          // 이미지 DB 저장 실패는 치명적 오류로 처리하지 않고 경고만 표시
          alert('이미지 정보가 데이터베이스에 저장되지 않았습니다. 캐디 상세 페이지에서 다시 시도해주세요.')
        }
      }
    }
    
    // 알림 메시지 표시
    setTimeout(() => {
      alert('캐디 정보가 성공적으로 등록되었습니다.')
      // 캐디 상세 페이지로 이동
      router.push(`/admin/caddy/${createdCaddy.caddyIdx}`)
    }, 100)
    
  } catch (err) {
    console.error('Error creating caddy:', err)
    error.value = err instanceof Error ? err.message : '캐디 정보 등록에 실패했습니다.'
    isSaving.value = false
  }
}

const validateForm = (): boolean => {
  // 필수 입력 필드 검증
  if (!editedCaddy.value.courseIdx) {
    alert('골프장 ID를 입력해주세요.')
    return false
  }
  
  if (!editedCaddy.value.name) {
    alert('이름을 입력해주세요.')
    return false
  }
  
  return true
}

// 날짜 포맷팅
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('ko-KR')
}

// 가격 포맷팅
const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return '-'
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0
  }).format(price)
}

// 지역 이름 가져오기
const getRegionName = (code: string): string => {
  const region = regions.find(r => r.code === code)
  return region ? region.name : code
}

// 캐디 상태 클래스
const getCaddyStatusClass = (status: string) => {
  return {
    'inline-block px-2 py-1 rounded-full text-xs font-medium': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

// 캐디 상태 텍스트
const getCaddyStatusText = (status: string): string => {
  return status === 'Y' ? '활동중' : '비활동'
}
</script>

<style>
</style>
