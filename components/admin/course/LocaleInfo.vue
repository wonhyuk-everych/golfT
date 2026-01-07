<template>
  <div v-if="course.localeTexts" class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">다국어 정보</h3>
    
    <!-- 언어 선택 탭 -->
    <div class="mb-4 border-b">
      <div class="flex space-x-4">
        <button 
          v-for="(_, lang) in course.localeTexts" 
          :key="lang"
          :class="[`px-4 py-2 font-medium`, selectedLanguage === lang ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500']"
          @click="selectedLanguage = lang"
        >
          {{ lang === 'KO' ? '한국어' : lang === 'EN' ? '영어' : lang }}
        </button>
      </div>
    </div>
    
    <!-- 선택된 언어의 컨텐츠 -->
    <div class="grid grid-cols-1 gap-4">
      <!-- 캐디 약관 -->
      <div>
        <p class="text-sm text-gray-500">캐디 약관</p>
        <textarea 
          v-if="isEditing" 
          :value="getLocaleValue('caddyCovenants')" 
          class="form-textarea mt-1 block w-full rounded-md border-gray-300" 
          rows="3"
          @input="updateLocaleValue('caddyCovenants', $event.target.value)" 
        />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.caddyCovenants || '-' }}</p>
      </div>
      
      <!-- 캐디 규정 -->
      <div>
        <p class="text-sm text-gray-500">캐디 규정</p>
        <textarea 
          v-if="isEditing" 
          :value="getLocaleValue('caddyRule')" 
          class="form-textarea mt-1 block w-full rounded-md border-gray-300" 
          rows="3"
          @input="updateLocaleValue('caddyRule', $event.target.value)" 
        />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.caddyRule || '-' }}</p>
      </div>
      
      <!-- 우천 취소 정책 -->
      <div>
        <p class="text-sm text-gray-500">우천 취소 정책</p>
        <textarea 
          v-if="isEditing" 
          :value="getLocaleValue('rainCheck')" 
          class="form-textarea mt-1 block w-full rounded-md border-gray-300" 
          rows="3"
          @input="updateLocaleValue('rainCheck', $event.target.value)" 
        />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.rainCheck || '-' }}</p>
      </div>
      
      <!-- 갤러리 요금 -->
      <div>
        <p class="text-sm text-gray-500">갤러리 요금</p>
        <textarea 
          v-if="isEditing" 
          :value="getLocaleValue('galleryFee')" 
          class="form-textarea mt-1 block w-full rounded-md border-gray-300" 
          rows="3"
          @input="updateLocaleValue('galleryFee', $event.target.value)" 
        />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.galleryFee || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from '#imports'
import type { GolfCourse } from '~/types/admin/course'

const props = defineProps({
  course: {
    type: Object as () => GolfCourse,
    required: true
  },
  editedCourse: {
    type: Object as () => GolfCourse,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:editedCourse'])

const selectedLanguage = ref<string>('KO')

// 현재 선택된 언어의 다국어 텍스트를 반환하는 computed 속성
const selectedLocaleText = computed(() => {
  if (!props.course?.localeTexts || !selectedLanguage.value) return null
  return props.course.localeTexts[selectedLanguage.value]
})

// 현재 선택된 언어의 특정 필드 값을 가져오는 함수
const getLocaleValue = (field: string): string => {
  if (!props.editedCourse?.localeTexts || !props.editedCourse.localeTexts[selectedLanguage.value]) {
    return ''
  }
  return props.editedCourse.localeTexts[selectedLanguage.value][field] || ''
}

// 현재 선택된 언어의 특정 필드 값을 업데이트하는 함수
const updateLocaleValue = (field: string, value: string) => {
  // 깊은 복사를 통해 새 객체 생성
  const updatedCourse = JSON.parse(JSON.stringify(props.editedCourse))
  
  // 해당 언어의 localeTexts가 없으면 초기화
  if (!updatedCourse.localeTexts) {
    updatedCourse.localeTexts = {}
  }
  
  if (!updatedCourse.localeTexts[selectedLanguage.value]) {
    updatedCourse.localeTexts[selectedLanguage.value] = {}
  }
  
  // 값 업데이트
  updatedCourse.localeTexts[selectedLanguage.value][field] = value
  
  // 부모 컴포넌트에 업데이트된 객체 전달
  emit('update:editedCourse', updatedCourse)
}
</script>