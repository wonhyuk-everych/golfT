<!-- Admin Sidebar Component -->
<template>
  <aside class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-800 text-white">
    <nav class="p-4">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            class="flex items-center px-4 py-2 rounded hover:bg-gray-700"
            :class="{ 'bg-gray-700': isCurrentPath(item.path) }"
          >
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()

const menuItems = [
  { label: '골프장 관리', path: '/admin/courses' },
  { label: '호텔 관리', path: '/admin/hotel' },
  { label: '캐디 관리', path: '/admin/caddy' },
  { label: '예약 관리', path: '/admin/reservations' },
  { label: '회원 관리', path: '/admin/member' },
  { label: '커뮤니티 관리', path: '/admin/community' },
  { label: 'QnA 관리', path: '/admin/qna' },
  { label: '공지사항 관리', path: '/admin/notice' },
  { label: '추천 관리', path: '/admin/recommend' },
  { label: '리뷰 관리', path: '/admin/review' },
  { label: '대회 관리', path: '/admin/tournament' },
  { label: '이벤트 관리', path: '/admin/event' },
]

const isCurrentPath = (path: string) => route.path === path
</script>
