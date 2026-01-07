<template>
  <div v-if="hotel.localeTexts" class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">다국어 정보</h3>
    
    <!-- 언어 선택 탭 -->
    <div class="mb-4 border-b">
      <div class="flex space-x-4">
        <button 
          v-for="(_, lang) in hotel.localeTexts" 
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
      <!-- 호텔 설명 -->
      <div>
        <p class="text-sm text-gray-500">호텔 설명</p>
        <textarea v-if="isEditing" v-model="editedHotel.localeTexts[selectedLanguage].explain" class="form-textarea mt-1 block w-full rounded-md border-gray-300" rows="3" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.explain || '-' }}</p>
      </div>
      
      <!-- 호텔 간단 설명 -->
      <div>
        <p class="text-sm text-gray-500">호텔 간단 설명</p>
        <textarea v-if="isEditing" v-model="editedHotel.localeTexts[selectedLanguage].explainShort" class="form-textarea mt-1 block w-full rounded-md border-gray-300" rows="2" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.explainShort || '-' }}</p>
      </div>
      
      <!-- 주변 관광지 -->
      <div>
        <p class="text-sm text-gray-500">주변 관광지</p>
        <textarea v-if="isEditing" v-model="editedHotel.localeTexts[selectedLanguage].tour" class="form-textarea mt-1 block w-full rounded-md border-gray-300" rows="3" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.tour || '-' }}</p>
      </div>
      
      <!-- 교통 정보 -->
      <div>
        <p class="text-sm text-gray-500">교통 정보</p>
        <textarea v-if="isEditing" v-model="editedHotel.localeTexts[selectedLanguage].transportation" class="form-textarea mt-1 block w-full rounded-md border-gray-300" rows="3" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.transportation || '-' }}</p>
      </div>
      
      <!-- 언어 지원 -->
      <div>
        <p class="text-sm text-gray-500">언어 지원</p>
        <textarea v-if="isEditing" v-model="editedHotel.localeTexts[selectedLanguage].language" class="form-textarea mt-1 block w-full rounded-md border-gray-300" rows="2" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.language || '-' }}</p>
      </div>
      
      <!-- 객실 타입 -->
      <div>
        <p class="text-sm text-gray-500">객실 타입</p>
        <textarea v-if="isEditing" v-model="editedHotel.localeTexts[selectedLanguage].roomType" class="form-textarea mt-1 block w-full rounded-md border-gray-300" rows="2" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.roomType || '-' }}</p>
      </div>
      
      <!-- 객실 시설 -->
      <div>
        <p class="text-sm text-gray-500">객실 시설</p>
        <textarea v-if="isEditing" v-model="editedHotel.localeTexts[selectedLanguage].roomFacility" class="form-textarea mt-1 block w-full rounded-md border-gray-300" rows="3" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.roomFacility || '-' }}</p>
      </div>
      
      <!-- 추가 요금 -->
      <div>
        <p class="text-sm text-gray-500">추가 요금</p>
        <textarea v-if="isEditing" v-model="editedHotel.localeTexts[selectedLanguage].extraCharge" class="form-textarea mt-1 block w-full rounded-md border-gray-300" rows="2" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.extraCharge || '-' }}</p>
      </div>
      
      <!-- 주의 사항 -->
      <div>
        <p class="text-sm text-gray-500">주의 사항</p>
        <textarea v-if="isEditing" v-model="editedHotel.localeTexts[selectedLanguage].caution" class="form-textarea mt-1 block w-full rounded-md border-gray-300" rows="3" />
        <p v-else class="font-medium whitespace-pre-wrap">{{ selectedLocaleText?.caution || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from '#imports'

const props = defineProps({
  hotel: {
    type: Object,
    required: true
  },
  editedHotel: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const selectedLanguage = ref<string>('KO')

// 현재 선택된 언어의 다국어 텍스트를 반환하는 computed 속성
const selectedLocaleText = computed(() => {
  if (!props.hotel?.localeTexts || !selectedLanguage.value) return null
  return props.hotel.localeTexts[selectedLanguage.value]
})
</script>
