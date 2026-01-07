<template>
  <div class="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-6">공지사항 등록</h2>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="mb-4">
        <label class="block mb-1 font-medium">공지 유형</label>
        <select v-model="form.notice_type" class="w-full border px-3 py-2 rounded" required>
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
          <div v-for="(file, idx) in newFiles" :key="idx" class="relative w-32 h-32 border rounded overflow-hidden">
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
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">등록</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const router = useRouter()

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
const newFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const totalImageCount = computed(() => newFiles.value.length)

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  const selected = Array.from(files)
  const available = 10 - newFiles.value.length
  if (available <= 0) return
  let addFiles: File[] = []
  if (selected.length > available) {
    alert('이미지는 최대 10개까지 등록할 수 있습니다.')
    addFiles = selected.slice(0, available)
  } else {
    addFiles = selected
  }
  newFiles.value = newFiles.value.concat(addFiles)
  addFiles.forEach(file => previewUrls.value.push(URL.createObjectURL(file)))
}

const removeNewFile = (idx: number) => {
  newFiles.value.splice(idx, 1)
  URL.revokeObjectURL(previewUrls.value[idx])
  previewUrls.value.splice(idx, 1)
}

const handleSubmit = async () => {
  const fd = new FormData()
  fd.append('notice_type', form.notice_type)
  fd.append('title', form.title)
  fd.append('content', form.content)
  fd.append('use_yn', form.use_yn)
  newFiles.value.forEach(file => fd.append('images', file))
  try {
    const res = await $fetch('/api/admin/notice/add', {
      method: 'POST',
      body: fd,
    })
    if (res.success) {
      alert('등록 완료')
      router.push('/admin/notice')
    } else {
      alert('등록 실패')
    }
  } catch (e) {
    alert('등록 실패')
  }
}

const goList = () => {
  router.push('/admin/notice')
}
</script>

<style scoped>
</style>
