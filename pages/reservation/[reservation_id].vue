<template>
  <div>
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('reservation.title')" back-color="black" />
    <div>
      <div class="mt-16">
        <img :src="reservationType === 'V' ? callvanImg : reservation.image" alt="" class="w-full h-50 max-h-[400px] p-8 object-cover">
      </div>

      <div class="flex flex-col w-full gap-4 px-8">
        <!-- 골프장 정보 헤더 섹션 -->
        <div class="flex flex-col justify-center items-center w-full gap-4">
          <div class="flex flex-row justify-stretch items-stretch w-full gap-[-10px] py-2">
            <div class="flex flex-col gap-2 w-full">
              <!-- 골프장 이름 -->
              <div class="flex flex-col w-full gap-0.5">
                <h1 class="text-text-primary text-2xl w-full font-bold">{{ reservation.product_name }}</h1>
                <p class="text-text-secondary text-base w-full">{{ reservation.product_name_en }}</p>
              </div>
            </div>
          </div>

          <Divider :offset-px="63"/>

          <!-- 상품 핵심 정보 -->
          <div class="flex flex-col gap-4 w-full">
            <!-- 섹션 제목 -->
            <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5">
              <h2 class="text-text-primary text-base font-bold">{{$t('reservation.info.reservationInfo')}}</h2>
            </div>


            <!-- 정보 그리드 -->
            <div class="flex flex-col gap-6">
              <ReservationHotel v-if="reservationType === 'H'" :reservation="reservation" />
              <ReservationGolf v-else-if="reservationType === 'G'" :reservation="reservation" />
              <ReservationCaddy v-else-if="reservationType === 'C'" :reservation="reservation" />
              <ReservationTournament v-else-if="reservationType === 'T'" :reservation="reservation" />
            </div>
          </div>

          <Divider :offset-px="63"/>

          <!-- 예약자 정보 -->
          <div v-if="reservation.total_price > 0" class="flex flex-col gap-4 w-full">
            <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5">
              <h2 class="text-text-primary text-base font-bold">{{$t('reservation.info.reserver')}}</h2>
            </div>
            <div class="flex flex-col gap-6">
              <div class="flex flex-col gap-1">
                <span class="text-primary text-sm font-bold">{{$t('reservation.info.reserverName')}}</span>
                <span class="text-text-secondary text-sm">{{ reservation.reservation_name }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-primary text-sm font-bold">{{$t('reservation.info.reserverPhone')}}</span>
                <span class="text-text-secondary text-sm">{{ reservation.phone_number }}</span>
              </div>
            </div>
          </div>

          <Divider v-if="reservation.total_price > 0" :offset-px="63"/>

          <!-- 예약 상태 -->
          <div v-if="reservation.total_price > 0" class="flex flex-col gap-4 w-full">
            <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5">
              <h2 class="text-text-primary text-base font-bold">{{$t('reservation.info.reservationStatus')}}</h2>
            </div>
            <div class="flex flex-col gap-6">
              <div class="flex flex-col gap-1">
                <span class="text-primary text-sm font-bold">{{$t('reservation.info.reservationStatus')}}</span>
                <span class="text-text-secondary text-sm">{{ $t('reservation.reservationStatus.' + reservation.reservation_status) }}</span>
              </div>
            </div>
          </div>

          <Divider v-if="reservation.total_price > 0" :offset-px="63"/>

          <!-- 결제 정보 -->
          <div v-if="reservation.total_price > 0" class="flex flex-col gap-4 w-full">
            <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5">
              <h2 class="text-text-primary text-base font-bold">{{$t('reservation.info.payment')}}</h2>
            </div>
            <div v-if="reservationType === 'H'">
              <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-1">
                  <span class="text-primary text-sm font-bold">{{$t('reservation.info.pay.roomCountValue', { count: reservation.number_of_room })}}</span>
                  <span class="text-text-secondary text-sm">{{ formatNumber(reservation.total_price) }} {{ $t('common.currency') }}</span>
                </div>
              </div>
              <div v-for="item in option" :key="item.hotel_paid_service_idx" class="flex flex-col gap-6 mt-6">
                <div class="flex flex-col gap-1">
                  <span class="text-primary text-sm font-bold">{{ locale === 'ko' ? item.service_name : item.service_name_en }}</span>
                  <span class="text-text-secondary text-sm">{{ formatNumber(item.price) }} {{ $t('common.currency') }}</span>
                </div>
              </div>
            </div>
            <div v-if="reservationType === 'G'">
              <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-1">
                  <span class="text-primary text-sm font-bold">{{ $t('reservation.info.pay.golfCourseFee', { count: reservation.number_of_reservation }) }}</span>
                  <span class="text-text-secondary text-sm">{{ formatNumber(reservation.golf_course_sale_fee * reservation.number_of_reservation) }} {{ $t('common.currency') }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-primary text-sm font-bold">{{ $t('reservation.info.pay.cartFee', { count: reservation.number_of_reservation }) }}</span>
                  <span class="text-text-secondary text-sm">{{ formatNumber(reservation.cart_sale_fee * reservation.number_of_reservation) }} {{ $t('common.currency') }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-primary text-sm font-bold">{{ $t('reservation.info.pay.caddyFee', { count: reservation.number_of_reservation }) }}</span>
                  <span class="text-text-secondary text-sm">{{ formatNumber(reservation.caddy_sale_fee * reservation.number_of_reservation) }} {{ $t('common.currency') }}</span>
                </div>
                <div v-if="reservation.number_of_call_van > 0" class="flex flex-col gap-1">
                  <span class="text-primary text-sm font-bold">{{ $t('reservation.info.pay.callvanFee', { count: reservation.number_of_call_van }) }}</span>
                  <span class="text-text-secondary text-sm">{{ formatNumber(reservation.callvan_sale_fee * reservation.number_of_call_van) }} {{ $t('common.currency') }}</span>
                </div>
              </div>
            </div>
            <div v-if="reservationType === 'V'">
              <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-1">
                  <span class="text-primary text-sm font-bold">{{ $t('reservation.info.pay.callvanFee', { count: reservation.number_of_call_van }) }}</span>
                  <span class="text-text-secondary text-sm">{{ formatNumber(reservation.total_price) }} {{ $t('common.currency') }}</span>
                </div>
              </div>
            </div>
            <div v-if="reservationType === 'C'">
              <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-1">
                  <span class="text-primary text-sm font-bold">{{$t('reservation.info.pay.caddyFee')}}</span>
                  <span class="text-text-secondary text-sm">{{ formatNumber(reservation.total_price) }} {{ $t('common.currency') }}</span>
                </div>
              </div>
            </div>
            <div v-if="reservationType === 'T'">
              <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-1">
                  <span class="text-primary text-sm font-bold">{{$t('reservation.info.pay.tournamentFee')}}</span>
                  <span class="text-text-secondary text-sm">{{ formatNumber(reservation.total_price) }} {{ $t('common.currency') }}</span>
                </div>
              </div>
            </div>
          </div>

          <Divider v-if="reservation.total_price > 0" :offset-px="63"/>

          <!-- 결제 정보-->
          <div v-if="reservation.total_price > 0" class="flex flex-col gap-4 w-full mb-10">
            <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5">
              <h2 class="text-text-primary text-base font-bold">{{$t('reservation.info.payment')}}</h2>
            </div>
            <div class="flex flex-row justify-between items-center gap-6 w-full">
              <div class="flex flex-col gap-1">
                <span class="text-text-primary text-base font-bold">{{$t('reservation.info.paymentAmount')}}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-primary text-base">{{ formatNumber(reservation.total_price) }} {{ $t('common.currency') }}</span>
              </div>
            </div>
            <div class="flex flex-row justify-between items-center gap-6 w-full">
              <div class="flex flex-col gap-1">
                <span class="text-text-primary text-base font-bold">{{$t('reservation.info.paymentMethod')}}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-primary text-base">{{ reservation.pay_type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavigationBar from '~/components/common/NavigationBar.vue'
import { formatNumber } from '~/utils/formatters'
import { useI18n } from 'vue-i18n'
import callvanImg from '@/assets/images/shoppingcart_callvan.jpg'
import ReservationHotel from '~/components/reservation/ReservationHotel.vue'
import ReservationGolf from '~/components/reservation/ReservationGolf.vue'
import ReservationCaddy from '~/components/reservation/ReservationCaddy.vue'
import ReservationTournament from '~/components/reservation/ReservationTournament.vue'
import Divider from '~/components/common/Divider.vue'

const { locale } = useI18n()

const route = useRoute()
const reservationId = route.params.reservation_id

// state로 전달된 reservationType은 클라이언트에서만 접근 (SSR 에러 방지)
const reservationType = ref<string | undefined>(undefined)

definePageMeta({
  name: 'reservation_info'
})

const reservation = ref({})
const option = ref({})

const fetchReservation = async () => {
  const res = await $fetch(`/api/reservation/${reservationId}`, {
    method: 'POST',
    body: { reservationType: reservationType.value }
  })
  if (res.success) {
    reservation.value = res.data
    option.value = res.option
  } else {
    alert(res.error || '예약 정보를 불러오지 못했습니다.')
  }
}

onMounted(() => {
  reservationType.value = window.history.state?.reservationType
  fetchReservation()
})

// type-specific UI moved into components under `components/reservation/`
</script>

<style>

</style>