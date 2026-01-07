<template>
  <div class="px-4 py-2 flex flex-col gap-4 w-full">
    <div v-for="(field, index) in formFields" :key="index" class="flex flex-col gap-3 w-full">
      <!-- 필드 타이틀 -->
      <div class="font-pretendard font-normal text-sm leading-normal tracking-tight">
        <span :class="{ 'text-[#00A6D1]': field.mandatoryYn === 'Y' }">{{ field.title }}</span>
      </div>
      
      <!-- 텍스트 입력 필드 -->
      <div v-if="field.type === 'text'" class="w-full">
        <input 
          v-model="formValues[index]"
          type="text" 
          class="w-full py-3 px-2 border border-[#D9DDE3] rounded-md text-sm outline-none focus:border-[#00A6D1]"
          :class="{ 'border-red-500': showErrors && field.mandatoryYn === 'Y' && !formValues[index] }"
          :placeholder="field.mandatoryYn === 'Y' ? '필수 입력 항목입니다' : '선택 입력 항목입니다'"
        >
        <div v-if="showErrors && field.mandatoryYn === 'Y' && !formValues[index]" class="text-red-500 text-xs mt-1">
          필수 항목입니다
        </div>
      </div>
      
      <!-- 선택 필드 -->
      <div v-else-if="field.type === 'select'" class="w-full">
        <select 
          v-model="formValues[index]" 
          class="w-full py-3 px-2 border border-[#D9DDE3] rounded-md text-sm outline-none focus:border-[#00A6D1] appearance-none"
          :class="{ 'border-red-500': showErrors && field.mandatoryYn === 'Y' && !formValues[index] }"
        >
          <option value="" disabled selected>선택해주세요</option>
          <option 
            v-for="(item, itemIndex) in field.items" 
            :key="itemIndex" 
            :value="item.label"
          >
            {{ item.label }}
          </option>
        </select>
        <div v-if="showErrors && field.mandatoryYn === 'Y' && !formValues[index]" class="text-red-500 text-xs mt-1">
          필수 항목입니다
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

// Props 정의
const props = defineProps({
  formFields: {
    type: Array,
    required: false,
    default: () => []
  }
});

// Emits 정의
const emit = defineEmits(['submit']);

// 폼 값 관리
const formValues = ref<string[]>([]);
const showErrors = ref(false);

// 폼 필드 타입 정의
interface FormField {
  title: string;
  mandatoryYn: string;
  type: string;
  items?: { label: string }[];
}

// 폼 유효성 검사
const isFormValid = computed(() => {
  return props.formFields.every((field: FormField, index: number) => {
    if (field.mandatoryYn === 'Y') {
      return !!formValues.value[index];
    }
    return true;
  });
});

// 폼 유효성 검사 및 제출 처리
const submitForm = () => {
  showErrors.value = true;
  
  if (isFormValid.value) {
    // 제출할 데이터 형식 구성
    const result = props.formFields.map((field: FormField, index: number) => {
      return {
        title: field.title,
        type: field.type,
        value: formValues.value[index] || ''
      };
    });
    
    // 상위 컴포넌트에 데이터 전달
    emit('submit', { result });
    return true;
  } else {
    // 스크롤을 첫 번째 에러 필드로 이동
    const firstErrorField = document.querySelector('.border-red-500');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return false;
  }
};

// 외부에서 호출할 수 있도록 메소드 노출
defineExpose({
  submitForm
});
</script>

<style scoped>
/* All styles have been converted to Tailwind classes in the template */
</style>
