<template>
  <div v-if="reservationGolf" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
    <!-- Main Content -->
    <div class="flex flex-col gap-4 py-2">
      <!-- Golf Course Info -->
      <div class="flex items-center gap-4">
        <!-- Course Image -->
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
          <img 
            :src="reservationGolf.imageUrl"
            :alt="reservationGolf.nameKr" 
            class="w-full h-full object-cover rounded-lg"
          >
        </div>
        <!-- Course Names -->
        <div class="flex flex-col gap-0.5">
          <h3 class="text-base font-bold text-gray-900">{{ reservationGolf.nameKr }}</h3>
          <p class="text-sm font-normal text-gray-500">{{ reservationGolf.nameEn }}</p>
        </div>
      </div>

      <!-- Round Date & Time -->
      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.golfCourse.roundDate') }}</p>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ formatDateLocale(reservationGolf.reservationDate, locale.value) }}</span>
          <span class="text-sm font-normal text-gray-900">/</span>
          <span class="text-sm font-normal text-gray-900">{{ reservationGolf.golfCourseTime }}</span>
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
            <span class="text-sm font-normal text-gray-900">{{ reservationGolf.numberOfReservation }} {{ $t('shoppingCart.golfCourse.person') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ formatPriceWithRate(reservationGolf.golfCourseSaleFee, locale) }}</span>
          </div>
          <!-- Cart Fee -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.golfCourse.cartFee') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ reservationGolf.numberOfReservation }} {{ $t('shoppingCart.golfCourse.car') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ formatPriceWithRate(reservationGolf.cartSaleFee, locale) }}</span>
          </div>
          <!-- Caddy Fee -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.golfCourse.caddyFee') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ reservationGolf.numberOfReservation }} {{ $t('shoppingCart.golfCourse.person') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ formatPriceWithRate(reservationGolf.caddySaleFee, locale) }}</span>
          </div>
          <!-- Van Fee -->
          <div v-if="reservationGolf.callVanSaleFee > 0 && reservationGolf.numberOfCallVan > 0" class="flex items-center gap-2">
            <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.golfCourse.vanFee') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ reservationGolf.numberOfCallVan }} {{ $t('shoppingCart.golfCourse.car') }}</span>
            <span class="text-sm font-normal text-gray-900">/</span>
            <span class="text-sm font-normal text-gray-900">{{ formatPriceWithRate(reservationGolf.callVanSaleFee, locale) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col border-t pt-6 pb-6">
      <div class="flex flex-row justify-between items-center mb-2">
        <span class="font-bold text-xl text-text-primary">{{ $t('payment.totalPaymentAmount') }}</span>
        <span class="font-bold text-xl text-primary">{{ formatPriceOriginal(reservationGolf.finalPaymentAmount, locale) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceWithRate, formatPriceOriginal } = useExchangeRate()

interface ReservationGolf {
  courseIdx: number;
  nameKr: string;
  nameEn: string;
  imageUrl: string;
  reservationDate: string;
  golfCourseTime: string;
  numberOfReservation: number;
  monthlyPriceIdx: number;
  timePriceIdx: number;
  priceType: string;
  golfCourseSaleFee: number;
  cartSaleFee: number;
  caddySaleFee: number;
  callVanSaleFee: number;
  numberOfCallVan: number;
  shoppingCartGolfIdx: number;
  finalPaymentAmount: number;
}

interface Props {
  reservationGolf?: ReservationGolf;
}

const props = defineProps<Props>()
</script>

<style scoped>
/* Custom styles if needed */
.shadow-lg {
  box-shadow: 0px 3px 15px 0px rgba(54, 53, 53, 0.15);
}
</style>