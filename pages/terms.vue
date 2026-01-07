<template>
  <div>
    <NavigationBar
      mode="back_title"
      :show-bell="false"
      :title="titleByType"
      back-color="black"
    />

    <!-- Content wrapper below fixed NavigationBar -->
    <div class="max-w-[1024px] mx-auto px-4 pt-20 pb-10">
      <div v-if="pending" class="text-sm text-gray-500">Loading...</div>
      <div v-else v-html="html" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, definePageMeta, useFetch, useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import NavigationBar from '~/components/common/NavigationBar.vue'

const { locale } = useI18n()

const route = useRoute()

type TermsType = 'use' | 'privacy' | 'payment'

const type = computed<TermsType>(() => {
  const q = String(route.query.type || 'use')
  return (['use', 'privacy', 'payment'] as const).includes(q as TermsType) ? (q as TermsType) : 'use'
})

const { data, pending } = useFetch<{ html: string }>(() => `/api/terms?type=${type.value}`)

const html = computed(() => data.value?.html || '')

const titleByType = computed(() => {
  const isKo = locale.value === 'ko'
  switch (type.value) {
    case 'privacy':
      return isKo ? '개인정보 수집 및 이용 동의' : 'Privacy Policy'
    case 'payment':
      return isKo ? '결제 대행 서비스 약관' : 'Payment Service Terms'
    default:
      return isKo ? '이용약관' : 'Terms of Use'
  }
})

definePageMeta({
  name: 'terms'
})
</script>

<style>

</style>