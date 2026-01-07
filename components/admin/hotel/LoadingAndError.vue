<template>
  <!-- 로딩 상태 -->
  <div v-if="isLoading" class="bg-white p-6 rounded-lg shadow-md flex justify-center items-center">
    <p class="text-gray-500">로딩 중...</p>
  </div>

  <!-- 에러 상태 -->
  <div v-else-if="error" class="bg-white p-6 rounded-lg shadow-md">
    <div class="text-center">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200" @click="onBack">
        목록으로 돌아가기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['back'])

const onBack = () => {
  emit('back')
}
</script>
