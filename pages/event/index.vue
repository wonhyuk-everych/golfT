<template>
  <div class="event-page">

    <NavigationBar mode="back_title" :show-bell="false" :title="$t('event.title')" back-color="black" />

    <div class="pt-16">
      <!-- 탭 메뉴 -->
      <nav class="bg-white w-full border-b flex">
        <div 
          class="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer w-1/2"
          @click="activeTab = 'ongoing'"
        >
          <span 
            class="text-base font-bold tracking-tighter" 
            :class="activeTab === 'ongoing' ? 'text-primary' : 'text-text-primary'"
          >
            {{ $t('event.ongoing') }}
          </span>
          <div 
            v-if="activeTab === 'ongoing'" 
            class="w-full h-[2px] bg-primary"
          />
        </div>
        <div 
          class="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer w-1/2"
          @click="activeTab = 'ended'"
        >
          <span 
            class="text-base font-bold tracking-tighter" 
            :class="activeTab === 'ended' ? 'text-primary' : 'text-text-primary'"
          >
            {{ $t('event.ended') }}
          </span>
          <div 
            v-if="activeTab === 'ended'" 
            class="w-full h-[2px] bg-primary"
          />
        </div>
      </nav>

      <!-- 이벤트 리스트 -->
      <div class="event-list p-4">
        <!-- 로딩 상태 표시 -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
        
        <!-- 진행중 이벤트 -->
        <div v-else-if="activeTab === 'ongoing'" class="space-y-4">
          <div v-if="ongoingEvents.length === 0" class="text-center py-10 text-gray-500">
            {{ $t('event.noOngoingEvents') }}
          </div>
          <div 
            v-for="(event, index) in ongoingEvents" 
            :key="event.event_idx || index" 
            class="event-item cursor-pointer"
            @click="navigateToEventDetail(event.event_idx)"
          >
            <div class="event-image-container w-full h-[110px] overflow-hidden rounded-lg">
              <img :src="event.imageUrl" alt="이벤트 이미지" class="w-full h-full object-cover">
            </div>
            <!-- 상세보기 컬럼(버튼/링크 등) 제거됨 -->
          </div>
        </div>

        <!-- 진행 종료 이벤트 -->
        <div v-else-if="activeTab === 'ended'" class="space-y-4">
          <div v-if="endedEvents.length === 0" class="text-center py-10 text-gray-500">
            {{ $t('event.noEndedEvents') }}
          </div>
          <div 
            v-for="(event, index) in endedEvents" 
            :key="event.event_idx || index" 
            class="event-item cursor-pointer"
            @click="navigateToEventDetail(event.event_idx)"
          >
            <div class="event-image-container w-full h-[110px] overflow-hidden rounded-lg relative">
              <img :src="event.imageUrl" alt="이벤트 이미지" class="w-full h-full object-cover opacity-70">
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <span class="text-white font-bold text-lg">{{ $t('event.endedEvent') }}</span>
              </div>
            </div>
            <!-- 상세보기 컬럼(버튼/링크 등) 제거됨 -->
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import NavigationBar from '~/components/common/NavigationBar.vue'
import Footer from '~/components/common/Footer.vue'

definePageMeta({
  name: 'event-home'
})

// 활성화된 탭 상태 관리
const activeTab = ref('ongoing')

// 이벤트 데이터 상태 관리
const ongoingEvents = ref([])
const endedEvents = ref([])
const isLoading = ref(true)

// 날짜 포맷 함수 (YYYY-MM-DD -> YYYY.MM.DD)
const formatDate = (dateString) => {
  if (!dateString) return ''
  return dateString.replace(/-/g, '.')
}

// 이벤트 데이터 가져오기
const fetchEvents = async () => {
  try {
    isLoading.value = true
    const data = await $fetch('/api/event/search')
    
    if (data) {
      // API 응답 데이터 매핑
      ongoingEvents.value = data.ongoingEvents.map(event => ({
        event_idx: event.event_idx,
        title: event.title,
        period: `${formatDate(event.start_date)} ~ ${formatDate(event.end_date)}`,
        imageUrl: event.image_url
      }))
      
      endedEvents.value = data.endedEvents.map(event => ({
        event_idx: event.event_idx,
        title: event.title,
        period: `${formatDate(event.start_date)} ~ ${formatDate(event.end_date)}`,
        imageUrl: event.image_url
      }))
      
      // 오류 메시지가 있는 경우 콘솔에 출력
      if (data.error) {
        console.error(data.error)
      }
    }
  } catch (error) {
    console.error($t('event.errorFetchingEvents'), error)
  } finally {
    isLoading.value = false
  }
}

// 이벤트 상세 페이지로 이동
const navigateToEventDetail = (eventId) => {
  if (!eventId) return
  navigateTo(`/event/${eventId}`)
}

// 컴포넌트 마운트 시 이벤트 데이터 가져오기
onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.event-item {
  margin-bottom: 16px;
}

.event-image-container {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>