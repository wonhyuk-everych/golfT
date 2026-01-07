<template>
  <div class="space-y-6">
    <!-- 알림 메시지 컴포넌트 -->
    <Notification :notification="notification" />

    <!-- 로딩 및 에러 상태 컴포넌트 -->
    <LoadingAndError 
      :is-loading="isLoading" 
      :error="_error" 
      @back="router.back()" 
    />

    <!-- 호텔 정보 -->
    <div v-if="!isLoading && !_error && hotel" class="space-y-6 bg-white rounded-lg p-6">
      <!-- 기본 정보 컴포넌트 -->
      <BasicInfo 
        :hotel="hotel" 
        :edited-hotel="editedHotel" 
        :is-editing="isEditing" 
      />
      
      <!-- 다국어 정보 컴포넌트 -->
      <LocaleInfo 
        :hotel="hotel" 
        :edited-hotel="editedHotel" 
        :is-editing="isEditing" 
      />
      
      <!-- 시설 및 서비스 컴포넌트 -->
      <FacilitiesAndServices 
        :hotel="hotel" 
        :is-editing="isEditing"
        @update:facilities="updateFacilities" 
      />
      
      <!-- 객실 정보 컴포넌트 -->
      <div class="border-b pb-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">객실 정보</h3>
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
            @click="router.push(`/admin/hotel/room/${hotel.hotelIdx}`)"
          >
            객실 정보 관리
          </button>
        </div>
      </div>
      
      <!-- 호텔 이미지 컴포넌트 -->
      <HotelImages 
        ref="hotelImagesComponent"
        :hotel="hotel" 
        :is-editing="isEditing"
        @update:hotel="updateHotelImages"
        @upload-complete="handleUploadComplete"
      />
      
      <!-- 편집 버튼 컴포넌트 -->
      <EditButtons 
        :is-editing="isEditing" 
        @start-edit="startEditing" 
        @cancel-edit="cancelEditing" 
        @save-edit="saveChanges" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'
import { useRoute, useRouter } from 'vue-router'
import Notification from '~/components/admin/hotel/Notification.vue'
import LoadingAndError from '~/components/admin/hotel/LoadingAndError.vue'
import EditButtons from '~/components/admin/hotel/EditButtons.vue'
import BasicInfo from '~/components/admin/hotel/BasicInfo.vue'
import LocaleInfo from '~/components/admin/hotel/LocaleInfo.vue'
import FacilitiesAndServices from '~/components/admin/hotel/FacilitiesAndServices.vue'
import HotelImages from '~/components/admin/hotel/HotelImages.vue'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

// 호텔 이미지 인터페이스
interface HotelImage {
  hotelImageIdx?: number
  hotelIdx: number
  imageType: string
  imageUrl: string
  mainYn: string
  useYn: string
}

// 호텔 시설 인터페이스
interface HotelFacility {
  hotelFacilityIdx: number
  hotelIdx: number
  facilityTypeCode: string
  facilityCode: string
  facilityName: string
  useYn: string
}

// 호텔 다국어 텍스트 인터페이스
interface HotelLocaleText {
  explain?: string
  explainShort?: string
  tour?: string
  transportation?: string
  language?: string
  roomType?: string
  roomFacility?: string
  extraCharge?: string
  caution?: string
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
  payInfo?: string
  refundInfo?: string
  serviceInfo?: string
  images?: HotelImage[]
  facilities?: HotelFacility[]
  localeTexts?: Record<string, HotelLocaleText>
}

interface ApiResponse {
  hotel: Hotel
}

const route = useRoute()
const router = useRouter()
const hotel = ref<Hotel>({} as Hotel)
const isLoading = ref(true)
const _error = ref<string | null>(null)
const isEditing = ref(false)
const editedHotel = ref<Hotel & { selectedFacilities?: { hotel: number[], room: number[], extra: number[] } }>({} as Hotel & { selectedFacilities: { hotel: number[], room: number[], extra: number[] } })
const isSaving = ref(false)
const notification = ref<{ type: 'success' | 'error', message: string } | null>(null)
const selectedLanguage = ref<string>('KO')
const hotelImagesComponent = ref<any>(null)

// 시설 타입 코드 - saveChanges 함수에서 사용됨
const FACILITY_TYPE = {
  HOTEL: 'H',  // 호텔 시설
  ROOM: 'R',   // 객실 시설
  EXTRA: 'E'   // 유료 옵션
}

onMounted(async () => {
  await fetchHotel()
})

