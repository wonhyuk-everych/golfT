<template>
  <div class="min-h-screen">
    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />
    <!-- Fixed Header -->
    <NavigationBar mode="back_white" :show-bell="true" />

    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
    
    <div v-else-if="error" class="flex flex-col items-center justify-center h-screen p-4">
      <p class="text-red-500 text-lg font-semibold">{{ error }}</p>
      <button class="mt-4 px-4 py-2 bg-primary text-white rounded-lg" @click="fetchData">
        {{ $t('common.retry') }}
      </button>
    </div>

    <ImageSlider v-if="caddyData" :images="caddyImages" />

    <Information v-if="caddyData" :caddy="caddyData" />

    <Divider :offset-px="0" />

    <!-- Course Review -->
    <ProductDetailReviewSection 
        :reviews="reviews" 
        :loading="isLoading"
        :product-id="id"
        review-type="C"
        :review-total-count="reivewTotalCount"
        :review-average-rate="reivewAverageRate"
        @view-all-reviews="navigateToAllReviews"
        @write-review="openReviewForm"
        @view-image="openImageGallery"
      />
    
    <Divider :offset-px="0" />

    <div class="px-4 py-6">
      <ProductShopSection
        :title="$t('caddyInfo.relatedProducts')"
        :products="golfCourses"
        navigate-url="/course"
        header-navigate-url="/course"
      />
    </div>

    <div class="fixed bottom-0 left-0 right-0 flex w-full bg-white shadow-lg z-50 max-w-[1024px] mx-auto">
      <button class="flex-[1_1_35%] py-4 bg-[#6D747D] text-white font-medium" @click="openKakaoTalk">
        {{ $t('common.kakaoTalk') }}
      </button>
      <button class="flex-[1_1_65%] py-4 bg-primary text-white font-medium" @click="reserveCaddy">
        {{ $t('common.customerServiceCall') }}
      </button>
    </div>

    <!-- Reservation Popup Modal -->
    <div v-if="showReservationModal" class="fixed inset-0 flex items-center justify-center z-[100] px-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeReservationModal"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-[332px] flex flex-col rounded-lg overflow-hidden shadow-lg">
        <!-- Header -->
        <div class="bg-primary py-4 px-6">
          <div class="flex flex-col">
            <h3 class="text-white text-lg font-medium">{{ $t('caddyInfo.reserveCaddy') }}</h3>
          </div>
        </div>
        
        <!-- Content -->
        <div class="bg-white p-4 flex flex-col gap-4">
          <p class="text-center text-sm leading-6">
            {{ $t('caddyInfo.reserveCaddyMessage') }}
          </p>
          
          <!-- Buttons -->
          <div class="flex w-full gap-4">
            <button 
              @click="closeReservationModal" 
              class="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-md"
            >
            {{ $t('common.cancel') }}
            </button>
            <button 
              @click="addToCartHandler" 
              class="flex-1 py-3 bg-primary text-white font-medium rounded-md"
            >
              {{ $t('common.addToCart') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer class="mb-16" />
  </div>
</template>

<script lang="ts" setup>
import NavigationBar from '~/components/common/NavigationBar.vue'
import Information from '~/components/caddy/Information.vue'
import ImageSlider from '~/components/common/ImageSlider.vue'
import ProductDetailReviewSection from '~/components/common/ProductDetailReviewSection.vue'
import ProductShopSection from '~/components/common/ProductShopSection.vue'
import ToastMessage from '~/components/common/ToastMessage.vue'
import { ref } from 'vue'
import { useCaddyApi } from '~/composables/api/caddy/caddy'
import { useRecommendApi } from '~/composables/api/recommend'
import Footer from '~/components/common/Footer.vue'
import Divider from '~/components/common/Divider.vue'
import { createError, showError } from '#imports'

const { t } = useI18n()

const route = useRoute()
const id = route.params.id

definePageMeta({
  name: 'caddy'
})

interface Review {
  image?: string[];
  id: number;
  productName: string;
  review: string;
  reviewRate: number;
  reviewer: string;
  reviewDate?: Date;
}


const caddyData = ref(null)
const caddyImages = ref([{url: '', label: ''}])
const isLoading = ref(true)

// Toast 관련 상태
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const error = ref(null)

const reviews = ref<Review[]>([])
const reivewTotalCount = ref<number>(0)
const reivewAverageRate = ref<number>(0)

const golfCourses = ref<Product[]>([])
const showReservationModal = ref(false)

// useUserSession 추가
const { loggedIn } = useUserSession();

// API 컴포저블 사용
const { getCaddyDetail, getCaddyReviews, addToCart } = useCaddyApi();
const { getRecommendedGolfCourses } = useRecommendApi();

// 로그인 상태 확인 메소드
const checkLoginStatus = () => {
  if (!loggedIn.value) {
    showToast.value = true;
    toastMessage.value = t('common.loginRequired');
    toastType.value = 'warning';
    return false;
  }
  return true;
};

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // 컴포저블 사용하여 캐디 상세 정보 조회
    const { data, error: fetchError } = await getCaddyDetail(id)
    
    if (fetchError.value) {
      const message = '잘못된 페이지입니다.'
      showError(createError({ statusCode: 404, statusMessage: message }))
      return
    }
    
    if (!data.value || !data.value.success) {
      const message = data.value?.error || '잘못된 페이지입니다.'
      showError(createError({ statusCode: 404, statusMessage: message }))
      return
    }
    
    caddyData.value = data.value.data
    caddyImages.value = data.value.data.images.map((image: {image_url: string}) => ({
      url: image.image_url,
      label: '이미지'
    }))

  } catch (e) {
    error.value = 'Server error occurred.'
    console.error('Error fetching caddy data:', e)
  } finally {
    isLoading.value = false
  }
}

