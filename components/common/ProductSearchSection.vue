<script setup lang="ts">
import type { SearchProduct } from '~/server/api/golf-course/types'
import imageNotFound from '~/assets/images/Image_not_found.png'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()

const { formatPriceWithRate } = useExchangeRate()

const defaultImage = imageNotFound

interface Props {
  products: SearchProduct[];
  navigateUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  navigateUrl: '',
})

const navigateToProduct = (productId: number) => {
  navigateTo(`${props.navigateUrl}/${productId}`);
};
</script>

<template>
  <section>
    <!-- 상품 리스트 -->
    <div class="grid grid-cols-2 gap-4 px-4 py-6">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="relative overflow-hidden cursor-pointer"
        @click="navigateToProduct(product.id)"
      >      
      <!-- 이미지 섹션 -->
        <div class="relative h-[215px]">
          <img :src="product.image || defaultImage" :alt="product.name" class="w-full h-full object-cover">
        </div>

        <!-- 정보 섹션 -->
        <div class="bg-white mt-2">
          <div class="flex flex-col gap-2">
            <div v-if="product.location" class="flex items-center gap-2">
              <span class="text-xs text-text-secondary">{{ product.location }}</span>
            </div>
            <h3 class="text-base font-bold text-text-primary">{{ product.name }}</h3>
            <div class="flex items-center justify-between">
              <span v-if="product.price > 0" class="text-base font-bold text-text-primary">{{ formatPriceWithRate(product.price, locale) }}</span>
              <span v-else class="text-base font-bold text-text-primary">{{ $t('common.priceInquiry') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