const fetchHotel = async () => {
  try {
    isLoading.value = true
    _error.value = null
    const response = await $fetch<ApiResponse>(`/api/admin/hotel/${route.params.id}`)
    hotel.value = response.hotel
    
    // 시설 데이터는 FacilitiesAndServices 컴포넌트에서 처리함
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
  
  // Make sure localeTexts exists for each language
  if (!editedHotel.value.localeTexts) {
    editedHotel.value.localeTexts = {}
  }
  
  // Initialize localeTexts for the selected language if it doesn't exist
  if (!editedHotel.value.localeTexts[selectedLanguage.value]) {
    editedHotel.value.localeTexts[selectedLanguage.value] = {
      explain: '',
      explainShort: '',
      tour: '',
      transportation: '',
      language: '',
      roomType: '',
      roomFacility: '',
      extraCharge: '',
      caution: ''
    }
  }
  
  isEditing.value = true
}

const cancelEditing = () => {
  if (isSaving.value) return
  editedHotel.value = {
    selectedFacilities: {
      hotel: [],
      room: [],
      extra: []
    }
  } as Hotel & { selectedFacilities: { hotel: number[], room: number[], extra: number[] } }
  isEditing.value = false
}

// 시설 데이터 업데이트 함수
const updateFacilities = (facilities: { hotel: number[], room: number[], extra: number[] }) => {
  if (!editedHotel.value) return
  
  if (!editedHotel.value.selectedFacilities) {
    editedHotel.value.selectedFacilities = {
      hotel: [],
      room: [],
      extra: []
    }
  }
  
  // 선택된 시설 저장
  editedHotel.value.selectedFacilities.hotel = facilities.hotel
  editedHotel.value.selectedFacilities.room = facilities.room
  editedHotel.value.selectedFacilities.extra = facilities.extra
  
  // 시설 데이터 형식 변환은 저장 시에 처리함
}

// 호텔 이미지 업데이트 함수
const updateHotelImages = (updatedHotel: Hotel) => {
  if (!editedHotel.value) return
  
  // 이미지 정보 업데이트
  if (updatedHotel.images) {
    editedHotel.value.images = updatedHotel.images
  }
}

// 이미지 업로드 완료 핸들러
const handleUploadComplete = (success: boolean, errorMessage?: string) => {
  if (!success && errorMessage) {
    _error.value = errorMessage
    isLoading.value = false
    isSaving.value = false
  }
}

const saveChanges = async () => {
  if (!editedHotel.value) return

  try {
    isSaving.value = true
    
    // 호텔 이미지 업로드 컴포넌트를 통해 파일 업로드 처리
    if (hotelImagesComponent.value && editedHotel.value.images?.some((img: any) => img.file)) {
      const uploadSuccess = await hotelImagesComponent.value.uploadAllImages()
      if (!uploadSuccess) {
        throw new Error('이미지 업로드 중 오류가 발생했습니다.')
      }
    }
    
    // Prepare facilities data for API
    const facilitiesData = []
    
    // Process hotel facilities
    if (editedHotel.value.selectedFacilities?.hotel) {
      editedHotel.value.selectedFacilities.hotel.forEach(facilityTypeIdx => {
        facilitiesData.push({
          facilityTypeCode: FACILITY_TYPE.HOTEL,
          facilityCode: facilityTypeIdx.toString(),
          useYn: 'Y'
        })
      })
    }
    
    // Process room facilities
    if (editedHotel.value.selectedFacilities?.room) {
      editedHotel.value.selectedFacilities.room.forEach(facilityTypeIdx => {
        facilitiesData.push({
          facilityTypeCode: FACILITY_TYPE.ROOM,
          facilityCode: facilityTypeIdx.toString(),
          useYn: 'Y'
        })
      })
    }
    
    // Process extra facilities
    if (editedHotel.value.selectedFacilities?.extra) {
      editedHotel.value.selectedFacilities.extra.forEach(facilityTypeIdx => {
        facilitiesData.push({
          facilityTypeCode: FACILITY_TYPE.EXTRA,
          facilityCode: facilityTypeIdx.toString(),
          useYn: 'Y'
        })
      })
    }
    
    // Add facilities data to the hotel object
    editedHotel.value.facilities = facilitiesData
    
    // 호텔 정보 저장 (파일 객체는 제외하고 전송)
    const hotelDataToSave = JSON.parse(JSON.stringify(editedHotel.value))
    if (hotelDataToSave.images) {
      hotelDataToSave.images = hotelDataToSave.images.map((img: any) => {
        const { file, ...imageData } = img
        return imageData
      })
    }
    
    await $fetch(`/api/admin/hotel/${route.params.id}`, {
      method: 'PUT',
      body: hotelDataToSave,
    })
    
    // 호텔 정보 업데이트 후 확인 대화상자 표시
    notification.value = {
      type: 'success',
      message: '호텔 정보가 성공적으로 업데이트되었습니다.'
    }
    
    // 편집 모드 종료 및 데이터 새로고침
    isEditing.value = false
    await fetchHotel()
  } catch (err) {
    console.error('Error updating hotel:', err)
    notification.value = {
      type: 'error',
      message: '호텔 정보 업데이트 중 오류가 발생했습니다.'
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<style>

</style>