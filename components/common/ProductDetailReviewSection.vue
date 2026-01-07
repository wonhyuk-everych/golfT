<template>
  <div class="review-section mt-6 px-4">
    <!-- 리뷰 섹션 헤더 -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-base font-bold">⛳ 리뷰
        <span v-if="reviewTotalCount > 0" class="text-base text-gray-500 ml-2">({{ reviewTotalCount }}개의 리뷰)</span>
      </h2>

      <span class="ml-1">
        <button @click="navigateToReview()">
          <img src="~/assets/icons/arrow-right.svg" alt="arrow-right" class="w-[16px] h-[16px]">
        </button>
      </span>
    </div>

    <!-- 리뷰 평점 요약 -->
    <div v-if="reviewTotalCount > 0" class="bg-white rounded-lg p-4 mb-4">
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

    <!-- 리뷰 목록 -->
    <div v-if="reviewTotalCount > 0" class="review-list space-y-4">
      <div 
        v-for="review in displayedReviews" 
        :key="review.id"
        class="bg-white rounded-lg"
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
                <span class="font-medium text-base font-bold">{{ review.reviewer }}</span>
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
                <span class="text-base text-text-secondary">{{ formatDate(review.reviewDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 리뷰 이미지 -->
        <div v-if="review.image && review.image.length > 0" class="flex gap-2 overflow-x-auto pb-2">
          <div 
            v-for="(img, index) in review.image" 
            :key="index"
            class="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
            @click="openImageViewer(review.image, index)"
          >
            <img :src="img" :alt="`Review image ${index + 1}`" class="w-full h-full object-cover">
          </div>
        </div>

        <!-- 리뷰 내용 -->
        <p class="text-sm text-gray-800">{{ review.review }}</p>
      </div>
    </div>

    <!-- 리뷰가 없을 때 -->
    <div v-else-if="!loading" class="bg-white rounded-lg p-8 text-center">
      <div class="text-gray-500 mb-2">아직 리뷰가 없습니다</div>
      <!--<button 
        v-if="showWriteButton"
        class="px-4 py-2 bg-primary text-white rounded-lg font-medium mt-2"
        @click="$emit('write-review')"
      >
        첫 리뷰 작성하기
      </button>-->
    </div>

    <!-- 로딩 상태 -->
    <div v-else class="bg-white rounded-lg p-4 text-center">
      <div class="text-gray-500">리뷰를 불러오는 중...</div>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const showReviewPopup = ref(false)

interface Review {
  id: number;
  productName?: string;
  review: string;
  reviewRate: number;
  reviewer: string;
  image?: string[];
  reviewDate: Date;
}

interface Props {
  productId: number;
  reviewType: string;
  reviews?: Review[];
  loading?: boolean;
  reviewTotalCount?: number;
  reviewAverageRate?: number;
  showAllButton?: boolean;
  showWriteButton?: boolean;
  initialDisplayCount?: number;
  showAllReviews?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  reviews: () => [],
  loading: false,
  reviewTotalCount: 0,
  reviewAverageRate: 0,
  showAllButton: true,
  showWriteButton: true,
  initialDisplayCount: 5,
  showAllReviews: false
})

const emit = defineEmits(['view-all-reviews', 'write-review', 'view-image'])

// 표시할 리뷰 수 관리
const displayCount = ref(props.initialDisplayCount)

// 표시할 리뷰 목록
const displayedReviews = computed(() => {
  if (props.showAllReviews) return props.reviews
  return props.reviews.slice(0, displayCount.value)
})

// 별점 표시 계산 함수
const getStars = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  // 꽉 찬 별
  for (let i = 0; i < fullStars; i++) {
    stars.push('full')
  }

  // 반 별
  if (hasHalfStar) {
    stars.push('half')
  }

  // 빈 별
  while (stars.length < 5) {
    stars.push('empty')
  }

  return stars
}

// 날짜 포맷팅
const formatDate = (date: Date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

// 이미지 뷰어 열기
const openImageViewer = (images: string[], startIndex: number) => {
  emit('view-image', { images, startIndex })
}

const navigateToReview = () => {
  navigateTo(`/review/product?product_id=${props.productId}&review_type=${props.reviewType}`)
}
</script>

<style scoped>
.review-section {
  max-width: 100%;
}

.review-list {
  max-height: 100%;
  overflow-y: auto;
}

/* 스크롤바 스타일링 */
.review-list::-webkit-scrollbar {
  width: 4px;
}

.review-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.review-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.review-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>