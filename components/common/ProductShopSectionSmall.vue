<script setup lang="ts">
import SectionHeader from './SectionHeader.vue'
import imageNotFound from '~/assets/images/Image_not_found.png'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceWithRate } = useExchangeRate()

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;
}

interface Props {
  title: string;
  icon?: string;
  products: Product[];
  navigateUrl?: string;
  headerNavigateUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  navigateUrl: '/products',
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
    <div class="flex gap-2 overflow-x-auto pb-2">
      <div 
        v-for="product in products.slice(0, 3)" 
        :key="product.id"
        class="flex-shrink-0 w-[calc(33.333%-8px)] min-w-[120px] cursor-pointer"
        @click="navigateToProduct(product.id)"
      >
        <!-- 이미지 섹션 -->
        <div class="bg-[#F0F3F7] rounded-lg flex items-center justify-center mb-2">
          <img 
            :src="product.image || defaultImage" 
            :alt="product.name" 
            class="w-full h-full object-cover aspect-square"
          >
        </div>
        
        <!-- 정보 섹션 -->
        <div class="px-1">
          <h3 class="text-xs text-[#1A1A1A] font-bold truncate mb-1">{{ product.name }}</h3>
          <div class="text-sm text-[#1A1A1A] font-bold">
            {{ product.price > 0 ? formatPriceWithRate(product.price, locale) : $t('common.priceInquiry') }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
