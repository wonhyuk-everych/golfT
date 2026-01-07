<template>
  <div class="notice-detail-page pb-20">
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('notice.title')" back-color="black" />

    <div class="pt-16">
      <!-- 로딩 상태 표시 -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>

      <!-- 오류 메시지 -->
      <div v-else-if="error" class="p-4 text-center text-red-500">
        {{ error }}
      </div>
      
      <!-- 공지사항 상세 컨텐츠 -->
      <div v-else class="notice-content">
        <!-- 공지사항 헤더 정보 -->
        <div class="px-4 py-5 border-b">
          <span class="notice-type px-2 py-1 text-xs rounded-md mb-2 inline-block" :class="getNoticeTypeClass(noticeData.notice_type)">
            {{ getNoticeTypeName(noticeData.notice_type) }}
          </span>
          <h1 class="text-xl font-bold text-[#1A1A1A] mb-2">{{ noticeData.title }}</h1>
          <div class="flex items-center text-[#ACB2BA] text-sm">
            <span>{{ formatDate(noticeData.created_at) }}</span>
          </div>
        </div>
        
        <!-- 공지사항 내용 -->
        <div class="px-5 py-5 border-b">
          <div class="text-[#1A1A1A] text-base whitespace-pre-wrap">{{ noticeData.content }}</div>
        </div>
        
        <!-- 공지사항 이미지 -->
        <div v-if="images.length > 0" class="border-b">
          <div v-for="(image, index) in images" :key="index" class="w-full">
            <img :src="image.image_url" :alt="`공지사항 이미지 ${index + 1}`" class="w-full">
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Footer from '~/components/common/Footer.vue'
import NavigationBar from '~/components/common/NavigationBar.vue'
import { useI18n } from 'vue-i18n'

definePageMeta({
  name: 'notice-detail'
})

const { t } = useI18n()

// We don't need to use i18n here as translations are passed directly
const route = useRoute()
const noticeId = route.params.id

// 공지사항 유형 데이터
const noticeTypes = ref([
  { type: 'N', name: t('notice.normal') },
  { type: 'R', name: t('notice.reservation') },
  { type: 'T', name: t('notice.tournament') },
  { type: 'E', name: t('notice.event') }
])

// 공지사항 데이터 상태 관리
const noticeData = ref({
  notice_idx: 0,
  notice_type: 'N',
  title: '',
  content: '',
  created_at: ''
})
const images = ref([])
const isLoading = ref(true)
const error = ref('')

// 날짜 포맷 함수 (ISO -> YYYY-MM-DD)
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

// 공지사항 상세 데이터 가져오기
const fetchNoticeDetail = async () => {
  try {
    isLoading.value = true
    const data = await $fetch(`/api/notice/${noticeId}`)
    
    if (!data.success) {
      error.value = data.error || '공지사항을 불러오는데 실패했습니다.'
      return
    }
    
    noticeData.value = data.data.notice
    images.value = data.data.images
  } catch (e) {
    console.error(e)
    error.value = '공지사항을 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(() => {
  fetchNoticeDetail()
})
</script>

<style scoped>
.notice-content img {
  max-width: 100%;
  height: auto;
}
</style>
