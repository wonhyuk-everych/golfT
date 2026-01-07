<template>
  <div class="min-h-screen">
    <!-- Fixed Header -->
    <NavigationBar mode="back_white" :show-bell="true" />

    <!-- Course Content -->
    <div v-if="course && !pending">
      <!-- Course Image Slider -->
      <ImageSlider :images="courseImages" />

      <!-- Course Info -->
      <Information :course="course" />

      <Divider :offset-px="0" />

      <!-- Course Review -->
      <ProductDetailReviewSection 
        :reviews="reviews" 
        :loading="isLoading"
        :product-id="course.id"
        :review-total-count="reivewTotalCount"
        :review-average-rate="reivewAverageRate"
        review-type="G"
        @view-all-reviews="navigateToAllReviews"
        @write-review="openReviewForm"
        @view-image="openImageGallery"
      />

      <Divider :offset-px="0" />

      <div class="px-4">
        <ProductShopSection
          title="이 골프장과 가까운 위치의 상품"
          :products="golfCourses"
          navigate-url="/course"
          header-navigate-url="/course"
        />
      </div>

      <Divider :offset-px="0" />

      <div class="px-4 mb-4">
        <ProductShopSection
          title="골프 T가 추천하는 BEST 30"
          :products="golfCourses"
          navigate-url="/course"
          header-navigate-url="/course"
        />
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-else-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen text-red-500">
      {{ error }}
    </div>
    
    <div class="flex justify-center items-center h-full w-full">
      <!-- Reservation Modal -->
      <transition name="slide-up">
        <div v-if="showReservationModal" class="fixed inset-0 bg-white z-50 flex flex-col h-full w-full max-w-[1024px] mx-auto">
          <div class="flex justify-between items-center p-4 border-b">
            <button class="text-gray-500 hover:text-gray-700" @click="closeReservationModal">
              <img src="~/assets/icons/back-black.svg" alt="close" class="w-[16px] h-[16px]">
            </button>
            <h3 v-if="!reservationComponent?.reservationSuccess" class="text-lg font-medium">예약하기</h3>
            <h3 v-else class="text-lg font-medium">예약완료</h3>
            <div class="w-6 h-6" />
          </div>
          <!-- modal content -->
          <div ref="reservationScrollArea" class="flex-grow overflow-y-auto">   
            <template v-if="!reservationComponent?.reservationSuccess">
              <img :src="course?.main_image_url || defaultImage" alt="golf main image" class="w-full object-cover max-h-[380px] sm:max-h-[460px] md:max-h-[520px]">
              <PriceInfo :course="course" />
            </template>
            <template v-else>
              <div class="text-center bg-primary text-white font-bold text-xl pt-4 pb-4">정상적으로 예약이 완료 되었습니다</div>
              <img :src="course?.main_image_url || defaultImage" alt="golf main image" class="w-full object-cover max-h-[380px] sm:max-h-[460px] md:max-h-[520px]">
              <div class="flex flex-col gap-2 w-full pl-8">
                <!-- 골프장 이름 -->
                <div class="flex flex-col w-full gap-0.5">
                  <h1 class="text-text-primary text-2xl w-full font-bold">{{ course.name_kr }}</h1>
                  <p class="text-text-secondary text-base w-full">{{ course.name_en }}</p>
                </div>
              </div>
            </template>
            
            <Divider :offset-px="0"/>

            <Reservation ref="reservationComponent" :course="course" @reservation-complete="reservationComplete()" @update:price="onPriceUpdate" />

            <Divider :offset-px="0"/>

            <div class="px-4 py-6">
              <ProductShopSection
                title="근처 호텔"
                :products="golfCourses"
                navigate-url="/course"
                header-navigate-url="/course"
              />
            </div>
          </div>
          <div class="p-4 border-t flex justify-end">
            <!-- 예약 전 버튼들 -->
            <template v-if="!reservationComponent?.reservationSuccess">
              <button class="px-4 py-2 border rounded-md mr-2" @click="closeReservationModal">취소</button>
              <button class="px-4 py-2 border rounded-md mr-2" @click="addToCart">장바구니</button>
              <button 
                class="px-4 py-2 bg-primary text-white rounded-md" 
                :disabled="isSubmitting"
                @click="submitReservation"
              >
                {{ isSubmitting ? '예약 중...' : '예약하기' }}
              </button>
            </template>
            
            <!-- 예약 완료 후 네비게이션 버튼 -->
            <template v-else>
              <button 
                class="flex-1 px-4 py-2 border border-primary text-primary rounded-md mr-2" 
                @click="navigateToMain"
              >
                메인 화면으로 이동
              </button>
              <button 
                class="flex-1 px-4 py-2 bg-primary text-white rounded-md" 
                @click="navigateToMyPage"
              >
                마이 페이지로 이동
              </button>
            </template>
          </div>
        </div>
      </transition>
    </div>
    <!-- Fixed Bottom Buttons -->
    <div v-if="!showReservationModal && course.booking_status === 'Y'" class="fixed bottom-0 left-0 right-0 flex w-full bg-white shadow-lg z-50 max-w-[1024px] mx-auto">
      <button class="flex-[1_1_35%] py-4 bg-[#6D747D] text-white font-medium" @click="openKakaoTalk">
        카카오톡 문의
      </button>
      <button class="flex-[1_1_65%] py-4 bg-primary text-white font-medium" @click="reserveCourse">
        상품 예약하기
      </button>
    </div>

    <Footer v-if="!showReservationModal" class="mb-16" />
  </div>

