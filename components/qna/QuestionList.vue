<template>
  <div class="mx-auto bg-white">
    <div v-if="activeTab === 'home'" class="city-filter p-4 bg-white">
        <div class="grid grid-cols-4 gap-2">
          <button 
            class="city-button py-2 px-3 text-sm rounded-md text-center"
            :class="selectedType === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
            @click="selectType(null)"
          >
            {{ $t('community.allCities') }}
          </button>
          <button 
            v-for="type in qnaTypes" 
            :key="type.qna_type_idx"
            class="city-button py-2 px-3 text-sm rounded-md text-center"
            :class="selectedType === type.qna_type_idx ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
            @click="selectType(type.qna_type_idx)"
          >
            {{ locale === 'ko' ? type.name_kr : type.name_en }}
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-4 py-0">
            <div v-for="(item, index) in qnaList" :key="item.qna_idx" class="border-b border-gray-200 last:border-b-0">
                <div class="py-4 flex flex-col gap-2 cursor-pointer hover:bg-gray-50 transition"
                     @click="goToDetail(item.qna_idx)">
                    <!-- 질문 제목 영역 -->
                    <div class="flex items-start gap-1">
                        <!-- 잠금 아이콘 -->
                        <div class="flex items-center justify-center w-5 h-5 bg-white rounded-sm mt-0.5 flex-shrink-0">
                            <img src="@/assets/icons/lock.svg" alt="잠금 아이콘">
                        </div>
                        
                        <!-- 제목 -->
                        <div class="flex-1 min-w-0">
                            <h3 class="text-sm text-gray-900 font-normal leading-relaxed">
                                [{{ locale === 'ko' ? item.qna_type_name_kr : item.qna_type_name_en }}] {{ item.title }}
                            </h3>
                        </div>
                    </div>
                    
                    <!-- 메타 정보 영역 -->
                    <div class="flex items-center gap-2 text-xs text-gray-500 ml-6">
                        <span>{{ item.date }}</span>
                        <span>{{ item.author }}</span>
                        
                        <!-- 답변 상태 배지 -->
                        <div class="flex items-center justify-center px-2 py-0.5 border rounded text-xs"
                              :class="item.status === 'W' ? 'border-gray-300 text-gray-600' : 'border-gray-300 text-gray-600'">
                            {{ item.status === 'W' ? $t('qna.answerPending') : $t('qna.answerCompleted') }}
                        </div>
                        
                        <!-- NEW 표시 -->
                        <span v-if="item.isNew" class="text-cyan-600 font-medium">NEW</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!isLastPage && qnaList.length > 0" class="flex justify-center my-4">
          <button @click="loadMore" class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700" :disabled="loading">
            {{ $t('qna.loadMore') }}
          </button>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDetail = (qnaIdx: number) => {
  router.push({ path: `/qna/${qnaIdx}` })
}

const { t, locale } = useI18n()

const activeTab = ref('home')
const selectedType = ref<number|null>(null)

const qnaTypes = ref<{ qna_type_idx: number; name_kr: string; name_en: string }[]>([])
const qnaList = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(20)
const loading = ref(false)
const isLastPage = ref(false)

const selectType = (type: number | null) => {
  selectedType.value = type
  page.value = 1
  qnaList.value = []
  isLastPage.value = false
  fetchQnaList()
}

const fetchQnaTypes = async () => {
  try {
    const res = await fetch('/api/qna/qna-types')
    const data = await res.json()
    qnaTypes.value = data.qnaTypes || []
  } catch (error) {
    console.error('문의 유형 데이터 로드 중 오류 발생:', error)
  }
}

const fetchQnaList = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', String(page.value))
    params.append('limit', String(limit.value))
    if (selectedType.value !== null) {
      params.append('qna_type_idx', String(selectedType.value))
    }
    const res = await fetch(`/api/qna/list?${params.toString()}`)
    const data = await res.json()
    const today = new Date().toISOString().slice(0, 10)
    const newList = (data.list || []).map((item: any) => {
      const date = item.created_at ? item.created_at.slice(0, 10) : ''
      return {
        qna_idx: item.qna_idx,
        title: item.title,
        date,
        author: item.member_name_kr,
        status: item.answer_status,
        isNew: date === today,
        qna_type_name_kr: item.qna_type_name_kr,
        qna_type_name_en: item.qna_type_name_en,
      }
    })
    if (page.value === 1) {
      qnaList.value = newList
    } else {
      qnaList.value = [...qnaList.value, ...newList]
    }
    total.value = data.total
    isLastPage.value = qnaList.value.length >= data.total
  } catch (error) {
    console.error('QnA 리스트 로드 중 오류 발생:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchQnaTypes()
  fetchQnaList()
})

const loadMore = () => {
  if (!isLastPage.value && !loading.value) {
    page.value += 1
    fetchQnaList()
  }
}

</script>

<style>

</style>