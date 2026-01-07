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

    <!-- 캐디 정보 -->
    <div v-else-if="caddy" class="space-y-6 bg-white rounded-lg p-6">
      <!-- 기본 정보 컴포넌트 -->
      <BasicInfo 
        :caddy="caddy" 
        :edited-caddy="editedCaddy" 
        :is-editing="isEditing"
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
        :is-editing="isEditing"
        @update:edited-caddy="updatedCaddy => editedCaddy = updatedCaddy"
      />
      
      <!-- 캐디 이미지 컴포넌트 -->
      <CaddyImage 
        ref="caddyImageRef"
        :caddy="caddy" 
        :edited-caddy="editedCaddy" 
        :is-editing="isEditing"
        @update:edited-caddy="updatedCaddy => editedCaddy = updatedCaddy"
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
import { useRoute, useRouter } from 'vue-router'
import type { CaddyDetail } from '~/types/admin/caddy'
import BasicInfo from '~/components/admin/caddy/BasicInfo.vue'
import LocaleInfo from '~/components/admin/caddy/LocaleInfo.vue'
import CaddyImage from '~/components/admin/caddy/CaddyImage.vue'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const caddy = ref<CaddyDetail>({} as CaddyDetail)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isEditing = ref(false)
const editedCaddy = ref<CaddyDetail>({} as CaddyDetail)
const isSaving = ref(false)
const caddyImageRef = ref(null)

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
}

onMounted(async () => {
  await fetchCaddy()
})

const fetchCaddy = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await $fetch<ApiResponse>(`/api/admin/caddy/${route.params.id}`)
    caddy.value = response.caddy
  } catch (err) {
    error.value = '캐디 정보를 불러오는데 실패했습니다.'
    console.error('Error fetching caddy:', err)
  } finally {
    isLoading.value = false
  }
}

const startEditing = () => {
  // 깊은 복사를 위해 JSON 변환 사용
  editedCaddy.value = JSON.parse(JSON.stringify(caddy.value))
  isEditing.value = true
}

const cancelEditing = () => {
  if (isSaving.value) return
  editedCaddy.value = {} as CaddyDetail
  isEditing.value = false
}

const saveChanges = async () => {
  if (!editedCaddy.value) return
  let response: ApiResponse | undefined

  try {
    isSaving.value = true
    
    // 이미지 업로드 처리
    if (caddyImageRef.value && typeof caddyImageRef.value.saveImages === 'function') {
      console.log('Uploading caddy images...')
      const imageUploadSuccess = await caddyImageRef.value.saveImages()
      
      if (!imageUploadSuccess) {
        throw new Error('이미지 업로드에 실패했습니다.')
      }
    }
    
    // 캐디 정보 업데이트
    response = await $fetch<ApiResponse>(`/api/admin/caddy/${route.params.id}`, {
      method: 'PUT',
      body: editedCaddy.value
    })

    caddy.value = response.caddy
    isEditing.value = false
    editedCaddy.value = {} as CaddyDetail
    
    // 알림 메시지 대신 alert 창 표시
    setTimeout(() => {
      alert('캐디 정보가 성공적으로 업데이트되었습니다.')
      // 확인 버튼을 누르면 페이지 새로고침
      window.location.reload()
    }, 100) // 약간의 지연을 주어 UI가 업데이트된 후 alert이 표시되도록 함
  } catch (err) {
    console.error('Error updating caddy:', err)
    alert(err instanceof Error ? err.message : '캐디 정보 업데이트에 실패했습니다.')
    isSaving.value = false
  } finally {
    // 성공 시에는 새로고침되므로 finally 블록에서는 실패 시에만 상태를 변경
    if (response && caddy.value === response.caddy) {
      isSaving.value = false
    }
  }
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