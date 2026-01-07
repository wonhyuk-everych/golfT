<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="w-full bg-[#00A6D1] px-4 pt-6 pb-[200px]">
      <!-- 유튜브 섹션 -->
      <div class="mt-4">
        <div class="flex justify-between items-center">
          <span class="text-base font-normal text-white">{{ title }}</span>
          <div class="flex items-center justify-center">
            <svg class="text-white" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- 안내 메시지 -->
      <div class="flex py-2">
        <p class="text-sm font-normal text-white">
          {{ subTitle }}
        </p>
      </div>
    </div>
    
    <div class="w-full bg-white px-4 pt-[20px] pb-6 -mt-[60px]">
      <!-- 영상 섹션 -->
      <div>
        <!-- 비디오 섬네일 및 플레이 버튼 -->
        <div class="w-full max-h-[225px] mt-[-140px]">
          <iframe 
            width="100%" 
            height="225" 
            :src="youtubeUrl" 
            :title="youtubeTitle" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen
          />
        </div>
        
        <!-- 비디오 제목 및 날짜 -->
        <div class="flex justify-between items-center px-4 mt-2">
          <span class="text-sm font-normal text-black">{{ youtubeMention }}</span>
          <span class="text-sm font-normal text-[#ACACAC]">{{ youtubeDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subTitle: string;
  youtubeUrl: string;
  youtubeTitle: string;
  youtubeMention: string;
  youtubeDate: string;
}>();
</script>
