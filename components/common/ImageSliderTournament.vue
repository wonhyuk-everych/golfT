<!-- 토너먼트 전용. 여백 없이 object-cover로 꽉 참. 모바일: 높이 축소(h-[260px]), PC: h-[400px]. -->
<template>
  <div class="relative h-[260px] md:h-[400px]">
    <div
      ref="containerRef"
      class="relative w-full h-full overflow-hidden select-none"
      style="touch-action: pan-y;"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @pointerleave="onPointerUp"
      @touchstart.passive="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend.passive="onTouchEnd"
    >
      <div
        v-if="images?.length > 0"
        class="flex transition-transform duration-300 ease-in-out h-full"
        :class="{ 'duration-0': isDragging }"
        :style="{ transform: `translateX(${ -currentSlide * 100 + dragOffsetPercent }%)` }"
      >
        <div v-for="(image, index) in images" :key="index" class="w-full h-full flex-shrink-0 relative">
          <img 
            :src="image.url || defaultImage"
            :alt="image.label"
            class="w-full h-full object-cover"
            @dragstart.prevent
            @error="handleImageError"
          >
          <div class="absolute bottom-8 left-0 right-0 text-center">
            <!--
            <span class="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {{ image.label }}
            </span>
            -->
          </div>
        </div>
      </div>
      <div v-else class="w-full h-full">
        <img 
          :src="defaultImage"
          alt="기본 이미지"
          class="w-full h-full object-cover"
        >
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
      <!-- Navigation Buttons -->
      <template v-if="images?.length > 1">
        <button 
          v-if="currentSlide > 0" 
          class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 flex items-center justify-center z-10"
          @click="prevSlide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button 
          v-if="currentSlide < images.length - 1" 
          class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 flex items-center justify-center z-10"
          @click="nextSlide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <!-- Slide Thumbnails (limit to 5+ globally, show +N remaining) -->
        <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
          <button
            v-for="(thumb, index) in displayThumbs"
            :key="`thumb-${index}`"
            class="w-12 h-12 rounded-md overflow-hidden ring-2 transition-all duration-200 focus:outline-none"
            :class="currentSlide === index ? 'ring-white' : 'ring-white/40 opacity-80 hover:opacity-100'"
            @click="goToSlide(index)"
          >
            <img
              :src="thumb.url || defaultImage"
              :alt="thumb.label"
              class="w-full h-full object-cover pointer-events-none"
              @error="handleImageError"
            >
          </button>
          <!-- "+N" remaining tile -->
          <button
            v-if="showRemainingTile"
            :aria-label="`Show more (${remainingCount})`"
            class="w-12 h-12 rounded-md overflow-hidden ring-2 transition-all duration-200 focus:outline-none ring-white/40 relative"
            @click="goToSlide(nextHiddenIndex)"
          >
            <img
              :src="remainingPreview.url || defaultImage"
              alt="more"
              class="w-full h-full object-cover"
              @error="handleImageError"
            >
            <div class="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-semibold">
              +{{ remainingCount }}
            </div>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import imageNotFound from '~/assets/images/Image_not_found.png'

const defaultImage = imageNotFound

interface Image {
  url: string
  label: string
}

interface Props {
  images: Image[]
}

const props = defineProps<Props>()

// Slider state
const currentSlide = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(1)
const dragOffsetPercent = ref(0)
const dragThreshold = 0.15 // 15% of width to trigger slide change

// Slider methods
const nextSlide = () => {
  if (currentSlide.value < props.images.length - 1) {
    currentSlide.value++
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = defaultImage
  target.onerror = null
}

// Drag/Swipe handlers
const updateContainerWidth = () => {
  containerWidth.value = containerRef.value?.clientWidth || 1
}

onMounted(() => {
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateContainerWidth)
})

const startDrag = (clientX: number) => {
  isDragging.value = true
  startX.value = clientX
  currentX.value = clientX
}

const moveDrag = (clientX: number) => {
  if (!isDragging.value) return
  currentX.value = clientX
  const deltaX = currentX.value - startX.value
  dragOffsetPercent.value = (deltaX / containerWidth.value) * 100
}

const endDrag = () => {
  if (!isDragging.value) return
  const deltaX = currentX.value - startX.value
  const ratio = Math.abs(deltaX) / containerWidth.value

  if (ratio > dragThreshold) {
    if (deltaX < 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }

  isDragging.value = false
  dragOffsetPercent.value = 0
}

const onPointerDown = (e: PointerEvent) => {
  if (e.button !== 0) return
  const target = e.target as HTMLElement | null
  if (target && (target.closest('button') || target.closest('a'))) return
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  startDrag(e.clientX)
}
const onPointerMove = (e: PointerEvent) => moveDrag(e.clientX)
const onPointerUp = (_e: PointerEvent) => endDrag()

const onTouchStart = (e: TouchEvent) => startDrag(e.touches[0]?.clientX || 0)
const onTouchMove = (e: TouchEvent) => moveDrag(e.touches[0]?.clientX || 0)
const onTouchEnd = (_e: TouchEvent) => endDrag()

const MAX_THUMBS = 5

const displayThumbs = computed(() => {
  if (!Array.isArray(props.images)) return []
  if (props.images.length > MAX_THUMBS) {
    return props.images.slice(0, MAX_THUMBS - 1)
  }
  return props.images
})

const remainingCount = computed(() => {
  const shown = displayThumbs.value.length
  return Math.max(0, (props.images?.length || 0) - shown)
})

const showRemainingTile = computed(() => remainingCount.value > 0)
const nextHiddenIndex = computed(() => displayThumbs.value.length)
const remainingPreview = computed(() => {
  const idx = nextHiddenIndex.value
  return props.images?.[idx] || { url: defaultImage, label: 'more' }
})
</script>
