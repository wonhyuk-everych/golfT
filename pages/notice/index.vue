<template>
  <div class="notice-page">
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('notice.title')" back-color="black" />

    <div class="pt-16">
      <!-- 탭 메뉴 (공지 유형 선택) -->
      <nav class="bg-white w-full border-b flex">
        <div 
          v-for="type in noticeTypes"
          :key="type.type"
          class="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer flex-1"
          @click="activeType = type.type"
        >
          <span 
            class="text-base font-bold tracking-tighter" 
            :class="activeType === type.type ? 'text-primary' : 'text-text-primary'"
          >
            {{ type.name }}
          </span>
          <div 
            v-if="activeType === type.type" 
            class="w-full h-[2px] bg-primary"
          />
        </div>
      </nav>

      <!-- 공지사항 리스트 -->
      <div class="notice-list p-4">
        <!-- 로딩 상태 표시 -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        </div>
        
        <!-- 공지사항 목록 -->
        <div v-else class="space-y-4">
          <div v-if="notices.length === 0" class="text-center py-10 text-gray-500">
            {{ $t('notice.noNotices') }}
          </div>
          <div 
            v-for="notice in notices" 
            :key="notice.notice_idx" 
            class="notice-item bg-white border border-gray-200 rounded-lg p-4 cursor-pointer"
            @click="navigateToNoticeDetail(notice.notice_idx)"
          >
            <div class="flex justify-between">
              <span class="notice-type px-2 py-1 text-xs rounded-md" :class="getNoticeTypeClass(notice.notice_type)">
                {{ getNoticeTypeName(notice.notice_type) }}
              </span>
              <span class="text-sm text-gray-500">{{ formatDate(notice.created_at) }}</span>
            </div>
            <h3 class="text-lg font-bold mt-2 text-[#1A1A1A]">{{ notice.title }}</h3>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ notice.content }}</p>
          </div>
        </div>
        
        <!-- 더보기 버튼 -->
        <div v-if="hasMoreNotices && !isLoading" class="pt-4">
          <button 
            class="w-full py-3 border border-gray-300 rounded-md text-sm text-gray-700 font-medium"
            :disabled="isLoadingMore" 
            @click="loadMoreNotices"
          >
            <span v-if="isLoadingMore" class="flex items-center justify-center gap-2">
              <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary" />
              {{ $t('notice.loading') }}
            </span>
            <span v-else>{{ $t('notice.loadMore') }}</span>
          </button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import Footer from '~/components/common/Footer.vue'
import NavigationBar from '~/components/common/NavigationBar.vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

definePageMeta({
  name: 'notice-home'
})

const { locale, t } = useI18n()
const route = useRoute()

// 공지사항 유형 데이터
const noticeTypes = ref([
  { type: 'N', name: t('notice.normal') },
  { type: 'R', name: t('notice.reservation') },
  { type: 'T', name: t('notice.tournament') },
  { type: 'E', name: t('notice.event') }
])

// 활성화된 공지 유형
const activeType = ref("N")

// 공지사항 데이터 상태 관리
const notices = ref([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const currentPage = ref(1)
const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false
})

// 더 불러올 공지사항이 있는지 확인
const hasMoreNotices = computed(() => {
  return pagination.value.hasNextPage
})

// 날짜 포맷 함수 (YYYY-MM-DD)
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 공지 유형에 따른 스타일 클래스 반환
const getNoticeTypeClass = (type) => {
  switch (type) {
    case 'N': return 'bg-blue-100 text-blue-700'
    case 'R': return 'bg-green-100 text-green-700'
    case 'T': return 'bg-purple-100 text-purple-700'
    case 'E': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

// 공지 유형 이름 반환
const getNoticeTypeName = (type) => {
  const foundType = noticeTypes.value.find(t => t.type === type)
  return foundType ? foundType.name : t('notice.normal')
}

// 공지사항 목록 가져오기
const fetchNotices = async () => {
  try {
    isLoading.value = true
    
    // 쿼리 파라미터 구성
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('limit', '10')
    
    if (activeType.value) {
      params.append('notice_type', activeType.value)
    }
    
    const data = await $fetch(`/api/notice/search?${params.toString()}`)
    
    if (data && data.success) {
      // 공지 유형 데이터 업데이트 (첫 로드 시)
      if (data.data.noticeTypes && noticeTypes.value.length === 0) {
        noticeTypes.value = data.data.noticeTypes
      }
      
      // 게시글 목록 업데이트 (초기 로드 또는 필터 변경 시)
      if (currentPage.value === 1) {
        notices.value = data.data.notices
      } else {
        // 추가 로드 시 기존 게시글에 추가
        notices.value = [...notices.value, ...data.data.notices]
      }
      
      // 페이지네이션 정보 업데이트
      pagination.value = data.data.pagination
    }
  } catch (error) {
    console.error('공지사항 데이터 로드 중 오류 발생:', error)
  } finally {
    isLoading.value = false
  }
}

// 더 보기 버튼 클릭 시 다음 페이지 로드
const loadMoreNotices = async () => {
  if (!hasMoreNotices.value || isLoadingMore.value) return
  
  isLoadingMore.value = true
  currentPage.value += 1
  
  try {
    // 쿼리 파라미터 구성
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('limit', '10')
    
    if (activeType.value) {
      params.append('notice_type', activeType.value)
    }
    
    const data = await $fetch(`/api/notice/search?${params.toString()}`)
    
    if (data && data.success) {
      // 기존 게시글에 새로운 게시글 추가
      notices.value = [...notices.value, ...data.data.notices]
      
      // 페이지네이션 정보 업데이트
      pagination.value = data.data.pagination
    }
  } catch (error) {
    console.error('추가 공지사항 데이터 로드 중 오류 발생:', error)
  } finally {
    isLoadingMore.value = false
  }
}

// 공지사항 상세 페이지로 이동
const navigateToNoticeDetail = (noticeId) => {
  if (!noticeId) return
  navigateTo(`/notice/${noticeId}`)
}

// 탭(공지유형) 변경 감지
watch(activeType, () => {
  currentPage.value = 1
  notices.value = []
  fetchNotices()
})

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(() => {
  const param = ((route.query?.notice_type as string) || '').toUpperCase()
  const allowed = ['N','R','T','E']
  if (allowed.includes(param) && param !== activeType.value) {
    activeType.value = param
    return
  }
  fetchNotices()
})
</script>

<style scoped>
.notice-item {
  transition: all 0.2s ease;
}

.notice-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.notice-type {
  display: inline-block;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>