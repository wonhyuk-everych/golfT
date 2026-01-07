<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="close">
    <!-- Semi-transparent background overlay -->
    <div class="absolute inset-0 bg-black opacity-50"></div>
    
    <!-- Modal Content (centered, fixed height, flex column) -->
    <div class="relative bg-white w-full max-w-md rounded-t-lg mx-4 flex flex-col" style="height: 480px;">
      <!-- Header (fixed) -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
        <h3 class="text-base font-medium">{{ title }}</h3>
        <button class="text-gray-500" @click="close">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <!-- Search Box (fixed) -->
      <div class="p-4 border-b border-gray-200 shrink-0">
        <div class="relative">
          <input 
            v-model="searchTerm" 
            type="text" 
            :placeholder="placeholder" 
            class="w-full border border-gray-300 rounded-md pl-10 pr-4 py-3 text-sm"
            @input="searchLocations"
          >
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      <!-- 직접 입력 필드 추가 -->
      <div class="p-4 border-b border-gray-200 shrink-0 bg-gray-50">
        <input
          v-model="customInput"
          type="text"
          placeholder="직접 출발지 입력 (예: 호텔명, 역 이름 등등 자유롭게 입력해주세요)"
          class="w-full border border-cyan-300 rounded-md px-4 py-2 text-sm"
        />
      </div>
      <!-- Address List (scrollable only this area) -->
      <div class="flex-1 overflow-y-auto divide-y divide-gray-200">
        <div v-if="isLoading" class="p-4 text-center text-gray-500">
          <div class="flex justify-center items-center">
            <svg class="animate-spin h-5 w-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span class="ml-2">로딩 중...</span>
          </div>
        </div>
        <div v-else-if="error" class="p-4 text-center text-red-500">
          {{ error }}
          <button class="mt-2 text-cyan-500 underline" @click="fetchLocations">다시 시도</button>
        </div>
        <div v-else-if="filteredLocations.length === 0" class="p-4 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>
        <button 
          v-for="(location, index) in filteredLocations" 
          :key="index"
          class="flex items-center w-full p-4 text-left hover:bg-gray-50 transition-colors"
          @click="selectLocation(location)"
        >
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ location.name }}</p>
            <p class="text-xs text-gray-500">{{ location.address }}</p>
          </div>
          <svg v-if="selectedLocation === location.name" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <!-- Bottom Action Buttons (fixed) -->
      <div class="p-4 border-t border-gray-200 flex space-x-2 shrink-0">
        <button 
          class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
          @click="close"
        >
          취소
        </button>
        <button 
          class="flex-1 py-3 bg-cyan-500 text-white rounded-md text-sm font-medium"
          @click="confirm"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';

interface Location {
  name: string;
  address: string;
}

interface Props {
  modelValue: boolean;
  courseIdx: number;
  title?: string;
  placeholder?: string;
  selectedLocation?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '주소 선택',
  placeholder: '호텔 또는 숙소 이름을 검색하세요',
  selectedLocation: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', location: Location): void;
  (e: 'confirm', location: string): void;
}>();

// State
const searchTerm = ref('');
const tempSelectedLocation = ref(props.selectedLocation);
const locations = ref<Location[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const customInput = ref('');

// Watch for changes in the selected location from parent
watch(() => props.selectedLocation, (newValue) => {
  tempSelectedLocation.value = newValue;
});

// Fetch locations when the modal is opened
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    fetchLocations();
  }
});

// Initial fetch on component mount
onMounted(() => {
  if (props.modelValue) {
    fetchLocations();
  }
});

// Filtered locations based on search term
const filteredLocations = computed(() => {
  if (!searchTerm.value.trim()) {
    return locations.value;
  }
  
  const term = searchTerm.value.toLowerCase();
  return locations.value.filter(location => 
    location.name.toLowerCase().includes(term) || 
    location.address.toLowerCase().includes(term)
  );
});

// Fetch locations from API
const fetchLocations = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Call the API endpoint
    const { data } = await useFetch('/api/golf-course/callvan/location', {
      params: {
        courseIdx: props.courseIdx
      }
    });
    
    // Update locations with the API response
    if (data.value) {
      locations.value = data.value;
    }
  } catch (err) {
    console.error('Error fetching locations:', err);
    error.value = '위치 정보를 불러오는데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
};

// Close the modal
const close = () => {
  emit('update:modelValue', false);
};

// Select a location from the list
const selectLocation = (location: Location) => {
  tempSelectedLocation.value = location.name;
  customInput.value = location.name;
  emit('select', location);
};

// Confirm location selection and close modal
const confirm = () => {
  let result: Location | null = null;
  if (customInput.value.trim()) {
    result = { name: customInput.value.trim(), address: '' };
  } else if (tempSelectedLocation.value) {
    const found = locations.value.find(l => l.name === tempSelectedLocation.value);
    if (found) result = found;
    else result = { name: tempSelectedLocation.value, address: '' };
  }
  if (result) {
    emit('select', result);
    emit('update:modelValue', false);
  }
};
</script>