<template>
  <div>
    <!-- 찜하기 버튼 -->
    <button 
      class="flex items-center justify-center p-2 rounded-full transition-all"
      :class="isWished ? 'text-red-500' : 'text-gray-400 hover:text-gray-500'"
      :disabled="isLoading"
      @click="toggleWish"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" :class="isWished ? 'fill-red-500' : 'fill-none stroke-current'">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke-width="1.5" />
      </svg>
    </button>
    
    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import ToastMessage from '~/components/common/ToastMessage.vue'

interface WishProps {
  // 제품 인덱스
  productIdx: number;
  // 제품 타입: 'C' (Caddy), 'H' (Hotel), 'G' (Golf Course)
  type: 'C' | 'H' | 'G';
  // 초기 찜 상태 (위시 인덱스)
  wishIdx?: number;
}

const props = defineProps<WishProps>()
const emit = defineEmits(['update:wishStatus'])

// Toast 관련 상태
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 찜하기 관련 상태
const isWished = ref(false)
const isLoading = ref(false)
const wishId = ref<number | null>(null)

// 찜 상태 변경 감지
watch(() => props.wishIdx, (newWishIdx) => {
  if (newWishIdx && newWishIdx > 0) {
    isWished.value = true
    wishId.value = newWishIdx
  } else {
    isWished.value = false
    wishId.value = null
  }
})

// 초기 찜 상태 확인
const checkWishStatus = () => {
  if (props.wishIdx && props.wishIdx > 0) {
    isWished.value = true
    wishId.value = props.wishIdx
  }
}

onMounted(() => {
  checkWishStatus()
})

// useUserSession 추가
const { loggedIn } = useUserSession();

// 찜하기/찜 해제 토글
const toggleWish = async () => {
  if (isLoading.value) return
  if (!loggedIn.value) {
    showToast.value = true;
    toastMessage.value = '로그인이 필요한 서비스입니다.';
    toastType.value = 'error';
    return
  }
  
  try {
    isLoading.value = true
    
    if (isWished.value && wishId.value) {
      // 찜 해제
      const response = await $fetch('/api/wish/remove', {
        method: 'POST',
        body: {
          wishIdx: wishId.value
        }
      })
      
      if (response.success) {
        isWished.value = false
        wishId.value = null
        showToast.value = true;
        toastMessage.value = '찜 목록에서 삭제되었습니다.';
        toastType.value = 'success';
        emit('update:wishStatus', { isWished: false, wishId: null })
      } else {
        showToast.value = true;
        toastMessage.value = response.error || '찜 해제 중 오류가 발생했습니다.';
        toastType.value = 'error';
      }
    } else {
      // 찜 추가
      const response = await $fetch('/api/wish/add', {
        method: 'POST',
        body: {
          type: props.type,
          productIdx: props.productIdx
        }
      })
      
      if (response.success) {
        isWished.value = true
        wishId.value = response.wishIdx
        showToast.value = true;
        toastMessage.value = '찜 목록에 추가되었습니다.';
        toastType.value = 'success';
        emit('update:wishStatus', { isWished: true, wishId: response.wishIdx })
      } else {
        showToast.value = true;
        toastMessage.value = response.error || '찜하기 중 오류가 발생했습니다.';
        toastType.value = 'error';
      }
    }
  } catch (error) {
    console.error('찜하기/해제 중 오류 발생:', error)
    showToast.value = true;
    toastMessage.value = '요청 처리 중 오류가 발생했습니다.';
    toastType.value = 'error';
  } finally {
    isLoading.value = false
  }
}
</script>
