<template>
  <div class="flex flex-col w-full gap-4 px-8">
    <!-- 호텔 정보 헤더 섹션 -->
    <div class="flex flex-col justify-center items-center w-full gap-4">
      <div class="flex flex-row justify-stretch items-stretch w-full gap-[-10px] py-2">
        <div class="flex flex-col gap-2 w-full">
          <!-- 호텔 이름 -->
          <div class="flex flex-col w-full gap-0.5">
            <h1 class="text-text-primary text-2xl w-full font-bold">{{ hotel.name_kr }}</h1>
            <p class="text-text-secondary text-base w-full">{{ hotel.name_en }}</p>
          </div>
          
          <!-- 평점 및 리뷰 -->
          <div class="flex flex-row items-center gap-1">
            <div class="flex flex-row items-center">
              <span class="text-primary text-sm">★</span>
              <span class="text-text-tertiary text-sm">{{ hotel.rating }}</span>
            </div>
            <div class="flex flex-row items-center">
              <span class="text-text-tertiary text-sm">(</span>
              <div class="flex flex-row items-center gap-0.5">
                <span class="text-text-tertiary text-sm">{{ hotel.review_count }}</span>
                <span class="text-text-tertiary text-sm">Reviews</span>
              </div>
              <span class="text-text-tertiary text-sm">)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 상품 가격-->
      <div class="flex flex-col gap-4 w-full font-bold text-primary text-2xl">최저가 {{ formatPriceWithRate(hotel.price, locale) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceWithRate } = useExchangeRate()

interface Hotel {
  name_kr: string
  name_en: string
  rating: number
  review_count: number
  price: number
  bart_price: number
}

interface Props {
  hotel: Hotel
}

defineProps<Props>()
</script>