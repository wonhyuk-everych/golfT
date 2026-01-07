<template>
  <div class="flex justify-end space-x-4">
    <button 
      v-if="!isEditing" 
      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      @click="startEdit" 
    >
      정보 수정
    </button>
    <template v-else>
      <button 
        class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
        @click="cancelEdit" 
      >
        취소
      </button>
      <button 
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        @click="saveEdit" 
      >
        저장
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['start-edit', 'cancel-edit', 'save-edit'])

const startEdit = () => {
  emit('start-edit')
}

const cancelEdit = () => {
  emit('cancel-edit')
}

const saveEdit = () => {
  emit('save-edit')
}
</script>
