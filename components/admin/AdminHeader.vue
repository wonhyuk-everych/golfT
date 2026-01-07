<!-- Admin Header Component -->
<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
    <div class="flex items-center justify-between h-full px-4">
      <div class="flex items-center">
        <h1
          class="text-xl font-bold text-gray-800 cursor-pointer"
          @click="handleNavigateAdmin"
        >
          골프 관리자
        </h1>
      </div>
      <div class="flex items-center space-x-4">
        <span class="text-gray-600">관리자님 환영합니다</span>
        <button @click="handleLogout" class="text-gray-600 hover:text-gray-800">
          로그아웃
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, clear: clearSession } = useUserSession()

const handleLogout = async () => {
  await clearSession()
  await navigateTo('/')
}

const handleNavigateAdmin = () => navigateTo('/admin')
</script>
