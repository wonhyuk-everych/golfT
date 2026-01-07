<template>
  <div>
    <div class="p-4 bg-gray-50">
      <h3 class="font-medium mb-4">객실 정보</h3>
      <div v-if="hotel.rooms && hotel.rooms.length > 0" class="space-y-4">
        <div v-for="(room, index) in hotel.rooms" :key="index" class="w-full bg-white rounded-lg p-4 flex flex-col gap-3 shadow-sm">
          <!-- Main Content -->
          <div class="flex flex-col gap-6 cursor-pointer" @click="openDetail(room)">
            <!-- Room Info Section -->
            <div class="flex flex-col gap-4">
              <!-- Image and Title Section -->
              <div class="flex items-center gap-4 p-1">
                <!-- Room Image -->
                <div 
                  class="w-[90px] h-[90px] relative rounded-md overflow-hidden cursor-pointer" 
                  @click.stop="openImagePopup(room)"
                >
                  <img 
                    :src="room.room_images[0]?.image_url || defaultImage" 
                    :alt="room.room_name"
                    class="w-full h-full object-cover"
                  >
                  <!-- Image Count Badge -->
                  <div class="absolute bottom-2 right-2 bg-black bg-opacity-40 rounded px-1.5 py-1 flex items-center gap-0.5">
                    <svg class="w-3.5 h-3.5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs text-gray-200">{{ room.room_images.length }}</span>
                  </div>
                </div>

                <!-- Room Details -->
                <div class="flex-1 flex flex-col gap-1.5">
                  <!-- Room Title and Subtitle -->
                  <div class="flex flex-col justify-center gap-1">
                    <h3 class="text-xl font-bold text-gray-900 leading-tight">{{ room.room_name }}</h3>
                    <p class="text-xs text-gray-500 leading-tight">{{ room.room_name_en }}</p>
                  </div>

                  <!-- Badges -->
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0 h-8 flex items-center justify-center border border-gray-300 rounded text-base text-gray-500 leading-tight">
                      성인 2명
                    </span>
                    <span v-if="room.breakfast_yn === 'Y'" class="px-2 py-0 h-8 flex items-center justify-center border border-teal-600 rounded text-base text-teal-600 leading-tight">
                      조식 포함
                    </span>
                    <span v-if="room.breakfast_yn === 'N'" class="px-2 py-0 h-8 flex items-center justify-center border border-red-600 rounded text-base text-red-600 leading-tight">
                      조식 불포함
                    </span>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div class="h-px bg-gray-300" />

              <!-- Room Features -->
              <div class="flex flex-col gap-1 px-1">
                <div class="flex items-center gap-4">
                  <div class="w-5 h-5 flex items-center justify-center">
                    <img src="~/assets/icons/hotel_room_refund.svg" class="w-5 h-5 text-gray-500">
                  </div>
                  <span class="text-base text-gray-500 leading-tight">{{ room.refund_yn === 'Y' ? '환불가능' : '환불불가' }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-5 h-5 flex items-center justify-center">
                    <img src="~/assets/icons/hotel_room_view.svg" class="w-5 h-5 text-gray-500">
                  </div>
                  <span class="text-base text-gray-500 leading-tight">{{ room.view_type }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-5 h-5 flex items-center justify-center">
                    <img src="~/assets/icons/hotel_room_bed.svg" class="w-5 h-5 text-gray-500">
                  </div>
                  <span class="text-base text-gray-500 leading-tight">{{ room.bed_type }}</span>
                </div>
              </div>

              <!-- Divider -->
              <div class="h-px bg-gray-300" />

              <!-- Price Section -->
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-1.5">
                  <span class="text-2xl font-bold text-gray-900 leading-tight">{{ formatPriceWithRate(Number(room.room_sale_price), locale) }}</span>
                  <!--<div v-if="hotel.bart_price" class="flex items-center gap-1">
                    <span class="text-xl font-bold text-gray-500">(</span>
                    <span class="text-xl font-bold text-gray-500">{{ calculateBartPrice(room.room_sale_price, hotel.bart_price) }}바트</span>
                    <span class="text-xl font-bold text-gray-500">)</span>
                  </div>-->
                </div>
                <p class="text-base text-gray-500 leading-tight">총 {{ nights }}박 / 세금 및 봉사료 포함</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-6">
              <!--
              <button class="flex-shrink-0 w-20 h-12 flex items-center justify-center border border-gray-300 rounded-md" @click="selectRoomToCart(room)">
                <span class="text-sm text-gray-500">장바구니</span>
              </button>
              -->
              <button 
                class="flex-1 h-12 flex items-center justify-center bg-cyan-500 rounded-md"
                @click.stop="selectRoom(room)"
              >
                <span class="text-sm text-cyan-50">예약하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        현재 예약 가능한 객실이 없습니다.
      </div>
    </div>
  </div>

  <!-- Image Popup -->
  <ImagePopup 
    v-if="selectedRoom" 
    :is-open="isImagePopupOpen" 
    :images="roomImages" 
    @close="closeImagePopup" 
  />

  <!-- Room Detail Modal -->
  <RoomDetailModal
    v-if="selectedRoom"
    :open="isDetailOpen"
    :room="selectedRoom"
    :hotel="hotel"
    :nights="nights"
    @close="closeDetail"
  />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import ImagePopup from '~/components/common/ImagePopup.vue'
import RoomDetailModal from '~/components/hotel/RoomDetailModal.vue'
import { formatPrice, calculateBartPrice } from '~/utils/formatters'
import imageNotFound from '~/assets/images/Image_not_found.png'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { formatPriceWithRate } = useExchangeRate()
const { locale } = useI18n()

const defaultImage = imageNotFound

interface Room {
  hotel_room_idx: number;
  room_name: string;
  room_name_en: string;
  room_sale_price: number;
  room_images: Array<{ image_url: string }>;
  bed_type: string;
  view_type: string;
  refund_yn: string;
  breakfast_yn: string;
  adult: number;
  children: number;
}

interface Props {
  hotel: {
    rooms: Array<Room>;
    bart_price?: number;
  }
}

withDefaults(defineProps<Props & { nights?: number }>(), { nights: 1 })

// Define emits
const emit = defineEmits(['select-room', 'select-room-to-cart'])

// Image popup state
const isImagePopupOpen = ref(false)
const selectedRoom = ref<Room | null>(null)

// Detail modal state
const isDetailOpen = ref(false)

// Computed property to get all images for the selected room
const roomImages = computed(() => {
  if (!selectedRoom.value) return []
  return selectedRoom.value.room_images.map(image => image.image_url)
})

// Open image popup with the selected room
const openImagePopup = (room: Room) => {
  selectedRoom.value = room
  isImagePopupOpen.value = true
}

// Close image popup
const closeImagePopup = () => {
  isImagePopupOpen.value = false
}

// Open detail modal
const openDetail = (room: Room) => {
  selectedRoom.value = room
  isDetailOpen.value = true
}

// Close detail modal
const closeDetail = () => {
  isDetailOpen.value = false
}

// Function to select a room and emit the event
const selectRoom = (room: Room) => {
  emit('select-room', room)
}

// Note: selectRoomToCart handler removed to avoid unused function lint.
</script>