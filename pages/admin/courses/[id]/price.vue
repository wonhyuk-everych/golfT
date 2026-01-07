<template>
  <div class="space-y-6">
    <!-- 상단 액션 영역 -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">골프장 월/시간/특별 요금 관리</h2>
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

    <!-- 월별 기본/부가 요금 -->
    <div class="bg-white p-6 rounded-lg shadow space-y-6">
      <h3 class="text-lg font-medium">월별 기본/부가 요금 및 정책</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">월 노출 최소 가격(화면에 노출되는 최소 가격 입니다)</label>
          <input v-model.number="state.monthly.minPrice" type="number" class="form-input w-full" placeholder="예: 150000">
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">최소 예약 인원</label>
          <input v-model.number="state.monthly.minimumPerson" type="number" class="form-input w-full" placeholder="예: 4">
        </div>

        <!-- 캐디 / 카트 -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">캐디 원가</label>
          <input v-model.number="state.monthly.caddyFee" type="number" class="form-input w-full">
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">캐디 판매 가격</label>
          <input v-model.number="state.monthly.caddySaleFee" type="number" class="form-input w-full">
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">카트 원가</label>
          <input v-model.number="state.monthly.cartFee" type="number" class="form-input w-full">
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">카트 판매 가격</label>
          <input v-model.number="state.monthly.cartSaleFee" type="number" class="form-input w-full">
        </div>

        <!-- 콜밴 -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">콜밴 SUV 편도 가격</label>
          <input v-model.number="state.monthly.callSuvOneWayFee" type="number" class="form-input w-full">
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">콜밴 SUV 왕복 가격</label>
          <input v-model.number="state.monthly.callSuvRoundTripFee" type="number" class="form-input w-full">
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">콜밴 VAN 편도 가격</label>
          <input v-model.number="state.monthly.callVanOneWayFee" type="number" class="form-input w-full">
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">콜밴 VAN 왕복 가격</label>
          <input v-model.number="state.monthly.callVanRoundTripFee" type="number" class="form-input w-full">
        </div>
      </div>

      <!--<div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">환불 정책</label>
          <textarea v-model="state.monthly.refundPolicy" rows="4" class="form-input w-full" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">취소 정책</label>
          <textarea v-model="state.monthly.cancelPolicy" rows="4" class="form-input w-full" />
        </div>
      </div>-->
    </div>

    <!-- 시간대 요금 관리 -->
    <div class="bg-white p-6 rounded-lg shadow space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium">시간대 요금(이번 달의 각 요일별/시간대별로 가격을 지정 하실 수 있습니다)</h3>
        <button class="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700" @click="addTimeSlot">시간대 요금 추가</button>
      </div>

      <div v-if="state.timeSlots.length === 0" class="text-gray-500">등록된 시간대 요금이 없습니다.</div>

      <div v-for="(slot, idx) in state.timeSlots" :key="idx" class="border rounded p-4 space-y-3">
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
            <label class="block text-sm text-gray-600 mb-1">시작</label>
            <input v-model="slot.startTime" type="time" class="form-input">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">종료</label>
            <input v-model="slot.endTime" type="time" class="form-input">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">가격</label>
            <input v-model.number="slot.price" type="number" class="form-input">
          </div>
          <div class="ml-auto">
            <button class="text-red-600 hover:underline" @click="removeTimeSlot(idx)">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 특별(일자별) 요금 관리 -->
    <div class="bg-white p-6 rounded-lg shadow space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium">특별 요금 (특정 날짜에 특별 요금을 지정 하실 수 있습니다)</h3>
        <button class="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700" @click="addExceptionSlot">특별 요금 추가</button>
      </div>

      <div v-if="state.exceptionSlots.length === 0" class="text-gray-500">등록된 특별 요금이 없습니다.</div>

      <div v-for="(ex, idx) in state.exceptionSlots" :key="idx" class="border rounded p-4 space-y-3">
        <div class="flex flex-wrap gap-4 items-end">
          <div>
            <label class="block text-sm text-gray-600 mb-1">날짜</label>
            <input v-model="ex.date" type="date" class="form-input">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">시작</label>
            <input v-model="ex.startTime" type="time" class="form-input">
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">종료</label>
            <input v-model="ex.endTime" type="time" class="form-input">
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
  caddyFee: number | null
  caddySaleFee: number | null
  cartFee: number | null
  cartSaleFee: number | null
  callSuvOneWayFee: number | null
  callSuvRoundTripFee: number | null
  callVanOneWayFee: number | null
  callVanRoundTripFee: number | null
  refundPolicy: string | null
  cancelPolicy: string | null
  minimumPerson: number | null
}

interface TimeSlotForm {
  daysOfWeek: number[]
  startTime: string // HH:mm
  endTime: string   // HH:mm
  price: number
}

interface ExceptionSlotForm {
  date: string // YYYY-MM-DD
  startTime: string
  endTime: string
  price: number
}

// API response types
interface ApiMonthly {
  min_price: number | null
  caddy_fee: number | null
  caddy_sale_fee: number | null
  cart_fee: number | null
  cart_sale_fee: number | null
  call_suv_one_way_fee: number | null
  call_suv_round_trip_fee: number | null
  call_van_one_way_fee: number | null
  call_van_round_trip_fee: number | null
  refund_policy: string | null
  cancel_policy: string | null
  minimum_person: number | null
}

interface ApiTime {
  day_of_week: number
  start_time: string
  end_time: string
  price: number
}

