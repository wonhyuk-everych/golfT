<template>
  <div>
    <NavigationBar mode="back_white" :show-bell="true" />

    <div class="w-full h-[340px] overflow-hidden">
      <img :src="`/images/category/city/${city.main_image}.jpg`" :alt="city.title" class="w-full h-full object-cover">
    </div>

    <div class="flex flex-col items-center gap-1 py-8 px-4 bg-white">
      <p class="font-pretendard font-bold text-base tracking-[-0.02em] text-[#1A1A1A] text-center">{{ city.sub_title }}</p>
      <h2 class="font-pretendard font-bold text-[28px] tracking-[-0.04em] text-[#1A1A1A] text-center leading-[1.5]">{{ city.title }}</h2>
    </div>

    <!-- 검색 섹션 -->
    <div class="flex items-center justify-center px-4">
      <div class="flex items-center gap-2 w-full px-4 py-3 bg-white border border-[#F0F3F7] rounded-[100px] shadow-sm">
        <img src="~/assets/icons/search.svg" :alt="$t('common.search')" class="w-[18px] h-[18px]">
        <input
          v-model="searchWord"
          type="text"
          :placeholder="$t('common.hotelSearchPlaceholder')"
          class="w-full font-pretendard text-sm tracking-[-0.02em] text-[#1A1A1A] placeholder:text-[#ACB2BA] outline-none bg-transparent"
          @input="handleSearch"
        >
      </div>
    </div>

    <ProductSearchSection 
      :products="city.product"
      navigate-url="/hotel"
    />

    <div v-if="city.total_count > currentSize" class="flex justify-center mt-6 mb-8 px-4">
      <button class="w-full py-3 bg-white border border-[#E5E8EB] rounded-[100px] font-pretendard text-sm text-[#1A1A1A] tracking-[-0.02em]"
        @click="loadMore"
      >
        {{ $t('common.more') }}
      </button>
    </div>
    
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import NavigationBar from '~/components/common/NavigationBar.vue'
import Footer from '~/components/common/Footer.vue'
import ProductSearchSection from '~/components/common/ProductSearchSection.vue'

definePageMeta({
  name: 'hotel-city'
})

const route = useRoute()
const code = route.params.id

const itemSize = ref(4)
const loadSize = ref(10)

const city = ref({})
const currentSize = ref(itemSize.value)
const searchWord = ref('')

// Debounce function to prevent too many API calls
const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

onMounted(async () => {
  callApi()
})

const callApi = async () => {
  try {
    const response = await $fetch(`/api/hotel/city/${code}`, {
      method: 'POST',
      body: {
        size: currentSize.value,
        searchWord: searchWord.value,
        filter: '',
        sort: ''
      }
    })
    if (response) {
      city.value = response
    }
  } catch (error) {
    console.error('Error fetching hotel city:', error)
  }
}

const loadMore = () => {
  currentSize.value += loadSize.value
  callApi()
}

// Debounced search handler
const handleSearch = debounce(() => {
  currentSize.value = itemSize.value // Reset size when searching
  callApi()
}, 300)
</script>

<style>

</style>