<template>
  <div class="relative">
    <!-- Fixed header and tab menu wrapper -->
    <NavigationBar 
      v-if="showHeader"
      :show-tabs="false"
      :tabs="tabs"
      :active-tab="activeTab"
      @update:active-tab="activeTab = $event"
      @left-action="toggleSideMenu"
    />

    <!-- Content wrapper with padding to account for fixed header -->
    <div class="max-w-[1024px] mx-auto bg-white">
      <slot />
    </div>

    <!-- Side Menu Component -->
    <SideMenu :is-open="isSideMenuOpen" @close="closeSideMenu" />
    
    <nav v-if="showNav" class="fixed max-w-[1024px] mx-auto bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-14 transition-transform duration-300 ease-in-out z-[999]" :class="{ 'translate-y-full': !isNavVisible }">
      <div class="w-full mx-auto h-full flex items-center justify-center px-4">
        <div class="w-full grid grid-cols-5 gap-0">
          <button class="flex items-center justify-center p-2 transition-colors" @click="toggleSideMenu">
            <img src="@/assets/icons/buttom-menu.svg" alt="Menu" class="w-6 h-6">
          </button>
          <NuxtLink to="/search" class="flex items-center justify-center p-2 transition-colors">
            <img src="@/assets/icons/search.svg" alt="Search" class="w-6 h-6">
          </NuxtLink>
          <NuxtLink to="/" class="flex items-center justify-center p-2 transition-colors">
            <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <img src="@/assets/icons/home.svg" alt="Home" class="w-6 h-6 brightness-0 invert">
            </div>
          </NuxtLink>
          <NuxtLink :to="loggedIn ? '/profile' : '/login'" class="flex items-center justify-center p-2 transition-colors">
            <img src="@/assets/icons/person.svg" alt="Profile" class="w-6 h-6">
          </NuxtLink>
          <NuxtLink to="/shopping_cart" class="flex items-center justify-center p-2 transition-colors">
            <img src="@/assets/icons/basket.svg" alt="Basket" class="w-6 h-6">
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from '#imports'
import { useLayout } from '~/composables/useLayout'
import NavigationBar from '~/components/common/NavigationBar.vue'
import SideMenu from '~/components/common/SideMenu.vue'
import { useLocalization } from '~/composables/useLocalization'

const { currentLocale } = useLocalization()

const { showHeader, showNav } = useLayout()

// Side menu state
const isSideMenuOpen = ref(false)

// Toggle side menu
const toggleSideMenu = () => {
  isSideMenuOpen.value = !isSideMenuOpen.value
}

// Close side menu
const closeSideMenu = () => {
  isSideMenuOpen.value = false
}

interface Tab {
  id: string
  name: string
}

// Bottom navigation scroll handling
const isNavVisible = ref(true)
const lastScrollPosition = ref(0)

const handleScroll = () => {
  const currentScrollPosition = window.scrollY
  isNavVisible.value = 
    // Show nav when scrolling up
    currentScrollPosition < lastScrollPosition.value ||
    // Always show nav when at the top
    currentScrollPosition < 50
  lastScrollPosition.value = currentScrollPosition
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

interface User {
  id: string
  member_id: number
  name_kr?: string
  name_en?: string
  email?: string
  role?: string
}

const { loggedIn, fetch: refreshSession } = useUserSession()
const showLoginForm = ref(false)
const loginForm = ref({
  id: '',
  password: ''
})
const loginError = ref('')
const loading = ref(false)
const User = ref<User | null>(null)

const tabs = ref<Tab[]>([
  { id: 'home', name: 'HOME' },
  { id: 'best30', name: 'BEST 30' },
  { id: 'event', name: 'EVENT' },
  { id: 'clubGolfT', name: '클럽 골프T' },
])

const activeTab = ref('home')
</script>

<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

:root {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
  background-color: #F0F3F7;
}
</style>