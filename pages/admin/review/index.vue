<template>
  <div class="space-y-6">
    <!-- 페이지 헤더 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">상품 리뷰 관리</h1>
      <p class="text-gray-600">골프장, 호텔, 캐디 리뷰를 조회하고 노출 여부 및 내용을 관리합니다.</p>
    </div>

    <!-- 필터 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 리뷰 타입 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">리뷰 타입</label>
          <div class="flex space-x-2">
            <button
              v-for="t in reviewTypeTabs"
              :key="t.key"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium',
                filters.type === t.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
              @click="filters.type = t.key; handleSearch()"
            >
              {{ t.label }}
            </button>
          </div>
        </div>

        <!-- 노출 여부 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">노출 여부</label>
          <select v-model="filters.useYn" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">전체</option>
            <option value="Y">노출</option>
            <option value="N">미노출</option>
          </select>
        </div>

        <!-- 키워드 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">키워드</label>
          <div class="flex space-x-2">
            <input
              v-model="filters.keyword"
              type="text"
              placeholder="상품명, 회원명, 내용 또는 상품 IDX"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleSearch"
            >
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              @click="handleSearch"
            >검색</button>
            <button
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
              @click="resetFilters"
            >초기화</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 목록 섹션 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-6 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900">리뷰 목록</h2>
        <div class="flex space-x-2">
          <button class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center" @click="navigateToCreate">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            신규 등록
          </button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center" @click="handleSearch">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            새로고침
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평점</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">내용</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">노출</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="r in reviews" :key="r.review_idx" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ r.review_idx }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTypeBadgeClass(r.review_type)">{{ getTypeText(r.review_type) }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img v-if="r.first_image_url" :src="r.first_image_url" alt="thumb" class="w-10 h-10 rounded-lg object-cover mr-3">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ r.product_title || '-' }}</div>
                    <div class="text-xs text-gray-500">IDX: {{ r.product_idx }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ r.member_name || '-' }}<span class="text-gray-400"> ({{ r.member_idx }})</span></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ r.review_rate }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" :title="r.review_content || ''">{{ r.review_content || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="r.use_yn === 'Y' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'" class="px-2 py-1 rounded text-xs font-medium">{{ r.use_yn === 'Y' ? '노출' : '미노출' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ r.created_at }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900" @click="openEdit(r.review_idx)">수정</button>
              </td>
            </tr>
            <tr v-if="!isLoading && reviews.length === 0">
              <td colspan="9" class="px-6 py-6 text-center text-gray-500">데이터가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div class="p-4 flex justify-between items-center">
        <div class="text-sm text-gray-600">
          총 {{ total }}건 / {{ filters.page }} 페이지
        </div>
        <div class="space-x-2">
          <button
            class="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            :disabled="filters.page <= 1"
            @click="prevPage"
          >이전</button>
          <button
            class="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            :disabled="filters.page >= maxPage"
            @click="nextPage"
          >다음</button>
        </div>
      </div>
    </div>

    <!-- 리뷰 수정 모달 -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-16 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">리뷰 수정 (ID: {{ detail?.review_idx }})</h3>
            <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="detail" class="space-y-4">
            <!-- 기본 정보 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">상품</label>
                <div class="text-sm text-gray-900">{{ detail.product_title || '-' }} <span class="text-gray-400">(IDX: {{ detail.product_idx }})</span></div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">회원</label>
                <div class="text-sm text-gray-900">{{ detail.member_name || '-' }} <span class="text-gray-400">(ID: {{ detail.member_idx }})</span></div>
              </div>
            </div>

            <!-- 평점/노출 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">평점</label>
                <input v-model.number="editForm.review_rate" class="w-full px-3 py-2 border rounded-md" type="number" min="1" max="5" step="1">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">노출 여부</label>
                <select v-model="editForm.use_yn" class="w-full px-3 py-2 border rounded-md">
                  <option value="Y">노출</option>
                  <option value="N">미노출</option>
                </select>
              </div>
            </div>

            <!-- 내용 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">내용</label>
              <textarea v-model="editForm.review_content" rows="5" class="w-full px-3 py-2 border rounded-md" />
            </div>

            <!-- 이미지 목록 (제거 체크) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">이미지</label>
              <div v-if="detail.images && detail.images.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div v-for="img in detail.images" :key="img.review_image_idx" class="border rounded-md p-2 relative">
                  <img :src="img.image_url" class="w-full h-24 object-cover rounded">
                  <div class="mt-2 flex items-center space-x-2">
                    <input :id="'rm-'+img.review_image_idx" v-model="editForm.remove_image_ids" type="checkbox" :value="img.review_image_idx" class="">
                    <label :for="'rm-'+img.review_image_idx" class="text-xs text-gray-700">제거하기</label>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500">등록된 이미지가 없습니다.</div>
            </div>

            <div class="flex justify-end space-x-3 pt-2">
              <button class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" @click="closeModal">취소</button>
              <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" @click="saveEdit">저장</button>
            </div>
          </div>
          <div v-else class="py-8 text-center text-gray-500">로딩 중...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from '#imports'
