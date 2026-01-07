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
          :placeholder="$t('golf.city.searchPlaceholder')"
          class="w-full font-pretendard text-sm tracking-[-0.02em] text-[#1A1A1A] placeholder:text-[#ACB2BA] outline-none bg-transparent"
          @input="handleSearch"
        >
      </div>
    </div>
    
    <!-- 정렬 및 필터 섹션 -->
    <div class="px-4 mt-4 pt-3">
      <!-- 정렬 옵션 -->
      <div class="flex justify-end mb-3 relative">
        <div 
          class="flex items-center gap-2 cursor-pointer sort-dropdown" 
          @click="showSortOptions = !showSortOptions"
        >
          <img src="~/assets/icons/sort-icon.svg" :alt="$t('search.sort')" class="w-[18px] h-[18px]">
          <span class="text-xs text-[#ACB2BA]">{{ selectedSort.label }}</span>
        </div>
        
        <!-- 정렬 드롭다운 -->
        <div 
          v-if="showSortOptions" 
          class="absolute z-10 top-8 right-0 bg-white rounded-lg shadow-md p-2 border border-[#E5E8EB] w-40 sort-dropdown"
        >
          <div 
            v-for="option in sortOptions" 
            :key="option.value" 
            class="py-2 px-3 text-sm hover:bg-gray-100 cursor-pointer rounded-md"
            :class="{'font-bold text-[#1A1A1A]': selectedSort.value === option.value, 'text-[#6D747D]': selectedSort.value !== option.value}"
            @click="selectSortOption(option)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
      
      <!-- 필터 옵션 -->
      <div class="flex flex-wrap gap-2 mb-4 pt-3">
        <button 
          v-for="filter in filterOptions" 
          :key="filter.value" 
          class="py-1 px-3 text-sm rounded-full border" 
          :class="{
            'bg-[#F0F3F7] border-[#D9DDE3] text-[#6D747D]': !selectedFilters.includes(filter.value),
            'bg-[#EBF6FF] border-[#B3DAFF] text-[#0080FF]': selectedFilters.includes(filter.value)
          }"
          @click="toggleFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <ProductSearchSection 
      :products="city.product"
      navigate-url="/course"
    />

    <div v-if="city.total_count > currentSize" class="flex justify-center mt-6 mb-8 px-4">
      <button
        class="w-full py-3 bg-white border border-[#E5E8EB] rounded-[100px] font-pretendard text-sm text-[#1A1A1A] tracking-[-0.02em]"
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
import { useI18n } from 'vue-i18n'

definePageMeta({
  name: 'course-city'
})

const route = useRoute()
const code = route.params.id

const itemSize = ref(4)
const loadSize = ref(10)

const city = ref({})
const currentSize = ref(itemSize.value)
const searchWord = ref('')

const { t } = useI18n()

// 정렬 옵션
const sortOptions = [
  { label: t('golf.city.sortDistance'), value: 'distance_asc' },
  { label: t('golf.city.sortLowestPrice'), value: 'price_asc' },
  { label: t('golf.city.sortHighestPrice'), value: 'price_desc' }
]

const selectedSort = ref(sortOptions[0])
const showSortOptions = ref(false)

// 필터 옵션 (공항까지 소요 시간)
const filterOptions = [
  { label: t('golf.city.filterWithin30Minutes'), value: '0-30' },
  { label: t('golf.city.filterWithin60Minutes'), value: '30-60' },
  { label: t('golf.city.filterWithin90Minutes'), value: '60-90' },
  { label: t('golf.city.filterWithin120Minutes'), value: '90-120' }
]

const selectedFilters = ref<string[]>([])

// Debounce function to prevent too many API calls
const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}



const callApi = async () => {
  try {
    // 필터 문자열 생성
    const filterString = selectedFilters.value.length > 0 ? selectedFilters.value.join(',') : ''
    
    const response = await $fetch(`/api/golf-course/city/${code}`, {
      method: 'POST',
      body: {
        size: currentSize.value,
        searchWord: searchWord.value,
        filter: filterString,
        sort: selectedSort.value.value
      }
    })
    if (response) {
      city.value = response
    }
  } catch (error) {
    console.error('Error fetching city:', error)
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

// 정렬 옵션 선택 핸들러
const selectSortOption = (option: { label: string, value: string }) => {
  selectedSort.value = option
  showSortOptions.value = false
  currentSize.value = itemSize.value // Reset size when changing sort
  callApi()
}

// 필터 토글 핸들러
const toggleFilter = (filterValue: string) => {
  const index = selectedFilters.value.indexOf(filterValue)
  if (index === -1) {
    selectedFilters.value.push(filterValue)
  } else {
    selectedFilters.value.splice(index, 1)
  }
  currentSize.value = itemSize.value // Reset size when changing filters
  callApi()
}

// 클릭 이벤트 리스너 추가 (정렬 드롭다운 외부 클릭 시 닫기)
onMounted(() => {
  callApi()
  document.addEventListener('click', (event) => {
    if (showSortOptions.value && !(event.target as Element).closest('.sort-dropdown')) {
      showSortOptions.value = false
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', () => {})
})
</script>

<style>

</style>