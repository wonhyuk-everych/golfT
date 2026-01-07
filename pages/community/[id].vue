<template>
  <div class="community-detail-page pb-20">
    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />
    
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('community.title')" back-color="black" />

    <div class="pt-16">
      <!-- 로딩 상태 표시 -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>

      <!-- 오류 메시지 -->
      <div v-else-if="error" class="p-4 text-center text-red-500">
        {{ error }}
      </div>
      
      <!-- 게시글 상세 컨텐츠 -->
      <div v-else class="community-content">
        <!-- 게시글 헤더 정보 -->
        <div class="px-4 py-5 border-b">
          <span class="text-gray-500 mb-2">#{{ locale === 'ko' ? postData.city_name : postData.city_name_en }}</span>
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-[#1A1A1A] mb-2">
              <template v-if="!isEditMode">{{ postData.title }}</template>
              <template v-else>
                <input v-model="editTitle" class="border px-2 py-1 rounded w-full text-base font-bold" />
              </template>
            </h1>
            <button v-if="isAuthor === 'Y' && !isEditMode" class="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded" @click="enterEditMode">수정</button>
          </div>
          <div class="flex items-center text-[#ACB2BA] text-sm">
            <span>{{ formatDate(postData.created_at) }}</span>
            <span class="mx-1"></span>
            <span>{{ postData.name_kr }}</span>
          </div>
        </div>
        
        <!-- 게시글 내용 -->
        <div class="px-5 py-5 border-b">
          <div v-if="!isEditMode" class="text-[#1A1A1A] text-base whitespace-pre-wrap">{{ postData.content }}</div>
          <div v-else>
            <textarea v-model="editContent" class="w-full border rounded p-2 text-base" rows="6"></textarea>

            <div class="mt-4">
              <label class="block mb-2 font-semibold">{{ $t('community.imageUpload') }}</label>
              <imageUpload v-model="uploadedFiles" @error="onUploadError" @files-ready="onFilesReady" @file-removed="onFileRemoved" />
            </div>

            <div class="flex gap-2 mt-4">
              <button class="bg-primary text-white px-4 py-2 rounded" @click="saveEdit" :disabled="isSavingEdit">{{ $t('community.save') }}</button>
              <button class="bg-gray-300 text-black px-4 py-2 rounded" @click="cancelEdit" :disabled="isSavingEdit">{{ $t('community.cancel') }}</button>
            </div>
          </div>
        </div>
        
        <!-- 게시글 이미지 -->
        <div v-if="!isEditMode && uploadedFiles.length > 0" class="border-b">
          <div v-for="(image, index) in uploadedFiles" :key="index" class="w-full">
            <img :src="image.preview" :alt="`게시글 이미지 ${index + 1}`" class="w-full">
          </div>
        </div>
        
        <!-- 댓글 섹션 -->
        <div class="comments-section">
          <!-- 댓글 개수 표시 -->
          <div class="px-4 py-3 border-b bg-gray-50">
            <span class="text-base font-bold text-[#1A1A1A]">
              {{ $t('community.comments', { count: commentPagination.total }) }}
            </span>
          </div>

          <!-- 댓글 작성 폼 -->
          <div class="px-4 py-4 border-b">
            <div class="flex items-start gap-3">
              <div class="flex-grow">
                <textarea 
                  v-model="newComment" 
                  class="w-full border rounded-md p-3 text-sm resize-none"
                  :placeholder="$t('community.writeComment')"
                  rows="2"
                />
              </div>
            </div>
            <div class="flex justify-end">
              <button 
                class="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium"
                :disabled="!newComment.trim() || isSubmittingComment"
                @click="submitComment"
              >
                {{ $t('community.submit') }}
              </button>
            </div>
          </div>
          
          <!-- 댓글 목록 -->
          <div class="comments-list">
            <!-- 댓글 로딩 상태 -->
            <div v-if="isLoadingComments" class="flex justify-center items-center py-10">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
            </div>
            
            <!-- 댓글 없음 -->
            <div v-else-if="comments.length === 0" class="p-4 text-center text-gray-500">
              {{ $t('community.noComments') }}
            </div>
            
            <!-- 댓글 목록 -->
            <div v-else>
              <div 
                v-for="comment in comments" 
                :key="comment.community_comment_idx" 
                class="flex flex-col gap-2 p-4 bg-gray-100 w-full mb-2 mt-2"
              >
                 <!-- Header with Name and Date -->
                <div class="flex flex-row gap-2 w-full">
                  <span class="text-sm font-normal text-gray-600 leading-relaxed tracking-tight whitespace-nowrap">
                  {{ comment.name_kr }}
                  </span>
                  <span class="text-sm font-normal text-gray-400 leading-relaxed tracking-tight whitespace-nowrap">
                    {{ formatDate(comment.created_at) }}
                  </span>
                  <button
                    v-if="comment.own_yn === 'Y'"
                    class="text-red-500 text-xs ml-2"
                    @click="confirmDeleteComment(comment.community_comment_idx)"
                  >{{ $t('community.delete') }}</button>
                </div>
                
                <!-- Comment Content -->
                <p class="text-sm font-normal text-gray-900 leading-relaxed tracking-tight w-full">
                  {{ comment.content }}
                </p>
              </div>
            </div>
            
            <!-- 더보기 버튼 -->
            <div v-if="commentPagination.hasMore" class="p-4">
              <button 
                class="w-full py-3 border border-gray-300 rounded-md text-sm text-gray-700 font-medium"
                :disabled="isLoadingMoreComments"
                @click="loadMoreComments"
              >
                <span v-if="isLoadingMoreComments" class="flex items-center justify-center gap-2">
                  <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary" />
                  {{ $t('community.loading') }}
                </span>
                <span v-else>{{ $t('community.loadMoreComments') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 댓글 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <div class="mb-4 text-base font-medium">{{ $t('community.deleteConfirm') }}</div>
        <div class="flex justify-center gap-4">
          <button class="px-4 py-2 rounded bg-red-500 text-white" @click="onDeleteComment">{{ $t('community.delete') }}</button>
          <button class="px-4 py-2 rounded bg-gray-300" @click="showDeleteModal = false">{{ $t('community.cancel') }}</button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Footer from '~/components/common/Footer.vue'
import NavigationBar from '~/components/common/NavigationBar.vue'
import ToastMessage from '~/components/common/ToastMessage.vue'
import imageUpload from '~/components/common/imageUpload.vue'
import { useI18n } from 'vue-i18n'

definePageMeta({
  name: 'community-detail'
})

const { locale } = useI18n()
const { t } = useI18n()

const route = useRoute()
const postId = route.params.id

async function fetchComments(page = 1) {
  try {
    isLoadingComments.value = true
    const data = await $fetch(`/api/community/comments/${postId}?page=${page}`)
    if (data.success && data.data) {
      comments.value = data.data.comments
      commentPagination.value = data.data.pagination
    }
  } finally {
    isLoadingComments.value = false
  }
}

const showDeleteModal = ref(false)
const deleteTargetCommentId = ref<number|null>(null)

function confirmDeleteComment(commentId: number) {
  deleteTargetCommentId.value = commentId
  showDeleteModal.value = true
}

async function onDeleteComment() {
  if (!deleteTargetCommentId.value) return
  try {
    const res = await $fetch(`/api/community/comments/${deleteTargetCommentId.value}`, {
      method: 'DELETE'
    })
    if (res.success) {
      fetchComments()
      toastMessage.value = t('community.deleteSuccess')
      toastType.value = 'success'
    } else {
      toastMessage.value = t('community.deleteError')
      toastType.value = 'error'
    }
    showToast.value = true
  } catch (e) {
    toastMessage.value = t('community.deleteError')
    toastType.value = 'error'
    showToast.value = true
  } finally {
    showDeleteModal.value = false
    deleteTargetCommentId.value = null
  }
}

// useUserSession 추가
const loggedIn = useUserSession()

// 수정 모드 관련 상태
const isEditMode = ref(false)
const isSavingEdit = ref(false)
const editTitle = ref('')
const editContent = ref('')

// API에서 받아오는 본인 글 여부 상태
const isAuthor = ref('N')

function enterEditMode() {
  editTitle.value = postData.value.title
  editContent.value = postData.value.content
  isEditMode.value = true
}

function cancelEdit() {
  isEditMode.value = false
}

async function saveEdit() {
  if (!editTitle.value.trim() || !editContent.value.trim()) return
  isSavingEdit.value = true
  try {
    const res = await $fetch(`/api/community/${postId}`, {
      method: 'PUT',
      body: {
        title: editTitle.value,
        content: editContent.value,
        newImages: serializableFiles.value,
        removeImages: removedImages.value
      }
    })
    if (res.success) {
      postData.value.title = editTitle.value
      postData.value.content = editContent.value
      isEditMode.value = false
      toastMessage.value = t('community.editSuccess')
      toastType.value = 'success'
      showToast.value = true
      // 이미지 UI 갱신
      fetchPostDetail()
      // 상태 초기화
      newImages.value = []
      removedImages.value = []
    } else {
      toastMessage.value = res.error || t('community.editError')
      toastType.value = 'error'
      showToast.value = true
    }
  } catch (e) {
    toastMessage.value = t('community.editError')
    toastType.value = 'error'
    showToast.value = true
  } finally {
    isSavingEdit.value = false
  }
}


// 이미지 업로드
interface FileWithPreview extends File {
  idx: number;
  preview: string;
}

interface SerializableFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
  base64?: string;
}
const uploadedFiles = ref<FileWithPreview[]>([])
const newImages = ref<SerializableFile[]>([])
const removedImages = ref<number[]>([])
const serializableFiles = ref<SerializableFile[]>([])

// 이미지 업로드 컴포넌트에서 변환된 파일 받기
const onFilesReady = (files: SerializableFile[]) => {
  serializableFiles.value = files
}

// 이미지 삭제 처리
const onFileRemoved = (file: FileWithPreview) => {
  // 삭제된 이미지를 removedImages 배열에 추가
  if (file.idx && file.idx > 0) {
    removedImages.value.push(file.idx)
  }
}

// 이미지 업로드 오류 처리
const onUploadError = (errorMessage: string) => {
  showToast.value = true
  toastMessage.value = errorMessage
  toastType.value = 'error'
}


// 게시글 데이터 상태 관리
const postData = ref({
  community_idx: 0,
  title: '',
  content: '',
  created_at: '',
  name_kr: '',
  city_name: '',
  city_name_en: ''
})
const images = ref([])
const isLoading = ref(true)
const error = ref('')

// 댓글 데이터 상태 관리
const comments = ref([])
const commentPagination = ref({
  total: 0,
  hasMore: false
})
const currentCommentPage = ref(1)
const isLoadingComments = ref(true)
const isLoadingMoreComments = ref(false)
const newComment = ref('')
const isSubmittingComment = ref(false)

// Toast 관련 상태
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 날짜 포맷 함수 (ISO -> YYYY-MM-DD)
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 게시글 상세 데이터 가져오기
const fetchPostDetail = async () => {
  try {
    isLoading.value = true
    const response = await $fetch(`/api/community/${postId}`)
    
    if (!response.success) {
      error.value = response.error || t('form.postFailed')
      return
    }
    
    postData.value = response.data.post
    serializableFiles.value = [];
    uploadedFiles.value = [];
    for(const image of response.data.images) {
      uploadedFiles.value.push({
        idx: image.community_image_idx,
        preview: image.image_url
      })
    }
    comments.value = response.data.comments
    commentPagination.value = response.data.commentPagination
    isAuthor.value = response.data.isAuthor || 'N'
  } catch (e) {
    error.value = t('form.postFailed')
  } finally {
    isLoading.value = false
    isLoadingComments.value = false
  }
}

// 더 많은 댓글 불러오기
const loadMoreComments = async () => {
  if (isLoadingMoreComments.value || !commentPagination.value.hasMore) return
  
  try {
    isLoadingMoreComments.value = true
    currentCommentPage.value += 1
    
    const data = await $fetch(`/api/community/comments/${postId}?page=${currentCommentPage.value}`)
    
    if (data.success) {
      comments.value = [...comments.value, ...data.data.comments]
      commentPagination.value = data.data.pagination
    } else {
      showToast.value = true
      toastMessage.value = data.error || t('form.postFailed')
      toastType.value = 'error'
    }
  } catch (e) {
    showToast.value = true
    toastMessage.value = t('form.postFailed')
    toastType.value = 'error'
  } finally {
    isLoadingMoreComments.value = false
  }
}

// 댓글 작성 제출
const submitComment = async () => {
  if (!newComment.value.trim() || isSubmittingComment.value) return
  
  try {
    isSubmittingComment.value = true
    
    const response = await $fetch('/api/community/comment/add', {
      method: 'POST',
      body: {
        community_idx: Number(postId),
        content: newComment.value.trim()
      }
    })
    
    if (response.success) {
      // 새 댓글을 목록 맨 위에 추가
      comments.value = [response.data.comment, ...comments.value]
      
      // 댓글 수 증가
      commentPagination.value.total += 1
      
      // 입력 필드 초기화
      newComment.value = ''
      
      // 성공 메시지
      showToast.value = true
      toastMessage.value = t('form.postSuccess')
      toastType.value = 'success'
      fetchComments()
    } else {
      showToast.value = true
      toastMessage.value = response.error || t('form.postFailed')
      toastType.value = 'error'
    }
  } catch (e) {
    showToast.value = true
    toastMessage.value = t('form.postFailed')
    toastType.value = 'error'
  } finally {
    isSubmittingComment.value = false
  }
}

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(() => {
  fetchPostDetail()
})
</script>

<style scoped>
.community-content img {
  max-width: 100%;
  height: auto;
}

.comment-item:last-child {
  border-bottom: none;
}
</style>