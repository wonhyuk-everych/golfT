<!-- Community Detail Page -->
<template>
  <div class="space-y-6">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="bg-white p-6 rounded-lg shadow-md flex justify-center items-center">
      <p class="text-gray-500">로딩 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="bg-white p-6 rounded-lg shadow-md">
      <div class="text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200" @click="router.back()">
          목록으로 돌아가기
        </button>
      </div>
    </div>

    <!-- 커뮤니티 정보 -->
    <div v-else-if="community" class="space-y-6">
      <!-- 기본 정보 섹션 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="border-b border-gray-200 pb-5">
          <div class="flex justify-between">
            <h3 class="text-lg font-medium leading-6 text-gray-900">기본 정보</h3>
            <div>
              <span :class="getStatusClass(community.use_yn)" class="mr-2">
                {{ getStatusText(community.use_yn) }}
              </span>
              <button
                v-if="community.use_yn === 'Y'"
                class="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                @click="updateStatus('N')"
              >
                비활성화
              </button>
              <button
                v-else
                class="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                @click="updateStatus('Y')"
              >
                활성화
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">커뮤니티 ID</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {{ community.community_idx }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">작성자</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {{ community.member_name || '-' }} (ID: {{ community.member_idx }})
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {{ community.title }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">국가</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {{ community.country_name || '-' }} (ID: {{ community.country_code_idx || '-' }})
            </div>
          </div>



          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">작성일</label>
            <div class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              {{ formatDateTime(community.created_at) }}
            </div>
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <div class="w-full p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[200px] whitespace-pre-wrap">
            {{ community.content }}
          </div>
        </div>
      </div>

      <!-- 이미지 섹션 -->
      <div v-if="community.images && community.images.length > 0" class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">게시글 이미지</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="image in community.images" :key="image.community_image_idx" class="border border-gray-200 rounded-md p-4">
            <div class="h-48 overflow-hidden rounded-md mb-2">
              <img :src="image.image_url" class="w-full h-full object-cover" :alt="community.title">
            </div>
            <div class="flex justify-between items-center">
              <div>
                <span class="text-sm text-gray-500">순서: {{ image.sort }}</span>
                <span v-if="image.use_yn === 'N'" class="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  미사용
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 댓글 섹션 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">댓글 ({{ commentsCount }})</h3>
        
        <div v-if="community.comments && community.comments.length > 0" class="space-y-4">
          <div v-for="comment in community.comments" :key="comment.community_comment_idx" class="border border-gray-200 rounded-md p-4">
            <div class="flex justify-between">
              <div>
                <span class="font-medium">{{ comment.member_name || 'Anonymous' }}</span>
                <span class="text-gray-500 text-sm ml-2">(ID: {{ comment.member_idx }})</span>
                <span class="text-gray-500 text-sm ml-2">{{ formatDateTime(comment.created_at) }}</span>
              </div>
              <div>
                <span :class="getStatusClass(comment.use_yn)" class="mr-2">
                  {{ getStatusText(comment.use_yn) }}
                </span>
                <button
                  v-if="comment.use_yn === 'Y'"
                  class="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  @click="updateCommentStatus(comment.community_comment_idx, 'N')"
                >
                  비활성화
                </button>
                <button
                  v-else
                  class="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                  @click="updateCommentStatus(comment.community_comment_idx, 'Y')"
                >
                  활성화
                </button>
              </div>
            </div>
            <div class="mt-2 whitespace-pre-wrap">{{ comment.content }}</div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 bg-gray-50 rounded-md">
          <p class="text-gray-500">등록된 댓글이 없습니다</p>
        </div>
      </div>

      <!-- 버튼 섹션 -->
      <div class="flex justify-end space-x-4">
        <button class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700" @click="router.push('/admin/community')">
          목록으로
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from '#imports'
import { useRoute, useRouter } from 'vue-router'
import type { Community, CommunityComment } from '~/types/admin/community'

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface ApiResponse {
  community: Community & {
    comments: CommunityComment[]
    images: any[]
  }
}

const route = useRoute()
const router = useRouter()
const community = ref<ApiResponse['community'] | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isUpdating = ref(false)

const commentsCount = computed(() => {
  return community.value?.comments?.length || 0
})

const fetchCommunityDetails = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await $fetch<ApiResponse>(`/api/admin/community/${route.params.id}`)
    community.value = response.community
  } catch (err) {
    error.value = '커뮤니티 정보를 불러오는데 실패했습니다.'
    console.error('Error fetching community details:', err)
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (status: string) => {
  if (isUpdating.value || !community.value) return
  
  try {
    isUpdating.value = true
    
    await $fetch(`/api/admin/community/update/${route.params.id}`, {
      method: 'PUT',
      body: { use_yn: status }
    })
    
    // Update local state after successful API call
    if (community.value) {
      community.value.use_yn = status
    }
    
    alert(`게시글이 성공적으로 ${status === 'Y' ? '활성화' : '비활성화'}되었습니다.`)
  } catch (err) {
    console.error('Error updating community status:', err)
    alert('게시글 상태 업데이트에 실패했습니다.')
  } finally {
    isUpdating.value = false
  }
}

const updateCommentStatus = async (commentId: number, status: string) => {
  if (isUpdating.value || !community.value) return
  
  try {
    isUpdating.value = true
    
    await $fetch(`/api/admin/community/comment/update/${commentId}`, {
      method: 'PUT',
      body: { use_yn: status }
    })
    
    // Update local state after successful API call
    if (community.value && community.value.comments) {
      const comment = community.value.comments.find(c => c.community_comment_idx === commentId)
      if (comment) {
        comment.use_yn = status
      }
    }
    
    alert(`댓글이 성공적으로 ${status === 'Y' ? '활성화' : '비활성화'}되었습니다.`)
  } catch (err) {
    console.error('Error updating comment status:', err)
    alert('댓글 상태 업데이트에 실패했습니다.')
  } finally {
    isUpdating.value = false
  }
}

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return `${date.toLocaleDateString('ko-KR')} ${date.toLocaleTimeString('ko-KR')}`
}



const getStatusClass = (status: string) => {
  return {
    'px-2 py-1 rounded text-sm font-medium': true,
    'bg-green-100 text-green-800': status === 'Y',
    'bg-red-100 text-red-800': status === 'N'
  }
}

const getStatusText = (status: string) => {
  return status === 'Y' ? '활성화' : '비활성화'
}

onMounted(async () => {
  await fetchCommunityDetails()
})
</script>
