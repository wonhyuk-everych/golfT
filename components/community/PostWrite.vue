<template>
  <div class="post-write-container">
    <!-- 로딩 상태 표시 -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" v-if="isSubmitting">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
    </div>

    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />

    <!-- 게시글 작성 폼 -->
    <div class="bg-white">
      <!-- 지역 선택 -->
      <div class="p-4 border-b">
        <div class="flex items-center justify-between mb-2">
          <span v-if="formErrors.region" class="text-sm text-red-500">{{ formErrors.region }}</span>
        </div>
        <div class="relative">
          <div 
            class="border rounded-md p-3 flex justify-between items-center cursor-pointer"
            @click.stop="showRegionSelector = !showRegionSelector"
            data-region-selector-toggle
          >
            <span v-if="selectedRegion" class="text-[#1A1A1A]">
              {{ locale === 'ko' ? selectedRegion.city_name : selectedRegion.city_name_en }}
            </span>
            <span v-else class="text-gray-400">{{ $t('community.selectRegionPlaceholder') }}</span>
            <img src="~/assets/icons/arrow-down.svg" alt="">
          </div>
          
          <!-- 지역 선택 드롭다운 -->
          <div 
            v-if="showRegionSelector" 
            class="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            <div class="region-list">
              <div 
                v-for="region in regions" 
                :key="region.country_code_idx"
                class="p-3 hover:bg-gray-100 cursor-pointer"
                @click.stop="selectRegion(region)"
              >
                {{ locale === 'ko' ? region.city_name : region.city_name_en }}
              </div>
              <div v-if="regions.length === 0" class="p-3 text-center text-gray-500">
                {{ $t('community.noRegionsFound') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 제목 입력 -->
      <div class="p-4 border-b">
        <div class="flex items-center justify-between mb-2">
          <span v-if="formErrors.title" class="text-sm text-red-500">{{ formErrors.title }}</span>
        </div>
        <input 
          v-model="postTitle" 
          type="text" 
          class="w-full border rounded-md p-3 text-[#1A1A1A]"
          :placeholder="$t('community.titlePlaceholder')"
          maxlength="100"
        >
        <div class="text-right mt-1 text-xs text-gray-500">
          {{ postTitle.length }}/100
        </div>
      </div>

      <!-- 내용 입력 -->
      <div class="p-4 border-b">
        <div class="flex items-center justify-between mb-2">
          <span v-if="formErrors.content" class="text-sm text-red-500">{{ formErrors.content }}</span>
        </div>
        <textarea 
          v-model="postContent" 
          class="w-full border rounded-md p-3 text-[#1A1A1A] resize-none"
          :placeholder="$t('community.contentPlaceholder')"
          rows="10"
          maxlength="2000"
        />
        <div class="text-right mt-1 text-xs text-gray-500">
          {{ postContent.length }}/2000
        </div>
      </div>

      <!-- 이미지 업로드 -->
      <div class="p-4 border-b">
        <imageUpload v-model="uploadedFiles" @error="onUploadError" @files-ready="onFilesReady" />
      </div>

      <!-- 제출 버튼 -->
      <div class="p-4">
        <button 
          class="w-full bg-primary text-white py-3 rounded-md font-medium"
          :disabled="isSubmitting"
          @click="submitPost"
        >
          {{ $t('community.publish') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import ToastMessage from '~/components/common/ToastMessage.vue'
import imageUpload from '~/components/common/imageUpload.vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const { t } = useI18n()
const { loggedIn } = useUserSession()

// 폼 데이터
const postTitle = ref('')
const postContent = ref('')
const selectedRegion = ref(null)

// UI 상태
const isSubmitting = ref(false)
const showRegionSelector = ref(false)
const regions = ref([])
const formErrors = ref({
  title: '',
  content: '',
  region: ''
})

// 이미지 업로드
interface FileWithPreview extends File {
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
const uploadedFiles = ref<FileWithPreview[]>([])
const serializableFiles = ref<SerializableFile[]>([])

// 이미지 업로드 컴포넌트에서 변환된 파일 받기
const onFilesReady = (files: SerializableFile[]) => {
  serializableFiles.value = files
}

// 이미지 업로드 오류 처리
const onUploadError = (errorMessage: string) => {
  showToast.value = true
  toastMessage.value = errorMessage
  toastType.value = 'error'
}

// 토스트 메시지
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 지역 선택
const selectRegion = (region: any) => {
  selectedRegion.value = region
  showRegionSelector.value = false
  formErrors.value.region = ''
}

// 폼 유효성 검사
const validateForm = () => {
  let isValid = true
  formErrors.value = {
    title: '',
    content: '',
    region: ''
  }
  
  if (!selectedRegion.value) {
    formErrors.value.region = t('form.regionRequired')
    isValid = false
  }
  
  if (!postTitle.value.trim()) {
    formErrors.value.title = t('form.titleRequired')
    isValid = false
  }
  
  if (!postContent.value.trim()) {
    formErrors.value.content = t('form.contentRequired')
    isValid = false
  }
  
  return isValid
}

// 게시글 제출
const submitPost = async () => {
  // 로그인 확인
  if (!loggedIn.value) {
    showToast.value = true
    toastMessage.value = t('form.loginRequired')
    toastType.value = 'warning'
    return
  }
  
  // 폼 유효성 검사
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    // API 호출
    const response = await $fetch('/api/community/post/add', {
      method: 'POST',
      body: {
        country_code_idx: selectedRegion.value.country_code_idx,
        title: postTitle.value.trim(),
        content: postContent.value.trim(),
        images: serializableFiles.value
      }
    })
    
    if (response.success) {
      // 성공 메시지
      toastMessage.value = t('form.postSuccess')
      toastType.value = 'success'
      showToast.value = true
      
      // 폼 초기화
      resetForm()
      
      // 토스트 메시지가 표시될 시간을 주기 위해 지연 후 이벤트 발생
      setTimeout(() => {
        // 이벤트 발생 (부모 컴포넌트에서 처리)
        emit('post-created', response.data.post)
      }, 1000) // 1초 뒤에 이벤트 발생
    } else {
      toastMessage.value = t('form.' + response.error)
      toastType.value = 'error'
      showToast.value = true
    }
  } catch (error) {
    toastMessage.value = t('form.serverError')
    toastType.value = 'error'
    showToast.value = true
  } finally {
    isSubmitting.value = false
  }
}

// 폼 초기화
const resetForm = () => {
  postTitle.value = ''
  postContent.value = ''
  selectedRegion.value = null
  uploadedFiles.value = []
  serializableFiles.value = []
}

// 지역 데이터 가져오기
const fetchRegions = async () => {
  try {
    const response = await $fetch('/api/community/regions')
    
    if (response.success) {
      regions.value = response.data.regions
    } else {
      toastMessage.value = t('form.regionInfoError')
      toastType.value = 'error'
      showToast.value = true
    }
  } catch (error) {
    toastMessage.value = t('form.serverError')
    toastType.value = 'error'
    showToast.value = true
  }
}

// 이벤트 정의
const emit = defineEmits(['post-created'])

// 컴포넌트 마운트 시 지역 데이터 가져오기
onMounted(() => {
  fetchRegions()
  
  // 외부 클릭 시 지역 선택기 닫기
  document.addEventListener('click', (event) => {
    const target = event.target as Node
    const regionSelector = document.querySelector('.region-list')
    const regionButton = document.querySelector('[data-region-selector-toggle]')
    
    if (regionSelector && !regionSelector.contains(target) && 
        regionButton && !regionButton.contains(target) && 
        showRegionSelector.value) {
      showRegionSelector.value = false
    }
  })
})
</script>

<style scoped>
.region-list {
  max-height: 200px;
  overflow-y: auto;
}
</style>
