<template>
  <div class="border-t border-gray-200 pt-6 mt-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">골프장 주요시설</h3>
    
    <div v-if="isLoading" class="flex justify-center py-4">
      <p class="text-gray-500">시설 정보 로딩 중...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
      <p class="text-red-500">{{ error }}</p>
    </div>
    
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div 
        v-for="facility in allFacilities" 
        :key="facility.golf_facility_type_idx" 
        class="flex flex-col items-center p-3 border rounded-lg cursor-pointer"
        :class="{
          'bg-blue-50 border-blue-300': isFacilitySelected(facility.golf_facility_type_idx),
          'hover:bg-gray-50': !isFacilitySelected(facility.golf_facility_type_idx) || isEditing,
          'hover:bg-blue-100': isFacilitySelected(facility.golf_facility_type_idx) && isEditing
        }"
        @click="isEditing && toggleFacility(facility.golf_facility_type_idx)"
      >
        <img 
          :src="`/images/icon/golf_facilities_${facility.icon_name}.svg`" 
          :alt="facility.text" 
          class="w-10 h-10 mb-2"
          @error="handleImageError"
        >
        <span class="text-sm text-center">{{ facility.text }}</span>
      </div>
      
      <div v-if="allFacilities.length === 0" class="col-span-full text-center py-4 text-gray-500">
        시설 정보가 없습니다.
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from '#imports'

interface FacilityType {
  golf_facility_type_idx: number
  icon_name: string
  text: string
}

interface CourseFacility {
  golf_facility_type_idx: number
}

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  editedCourse: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:facilities'])

const allFacilities = ref<FacilityType[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const selectedFacilities = ref<number[]>([])

// 초기 선택된 시설 설정
watch(() => props.course?.facilities, (newFacilities) => {
  if (newFacilities) {
    selectedFacilities.value = newFacilities.map((f: CourseFacility) => f.golf_facility_type_idx)
  }
}, { immediate: true })

// 편집 모드에서 시설 선택/해제
const toggleFacility = (facilityId: number) => {
  if (!props.isEditing) return
  
  const index = selectedFacilities.value.indexOf(facilityId)
  if (index > -1) {
    selectedFacilities.value.splice(index, 1)
  } else {
    selectedFacilities.value.push(facilityId)
  }
  
  // 믐리에게 선택된 시설 변경 알리기
  emit('update:facilities', selectedFacilities.value)
}

// 시설이 선택되었는지 확인
const isFacilitySelected = (facilityId: number) => {
  return selectedFacilities.value.includes(facilityId)
}

onMounted(async () => {
  await fetchFacilityTypes()
})

const fetchFacilityTypes = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await $fetch('/api/admin/courses/golf-course-facility-types')
    allFacilities.value = response.facilityTypes || []
  } catch (err) {
    console.error('Error fetching facility types:', err)
    error.value = '시설 정보를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const handleImageError = (event: Event) => {
  // 이미지 로드 실패 시 기본 이미지로 대체
  const imgElement = event.target as HTMLImageElement
  imgElement.src = '/images/icon/golf_facilities_default.svg'
}
</script>

<style scoped>
/* 필요한 스타일이 있다면 여기에 추가 */
</style>