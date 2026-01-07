<template>
  <div class="min-h-screen bg-white flex flex-col">
    <NavigationBar mode="back_title" :show-bell="false" :title="'BEST 30'" back-color="black"/>
    <div class="px-4 mt-[85px]">
      <div class="grid grid-cols-2 gap-4">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="relative overflow-hidden cursor-pointer"
          @click="navigateToProduct(product.type, product.id)"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavigationBar from '~/components/common/NavigationBar.vue'
import { useRecommendApi } from '~/composables/api/recommend'
import imageNotFound from '~/assets/images/Image_not_found.png'
import { useI18n } from 'vue-i18n'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { formatPriceWithRate } = useExchangeRate()

const { locale } = useI18n()
const { t } = useI18n()

definePageMeta({ name: 'best30' })

const { getBest30 } = useRecommendApi()

const products = ref<Product[]>([])

interface Product {
  id: number;
  name: string;
  location?: string;
  price: number;
  isNew?: boolean;
  image?: string;
  type: 'golf' | 'hotel' | 'caddy';
  courseId?: number;
  golfCourseName?: string;
  tags?: Array<{text: string; type: string}>;
}

try {
  const { data, error } = await getBest30()
  if (error.value) throw error.value
  if (data.value && data.value.items) {
    products.value = data.value.items
  }
} catch (error) {
  console.error('Error fetching best30 recommendations:', error)
}

const defaultImage = imageNotFound

const navigateToProduct = (type: string, productId: number) => {
  switch(type) {
    case 'golf':
      navigateTo(`/course/${productId}`);
      break;
    case 'hotel':
      navigateTo(`/hotel/${productId}`);
      break;
    case 'caddy':
      navigateTo(`/caddy/${productId}`);
      break;
    default:
      console.error('Unknown product type:', type);
  }
};
</script>

<style>

</style>