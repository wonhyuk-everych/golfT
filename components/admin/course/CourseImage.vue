<template>
  <div class="border-b pb-4">
    <h3 class="text-lg font-medium mb-4">골프장 이미지</h3>

    <div v-if="!isEditing">
      <!-- 기존 이미지 표시 영역 (기존 코드 그대로) -->
      <!-- 메인 이미지 -->
      <div v-if="course.mainImageUrl" class="mb-8">
        <h4 class="text-base font-medium mb-2">메인 이미지</h4>
        <img :src="course.mainImageUrl" alt="메인 이미지" class="w-full h-64 object-cover rounded-lg shadow-md">
      </div>
      <!-- 로고 -->
      <div v-if="course.logoUrl" class="mb-8">
        <h4 class="text-base font-medium mb-2">골프장 로고</h4>
        <img :src="course.logoUrl" alt="골프장 로고" class="h-24 object-contain">
      </div>
      <!-- 시설 이미지 그리드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div v-if="course.courseImageUrl" class="space-y-2">
          <h4 class="text-base font-medium">코스 전경</h4>
          <img :src="course.courseImageUrl" alt="코스 전경" class="w-full h-48 object-cover rounded-lg shadow-md">
        </div>
        <div v-if="course.clubhouseImageUrl" class="space-y-2">
          <h4 class="text-base font-medium">클럽하우스</h4>
          <img :src="course.clubhouseImageUrl" alt="클럽하우스" class="w-full h-48 object-cover rounded-lg shadow-md">
        </div>
        <div v-if="course.restaurantImageUrl" class="space-y-2">
          <h4 class="text-base font-medium">레스토랑</h4>
          <img :src="course.restaurantImageUrl" alt="레스토랑" class="w-full h-48 object-cover rounded-lg shadow-md">
        </div>
        <div v-if="course.shelterImageUrl" class="space-y-2">
          <h4 class="text-base font-medium">그늘집</h4>
          <img :src="course.shelterImageUrl" alt="그늘집" class="w-full h-48 object-cover rounded-lg shadow-md">
        </div>
        <div v-if="course.proshopImageUrl" class="space-y-2">
          <h4 class="text-base font-medium">프로샵</h4>
          <img :src="course.proshopImageUrl" alt="프로샵" class="w-full h-48 object-cover rounded-lg shadow-md">
        </div>
        <div v-if="course.descriptionImageUrl" class="space-y-2">
          <h4 class="text-base font-medium">골프장 설명</h4>
          <img :src="course.descriptionImageUrl" alt="골프장 설명" class="w-full h-48 object-cover rounded-lg shadow-md">
        </div>
      </div>
      <!-- 추가 이미지 -->
      <div v-if="course.extraImages && course.extraImages.length > 0" class="space-y-4">
        <h4 class="text-base font-medium mb-2">추가 이미지 ({{course.extraImages.length}}장)</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="(image, index) in course.extraImages" :key="index" class="space-y-2">
            <img :src="image.imageUrl" :alt="image.imageType" class="w-full h-40 object-cover rounded-lg shadow-md">
            <p class="text-sm text-gray-600 text-center">{{ image.imageType }}</p>
          </div>
        </div>
      </div>
      <div v-if="!hasAnyImages" class="text-center py-8 text-gray-500">
        등록된 이미지가 없습니다.
      </div>
    </div>

    <!-- 편집 모드 -->
    <div v-else>
      <form @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div v-for="section in sectionList" :key="section.key" class="mb-4">
            <h4 class="text-base font-medium">{{ section.label }}</h4>
            <div class="flex items-center gap-4">
              <div v-if="sectionFiles[section.key]?.preview" class="w-32 h-32 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                <img :src="sectionFiles[section.key].preview" class="object-cover w-full h-full" />
              </div>
              <div v-else-if="course[section.urlKey]" class="w-32 h-32 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                <img :src="course[section.urlKey]" class="object-cover w-full h-full" />
              </div>
              <input type="file" accept="image/*" @change="e => handleSectionFileChange(e, section.key)" />
              <button v-if="sectionFiles[section.key]" type="button" class="ml-2 px-2 py-1 bg-red-500 text-white rounded" @click="removeSectionFile(section.key)">삭제</button>
            </div>
          </div>
        </div>
        <!-- 추가 이미지 다중 업로드 -->
        <div class="mb-6">
          <h4 class="text-base font-medium mb-2">추가 이미지 (최대 30장 / 이미지 1장당 5MB 제한)</h4>
          <div class="flex flex-nowrap gap-4 mb-2 overflow-x-auto pb-2">
            <!-- 기존 이미지 표시 -->
            <div v-for="(image, idx) in existingExtraImages" :key="'existing-' + idx" class="w-32 h-32 rounded overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center relative">
              <img :src="image.imageUrl" class="object-cover w-full h-full">
              <button type="button" @click="removeExistingExtraImage(idx)" class="absolute top-1 right-1 px-1 bg-red-500 text-white rounded">X</button>
            </div>
            <!-- 새 이미지 표시 -->
            <div v-for="(file, idx) in extraFiles" :key="'new-' + idx" class="w-32 h-32 rounded overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center relative">
              <img v-if="file.preview" :src="file.preview" class="object-cover w-full h-full" />
              <button type="button" @click="removeExtraFile(idx)" class="absolute top-1 right-1 px-1 bg-red-500 text-white rounded">X</button>
            </div>
            <!-- 추가 버튼 (이미지가 30개 미만일 때만 표시) -->
            <div
              v-if="totalExtraImagesCount < 30"
              class="flex-shrink-0 flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded cursor-pointer relative"
              @click="triggerExtraInput"
            >
              <input
                ref="extraInputRef"
                type="file"
                accept="image/*"
                multiple
                @change="handleExtraFilesChange"
                @click.stop
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style="z-index:2"
              />
              <span class="text-gray-400" style="z-index:1; pointer-events:none;">+</span>
            </div>
          </div>
          <p class="text-sm text-gray-500">{{totalExtraImagesCount}}/30</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

