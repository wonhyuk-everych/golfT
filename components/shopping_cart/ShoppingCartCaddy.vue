<template>
  <div v-if="caddy" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
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
          <!-- Caddy Label -->
          <span class="text-base font-bold text-gray-900">{{ $t('shoppingCart.caddy.title') }}</span>
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
      <!-- Caddy Info -->
      <div class="flex items-center gap-4">
        <!-- Caddy Image -->
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
          <img 
            :src="caddy.Image_url || '/placeholder-image.jpg'" 
            :alt="caddy.name" 
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
        <!-- Caddy Names -->
        <div class="flex flex-col gap-0.5">
          <h3 class="text-base font-bold text-gray-900">{{ caddy.name }} ({{ caddy.caddy_code }})</h3>
          <p class="text-sm font-normal text-gray-500">{{ caddy.name_kr }} / {{ caddy.name_en }}</p>
        </div>
      </div>
    </div>

    <!-- Payment Button -->
    <div class="mt-4">
      <button 
        class="w-full bg-blue-500 text-cyan-50 py-3 px-2 rounded-lg text-sm font-normal hover:bg-blue-600 transition-colors"
        @click="handlePayment"
      >
        {{ formatPriceOriginal(caddy.total_price, locale) }} {{ $t('shoppingCart.payment') }}
      </button>
    </div>
  </div>
  <div v-else class="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto mb-4 text-center">
    {{ $t('shoppingCart.emptyCart') }}
  </div>
</template>

<script setup lang="ts">
import type { CaddyCartItem } from '~/server/api/shopping-cart/index'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceWithRate, formatPriceOriginal } = useExchangeRate()

// Props for making the component reusable
const props = defineProps({
  caddy: {
    type: Object as () => CaddyCartItem,
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
  emit('select', props.caddy.shopping_cart_caddy_idx)
}

const handleViewProduct = () => {
  if (props.caddy) {
    emit('viewProduct', props.caddy.caddy_idx)
  }
}

const handlePayment = () => {
  if (props.caddy) {
    emit('payment', props.caddy)
  }
}
</script>

<style scoped>
/* Custom styles if needed */
.shadow-lg {
  box-shadow: 0px 3px 15px 0px rgba(54, 53, 53, 0.15);
}
</style>