import { useRouter } from 'vue-router'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const router = useRouter()

// 타입 탭 정의
const reviewTypeTabs = [
  { key: 'G' as const, label: '골프장' },
  { key: 'H' as const, label: '호텔' },
  { key: 'C' as const, label: '캐디' }
]

// 목록 필터 및 상태
const filters = ref({
  type: 'G' as 'G' | 'H' | 'C',
  keyword: '',
  useYn: '' as '' | 'Y' | 'N',
  page: 1,
  pageSize: 20
})

const isLoading = ref(false)
const total = ref(0)
const reviews = ref<Array<{
  review_idx: number
  review_type: 'G' | 'H' | 'C'
  product_idx: number
  product_title: string | null
  member_idx: number
  member_name: string | null
  review_content: string | null
  review_rate: number
  use_yn: 'Y' | 'N'
  created_at: string
  updated_at: string
  first_image_url: string | null
}>>([])

const maxPage = computed(() => Math.max(1, Math.ceil(total.value / filters.value.pageSize)))

const getTypeText = (t: 'G' | 'H' | 'C') => ({ G: '골프', H: '호텔', C: '캐디' }[t])
const getTypeBadgeClass = (t: 'G' | 'H' | 'C') => {
  const base = 'px-2 py-1 rounded text-xs font-medium'
  if (t === 'G') return `${base} bg-green-100 text-green-800`
  if (t === 'H') return `${base} bg-blue-100 text-blue-800`
  return `${base} bg-purple-100 text-purple-800`
}

const fetchList = async () => {
  try {
    isLoading.value = true
    const query = new URLSearchParams({
      type: filters.value.type,
      keyword: filters.value.keyword || '',
      useYn: filters.value.useYn || '',
      page: String(filters.value.page),
      pageSize: String(filters.value.pageSize)
    }).toString()

    const res = await $fetch(`/api/admin/review?${query}`)
    reviews.value = res.reviews || []
    total.value = res.total || 0
  } catch (e) {
    console.error('리뷰 목록 로드 실패:', e)
    alert('리뷰 목록을 불러오는데 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  filters.value.page = 1
  fetchList()
}

const resetFilters = () => {
  filters.value.keyword = ''
  filters.value.useYn = ''
  filters.value.page = 1
  fetchList()
}

const nextPage = () => {
  if (filters.value.page < maxPage.value) {
    filters.value.page += 1
    fetchList()
  }
}

const prevPage = () => {
  if (filters.value.page > 1) {
    filters.value.page -= 1
    fetchList()
  }
}

// 상세/수정 모달 상태
type ReviewImage = { review_image_idx: number; image_url: string; use_yn: 'Y' | 'N'; created_at: string }
type ReviewDetail = {
  review_idx: number
  review_type: 'G' | 'H' | 'C'
  member_idx: number
  member_name: string | null
  reservation_idx: number
  product_idx: number
  product_title: string | null
  review_content: string | null
  review_rate: number
  use_yn: 'Y' | 'N'
  created_at: string
  updated_at: string
  images: ReviewImage[]
}

const showModal = ref(false)
const detail = ref<ReviewDetail | null>(null)
const editForm = ref<{ review_content: string; review_rate: number; use_yn: 'Y' | 'N'; remove_image_ids: number[] }>({
  review_content: '',
  review_rate: 5,
  use_yn: 'Y',
  remove_image_ids: []
})

const openEdit = async (reviewId: number) => {
  showModal.value = true
  detail.value = null
  editForm.value = { review_content: '', review_rate: 5, use_yn: 'Y', remove_image_ids: [] }
  try {
    const res = await $fetch(`/api/admin/review/${reviewId}`)
    const d = res.review as ReviewDetail
    detail.value = d
    editForm.value.review_content = d.review_content || ''
    editForm.value.review_rate = d.review_rate
    editForm.value.use_yn = d.use_yn
  } catch (e) {
    console.error('리뷰 상세 로드 실패:', e)
    alert('리뷰 상세 정보를 불러오는데 실패했습니다.')
    showModal.value = false
  }
}

const closeModal = () => {
  showModal.value = false
}

const saveEdit = async () => {
  if (!detail.value) return
  try {
    await $fetch(`/api/admin/review/${detail.value.review_idx}`, {
      method: 'PUT',
      body: {
        review_content: editForm.value.review_content,
        review_rate: editForm.value.review_rate,
        use_yn: editForm.value.use_yn,
        remove_image_ids: editForm.value.remove_image_ids
      }
    })
    alert('리뷰가 수정되었습니다.')
    closeModal()
    fetchList()
  } catch (e) {
    console.error('리뷰 수정 실패:', e)
    alert('리뷰 수정에 실패했습니다.')
  }
}

const navigateToCreate = () => {
  router.push('/admin/review/create')
}

onMounted(() => {
  fetchList()
})
</script>

<style>
</style>