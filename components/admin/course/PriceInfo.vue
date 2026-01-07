<template>
  <div class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">요금 정보</h3>
    <div class="space-y-6">
      <!-- 그린피 정보 -->
      <div>
        <h4 class="text-base font-medium mb-2">그린피 (주중)</h4>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">주중</p>
            <input v-if="isEditing" v-model="editedCourse.weekdayGreenFee" class="form-input mt-1 block w-full rounded-md border-gray-300" type="number">
            <p v-else class="font-medium">{{ formatPrice(course.weekdayGreenFee) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">주중 할인가</p>
            <input v-if="isEditing" v-model="editedCourse.weekdayGreenSaleFee" class="form-input mt-1 block w-full rounded-md border-gray-300" type="number">
            <p v-else class="font-medium">{{ formatPrice(course.weekdayGreenSaleFee) }}</p>
          </div>
        </div>
      </div>
      <div>
        <h4 class="text-base font-medium mb-2">그린피 (주말)</h4>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">주말</p>
            <input v-if="isEditing" v-model="editedCourse.weekendGreenFee" class="form-input mt-1 block w-full rounded-md border-gray-300" type="number">
            <p v-else class="font-medium">{{ formatPrice(course.weekendGreenFee) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">주말 할인가</p>
            <input v-if="isEditing" v-model="editedCourse.weekendGreenSaleFee" class="form-input mt-1 block w-full rounded-md border-gray-300" type="number">
            <p v-else class="font-medium">{{ formatPrice(course.weekendGreenSaleFee) }}</p>
          </div>
        </div>
      </div>

      <!-- 캐디피 정보 -->
      <div>
        <h4 class="text-base font-medium mb-2">캐디피</h4>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">정상가</p>
            <input v-if="isEditing" v-model="editedCourse.caddyFee" class="form-input mt-1 block w-full rounded-md border-gray-300" type="number">
            <p v-else class="font-medium">{{ formatPrice(course.caddyFee) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">할인가</p>
            <input v-if="isEditing" v-model="editedCourse.caddySaleFee" class="form-input mt-1 block w-full rounded-md border-gray-300" type="number">
            <p v-else class="font-medium">{{ formatPrice(course.caddySaleFee) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500" />
            <!-- Empty cell for grid alignment -->
          </div>
        </div>
      </div>

      <!-- 카트피 정보 -->
      <div>
        <h4 class="text-base font-medium mb-2">카트피</h4>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">정상가</p>
            <input v-if="isEditing" v-model="editedCourse.cartFee" class="form-input mt-1 block w-full rounded-md border-gray-300" type="number">
            <p v-else class="font-medium">{{ formatPrice(course.cartFee) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">할인가</p>
            <input v-if="isEditing" v-model="editedCourse.cartSaleFee" class="form-input mt-1 block w-full rounded-md border-gray-300" type="number">
            <p v-else class="font-medium">{{ formatPrice(course.cartSaleFee) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500" />
            <!-- Empty cell for grid alignment -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  course: {
    type: Object,
    required: true
  },
  editedCourse: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  formatPrice: {
    type: Function,
    required: true
  }
})
</script>
