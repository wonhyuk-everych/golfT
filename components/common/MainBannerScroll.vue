<template>
  <div class="relative px-0 h-[400px]">
    <swiper
      class="rounded-none overflow-hidden relative h-full"
      :modules="[SwiperPagination, SwiperAutoplay]"
      :slides-per-view="1"
      :space-between="0"
      :loop="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <swiper-slide
        v-for="(image, index) in images"
        :key="index"
        class="relative cursor-pointer"
        @click="onClickSlide(image, index)"
      >
        <img :src="image" :alt="`메인 배너 이미지 ${index + 1}`" class="w-full h-full object-cover">
      </swiper-slide>

      <!-- Slide counter overlay -->
      <div class="absolute bottom-4 right-5 z-10 bg-[rgba(26,26,26,0.4)] rounded-[30px] px-3 py-1 select-none">
        <div class="flex items-center gap-1">
          <span class="text-sm text-white font-pretendard tracking-[-0.02em]">{{ currentSlide + 1 }}</span>
          <span class="text-sm text-white font-pretendard tracking-[-0.02em]">/</span>
          <span class="text-sm text-white font-pretendard tracking-[-0.02em]">{{ images.length }}</span>
        </div>
      </div>
    </swiper>
  </div>
  
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination as SwiperPagination, Autoplay as SwiperAutoplay } from 'swiper/modules'
import 'swiper/css'
import type { Swiper as SwiperInstance } from 'swiper'

// Five static images for the main banner
const images = [
  '/images/banner/main_banner_1.png',
  '/images/banner/main_banner_2.png',
  '/images/banner/main_banner_3.png',
  '/images/banner/main_banner_4.png',
  '/images/banner/main_banner_5.png',
  '/images/banner/main_banner_t_2.png',
]

const location = [
  '',
  'https://roundt.triseup.com/',
  '',
  'https://clubgolft.co.kr/',
  'https://clubgolft.co.kr/surl/P/21',
  'https://golft.co.kr/tournament',
]

const currentSlide = ref(0)
const swiperInstance = ref<SwiperInstance | null>(null)

const onSwiper = (swiper: SwiperInstance) => {
  swiperInstance.value = swiper
  currentSlide.value = swiper.realIndex ?? 0
}

const onSlideChange = (swiper: SwiperInstance) => {
  currentSlide.value = swiper.realIndex
}

const onClickSlide = (image: string, index: number) => {
  // Only log to console as requested
  console.log('MainBanner slide clicked:', { image, index })
  if (location[index]) {
    window.open(location[index], '_blank')
  }
}

// No need for onMounted; using Swiper events above
</script>

<style scoped>
.swiper {
  height: 100%;
}

.swiper-slide {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>