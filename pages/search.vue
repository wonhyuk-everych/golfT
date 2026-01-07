<template>
  <div class="search-page">
    <!-- Search Header -->
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('search.title')" back-color="black"/>

    <div class="pt-10 pb-10 px-4">
      <div class="relative pt-10">
        <input 
          v-model="searchQuery"
          type="text" 
          :placeholder="$t('search.placeholder')"
          class="w-full px-6 py-3 rounded-lg border border-border-search focus:outline-none focus:border-border-focus text-sm text-text-placeholder"
          @focus="isFocused = true"
          @input="handleSearch"
        >
        <button 
          v-if="searchQuery" 
          class="absolute right-6 top-1/5 transform -translate-y-1/2 text-text-placeholder pt-10"
          @click="clearSearch"
        >
          <span class="text-xl">×</span>
        </button>
      </div>
    </div>

    <!-- Search Content -->
    <div class="px-4">
      <div v-if="!searchQuery && !isFocused" class="text-center py-16">
        <div class="text-gray-500 mb-4">
          <img src="~/assets/icons/search.svg" alt="Search" class="w-8 h-8 mx-auto mb-2">
          {{ $t('search.emptyPrompt') }}
        </div>
      </div>

      <div v-else-if="!searchQuery && isFocused && searchResults.length === 0" class="py-4">
        <h3 class="text-sm font-medium text-gray-900 mb-2 strong">{{ $t('search.recentSearches') }}</h3>
        <div v-if="recentSearches.length === 0" class="text-gray-500 text-sm text-center py-8">
          {{ $t('search.noRecentSearches') }}
        </div>
        <div v-else class="space-y-2">
          <div 
            v-for="(search, index) in recentSearches" 
            :key="index"
            class="flex items-center justify-between py-2"
          >
            <button 
              class="text-sm text-gray-900"
              @click="handleRecentSearch(search)"
            >
              {{ search }}
            </button>
            <button 
              class="text-gray-400"
              @click="removeRecentSearch(index)"
            >
              <span class="text-xl">×</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="searchResults.length > 0 || hotelResults.length > 0 || caddyResults.length > 0">
        <!-- 검색 타입 선택 -->
        <div class="flex gap-2 mb-4 px-4">
          <button 
            :class="[`px-3 py-1 rounded-full text-xs`, searchType === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600']"
            @click="searchType = null; handleSearch({target: {value: searchQuery}})"
          >
          {{ $t('search.all') }}
          </button>
          <button 
            :class="[`px-3 py-1 rounded-full text-xs`, searchType === 'golf' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600']"
            @click="searchType = 'golf'; handleSearch({target: {value: searchQuery}})"
          >
          {{ $t('search.golf') }}
          </button>
          <button 
            :class="[`px-3 py-1 rounded-full text-xs`, searchType === 'hotel' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600']"
            @click="searchType = 'hotel'; handleSearch({target: {value: searchQuery}})"
          >
          {{ $t('search.hotel') }}
          </button>
          <button 
            :class="[`px-3 py-1 rounded-full text-xs`, searchType === 'caddy' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600']"
            @click="searchType = 'caddy'; handleSearch({target: {value: searchQuery}})"
          >
          {{ $t('search.caddy') }}
          </button>
        </div>
        
        <!-- Golf Courses Section -->
        <div v-if="searchResults.length > 0">
          <div class="py-2 px-4">
            <h3 class="text-sm font-medium text-gray-600">{{ $t('search.golf') }}</h3>
          </div>
          <div 
            v-for="result in searchResults" 
            :key="`golf-${result.idx}`"
            class="py-4 px-4 cursor-pointer transition-colors duration-300 hover:bg-hover/50"
            @click="(event) => handleItemClick(result.idx, 'course', event)"
          >
            <div class="flex items-center gap-2">
              <img src="~/assets/icons/search-golf.svg" :alt="$t('common.search')" class="w-4 h-4 text-text-secondary">
              <span class="text-sm text-text-primary">
                <template v-for="(part, index) in highlightMatch(result.name_kr, searchQuery)" :key="index">
                  <strong v-if="part.highlight" class="font-bold">{{ part.text }}</strong>
                  <template v-else>{{ part.text }}</template>
                </template>
              </span>
            </div>
            <div class="pl-[30px]">
              <p class="text-xs text-text-secondary">
                {{ result.country_name }} - {{ result.city_name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Hotels Section -->
        <div v-if="hotelResults.length > 0">
          <div class="py-2 px-4">
            <h3 class="text-sm font-medium text-gray-600">{{ $t('search.hotel') }}</h3>
          </div>
          <div 
            v-for="result in hotelResults" 
            :key="`hotel-${result.idx}`"
            class="py-4 px-4 cursor-pointer transition-colors duration-300 hover:bg-hover/50"
            @click="(event) => handleItemClick(result.idx, 'hotel', event)"
          >
            <div class="flex items-center gap-2">
              <img src="~/assets/icons/search-hotel.svg" :alt="$t('common.search')" class="w-4 h-4 text-text-secondary">
              <span class="text-sm text-text-primary">
                <template v-for="(part, index) in highlightMatch(result.name_kr, searchQuery)" :key="index">
                  <strong v-if="part.highlight" class="font-bold">{{ part.text }}</strong>
                  <template v-else>{{ part.text }}</template>
                </template>
              </span>
            </div>
            <div class="pl-[30px]">
              <p class="text-xs text-text-secondary">
                {{ result.country_name }} - {{ result.city_name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Caddies Section -->
        <div v-if="caddyResults.length > 0">
          <div class="py-2 px-4">
            <h3 class="text-sm font-medium text-gray-600">{{ $t('search.caddy') }}</h3>
          </div>
          <div 
            v-for="result in caddyResults" 
            :key="`caddy-${result.idx}`"
            class="py-4 px-4 cursor-pointer transition-colors duration-300 hover:bg-hover/50"
            @click="(event) => handleItemClick(result.idx, 'caddy', event)"
          >
            <div class="flex items-center gap-2">
              <img src="~/assets/icons/search-caddy.svg" :alt="$t('common.search')" class="w-4 h-4 text-text-secondary">
              <span class="text-sm text-text-primary">
                <template v-for="(part, index) in highlightMatch(result.name_kr, searchQuery)" :key="index">
                  <strong v-if="part.highlight" class="font-bold">{{ part.text }}</strong>
                  <template v-else>{{ part.text }}</template>
                </template>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="searchQuery" class="py-4">
        <div class="text-sm text-gray-500 mb-4">
          {{ $t('search.searchResults') }}{{ searchQuery }}{{ $t('search.searchResultsFor') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, definePageMeta } from '#imports'
import { useI18n } from 'vue-i18n'
import NavigationBar from '~/components/common/NavigationBar.vue'

const { t } = useI18n()

definePageMeta({
  name: 'search'
})

const searchQuery = ref('')
const isFocused = ref(false)
const searchType = ref<string | null>(null) // 검색 타입 (golf, hotel, caddy)
const recentSearches = ref<string[]>([])
const searchResults = ref<Array<{ idx: number; name_kr: string; name_en: string; country_name: string; city_name: string }>>([]);
const hotelResults = ref<Array<{ idx: number; name_kr: string; name_en: string; country_name: string; city_name: string }>>([]);
const caddyResults = ref<Array<{ idx: number; name_kr: string; name_en: string }>>([]);

// Load recent searches from localStorage and handle URL query parameters
onMounted(() => {
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    recentSearches.value = JSON.parse(saved)
  }
  
  // Get type from URL query parameter
  const route = useRoute()
  if (route.query.type) {
    searchType.value = route.query.type as string
  }
})

// Watch for changes in searchQuery
let searchTimeout: NodeJS.Timeout | null = null;

const fetchGolfCourses = async (query: string) => {
  try {
    const response = await $fetch('/api/search', {
      params: {
        searchWord: query,
        type: searchType.value // 타입 파라미터 추가
      }
    })
    searchResults.value = response.courses || []
    hotelResults.value = response.hotels || []
    caddyResults.value = response.caddies || []
    
    // 검색어 저장 로직
    const index = recentSearches.value.indexOf(query)
    if (index > -1) {
      recentSearches.value.splice(index, 1)
    }
    recentSearches.value.unshift(query)
    
    if (recentSearches.value.length > 10) {
      recentSearches.value = recentSearches.value.slice(0, 10)
    }
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
  } catch (error) {
    console.error(t('search.errorSearching'), error)
    searchResults.value = []
    hotelResults.value = []
  }
}

const handleRecentSearch = async (query: string) => {
  searchQuery.value = query
  await fetchGolfCourses(query)
}

const handleSearch = async (event) => {
  // 이전 타이머가 있다면 취소
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // 디바운스 처리 (100ms)
  searchTimeout = setTimeout(async () => {
    const query = event.target.value.trim()
    searchQuery.value = query
  
    if (!query) {
      searchResults.value = []
      hotelResults.value = []
      caddyResults.value = []
      return
    }
  
    await fetchGolfCourses(query)
  }, 100)
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  hotelResults.value = []
}

interface TextPart {
  text: string
  highlight: boolean
}

const highlightMatch = (text: string, query: string): TextPart[] => {
  if (!query) return [{ text, highlight: false }]
  
  const parts: TextPart[] = []
  const regex = new RegExp(`(${query.trim()})`, 'gi')
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (lastIndex !== match.index) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        highlight: false
      })
    }
    parts.push({
      text: match[0],
      highlight: true
    })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      highlight: false
    })
  }

  return parts
}

const handleItemClick = (idx: number, path: string, event: Event) => {
  const element = event.currentTarget as HTMLElement
  if (element) {
    element.style.backgroundColor = '#E0F7FD'
    setTimeout(() => {
      element.style.backgroundColor = ''
      // Navigate to course detail page
      navigateTo(`/${path}/${idx}`)
    }, 300)
  }
}

const removeRecentSearch = (index: number) => {
  recentSearches.value.splice(index, 1)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background-color: white;
}
</style>
