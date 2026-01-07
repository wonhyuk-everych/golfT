<template>
  <div class="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-6">공지사항 상세/수정</h2>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="mb-4">
        <label class="block mb-1 font-medium">공지 유형</label>
        <select v-model="form.notice_type" class="w-full border px-3 py-2 rounded">
          <option value="">선택</option>
          <option v-for="type in noticeTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">제목</label>
        <input v-model="form.title" type="text" class="w-full border px-3 py-2 rounded" required />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">내용</label>
        <textarea v-model="form.content" class="w-full border px-3 py-2 rounded" rows="6" required></textarea>
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">사용 여부</label>
        <select v-model="form.use_yn" class="w-full border px-3 py-2 rounded">
          <option value="Y">사용</option>
          <option value="N">미사용</option>
        </select>
      </div>
      <div class="mb-6">
        <label class="block mb-1 font-medium">이미지 <span class="text-xs text-gray-500">(최대 10개)</span></label>
        <div class="flex flex-wrap gap-4 mb-2">
          <div v-for="img in images" :key="img.notice_image_idx" class="relative w-32 h-32 border rounded overflow-hidden">
            <img :src="img.image_url" class="object-cover w-full h-full" />
            <button type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded p-1 text-xs" @click="removeImage(img.notice_image_idx)">삭제</button>
          </div>
          <div v-for="(file, idx) in newFiles" :key="'new-'+idx" class="relative w-32 h-32 border rounded overflow-hidden flex items-center justify-center bg-gray-100">
            <img v-if="previewUrls[idx]" :src="previewUrls[idx]" class="object-cover w-full h-full" />
            <span v-else class="text-xs text-gray-500">신규 이미지</span>
            <button type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded p-1 text-xs" @click="removeNewFile(idx)">삭제</button>
          </div>
        </div>
        <input type="file" multiple @change="handleFileChange" :disabled="totalImageCount >= 10" />
        <div v-if="totalImageCount >= 10" class="text-sm text-red-500 mt-1">이미지는 최대 10개까지 등록할 수 있습니다.</div>
      </div>
      <div class="flex justify-end gap-2">
        <button type="button" class="bg-gray-300 px-4 py-2 rounded" @click="goList">목록</button>
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">저장</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const noticeIdx = route.params.notice_idx

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const noticeTypes = [
  { value: 'N', label: '공지사항' },
  { value: 'R', label: '예약' },
  { value: 'T', label: '대회' },
  { value: 'E', label: '이벤트' },
]

const form = reactive({
  notice_type: '',
  title: '',
  content: '',
  use_yn: 'Y',
})
const images = ref<any[]>([])
const removeImageIds = ref<number[]>([])
const newFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const totalImageCount = computed(() => images.value.length + newFiles.value.length)

const fetchDetail = async () => {
  try {
    const res = await $fetch(`/api/admin/notice/${noticeIdx}`)
    if (res.success) {
      const { notice, images: imgs } = res.data
      form.notice_type = notice.notice_type
      form.title = notice.title
      form.content = notice.content
      form.use_yn = notice.use_yn
      images.value = imgs
    }
  } catch (e) {
    alert('상세 조회 실패')
  }
}

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  const selected = Array.from(files)
  // 현재 이미지+신규+선택 합이 10개 초과면 일부만 추가
  const available = 10 - images.value.length - newFiles.value.length
  if (available <= 0) return
  let addFiles: File[] = []
  if (selected.length > available) {
    alert(`이미지는 최대 10개까지 등록할 수 있습니다.`)
    addFiles = selected.slice(0, available)
  } else {
    addFiles = selected
  }
  newFiles.value = newFiles.value.concat(addFiles)
  // 미리보기 url 생성
  addFiles.forEach(file => previewUrls.value.push(URL.createObjectURL(file)))
}

const removeImage = (id: number) => {
  removeImageIds.value.push(id)
  images.value = images.value.filter(img => img.notice_image_idx !== id)
}

// 신규 이미지 삭제(업로드 전)
const removeNewFile = (idx: number) => {
  newFiles.value.splice(idx, 1)
  // 미리보기 url도 함께 제거
  URL.revokeObjectURL(previewUrls.value[idx])
  previewUrls.value.splice(idx, 1)
}

const handleSubmit = async () => {
  const fd = new FormData()
  fd.append('notice_type', form.notice_type)
  fd.append('title', form.title)
  fd.append('content', form.content)
  fd.append('use_yn', form.use_yn)
  removeImageIds.value.forEach(id => fd.append('remove_image_ids', id.toString()))
  newFiles.value.forEach(file => fd.append('images', file))
  try {
    const res = await $fetch(`/api/admin/notice/${noticeIdx}`, {
      method: 'PUT',
      body: fd,
    })
    if (res.success) {
      alert('수정 완료')
      router.push('/admin/notice')
    } else {
      alert('수정 실패')
    }
  } catch (e) {
    alert('수정 실패')
  }
}

const goList = () => {
  router.push('/admin/notice')
}

onMounted(fetchDetail)
</script>

<style scoped>
</style>
