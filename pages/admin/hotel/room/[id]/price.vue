<template>
  <div class="space-y-6">
    <!-- 상단 액션 영역 -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">호텔 객실 요금 관리</h2>
    </div>

    <!-- 검색/선택 영역 (년도/월만 + 버튼) -->
    <div class="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end">
      <div>
        <label class="block text-sm text-gray-600 mb-1">년도</label>
        <select v-model.number="state.year" class="border rounded-md px-3 py-2">
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1">월</label>
        <select v-model.number="state.month" class="border rounded-md px-3 py-2">
          <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button
          class="bg-gray-400 text-white px-4 py-2 rounded-md disabled:opacity-70 cursor-not-allowed"
          disabled
        >
          년/월 변경 시 자동으로 불러옵니다
        </button>
        <button
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="saving || !canSave"
          @click="onSave"
        >
          {{ saving ? '저장 중...' : '저장' }}
        </button>
      </div>
    </div>
    <!-- 로딩/에러 표시 -->
    <div v-if="loading" class="bg-white p-6 rounded-lg shadow flex justify-center">로딩 중...</div>
    <div v-if="error" class="bg-red-50 text-red-700 p-4 rounded">{{ error }}</div>

    <!-- 월별 최소 가격 -->
    <div class="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 class="text-lg font-medium">월별 최소 가격(화면에 노출되는 최소 가격 입니다)</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">월 노출 최소 가격</label>
          <input v-model.number="state.monthly.minPrice" type="number" class="form-input w-full" placeholder="예: 150000">
        </div>
      </div>
    </div>

    <!-- 요일별 기본 요금 -->
    <div class="bg-white p-6 rounded-lg shadow space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium">요일별 기본 요금(이번 달의 각 요일별로 가격을 지정 하실 수 있습니다)</h3>
        <button class="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700" @click="addWeekSlot">추가</button>
      </div>

      <div v-if="state.weekSlots.length === 0" class="text-gray-500">등록된 요일별 요금이 없습니다.</div>

      <div v-for="(slot, idx) in state.weekSlots" :key="idx" class="border rounded p-4 space-y-3">
        <div class="flex flex-wrap gap-4 items-end">
          <div>
            <label class="block text-sm text-gray-600 mb-1">적용 요일</label>
            <div class="flex gap-2">
              <label v-for="(d, i) in days" :key="i" class="flex items-center gap-1 text-sm">
                <input v-model="slot.daysOfWeek" type="checkbox" :value="i"> {{ d }}
              </label>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">가격</label>
            <input v-model.number="slot.price" type="number" class="form-input">
          </div>
          <div class="ml-auto">
            <button class="text-red-600 hover:underline" @click="removeWeekSlot(idx)">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 특별(일자별) 요금 -->
    <div class="bg-white p-6 rounded-lg shadow space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium">특별 요금 (특정 날짜를 지정하여 특별 요금을 지정하실 수 있습니다)</h3>
        <button class="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700" @click="addExceptionSlot">추가</button>
      </div>

      <div v-if="state.exceptionSlots.length === 0" class="text-gray-500">등록된 특별 요금이 없습니다.</div>

      <div v-for="(ex, idx) in state.exceptionSlots" :key="idx" class="border rounded p-4 space-y-3">
        <div class="flex flex-wrap gap-4 items-end">
          <div>
            <label class="block text-sm text-gray-600 mb-1">날짜</label>
            <input v-model="ex.date" type="date" class="form-input">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">가격</label>
            <input v-model.number="ex.price" type="number" class="form-input">
          </div>
          <div class="ml-auto">
            <button class="text-red-600 hover:underline" @click="removeExceptionSlot(idx)">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="overlayVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-lg px-8 py-6 text-center">
        <div class="text-lg font-semibold mb-2">가격 정보를 불러오는 중입니다</div>
        <div class="text-sm text-gray-600">최소 3초 정도 소요될 수 있습니다. 잠시만 기다려주세요.</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, useRoute, watch } from '#imports'

definePageMeta({ layout: 'admin', middleware: 'auth' })

interface MonthlyForm {
  minPrice: number | null
}

interface WeekSlotForm {
  daysOfWeek: number[]
  price: number
}

interface ExceptionSlotForm {
  date: string
  price: number
}

interface ApiMonthly {
  min_price: number | null
}

interface ApiWeekPrice { day_of_week: number; price: number }
interface ApiExceptionPrice { exception_date: string; price: number }

