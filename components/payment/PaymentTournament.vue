<template>
  <div v-if="reservationTournament" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
    <!-- Main Content -->
    <div class="flex flex-col gap-4 py-2">
      <!-- Tournament Info -->
      <div class="flex items-center gap-4">
        <!-- Tournament Image -->
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
          <img 
            :src="reservationTournament.imageUrl || '/placeholder-image.jpg'" 
            :alt="reservationTournament.title" 
            class="w-full h-full object-cover rounded-lg"
          >
        </div>
        <!-- Tournament Title -->
        <div class="flex flex-col gap-0.5">
          <h3 class="text-base font-bold text-gray-900">{{ reservationTournament.title }}</h3>
        </div>
      </div>

      <!-- Tournament Form Data -->
      <div v-if="reservationTournament.formData" class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.tournament.formTitle') }}</p>
        <div v-for="(field, index) in parseFormData(reservationTournament.formData)" :key="index" class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ field.title }}: {{ field.value || '-' }}</span>
        </div>
      </div>

      <div v-if="reservationTournament.images" class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ reservationTournament.imageTitle }}</p>
        <div class="flex flex-row flex-wrap gap-2 mt-1">
          <img 
            v-for="(image, index) in parseImages(reservationTournament.images)" 
            :key="index"
            :src="image" 
            :alt="reservationTournament.imageTitle" 
            class="w-[90px] h-[90px] object-cover rounded-lg cursor-pointer"
            @click="openImagePopup"
          >
        </div>
        <ImagePopup 
          :images="parseImages(reservationTournament.images)" 
          :is-open="isImagePopupOpen" 
          @close="closeImagePopup" 
        />
      </div>
    </div>

    <div class="flex flex-col border-t pt-6 pb-6">
      <div class="flex flex-row justify-between items-center mb-2">
        <span class="font-bold text-xl text-text-primary">{{ $t('payment.totalPaymentAmount') }}</span>
        <span class="font-bold text-xl text-primary">{{ formatPriceOriginal(reservationTournament.finalPaymentAmount, locale) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImagePopup from '~/components/common/ImagePopup.vue'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceOriginal } = useExchangeRate()

interface FormDataItem {
  title: string;
  type: string;
  value: string;
}

interface FormData {
  result: FormDataItem[];
}

interface ReservationTournament {
  tournamentIdx: number;
  title: string;
  imageUrl: string;
  formData: string;
  images: string;
  imageTitle: string;
  shoppingCartTournamentIdx: number;
  finalPaymentAmount: number;
}

interface Props {
  reservationTournament?: ReservationTournament;
  bartExchangeRate?: number;
}

const props = defineProps<Props>()

// Parse form data JSON string to array
const formDataArray = ref([])

watchEffect(() => {
  if (!props.reservationTournament?.formData) {
    formDataArray.value = []
    return
  }
  
  try {
    const parsedData = JSON.parse(props.reservationTournament.formData) as FormData
    formDataArray.value = parsedData.result || []
  } catch (error) {
    console.error('Error parsing tournament form data:', error)
    formDataArray.value = []
  }
})

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

const parseImages = (imagesString) => {
  try {

    if(Array.isArray(imagesString)) {
      return imagesString.map((image) => image)
    }

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
