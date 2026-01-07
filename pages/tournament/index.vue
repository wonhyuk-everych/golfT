<template>
  <div class="tournament-page">

    <NavigationBar mode="back_title" :show-bell="false" :title="$t('tournament.title')" back-color="black" />

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
            {{ $t('tournament.ongoing') }}
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
            {{ $t('tournament.ended') }}
          </span>
          <div 
            v-if="activeTab === 'ended'" 
            class="w-full h-[2px] bg-primary"
          />
        </div>
      </nav>

      <!-- 이벤트 리스트 -->
      <div class="tournament-list p-4">
        <!-- 로딩 상태 표시 -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
        
        <!-- 진행중 이벤트 -->
        <div v-else-if="activeTab === 'ongoing'" class="space-y-4">
          <div 
            class="tournament-item cursor-pointer"
            @click="navigateTo({ path: '/notice', query: { notice_type: 'T' } })"
          >
            <div class="tournament-image-container w-full h-[110px] overflow-hidden rounded-lg flex items-center justify-center bg-white border border-primary">
              <span class="text-primary font-bold text-base">대회 공지사항</span>
            </div>
          </div>
          <div v-if="ongoingTournaments.length === 0" class="text-center py-10 text-gray-500">
            {{ $t('tournament.noOngoingTournaments') }}
          </div>
          <div 
            v-for="(tournament, index) in ongoingTournaments" 
            :key="tournament.tournament_idx || index" 
            class="tournament-item cursor-pointer"
            @click="navigateToTournamentDetail(tournament.tournament_idx)"
          >
            <div class="tournament-image-container w-full h-[110px] overflow-hidden rounded-lg">
              <img :src="tournament.imageUrl" alt="토너먼트 이미지" class="w-full h-full object-cover">
            </div>
          </div>
        </div>

        <!-- 진행 종료 이벤트 -->
        <div v-else-if="activeTab === 'ended'" class="space-y-4">
          <div v-if="endedTournaments.length === 0" class="text-center py-10 text-gray-500">
            {{ $t('tournament.noEndedTournaments') }}
          </div>
          <div 
            v-for="(tournament, index) in endedTournaments" 
            :key="tournament.tournament_idx || index" 
            class="tournament-item cursor-pointer"
            @click="navigateToTournamentDetail(tournament.tournament_idx)"
          >
            <div class="tournament-image-container w-full h-[110px] overflow-hidden rounded-lg relative">
              <img :src="tournament.imageUrl" alt="토너먼트 이미지" class="w-full h-full object-cover opacity-70">
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <span class="text-white font-bold text-lg">{{ $t('tournament.endedTournament') }}</span>
              </div>
            </div>
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
import { useI18n } from 'vue-i18n'

definePageMeta({
  name: 'tournament-home'
})

// 활성화된 탭 상태 관리
const activeTab = ref('ongoing')

const { t } = useI18n()

// 이벤트 데이터 상태 관리
const ongoingTournaments = ref([])
const endedTournaments = ref([])
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
    const data = await $fetch('/api/tournament/search')
    
    if (data) {
      // API 응답 데이터 매핑
      ongoingTournaments.value = data.ongoingTournaments.map(tournament => ({
        tournament_idx: tournament.tournament_idx,
        title: tournament.title,
        period: `${formatDate(tournament.start_date)} ~ ${formatDate(tournament.end_date)}`,
        imageUrl: tournament.image_url
      }))
      
      endedTournaments.value = data.endedTournaments.map(tournament => ({
        tournament_idx: tournament.tournament_idx,
        title: tournament.title,
        period: `${formatDate(tournament.start_date)} ~ ${formatDate(tournament.end_date)}`,
        imageUrl: tournament.image_url
      }))
      
      // 오류 메시지가 있는 경우 콘솔에 출력
      if (data.error) {
        console.error(data.error)
      }
    }
  } catch (error) {
    console.error(t('tournament.errorFetchingEvents'), error)
  } finally {
    isLoading.value = false
  }
}

// 이벤트 상세 페이지로 이동
const navigateToTournamentDetail = (tournamentId) => {
  if (!tournamentId) return
  navigateTo(`/tournament/${tournamentId}`)
}

// 컴포넌트 마운트 시 이벤트 데이터 가져오기
onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
tournament-item {
  margin-bottom: 16px;
}

.tournament-image-container {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>