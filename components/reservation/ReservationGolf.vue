<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <span class="text-primary text-sm font-bold">{{ t('reservation.info.reservationDate') }}</span>
      <span class="text-text-secondary text-sm">{{ t('reservation.info.reservationDateValue', { date: formatDateLocale(props.reservation.reservation_date, locale.value) }) }}</span>
      <span class="text-text-secondary text-sm">{{ t('reservation.info.reservationTimeValue', { time: props.reservation.reservation_time?.substring(0, 5) }) }}</span>
    </div>

    <div class="flex flex-col gap-1">
      <span class="text-primary text-sm font-bold">{{ t('reservation.info.reservationCount') }}</span>
      <span class="text-text-secondary text-sm">{{ t('reservation.info.reservationCountValue', { count: props.reservation.number_of_reservation }) }}</span>
    </div>

    <div v-if="props.reservation.number_of_call_van > 0" class="flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">{{ t('reservation.info.pickupLocation') }}</span>
        <span class="text-text-secondary text-sm">{{ props.reservation.pickup_location }}</span>
      </div>

      <div v-if="props.reservation.round_trip_yn === 'Y'" class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">{{ t('reservation.info.dropoffLocation') }}</span>
        <span class="text-text-secondary text-sm">{{ props.reservation.dropoff_location }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">{{ t('reservation.info.vehicleCount') }}</span>
        <span class="text-text-secondary text-sm">{{ props.reservation.car_type }} - {{ t('reservation.info.vehicleCountValue', { count: props.reservation.number_of_call_van }) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatDateLocale } from '~/utils/formatters'

interface GolfReservationData {
  reservation_date?: string
  reservation_time?: string
  number_of_reservation?: number
  number_of_call_van?: number
  pickup_location?: string
  round_trip_yn?: 'Y' | 'N'
  dropoff_location?: string
  car_type?: string
}

const props = defineProps<{ reservation: GolfReservationData }>()
const { t, locale } = useI18n()
</script>
