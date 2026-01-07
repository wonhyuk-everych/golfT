<template>
  <div class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">다국어 정보</h3>
    
    <!-- 언어 선택 탭 -->
    <div class="mb-4 border-b">
      <div class="flex space-x-4">
        <button 
          v-for="lang in availableLanguages" 
          :key="lang.code"
          :class="[`px-4 py-2 font-medium`, selectedLanguage === lang.code ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500']"
          @click="selectedLanguage = lang.code"
        >
          {{ lang.name }}
        </button>
      </div>
    </div>
    
    <!-- 선택된 언어의 컨텐츠 -->
    <div class="grid grid-cols-1 gap-4">
      <!-- 언어 능력 -->
      <div>
        <p class="text-sm text-gray-500">언어 능력</p>
        <textarea 
          v-if="isEditing" 
          :value="getLocaleValue('language')" 
          class="form-textarea mt-1 block w-full rounded-md border-gray-300" 
          rows="3"
          @input="updateLocaleValue('language', $event.target.value)" 
        />
        <p v-else class="font-medium whitespace-pre-wrap">{{ getDisplayLocaleValue('language') }}</p>
      </div>
      
      <!-- 전문 분야 -->
      <div>
        <p class="text-sm text-gray-500">전문 분야</p>
        <textarea 
          v-if="isEditing" 
          :value="getLocaleValue('specialty')" 
          class="form-textarea mt-1 block w-full rounded-md border-gray-300" 
          rows="3"
          @input="updateLocaleValue('specialty', $event.target.value)" 
        />
        <p v-else class="font-medium whitespace-pre-wrap">{{ getDisplayLocaleValue('specialty') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'
import type { CaddyDetail } from '~/types/admin/caddy'

const props = defineProps({
  caddy: {
    type: Object as () => CaddyDetail,
    required: true
  },
  editedCaddy: {
    type: Object as () => CaddyDetail,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:edited-caddy'])

// 사용 가능한 언어 목록
const availableLanguages = [
  { code: 'KO', name: '한국어' },
  { code: 'EN', name: '영어' }
]

const selectedLanguage = ref('KO')

// 현재 선택된 언어의 특정 필드 값을 가져오는 함수
const getLocaleValue = (field: string): string => {
  if (!props.editedCaddy?.localeTexts || !props.editedCaddy.localeTexts[selectedLanguage.value]) {
    return ''
  }
  return props.editedCaddy.localeTexts[selectedLanguage.value][field] || ''
}

// 표시용 로케일 값 가져오기 (읽기 전용 모드)
const getDisplayLocaleValue = (field: string): string => {
  if (!props.caddy?.localeTexts || !props.caddy.localeTexts[selectedLanguage.value]) {
    return '-'
  }
  return props.caddy.localeTexts[selectedLanguage.value][field] || '-'
}

// 현재 선택된 언어의 특정 필드 값을 업데이트하는 함수
const updateLocaleValue = (field: string, value: string) => {
  // 깊은 복사를 통해 새 객체 생성
  const updatedCaddy = JSON.parse(JSON.stringify(props.editedCaddy))
  
  // 해당 언어의 localeTexts가 없으면 초기화
  if (!updatedCaddy.localeTexts) {
    updatedCaddy.localeTexts = {}
  }
  
  if (!updatedCaddy.localeTexts[selectedLanguage.value]) {
    updatedCaddy.localeTexts[selectedLanguage.value] = {}
  }
  
  // 값 업데이트
  updatedCaddy.localeTexts[selectedLanguage.value][field] = value
  
  // 부모 컴포넌트에 업데이트된 객체 전달
  emit('update:edited-caddy', updatedCaddy)
}
</script>
