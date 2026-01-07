<!-- 추천 상품 관리 페이지 -->
<template>
  <div class="space-y-6">
    <!-- 페이지 헤더 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">추천 상품 관리</h1>
      <p class="text-gray-600">BEST30, 골프장, 호텔, 캐디 추천 상품을 관리할 수 있습니다.</p>
    </div>

    <!-- 탭 메뉴 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
            <span class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {{ tab.maxCount }}
            </span>
          </button>
        </nav>
      </div>

      <!-- 탭 컨텐츠 -->
      <div class="p-6">
        <div class="mb-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ getCurrentTabLabel() }} 추천 상품 목록
          </h2>
          <button
            @click="handleRefresh"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            새로고침
          </button>
        </div>

        <!-- 상품 목록 테이블 -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순서</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품 타입</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품 IDX</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">위치</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in currentProducts" :key="product.sort" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ product.sort }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="product.product_type" :class="getProductTypeClass(product.product_type)">
                    {{ getProductTypeText(product.product_type) }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="product.product_idx" class="text-sm text-gray-900">{{ product.product_idx }}</span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="product.product_name" class="flex items-center">
                    <img 
                      v-if="product.product_image" 
                      :src="product.product_image" 
                      :alt="product.product_name"
                      class="w-10 h-10 rounded-lg object-cover mr-3"
                    >
                    <div class="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center" v-else>
                      <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ product.product_name }}</div>
                    </div>
                  </div>
                  <span v-else class="text-gray-400">등록된 상품 없음</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="product.product_price" class="text-sm text-gray-900">
                    {{ formatPrice(product.product_price) }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="product.product_location" class="text-sm text-gray-600">{{ product.product_location }}</span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="handleAddProduct(product.sort)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    {{ product.product_idx ? '수정' : '추가' }}
                  </button>
                  <button
                    v-if="product.recommend_product_idx"
                    @click="handleDeleteProduct(product)"
                    class="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 상품 추가/수정 모달 -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <!-- 모달 헤더 -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ selectedSort }}번 위치에 상품 {{ modalMode === 'add' ? '추가' : '수정' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- 상품 타입 선택 (BEST30인 경우만) -->
          <div v-if="activeTab === 'best30'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">상품 타입</label>
            <select
              v-model="selectedProductType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">상품 타입을 선택하세요</option>
              <option value="golf">골프장</option>
              <option value="hotel">호텔</option>
              <option value="caddy">캐디</option>
            </select>
          </div>

          <!-- 상품 검색 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">상품 검색</label>
            <div class="flex space-x-2">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="상품명 또는 상품 IDX로 검색"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keyup.enter="handleSearch"
              />
              <button
                @click="handleSearch"
                :disabled="!canSearch"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                검색
              </button>
            </div>
          </div>

          <!-- 검색 결과 -->
          <div v-if="searchResults.length > 0" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">검색 결과</label>
            <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
              <div
                v-for="result in searchResults"
                :key="result.id"
                @click="selectProduct(result)"
                class="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center"
              >
                <img 
                  v-if="result.image" 
                  :src="result.image" 
                  :alt="result.name"
                  class="w-12 h-12 rounded-lg object-cover mr-3"
                >
                <div class="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center" v-else>
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900">{{ result.name }}</div>
                  <div class="text-sm text-gray-500">{{ result.location }}</div>
                  <div class="text-sm text-blue-600">{{ formatPrice(result.price) }}</div>
                </div>
                <div class="text-xs text-gray-400">ID: {{ result.id }}</div>
              </div>
            </div>
          </div>

          <!-- 선택된 상품 -->
          <div v-if="selectedProduct" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <label class="block text-sm font-medium text-gray-700 mb-2">선택된 상품</label>
            <div class="flex items-center">
              <img 
                v-if="selectedProduct.image" 
                :src="selectedProduct.image" 
                :alt="selectedProduct.name"
                class="w-12 h-12 rounded-lg object-cover mr-3"
              >
              <div class="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center" v-else>
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900">{{ selectedProduct.name }}</div>
                <div class="text-sm text-gray-500">{{ selectedProduct.location }}</div>
                <div class="text-sm text-blue-600">{{ formatPrice(selectedProduct.price) }}</div>
              </div>
            </div>
          </div>

          <!-- 모달 액션 버튼 -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              취소
            </button>
            <button
              @click="handleSaveProduct"
              :disabled="!selectedProduct"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ modalMode === 'add' ? '등록' : '수정' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from '#imports'
import type { RecommendProductWithDetails, ProductSearchResult, RecommendType, ProductType } from '~/types/admin/recommend'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

// 탭 정의
const tabs = [
  { key: 'best30', label: 'BEST30', maxCount: 30 },
  { key: 'golf', label: '골프장', maxCount: 6 },
  { key: 'hotel', label: '호텔', maxCount: 6 },
  { key: 'caddy', label: '캐디', maxCount: 6 }
]

// 반응형 데이터
const activeTab = ref<RecommendType>('best30')
const products = ref<{ [key: string]: any[] }>({})
const isLoading = ref(false)

// 모달 관련
const showModal = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const selectedSort = ref<number>(1)
const selectedProductType = ref<ProductType | ''>('')
const searchKeyword = ref('')
const searchResults = ref<ProductSearchResult[]>([])
const selectedProduct = ref<ProductSearchResult | null>(null)

// 계산된 속성
const currentProducts = computed(() => {
  return products.value[activeTab.value] || []
})

const canSearch = computed(() => {
  if (activeTab.value === 'best30') {
    return selectedProductType.value && searchKeyword.value.trim()
  }
  return searchKeyword.value.trim()
})

// 탭 변경 감지
watch(activeTab, (newTab) => {
  if (!products.value[newTab]) {
    loadProducts(newTab)
  }
  resetModal()
})

// 메서드
const getCurrentTabLabel = () => {
  const tab = tabs.find(t => t.key === activeTab.value)
  return tab ? tab.label : ''
}

const loadProducts = async (type: RecommendType) => {
  try {
    isLoading.value = true
    const response = await $fetch(`/api/admin/recommend?type=${type}`)
    products.value[type] = response.products
  } catch (error) {
    console.error('상품 목록 로드 실패:', error)
    alert('상품 목록을 불러오는데 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const handleRefresh = () => {
  loadProducts(activeTab.value)
}

const handleAddProduct = (sort: number) => {
  selectedSort.value = sort
  const existingProduct = currentProducts.value.find(p => p.sort === sort)
  
  if (existingProduct && existingProduct.product_idx) {
    modalMode.value = 'edit'
    selectedProductType.value = existingProduct.product_type
    selectedProduct.value = {
      id: existingProduct.product_idx,
      name: existingProduct.product_name,
      price: existingProduct.product_price,
      image: existingProduct.product_image,
      location: existingProduct.product_location,
      type: existingProduct.product_type
    }
  } else {
    modalMode.value = 'add'
    selectedProductType.value = activeTab.value === 'best30' ? '' : activeTab.value as ProductType
  }
  
  showModal.value = true
}

const handleDeleteProduct = async (product: any) => {
  if (!confirm('정말로 이 추천 상품을 삭제하시겠습니까?')) {
    return
  }

  try {
    await $fetch(`/api/admin/recommend/${product.recommend_product_idx}`, {
      method: 'DELETE'
    })
    
    alert('추천 상품이 삭제되었습니다.')
    loadProducts(activeTab.value)
  } catch (error) {
    console.error('상품 삭제 실패:', error)
    alert('상품 삭제에 실패했습니다.')
  }
}

const handleSearch = async () => {
  if (!canSearch.value) return

  const searchType = activeTab.value === 'best30' ? selectedProductType.value : activeTab.value

  try {
    const response = await $fetch(`/api/admin/recommend/search?type=${searchType}&keyword=${searchKeyword.value}`)
    searchResults.value = response.results
  } catch (error) {
    console.error('상품 검색 실패:', error)
    alert('상품 검색에 실패했습니다.')
  }
}

const selectProduct = (product: ProductSearchResult) => {
  selectedProduct.value = product
}

const handleSaveProduct = async () => {
  if (!selectedProduct.value) return

  const productType = activeTab.value === 'best30' ? selectedProductType.value : activeTab.value

  try {
    await $fetch('/api/admin/recommend', {
      method: 'POST',
      body: {
        recommend_type: activeTab.value,
        product_idx: selectedProduct.value.id,
        product_type: productType,
        sort: selectedSort.value
      }
    })

    alert('추천 상품이 등록되었습니다.')
    closeModal()
    loadProducts(activeTab.value)
  } catch (error) {
    console.error('상품 등록 실패:', error)
    alert('상품 등록에 실패했습니다.')
  }
}

const closeModal = () => {
  showModal.value = false
  resetModal()
}

const resetModal = () => {
  selectedSort.value = 1
  selectedProductType.value = ''
  searchKeyword.value = ''
  searchResults.value = []
  selectedProduct.value = null
}

const getProductTypeClass = (type: string) => {
  const classes = {
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-green-100 text-green-800': type === 'golf',
    'bg-blue-100 text-blue-800': type === 'hotel',
    'bg-purple-100 text-purple-800': type === 'caddy'
  }
  return classes
}

const getProductTypeText = (type: string) => {
  const typeMap = {
    golf: '골프장',
    hotel: '호텔',
    caddy: '캐디'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const formatPrice = (price: number | string) => {
  if (!price) return '-'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('ko-KR').format(numPrice) + '원'
}

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(() => {
  loadProducts(activeTab.value)
})
</script>