interface ApiException {
  exception_date: string
  start_time: string
  end_time: string
  price: number
}

const days = ['일','월','화','수','목','금','토']

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const overlayVisible = ref(false)

const route = useRoute()

const now = new Date()
const currentYear = now.getFullYear()
const yearOptions = ref<number[]>([currentYear, currentYear+1, currentYear + 2])

const defaultMonthly = (): MonthlyForm => ({
  minPrice: null,
  caddyFee: null,
  caddySaleFee: null,
  cartFee: null,
  cartSaleFee: null,
  callSuvOneWayFee: null,
  callSuvRoundTripFee: null,
  callVanOneWayFee: null,
  callVanRoundTripFee: null,
  refundPolicy: '',
  cancelPolicy: '',
  minimumPerson: null
})

const state = reactive({
  courseIdx: 0,
  year: currentYear,
  month: now.getMonth() + 1,
  monthly: defaultMonthly(),
  timeSlots: [] as TimeSlotForm[],
  exceptionSlots: [] as ExceptionSlotForm[]
})

const canSave = computed(() => state.courseIdx > 0 && state.year > 0 && state.month > 0)

onMounted(async () => {
  // route param을 courseIdx로 사용
  state.courseIdx = Number(route.params.id)
  // 최초 접속 시 현재 년/월 데이터 자동 불러오기
  if (canSave.value) {
    await onLoad()
  }
})

watch(
  () => [state.year, state.month],
  async ([,], [oldYear, oldMonth]) => {
    if (!canSave.value) return
    if (oldYear === undefined && oldMonth === undefined) return
    await onLoad()
  }
)

function addTimeSlot() {
  state.timeSlots.push({ daysOfWeek: [1,2,3,4,5], startTime: '07:00', endTime: '08:00', price: 0 })
}
function removeTimeSlot(idx: number) {
  state.timeSlots.splice(idx, 1)
}

function addExceptionSlot() {
  const d = new Date(state.year, state.month - 1, 1)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = '01'
  state.exceptionSlots.push({ date: `${yyyy}-${mm}-${dd}`, startTime: '07:00', endTime: '08:00', price: 0 })
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
    const res = await $fetch<{ monthly: ApiMonthly | null; timePrices: ApiTime[]; exceptionPrices: ApiException[] }>(
      `/api/admin/courses/price`,
      { query: { courseIdx: state.courseIdx, year: state.year, month: state.month } }
    )

    // Monthly
    if (res.monthly) {
      // map snake_case -> camelCase
      state.monthly = {
        minPrice: res.monthly.min_price ?? null,
        caddyFee: res.monthly.caddy_fee ?? null,
        caddySaleFee: res.monthly.caddy_sale_fee ?? null,
        cartFee: res.monthly.cart_fee ?? null,
        cartSaleFee: res.monthly.cart_sale_fee ?? null,
        callSuvOneWayFee: res.monthly.call_suv_one_way_fee ?? null,
        callSuvRoundTripFee: res.monthly.call_suv_round_trip_fee ?? null,
        callVanOneWayFee: res.monthly.call_van_one_way_fee ?? null,
        callVanRoundTripFee: res.monthly.call_van_round_trip_fee ?? null,
        refundPolicy: res.monthly.refund_policy ?? '',
        cancelPolicy: res.monthly.cancel_policy ?? '',
        minimumPerson: res.monthly.minimum_person ?? null
      }
    } else {
      state.monthly = defaultMonthly()
    }

    // Group timePrices by (start,end,price)
    const groupKey = (t: ApiTime) => `${t.start_time}|${t.end_time}|${t.price}`
    const map: Record<string, { daysOfWeek: Set<number>; startTime: string; endTime: string; price: number }> = {}
    for (const t of (res.timePrices || [])) {
      const key = groupKey(t)
      if (!map[key]) {
        map[key] = { daysOfWeek: new Set<number>(), startTime: t.start_time, endTime: t.end_time, price: t.price }
      }
      map[key].daysOfWeek.add(t.day_of_week)
    }
    state.timeSlots = Object.values(map).map(v => ({
      daysOfWeek: Array.from(v.daysOfWeek).sort((a,b)=>a-b),
      startTime: v.startTime,
      endTime: v.endTime,
      price: v.price
    }))

    // Exceptions
    state.exceptionSlots = (res.exceptionPrices || []).map((e: ApiException) => ({
      date: e.exception_date,
      startTime: e.start_time,
      endTime: e.end_time,
      price: e.price
    }))
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
    // Basic validation
    for (const s of state.timeSlots) {
      if (!s.daysOfWeek.length || !s.startTime || !s.endTime || !s.price) {
        throw new Error('시간대 요금 항목을 모두 입력하세요.')
      }
    }
    for (const e of state.exceptionSlots) {
      if (!e.date || !e.startTime || !e.endTime || !e.price) {
        throw new Error('특별 요금 항목을 모두 입력하세요.')
      }
    }

    await $fetch(`/api/admin/courses/price`, {
      method: 'POST',
      body: {
        courseIdx: state.courseIdx,
        year: state.year,
        month: state.month,
        monthly: state.monthly,
        timeSlots: state.timeSlots,
        exceptionSlots: state.exceptionSlots
      }
    })

    setTimeout(() => {
      alert('가격이 저장되었습니다.')
    }, 50)
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
  border-color: #e5e7eb; /* Tailwind gray-200 */
  border-radius: 0.375rem; /* rounded-md */
  padding: 0.5rem 0.75rem; /* py-2 px-3 */
}
</style>
