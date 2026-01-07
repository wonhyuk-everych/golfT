<template>
  <div class="space-y-6">
    <!-- 저장 버튼 영역 (상단 우측) -->
    <div class="flex justify-end mb-4">
      <button :disabled="isSaving" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed" @click="saveCourse">
        {{ isSaving ? '저장 중...' : '저장' }}
      </button>
    </div>
    <div v-if="isSaving" class="bg-white p-6 rounded-lg shadow-md flex justify-center items-center">
      <p class="text-gray-500">저장 중...</p>
    </div>
    <div v-else class="space-y-6 bg-white rounded-lg p-6">
      <BasicInfo :course="editedCourse" :edited-course="editedCourse" :is-editing="true"
        :get-course-start-class="getCourseStartClass"
        :get-course-start-text="getCourseStartText"
        :get-booking-status-class="getBookingStatusClass"
        :get-booking-status-text="getBookingStatusText"
        :get-course-status-class="getCourseStatusClass"
        :get-course-status-text="getCourseStatusText"
      />
      <LocaleInfo :course="editedCourse" :edited-course="editedCourse" :is-editing="true" @update:edited-course="updatedCourse => editedCourse = updatedCourse" />
      <CourseImage ref="courseImageRef" :course="editedCourse" :edited-course="editedCourse" :is-editing="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'
import { useRouter } from 'vue-router'
import type { GolfCourse } from '~/types/admin/course'
import BasicInfo from '~/components/admin/course/BasicInfo.vue'
import PriceInfo from '~/components/admin/course/PriceInfo.vue'
import CourseImage from '~/components/admin/course/CourseImage.vue'
import CourseFacility from '~/components/admin/course/CourseFacility.vue'
import LocaleInfo from '~/components/admin/course/LocaleInfo.vue'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const router = useRouter()
const editedCourse = ref<GolfCourse>({} as GolfCourse)
const isSaving = ref(false)
const courseImageRef = ref()

const updateFacilities = (facilityIds: number[]) => {
  if (!editedCourse.value.facilities) {
    editedCourse.value.facilities = []
  }
  editedCourse.value.facilities = []
  facilityIds.forEach(id => {
    editedCourse.value.facilities.push({ golf_facility_type_idx: id })
  })
}

const saveCourse = async () => {
  try {
    isSaving.value = true
    let imageUrls = {}
    if (courseImageRef.value && courseImageRef.value.save) {
      imageUrls = await courseImageRef.value.save()
    }
    Object.assign(editedCourse.value, imageUrls)
    await $fetch('/api/admin/courses/create', {
      method: 'POST',
      body: editedCourse.value,
    })
    alert('골프장이 성공적으로 등록되었습니다.')
    router.push('/admin/courses')
  } catch (err) {
    console.error('Error creating course:', err)
    alert('골프장 등록에 실패했습니다.')
  } finally {
    isSaving.value = false
  }
}

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '-'
  return price.toLocaleString()
}

function getCourseStartClass(status: string) {
  return status === 'Y' ? 'text-green-600' : 'text-gray-400'
}
function getCourseStartText(status: string) {
  return status === 'Y' ? '운영' : '미운영'
}
function getBookingStatusClass(status: string) {
  return status === 'Y' ? 'text-blue-600' : 'text-gray-400'
}
function getBookingStatusText(status: string) {
  return status === 'Y' ? '예약 가능' : '예약 불가'
}
function getCourseStatusClass(status: string) {
  return status === 'Y' ? 'text-green-600' : 'text-gray-400'
}
function getCourseStatusText(status: string) {
  return status === 'Y' ? '정상' : '중지'
}
</script>
