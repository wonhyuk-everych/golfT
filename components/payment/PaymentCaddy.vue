<template>
  <div v-if="reservationCaddy" class="bg-white rounded-lg shadow-lg p-4 mx-auto mb-4">
    <!-- Main Content -->
    <div class="flex flex-col gap-4 py-2">
      <!-- Caddy Info -->
      <div class="flex items-center gap-4">
        <!-- Caddy Image -->
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
          <img 
            :src="reservationCaddy.imageUrl || '/placeholder-image.jpg'" 
            :alt="reservationCaddy.name" 
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
        <!-- Caddy Names -->
        <div class="flex flex-col gap-0.5">
          <h3 class="text-base font-bold text-gray-900">{{ reservationCaddy.name }} ({{ reservationCaddy.caddyCode }})</h3>
          <p class="text-sm font-normal text-gray-500">{{ reservationCaddy.nameKr }} / {{ reservationCaddy.nameEn }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col border-t pt-6 pb-6">
      <div class="flex flex-row justify-between items-center mb-2">
        <span class="font-bold text-xl text-text-primary">{{ $t('payment.totalPaymentAmount') }}</span>
        <span class="font-bold text-xl text-primary">{{ formatPrice(reservationCaddy.finalPaymentAmount) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface ReservationCaddy {
  caddyIdx: number;
  name: string;
  nameKr: string;
  nameEn: string;
  imageUrl: string;
  caddyCode: string;
  shoppingCartCaddyIdx: number;
  finalPaymentAmount: number;
}

interface Props {
  reservationCaddy?: ReservationCaddy;
}

const props = defineProps<Props>()
</script>

<style scoped>
/* Custom styles if needed */
.shadow-lg {
  box-shadow: 0px 3px 15px 0px rgba(54, 53, 53, 0.15);
}
</style>