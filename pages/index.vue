<template>
  <main>

    <div class="mt-[65px] w-full">
      <MainBannerScroll />
    </div>

    <CategorySection :categories="categories" />

    <ImageBanner :images="images" />

    <Divider :offset-px="0" />

    <div class="px-4">
      <ProductShopSection
        :title="$t('section.recommendation')"
        :products="golfCourses"
        navigate-url="/course"
        header-navigate-url="/course"
      />
    </div>

    <Divider :offset-px="0" />

    <div class="px-4">
      <ProductShopSectionSmall
        :title="$t('hotel.section.recommendation')"
        :products="hotels" 
        navigate-url="/hotel"
        header-navigate-url="/hotel"
      />
    </div>

    <Divider :offset-px="0" />

    <div class="px-4 mb-4">
      <ProductReviewSection
        :title="$t('section.reviews')"
        :products="reviews"
        navigate-url="/course"
        header-navigate-url="/course"
      />
    </div>

    <Footer />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CategorySection from '~/components/common/CategorySection.vue'
import { useI18n } from 'vue-i18n'
import MainBannerScroll from '~/components/common/MainBannerScroll.vue'
import ImageBanner from '~/components/common/ImageBanner.vue'
import ProductShopSection from '~/components/common/ProductShopSection.vue'
import ProductShopSectionSmall from '~/components/common/ProductShopSectionSmall.vue'
// YoutubeSection removed as it's not being used
import Footer from '~/components/common/Footer.vue'
import ProductReviewSection from '~/components/common/ProductReviewSection.vue'
import { useRecommendApi } from '~/composables/api/recommend'
import Divider from '~/components/common/Divider.vue'

interface Product {
  id: number;
  name: string;
  location?: string;
  price: string;
  isNew?: boolean;
  image?: string;
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

const { t } = useI18n()
const reviews = ref<Review[]>([])
const { getRecommendedGolfCourses, getRecommendedHotels, getGolfReviews } = useRecommendApi()

const categories: Category[] = [
  { id: 1, icon: 'category_golf.png', name: t('category.golf'), link: '/course/home' },
  { id: 2, icon: 'category_hotel.png', name: t('category.hotel'), link: '/hotel/home' },
  { id: 3, icon: 'category_car.png', name: t('category.car'), link: 'https://roundt.triseup.com/' },
  { id: 4, icon: 'category_caddy.png', name: t('category.caddy'), link: '/caddy/home' },
  { id: 5, icon: 'category_event.png', name: t('category.community'), link: '/community' },
  { id: 6, icon: 'category_shopping.png', name: t('category.shopping'), link: '' },
  { id: 7, icon: 'category_tournament.png', name: t('category.tournament'), link: '/tournament' },
  { id: 8, icon: 'category_best30.png', name: t('category.best30'), link: '/best30' }
];

const images = [
  '/images/banner/sub_banner_1.png',
  '/images/banner/sub_banner_2.png',
  '/images/banner/sub_banner_3.png',
  '/images/banner/sub_banner_t_2.png',
]

const golfCourses = ref<Product[]>([])
const hotels = ref<Product[]>([])

try {
  const { data, error } = await getGolfReviews()
  if (error.value) throw error.value
  if (data.value && data.value.reviews) {
    reviews.value = data.value.reviews.map(review => ({
      image: review.image && review.image.length > 0 ? review.image[0] : '',
      id: review.id,
      productName: review.productName,
      review: review.review,
      reviewRate: review.reviewRate,
      reviewer: review.reviewer,
      reviewDate: review.reviewDate
    }))
  }
} catch (error) {
  console.error(t('error.fetchReviews'), error)
}

try {
  const { data, error } = await getRecommendedGolfCourses()
  if (error.value) throw error.value
  if (data.value && data.value.courses) {
    golfCourses.value = data.value.courses.map(course => ({
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
  const { data, error } = await getRecommendedHotels()
  if (error.value) throw error.value
  if (data.value && data.value.items) {
    hotels.value = data.value.items.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      price: hotel.price,
      isNew: hotel.isNew,
      image: hotel.image
    }))
  }
} catch (error) {
  console.error('Error fetching recommended hotels:', error)
}
</script>

<style scoped>
</style>