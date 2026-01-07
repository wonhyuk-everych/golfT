<template>
  <div>
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('qna.title')" back-color="black"/>

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

      <!-- 탭 내용 -->
      <div>
        <div v-if="activeType === 'Q'">
          <!-- 질문하기 -->
          <QuestionForm />
        </div>
        <div v-else-if="activeType === 'L'">
          <!-- 질문내역 확인 -->
          <QuestionList />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavigationBar from '~/components/common/NavigationBar.vue'
import { useI18n } from 'vue-i18n'
import QuestionForm from '~/components/qna/QuestionForm.vue'
import QuestionList from '~/components/qna/QuestionList.vue'

const { t } = useI18n()

definePageMeta({
  middleware: ['auth'],
  title: 'QnA'
})

useLayout('qna')

const { user, fetch: refreshSession } = useUserSession()

// 공지사항 유형 데이터
const noticeTypes = ref([
  { type: 'Q', name: t('qna.question') },
  { type: 'L', name: t('qna.list') },
])

// 활성화된 공지 유형
const activeType = ref("L")
</script>

<style>

</style>