</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import ImageSlider from '~/components/common/ImageSlider.vue'
import Information from '~/components/course/Information.vue'
import PriceInfo from '~/components/course/PriceInfo.vue'
import Reservation from '~/components/course/Reservation.vue'
import NavigationBar from '~/components/common/NavigationBar.vue'
import ProductDetailReviewSection from '~/components/common/ProductDetailReviewSection.vue'
import { useFetch, definePageMeta, createError, showError } from '#imports'
import Footer from '~/components/common/Footer.vue'
import ProductShopSection from '~/components/common/ProductShopSection.vue'
import Divider from '~/components/common/Divider.vue'
import { useRecommendApi } from '~/composables/api/recommend'
import imageNotFound from '~/assets/images/Image_not_found.png'

const defaultImage = imageNotFound

interface Review {
  image?: string[];
  id: number;
  productName: string;
  review: string;
  reviewRate: number;
  reviewer: string;
  reviewDate?: Date;
}

const reviews = ref<Review[]>([])
const reivewTotalCount = ref<number>(0)
const reivewAverageRate = ref<number>(0)
const golfCourses = ref<GolfCourseInfo[]>([])

definePageMeta({
  name: 'course'
})

interface GolfCourseInfo {
  id: number
  name_kr: string
  name_en: string
  description: string
  course_holes: number
  course_par: number
  course_length: number
  course_info: string
  country_code: string
  region_code: string
  facility_info: string
  nearest_airport: string
  nearest_city: string
  airport_time: number
  city_time: number
  website: string
  address: string
  fax: string
  phone: string
  course_designer: string
  main_image_url: string
  course_image_url: string
  clubhouse_image_url: string
  restaurant_image_url: string
  shelter_image_url: string
  proshop_image_url: string
  description_image_url: string
  caddy_covenants: string
  caddy_rule: string
  rain_check: string
  gallery_fee: string
  review_count: number
  review_rating: number
  bart_price: number
  facilities: Array<{text: string, icon_name: string}>
  price: Price
  min_price: number
  wish_idx: number
  is_wished: number
  booking_status: string
}

interface Price {
  golf_monthly_price_idx: number
  caddy_sale_fee: number
  cart_sale_fee: number
  call_suv_one_way_fee: number
  call_suv_round_trip_fee: number
  call_van_one_way_fee: number
  call_van_round_trip_fee: number
  refund_policy: string
  cancel_policy: string
  price_time: PriceTime[]
  price_type: string
}

interface PriceTime {
  price_idx: number
  start_time: string
  end_time: string
  price: number
}

interface ApiResponse {
  success: boolean
  data?: GolfCourseInfo
  error?: string
}

const route = useRoute()
const courseId = route.params.id

// Image handling
const courseImages = computed(() => {
  if (!course.value) return []

  const images = [
    { url: course.value.main_image_url, label: '메인 이미지' },
    { url: course.value.course_image_url, label: '코스 전경' },
    { url: course.value.clubhouse_image_url, label: '클럽하우스' },
    { url: course.value.restaurant_image_url, label: '레스토랑' },
    { url: course.value.shelter_image_url, label: '쉐터' },
    { url: course.value.proshop_image_url, label: '프로샵' },
    { url: course.value.description_image_url, label: '설명 이미지' }
  ]

  // Add extra_images if available
  if (course.value.extra_images && Array.isArray(course.value.extra_images)) {
    const extraImages = course.value.extra_images.map((item: { image_url: string } | string) => ({
      url: typeof item === 'string' ? item : (item.image_url || ''),
      label: '이미지'
    }))
    images.push(...extraImages)
  }

  return images.filter(img => img.url && typeof img.url === 'string' && img.url.trim() !== '')
    .map(img => ({
      url: formatUrl(img.url),
      label: img.label
    }))
})

