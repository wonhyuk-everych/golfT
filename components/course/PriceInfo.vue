<template>
  <div class="flex flex-col w-full gap-4 px-8">
    <!-- 골프장 정보 헤더 섹션 -->
    <div class="flex flex-col justify-center items-center w-full gap-4">
      <div class="flex flex-row justify-stretch items-stretch w-full gap-[-10px] py-2">
        <div class="flex flex-col gap-2 w-full">
          <!-- 골프장 이름 -->
          <div class="flex flex-col w-full gap-0.5">
            <h1 class="text-text-primary text-2xl w-full font-bold">{{ course.name_kr }}</h1>
            <p class="text-text-secondary text-base w-full">{{ course.name_en }}</p>
          </div>
          
          <!-- 평점 및 리뷰 -->
          <div class="flex flex-row items-center gap-1">
            <div class="flex flex-row items-center">
              <span class="text-primary text-sm">★</span>
              <span class="text-text-tertiary text-sm">{{ course.review_rating }}</span>
            </div>
            <div class="flex flex-row items-center">
              <span class="text-text-tertiary text-sm">(</span>
              <div class="flex flex-row items-center gap-0.5">
                <span class="text-text-tertiary text-sm">{{ course.review_count }}</span>
                <span class="text-text-tertiary text-sm">Reviews</span>
              </div>
              <span class="text-text-tertiary text-sm">)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 상품 가격-->
      <div class="flex flex-col gap-4 w-full font-bold text-primary text-2xl">최저가 {{ formatPriceWithRate(course.min_price, locale) }}</div>

      <!-- 상품 핵심 정보 -->
      <div class="flex flex-col gap-4 w-full pt-[40px]">
          <!-- 섹션 제목 -->
          <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5">
            <h2 class="text-text-primary text-base font-bold">⛳ 상품 핵심 정보</h2>
          </div>

          <!-- 정보 그리드 -->
          <div class="flex flex-col gap-6">
            <!-- 지역 정보 -->
            <div class="flex flex-col gap-1">
              <span class="text-primary text-sm font-bold">지역</span>
              <span class="text-text-secondary text-sm">{{course.country_code}} - {{course.city_code}}</span>
            </div>

            <!-- 전화번호 -->
            <div class="flex flex-col gap-1">
              <span class="text-primary text-sm font-bold">전화번호</span>
              <span class="text-text-secondary text-sm">{{ course.phone }}</span>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceWithRate } = useExchangeRate()

interface Course {
  name_kr: string
  name_en: string
  description: string
  region_code: string
  phone: string
  review_rating: number
  review_count: number
  bart_price: number
  min_price: number
}

interface Props {
  course: Course
}

defineProps<Props>()
</script>