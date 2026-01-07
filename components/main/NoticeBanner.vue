<script setup lang="ts">
interface Notice {
  category: string;
  title: string;
}

const notice: Notice = {
  category: '공지사항',
  title: '어플 부정 사용자 제제 안내'
}
</script>

<template>
  <div class="px-4 py-2">
    <div class="w-full bg-[#00A6D1] rounded-[5px]">
      <div class="flex items-center justify-between px-8 py-4 gap-4">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-[#E0F7FD] tracking-[-0.02em]">[{{ notice.category }}]</span>
          <span class="text-base text-white tracking-[-0.02em]">{{ notice.title }}</span>
        </div>
        <img src="/images/banner/inform.png" alt="공지사항 아이콘" class="w-10 h-10">
      </div>
    </div>
  </div>
</template>
