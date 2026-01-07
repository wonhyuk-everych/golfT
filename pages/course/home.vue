<template>
  <div>
    <NavigationBar mode="back_white" :show-bell="true" />

    <div class="relative">
      <MainBanner
        :title="$t('golf.banner.title')"
        :subtitle="$t('golf.banner.subtitle')"
        :description="$t('golf.banner.description')"
        image="/images/banner/golf-banner.png"
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
          :title="$t('golf.section.recommendation')"
          :products="golfCourses"
          max-items="6"
          navigate-url="/course"
          header-navigate-url="/course"
        />      
    </div>

    <Divider :offset-px="0" />

    <div class="px-4 mb-4">
      <ProductReviewSection
          :title="$t('golf.section.reviews')"
          :products="reviews"
          navigate-url="/course"
          header-navigate-url="/course"
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
import Divider from '~/components/common/Divider.vue'

definePageMeta({
  name: 'course-home'
})

const searchWord = ref('')

const navigateToSearch = () => {
  navigateTo({
    path: '/search',
    query: {
      type: 'golf'
    }
  })
}

const { t } = useI18n()

const categories = [
  { id: 1, icon: 'golf/category_bangkok.png', name: t('category.bangkok'), link: '/course/city/bkk', overflow: true },
  { id: 2, icon: 'golf/category_pataya.png', name: t('category.pattaya'), link: '/course/city/utp', overflow: true },
  { id: 3, icon: 'golf/category_puket.png', name: t('category.phuket'), link: '/course/city/hkt', overflow: true },
  { id: 4, icon: 'golf/category_chiangmyi.png', name: t('category.chiangmai'), link: '/course/city/cnx', overflow: true },
  { id: 5, icon: 'golf/category_huahin.png', name: t('category.huahin'), link: '/course/city/hhq', overflow: true },
  { id: 6, icon: 'golf/category_cab.jpg', name: t('category.kanchanaburi'), link: '/course/city/cab', overflow: true },
  { id: 7, icon: 'golf/category_cyy.jpg', name: t('category.khaoyai'), link: '/course/city/cyy', overflow: true },
  
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
}

interface Review {
  image?: string | 'https://golft.co.kr/file_data/golftt/gallery/2022/10/20/e42f06d381fa41410d5a35ece3710643.jpg';
  id: number;
  productName: string;
  review: string;
  reviewRate: number;
  reviewer: string;
  reviewDate: Date;
}

const golfCourses = ref<Product[]>([])
const reviews = ref<Review[]>([])
const { getRecommendedGolfCourses, getGolfReviews } = useRecommendApi()

try {
  const { data, error } = await getRecommendedGolfCourses({ limit: 6 })
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
  console.error(t('error.fetchCourses'), error)
}

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
</script>

<style>

</style>