try {
  // 컴포저블 사용하여 캐디 리뷰 조회
  const { data: reviewData } = await getCaddyReviews(id)
  if (reviewData.value) {
    reviews.value = reviewData.value.reviews.map(review => ({
      image: review.image && review.image.length > 0 ? review.image : '',
      id: review.id,
      productName: review.productName,
      review: review.review,
      reviewRate: review.reviewRate,
      reviewer: review.reviewer,
      reviewDate: review.reviewDate
    }))
    reivewTotalCount.value = reviewData.value.total
    reivewAverageRate.value = reviewData.value.reviewAvg
  }
} catch (error) {
  console.error('Error fetching reviews:', error)
}

try {
  // 컴포저블 사용하여 추천 골프 코스 조회
  const { data: courseData } = await getRecommendedGolfCourses()
  if (courseData.value && courseData.value.courses) {
    golfCourses.value = courseData.value.courses.map(course => ({
      id: course.id,
      name: course.name,
      location: course.location,
      price: course.price,
      isNew: course.isNew,
      image: course.image
    }))
  }
} catch (error) {
  console.error('Error fetching recommended golf courses:', error)
}

// 초기 데이터 로드
fetchData()

// 예약 모달 관련 함수
const reserveCaddy = () => {
  showReservationModal.value = true
}

const closeReservationModal = () => {
  showReservationModal.value = false
}

const addToCartHandler = async () => {
  try{

    if (!checkLoginStatus()) {
      showReservationModal.value = false
      return;
    }

    const reservationData = {
      caddyIdx: id,
      totalPrice: caddyData.value.price,
    }

    // 컴포저블 사용하여 장바구니 추가 API 호출
    const { data, error: apiError } = await addToCart(reservationData);

    // 응답 처리
    if (apiError.value || !data.value?.success) {
      throw new Error(data.value?.message || 'Failed to add to cart');
    }
    
    // 성공 토스트 메시지 표시
    toastMessage.value = t('common.addToCart');
    toastType.value = 'success';
    showToast.value = true;
    closeReservationModal();
    
  } catch (error) {
    console.error('장바구니 추가 중 오류:', error);
    // 실패 토스트 메시지 표시
    toastMessage.value = t('common.addToCartError');
    toastType.value = 'error';
    showToast.value = true;
    closeReservationModal();
  }
}

const openKakaoTalk = () => {
  location.href = 'https://golft.channel.io/'
}
</script>

<style>

</style>