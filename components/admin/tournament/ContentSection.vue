<template>
  <div class="border-b border-gray-200 pb-5">
    <h3 class="text-lg font-medium leading-6 text-gray-900">대회 콘텐츠</h3>
    <div class="mt-4">
      <!-- 콘텐츠 에디터 (편집 모드) -->
      <div v-if="isEditing" class="border border-gray-300 rounded-md p-4 bg-gray-50">
        <div class="mb-4 flex justify-between items-center">
          <h4 class="font-medium">동적 필드 편집</h4>
          <button 
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
            @click="addContentField"
          >
            + 필드 추가
          </button>
        </div>
        
        <div v-if="contentFields.length === 0" class="text-gray-500 text-center py-4">
          추가된 필드가 없습니다. '필드 추가' 버튼을 클릭하여 필드를 추가해주세요.
        </div>
        
        <div v-for="(field, index) in contentFields" :key="index" class="mb-6 p-4 border border-gray-200 rounded-md bg-white">
          <div class="flex justify-between items-center mb-3">
            <h5 class="font-medium text-sm">필드 #{{ index + 1 }}</h5>
            <button 
              class="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
              @click="removeContentField(index)"
            >
              삭제
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 제목 입력 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">필드 제목</label>
              <input 
                v-model="field.title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="필드 제목을 입력하세요"
              >
            </div>
            
            <!-- 필수 여부 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">필수 여부</label>
              <div class="flex space-x-4">
                <label class="inline-flex items-center">
                  <input 
                    v-model="field.mandatoryYn"
                    class="form-radio"
                    type="radio" 
                    :name="`mandatory_${index}`" 
                    value="Y" 
                  >
                  <span class="ml-2">필수</span>
                </label>
                <label class="inline-flex items-center">
                  <input 
                    v-model="field.mandatoryYn"
                    class="form-radio"
                    type="radio" 
                    :name="`mandatory_${index}`" 
                    value="N" 
                  >
                  <span class="ml-2">선택</span>
                </label>
              </div>
            </div>
            
            <!-- 필드 타입 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">필드 타입</label>
              <select 
                v-model="field.type" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="text">텍스트 입력</option>
                <option value="select">선택형</option>
              </select>
            </div>
          </div>
          
          <!-- 선택형 옵션 (select 타입인 경우만 표시) -->
          <div v-if="field.type === 'select'" class="mt-4">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700">선택 옵션</label>
              <button 
                class="px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-xs"
                :disabled="field.items && field.items.length >= 10"
                @click="addSelectItem(field)"
              >
                + 옵션 추가
              </button>
            </div>
            
            <div v-if="!field.items || field.items.length === 0" class="text-gray-500 text-sm text-center py-2">
              추가된 옵션이 없습니다. '옵션 추가' 버튼을 클릭하여 옵션을 추가해주세요.
            </div>
            
            <div v-for="(item, itemIndex) in field.items" :key="itemIndex" class="flex items-center mb-2">
              <input 
                v-model="item.label"
                class="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                placeholder="옵션 텍스트"
              >
              <button 
                class="ml-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                @click="removeSelectItem(field, itemIndex)"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 콘텐츠 뷰어 (보기 모드) -->
      <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[200px]">
        <div v-if="parsedContent.length > 0">
          <div v-for="(field, index) in parsedContent" :key="index" class="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
            <div class="flex justify-between">
              <h4 class="font-medium">{{ field.title }}</h4>
              <span class="text-sm px-2 py-1 rounded-full" :class="field.mandatoryYn === 'Y' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'">
                {{ field.mandatoryYn === 'Y' ? '필수' : '선택' }}
              </span>
            </div>
            
            <div class="mt-2">
              <div v-if="field.type === 'text'" class="text-gray-600">
                텍스트 입력 필드
              </div>
              <div v-else-if="field.type === 'select'" class="text-gray-600">
                <div>선택형 필드:</div>
                <ul class="list-disc list-inside ml-4 mt-1">
                  <li v-for="(item, itemIndex) in field.items" :key="itemIndex">{{ item.label }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-4">
          등록된 콘텐츠 필드가 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '[]'
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:model-value'])

// Define content fields structure
type ContentField = {
  title: string,
  mandatoryYn: 'Y' | 'N',
  type: 'text' | 'select',
  items?: Array<{ label: string }>
}

const contentFields = ref<ContentField[]>([])
const parsedContent = ref<ContentField[]>([])

// Parse content JSON when component data changes
const parseContentJson = () => {
  try {
    if (props.modelValue && props.modelValue.trim() !== '') {
      const contentData = JSON.parse(props.modelValue)
      if (contentData && Array.isArray(contentData.content)) {
        // Handle nested content structure from original page
        parsedContent.value = contentData.content
      } else if (Array.isArray(contentData)) {
        // Handle direct array format
        parsedContent.value = contentData
      } else {
        parsedContent.value = []
      }
    } else {
      parsedContent.value = []
    }
  } catch (e) {
    console.error('콘텐츠 JSON 파싱 오류:', e)
    parsedContent.value = []
  }
}

// Initialize content fields when edit mode changes
const initializeContentFields = () => {
  if (props.isEditing) {
    if (parsedContent.value.length > 0) {
      contentFields.value = JSON.parse(JSON.stringify(parsedContent.value))
    } else {
      contentFields.value = []
    }
  }
}

// Add a new content field
const addContentField = () => {
  contentFields.value.push({
    title: '',
    mandatoryYn: 'Y',
    type: 'text',
  })
}

// Remove a content field
const removeContentField = (index: number) => {
  contentFields.value.splice(index, 1)
  updateModelValue()
}

// Add a select item to a field
const addSelectItem = (field: ContentField) => {
  if (!field.items) {
    field.items = []
  }
  
  if (field.items.length < 10) {
    field.items.push({ label: '' })
  }
  
  updateModelValue()
}

// Remove a select item from a field
const removeSelectItem = (field: ContentField, itemIndex: number) => {
  if (field.items) {
    field.items.splice(itemIndex, 1)
    
    if (field.items.length === 0) {
      delete field.items
    }
    
    updateModelValue()
  }
}

// Update the model value with current content fields
const updateModelValue = () => {
  // Format in the same structure as the original page component
  const contentJson = {
    content: contentFields.value
  }
  emit('update:model-value', JSON.stringify(contentJson))
}

// Watch for changes in content fields and update model value
watch(contentFields, () => {
  updateModelValue()
}, { deep: true })

// Watch for changes in model value to update parsed content
watch(() => props.modelValue, () => {
  parseContentJson()
  if (props.isEditing) {
    initializeContentFields()
  }
}, { immediate: true })

// Watch for changes in edit mode to initialize fields
watch(() => props.isEditing, () => {
  initializeContentFields()
}, { immediate: true })

// Initialize on component mount
onMounted(() => {
  parseContentJson()
  initializeContentFields()
})
</script>
