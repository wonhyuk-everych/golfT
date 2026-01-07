<template>
  <div class="space-y-6">
    <!-- 수정/저장/취소 버튼 영역 (상단 우측) -->
    <div class="flex justify-end mb-4">
      <template v-if="!isEditing">
        <button
          class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 mr-2"
          @click="navigateTo(`/admin/courses/${route.params.id}/price`)"
        >
          가격 수정
        </button>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" @click="startEditing">
          수정
        </button>
      </template>
      <template v-else>
        <button :disabled="isSaving" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed" @click="saveChanges">
          {{ isSaving ? '저장 중...' : '저장' }}
        </button>
        <button :disabled="isSaving" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ml-2" @click="cancelEditing">
          취소
        </button>
      </template>
    </div>

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

    <!-- 골프장 정보 -->
    <div v-else-if="course" class="space-y-6 bg-white rounded-lg p-6">
      <!-- 기본 정보 컴포넌트 -->
      <BasicInfo 
        :course="course" 
        :edited-course="editedCourse" 
        :is-editing="isEditing"
        :get-course-start-class="getCourseStartClass"
        :get-course-start-text="getCourseStartText"
        :get-booking-status-class="getBookingStatusClass"
        :get-booking-status-text="getBookingStatusText"
        :get-course-status-class="getCourseStatusClass"
        :get-course-status-text="getCourseStatusText"
      />

      <!-- 다국어 정보 컴포넌트 -->
      <LocaleInfo
        :course="course"
        :edited-course="editedCourse"
        :is-editing="isEditing"
        @update:edited-course="updatedCourse => editedCourse = updatedCourse"
      />
      
      <!-- 골프장 이미지 컴포넌트 -->
      <CourseImage 
        ref="courseImageRef"
        :course="course" 
        :edited-course="editedCourse" 
        :is-editing="isEditing"
      />


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '#imports'
import { useRoute } from 'vue-router'
import type { GolfCourse } from '~/types/admin/course'
import BasicInfo from '~/components/admin/course/BasicInfo.vue'
import PriceInfo from '~/components/admin/course/PriceInfo.vue'
import CourseImage from '~/components/admin/course/CourseImage.vue'
import CourseFacility from '~/components/admin/course/CourseFacility.vue'
import LocaleInfo from '~/components/admin/course/LocaleInfo.vue'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})


const route = useRoute()
const course = ref<GolfCourse>({} as GolfCourse)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isEditing = ref(false)
const editedCourse = ref<GolfCourse>({} as GolfCourse)
const isSaving = ref(false)
// notification 변수는 alert로 대체되어 제거됨

// 선택된 시설 업데이트 처리
const updateFacilities = (facilityIds: number[]) => {
  if (!editedCourse.value.facilities) {
    editedCourse.value.facilities = []
  }
  
  // 기존 시설 정보 삭제
  editedCourse.value.facilities = []
  
  // 새로운 시설 정보 추가
  facilityIds.forEach(id => {
    editedCourse.value.facilities.push({ golf_facility_type_idx: id })
  })
}

interface ApiResponse {
  course: GolfCourse
}

onMounted(async () => {
  await fetchCourse()
})

const fetchCourse = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await $fetch<ApiResponse>(`/api/admin/courses/${route.params.id}`)
    course.value = response.course
  } catch (err) {
    error.value = '골프장 정보를 불러오는데 실패했습니다.'
    console.error('Error fetching course:', err)
  } finally {
    isLoading.value = false
  }
}

const startEditing = () => {
  editedCourse.value = { ...course.value }
  // 시설 정보도 복사
  if (course.value.facilities) {
    editedCourse.value.facilities = [...course.value.facilities]
  } else {
    editedCourse.value.facilities = []
  }
  isEditing.value = true
}

const cancelEditing = () => {
  if (isSaving.value) return
  editedCourse.value = {} as GolfCourse
  isEditing.value = false
}

const courseImageRef = ref()

const saveChanges = async () => {
  if (!editedCourse.value) return

  try {
    isSaving.value = true

    // 1. CourseImage의 save() 호출 (이미지 업로드)
    let imageUrls = {}
    if (courseImageRef.value && courseImageRef.value.save) {
      imageUrls = await courseImageRef.value.save()
    }

    // 2. 업로드된 이미지 URL을 editedCourse에 반영
    Object.assign(editedCourse.value, imageUrls)

    // 3. 서버로 저장
    const response = await $fetch<ApiResponse>(`/api/admin/courses/${route.params.id}`, {
      method: 'PUT',
      body: editedCourse.value,
    })

    course.value = response.course
    isEditing.value = false
    editedCourse.value = {} as GolfCourse

    setTimeout(() => {
      alert('골프장 정보가 성공적으로 업데이트되었습니다.')
      window.location.reload()
    }, 100)
  } catch (err) {
    console.error('Error updating course:', err)
    alert('골프장 정보 업데이트에 실패했습니다.')
    isSaving.value = false
  }
}


const formatPrice = (price: number | null | undefined): string => {
  if (!price) return '-'
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

const getCourseStartClass = (status: string) => {
  return {
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getCourseStartText = (status: string) => {
  return status === 'Y' ? '가능' : '불가능'
}

const getBookingStatusClass = (status: string) => {
  return {
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getBookingStatusText = (status: string) => {
  return status === 'Y' ? '예약가능' : '예약불가'
}

const getCourseStatusClass = (status: string) => {
  return {
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getCourseStatusText = (status: string) => {
  return status === 'Y' ? '운영중' : '운영중지'
}

// hasAnyImages moved to CourseImage component
</script>
