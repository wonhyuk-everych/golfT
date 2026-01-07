<template>
  <div class="wish-page h-[100vh]">
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('review.title')" back-color="black" />

    <!-- 리뷰 평점 요약 -->
    <div v-if="reviewTotalCount > 0" class="bg-white rounded-lg p-4 mb-4 pt-10 mt-[60px]">
      <div class="flex items-center gap-6 justify-center">
        <!-- 평균 평점 -->
        <div class="flex flex-col items-center bg-gray-100 p-2 rounded w-full">
          <div class="text-3xl font-bold text-primary">{{ reviewAverageRate.toFixed(1) }}</div>
          <div class="flex gap-0.5 my-1">
            <template v-for="(starType, index) in getStars(reviewAverageRate)" :key="index">
              <img 
                :src="`/images/icon/star-${starType}.svg`" 
                alt="star" 
                class="w-5 h-5"
              >
            </template>
          </div>
          <div class="text-sm text-gray-500">{{ reviewTotalCount }}개의 리뷰</div>
        </div>
      </div>
    </div>

    <Divider :offset-px="0"/>

    <div>
      <div v-if="errorMsg" class="text-center text-red-500 py-8">{{ errorMsg }}</div>
      <div v-else class="flex flex-col gap-4 px-4 py-4">
        <div 
        v-for="review in reviews" 
        :key="review.review_idx"
        class="bg-white rounded-lg mt-4 mb-4"
        >
          <!-- 리뷰 헤더 -->
          <div class="flex items-start gap-3 mb-3">
            <!-- 프로필 아이콘 -->
            <div class="w-[24px] h-[24px] rounded-full bg-gray-400 flex-shrink-0 flex items-center justify-center">
              <img src="~/assets/icons/person.svg" alt="profile" class="w-[16px] h-[16px] brightness-0 invert">
            </div>
            
            <!-- 리뷰어 정보 및 별점 -->
            <div class="flex-grow">
              <div class="flex justify-between items-center mb-1">
                <div class="flex items-center gap-3 ">
                  <span class="font-medium text-base font-bold">{{ review.memberName }}</span>
                  <div class="flex gap-2">
                    <img 
                        :src="`/images/icon/star-full.svg`" 
                        alt="star" 
                        class="w-5 h-5"
                      >
                    <span class="text-base font-bold">{{ review.reviewRate }}</span>
                  </div>
                </div>
                <div class="flex gap-0.5">
                  <span class="text-base text-text-secondary">{{ review.reviewDate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 리뷰 이미지 -->
          <div v-if="review.reviewImage && review.reviewImage.length > 0" class="flex gap-2 overflow-x-auto pb-2">
            <div 
              v-for="(img, index) in review.reviewImage" 
              :key="index"
              class="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
              @click="openImageViewer(review.reviewImage, index)"
            >
              <img :src="img" :alt="`Review image ${index + 1}`" class="w-full h-full object-cover">
            </div>
          </div>

          <!-- 리뷰 내용 -->
          <p class="text-sm text-gray-800">{{ review.review }}</p>
        </div>
      </div>
      <div v-if="hasMore && !loading" class="flex justify-center mt-4">
        <button class="px-6 py-2 rounded bg-primary text-white font-bold" @click="loadMore">더보기</button>
      </div>
      <div v-if="loading" class="flex justify-center mt-4">
        <span>로딩중...</span>
      </div>

      <!-- Image Popup -->
      <ImagePopup 
        v-if="isImagePopupOpen"
        :is-open="isImagePopupOpen"
        :images="popupImages"
        :start-index="popupStartIndex"
        @close="closeImagePopup"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '~/components/common/NavigationBar.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ImagePopup from '~/components/common/ImagePopup.vue'
import Divider from '~/components/common/Divider.vue'

// 이미지 팝업 상태 및 함수
const isImagePopupOpen = ref(false)
const popupImages = ref<string[]>([])
const popupStartIndex = ref(0)

function openImageViewer(images: string[], startIndex: number) {
  popupImages.value = images
  popupStartIndex.value = startIndex
  isImagePopupOpen.value = true
}

function closeImagePopup() {
  isImagePopupOpen.value = false
  popupImages.value = []
  popupStartIndex.value = 0
}

definePageMeta({
  name: 'review_product'
})

const route = useRoute()
const productId = computed(() => Number(route.query.product_id))
const reviewType = computed(() => String(route.query.review_type || 'G'))
const errorMsg = ref('')

const reviews = ref<Product[]>([])
const page = ref(1)
const pageSize = 20
const hasMore = ref(true)
const loading = ref(false)
const reviewTotalCount = ref(0)
const reviewAverageRate = ref(0)

// 리뷰 데이터 fetch 함수
async function fetchReviews(reset = false) {
  if (loading.value || (!hasMore.value && !reset)) return
  loading.value = true
  try {
    const res = await $fetch('/api/review/product/list', {
      query: {
        product_id: productId.value,
        review_type: reviewType.value,
        page: page.value,
        pageSize
      }
    })
    reviewTotalCount.value = res.total
    reviewAverageRate.value = res.averageRating
    const newReviews = (res.reviews || []).map(r => ({
      id: r.product_id,
      productName: r.product_name,
      memberName: r.member_name,
      review: r.review_content,
      reviewRate: r.review_rate,
      reviewDate: r.review_date,
      reviewIdx: r.review_idx,
      reviewImage: r.review_image
    }))

    if (reset) {
      reviews.value = newReviews
    } else {
      reviews.value = reviews.value.concat(newReviews)
    }
    hasMore.value = newReviews.length === pageSize
  } catch (e) {
    // 오류 처리
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!productId.value) {
    errorMsg.value = '상품 ID가 없습니다.'
    return
  }
  fetchReviews(true)
})

// 더보기 버튼 클릭
const loadMore = () => {
  if (loading.value || !hasMore.value) return
  page.value += 1
  fetchReviews()
}

const getStars = (rating: number) => {
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


interface Product {
  reviewImage?: string[];
  id: number;
  productName: string;
  memberName: string;
  review: string; 
  reviewRate: number;
  reviewDate: string;
  reviewIdx: number;
}

</script>

<style>

</style>