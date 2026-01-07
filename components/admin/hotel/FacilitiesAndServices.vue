<template>
  <!-- 호텔 시설 및 서비스 섹션 -->
  <div class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">호텔 시설 및 서비스</h3>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="facility in hotelFacilityTypes" :key="facility.hotel_facility_type_idx" class="flex items-center">
        <input 
          :id="`hotel-facility-${facility.hotel_facility_type_idx}`" 
          v-model="hotelFacilities" 
          type="checkbox" 
          :value="facility.hotel_facility_type_idx" 
          :disabled="!isEditing" 
          class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        >
        <label :for="`hotel-facility-${facility.hotel_facility_type_idx}`" class="ml-2 text-sm text-gray-700">{{ facility.text }}</label>
      </div>
      <div v-if="hotelFacilityTypes.length === 0" class="col-span-3 text-gray-500 text-sm">
        호텔 시설 정보가 없습니다.
      </div>
    </div>
  </div>
  
  <!-- 객실 시설 및 서비스 섹션 -->
  <div class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">객실 시설 및 서비스</h3>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="facility in roomFacilityTypes" :key="facility.hotel_facility_type_idx" class="flex items-center">
        <input 
          :id="`room-facility-${facility.hotel_facility_type_idx}`" 
          v-model="roomFacilities" 
          type="checkbox" 
          :value="facility.hotel_facility_type_idx" 
          :disabled="!isEditing" 
          class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        >
        <label :for="`room-facility-${facility.hotel_facility_type_idx}`" class="ml-2 text-sm text-gray-700">{{ facility.text }}</label>
      </div>
      <div v-if="roomFacilityTypes.length === 0" class="col-span-3 text-gray-500 text-sm">
        객실 시설 정보가 없습니다.
      </div>
    </div>
  </div>
  
  <!-- 유료 옵션 섹션 -->
  <div class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">유료 옵션</h3>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="facility in extraFacilityTypes" :key="facility.hotel_facility_type_idx" class="flex items-center">
        <input 
          :id="`extra-facility-${facility.hotel_facility_type_idx}`" 
          v-model="extraFacilities" 
          type="checkbox" 
          :value="facility.hotel_facility_type_idx" 
          :disabled="!isEditing" 
          class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        >
        <label :for="`extra-facility-${facility.hotel_facility_type_idx}`" class="ml-2 text-sm text-gray-700">{{ facility.text }}</label>
      </div>
      <div v-if="extraFacilityTypes.length === 0" class="col-span-3 text-gray-500 text-sm">
        유료 옵션 정보가 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from '#imports'
import { useFetch } from '#app'

// 호텔 관련 프롭스 정의
const props = defineProps({
  hotel: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

// 시설 타입 데이터
const facilityTypes = ref<Array<{hotel_facility_type_idx: number, facility_type: string, text: string}>>([]);

// 선택된 시설 데이터
const selectedFacilities = ref({
  hotel: [] as number[],
  room: [] as number[],
  extra: [] as number[]
});

// 이벤트 정의
const emit = defineEmits(['update:facilities'])

// 시설 초기화 및 데이터 로드 함수
const initializeFacilities = () => {
  // 선택된 시설 초기화
  selectedFacilities.value = {
    hotel: [],
    room: [],
    extra: []
  }
  
  // 호텔 시설 데이터 로드
  if (props.hotel?.hotel_facilities && props.hotel.hotel_facilities.length > 0) {
    props.hotel.hotel_facilities.forEach(facility => {
      const facilityTypeIdx = Number(facility.hotel_facility_type_idx)
      if (!isNaN(facilityTypeIdx)) {
        selectedFacilities.value.hotel.push(facilityTypeIdx)
      }
    })
  }
  
  // 객실 시설 데이터 로드
  if (props.hotel?.room_facilities && props.hotel.room_facilities.length > 0) {
    props.hotel.room_facilities.forEach(facility => {
      const facilityTypeIdx = Number(facility.hotel_facility_type_idx)
      if (!isNaN(facilityTypeIdx)) {
        selectedFacilities.value.room.push(facilityTypeIdx)
      }
    })
  }
  
  // 유료 옵션 데이터 로드
  if (props.hotel?.extra_options && props.hotel.extra_options.length > 0) {
    props.hotel.extra_options.forEach(facility => {
      const facilityTypeIdx = Number(facility.hotel_facility_type_idx)
      if (!isNaN(facilityTypeIdx)) {
        selectedFacilities.value.extra.push(facilityTypeIdx)
      }
    })
  }
  
  // 변경된 시설 데이터를 부모 컴포넌트에 전달
  emitFacilitiesUpdate()
}

// 호텔 시설 타입 데이터 가져오기
const fetchFacilityTypes = async () => {
  try {
    const { data, error: fetchError } = await useFetch('/api/admin/hotel/hotel-facility-types', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (fetchError.value) {
      console.error('시설 타입 정보를 가져오는 중 오류가 발생했습니다.')
      return
    }
    
    if (data.value && data.value.facilityTypes) {
      facilityTypes.value = data.value.facilityTypes
    }
  } catch (err) {
    console.error('시설 타입 정보를 가져오는 중 오류가 발생했습니다.', err)
  }
}

// 시설 데이터 변경시 부모에게 전달하는 함수
const emitFacilitiesUpdate = () => {
  emit('update:facilities', {
    hotel: selectedFacilities.value.hotel,
    room: selectedFacilities.value.room,
    extra: selectedFacilities.value.extra
  })
}

onMounted(async () => {
  await fetchFacilityTypes()
  
  // 초기 시설 데이터 로드
  if (props.hotel) {
    initializeFacilities()
  }
})

// 호텔 데이터가 변경되면 시설 데이터 다시 초기화
watch(() => props.hotel, (newVal) => {
  if (newVal) {
    initializeFacilities()
  }
}, { deep: true })

// isEditing이 true로 변경될 때 시설 데이터 초기화
watch(() => props.isEditing, (newVal) => {
  if (newVal === true && props.hotel) {
    initializeFacilities()
  }
})

// 시설 타입별로 필터링하는 computed 속성
const hotelFacilityTypes = computed(() => {
  return facilityTypes.value.filter((f) => f.facility_type === 'H')
})

const roomFacilityTypes = computed(() => {
  return facilityTypes.value.filter((f) => f.facility_type === 'R')
})

const extraFacilityTypes = computed(() => {
  return facilityTypes.value.filter((f) => f.facility_type === 'E')
})

// 양방향 바인딩을 위한 computed 속성
const hotelFacilities = computed({
  get: () => selectedFacilities.value.hotel,
  set: (val) => {
    selectedFacilities.value.hotel = val
    emitFacilitiesUpdate()
  }
})

const roomFacilities = computed({
  get: () => selectedFacilities.value.room,
  set: (val) => {
    selectedFacilities.value.room = val
    emitFacilitiesUpdate()
  }
})

const extraFacilities = computed({
  get: () => selectedFacilities.value.extra,
  set: (val) => {
    selectedFacilities.value.extra = val
    emitFacilitiesUpdate()
  }
})

// 사용하지 않는 시설 관련 computed 속성은 제거함
</script>
