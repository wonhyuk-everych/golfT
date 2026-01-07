<template>
  <div class="relative border border-gray-300 rounded-md">
    <label class="flex items-center justify-between p-3 cursor-pointer">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <input
        ref="fileInput"
        class="hidden"
        type="file"
        multiple
        accept=".jpeg,.jpg,.png,.gif"
        @change="onFileChange"
      >
    </label>
    <div class="flex flex-wrap gap-2 mt-2 px-3 pb-2">
      <div v-for="(file, idx) in files" :key="'file-'+idx" class="relative w-24 h-24 border rounded overflow-hidden">
        <img v-if="file.type?.startsWith('image/')" :src="file.preview" class="object-cover w-full h-full">
        <img v-if="file.preview?.startsWith('http')" :src="file.preview" class="object-cover w-full h-full">
        <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100">{{ file.name }}</div>
        <button type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center" @click="removeFile(idx)">×</button>
      </div>
    </div>
    <div class="px-5 py-1">
      <div class="flex items-center gap-1 text-xs">
        <span class="text-blue-500">{{ totalFileSize }}MB</span>
        <span class="text-gray-400">/ 10MB</span>
      </div>
      <div class="text-xs text-gray-400 mt-1">
        최대 10개, (JPEG, PNG, GIF)
      </div>
    </div>

    <div
      v-if="isUploading"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80"
    >
      <svg
        class="w-8 h-8 text-primary animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span class="mt-2 text-sm text-gray-600">업로드 중...</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
// [NOTE] If you see 'Module "vue" has no exported member' lint errors here, this is a false positive in Nuxt 3/Volar environments and can be safely ignored.
import { ref, watch, defineEmits, defineProps, onUnmounted } from 'vue'


interface FileWithPreview extends File {
  idx: number;
  preview: string;
}

// 서버로 전송 가능한 파일 형식
interface SerializableFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
  base64?: string;
}

const props = defineProps({
  modelValue: {
    type: Array as () => FileWithPreview[],
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue', 'error', 'files-ready', 'file-removed'])

const fileInput = ref<HTMLInputElement | null>(null)
const files = ref<FileWithPreview[]>(props.modelValue)
const isUploading = ref(false)
const totalFileSize = ref(0)
const isMobileDevice = ref(false)

if (import.meta.client) {
  const ua = navigator.userAgent
  isMobileDevice.value = /Mobi|Android|iP(hone|od|ad)/i.test(ua)
}

watch(() => props.modelValue, (val: FileWithPreview[]) => {
  files.value = val
  totalFileSize.value = calcTotalSize(val)
})

function calcTotalSize(fileArr: FileWithPreview[]) {
  return Math.round(fileArr.reduce((acc: number, f: FileWithPreview) => acc + f.size, 0) / (1024 * 1024) * 100) / 100
}

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selected = target.files ? Array.from(target.files) : []
  if (!selected.length) return

  if (selected.length + files.value.length > 10) {
    emit('error', '최대 10개까지 업로드할 수 있습니다.')
    if (target) target.value = ''
    return
  }

  const previousFiles = [...files.value]
  const compressedList: FileWithPreview[] = []
  isUploading.value = true

  try {
    for (const file of selected) {
      const compressed = await compressImage(file)
      const withPreview = Object.assign(compressed, { idx: 0, preview: URL.createObjectURL(compressed) }) as FileWithPreview
      compressedList.push(withPreview)
    }
    const totalSizeAfter = files.value.reduce((acc: number, f: FileWithPreview) => acc + f.size, 0) + compressedList.reduce((acc: number, f: FileWithPreview) => acc + f.size, 0)
    if (totalSizeAfter > 10 * 1024 * 1024) {
      compressedList.forEach(newFile => {
        if (newFile.preview?.startsWith('blob:')) {
          URL.revokeObjectURL(newFile.preview)
        }
      })
      emit('error', '파일 총 용량은 10MB를 초과할 수 없습니다.')
      return
    }
    files.value = [...files.value, ...compressedList]
    totalFileSize.value = calcTotalSize(files.value)
    emit('update:modelValue', files.value)

    // 파일이 변경될 때마다 서버로 전송 가능한 형태로 변환
    await prepareFilesForUpload()
  } catch {
    compressedList.forEach(newFile => {
      if (newFile.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(newFile.preview)
      }
    })
    files.value = previousFiles
    totalFileSize.value = calcTotalSize(files.value)
    emit('update:modelValue', files.value)
    emit('error', '이미지 업로드 중 오류가 발생했습니다.')
  } finally {
    isUploading.value = false
    if (target) target.value = ''
  }
}

function removeFile(idx: number) {
  const removed = files.value[idx]
  if (removed.preview) URL.revokeObjectURL(removed.preview)
  
  // Emit the removed file before removing it from the array
  if (removed.idx) {
    emit('file-removed', removed)
  }
  
  files.value.splice(idx, 1)
  totalFileSize.value = calcTotalSize(files.value)
  emit('update:modelValue', files.value)
}

// 파일을 서버로 전송 가능한 형태로 변환
async function prepareFilesForUpload() {
  const serializableFiles: SerializableFile[] = []
  
  for (const file of files.value) {
    if(file.idx > 0) continue;

    // File 객체를 base64로 변환
    const base64 = await fileToBase64(file)
    
    // 서버로 전송 가능한 객체 생성
    serializableFiles.push({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      preview: file.preview,
      base64: base64
    })
  }
  
  // 변환된 파일 객체 배열을 상위 컴포넌트로 전달
  emit('files-ready', serializableFiles)
}

// File 객체를 base64 문자열로 변환
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
    reader.readAsDataURL(file)
  })
}

async function compressImage(file: File): Promise<File> {
  try {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
    if (file.size < 400 * 1024) return file

    const isLargeFile = file.size > 5 * 1024 * 1024
    const maxSide = isMobileDevice.value
      ? (isLargeFile ? 1400 : 1600)
      : (isLargeFile ? 1800 : 2000)
    const targetSizeMB = isMobileDevice.value ? 0.8 : 1
    const qualityStart = isLargeFile ? 0.7 : 0.8
    const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'

    const dataUrl = await fileToBase64(file)
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = (e) => reject(e)
      i.src = dataUrl
    })

    const srcW = img.naturalWidth || img.width
    const srcH = img.naturalHeight || img.height
    const ratio = Math.min(1, maxSide / Math.max(srcW, srcH))
    const width = Math.max(1, Math.round(srcW * ratio))
    const height = Math.max(1, Math.round(srcH * ratio))

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)

    const attempt = (q: number) => new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), mime, mime === 'image/jpeg' ? q : undefined)
    })

    let q = qualityStart
    let blob = await attempt(q)
    if (!blob) return file

    const targetBytes = targetSizeMB * 1024 * 1024
    let tries = 0
    while (mime === 'image/jpeg' && blob.size > targetBytes && q > 0.5 && tries < 3) {
      q -= 0.1
      const next = await attempt(q)
      if (!next) break
      blob = next
      tries++
    }

    const out = new File([blob], file.name, { type: mime, lastModified: Date.now() })
    return out.size < file.size ? out : file
  } catch {
    return file
  }
}

onUnmounted(() => {
  files.value.forEach((f: FileWithPreview) => f.preview && URL.revokeObjectURL(f.preview))
})
</script>
