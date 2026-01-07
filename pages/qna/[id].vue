<template>
  <div class="notice-detail-page pb-20">
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('qna.title')" back-color="black" />
    <div class="pt-16">
      <!-- 로딩 상태 표시 -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>

      <!-- 오류 메시지 -->
      <div v-else-if="error" class="p-4 text-center text-red-500">
        {{ error }}
      </div>

      <!-- qna 상세 컨텐츠 (비밀번호 맞을 때만) -->
      <div v-else class="notice-content">
        <!-- qna 헤더 정보 -->
        <div class="px-4 py-5 border-b">
          <span class="notice-type px-2 py-1 text-xs rounded-md mb-2 inline-block">
            {{ qnaData.answer_status === 'W' ? $t('qna.answerPending') : $t('qna.answerCompleted') }}
          </span>
          <h1 class="text-xl font-bold text-[#1A1A1A] mb-2"> [{{ locale === 'ko' ? qnaData.qna_type_name_kr : qnaData.qna_type_name_en }}] {{ qnaData.title }}</h1>
          <div class="flex items-center text-[#ACB2BA] text-sm">
            <span>{{ formatDate(qnaData.created_at) }} {{ qnaData.member_name_kr }}</span>
          </div>
        </div>
        <!-- qna 내용 -->
        <div class="px-5 py-5">
          <div class="text-[#1A1A1A] text-base whitespace-pre-wrap">{{ qnaData.content }}</div>
        </div>
        <!-- qna 이미지 -->
        <div v-if="images.length > 0">
          <div v-for="(image, index) in images" :key="index" class="w-full px-4 py-5">
            <img :src="image.image_url" :alt="`qna image ${index + 1}`" class="w-full">
          </div>
        </div>
      </div>

      <!-- 답변 영역 -->
      <div v-if="!showPasswordPrompt && qnaData.answer" class="bg-[#F6F8FC] rounded-xl border border-[#E2E8F0] px-4 py-5 my-6 ml-4 mr-4">
        <div class="flex items-center mb-3">
          <div class="flex flex-col flex-1">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-primary text-l truncate">{{ qnaData.admin_member_name_kr }}</span>
              <span class="text-xs text-[#ACB2BA]">{{ formatDate(qnaData.answer_date) }}</span>
            </div>
          </div>
        </div>
        <div class="text-[#1A1A1A] text-base whitespace-pre-wrap leading-relaxed">
          {{ qnaData.answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from '#imports'
import { useRoute } from 'vue-router'
import { useFetch, definePageMeta, createError, showError } from '#imports'
import NavigationBar from '~/components/common/NavigationBar.vue'
import { useI18n } from 'vue-i18n'

definePageMeta({
  name: 'qna-detail'
})

const { t, locale } = useI18n()

// We don't need to use i18n here as translations are passed directly
const route = useRoute()
const qnaId = route.params.id

// qna 데이터 상태 관리
const qnaData = ref({
  qna_idx: 0,
  qna_type_name_kr: '',
  qna_type_name_en: '',
  title: '',
  content: '',
  created_at: '',
  answer: '',
  answer_date: '',
  admin_member_name_kr: '',
  answer_status: '',
  member_name_kr: '',
})
const images = ref<any[]>([])

const fetchQnaDetail = async () => {
  try {
    const res = await $fetch(`/api/qna/detail?qna_idx=${qnaId}`)

    if(res.success) {
      qnaData.value = res.qna
      images.value = res.images || []
    } else {
      showError(createError({ statusCode: 404, statusMessage: 'wrong page' }))
    }
    
  } catch (error) {
    console.error('QnA 상세 조회 중 오류 발생:', error)
  }
}

// 날짜 포맷 함수 (ISO -> YYYY-MM-DD)
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  fetchQnaDetail()
})
</script>

<style scoped>
.notice-content img {
  max-width: 100%;
  height: auto;
}
</style>
