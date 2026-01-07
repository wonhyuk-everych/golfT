<template>
  <div v-if="golfCourse" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
    <!-- Header Section -->
    <div class="flex flex-col gap-2 mb-2">
      <!-- Top Row -->
      <div class="flex justify-between items-center py-1">
        <!-- Left Side -->
        <div class="flex items-center gap-4">
          <!-- Checkbox -->
          <div 
            :class="[`w-5 h-5 border rounded-sm cursor-pointer`, isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300']"
            @click="handleSelect"
          ></div>
          <!-- Golf Course Label -->
          <span class="text-base font-bold text-gray-900">{{ $t('shoppingCart.golfCourse.title') }}</span>
        </div>
        <!-- Right Side -->
        <div class="flex items-center gap-1 cursor-pointer" @click="handleViewProduct">
          <span class="text-xs font-normal text-blue-500">{{ $t('shoppingCart.viewProduct') }}</span>
          <!-- Chevron Icon -->
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      <!-- Divider -->
      <div class="border-t border-gray-100"></div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col gap-4 py-2">
      <!-- Golf Course Info -->
      <div class="flex items-center gap-4">
        <!-- Course Image -->
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
          <img 
            :src="golfCourse.Image_url || '/placeholder-image.jpg'" 
            :alt="golfCourse.name_kr" 
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
        <!-- Course Names -->
        <div class="flex flex-col gap-0.5">
          <h3 class="text-base font-bold text-gray-900">{{ golfCourse.name_kr }}</h3>
          <p class="text-sm font-normal text-gray-500">{{ golfCourse.name_en }}</p>
        </div>
      </div>

      <!-- Round Date & Time -->
      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.golfCourse.roundDate') }}</p>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ formatDateLocale(golfCourse.reservation_date, locale.value) }}</span>
          <span class="text-sm font-normal text-gray-900">/</span>
          <span class="text-sm font-normal text-gray-900">{{ golfCourse.golf_course_time.substring(0, 5) }}</span>
        </div>
      </div>

      <!-- Reservation Info -->
      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.golfCourse.reservationInfo') }}</p>
        <div class="flex flex-col gap-1">
          <!-- Green Fee -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.golfCourse.greenFee') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ golfCourse.number_of_reservation }} {{ $t('shoppingCart.golfCourse.person') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ formatPriceWithRate(golfCourse.golf_course_sale_fee, locale) }}</span>
          </div>
          <!-- Cart Fee -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.golfCourse.cartFee') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ golfCourse.number_of_reservation }} {{ $t('shoppingCart.golfCourse.car') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ formatPriceWithRate(golfCourse.cart_sale_fee, locale) }}</span>
          </div>
          <!-- Caddy Fee -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.golfCourse.caddyFee') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ golfCourse.number_of_reservation }} {{ $t('shoppingCart.golfCourse.person') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ formatPriceWithRate(golfCourse.caddy_sale_fee, locale) }}</span>
          </div>
          <!-- Van Fee -->
          <div v-if="golfCourse.number_of_call_van > 0" class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.golfCourse.vanFee') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ golfCourse.number_of_call_van }} {{ $t('shoppingCart.golfCourse.car') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ formatPriceWithRate(golfCourse.callvan_sale_fee, locale) }}</span>
          </div>
        </div>
      </div>

      <div v-if="golfCourse.number_of_call_van > 0" class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.golfCourse.callVanTitle') }}</p>
        <div class="flex flex-col gap-1">
          <!-- Green Fee -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ golfCourse.car_type }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ golfCourse.number_of_call_van }} {{ $t('shoppingCart.golfCourse.car') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ golfCourse.pickup_location }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ golfCourse.dropoff_location }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Button -->
    <div class="mt-4">
      <button 
        class="w-full bg-blue-500 text-cyan-50 py-3 px-2 rounded-lg text-sm font-normal hover:bg-blue-600 transition-colors"
        @click="handlePayment"
      >
        {{ formatPriceOriginal(golfCourse.total_price, locale) }} {{ $t('shoppingCart.payment') }}
      </button>
    </div>
  </div>
  <div v-else class="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto mb-4 text-center">
    {{ $t('shoppingCart.emptyCart') }}
  </div>
</template>

<script setup lang="ts">
import type { GolfCourseCartItem } from '~/server/api/shopping-cart/index'
import { formatDateLocale } from '~/utils/formatters'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceWithRate, formatPriceOriginal } = useExchangeRate()

// Props for making the component reusable
const props = defineProps({
  golfCourse: {
    type: Object as () => GolfCourseCartItem,
    required: false,
    default: null
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

// Emits for handling events
const emit = defineEmits(['select', 'viewProduct', 'payment'])

// Methods
const handleSelect = () => {
  emit('select', props.golfCourse.shopping_cart_golf_idx)
}

const handleViewProduct = () => {
  if (props.golfCourse) {
    emit('viewProduct', props.golfCourse.course_idx)
  }
}

const handlePayment = () => {
  if (props.golfCourse) {
    emit('payment', props.golfCourse)
  }
}
</script>

<style scoped>
/* Custom styles if needed */
.shadow-lg {
  box-shadow: 0px 3px 15px 0px rgba(54, 53, 53, 0.15);
}
</style>