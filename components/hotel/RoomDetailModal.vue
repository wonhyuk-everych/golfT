<template>
  <transition name="slide-up">
    <div v-if="open" class="fixed inset-0 bg-white z-50 flex flex-col h-full w-full max-w-[1024px] mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <button class="text-gray-500 hover:text-gray-700" @click="$emit('close')">
          <img src="~/assets/icons/back-black.svg" alt="close" class="w-[16px] h-[16px]">
        </button>
        <h3 class="text-lg font-medium truncate">{{ room.room_name }}</h3>
        <div class="w-6 h-6" />
      </div>

      <!-- Content -->
      <div class="flex-grow overflow-y-auto">
        <!-- Images -->
        <div class="w-full">
          <ImageSlider :images="imagesForSlider" />
        </div>

        <!-- Room Basic Info -->
        <div class="px-4 py-4 flex flex-col gap-2 px-4">
          <div class="flex flex-col gap-0.5">
            <h2 class="text-xl font-bold text-text-primary">{{ room.room_name }}</h2>
            <p class="text-sm text-text-secondary">{{ room.room_name_en }}</p>
          </div>

          <!-- Price -->
          <div class="flex items-center gap-1.5 mt-2">
            <span class="text-2xl font-bold text-gray-900 leading-tight">{{ formatPriceWithRate(Number(room.room_sale_price), locale) }}</span>
          </div>
          <p class="text-base text-gray-500 leading-tight">총 {{ props.nights }}박 / 세금 및 봉사료 포함</p>

          <!-- Divider -->
          <div class="h-px bg-gray-200 my-3" />

          <!-- Attributes -->
          <div class="flex flex-col gap-3 px-4">
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 flex items-center justify-center">
                <img src="~/assets/icons/hotel_room_bed.svg" class="w-5 h-5 text-gray-500">
              </div>
              <span class="text-base text-gray-700 leading-tight">{{ room.bed_type }}</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 flex items-center justify-center">
                <img src="~/assets/icons/hotel_room_view.svg" class="w-5 h-5 text-gray-500">
              </div>
              <span class="text-base text-gray-700 leading-tight">{{ room.view_type }}</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 flex items-center justify-center">
                <img src="~/assets/icons/hotel_room_refund.svg" class="w-5 h-5 text-gray-500">
              </div>
              <span class="text-base text-gray-700 leading-tight">{{ room.breakfast_yn === 'Y' ? '조식 포함' : '조식 불포함' }}</span>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px bg-gray-200 my-3" />

          <!-- Room Facilities 
          <div class="flex flex-col gap-1 px-4">
            <span class="text-primary text-sm font-bold">{{ $t('hotelInfo.roomFacilities') }}</span>
            <div :class="{'grid grid-cols-2 gap-x-4': roomFacilities.length >= 10, 'flex flex-col': roomFacilities.length < 10}">
              <li v-for="facility in roomFacilities" :key="facility" class="text-text-secondary text-sm">{{ facility }}</li>
            </div>
          </div>
          -->
          <div class="flex flex-col gap-6 px-4">
            <TextList :title="$t('hotelInfo.roomFacilities')" :text="hotel.room_facility_info" />
          </div>

          <!-- Divider -->
          <div class="h-px bg-gray-200 my-3" />
           <!-- 정보 그리드 -->
          <div class="flex flex-col gap-6 px-4">
            <!-- 추가 요금 발생 사항 -->
            <TextList :title="$t('hotelInfo.extraCharge')" :text="hotel.extra_charge" />

            <!-- 주의 사항 -->
            <TextList :title="$t('hotelInfo.caution')" :text="hotel.caution" />

            <!-- 환불 규정 -->
            <TextList :title="$t('hotelInfo.refundInfo')" :text="hotel.refund_info" />

          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import ImageSlider from '~/components/common/ImageSlider.vue'
import { formatPrice, calculateBartPrice } from '~/utils/formatters'
import TextList from '~/components/hotel/TextList.vue'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceWithRate } = useExchangeRate()

interface RoomImage { image_url: string }
interface Room {
  hotel_room_idx: number;
  room_name: string;
  room_name_en: string;
  room_sale_price: number;
  room_images: Array<RoomImage>;
  bed_type: string;
  view_type: string;
  refund_yn: string;
  breakfast_yn: string;
}

interface HotelLike {
  bart_price?: number;
  room_facilities?: string[];
  room_facility?: string;
}

const props = withDefaults(defineProps<{ 
  open: boolean,
  room: Room,
  hotel?: HotelLike,
  nights?: number
}>(), { nights: 1, hotel: () => ({}) as HotelLike })

defineEmits<{ (e: 'close'): void }>()

const imagesForSlider = computed(() => {
  if (!props.room || !props.room.room_images) return []
  return props.room.room_images
    .filter((img: RoomImage) => Boolean(img?.image_url))
    .map((img: RoomImage, idx: number) => ({ url: img.image_url, label: `룸 이미지 ${idx + 1}` }))
})

// Room-specific facilities fetched from API
const roomFacilities = ref<string[]>([])
const extraOptions = ref<string[]>([])

interface RoomInfoResponse {
  success: boolean
  data?: { room_facilities: string[]; extra_options: string[] }
  error?: string
}

const fetchRoomFacilities = async () => {
  const roomIdx = props.room?.hotel_room_idx
  if (!roomIdx) {
    roomFacilities.value = []
    extraOptions.value = []
    return
  }
  try {
    const res = await $fetch<RoomInfoResponse>('/api/hotel/room_info', { params: { hotel_room_idx: roomIdx } })
    if (res && res.success && res.data) {
      roomFacilities.value = res.data.room_facilities || []
      extraOptions.value = res.data.extra_options || []
    } else {
      roomFacilities.value = []
      extraOptions.value = []
    }
  } catch (e) {
    console.error('Failed to fetch room facilities', e)
    roomFacilities.value = []
    extraOptions.value = []
  }
}

// Fetch when modal opens
watch(() => props.open, (open: boolean) => {
  if (open) fetchRoomFacilities()
}, { immediate: true })

// Refetch if room changes while open
watch(() => props.room?.hotel_room_idx, (newVal: number | undefined, oldVal: number | undefined) => {
  if (props.open && newVal !== oldVal) fetchRoomFacilities()
})
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
