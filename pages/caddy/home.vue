<template>
  <div>
    <NavigationBar mode="back_white" :show-bell="true" />

    <div class="relative">
      <MainBanner
        :title="$t('caddy.banner.title')"
        :subtitle="$t('caddy.banner.subtitle')"
        :description="$t('caddy.banner.description')"
        image="/images/banner/caddy-banner.png"
      />

      <div class="absolute -bottom-5 left-0 right-0 px-4">
        <div 
          class="flex items-center gap-2 w-full px-4 py-3 bg-white border border-[#F0F3F7] rounded-[100px] shadow-sm cursor-pointer"
          @click="navigateToSearch"
        >
          <img src="~/assets/icons/search.svg" :alt="$t('common.search')" class="w-[18px] h-[18px]">
          <input
            v-model="searchWord"
            type="text"
            :placeholder="$t('common.searchPlaceholder')"
            class="w-full font-pretendard text-sm tracking-[-0.02em] text-[#1A1A1A] placeholder:text-[#ACB2BA] outline-none bg-transparent cursor-pointer"
            readonly
          >
        </div>
      </div>
    </div>

    <CategorySection :categories="categories" />

    <ImageBanner :images="images" />

    <Divider :offset-px="0" />

    <div class="px-4">
      <ProductShopSection
          :title="$t('caddy.section.recommendation')"
          :products="caddyList"
          navigate-url="/caddy"
          header-navigate-url="/caddy"
        />
    </div>

    <Divider :offset-px="0" />

    <div class="px-4 mb-4">
      <ProductReviewSection
          :title="$t('caddy.section.reviews')"
          :products="reviews"
          navigate-url="/caddy"
          header-navigate-url="/caddy"
        />
    </div>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import NavigationBar from '~/components/common/NavigationBar.vue'
import MainBanner from '~/components/common/MainBanner.vue'
import CategorySection from '~/components/common/CategorySection.vue'
import ImageBanner from '~/components/common/ImageBanner.vue'
import ProductShopSection from '~/components/common/ProductShopSection.vue'
import ProductReviewSection from '~/components/common/ProductReviewSection.vue'
import YoutubeSection from '~/components/common/YoutubeSection.vue'
import Footer from '~/components/common/Footer.vue'
import { useRecommendApi } from '~/composables/api/recommend'
import { useCaddyApi } from '~/composables/api/caddy/caddy'
import Divider from '~/components/common/Divider.vue'

definePageMeta({
  name: 'caddy-home'
})

const searchWord = ref('')

const navigateToSearch = () => {
  navigateTo({
    path: '/search',
    query: {
      type: 'caddy'
    }
  })
}

const { t } = useI18n()

const categories = [
  { id: 1, icon: 'golf/category_bangkok.png', name: t('category.bangkok'), link: '/caddy/city/bkk', overflow: true },
  { id: 2, icon: 'golf/category_pataya.png', name: t('category.pattaya'), link: '/caddy/city/utp', overflow: true },
  { id: 3, icon: 'golf/category_puket.png', name: t('category.phuket'), link: '/caddy/city/hkt', overflow: true },
  { id: 4, icon: 'golf/category_chiangmyi.png', name: t('category.chiangmai'), link: '/caddy/city/cnx', overflow: true },
  { id: 5, icon: 'golf/category_huahin.png', name: t('category.huahin'), link: '/caddy/city/hhq', overflow: true },
  { id: 6, icon: 'golf/category_cab.jpg', name: t('category.kanchanaburi'), link: '/caddy/city/cab', overflow: true },
  { id: 7, icon: 'golf/category_cyy.jpg', name: t('category.khaoyai'), link: '/caddy/city/cyy', overflow: true },
  { id: 8, icon: 'golf/category_kbv.jpg', name: t('category.krabi'), link: '/caddy/city/kbv', overflow: true },
]

const images = [
  '/images/banner/sub_banner_1.png',
  '/images/banner/sub_banner_2.png',
  '/images/banner/sub_banner_3.png',
]

interface Product {
  id: number;
  name: string;
  location?: string;
  price: string;
  isNew?: boolean;
  image?: string;
  tags?: {
    type: 'blue' | 'gray';
    text: string;
  }[];
}

interface Review {
  image?: string;
  id: number;
  productName: string;
  review: string;
  reviewRate: number;
  reviewer: string;
  reviewDate: Date;
}

const caddyList = ref<Product[]>([])
const reviews = ref<Review[]>([])

// API 컴포저블 초기화
const { getRecommendedCaddies } = useRecommendApi()
const { getCaddyReviews } = useCaddyApi()

try {
    // 추천 캐디 목록 가져오기
  const { data: caddyData, error: caddyError } = await getRecommendedCaddies()
  
  if (caddyError.value) {
    throw new Error('Failed to fetch recommended caddies')
  }
  
  if (caddyData.value && caddyData.value.caddies) {
    caddyList.value = caddyData.value.caddies.map(caddy => ({
      id: caddy.id,
      name: caddy.name,
      location: caddy.location,
      price: caddy.price,
      image: caddy.image,
      tags: [
        {
          type: 'white',
          text: caddy.golfCourseName
        }
      ]
    }))
  }
} catch (error) {
  console.error(t('error.fetchCourses'), error)
}

try {
  // 캐디 리뷰 가져오기
  const { data: reviewData, error: reviewError } = await getCaddyReviews('')
  
  if (reviewError.value) {
    throw new Error('Failed to fetch caddy reviews')
  }
  
  if (reviewData.value && reviewData.value.reviews) {
    reviews.value = reviewData.value.reviews.map(review => ({
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
</script>

<style>

</style>