<template>
  <div v-if="tournament" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
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
          />
          <!-- Tournament Label -->
          <span class="text-base font-bold text-gray-900">{{ $t('shoppingCart.tournament.title') }}</span>
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
      <div class="border-t border-gray-100" />
    </div>

    <!-- Main Content -->
    <div class="flex flex-col gap-4 py-2">
      <!-- Tournament Info -->
      <div class="flex items-center gap-4">
        <!-- Tournament Image -->
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
          <img 
            :src="tournament.image_url || '/placeholder-image.jpg'" 
            :alt="tournament.title" 
            class="w-full h-full object-cover rounded-lg"
          >
        </div>
        <!-- Tournament Title -->
        <div class="flex flex-col gap-0.5">
          <h3 class="text-base font-bold text-gray-900">{{ tournament.title }}</h3>
        </div>
      </div>

      <div v-if="tournament.form_data" class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.tournament.formTitle') }}</p>
        <div v-for="(field, index) in parseFormData(tournament.form_data)" :key="index" class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ field.title }}: {{ field.value || '-' }}</span>
        </div>
      </div>

      <div v-if="tournament.images" class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ tournament.image_title }}</p>
        <div class="flex flex-row flex-wrap gap-2 mt-1">
          <img 
            v-for="(image, index) in parseImages(tournament.images)" 
            :key="index"
            :src="image" 
            :alt="tournament.image_title" 
            class="w-[90px] h-[90px] object-cover rounded-lg cursor-pointer"
            @click="openImagePopup"
          >
        </div>
        <ImagePopup 
          :images="parseImages(tournament.images)" 
          :is-open="isImagePopupOpen" 
          @close="closeImagePopup" 
        />
      </div>
    </div>

    <!-- Payment Button -->
    <div class="mt-4">
      <button 
        class="w-full bg-blue-500 text-cyan-50 py-3 px-2 rounded-lg text-sm font-normal hover:bg-blue-600 transition-colors"
        @click="handlePayment"
      >
        {{ formatPriceOriginal(tournament.price, locale) }} {{ $t('shoppingCart.payment') }}
      </button>
    </div>
  </div>
  <div v-else class="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto mb-4 text-center">
    {{ $t('shoppingCart.emptyCart') }}
  </div>
</template>

<script setup lang="ts">
import { useExchangeRate } from '~/composables/useExchangeRate'
import ImagePopup from '~/components/common/ImagePopup.vue'

// Define the interface locally since it's not exported from the API file
interface TournamentCartItem {
  shopping_cart_tournament_idx: number;
  tournament_idx: number;
  title: string;
  image_url: string | null;
  price: number;
  form_data: string;
  image_title: string;
  images: string[];
}

const { locale } = useI18n()
const { formatPriceWithRate, formatPriceOriginal } = useExchangeRate()

// Props for making the component reusable
const props = defineProps({
  tournament: {
    type: Object as () => TournamentCartItem,
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
  emit('select', props.tournament.shopping_cart_tournament_idx)
}

const handleViewProduct = () => {
  if (props.tournament) {
    emit('viewProduct', props.tournament.tournament_idx)
  }
}

const handlePayment = () => {
  if (props.tournament) {
    emit('payment', props.tournament)
  }
}

const parseFormData = (formDataString) => {
  try {
    const formData = formDataString.result
    
    // Check if the data has the expected structure
    if (formData && Array.isArray(formData)) {
      // Filter only text and select fields and extract title and value
      return formData
        .filter((field: { type: string }) => field.type === 'text' || field.type === 'select')
        .map((field: { title: string; value: string }) => ({
          title: field.title,
          value: field.value
        }))
    }
    return []
  } catch (error) {
    console.error('Error parsing form data:', error)
    return []
  }
}

const parseImages = (imagesString: string) => {
  try {
    const images = imagesString;
    
    // 쉼표로 구분하여 배열로 리턴
    return images.split(',')
  } catch (error) {
    console.error('Error parsing images:', error)
    return []
  }
}

const isImagePopupOpen = ref(false)

// Open image popup with the selected room
const openImagePopup = () => {
  isImagePopupOpen.value = true
}

// Close image popup
const closeImagePopup = () => {
  isImagePopupOpen.value = false
}

</script>

<style scoped>
/* Custom styles if needed */
.shadow-lg {
  box-shadow: 0px 3px 15px 0px rgba(54, 53, 53, 0.15);
}
</style>
