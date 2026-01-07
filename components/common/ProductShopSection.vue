<script setup lang="ts">
import SectionHeader from './SectionHeader.vue'
import imageNotFound from '~/assets/images/Image_not_found.png'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceWithRate } = useExchangeRate()

interface Product {
  id: number;
  name: string;
  location?: string;
  price: string;
  isNew?: boolean;
  image?: string;
  tags?: {
    type: string; // 'white' or 'blue'
    text: string;
  }[];
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
  icon: '⛳',
  maxItems: 6,
  navigateUrl: '/course',
  headerNavigateUrl: ''
})

const defaultImage = imageNotFound

const navigateToProduct = (productId: number) => {
  navigateTo(`${props.navigateUrl}/${productId}`);
};
</script>

<template>
  <section>
    <SectionHeader 
      :title="title"
      :icon="icon"
      :navigate-url="headerNavigateUrl"
    />

    <!-- 상품 리스트 -->
    <div class="grid grid-cols-2 gap-4">
      <div 
        v-for="product in products.slice(0, maxItems)" 
        :key="product.id"
        class="relative overflow-hidden cursor-pointer"
        @click="navigateToProduct(product.id)"
      >
        <!-- 이미지 섹션 -->
        <div class="relative h-[215px]">
          <img :src="product.image || defaultImage" :alt="product.name" class="w-full h-full object-cover">
          <div v-if="product.isNew" class="absolute top-2 left-2">
            <span class="bg-primary text-white text-xs px-2 py-1 rounded">NEW</span>
          </div>
        </div>
        
        <!-- 정보 섹션 -->
        <div class="bg-white pt-2">
          <div class="flex flex-col gap-2">
            <div v-if="product.location" class="flex items-center gap-2">
              <span class="text-xs text-text-secondary">{{ product.location }}</span>
            </div>
            <h3 class="text-base font-bold text-text-primary">{{ product.name }}</h3>
            <div class="flex items-center justify-between">
              <span v-if="product.price > 0" class="text-base font-bold text-text-primary">{{ formatPriceWithRate(product.price, locale) }}</span>
              <span v-else class="text-base font-bold text-text-primary">{{ $t('common.priceInquiry') }}</span>
            </div>
            <!-- 태그 리스트 -->
            <div v-if="product.tags && product.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
              <span 
                v-for="(tag, index) in product.tags" 
                :key="index"
                :class="[
                  'text-xs px-2 py-1 rounded-md border',
                  tag.type === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600 border-gray-200'
                ]"
              >
                {{ tag.text }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
