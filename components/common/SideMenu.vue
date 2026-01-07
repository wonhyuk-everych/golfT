<template>
  <Teleport to="body">
    <!-- Overlay background -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300 items-center justify-center"
      :class="isOpen ? 'opacity-100' : 'opacity-0'"
      @click="close"
    />
    
    <!-- Side menu container -->
    <div 
      class="fixed inset-0 bg-white z-[9999] transition-transform duration-300 transform max-w-[1024px] mx-auto"
      :class="isOpen ? 'translate-y-0' : 'translate-y-full'"
    >
      <!-- Top bar with close button -->
      <div class="flex justify-between items-center py-2 px-4">
        <button class="w-6 h-6" @click="close">
          <img src="~/assets/icons/back-black.svg" :alt="leftButtonAlt" class="w-[16px] h-[16px]">
        </button>
        
        <div class="h-8">
          <img src="~/assets/icons/logo.svg" alt="logo" class="h-full w-[68px]">
        </div>

        <div class="w-6 h-6" />
      </div>
      
      <!-- Menu content -->
      <div>
        <!-- 탭 2개 -->
        <nav v-if="showTabs" class="bg-white w-full border-b flex">
          <div 
            key="main"
            class="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer w-1/2"
            @click="updateActiveTab('main')"
          >
            <span 
              class="text-base font-bold tracking-tighter" 
              :class="activeTab === 'main' ? 'text-primary' : 'text-text-primary'"
            >
              {{ $t('sideMenu.golfT.menu') }}
            </span>
            <div 
              v-if="activeTab === 'main'" 
              class="w-full h-[2px] bg-primary"
            />
          </div>
          <div 
            key="user"
            class="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer w-1/2"
            @click="updateActiveTab('user')"
          >
            <span 
              class="text-base font-bold tracking-tighter" 
              :class="activeTab === 'user' ? 'text-primary' : 'text-text-primary'"
            >
              {{ $t('sideMenu.customerService.menu') }}
            </span>
            <div 
              v-if="activeTab === 'user'" 
              class="w-full h-[2px] bg-primary"
            />
          </div>
        </nav>
        

        <!-- 탭 2개에 따른 내용 -->
        <div>
          <div v-if="activeTab === 'main'">
            <button class="block w-full text-left font-bold p-4" @click="navigate('/course/home')">
              <div>
                {{ $t('sideMenu.golfT.golfReservation') }}
              </div>
            </button>
            <button class="block w-full text-left font-bold p-4" @click="navigate('/hotel/home')">
              <div>
                {{ $t('sideMenu.golfT.hotelReservation') }}
              </div>
            </button>
            <button class="block w-full text-left font-bold p-4" @click="navigate('/caddy/home')">
              <div>
                {{ $t('sideMenu.golfT.caddyReservation') }}
              </div>
            </button>
            <button class="block w-full text-left font-bold p-4" @click="navigate('/event')">
              <div>
                {{ $t('sideMenu.golfT.event') }}
              </div>
            </button>
            <button class="block w-full text-left font-bold p-4" @click="navigate('/tournament')">
              <div>
                {{ $t('sideMenu.golfT.tournament') }}
              </div>
            </button>
          </div>
          <div v-else-if="activeTab === 'user'">
            <button class="block w-full text-left font-bold p-4" @click="navigate('/profile')">
              <div>
                {{ $t('sideMenu.customerService.customerService') }}
              </div>
            </button>
            <button class="block w-full text-left font-bold p-4" @click="navigate('/community')">
              <div>
                {{ $t('sideMenu.customerService.community') }}
              </div>
            </button>
            <button class="block w-full text-left font-bold p-4" @click="navigate('/notice')">
              <div>
                {{ $t('sideMenu.customerService.notice') }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { navigateTo } from '#app'

defineProps<{
  isOpen: boolean
  menuHeight?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:activeTab', tabId: string): void
}>()


const activeTab = ref('main')
const showTabs = ref(true)

const close = () => {
  emit('close')
}

const updateActiveTab = (tabId: string) => {
  activeTab.value = tabId
  emit('update:activeTab', tabId)
}

// Navigate to a route and close the menu
const navigate = async (path: string) => {
  close() // Close the menu first
  await navigateTo(path) // Then navigate to the path
}
</script>

<style scoped>
/* Add any additional styles here */
</style>