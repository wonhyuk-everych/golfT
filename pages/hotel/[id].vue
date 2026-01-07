<template>
  <div class="min-h-screen">
    <!-- Fixed Header -->
    <NavigationBar mode="back_white" :show-bell="true" />

    <!-- Hotel Content -->
    <div v-if="hotel && !pending">
      <!-- Hotel Image Slider -->
      <ImageSlider :images="hotelImages" />

      <!-- Hotel Info -->
      <Information :hotel="hotel" />

      <Divider :offset-px="0" />

      <!-- Course Review -->
      <ProductDetailReviewSection 
        :reviews="reviews" 
        :loading="isLoading"
        :review-total-count="reivewTotalCount"
        :review-average-rate="reivewAverageRate"
        :product-id="hotelId"
        review-type="H"
        @view-all-reviews="navigateToAllReviews"
        @write-review="openReviewForm"
        @view-image="openImageGallery"
      />

      <Divider :offset-px="0" />

      <div class="px-4">
        <ProductShopSection
          title="이 숙소는 어떠세요?"
          :products="hotelRecommend"
          navigate-url="/hotel"
          header-navigate-url="/hotel"
        />
      </div>

      <Divider :offset-px="0" />

      <div class="px-4 mb-4">
        <ProductShopSection
          title="호텔과 가까운 골프장"
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

    <!-- reservation popup -->
    <div class="flex justify-center items-center h-full w-full">
      <!-- Reservation Modal -->
      <transition name="slide-up">
        <div v-if="showReservationModal" class="fixed inset-0 bg-white z-50 flex flex-col h-full w-full max-w-[1024px] mx-auto">
          <div class="flex justify-between items-center p-4 border-b">
            <button class="text-gray-500 hover:text-gray-700" @click="closeReservationModal">
              <img src="~/assets/icons/back-black.svg" alt="close" class="w-[16px] h-[16px]">
            </button>
            <h3 class="text-lg font-medium">예약하기</h3>
            <div class="w-6 h-6" />
          </div>
          <!-- modal content -->
          <div class="flex-grow overflow-y-auto">
            <!-- 호텔 룸 선택 -->
            <div v-if="!showPaymentSection" class="reservation-find-room">
              <img
                :src="hotel?.main_image || defaultImage"
                alt="golf main image"
                class="w-full object-cover max-h-[380px] sm:max-h-[460px] md:max-h-[520px]"
              >
              <PriceInfo :hotel="hotel" />
              <CheckIn :hotel="hotel" @select-room="proceedToPayment" />

              <Divider :offset-px="0"/>

              <div class="px-4">
                <ProductShopSection
                  title="추천 호텔"
                  :products="hotelRecommend"
                  navigate-url="/hotel"
                  header-navigate-url="/hotel"
                />
              </div>
            </div>
            <!-- 결제 페이지 -->
            <div v-if="showPaymentSection" class="reservation-pay-room">
              <Reservation 
                :hotel="hotel" 
                :check-in-date="checkInDate" 
                :check-out-date="checkOutDate" 
                :selected-room="selectedRoom" 
                :adult="adult" 
                :children="children"
                :room-count="roomCount"
                :paid-services="hotel?.paid_services"
                @back="backToRoomSelection"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Fixed Bottom Buttons -->
    <div v-if="!showReservationModal" class="fixed bottom-0 left-0 right-0 flex w-full bg-white shadow-lg z-50 max-w-[1024px] mx-auto">
      <button class="flex-[1_1_35%] py-4 bg-[#6D747D] text-white font-medium" @click="openKakaoTalk">
        카카오톡 문의
      </button>
      <button class="flex-[1_1_65%] py-4 bg-primary text-white font-medium" @click="reserveHotel">
        객실 예약하기
      </button>
    </div>

    <Footer v-if="!showReservationModal" class="mb-16" />
  </div>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import ImageSlider from '~/components/common/ImageSlider.vue'
import NavigationBar from '~/components/common/NavigationBar.vue'
import Footer from '~/components/common/Footer.vue'
import { useFetch, definePageMeta, createError, showError } from '#imports'
import Information from '~/components/hotel/Information.vue'
import ProductDetailReviewSection from '~/components/common/ProductDetailReviewSection.vue'
import ProductShopSection from '~/components/common/ProductShopSection.vue'
import PriceInfo from '~/components/hotel/PriceInfo.vue'
import CheckIn from '~/components/hotel/CheckIn.vue'
import Reservation from '~/components/hotel/Reservation.vue'
import { useRecommendApi } from '~/composables/api/recommend'
import Divider from '~/components/common/Divider.vue'
import imageNotFound from '~/assets/images/Image_not_found.png'

const defaultImage = imageNotFound
const { currentLocale } = useLocalization()

definePageMeta({
  name: 'hotel'
})

interface HotelRoom {
  room_name: string;
  room_name_en: string;
  room_sale_price: number;
  room_image_url: string;
  bed_type: string;
  view_type: string;
  refund_yn: string;
  breakfast_yn: string;
  room_images: string[];
}

interface HotelImage {
  image_url: string;
}

interface HotelPaidService {
  hotel_paid_service_idx: number;
  service_name: string;
  service_name_en: string;
  price: number;
}

