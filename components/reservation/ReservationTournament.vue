<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <span class="text-primary text-sm font-bold">{{ t('shoppingCart.tournament.formTitle') }}</span>
      <div v-for="(field, index) in parsedFormData" :key="index" class="flex items-center gap-2">
        <span class="text-sm font-normal text-gray-900">{{ field.title }}: {{ field.value || '-' }}</span>
      </div>
    </div>

    <div v-if="props.reservation.images" class="flex flex-col gap-0.5">
      <p class="text-primary text-sm font-bold">{{ props.reservation.image_title }}</p>
      <div class="flex flex-row flex-wrap gap-2 mt-1">
        <img
          v-for="(image, index) in parsedImages"
          :key="index"
          :src="image"
          :alt="props.reservation.image_title"
          class="w-[90px] h-[90px] object-cover rounded-lg cursor-pointer"
          @click="openImagePopup"
        >
      </div>
      <ImagePopup :images="parsedImages" :is-open="isImagePopupOpen" @close="closeImagePopup" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ImagePopup from '~/components/common/ImagePopup.vue'

interface TournamentFormField {
  type: string
  title: string
  value: string
}

interface TournamentReservationData {
  form_data?: { result?: TournamentFormField[] }
  images?: string
  image_title?: string
  total_price?: number
}

const props = defineProps<{ reservation: TournamentReservationData }>()
const { t } = useI18n()

const isImagePopupOpen = ref(false)

const openImagePopup = () => {
  isImagePopupOpen.value = true
}

const closeImagePopup = () => {
  isImagePopupOpen.value = false
}

const parsedFormData = computed(() => {
  try {
    const formData = props.reservation?.form_data?.result as TournamentFormField[] | undefined
    if (formData && Array.isArray(formData)) {
      return formData
        .filter((field: TournamentFormField) => field.type === 'text' || field.type === 'select')
        .map((field: TournamentFormField) => ({
          title: field.title,
          value: field.value
        }))
    }
    return []
  } catch (e) {
    console.error('Error parsing form data:', e)
    return []
  }
})

const parsedImages = computed(() => {
  try {
    const images = props.reservation?.images
    return images ? String(images).split(',') : []
  } catch (e) {
    console.error('Error parsing images:', e)
    return []
  }
})
</script>