type UploadError = { location: string; fileName?: string; message: string }

// 이미지 최대 용량(5MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const extraInputRef = ref<HTMLInputElement | null>(null)
function triggerExtraInput() {
  extraInputRef.value?.click()
}

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  editedCourse: {
    type: Object,
    required: false,
    default: () => ({})
  }
})

const sectionList = [
  { key: 'main', label: '메인 이미지', urlKey: 'mainImageUrl' },
  { key: 'logo', label: '로고', urlKey: 'logoUrl' },
  { key: 'course', label: '코스 전경', urlKey: 'courseImageUrl' },
  { key: 'clubhouse', label: '클럽하우스', urlKey: 'clubhouseImageUrl' },
  { key: 'restaurant', label: '레스토랑', urlKey: 'restaurantImageUrl' },
  { key: 'shelter', label: '그늘집', urlKey: 'shelterImageUrl' },
  { key: 'proshop', label: '프로샵', urlKey: 'proshopImageUrl' },
  { key: 'description', label: '골프장 설명', urlKey: 'descriptionImageUrl' },
]

const sectionFiles = ref<Record<string, { file: File, preview: string }>>({})
const extraFiles = ref<Array<{ file: File, preview: string }>>([])
const existingExtraImages = ref<Array<{ imageIdx: number, imageUrl: string, imageType: string }>>([])
const removedExtraImageIds = ref<number[]>([])
// 업로드 에러 누적 저장
const uploadErrors = ref<UploadError[]>([])

const totalExtraImagesCount = computed(() => {
  return existingExtraImages.value.length + extraFiles.value.length
})

function handleSectionFileChange(e: Event, key: string) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.size >= MAX_IMAGE_SIZE) {
      alert('이미지 용량이 5MB를 초과했습니다. 다른 이미지를 선택해 주세요.')
      input.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = ev => {
      sectionFiles.value[key] = { file, preview: ev.target?.result as string }
    }
    reader.readAsDataURL(file)
  }
}
function removeSectionFile(key: string) {
  delete sectionFiles.value[key]
}
function handleExtraFilesChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    // 용량 초과 파일 선별
    const oversizeFiles = files.filter(f => f.size >= MAX_IMAGE_SIZE)
    const validFiles = files.filter(f => f.size < MAX_IMAGE_SIZE)
    if (oversizeFiles.length > 0) {
      alert('다음 파일은 5MB를 초과하여 제외됩니다:\n' + oversizeFiles.map(f => `- ${f.name}`).join('\n'))
    }

    // 최대 30개 이미지 제한 체크 (기존 + 이미 추가된 새 이미지 + 이번에 추가할 유효 파일)
    const newTotal = existingExtraImages.value.length + extraFiles.value.length + validFiles.length
    if (newTotal > 30) {
      alert('추가 이미지는 최대 30장까지 등록 가능합니다.')
      input.value = ''
      return
    }

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        extraFiles.value.push({ file, preview: ev.target?.result as string })
      }
      reader.readAsDataURL(file)
    })
    // input 초기화
    input.value = ''
  }
}
function removeExtraFile(idx: number) {
  extraFiles.value.splice(idx, 1)
}