interface HotelInfo {
  hotel_idx: number;
  name_kr: string;
  name_en: string;
  explain_hotel: string;
  explain_short: string;
  country_code: string;
  city_code: string;
  check_in: string;
  check_out: string;
  address: string;
  home_page: string;
  pay_info: string;
  refund_info: string;
  service_info: string;
  rooms: HotelRoom[];
  images: HotelImage[];
  main_image: string;
  image: string;
  price: number;
  rating: number;
  review_count: number;
  check_info: string;
  bart_price: number;
  tour: string;
  transportation: string;
  language: string;
  room_type: string;
  room_facility: string;
  extra_charge: string;
  caution: string;
  hotel_facilities: string[];
  room_facilities: string[];
  extra_options: string[];
  paid_services: HotelPaidService[];
  is_wished: boolean;
  wish_idx: number;
  hotel_facility_info: string;
  room_facility_info: string;
}

interface ApiResponse {
  success: boolean;
  data?: HotelInfo;
  error?: string;
}

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

const golfCourses = ref<Product[]>([])
const hotelRecommend = ref<Product[]>([])

const route = useRoute()
const hotelId = route.params.id

// Modal state for reservation form
const showReservationModal = ref(false)
const isSubmitting = ref(false)
const showPaymentSection = ref(false)

// Reservation data
const checkInDate = ref(new Date())
const checkOutDate = ref(new Date(new Date().setDate(new Date().getDate() + 1)))
const adult = ref(2)
const children = ref(0)
const selectedRoom = ref(null)
const reservationComponent = ref(null)
const roomCount = ref(1)

// API 호출
const { data, pending, error } = await useFetch<ApiResponse>(`/api/hotel/${hotelId}`, {
  method: 'GET'
})

const hotel = computed(() => data.value?.data)

// 호텔 정보가 없거나 API에서 실패로 응답한 경우 에러 페이지로 안내
watchEffect(() => {
  if (!pending.value && data.value && data.value.success === false) {
    const message = data.value.error || '잘못된 페이지입니다.'
    showError(createError({ statusCode: 404, statusMessage: message }))
  }
})

// 이미지 처리
const hotelImages = computed(() => {
  if (!hotel.value) return []

  const images = [
    { url: hotel.value.main_image, label: '메인 이미지' },
    ...hotel.value.images.map((img, index) => ({
      url: img.image_url,
      label: `호텔 이미지 ${index + 1}`
    }))
  ]

  return images.filter(img => img.url && typeof img.url === 'string' && img.url.trim() !== '')
})

// 카카오톡 문의
const openKakaoTalk = () => {
  // 카카오톡 채널 URL
  location.href = 'https://golft.channel.io/'
}

// 호텔 예약
const reserveHotel = () => {
  showReservationModal.value = true
  showPaymentSection.value = false
}

// Function to proceed to payment section
const proceedToPayment = (data) => {
  // Extract data from the emitted event
  selectedRoom.value = data.room
  checkInDate.value = data.checkinDate
  checkOutDate.value = data.checkoutDate
  adult.value = data.adult
  children.value = data.children
  roomCount.value = data.roomCount
  
  showPaymentSection.value = true
}

// 예약 모달 닫기
const closeReservationModal = () => {
  if(showPaymentSection.value) {
    backToRoomSelection()
    return
  }
  showReservationModal.value = false
}

// 객실 선택으로 돌아가기
const backToRoomSelection = () => {
  showPaymentSection.value = false
}

// 예약 컴포넌트의 submitReservation 함수 호출
const submitReservation = async () => {
  if (reservationComponent.value) {
    isSubmitting.value = true
    try {
        await reservationComponent.value.submitReservation()
    } catch (error) {
        console.error('예약 중 오류:', error)
    } finally {
      isSubmitting.value = false
    }
  }
}

try {
  // 리뷰 조회 (composable 사용)
  const { getHotelReviews } = useRecommendApi()
  const { data: reviewData } = await getHotelReviews({ product_idx: hotelId as string | number })
  if (reviewData.value && reviewData.value.reviews) {
    type ReviewItem = { image?: string[]; id: number; productName: string; review: string; reviewRate: number; reviewer: string; reviewDate?: Date }
    type HotelReviewResponse = { reviews: ReviewItem[]; total: number; reviewAvg: number }
    const resp = reviewData.value as unknown as HotelReviewResponse
    reviews.value = resp.reviews.map((review: ReviewItem) => ({
      image: review.image && review.image.length > 0 ? review.image : [],
      id: review.id,
      productName: review.productName,
      review: review.review,
      reviewRate: review.reviewRate,
      reviewer: review.reviewer,
      reviewDate: review.reviewDate
    }))
    reivewTotalCount.value = resp.total ?? 0
    reivewAverageRate.value = resp.reviewAvg ?? 0
  }
} catch (error) {
  console.error('Error fetching reviews:', error)
}

try {
  // 추천 골프장 (composable 사용)
  const { getRecommendedGolfCourses } = useRecommendApi()
  const { data: courseData } = await getRecommendedGolfCourses()
  if (courseData.value && courseData.value.courses) {
    golfCourses.value = courseData.value.courses.map((course: { id: number; name: string; location: string; price: string; isNew?: boolean; image: string }) => ({
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

try {
  // 추천 호텔 (composable 사용, 현재 호텔 제외)
  const { getRecommendedHotels } = useRecommendApi()
  const { data: hotelData } = await getRecommendedHotels({ excludeId: hotelId as string | number })
  if (hotelData.value && hotelData.value.items) {
    hotelRecommend.value = hotelData.value.items.map((hotel: { id: number; name: string; cityCode: string; price: string; isNew?: boolean; image: string }) => ({
      id: hotel.id,
      name: hotel.name,
      location: hotel.cityCode,
      price: hotel.price,
      isNew: hotel.isNew,
      image: hotel.image
    }))
  }
} catch (error) {
  console.error('Error fetching recommended hotels:', error)
}
</script>

<style>
</style>