<template>
  <div class="px-4 pb-8">
    <swiper
      :modules="[SwiperPagination, SwiperAutoplay]"
      :slides-per-view="1"
      :space-between="10"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      class="rounded-[10px] overflow-hidden relative"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <swiper-slide v-for="(image, index) in images" :key="index" class="relative">
        <img :src="image" :alt="`배너 이미지 ${index + 1}`" class="w-full h-[100px] object-cover">
      </swiper-slide>

      <!-- Custom Pagination -->
      <div class="absolute bottom-2 right-4 z-10 bg-[rgba(26,26,26,0.4)] rounded-[30px] px-2 py-0.5">
        <div class="flex items-center gap-1">
          <span class="text-xs text-white font-pretendard tracking-[-0.02em]">{{ currentSlide + 1 }}</span>
          <span class="text-xs text-white font-pretendard tracking-[-0.02em]">/</span>
          <span class="text-xs text-white font-pretendard tracking-[-0.02em]">{{ images.length }}</span>
        </div>
      </div>
    </swiper>
  </div>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination as SwiperPagination, Autoplay as SwiperAutoplay } from 'swiper/modules'
import { ref } from 'vue'
import 'swiper/css'
import type { Swiper as SwiperInstance } from 'swiper'

interface Props {
  images: string[]
}

defineProps<Props>();

const currentSlide = ref(0)
const swiperInstance = ref<SwiperInstance | null>(null)

const onSwiper = (swiper: SwiperInstance) => {
  swiperInstance.value = swiper
  currentSlide.value = swiper.realIndex ?? 0
}

// Update current slide index when slide changes
const onSlideChange = (swiper: SwiperInstance) => {
  currentSlide.value = swiper.realIndex
}
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 100px;
}
</style>