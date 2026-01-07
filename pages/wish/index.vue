<template>
  <div class="wish-page h-[100vh]">
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('wish.title')" back-color="black" />

    <div class="pt-16">
      <nav class="bg-white w-full border-b flex">
        <div 
          v-for="type in wishTypes"
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

      <div class="grid grid-cols-2 gap-4 px-4 pt-4">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="relative rounded-lg overflow-hidden shadow-sm cursor-pointer"
          @click="navigateToProduct(product.id)"
        >
          <!-- 이미지 섹션 -->
          <div class="relative h-[148px]">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover">
            <div v-if="product.isNew" class="absolute top-2 left-2">
              <span class="bg-primary text-white text-xs px-2 py-1 rounded">NEW</span>
            </div>
          </div>
          
          <!-- 정보 섹션 -->
          <div class="bg-white p-4">
            <div class="flex flex-col gap-2">
              <div v-if="product.location" class="flex items-center gap-2">
                <span class="text-xs text-text-secondary">{{ product.location }}</span>
              </div>
              <h3 class="text-base font-bold text-text-primary">{{ product.name }}</h3>
              <div class="flex items-center justify-between">
                <span class="text-base font-bold text-text-primary">{{ !product.price ? '가격문의' : formatPriceWithRate(product.price, locale) }}</span>
              </div>
              <!-- 태그 리스트 -->
              <div v-if="product.tags && product.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                <span 
                  v-for="(tag, index) in product.tags" 
                  :key="index"
                  :class="[
                    'text-xs px-2 py-1 rounded-md border',
                    tag.type === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600 border-gray-200'
                  ]"
                >
                  {{ tag.text }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 더보기 버튼 -->
    <div class="flex justify-center my-6" v-if="hasMore && !loading">
      <button @click="loadMore" class="px-6 py-2 bg-primary text-white rounded shadow hover:bg-primary-dark">
        {{ t('common.more') }}
      </button>
    </div>
    <div v-if="loading" class="flex justify-center my-6">
      <span>{{ t('common.loading') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '~/components/common/NavigationBar.vue'
import { useI18n } from 'vue-i18n'
import { ref, watch, onMounted } from 'vue'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { formatPriceWithRate } = useExchangeRate()

definePageMeta({
  name: 'wish'
})

const { locale, t } = useI18n()
// 위시리스트 유형 데이터
const wishTypes = ref([
  { type: 'G', name: t('wish.golf') },
  { type: 'H', name: t('wish.hotel') },
  { type: 'C', name: t('wish.caddy') }
])

// 활성화된 위시리스트 유형
const activeType = ref('G')

// 상품 리스트 및 상태
const products = ref<Product[]>([])
const page = ref(1)
const total = ref(0)
const loading = ref(false)

// 더보기 버튼 노출 조건
const hasMore = computed(() => products.value.length < total.value)

async function fetchWishList(type: string, pageNum: number, append = false) {
  loading.value = true
  try {
    const data = await $fetch('/api/wish/list', {
      params: { type, page: pageNum }
    })
    if (append) {
      products.value = products.value.concat(data.items)
    } else {
      products.value = data.items
    }
    total.value = data.total
  } catch (e) {
    // TODO: 에러 핸들링
    products.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 타입 변경 시 초기화 후 새 데이터 로드
watch(activeType, (newType) => {
  page.value = 1
  fetchWishList(newType, 1, false)
})

// 최초 로드
onMounted(() => {
  fetchWishList(activeType.value, 1, false)
})

function loadMore() {
  if (loading.value || !hasMore.value) return
  page.value += 1
  fetchWishList(activeType.value, page.value, true)
}

interface Product {
  id: number;
  name: string;
  location?: string;
  price: string;
  isNew?: boolean;
  image?: string;
  tags?: {
    type: string; // 'white' or 'blue'
    text: string;
  }[];
}

const navigateToProduct = (productId: number) => {
  let base = '';
  if (activeType.value === 'G') base = '/course';
  else if (activeType.value === 'H') base = '/hotel';
  else if (activeType.value === 'C') base = '/caddy';
  navigateTo(`${base}/${productId}`);
};
</script>

<style>

</style>