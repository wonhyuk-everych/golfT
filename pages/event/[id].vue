<template>
  <div class="event-detail-page">
    <NavigationBar mode="back_title" :show-bell="false" :title="eventData.title" back-color="black" />

    <div class="pt-16">
      <!-- 로딩 상태 표시 -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>

      <!-- 오류 메시지 -->
      <div v-else-if="error" class="p-4 text-center text-red-500">
        {{ error }}
      </div>

      <!-- 이벤트 상세 컨텐츠 -->
      <div v-else class="event-content p-4">
        <!-- 이벤트 이미지 리스트 -->
        <div v-if="eventData.images && eventData.images.length > 0" class="space-y-4">
          <div v-for="(imageUrl, index) in eventData.images" :key="index" class="w-full overflow-hidden rounded-lg">
            <img :src="imageUrl" :alt="`이벤트 이미지 ${index + 1}`" class="w-full object-cover">
          </div>
        </div>
        
        <!-- 이미지가 없는 경우 -->
        <div v-else class="text-center py-10 text-gray-500">
          이미지가 없습니다.
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '~/components/common/NavigationBar.vue'
import Footer from '~/components/common/Footer.vue'

definePageMeta({
  name: 'event'
})

const route = useRoute()
const eventId = route.params.id

// 이벤트 데이터 상태 관리
const eventData = ref({
  event_idx: 0,
  title: '',
  images: []
})
const isLoading = ref(true)
const error = ref('')
const eventTitle = ref('이벤트 상세')

// 이벤트 상세 데이터 가져오기
const fetchEventDetail = async () => {
  try {
    isLoading.value = true
    const data = await $fetch(`/api/event/${eventId}`)
    
    if (data.error) {
      error.value = data.error
      return
    }
    
    eventData.value = data
    eventTitle.value = data.title || '이벤트 상세'
  } catch (e) {
    console.error('이벤트 상세 데이터를 가져오는 중 오류가 발생했습니다:', e)
    error.value = '이벤트 상세를 불러오는 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 이벤트 상세 데이터 가져오기
onMounted(() => {
  fetchEventDetail()
})

</script>

<style scoped>
.event-content img {
  max-width: 100%;
  height: auto;
}
</style>

<style>

</style>