const days = ['일','월','화','수','목','금','토']

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const overlayVisible = ref(false)

const route = useRoute()

const now = new Date()
const currentYear = now.getFullYear()
const yearOptions = ref<number[]>([currentYear, currentYear+1, currentYear + 2])

const state = reactive({
  hotelRoomIdx: 0,
  year: currentYear,
  month: now.getMonth() + 1,
  monthly: { minPrice: null } as MonthlyForm,
  weekSlots: [] as WeekSlotForm[],
  exceptionSlots: [] as ExceptionSlotForm[]
})

const canSave = computed(() => state.hotelRoomIdx > 0 && state.year > 0 && state.month > 0)

onMounted(async () => {
  state.hotelRoomIdx = Number(route.params.id)
  // 최초 접속 시 현재 년/월 데이터 자동 불러오기
  if (canSave.value) {
    await onLoad()
  }
})

watch(
  () => [state.year, state.month],
  async () => {
    if (!canSave.value) return
    await onLoad()
  }
)

function addWeekSlot() {
  state.weekSlots.push({ daysOfWeek: [1,2,3,4,5], price: 0 })
}
function removeWeekSlot(idx: number) {
  state.weekSlots.splice(idx, 1)
}

function addExceptionSlot() {
  const d = new Date(state.year, state.month - 1, 1)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = '01'
  state.exceptionSlots.push({ date: `${yyyy}-${mm}-${dd}`, price: 0 })
}
function removeExceptionSlot(idx: number) {
  state.exceptionSlots.splice(idx, 1)
}

async function onLoad() {
  if (!canSave.value) return
  loading.value = true
  overlayVisible.value = true
  error.value = null
  const startTime = Date.now()
  try {
    const res = await $fetch<{ monthly: ApiMonthly | null; weekPrices: ApiWeekPrice[]; exceptionPrices: ApiExceptionPrice[] }>(
      `/api/admin/hotel/room/price`,
      { query: { hotelRoomIdx: state.hotelRoomIdx, year: state.year, month: state.month } }
    )

    // Monthly
    if (res.monthly) {
      state.monthly = { minPrice: res.monthly.min_price ?? null }
    } else {
      state.monthly = { minPrice: null }
    }

    // Week slots: group by price => daysOfWeek
    const map: Record<string, { price: number; days: Set<number> }> = {}
    for (const w of (res.weekPrices || [])) {
      const key = String(w.price)
      if (!map[key]) map[key] = { price: w.price, days: new Set<number>() }
      map[key].days.add(w.day_of_week)
    }
    state.weekSlots = Object.values(map).map(v => ({ price: v.price, daysOfWeek: Array.from(v.days).sort((a,b)=>a-b) }))

    // Exceptions
    state.exceptionSlots = (res.exceptionPrices || []).map(e => ({ date: e.exception_date, price: e.price }))
  } catch (e) {
    console.error(e)
    error.value = '가격 정보를 불러오는데 실패했습니다.'
  } finally {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(1000 - elapsed, 0)
    setTimeout(() => {
      loading.value = false
      overlayVisible.value = false
    }, remaining)
  }
}

async function onSave() {
  if (!canSave.value) return
  saving.value = true
  error.value = null
  try {
    // basic validation
    if (state.monthly.minPrice == null || Number.isNaN(state.monthly.minPrice)) {
      throw new Error('월 최소 가격을 입력하세요.')
    }
    for (const s of state.weekSlots) {
      if (!s.daysOfWeek.length || !s.price) throw new Error('요일별 가격을 모두 입력하세요.')
    }
    for (const e of state.exceptionSlots) {
      if (!e.date || !e.price) throw new Error('특별 요금 항목을 모두 입력하세요.')
    }

    await $fetch(`/api/admin/hotel/room/price`, {
      method: 'POST',
      body: {
        hotelRoomIdx: state.hotelRoomIdx,
        year: state.year,
        month: state.month,
        monthly: state.monthly,
        weekSlots: state.weekSlots,
        exceptionSlots: state.exceptionSlots
      }
    })

    setTimeout(() => alert('가격이 저장되었습니다.'), 50)
  } catch (e) {
    console.error(e)
    alert('가격 저장에 실패했습니다.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.form-input {
  width: 100%;
  border-width: 1px;
  border-style: solid;
  border-color: #e5e7eb; /* gray-200 */
  border-radius: 0.375rem; /* rounded-md */
  padding: 0.5rem 0.75rem; /* py-2 px-3 */
}
</style>
