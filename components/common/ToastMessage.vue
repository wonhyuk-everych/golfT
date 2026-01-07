<template>
  <Transition name="toast">
    <div 
      v-if="show" 
      class="fixed bottom-16 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-md shadow-lg z-50 w-4/5 max-w-[500px]"
      :class="{
        'bg-primary bg-opacity-90 text-white': type === 'success',
        'bg-red-500 bg-opacity-90 text-white': type === 'error',
        'bg-yellow-500 bg-opacity-90 text-white': type === 'warning'
      }"
    >
      <p class="text-center break-words">{{ message }}</p>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning'].includes(value)
  }
})

const emit = defineEmits(['update:show'])

// Auto-hide toast after duration
watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emit('update:show', false)
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}
</style>
