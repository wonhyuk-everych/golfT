<script setup lang="ts">
interface BannerContent {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const BannerContent = withDefaults(defineProps<BannerContent>(), {
  title: '',
  subtitle: '',
  description: '',
  image: ''
})
</script>

<template>
  <div class="relative">
    <img :src="BannerContent.image" alt="메인 배너" class="w-full h-[400px] object-cover">
    <!-- 그라데이션 오버레이 -->
    <div class="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent from-[37%] to-black to-[77%]"></div>
    
    <!-- 배너 콘텐츠 -->
    <div class="absolute bottom-10 md:bottom-12 sm:bottom-8 left-6 md:left-5 sm:left-4 flex flex-col gap-1 text-white max-w-[600px] md:max-w-[90%]">
      <h2 class="text-2xl md:text-xl sm:text-lg font-normal leading-tight tracking-[-0.02em]">
        {{ BannerContent.title }}
      </h2>
      <h1 class="text-[28px] md:text-2xl sm:text-[22px] font-bold leading-tight tracking-[-0.02em] mb-1">
        {{ BannerContent.subtitle }}
      </h1>
      <p class="text-sm md:text-xs sm:text-[11px] font-normal leading-relaxed tracking-[-0.02em]">
        {{ BannerContent.description }}
      </p>
    </div>
  </div>
</template>
