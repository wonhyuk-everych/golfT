<template>
  <div v-if="notification" :class="`fixed top-4 right-4 px-4 py-2 rounded-lg text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`">
    {{ notification.message }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  notification: {
    type: Object,
    default: null
  }
})
</script>
