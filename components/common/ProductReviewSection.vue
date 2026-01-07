<script setup lang="ts">
import SectionHeader from './SectionHeader.vue'
import imageNotFound from '~/assets/images/Image_not_found.png'

interface Product {
  image?: string;
  id: number;
  productName: string;
  review: string; 
  reviewRate: number;
  reviewer: string;
  reviewDate: Date;
}

interface Props {
  title: string;
  icon?: string;
  products: Product[];
  maxItems?: number;
  navigateUrl?: string;
  headerNavigateUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: '💖',
  maxItems: 6,
  navigateUrl: '/course',
  headerNavigateUrl: ''
})

const navigateToProduct = (productId: number) => {
  navigateTo(`${props.navigateUrl}/${productId}`);
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

const defaultImage = imageNotFound
</script>

<template>
  <section>
    <SectionHeader 
      :title="props.title"
      :icon="props.icon"
      :navigate-url="props.headerNavigateUrl"
    />

    <!-- 상품 리스트 -->
    <div class="flex flex-col gap-4">
      <div 
        v-for="product in props.products.slice(0, props.maxItems)" 
        :key="product.id"
        class="flex gap-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
        @click="navigateToProduct(product.id)"
      >
        <!-- 이미지 섹션 -->
        <div class="relative w-[120px] h-[120px] rounded-lg overflow-hidden flex-shrink-0">
          <img :src="product.image || defaultImage" :alt="product.productName" class="w-full h-full object-cover">
        </div>
        
        <!-- 정보 섹션 -->
        <div class="flex flex-col flex-grow justify-between py-2">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <span class="text-sm text-text-secondary">{{ product.productName }}</span>
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
            <div class="text-sm text-text-secondary">{{ product.reviewer }} {{ $t('common.customer') }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
