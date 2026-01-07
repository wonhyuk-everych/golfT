<!-- Event Detail Page -->
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

    <!-- 이벤트 정보 -->
    <div v-else-if="event" class="space-y-6 bg-white rounded-lg p-6">
      <!-- 기본 정보 섹션 -->
      <div class="border-b border-gray-200 pb-5">
        <h3 class="text-lg font-medium leading-6 text-gray-900">기본 정보</h3>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이벤트 ID</label>
            <input
              v-model="event.event_idx"
              disabled
              class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이벤트 상태</label>
            <select
              v-if="isEditing"
              v-model="editedEvent.event_status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Y">노출</option>
              <option value="N">숨김</option>
            </select>
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <span :class="getStatusClass(event.event_status)">
                {{ getStatusText(event.event_status) }}
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">타이틀</label>
            <input
              v-if="isEditing"
              v-model="editedEvent.title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ event.title }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">시작일</label>
            <input
              v-if="isEditing"
              v-model="editedEvent.start_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ formatDate(event.start_date) }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">종료일</label>
            <input
              v-if="isEditing"
              v-model="editedEvent.end_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
            <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md">
              {{ formatDate(event.end_date) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 이미지 섹션 -->
      <div class="border-b border-gray-200 pb-5">
        <ImageUpload
          ref="imageUploadComponent"
          title="이벤트 이미지"
          :images="isEditing ? editedEvent.images || [] : event.images || []"
          :is-editing="isEditing"
          id-field="event_image_idx"
          :alt-text="event?.title || '이벤트 이미지'"
          :entity-id="editedEvent?.event_idx"
          entity-type="event"
          @update:images="updateImages"
          @upload-complete="handleUploadComplete"
        />
      </div>

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
import ImageUpload from '~/components/admin/common/imageUpload.vue'

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
  created_at?: string
  created_member_idx?: number
  updated_at?: string | null
  updated_member_idx?: number | null
  file?: File | null // 파일 객체 추가
}

interface Event {
  event_idx: number
  title: string
  start_date: string
  end_date: string
  event_status: string
  created_at: string
  created_member_idx: number
  updated_at: string | null
  updated_member_idx: number | null
  images?: EventImage[]
}

interface ApiResponse {
  event: Event
}

const route = useRoute()
const router = useRouter()
const event = ref<Event | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isEditing = ref(false)
const editedEvent = ref<Event | null>(null)
const isSaving = ref(false)
const imageUploadComponent = ref<InstanceType<typeof ImageUpload> | null>(null)

const fetchEvent = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await $fetch<ApiResponse>(`/api/admin/event/${route.params.id}`)
    event.value = response.event
  } catch (err) {
    error.value = '이벤트 정보를 불러오는데 실패했습니다.'
    console.error('Error fetching event:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchEvent()
})

const startEditing = () => {
  editedEvent.value = JSON.parse(JSON.stringify(event.value))
  isEditing.value = true
}

const cancelEditing = () => {
  editedEvent.value = null
  isEditing.value = false
}

const saveChanges = async () => {
  if (!editedEvent.value) return
  isLoading.value = true
  error.value = null
  isSaving.value = true

  try {
    // 이미지 업로드 컴포넌트를 통해 파일 업로드 처리
    if (imageUploadComponent.value && editedEvent.value.images?.some((img: EventImage) => img.file)) {
      const uploadSuccess = await imageUploadComponent.value.uploadAllImages()
      if (!uploadSuccess) {
        throw new Error('이미지 업로드 중 오류가 발생했습니다.')
      }
    }

    // 이벤트 정보 저장 (파일 객체는 제외하고 전송)
    const eventDataToSave = JSON.parse(JSON.stringify(editedEvent.value))
    if (eventDataToSave.images) {
      eventDataToSave.images = eventDataToSave.images.map((img: EventImage) => {
        const { file, ...imageData } = img
        return imageData
      })
    }

    const response = await fetch(`/api/admin/event/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventDataToSave),
    })

    const result = await response.json()

    if (response.ok) {
      // 성공적으로 저장됨
      await fetchEvent()
      isEditing.value = false
    } else {
      // 에러 처리
      error.value = result.message || '이벤트 수정 중 오류가 발생했습니다.'
    }
  } catch (err) {
    console.error('이벤트 수정 실패:', err)
    error.value = '서버 통신 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

const addImage = () => {
  if (!editedEvent.value) return
  if (!editedEvent.value.images) {
    editedEvent.value.images = []
  }
  
  const newImage: EventImage = {
    image_url: '',
    sort: editedEvent.value.images.length + 1,
    main_yn: editedEvent.value.images.length === 0 ? 'Y' : 'N', // 첫 번째 이미지는 메인으로 설정
    use_yn: 'Y',
    file: null // 파일 객체를 저장할 속성 추가
  }
  
  editedEvent.value.images.push(newImage)
}

const removeImage = (index: number) => {
  if (!editedEvent.value || !editedEvent.value.images) return
  editedEvent.value.images.splice(index, 1)
  
  // 순서 재정렬
  editedEvent.value.images.forEach((img, idx) => {
    img.sort = idx + 1
  })
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ko-KR')
}

const getStatusClass = (status: string) => {
  return {
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getStatusText = (status: string) => {
  return status === 'Y' ? '노출' : '숨김'
}

// 이미지 업데이트 핸들러 (ImageUpload 컴포넌트에서 전달받음)
const updateImages = (newImages: EventImage[]) => {
  if (newImages && Array.isArray(newImages) && editedEvent.value) {
    editedEvent.value.images = JSON.parse(JSON.stringify(newImages))
  } else {
    console.error('Invalid newImages or editedEvent is null', { newImages, editedEvent: editedEvent.value })
  }
}

// 커스텀 이미지 업데이트 이벤트 리스너 추가
onMounted(() => {
  document.addEventListener('image-update', ((event: CustomEvent) => {
    if (event.detail && event.detail.images && editedEvent.value) {
      editedEvent.value.images = JSON.parse(JSON.stringify(event.detail.images))
    }
  }) as EventListener)
})

// 이미지 업로드 완료 핸들러
const handleUploadComplete = (success: boolean, errorMessage?: string) => {
  if (!success && errorMessage) {
    error.value = errorMessage
    isLoading.value = false
    isSaving.value = false
  }
}
</script>
