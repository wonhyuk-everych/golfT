<template>
  <div class="wish-page h-[100vh]">
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('review.title')" back-color="black" />

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

      <div class="flex flex-col gap-4 px-4 py-4">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="flex gap-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
          @click="navigateToProduct(product.id)"
        >
          <!-- 이미지 섹션 -->
          <div class="relative w-[120px] h-[120px] rounded-lg overflow-hidden flex-shrink-0">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.productName"
              class="w-full h-full object-cover"
            >
            <div
              v-else
              class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs"
            >
              No Image
            </div>
          </div>
          
          <!-- 정보 섹션 -->
          <div class="flex flex-col flex-grow justify-between py-2">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-sm text-text-secondary">{{product.reviewDate}} | {{ product.productName }}</span>
              </div>
              <h3 class="text-base font-bold text-text-primary">{{ product.review }}</h3>
            </div>

            <div class="flex flex-col gap-2">
              <!-- 리뷰 평점 -->
              <div class="flex items-center gap-1">
                <div class="flex gap-0.5">
                  <template v-for="(starType, index) in _getStars(product.reviewRate)" :key="index">
                    <img 
                      :src="`/images/icon/star-${starType}.svg`" 
                      alt="star" 
                      class="w-4 h-4"
                    >
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="hasMore && !loading" class="flex justify-center mt-4">
        <button class="px-6 py-2 rounded bg-primary text-white font-bold" @click="loadMore">더보기</button>
      </div>
      <div v-if="loading" class="flex justify-center mt-4">
        <span>로딩중...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '~/components/common/NavigationBar.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

definePageMeta({
  name: 'review'
})

const { locale, t } = useI18n()
// 위시리스트 유형 데이터
const wishTypes = ref([
  { type: 'G', name: t('review.golf') },
  { type: 'H', name: t('review.hotel') },
  { type: 'C', name: t('review.caddy') }
])

// 활성화된 위시리스트 유형
const activeType = ref('G')


interface Product {
  image?: string;
  id: number;
  productName: string;
  review: string; 
  reviewRate: number;
  reviewer: string;
  reviewDate: Date;
}

const products = ref<Product[]>([])
const page = ref(1)
const pageSize = 20
const hasMore = ref(true)
const loading = ref(false)

// 리뷰 데이터 fetch 함수
const fetchReviews = async (reset = false) => {
  if (loading.value || (!hasMore.value && !reset)) return
  loading.value = true
  try {
    const res = await $fetch('/api/review/list', {
      query: {
        review_type: activeType.value,
        page: page.value,
        pageSize
      }
    })
    const newReviews = (res.reviews || []).map(r => ({
      id: r.product_id,
      productName: r.product_name,
      review: r.review,
      reviewRate: r.review_rate,
      reviewDate: r.review_date,
      reviewIdx: r.review_idx,
      image: r.review_image,
      reviewer: '' // reviewer 정보가 필요하면 API에서 추가
    }))
    if (reset) {
      products.value = newReviews
    } else {
      products.value = products.value.concat(newReviews)
    }
    hasMore.value = newReviews.length === pageSize
  } catch (e) {
    // 오류 처리
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

// 탭 변경 시 초기화 및 첫 페이지 로드
watch(() => activeType.value, () => {
  page.value = 1
  hasMore.value = true
  fetchReviews(true)
})

onMounted(() => {
  fetchReviews(true)
})

// 더보기 버튼 클릭
const loadMore = () => {
  if (loading.value || !hasMore.value) return
  page.value += 1
  fetchReviews()
}

const navigateToProduct = (productId: number) => {
  let base = '';
  if (activeType.value === 'G') base = '/course';
  else if (activeType.value === 'H') base = '/hotel';
  else if (activeType.value === 'C') base = '/caddy';
  navigateTo(`${base}/${productId}`);
};

const _getStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push('half');
  }

  // Add empty stars
  while (stars.length < 5) {
    stars.push('empty');
  }

  return stars;
};
</script>

<style>

</style>