<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <span class="text-primary text-sm font-bold">{{ t('reservation.info.reservationDate') }}</span>
      <span class="text-text-secondary text-sm">{{ t('reservation.info.checkIn') }} : {{ formatDateLocale(props.reservation.check_in_date, locale.value) }}</span>
      <span class="text-text-secondary text-sm">{{ t('reservation.info.checkOut') }} : {{ formatDateLocale(props.reservation.check_out_date, locale.value) }}</span>
    </div>

    <div class="flex flex-col gap-1">
      <span class="text-primary text-sm font-bold">{{ t('reservation.info.reservationInfo') }}</span>
      <span class="text-text-secondary text-sm">{{ props.reservation.room_name }}</span>
      <span class="text-text-secondary text-sm">{{ props.reservation.bed_type }}</span>
    </div>

    <div class="flex flex-col gap-1">
      <span class="text-primary text-sm font-bold">{{ t('reservation.info.roomCount') }}</span>
      <span class="text-text-secondary text-sm">{{ t('reservation.info.roomCountValue', { count: props.reservation.number_of_room }) }}</span>
    </div>

    <div class="flex flex-col gap-1">
      <span class="text-primary text-sm font-bold">{{ t('reservation.info.reservationCount') }}</span>
      <span class="text-text-secondary text-sm">{{ t('reservation.info.reservationCountValue', { count: props.reservation.adult }) }}
        <span v-if="props.reservation.children > 0"> / {{ t('reservation.info.childCountValue', { count: props.reservation.children }) }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatDateLocale } from '~/utils/formatters'

interface HotelReservationData {
  check_in_date?: string
  check_out_date?: string
  room_name?: string
  bed_type?: string
  number_of_room?: number
  adult?: number
  children?: number
}

const props = defineProps<{ reservation: HotelReservationData }>()
const { t, locale } = useI18n()
</script>
