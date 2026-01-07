<template>
  <div class="community-list p-4">
    <!-- 로딩 상태 표시 -->
    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
    </div>
    
    <!-- 게시글 목록 -->
    <div v-else class="space-y-4">
      <div v-if="posts.length === 0" class="text-center py-10 text-gray-500">
        {{ $t('community.noPosts') }}
      </div>
      <div 
        v-for="post in posts" 
        :key="post.community_idx" 
        class="post-item border-b pb-4 mb-4 cursor-pointer"
        @click="navigateToPostDetail(post.community_idx)"
      >
        <div class="post-title text-[14px] font-normal text-[#1A1A1A] mb-1">
          {{ post.title }}
        </div>
        <div class="post-info flex gap-2 text-[12px] text-[#ACB2BA]">
          <span>{{ formatDate(post.created_at) }}</span>
          <span>{{ post.name_kr }}</span>
          <span class="text-primary">{{ $t('community.comments', { count: post.comment_count }) }}</span>
        </div>
      </div>
    </div>

    <!-- 더보기 버튼 -->
    <div v-if="!isLoading && hasMorePosts" class="load-more flex justify-center mt-6">
      <button 
        class="load-more-button bg-primary text-white px-4 py-2 rounded-md w-full max-w-xs"
        :disabled="isLoadingMore"
        @click="loadMorePosts"
      >
        <span v-if="isLoadingMore" class="flex items-center justify-center gap-2">
          <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
          {{ $t('community.loading') }}
        </span>
        <span v-else>{{ $t('community.loadMore') }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  posts: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isLoadingMore: {
    type: Boolean,
    default: false
  },
  hasMorePosts: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['load-more', 'navigate-to-post'])

// 날짜 포맷 함수 (ISO -> YYYY-MM-DD)
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 더 보기 버튼 클릭 시 이벤트 발생
const loadMorePosts = () => {
  emit('load-more')
}

// 게시글 상세 페이지로 이동
const navigateToPostDetail = (postId) => {
  if (!postId) return
  emit('navigate-to-post', postId)
}
</script>

<style scoped>
.post-item:last-child {
  border-bottom: none;
}
</style>
