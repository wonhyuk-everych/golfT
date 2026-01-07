<template>
  <div class="space-y-6">
    <!-- 알림 메시지 컴포넌트 -->
    <div v-if="notification" :class="`p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`">
      <div class="flex">
        <div class="flex-shrink-0">
          <span v-if="notification.type === 'success'" class="text-green-400">✓</span>
          <span v-else class="text-red-400">✕</span>
        </div>
        <div class="ml-3">
          <p>{{ notification.message }}</p>
        </div>
        <div class="ml-auto pl-3">
          <button class="inline-flex text-gray-400" @click="notification = null">
            <span class="sr-only">닫기</span>
            <span class="text-lg">&times;</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 로딩 및 에러 상태 컴포넌트 -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
    </div>
    
    <div v-if="!isLoading && _error" class="p-6 text-center">
      <div class="text-red-500 mb-4">{{ _error }}</div>
      <button class="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200" @click="router.back()">
        뒤로 가기
      </button>
    </div>

    <!-- 호텔 룸 정보 관리 -->
    <div v-if="!isLoading && !_error && hotel" class="space-y-6 bg-white rounded-lg p-6">
      <!-- 호텔 기본 정보 헤더 -->
      <div class="flex justify-between items-center border-b pb-4">
        <div>
          <h1 class="text-2xl font-bold">{{ hotel.nameKr }} - 객실 관리</h1>
          <p class="text-gray-500">{{ hotel.nameEn }}</p>
        </div>
        <button 
          class="text-blue-600 hover:text-blue-800"
          @click="router.push(`/admin/hotel/${hotel.hotelIdx}`)"
        >
          호텔 정보로 돌아가기
        </button>
      </div>
      
      <!-- 편집 버튼 -->
      <div class="flex justify-end">
        <button 
          v-if="!isEditing" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="startEditing"
        >
          객실 정보 수정
        </button>
        <div v-else class="space-x-3">
          <button 
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            @click="cancelEditing"
          >
            취소
          </button>
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            :disabled="isSaving"
            @click="saveChanges"
          >
            {{ isSaving ? '저장중...' : '저장' }}
          </button>
        </div>
      </div>
      
      <!-- 객실 정보 컴포넌트 -->
      <RoomInfo 
        ref="roomInfoComponent"
        v-model:is-editing="isEditing"
        :hotel="hotel" 
        @update:hotel="updateRoomInfo" 
      />
      
      <!-- 신규 객실 추가 버튼 -->
      <div v-if="isEditing" class="flex justify-center">
        <button 
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md flex items-center"
          @click="openRoomCreateModal"
        >
          <span class="mr-2">+</span> 신규 객실 추가
        </button>
      </div>
    </div>
    
    <!-- 객실 생성 모달 -->
    <div v-if="showRoomCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">신규 객실 추가</h3>
            <button class="text-gray-500 hover:text-gray-700" @click="closeRoomCreateModal">
              <span class="text-xl">&times;</span>
            </button>
          </div>
          <RoomCreate 
            :hotel-idx="hotel?.hotelIdx" 
            @room-created="handleRoomCreated" 
            @close="closeRoomCreateModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'
import { useRoute, useRouter } from 'vue-router'

// Import components
import RoomInfo from '~/components/admin/hotel/RoomInfo.vue'
import RoomCreate from '~/components/admin/hotel/RoomCreate.vue'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

// 호텔 룸 인터페이스
interface HotelRoom {
  hotelRoomIdx?: number
  hotelIdx: number
  roomName: string
  roomNameEn: string
  roomProductPrice: number
  roomSalePrice: number
  viewType: string
  bedType: string
  breakfastYn: string
  useYn: string
  roomImageUrl?: string
  roomImages?: {imageUrl: string}[]
}

// 호텔 정보 인터페이스
interface Hotel {
  hotelIdx: number
  nameKr: string
  nameEn: string
  countryCode: string
  cityCode: string
  checkIn: number
  checkOut: number
  address: string
  homePage: string
  hotelStatus: string
  createdAt: string
  updatedAt: string
  rooms?: HotelRoom[]
}

interface ApiResponse {
  hotel: Hotel
}

const route = useRoute()
const router = useRouter()
const hotel = ref<Hotel>({} as Hotel)
const editedHotel = ref<Hotel>({} as Hotel)
const isLoading = ref(true)
const _error = ref<string | null>(null)
const isEditing = ref(false)
const isSaving = ref(false)
const notification = ref<{ type: 'success' | 'error', message: string } | null>(null)
const roomInfoComponent = ref<InstanceType<typeof RoomInfo> | null>(null)
const showRoomCreateModal = ref(false)

onMounted(async () => {
  await fetchHotel()
})

const fetchHotel = async () => {
  try {
    isLoading.value = true
    _error.value = null
    const response = await $fetch<ApiResponse>(`/api/admin/hotel/${route.params.id}`)
    hotel.value = response.hotel
  } catch (err) {
    console.error('Error fetching hotel:', err)
    _error.value = '호텔 정보를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const startEditing = () => {
  // Deep copy the hotel object
  editedHotel.value = JSON.parse(JSON.stringify(hotel.value))
  isEditing.value = true
}

const cancelEditing = () => {
  if (isSaving.value) return
  isEditing.value = false
}

// 객실 정보 업데이트 함수
const updateRoomInfo = (updatedHotel: Hotel) => {
  if (!editedHotel.value) return
  
  // 객실 정보 업데이트
  if (updatedHotel.rooms) {
    editedHotel.value.rooms = updatedHotel.rooms
  }
}

// 객실 생성 모달 관련 함수
const openRoomCreateModal = () => {
  showRoomCreateModal.value = true
}

const closeRoomCreateModal = () => {
  showRoomCreateModal.value = false
}

// 객실 생성 완료 처리
const handleRoomCreated = (newRoom) => {
  // 새 객실을 호텔 데이터에 추가
  if (!hotel.value.rooms) {
    hotel.value.rooms = []
  }
  hotel.value.rooms.push(newRoom)
  
  // 편집 중인 호텔 데이터에도 추가
  if (!editedHotel.value.rooms) {
    editedHotel.value.rooms = []
  }
  editedHotel.value.rooms.push(newRoom)
  
  // 모달 닫기
  closeRoomCreateModal()
  
  // 성공 메시지 표시
  notification.value = {
    type: 'success',
    message: `객실 "${newRoom.roomName}"이(가) 성공적으로 추가되었습니다.`
  }
}

// 모든 변경사항 저장
const saveChanges = async () => {
  if (!editedHotel.value || isSaving.value) return

  try {
    isSaving.value = true
    
    // 객실 정보 컴포넌트를 통해 변경사항 저장
    if (roomInfoComponent.value) {
      const roomSaveSuccess = await roomInfoComponent.value.saveAllRoomChanges()
      if (!roomSaveSuccess) {
        throw new Error('객실 정보 저장 중 오류가 발생했습니다.')
      }
    }
    
    // 성공 메시지 표시
    notification.value = {
      type: 'success',
      message: '모든 객실 정보가 성공적으로 저장되었습니다.'
    }
    
    // 편집 모드 종료 및 데이터 새로고침
    isEditing.value = false
    await fetchHotel()
  } catch (err) {
    console.error('Error saving rooms:', err)
    notification.value = {
      type: 'error',
      message: '객실 정보 저장 중 오류가 발생했습니다.'
    }
  } finally {
    isSaving.value = false
  }
}
</script>
