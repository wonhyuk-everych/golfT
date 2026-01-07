<template>
  <div class="min-h-screen bg-white flex flex-col">
    <NavigationBar mode="back_title" :show-bell="false" :title="'골프T AI'" back-color="black"/>

    <!-- Content -->
    <main class="flex-1 px-6 pt-10 flex flex-col items-center text-center mt-16">
      <!-- Step 0: Intro -->
      <template v-if="step === 0">
        <p class="text-gray-800 text-xl font-semibold mb-6">반갑습니다 고객님~</p>
        <p class="text-gray-800 text-base mb-6">현재 어떤 골프 여행을 계획 중이신가요?</p>
        <p class="text-gray-600 text-base leading-relaxed">
          고객님의 행복한 골프 여행 설계를 위해<br />
          골프T AI가 몇 가지 질문을 드리겠습니다.
        </p>
      </template>

      <!-- Step 1: City input -->
      <template v-else-if="step === 1">
        <div class="flex flex-col items-center w-full">
          <img alt="travel" src="/images/ai/ai_image_1.png" class="w-24 h-24 mb-6" onerror="this.style.display='none'" />
          <p class="text-gray-900 text-xl font-bold">
            골프 여행으로 <br /> 태국의 <span class="text-primary">어느 도시</span>를 생각 중이신가요?
          </p>
          <p class="text-sm mb-6 text-gray-500">AI 견적 서비스는 시험 운영 중인 서비스로, <strong>방콕</strong>과 <strong>파타야</strong> 지역에서만 이용 가능함을 양해 부탁드립니다.</p>
          <input
            v-model.trim="city"
            type="text"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <p v-if="errors.city" class="text-red-500 text-sm mt-2">{{ errors.city }}</p>
        </div>
      </template>

      <!-- Step 2: Count input -->
      <template v-else-if="step === 2">
        <img alt="travel" src="/images/ai/ai_image_1.png" class="w-24 h-24 mb-6" onerror="this.style.display='none'" />
        <p class="text-gray-900 text-xl font-bold mb-4">
          여행 기간 중, <span class="text-primary">골프 라운딩</span>은 몇 번을 원하시나요?
        </p>
        <input
          v-model.number="count"
          type="number"
          inputmode="numeric"
          min="0"
          placeholder="숫자로 입력 (예: 2, 3, 4)"
          class="w-full max-w-md h-12 px-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
        <p class="text-gray-500 text-sm mt-2">허용 값: 2 / 3 / 4</p>
        <p v-if="errors.count" class="text-red-500 text-sm mt-2">{{ errors.count }}</p>
      </template>

      <!-- Step 3: Difficulty selection -->
      <template v-else-if="step === 3">
        <img alt="travel" src="/images/ai/ai_image_1.png" class="w-24 h-24 mb-6" onerror="this.style.display='none'" />
        <p class="text-gray-900 text-xl font-bold mb-6">
          라운딩을 원하시는 <span class="text-primary">골프장의 수준</span>은 어떻게 되나요?
        </p>
        <div class="grid grid-cols-3 gap-3 w-full max-w-md">
          <button
            v-for="opt in levelOptions"
            :key="opt.ui"
            type="button"
            @click="difficulty = opt.api"
            :class="['h-12 rounded-lg border', difficulty === opt.api ? 'bg-primary text-white border-primary' : 'bg-white text-gray-800 border-gray-200']"
          >
            {{ opt.ui }}
          </button>
        </div>
        <p v-if="errors.difficulty" class="text-red-500 text-sm mt-2">{{ errors.difficulty }}</p>
      </template>

      <!-- Step 4: People input -->
      <template v-else-if="step === 4">
        <img alt="travel" src="/images/ai/ai_image_1.png" class="w-24 h-24 mb-6" onerror="this.style.display='none'" />
        <p class="text-gray-900 text-xl font-bold mb-4">
          골프 여행의 <span class="text-primary">총 인원</span>은 어떻게 되나요?
        </p>
        <input
          v-model.number="people"
          type="number"
          inputmode="numeric"
          min="1"
          placeholder="숫자로 입력 (예: 4)"
          class="w-full max-w-md h-12 px-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
        <p v-if="errors.people" class="text-red-500 text-sm mt-2">{{ errors.people }}</p>
      </template>

      <!-- Step 5: Loading + airplane animation -->
      <template v-else-if="step === 5">
        <div class="flex flex-col items-center">
          <div class="relative w-full max-w-sm h-36 mb-4">
            <!-- Left cloud (static) -->
            <img
              alt="cloud"
              src="/images/ai/ai_image_3.png"
              class="absolute left-2 bottom-3 w-24 h-auto select-none cloud"
              onerror="this.style.display='none'"
            />
            <!-- Airplane (floating) -->
            <img
              alt="airplane"
              src="/images/ai/ai_image_2.png"
              class="absolute left-1/2 -translate-x-1/2 top-10 w-32 h-auto select-none floating"
              onerror="this.style.display='none'"
            />
            <!-- Right cloud (static) -->
            <img
              alt="cloud"
              src="/images/ai/ai_image_3.png"
              class="absolute right-4 top-6 w-24 h-auto opacity-90 select-none cloud"
              onerror="this.style.display='none'"
            />
          </div>
          <p class="text-gray-900 text-xl font-bold">최적의 여행 상품을 준비 중 입니다.</p>
          <p class="text-gray-900 text-xl font-bold">잠시만 기다려 주세요.</p>
        </div>
      </template>

      <!-- Step 6: Done (Results) -->
      <template v-else-if="step === 6">
        <template v-if="parsedResults.length > 0 && !apiError">
          <p class="text-gray-900 text-xl font-bold mb-6">다음과 같이 제안 드립니다.</p>

          <div class="w-full max-w-md space-y-6 text-left">
            <div v-for="(item, idx) in parsedResults" :key="idx" class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                <img :src="item.image" alt="course" class="w-full h-full object-cover" onerror="this.style.display='none'" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-1 bg-[#E6FAFC] text-primary text-xs rounded-md">Day {{ idx + 1 }}</span>
                </div>
                <p class="text-gray-900 font-medium leading-tight">{{ item.course }}</p>
                <p class="text-gray-500 text-sm">{{ formatOnlyWonPrice(item.price) }}</p>
              </div>
            </div>

            <div class="rounded-xl bg-gray-50 px-6 py-5">
              <div class="flex items-center justify-between text-gray-500 mb-2">
                <span>1인 비용</span>
                <span>{{ formatOnlyWonPrice(perPersonTotal) }}</span>
              </div>
              <div class="flex items-center justify-between text-primary font-bold text-lg">
                <span>{{ people || 1 }}인 총 비용</span>
                <span>{{ formatOnlyWonPrice(groupTotal) }}</span>
              </div>
            </div>
            <button type="button" @click="resetFlow" class="h-12 px-4 rounded-lg border border-gray-300 text-gray-700 float-right">재시도</button>
          </div>
        </template>
        <template v-else>
          <p class="text-gray-900 text-xl font-bold mb-2">죄송합니다.</p>
          <p class="text-gray-600">요청하신 조건에 맞는 상품을 찾을 수 없습니다.</p>
        </template>
      </template>
    </main>

    <!-- Bottom CTA -->
    <div class="px-6 pb-8">
      <div class="flex gap-3" v-if="step > 0 && step < 5">
        <button type="button" @click="goPrev" class="h-12 px-4 rounded-lg border border-gray-300 text-gray-700">이전</button>
        <button
          type="button"
          :disabled="!canProceed"
          @click="goNext"
          :class="['flex-1 h-12 rounded-lg text-white text-lg font-semibold shadow-md active:opacity-90', canProceed ? 'bg-primary' : 'bg-gray-300 cursor-not-allowed']"
        >
          {{ step === 4 ? '결과 보기' : '다음' }}
        </button>
      </div>
      <button
        v-else-if="step === 0"
        type="button"
        @click="goNext"
        class="w-full h-12 rounded-lg bg-primary text-white text-lg font-semibold shadow-md active:opacity-90"
      >
        다음
      </button>
      <button
        v-else-if="step === 6"
        type="button"
        @click="parsedResults.length > 0 && !apiError ? goReserve() : resetFlow()"
        class="w-full h-12 rounded-lg bg-primary text-white text-lg font-semibold shadow-md active:opacity-90"
      >
        {{ parsedResults.length > 0 && !apiError ? '상세 예약 및 결제 상담' : '다시 시도하기' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import NavigationBar from '~/components/common/NavigationBar.vue'
import { formatOnlyWonPrice } from '~/utils/formatters'

const { t } = useI18n()

// Steps: 0 Intro, 1 City, 2 Count, 3 Difficulty, 4 People, 5 Loading, 6 Done
const step = ref<number>(0)

const city = ref<string>('')
const count = ref<number | null>(null)
const difficulty = ref<'가성비' | '상급' | '최상급' | ''>('')
const people = ref<number | null>(null)

const levelOptions = [
  { ui: '중급', api: '가성비' as const },
  { ui: '상급', api: '상급' as const },
  { ui: '최상급', api: '최상급' as const }
]

const errors = ref<{ city?: string; count?: string; difficulty?: string; people?: string }>({})

// Results parsing
type ParsedItem = { course: string; price: number; image: string }
const parsedResults = ref<ParsedItem[]>([])
const perPersonTotal = computed(() => parsedResults.value.reduce((sum, r) => sum + (r.price || 0), 0))
const groupTotal = computed(() => perPersonTotal.value * (people.value || 1))
const apiError = ref<string>('')

const resultImagePool = [
  'https://golft.speedgabia.com/images/golf/53/2b76fe15b539453fbac1bac5c46cf5fb_1757495637802.jpg',
  'https://golft.speedgabia.com/images/golf/123/2308c83eb4ae4342a45cba7a9a100e09_1757911122658.jpg',
  'https://golft.speedgabia.com/images/golf/124/35d77d6f9aca4787bf0020379260ca21_1757910680413.jpg',
  'https://golft.speedgabia.com/images/golf/125/b92a68ae221a4f1db2dda92affa8d60f_1757910524296.jpg',
  'https://golft.speedgabia.com/images/golf/126/e9589758242e4a21b427506d395399fc_1757910398778.jpg',
  'https://golft.speedgabia.com/images/golf/55/369ea8a775a44b4fab6a659855f1b8ca_1757562742699.jpg',
  'https://golft.speedgabia.com/images/golf/57/5f2bb69fa8ce4b9898394a089208feb0_1757560600194.jpg',
  'https://golft.speedgabia.com/images/golf/60/a567b7a4a5b04ef696ee8cebceb61a21_1757556943995.jpg',
]

// Fisher–Yates shuffle to avoid duplicates and keep stable order per fetch
const shuffle = <T,>(arr: T[]): T[] => {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const validateCurrent = () => {
  errors.value = {}
  if (step.value === 1) {
    if (!city.value) errors.value.city = '도시를 입력해 주세요.'
  } else if (step.value === 2) {
    if (![2, 3, 4].includes(Number(count.value))) errors.value.count = '라운딩 횟수를 2/3/4 중 하나로 입력해 주세요.'
  } else if (step.value === 3) {
    if (!difficulty.value) errors.value.difficulty = '골프장 수준을 선택해 주세요.'
  } else if (step.value === 4) {
    if (!people.value || Number(people.value) < 1) errors.value.people = '1명 이상으로 입력해 주세요.'
  }
  return Object.keys(errors.value).length === 0
}

const canProceed = computed(() => {
  if (step.value === 1) return !!city.value
  if (step.value === 2) return [2, 3, 4].includes(Number(count.value))
  if (step.value === 3) return !!difficulty.value
  if (step.value === 4) return Number(people.value) >= 1
  return true
})

const goNext = async () => {
  if (step.value === 0) {
    step.value = 1
    return
  }
  if (!validateCurrent()) return

  if (step.value < 4) {
    step.value += 1
    return
  }

  // step 4 -> show loading with animation, wait ~3s, then call API via POST and render results
  step.value = 5
  await new Promise((resolve) => setTimeout(resolve, 3000))
  try {
    const body = {
      city: city.value,
      count: String(count.value),
      difficulty: difficulty.value,
      // people is collected but not required by API
    }
    const data = await $fetch<string[]>('/api/ai/search', { method: 'POST', body })
    // Parse into objects
    const imgPool = shuffle(resultImagePool)
    parsedResults.value = (data || []).map((row, idx) => {
      const [course, priceStr] = String(row).split('-')
      const price = Number(priceStr)
      const image = imgPool[idx % imgPool.length]
      return { course, price: Number.isFinite(price) ? price : 0, image }
    })
    if (!parsedResults.value.length) {
      apiError.value = '조건에 맞는 상품을 찾을 수 없습니다.'
    } else {
      apiError.value = ''
    }
  } catch (err: any) {
    console.error('[AI 추천 오류]', err?.data?.statusMessage || err?.message || err)
    parsedResults.value = []
    apiError.value = '서버 오류로 정보를 불러오지 못했습니다.'
  } finally {
    step.value = 6
  }
}

const goPrev = () => {
  if (step.value > 0 && step.value <= 4) step.value -= 1
}

const resetFlow = () => {
  step.value = 1
  city.value = ''
  count.value = null
  difficulty.value = ''
  people.value = null
  errors.value = {}
  parsedResults.value = []
  apiError.value = ''
}

const goReserve = () => {
  // TODO: Replace with actual reservation route
  location.href = 'https://golft.channel.io/'
}

definePageMeta({ name: 'ai-home' })
</script>

<style scoped>
/* Floating animation for airplane image */
@keyframes floatY {
  0% { transform: translate(-50%, 0); }
  100% { transform: translate(-50%, -12px); }
}
.floating {
  animation: floatY 1.8s ease-in-out infinite alternate;
}
/* Optional cloud styling hook if future animation needed */
.cloud { will-change: transform; }
</style>