<template>
  <div class="fixed top-0 left-0 right-0 z-50" :class="{ 'bg-white': mode !== 'back_white' }">
    <div class="max-w-[1024px] mx-auto">
      <header
  class="w-full px-4 py-4 flex justify-between items-center"
  :class="{ 'shadow': mode !== 'back_white' }"
  :style="mode === 'back_white' ? { background: navBgColor } : { background: '#fff' }"
>

        
        <!-- Back Button -->
        <template v-if="mode === 'back'">
          <button class="w-6 h-6 flex items-center justify-center" @click="handleLeftAction">
            <img src="~/assets/icons/back-black.svg" :alt="leftButtonAlt" class="w-[16px] h-[16px]">
          </button>

          <NuxtLink to="/" class="h-8 block">
            <img src="~/assets/icons/logo.svg" alt="T골프" class="h-full w-[68px]">
          </NuxtLink>

          <div class="w-6 h-6" />
        </template>

        <!-- Back Button -->
        <template v-else-if="mode === 'back_white'">
          <button class="w-6 h-6 flex items-center justify-center" @click="handleLeftAction">
            <img src="~/assets/icons/back-white.svg" :alt="leftButtonAlt" class="w-[16px] h-[16px]">
          </button>

          <NuxtLink to="/" class="h-8 block">
            <img src="~/assets/icons/logo-white.svg" alt="T골프" class="h-full w-[68px]">
          </NuxtLink>

          <!-- Right Buttons (Bell and Language Switcher) -->
          <div class="flex items-center gap-2">
            <button v-if="showBell" class="w-6 h-6">
              <!--<img src="~/assets/icons/bell-white.svg" alt="알림" class="w-full h-full">-->
            </button>
          </div>
        </template>

        <!-- Back Button -->
        <template v-else-if="mode === 'back_title'">
          <button class="w-6 h-6 flex items-center justify-center" @click="handleLeftAction">
            <template v-if="backColor === 'white'">
              <img src="~/assets/icons/back-white.svg" :alt="leftButtonAlt" class="w-[16px] h-[16px]">
            </template>
            <template v-else>
              <img src="~/assets/icons/back-black.svg" :alt="leftButtonAlt" class="w-[16px] h-[16px]">
            </template>
          </button>

          <div class="h-8">
            <h2 class="text-lg font-medium">{{ title }}</h2>
          </div>

          <!-- Right Buttons (Bell and Language Switcher) -->
          <div class="flex items-center gap-2">
            <button v-if="showBell" class="w-6 h-6">
              <!--<img src="~/assets/icons/bell-white.svg" alt="알림" class="w-full h-full">-->
            </button>
          </div>
        </template>

        <!-- Menu Button -->
        <template v-else>
          <button class="w-6 h-6 flex items-center justify-center" @click="handleLeftAction">
            <img src="~/assets/icons/menu-icon.svg" :alt="leftButtonAlt" class="w-full h-full">
          </button>

          <NuxtLink to="/" class="h-8 block">
            <img src="~/assets/icons/logo.svg" alt="T골프" class="h-full w-[68px]">
          </NuxtLink>

          <!-- Right Buttons (Bell and Language Switcher) -->
          <div class="flex items-center gap-2">
            <button v-if="showBell" class="w-6 h-6">
              <!--<img src="~/assets/icons/bell-icon.svg" alt="알림" class="w-full h-full">-->
            </button>
          </div>
        </template>

        
      </header>

      <!-- Tab Menu (Optional) -->
      <nav v-if="showTabs" class="bg-white w-full px-4 py-3 flex justify-between items-center border-b">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          class="flex flex-col items-center gap-1 cursor-pointer"
          @click="$emit('update:activeTab', tab.id)"
        >
          <span 
            class="text-xs tracking-tighter" 
            :class="activeTab === tab.id ? 'text-primary' : 'text-text-primary'"
          >
            {{ tab.name }}
          </span>
          <div 
            v-if="activeTab === tab.id" 
            class="w-full h-[1px] bg-primary"
          />
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

interface Tab {
  id: string,
  name: string
}

const props = defineProps({
  mode: {
    type: String,
    default: 'default', // 'default' | 'back' | 'back_title'
    required: false
  },
  showBell: {
    type: Boolean,
    default: true
  },
  showTabs: {
    type: Boolean,
    default: false
  },
  tabs: {
    type: Array as PropType<Tab[]>,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  activeTab: {
    type: String,
    default: ''
  },
  backColor: {
    type: String,
    default: 'white', // 'black' | 'white'
    required: false
  }
})

// 스크롤 위치 추적
const scrollY = ref(0);

onMounted(() => {
  const onScroll = () => {
    scrollY.value = window.scrollY;
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
  // 언마운트시 이벤트 해제
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
  });
});

// 스크롤에 따라 배경색 계산 (0~100px 구간에서 흰색→회색)
const navBgColor = computed(() => {
  if (props.mode !== 'back_white') return 'rgba(0,166,209,0)';
  const y = Math.min(scrollY.value, 100);
  const alpha = y / 100;
  return `rgba(0,166,209,${alpha})`;
});

const _emit = defineEmits(['update:activeTab', 'left-action'])

const leftButtonAlt = computed(() => {
  return props.mode === 'back' ? '뒤로가기' : 'Menu'
})

const handleLeftAction = () => {
  if (props.mode === 'back' || props.mode === 'back_white' || props.mode === 'back_title') {
    router.back()
  }else{
    _emit('left-action')
  }
}
</script>
