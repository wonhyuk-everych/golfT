<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">바트 환율 관리</h1>
        <p class="text-gray-500 mt-1">오늘의 바트 환율을 확인하고 필요 시 수정할 수 있습니다.</p>
      </div>
      <button
        class="self-start md:self-auto inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
        @click="openModal"
      >
        환율 수정
      </button>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p class="text-sm text-gray-500">현재 환율 (1 바트 기준)</p>
          <p class="text-3xl font-semibold text-gray-900 mt-2">{{ formattedRate }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">마지막 업데이트</p>
          <p class="text-lg text-gray-900 mt-2">{{ formattedUpdatedAt }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">상태</p>
          <p class="text-lg font-medium mt-2" :class="statusClass">{{ statusLabel }}</p>
        </div>
      </div>

      <div v-if="fetchError" class="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
        {{ fetchError }}
      </div>

      <div
        v-if="feedback"
        :class="[
          'mt-4 p-3 rounded-md text-sm',
          feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        ]"
      >
        {{ feedback.message }}
      </div>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-semibold text-gray-900">안내</h2>
      <ul class="mt-3 space-y-2 text-sm text-gray-600 list-disc list-inside">
        <li>입력 값은 숫자만 가능하며, 0보다 큰 값이어야 합니다.</li>
        <li>환율 수정 후 최대 1시간 뒤에 서비스에 반영됩니다.</li>
      </ul>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">바트 환율 수정</h2>
            <p class="text-sm text-gray-500 mt-1">새로운 환율을 입력하고 저장하세요.</p>
          </div>
          <button class="text-gray-400 hover:text-gray-600" :disabled="submitting" @click="closeModal">
            <span class="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <form class="mt-6 space-y-5" @submit.prevent="submitRate">
          <div>
            <label class="block text-sm font-medium text-gray-700">바트 환율</label>
            <input
              v-model.number="modalRate"
              type="number"
              step="0.01"
              min="0"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 45.11"
            >
            <p class="text-xs text-gray-500 mt-1">1 바트 당 원화 값으로 입력해주세요.</p>
            <p v-if="modalError" class="text-sm text-red-600 mt-1">{{ modalError }}</p>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              :disabled="submitting"
              @click="closeModal"
            >
              취소
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="submitting"
            >
              {{ submitting ? '저장 중...' : '저장' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from '#imports'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface BartRateResponse {
  bartRate: number | null
  createdAt: string | null
}

type Feedback = {
  type: 'success' | 'error'
  message: string
}

const latestRate = ref<number | null>(null)
const lastUpdatedAt = ref<string | null>(null)
const isLoading = ref(false)
const fetchError = ref<string | null>(null)
const feedback = ref<Feedback | null>(null)

const showModal = ref(false)
const modalRate = ref<number | null>(null)
const modalError = ref<string | null>(null)
const submitting = ref(false)

const formattedRate = computed(() => {
  if (latestRate.value === null) return '-'
  return latestRate.value.toFixed(4)
})

const formattedUpdatedAt = computed(() => {
  if (!lastUpdatedAt.value) return '-'
  const parsed = new Date(lastUpdatedAt.value)
  if (Number.isNaN(parsed.getTime())) {
    return lastUpdatedAt.value
  }
  return parsed.toLocaleString('ko-KR')
})

const statusLabel = computed(() => {
  if (isLoading.value) return '불러오는 중'
  if (fetchError.value) return '오류 발생'
  if (latestRate.value === null) return '환율 정보 없음'
  return '정상'
})

const statusClass = computed(() => {
  if (isLoading.value) return 'text-blue-600'
  if (fetchError.value) return 'text-red-600'
  if (latestRate.value === null) return 'text-gray-500'
  return 'text-green-600'
})

const loadRate = async () => {
  try {
    isLoading.value = true
    fetchError.value = null
    const response = await $fetch<BartRateResponse>('/api/admin/payment/bart-rate')
    latestRate.value = typeof response.bartRate === 'number' ? response.bartRate : null
    lastUpdatedAt.value = response.createdAt
  } catch (error) {
    console.error('Failed to load Bart exchange rate:', error)
    fetchError.value = '환율 정보를 불러오는 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

const openModal = () => {
  modalError.value = null
  modalRate.value = latestRate.value
  showModal.value = true
}

const closeModal = () => {
  if (submitting.value) return
  showModal.value = false
}

const submitRate = async () => {
  modalError.value = null

  if (modalRate.value === null || !Number.isFinite(modalRate.value) || modalRate.value <= 0) {
    modalError.value = '0보다 큰 유효한 환율 값을 입력해주세요.'
    return
  }

  try {
    submitting.value = true
    await $fetch('/api/admin/payment/bart-rate', {
      method: 'PUT',
      body: {
        bartRate: modalRate.value
      }
    })

    feedback.value = {
      type: 'success',
      message: '환율이 성공적으로 업데이트되었습니다.'
    }

    showModal.value = false
    await loadRate()
  } catch (error) {
    console.error('Failed to update Bart exchange rate:', error)
    feedback.value = {
      type: 'error',
      message: '환율 업데이트 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }
  } finally {
    submitting.value = false
  }
}

onMounted(loadRate)
</script>
