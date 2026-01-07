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

    <!-- 호텔 정보 생성 폼 -->
    <div v-if="!isLoading && !_error" class="space-y-6 bg-white rounded-lg p-6">
      <div class="border-b pb-4">
        <h2 class="text-xl font-bold">호텔 신규 등록</h2>
      </div>
      
      <!-- 기본 정보 컴포넌트 -->
      <BasicInfo 
        :hotel="hotel" 
        :edited-hotel="editedHotel" 
        :is-editing="true" 
      />
      
      <!-- 다국어 정보 컴포넌트 -->
      <LocaleInfo 
        :hotel="hotel" 
        :edited-hotel="editedHotel" 
        :is-editing="true" 
      />
      
      <!-- 시설 및 서비스 컴포넌트 -->
      <FacilitiesAndServices 
        :hotel="hotel" 
        :is-editing="true"
        @update:facilities="updateFacilities" 
      />
      
      <!-- 호텔 이미지 컴포넌트 -->
      <HotelImages 
        ref="hotelImagesComponent"
        :hotel="hotel" 
        :is-editing="true"
        @update:hotel="updateHotelImages"
        @upload-complete="handleUploadComplete"
      />
      
      <!-- 등록 버튼 -->
      <div class="flex justify-end space-x-4">
        <button 
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
          @click="router.back()"
          :disabled="isSaving"
        >
          취소
        </button>
        <button 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
          @click="saveNewHotel"
          :disabled="isSaving"
        >
          <span v-if="isSaving" class="mr-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isSaving ? '생성 중...' : '호텔 생성' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'
import { useRouter } from 'vue-router'
import Notification from '~/components/admin/hotel/Notification.vue'
import LoadingAndError from '~/components/admin/hotel/LoadingAndError.vue'
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
  hotelIdx?: number
  imageType: string
  imageUrl: string
  mainYn: string
  useYn: string
  file?: File
}

// 호텔 시설 인터페이스
interface HotelFacility {
  hotelFacilityIdx?: number
  hotelIdx?: number
  facilityTypeCode: string
  facilityCode: string
  facilityName?: string
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
  hotelIdx?: number
  nameKr: string
  nameEn: string
  countryCode: string
  cityCode: string
  checkIn: number
  checkOut: number
  address: string
  homePage: string
  hotelStatus: string
  payInfo?: string
  refundInfo?: string
  serviceInfo?: string
  payCautionCheckImageUrl?: string
  images?: HotelImage[]
  facilities?: HotelFacility[]
  localeTexts?: Record<string, HotelLocaleText>
}

const router = useRouter()
const hotel = ref<Hotel>({} as Hotel)
const isLoading = ref(false)
const _error = ref<string | null>(null)
const editedHotel = ref<Hotel & { selectedFacilities?: { hotel: number[], room: number[], extra: number[] } }>({
  nameKr: '',
  nameEn: '',
  countryCode: '',
  cityCode: '',
  checkIn: 15, // Default check-in time (15:00)
  checkOut: 11, // Default check-out time (11:00)
  address: '',
  homePage: '',
  hotelStatus: 'Y',
  payInfo: '',
  refundInfo: '',
  serviceInfo: '',
  images: [],
  localeTexts: {
    KO: {
      explain: '',
      explainShort: '',
      tour: '',
      transportation: '',
      language: '',
      roomType: '',
      roomFacility: '',
      extraCharge: '',
      caution: ''
    },
    EN: {
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
  },
  selectedFacilities: {
    hotel: [],
    room: [],
    extra: []
  }
})

const isSaving = ref(false)
const notification = ref<{ type: 'success' | 'error', message: string } | null>(null)
const selectedLanguage = ref<string>('KO')
const hotelImagesComponent = ref<any>(null)

// 시설 타입 코드
const FACILITY_TYPE = {
  HOTEL: 'H',  // 호텔 시설
  ROOM: 'R',   // 객실 시설
  EXTRA: 'E'   // 유료 옵션
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

// 새 호텔 저장 함수
const saveNewHotel = async () => {
  try {
    isSaving.value = true
    
    // 기본 정보 검증
    if (!editedHotel.value.nameKr) {
      throw new Error('호텔 이름(한글)은 필수 입력 사항입니다.');
    }
    
    if (!editedHotel.value.nameEn) {
      throw new Error('호텔 이름(영문)은 필수 입력 사항입니다.');
    }
    
    if (!editedHotel.value.countryCode) {
      throw new Error('국가 코드는 필수 입력 사항입니다.');
    }
    
    if (!editedHotel.value.cityCode) {
      throw new Error('도시 코드는 필수 입력 사항입니다.');
    }
    
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
    
    // Create hotel API 호출
    const response = await $fetch('/api/admin/hotel/create', {
      method: 'POST',
      body: hotelDataToSave,
    })
    
    // 호텔 생성 완료 후 알림
    notification.value = {
      type: 'success',
      message: '호텔이 성공적으로 생성되었습니다.'
    }
    
    // 새로 생성된 호텔의 상세 페이지로 이동 (1초 후)
    setTimeout(() => {
      router.push(`/admin/hotel/${response.hotelIdx}`)
    }, 1000)
    
  } catch (err: any) {
    console.error('Error creating hotel:', err)
    notification.value = {
      type: 'error',
      message: err.message || '호텔 생성 중 오류가 발생했습니다.'
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<style>
</style>
