<template>
  <div v-if="reservationCallvan" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
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
          <h3 class="text-base font-bold text-gray-900">{{ reservationCallvan.roundTripYn === 'Y' ? $t('shoppingCart.callvan.roundTrip') : $t('shoppingCart.callvan.oneWay') }}</h3>
        </div>
      </div>

      <!-- Round Date & Time -->
      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.callvan.depature') }}1</p>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.depatureDate') }}: {{ formatDateLocale(reservationCallvan.startDate, locale.value) }}</span>
          <!--
          <span class="text-sm font-normal text-gray-900">/</span>
          <span class="text-sm font-normal text-gray-900">{{ reservationCallvan.startTime }}</span>
          -->
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.depatureLocation') }}: {{ reservationCallvan.pickupLocation }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.arrivalLocation') }}: {{ reservationCallvan.dropoffLocation }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.number') }}: {{ reservationCallvan.numberOfReservation }}</span>
        </div>
      </div>

      <!-- Callvan Info -->
      <div v-if="reservationCallvan.roundTripYn === 'Y'" class="flex flex-col gap-0.5">
        <p class="text-xs font-normal text-gray-500">{{ $t('shoppingCart.callvan.depature') }}2</p>
        <!--
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.depatureDate') }}: {{ formatDateLocale(reservationCallvan.endDate, locale.value) }}</span>
          <span class="text-sm font-normal text-gray-900">/</span>
          <span class="text-sm font-normal text-gray-900">{{ reservationCallvan.endTime }}</span>
        </div>
        -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.depatureLocation') }}: {{ reservationCallvan.dropoffLocation }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.arrivalLocation') }}: {{ reservationCallvan.pickupLocation }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-normal text-gray-900">{{ $t('shoppingCart.callvan.number') }}: {{ reservationCallvan.numberOfReservation }}</span>
        </div>
      </div>
    </div>

    <!-- Payment Button -->
    <div class="flex flex-col border-t pt-6 pb-6">
      <div class="flex flex-row justify-between items-center mb-2">
        <span class="font-bold text-xl text-text-primary">{{ $t('payment.totalPaymentAmount') }}</span>
        <span class="font-bold text-xl text-primary">{{ formatPrice(reservationCallvan.finalPaymentAmount) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface ReservationCallvan {
  callvanIdx: number;
  roundTripYn: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  numberOfReservation: number;
  shoppingCartCallvanIdx: number;
  finalPaymentAmount: number;
}

interface Props {
  reservationCallvan?: ReservationCallvan;
}

const props = defineProps<Props>()
</script>

<style scoped>
/* Custom styles if needed */
.shadow-lg {
  box-shadow: 0px 3px 15px 0px rgba(54, 53, 53, 0.15);
}
</style>