<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" @click.self="close">
    <div class="relative w-full max-w-4xl h-[80vh] overflow-hidden">
      <!-- Close button -->
      <button 
        class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white"
        @click="close"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <!-- Manual Image Slider with drag/swipe -->
      <div
        ref="containerRef"
        class="w-full h-full relative select-none"
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
          class="flex h-full transition-transform duration-300 ease-in-out"
          :class="{ 'duration-0': isDragging }"
          :style="{ transform: `translateX(${ -currentIndex * 100 + dragOffsetPercent }%)` }"
        >
          <div
            v-for="(img, idx) in images"
            :key="idx"
            class="w-full h-full flex-shrink-0 flex items-center justify-center"
          >
            <img
              :src="img || 'https://via.placeholder.com/1200x800'"
              :alt="`이미지 ${idx + 1}/${images.length}`"
              class="max-h-full max-w-full object-contain"
              @dragstart.prevent
              @error="handleImageError"
            >
          </div>
        </div>
        
        <!-- Navigation Buttons -->
        <button 
          v-if="currentIndex > 0" 
          class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 flex items-center justify-center z-10"
          @click="prevImage"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button 
          v-if="currentIndex < images.length - 1" 
          class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 flex items-center justify-center z-10"
          @click="nextImage"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <!-- Image Counter -->
        <div class="absolute bottom-4 left-0 right-0 text-center">
          <span class="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {{ currentIndex + 1 }} / {{ images.length }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface Props {
  isOpen: boolean;
  images: string[];
  currentIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentIndex: 0
});

const emit = defineEmits(['close']);

// Internal state for the current image index
const currentIndex = ref(props.currentIndex);

// Reset the current index when the popup opens or images change
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    currentIndex.value = props.currentIndex;
  }
});

watch(() => props.images, () => {
  if (currentIndex.value >= props.images.length) {
    currentIndex.value = 0;
  }
});

// Navigation methods
const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  }
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const close = () => {
  emit('close');
};

// Handle image loading errors
const handleImageError = (event: Event) => {
  console.error('Image failed to load:', (event.target as HTMLImageElement).src);
  // You could set a fallback image here if needed
  (event.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=이미지+로드+실패';
};

// Drag/Swipe support
const containerRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const containerWidth = ref(1);
const dragOffsetPercent = ref(0);
const dragThreshold = 0.15; // 15% of width

const updateContainerWidth = () => {
  containerWidth.value = containerRef.value?.clientWidth || 1;
};

onMounted(() => {
  updateContainerWidth();
  window.addEventListener('resize', updateContainerWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateContainerWidth);
});

const startDrag = (clientX: number) => {
  isDragging.value = true;
  startX.value = clientX;
  currentX.value = clientX;
};

const moveDrag = (clientX: number) => {
  if (!isDragging.value) return;
  currentX.value = clientX;
  const deltaX = currentX.value - startX.value;
  dragOffsetPercent.value = (deltaX / containerWidth.value) * 100;
};

const endDrag = () => {
  if (!isDragging.value) return;
  const deltaX = currentX.value - startX.value;
  const ratio = Math.abs(deltaX) / containerWidth.value;
  if (ratio > dragThreshold) {
    if (deltaX < 0) {
      nextImage();
    } else {
      prevImage();
    }
  }
  isDragging.value = false;
  dragOffsetPercent.value = 0;
};

// Pointer events
const onPointerDown = (e: PointerEvent) => {
  if (e.button !== 0) return; // primary button only
  // Ignore when clicking UI controls like buttons or links inside the container
  const target = e.target as HTMLElement | null;
  if (target && (target.closest('button') || target.closest('a'))) return;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  startDrag(e.clientX);
};
const onPointerMove = (e: PointerEvent) => moveDrag(e.clientX);
const onPointerUp = (_e: PointerEvent) => endDrag();

// Touch events
const onTouchStart = (e: TouchEvent) => startDrag(e.touches[0]?.clientX || 0);
const onTouchMove = (e: TouchEvent) => moveDrag(e.touches[0]?.clientX || 0);
const onTouchEnd = (_e: TouchEvent) => endDrag();
</script>
