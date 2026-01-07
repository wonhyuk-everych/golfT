<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-16 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- 헤더 -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">{{ productTypeLabel }} 검색</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="$emit('close')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 검색 필터 -->
        <div class="mb-4">
          <div class="flex space-x-2">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="코드 또는 이름으로 검색"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleSearch"
            >
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              @click="handleSearch"
            >
              검색
            </button>
          </div>
        </div>

        <!-- 검색 결과 -->
        <div class="border rounded-md overflow-hidden">
          <div class="max-h-96 overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IDX</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                  <th v-if="productType === 'C'" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">닉네임</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">선택</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in products" :key="item.idx" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.idx }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.name }}</td>
                  <td v-if="productType === 'C'" class="px-4 py-3 text-sm text-gray-600">{{ item.nickName || '-' }}</td>
                  <td class="px-4 py-3">
                    <span :class="getStatusClass(item.status)">
                      {{ getStatusText(item.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button
                      class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      @click="selectProduct(item)"
                    >
                      선택
                    </button>
                  </td>
                </tr>
                <tr v-if="!isLoading && products.length === 0">
                  <td :colspan="productType === 'C' ? 5 : 4" class="px-4 py-6 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
                <tr v-if="isLoading">
                  <td :colspan="productType === 'C' ? 5 : 4" class="px-4 py-6 text-center text-gray-500">
                    검색 중...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="total > 0" class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-600">
            총 {{ total }}건
          </div>
          <div class="space-x-2">
            <button
              class="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
              :disabled="page <= 1"
              @click="prevPage"
            >
              이전
            </button>
            <span class="text-sm text-gray-600">{{ page }} / {{ totalPages }}</span>
            <button
              class="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
              :disabled="page >= totalPages"
              @click="nextPage"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from '#imports'

const props = defineProps<{
  productType: 'G' | 'H' | 'C'
}>()

const emit = defineEmits<{
  select: [product: { idx: number; name: string }]
  close: []
}>()

const searchKeyword = ref('')
const products = ref<Array<{
  idx: number
  name: string
  nickName?: string
  status: string
}>>([])
const isLoading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const productTypeLabel = computed(() => {
  const labels = { G: '골프장', H: '호텔', C: '캐디' }
  return labels[props.productType]
})

const getStatusClass = (status: string) => {
  const base = 'px-2 py-1 rounded text-xs font-medium'
  if (status === 'Y') return `${base} bg-green-100 text-green-800`
  return `${base} bg-gray-200 text-gray-700`
}

const getStatusText = (status: string) => {
  return status === 'Y' ? '정상' : '중지'
}

const fetchProducts = async () => {
  try {
    isLoading.value = true
    let endpoint = ''
    const queryParams = new URLSearchParams({
      searchWord: searchKeyword.value,
      page: String(page.value),
      pageSize: String(pageSize.value)
    })

    if (props.productType === 'G') {
      endpoint = '/api/admin/courses/search'
    } else if (props.productType === 'H') {
      endpoint = '/api/admin/hotel/search'
    } else if (props.productType === 'C') {
      endpoint = '/api/admin/caddy/search'
    }

    const res = await $fetch(`${endpoint}?${queryParams.toString()}`)

    if (props.productType === 'G') {
      const data = res as { courses: Array<{ courseIdx: number; nameKr: string; courseStatus: string }>; total: number }
      products.value = data.courses.map(c => ({
        idx: c.courseIdx,
        name: c.nameKr,
        status: c.courseStatus
      }))
      total.value = data.total
    } else if (props.productType === 'H') {
      const data = res as { hotels: Array<{ hotelIdx: number; nameKr: string; hotelStatus: string }>; total: number }
      products.value = data.hotels.map(h => ({
        idx: h.hotelIdx,
        name: h.nameKr,
        status: h.hotelStatus
      }))
      total.value = data.total
    } else if (props.productType === 'C') {
      const data = res as { caddies: Array<{ caddyIdx: number; name: string; nickName: string; caddyStatus: string }>; total: number }
      products.value = data.caddies.map(c => ({
        idx: c.caddyIdx,
        name: c.name,
        nickName: c.nickName,
        status: c.caddyStatus
      }))
      total.value = data.total
    }
  } catch (e) {
    console.error('상품 검색 실패:', e)
    alert('상품 검색에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  fetchProducts()
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchProducts()
  }
}

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
    fetchProducts()
  }
}

const selectProduct = (item: { idx: number; name: string }) => {
  emit('select', { idx: item.idx, name: item.name })
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
</style>
