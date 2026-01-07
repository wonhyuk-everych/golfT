<template>
  <div v-if="callvan" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
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
          <!-- Callvan Label -->
          <span class="text-base font-bold text-gray-900">{{ $t('shoppingCart.callvan.title') }}</span>
        </div>
      </div>
      
      <!-- Divider -->
      <div class="border-t border-gray-100"></div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col gap-4 py-2">
      <!-- Callvan Info -->
      <div class="flex items-center gap-4">
        <!-- Callvan Image -->
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
          <img 
            src="~@/assets/images/shoppingcart_callvan.jpg"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
        <!-- Callvan Names -->
        <div class="flex flex-col gap-0.5">
          <h3 class="text-base font-bold text-gray-900">{{ callvan.round_trip_yn === 'Y' ? $t('shoppingCart.callvan.roundTrip') : $t('shoppingCart.callvan.oneWay') }}</h3>
        </div>
      </div>

      <!-- Round Date & Time -->
      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.callvan.depature') }}1</p>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.depatureDate') }}: {{ formatDateLocale(callvan.start_date, locale.value) }}</span>
          <!--
          <span class="text-sm font-normal text-gray-900">/</span>
          <span class="text-sm font-normal text-gray-900">{{ callvan.start_time }}</span>
          -->
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.depatureLocation') }}: {{ callvan.pickup_location }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.arrivalLocation') }}: {{ callvan.dropoff_location }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.number') }}: {{ callvan.number_of_reservation }}</span>
        </div>
      </div>

      <!-- Callvan Info -->
      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.callvan.depature') }}2</p>
        <!--
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.depatureDate') }}: {{ formatDateLocale(callvan.end_date, locale.value) }}</span>
          <span class="text-sm font-normal text-gray-900">/</span>
          <span class="text-sm font-normal text-gray-900">{{ callvan.end_time }}</span>
        </div>
        -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.depatureLocation') }}: {{ callvan.dropoff_location }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.arrivalLocation') }}: {{ callvan.pickup_location }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.number') }}: {{ callvan.number_of_reservation }}</span>
        </div>
      </div>
    </div>

    <!-- Payment Button -->
    <div class="mt-4">
      <button 
        class="w-full bg-blue-500 text-cyan-50 py-3 px-2 rounded-lg text-sm font-normal hover:bg-blue-600 transition-colors"
        @click="handlePayment"
      >
        {{ formatPriceOriginal(callvan.total_price, locale) }} {{ $t('shoppingCart.payment') }}
      </button>
    </div>
  </div>
  <div v-else class="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto mb-4 text-center">
    {{ $t('shoppingCart.emptyCart') }}
  </div>
</template>

<script setup lang="ts">
import type { CallvanCartItem } from '~/server/api/shopping-cart/index'
import { formatDateLocale } from '~/utils/formatters'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceWithRate, formatPriceOriginal } = useExchangeRate()

// Props for making the component reusable
const props = defineProps({
  callvan: {
    type: Object as () => CallvanCartItem,
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
  emit('select', props.callvan.shopping_cart_callvan_idx)
}

const handleViewProduct = () => {
  if (props.callvan) {
    emit('viewProduct', props.callvan.course_idx)
  }
}

const handlePayment = () => {
  if (props.callvan) {
    emit('payment', props.callvan)
  }
}
</script>

<style scoped>
/* Custom styles if needed */
.shadow-lg {
  box-shadow: 0px 3px 15px 0px rgba(54, 53, 53, 0.15);
}
</style>