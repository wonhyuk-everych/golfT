<template>
  <div v-if="reservationHotel" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
    <!-- Main Content -->
    <div class="flex flex-col gap-4 py-2">
      <!-- Hotel Info -->
      <div class="flex items-center gap-4">
        <!-- Hotel Image -->
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
          <img 
            :src="reservationHotel.hotelImageUrl" 
            :alt="reservationHotel.hotelNameKr" 
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
        <!-- Hotel Names -->
        <div class="flex flex-col gap-0.5">
          <h3 class="text-base font-bold text-gray-900">{{ reservationHotel.hotelNameKr }}</h3>
          <p class="text-sm font-normal text-gray-500">{{ reservationHotel.hotelNameEn }}</p>
        </div>
      </div>

      <!-- Round Date & Time -->
      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.hotel.roundDate') }}</p>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.hotel.checkIn') }} : {{ formatDateLocale(reservationHotel.checkInDate, locale.value) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.hotel.checkOut') }} : {{ formatDateLocale(reservationHotel.checkOutDate, locale.value) }}</span>
        </div>
      </div>

      <!-- Reservation Info -->
      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.hotel.reservationInfo') }}</p>
        <div class="flex flex-col gap-1">
          <!-- Room -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ reservationHotel.roomName }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ reservationHotel.roomBedType }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.hotel.roomCount') }}</p>
        <div class="flex flex-col gap-1">
          <!-- Room -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.hotel.roomCount') }} {{ reservationHotel.roomCount }} {{ $t('shoppingCart.hotel.room') }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.hotel.personCount') }}</p>
        <div class="flex flex-col gap-1">
          <!-- Room -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.hotel.adultCount') }} {{ reservationHotel.adult }}
              <span v-if="reservationHotel.children > 0"> ,
                {{ $t('shoppingCart.hotel.childCount') }} {{ reservationHotel.children }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col border-t pt-6 pb-6">
        <div class="flex flex-row justify-between items-center mb-2">
          <span class="font-bold text-xl text-text-primary">{{ $t('payment.totalPaymentAmount') }}</span>
          <span class="font-bold text-xl text-primary">{{ formatPriceOriginal(reservationHotel.finalPaymentAmount, locale) }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceOriginal } = useExchangeRate()

interface ReservationHotel {
  hotelIdx: number;
  hotelNameKr: string;
  hotelNameEn: string;
  hotelImageUrl: string;
  checkInDate: string;
  checkOutDate: string;
  roomIdx: number;
  roomName: string;
  roomBedType: string;
  roomProductPrice: number;
  roomCount: number;
  adult: number;
  children: number;
  paidServices: string;
  finalPaymentAmount: number;
}

interface Props {
  reservationHotel?: ReservationHotel;
}

const props = defineProps<Props>()
</script>

<style scoped>
/* Custom styles if needed */
.shadow-lg {
  box-shadow: 0px 3px 15px 0px rgba(54, 53, 53, 0.15);
}
</style>