const { data: courseResponse, pending, error: _fetchError } = await useFetch<ApiResponse>(`/api/golf-course/${courseId}`)

const course = ref<GolfCourseInfo | null>(null)
const error = ref<string | null>(null)

try {
  // 코스 ID를 활용해 해당 코스의 리뷰만 조회 (composable 사용)
  const { getGolfReviews } = useRecommendApi()
  const { data: reviewData } = await getGolfReviews({ product_idx: courseId as string | number })
  type ReviewItem = { image?: string[]; id: number; productName: string; review: string; reviewRate: number; reviewer: string; reviewDate?: Date }
  type CourseReviewResponse = { reviews: ReviewItem[]; total: number; reviewAvg: number }
  if (reviewData.value) {
    const resp = reviewData.value as unknown as CourseReviewResponse
    if (Array.isArray(resp.reviews)) {
      reviews.value = resp.reviews.map((review: ReviewItem) => ({
        image: review.image && review.image.length > 0 ? review.image : [],
        id: review.id,
        productName: review.productName,
        review: review.review,
        reviewRate: review.reviewRate,
        reviewer: review.reviewer,
        reviewDate: review.reviewDate
      }))
      reivewTotalCount.value = resp.total
      reivewAverageRate.value = resp.reviewAvg
    }
  }
} catch (error) {
  console.error('Error fetching reviews:', error)
}

try {
  const params = {
    courseId: courseId,
    date: new Date().toISOString().split('T')[0]
  };
  // 실제 API 호출 (GET or POST, 여기서는 GET 예시)
  const response = await $fetch('/api/golf-course/price', {
    method: 'POST',
    body: JSON.stringify(params)
  });
  if (response && response.price !== undefined) {
    course.value.price = response.price;
  }
} catch (error) {
  console.error('가격 정보 API 호출 오류:', error);
}

try {
  const { getRecommendedGolfCourses } = useRecommendApi()
  const { data: courseListData } = await getRecommendedGolfCourses({ excludeId: courseId as string | number })
  if (courseListData.value) {
    type CourseItem = { id: number; name: string; location: string; price: string; isNew?: boolean; image: string }
    const resp = courseListData.value as unknown as { courses?: CourseItem[] }
    if (Array.isArray(resp.courses)) {
      golfCourses.value = resp.courses.map((course: CourseItem) => ({
        id: course.id,
        name: course.name,
        location: course.location,
        price: course.price,
        isNew: course.isNew,
        image: course.image
      }))
    }
  }
} catch (error) {
  console.error('Error fetching recommended golf courses:', error)
}

const formatUrl = (url: string) => {
  if (!url) return ''
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
}

// Button action handlers
const openKakaoTalk = () => {
  location.href = 'https://golft.channel.io/'
}

// Modal state for reservation form
const showReservationModal = ref(false)
const isSubmitting = ref(false)
const reservationComponent = ref(null)

// 예약 모달 열기
const reserveCourse = () => {
  showReservationModal.value = true
}

// 가격 변경 핸들러
const onPriceUpdate = (newPrice: Price) => {
  if (course.value) {
    course.value.price = newPrice;
  }
}

// 예약 모달 닫기
const closeReservationModal = () => {
  showReservationModal.value = false
}

// 장바구니에 추가
const addToCart = () => {
  if (reservationComponent.value) {
    reservationComponent.value.popupCartConfirm()
  }
}

// 예약 컴포넌트의 submitReservation 함수 호출
const submitReservation = async () => {
  if (reservationComponent.value) {
    try {
        await reservationComponent.value.submitReservation()
    } catch (error) {
        console.error('예약 중 오류:', error)
    }
  }
}

// 네비게이션 함수
const navigateToMain = () => {
  window.location.href = '/';
};

const navigateToMyPage = () => {
  window.location.href = '/profile';
};

const reservationScrollArea = ref(null);

const reservationComplete = () => {
  nextTick(() => {
    if (reservationScrollArea.value) {
      reservationScrollArea.value.scrollTop = 0;
    }
  });
}

watchEffect(() => {
  try {
    if (!pending.value) {
      if (courseResponse.value?.success && courseResponse.value.data) {
        course.value = courseResponse.value.data
      } else if (courseResponse.value) {
        const message = courseResponse.value.error || '잘못된 페이지입니다.'
        showError(createError({ statusCode: 404, statusMessage: message }))
      }
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '예기치 않은 오류가 발생했습니다.'
  }
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>