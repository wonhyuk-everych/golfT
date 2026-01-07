<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <span class="text-primary text-sm font-bold">{{ t('reservation.info.golfCourse') }}</span>
      <span class="text-text-secondary text-sm">{{ props.reservation.name_kr }} / {{ props.reservation.name_en }}</span>
    </div>

    <div class="flex flex-col gap-1">
      <span class="text-primary text-sm font-bold">{{ t('reservation.info.reservationDate') }}</span>
      <span class="text-text-secondary text-sm">{{ t('reservation.info.reservationDateValue', { date: formatDateLocale(props.reservation.reservation_date, locale.value) }) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatDateLocale } from '~/utils/formatters'

interface CaddyReservationData {
  name_kr?: string
  name_en?: string
  reservation_date?: string
}

const props = defineProps<{ reservation: CaddyReservationData }>()
const { t, locale } = useI18n()
</script>
