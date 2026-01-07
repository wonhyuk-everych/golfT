<template>
  <div class="community-page">
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('community.title')" back-color="black" />

    <div class="pt-16">
      <!-- 탭 메뉴 -->
      <nav class="bg-white w-full border-b flex">
        <div 
          class="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer w-1/3"
          @click="activeTab = 'home'"
        >
          <span 
            class="text-base font-bold tracking-tighter" 
            :class="activeTab === 'home' ? 'text-primary' : 'text-text-primary'"
          >
            {{ $t('community.home') }}
          </span>
          <div 
            v-if="activeTab === 'home'" 
            class="w-full h-[2px] bg-primary"
          />
        </div>
        <div 
          class="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer w-1/3"
          @click="activeTab = 'write'"
        >
          <span 
            class="text-base font-bold tracking-tighter" 
            :class="activeTab === 'write' ? 'text-primary' : 'text-text-primary'"
          >
            {{ $t('community.write') }}
          </span>
          <div 
            v-if="activeTab === 'write'" 
            class="w-full h-[2px] bg-primary"
          />
        </div>
        <div 
          class="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer w-1/3"
          @click="activeTab = 'alarm'"
        >
          <span 
            class="text-base font-bold tracking-tighter" 
            :class="activeTab === 'alarm' ? 'text-primary' : 'text-text-primary'"
          >
            {{ $t('community.alarm') }}
          </span>
          <div 
            v-if="activeTab === 'alarm'" 
            class="w-full h-[2px] bg-primary"
          />
        </div>
      </nav>

      <!-- 도시 필터 버튼 -->
      <div v-if="activeTab === 'home'" class="city-filter p-4 bg-white">
        <div class="grid grid-cols-4 gap-2">
          <button 
            class="city-button py-2 px-3 text-sm rounded-md text-center"
            :class="selectedCity === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
            @click="selectCity(null)"
          >
            {{ $t('community.allCities') }}
          </button>
          <button 
            v-for="city in cities" 
            :key="city.country_code_idx"
            class="city-button py-2 px-3 text-sm rounded-md text-center"
            :class="selectedCity === city.country_code_idx ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
            @click="selectCity(city.country_code_idx)"
          >
            {{ locale === 'ko' ? city.city_name : city.city_name_en }}
          </button>
        </div>
      </div>

      <!-- 커뮤니티 리스트 -->
      <PostList 
        v-if="activeTab === 'home'"
        :posts="posts"
        :is-loading="isLoading"
        :is-loading-more="isLoadingMore"
        :has-more-posts="hasMorePosts"
        @load-more="loadMorePosts"
        @navigate-to-post="navigateToPostDetail"
      />
      
      <!-- 게시글 작성 -->
      <PostWrite
        v-if="activeTab === 'write'"
        @post-created="handlePostCreated"
      />
    </div>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import Footer from '~/components/common/Footer.vue'
import NavigationBar from '~/components/common/NavigationBar.vue'
import PostList from '~/components/community/PostList.vue'
import PostWrite from '~/components/community/PostWrite.vue'

definePageMeta({
  name: 'community-home'
})

const { locale } = useI18n()

// 활성화된 탭 상태 관리
const activeTab = ref('home')

// 커뮤니티 데이터 상태 관리
const cities = ref([])
const posts = ref([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const selectedCity = ref(null)
const currentPage = ref(1)
const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false
})

// 더 불러올 게시글이 있는지 확인
const hasMorePosts = computed(() => {
  return pagination.value.hasNextPage
})

// 날짜 포맷 함수는 PostList 컴포넌트로 이동됨

// 도시 선택 함수
const selectCity = (cityId) => {
  selectedCity.value = cityId
  currentPage.value = 1 // 도시 변경 시 첫 페이지로 이동
  posts.value = [] // 기존 게시글 초기화
  fetchCommunityData()
}

// 더 보기 버튼 클릭 시 다음 페이지 로드
const loadMorePosts = async () => {
  if (!hasMorePosts.value || isLoadingMore.value) return
  
  isLoadingMore.value = true
  currentPage.value += 1
  
  try {
    // 쿼리 파라미터 구성
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('limit', '10')
    
    if (selectedCity.value !== null) {
      params.append('country_code_idx', selectedCity.value.toString())
    }
    
    const data = await $fetch(`/api/community/search?${params.toString()}`)
    
    if (data && data.success) {
      // 기존 게시글에 새로운 게시글 추가
      posts.value = [...posts.value, ...data.data.posts]
      
      // 페이지네이션 정보 업데이트
      pagination.value = data.data.pagination
    } else {
      console.error('추가 커뮤니티 데이터 로드 실패:', data.error || '알 수 없는 오류')
    }
  } catch (error) {
    console.error('추가 커뮤니티 데이터 로드 중 오류 발생:', error)
  } finally {
    isLoadingMore.value = false
  }
}

// 커뮤니티 데이터 가져오기
const fetchCommunityData = async () => {
  try {
    isLoading.value = true
    
    // 쿼리 파라미터 구성
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('limit', '10')
    
    if (selectedCity.value !== null) {
      params.append('country_code_idx', selectedCity.value.toString())
    }
    
    const data = await $fetch(`/api/community/search?${params.toString()}`)
    
    if (data && data.success) {
      // 도시 목록 업데이트 (첫 로드 시에만)
      if (cities.value.length === 0) {
        cities.value = data.data.cities
      }
      
      // 게시글 목록 업데이트 (초기 로드 또는 필터 변경 시)
      if (currentPage.value === 1) {
        posts.value = data.data.posts
      } else {
        // 추가 로드 시 기존 게시글에 추가
        posts.value = [...posts.value, ...data.data.posts]
      }
      
      // 페이지네이션 정보 업데이트
      pagination.value = data.data.pagination
    } else {
      console.error('커뮤니티 데이터 로드 실패:', data.error || '알 수 없는 오류')
    }
  } catch (error) {
    console.error('커뮤니티 데이터 로드 중 오류 발생:', error)
  } finally {
    isLoading.value = false
  }
}

// 게시글 상세 페이지로 이동
const navigateToPostDetail = (postId) => {
  if (!postId) return
  navigateTo(`/community/${postId}`)
}

// 게시글 작성 완료 처리
const handlePostCreated = (newPost) => {
  // 홈 탭으로 이동
  activeTab.value = 'home'
  
  // 새 게시글을 목록 맨 위에 추가
  if (posts.value.length > 0) {
    posts.value = [newPost, ...posts.value]
  } else {
    posts.value = [newPost]
  }
  
  // 페이지네이션 정보 업데이트
  pagination.value.total += 1
}

// 탭 변경 감지
watch(activeTab, (newTab) => {
  if (newTab === 'home') {
    fetchCommunityData()
  }
})

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(() => {
  fetchCommunityData()
})
</script>

<style scoped>
.city-button {
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-item:last-child {
  border-bottom: none;
}
</style>