function removeExistingExtraImage(idx: number) {
  // 삭제할 이미지의 ID가 있으면 삭제 목록에 추가
  if (existingExtraImages.value[idx]?.imageIdx) {
    removedExtraImageIds.value.push(existingExtraImages.value[idx].imageIdx!)
  }
  existingExtraImages.value.splice(idx, 1)
}

const hasAnyImages = computed(() => {
  return !!(
    props.course.mainImageUrl ||
    props.course.logoUrl ||
    props.course.courseImageUrl ||
    props.course.clubhouseImageUrl ||
    props.course.restaurantImageUrl ||
    props.course.shelterImageUrl ||
    props.course.proshopImageUrl ||
    props.course.descriptionImageUrl ||
    (props.course.extraImages && props.course.extraImages.length > 0)
  )
})

async function uploadImageToFtp(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadPath', `golf/${props.course.courseIdx}`);
  try {
    const res = await fetch('/api/admin/upload/image', {
      method: 'POST',
      body: formData
    });
    const uploadResult = await res.json();
    if (uploadResult.success && uploadResult.url) {
      return uploadResult;
    } else {
      console.error('[FTP 업로드 실패]', uploadResult);
      throw new Error(uploadResult.error || '이미지 업로드 실패');
    }
  } catch (err) {
    console.error('[FTP 업로드 예외]', err);
    throw err;
  }
}

const emit = defineEmits(['update-images'])

async function save() {
  // 이전 에러 초기화
  uploadErrors.value = []
  // 구역별 1장씩 업로드
  const uploadedSectionUrls: Record<string, string> = {}
  for (const section of sectionList) {
    if (sectionFiles.value[section.key]) {
      try {
        const uploadRes = await uploadImageToFtp(sectionFiles.value[section.key].file)
        uploadedSectionUrls[section.urlKey] = uploadRes.url || uploadRes.image_url
        console.log(`[${section.key}] 업로드 성공`, uploadRes.url || uploadRes.image_url)
      } catch (e) {
        console.error(`[${section.key}] 이미지 업로드 실패:`, e)
        const errMsg = e instanceof Error ? e.message : String(e)
        uploadErrors.value.push({
          location: `섹션 - ${section.label}`,
          fileName: sectionFiles.value[section.key].file?.name,
          message: errMsg
        })
      }
    }
  }
  // 추가이미지 여러장 업로드
  // 1. 새롭게 추가된 이미지 업로드
  const uploadedExtraImages = []
  for (const [idx, item] of extraFiles.value.entries()) {
    try {
      const uploadRes = await uploadImageToFtp(item.file)
      const imageUrl = uploadRes.url || uploadRes.image_url
      uploadedExtraImages.push({
        imageUrl,
        imageType: '이미지'
      })
      console.log(`[추가이미지 ${idx}] 업로드 성공`, imageUrl)
    } catch (e) {
      console.error(`[추가이미지 ${idx}] 업로드 실패:`, e)
      const errMsg = e instanceof Error ? e.message : String(e)
      uploadErrors.value.push({
        location: `추가이미지 #${idx + 1}`,
        fileName: item.file?.name,
        message: errMsg
      })
    }
  }
  
  // 2. 기존 이미지 정보 포함
  const existingImages = existingExtraImages.value.map((img: { imageIdx: number, imageUrl: string, imageType: string }) => ({
    imageUrl: img.imageUrl,
    imageType: img.imageType,
    imageIdx: img.imageIdx
  }))
  
  const result = { 
    ...uploadedSectionUrls, 
    extraImages: [...existingImages, ...uploadedExtraImages],
    removedExtraImageIds: removedExtraImageIds.value
  }
  console.log('[최종 업로드 결과]', result)
  emit('update-images', result)
  // 모든 업로드 처리 후 에러가 있다면 한번에 안내
  if (uploadErrors.value.length > 0) {
    const msg = '다음 이미지 업로드가 실패했습니다.\n' +
      uploadErrors.value
        .map((err: UploadError) => `- ${err.location}${err.fileName ? ` (${err.fileName})` : ''}: ${err.message}`)
        .join('\n')
    alert(msg)
  }
  return result
}

// Watch for changes in course data to update existing images
onMounted(() => {
  if (props.course?.extraImages?.length) {
    existingExtraImages.value = [...props.course.extraImages]
  }
})

// Watch for edit mode changes
watch(() => props.isEditing, (newVal) => {
  if (newVal && props.course?.extraImages?.length) {
    // 편집 모드로 전환될 때 기존 이미지 복사
    existingExtraImages.value = [...props.course.extraImages]
    removedExtraImageIds.value = [] // 삭제 이미지 ID 초기화
  }
})

defineExpose({
  save
})
</script>
