<template>
  <div class="mx-auto bg-white">

    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />

    <!-- 메인 폼 영역 -->
    <div class="space-y-3">
      <!-- 문의 유형 선택 (Dropdown) -->
      <div class="px-4 py-6 pb-2">
        <Listbox v-model="form.qnaType">
            <div class="relative w-full">
              <ListboxButton class="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                <span class="block truncate">
                  {{ qnaTypes.find(t => t.qna_type_idx === form.qnaType)?.[locale === 'ko' ? 'name_kr' : 'name_en'] || $t('qna.questionTypeSelect') }}
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </ListboxButton>
              <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ListboxOption
                  v-for="type in qnaTypes"
                  :key="type.qna_type_idx"
                  :value="type.qna_type_idx"
                  class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100 text-gray-900"
                >
                  <span :class="[form.qnaType === type.qna_type_idx ? 'font-medium' : 'font-normal', 'block truncate']">
                    {{ type[locale === 'ko' ? 'name_kr' : 'name_en'] }}
                  </span>
                  <span v-if="form.qnaType === type.qna_type_idx" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </ListboxOption>
              </ListboxOptions>
            </div>
          </Listbox>
      </div>

      <!-- 제목 입력 -->
      <div class="px-4 py-0 pt-0">
        <div class="border border-gray-300 rounded-md">
          <input 
            v-model="form.title"
            type="text" 
            :placeholder="$t('qna.titlePlaceholder')"
            maxlength="20"
            class="w-full p-3 text-sm text-gray-400 border-none rounded-md focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <!-- 내용 입력 -->
      <div class="px-4 py-0 pb-0">
        <div class="border border-gray-300 rounded-md" style="height: 286px;">
          <textarea 
            v-model="form.content"
            :placeholder="$t('qna.contentPlaceholder')"
            class="w-full h-full p-3 text-sm text-gray-400 border-none rounded-md resize-none focus:outline-none focus:ring-0"
          ></textarea>
        </div>
      </div>

      <!-- 휴대폰 번호 -->
      <div class="px-4 py-4 pt-4">
        <div class="border border-gray-300 rounded-md">
          <input 
            v-model="form.phone"
            type="tel" 
            :placeholder="$t('qna.phonePlaceholder')"
            class="w-full p-3 text-sm text-gray-400 border-none rounded-md focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <!-- 이메일 주소 -->
      <div class="px-4 py-2">
        <div class="border border-gray-300 rounded-md">
          <input 
            v-model="form.email"
            type="email" 
            :placeholder="$t('qna.emailPlaceholder')"
            class="w-full p-3 text-sm text-gray-400 border-none rounded-md focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <!-- 파일 첨부 -->
      <div class="px-4 py-2 pt-2">
        <div class="space-y-0">
          <div class="border border-gray-300 rounded-md">
            <label class="flex items-center justify-between p-3 cursor-pointer">
              <span class="text-sm text-gray-400">{{ $t('qna.fileUpload') }}</span>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <input 
                @change="handleFileUpload"
                type="file" 
                multiple 
                accept=".jpeg,.jpg,.png,.gif"
                class="hidden"
                ref="fileInput"
              />
            </label>
          </div>
          
          <!-- 파일 업로드 정보 -->
          <div class="px-5 py-1">
            <div class="flex items-center gap-1 text-xs">
              <span class="text-blue-500">{{ totalFileSize }}MB</span>
              <span class="text-gray-400">/ {{ $t('qna.maxFileSize') }}</span>
            </div>
            <div class="text-xs text-gray-400 mt-1">
              {{ $t('qna.maxFiles') }}<br>(JPEG, PNG, GIF)
            </div>
          </div>
        </div>
      </div>

      <!-- 구분선 -->
      <div class="px-4">
        <hr class="border-gray-300">
      </div>

      <!-- 서비스 이용약관 -->
      <div class="px-4 py-2 bg-gray-50 rounded-md mx-4">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-4">
                <div class="w-[18px] h-[18px]">
                  <input 
                    v-model="form.agreeTerms"
                    type="checkbox" 
                    class="w-full h-full border-2 border-gray-300 rounded-sm accent-blue-500"
                  />
                </div>
                <span class="text-sm text-gray-900">{{ $t('qna.agreeTerms') }} ({{ $t('qna.required') }})</span>
              </div>
            </div>
            <svg class="w-[18px] h-[18px] text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="flex gap-4 p-4 mt-6">
      <button 
        @click="handleCancel"
        class="flex-1 py-3 px-2 text-sm text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        {{ $t('qna.cancel') }}
      </button>
      <button 
        @click="handleSubmit"
        :disabled="!isFormValid"
        class="flex-1 py-3 px-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {{ $t('qna.submit') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import ToastMessage from '~/components/common/ToastMessage.vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
// 문의 유형 목록
const qnaTypes = ref<{ qna_type_idx: number; name_kr: string; name_en: string }[]>([])

// 폼 데이터
const form = ref({
  qnaType: '',
  title: '',
  content: '',
  phone: '',
  email: '',
  agreeTerms: false
})

// Toast 관련 상태
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 문의 유형 API 호출
const fetchQnaTypes = async () => {
  try {
    const res = await fetch('/api/qna/qna-types')
    const data = await res.json()
    qnaTypes.value = data.qnaTypes || []
    if (qnaTypes.value.length > 0 && !form.value.qnaType) {
      form.value.qnaType = qnaTypes.value[0].qna_type_idx
    }
  } catch (e) {
    // 에러 처리
    qnaTypes.value = []
  }
}

onMounted(fetchQnaTypes)


// 파일 관련
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFiles = ref<File[]>([])
const totalFileSize = ref(0)

// 파일 업로드 핸들러
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files ? Array.from(target.files) : []
  
  if (files.length > 5) {
    showToast.value = true
    toastMessage.value = t('qna.maxFiles')
    toastType.value = 'error'
    return
  }
  
  let totalSize = 0
  files.forEach(file => {
    totalSize += file.size
  })
  
  if (totalSize > 10 * 1024 * 1024) { // 10MB
    showToast.value = true
    toastMessage.value = t('qna.maxFileSize')
    toastType.value = 'error'
    return
  }
  
  uploadedFiles.value = files
  totalFileSize.value = Math.round(totalSize / (1024 * 1024) * 100) / 100 // MB로 변환
}

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    form.value.title.trim() !== '' &&
    form.value.content.trim() !== '' &&
    form.value.phone.trim() !== '' &&
    form.value.email.trim() !== '' &&
    form.value.agreeTerms
  );
});

function validateForm() {
  // 1. 제목 20자 이내
  if (form.value.title.trim() === '') {
    showToast.value = true
    toastMessage.value = t('qna.titlePlaceholder')
    toastType.value = 'error'
    return false;
  }
  if (form.value.title.trim().length > 20) {
    showToast.value = true
    toastMessage.value = t('qna.titlePlaceholder')
    toastType.value = 'error'
    return false;
  }
  // 2. 휴대폰 번호 체크 (010-xxxx-xxxx or 010xxxxxxxx)
  const phone = form.value.phone.trim();
  const phoneRegex = /^(010)([0-9]{4}){2}$|^(010)-([0-9]{4})-([0-9]{4})$/;
  if (phone === '') {
    showToast.value = true
    toastMessage.value = t('qna.phonePlaceholder')
    toastType.value = 'error'
    return false;
  }
  if (!phoneRegex.test(phone)) {
    showToast.value = true
    toastMessage.value = t('qna.phonePlaceholder')
    toastType.value = 'error'
    return false;
  }
  // 3. 이메일 체크
  const email = form.value.email.trim();
  const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
  if (email === '') {
    showToast.value = true
    toastMessage.value = t('qna.emailPlaceholder')
    toastType.value = 'error'
    return false;
  }
  if (!emailRegex.test(email)) {
    showToast.value = true
    toastMessage.value = t('qna.emailPlaceholder')
    toastType.value = 'error'
    return false;
  }
  // 기타 필수 항목 체크
  if (form.value.content.trim() === '') {
    showToast.value = true
    toastMessage.value = t('qna.contentPlaceholder')
    toastType.value = 'error'
    return false;
  }
  if (!form.value.agreeTerms) {
    showToast.value = true
    toastMessage.value = t('qna.agreeTerms')
    toastType.value = 'error'
    return false;
  }
  return true;
}


// 취소 핸들러
const handleCancel = () => {
  if (confirm(t('qna.resetConfirm'))) {
    // 폼 초기화
    form.value = {
      qnaType: '예약 문의',
      title: '',
      content: '',
      phone: '',
      email: '',
      agreeTerms: false
    }
    uploadedFiles.value = []
    totalFileSize.value = 0
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// 제출 핸들러
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  try {
    const formData = new FormData();
    formData.append('qna_type_idx', form.value.qnaType);
    formData.append('title', form.value.title);
    formData.append('content', form.value.content);
    formData.append('phone', form.value.phone);
    formData.append('email', form.value.email);
    // 이미지가 있다면 image_url 배열로 전송 (이미지 업로드는 별도 처리 필요시 추가)
    if (uploadedFiles.value && uploadedFiles.value.length > 0) {
      for (const file of uploadedFiles.value) {
        // 파일 객체 자체를 FormData에 추가해야 서버에서 파일을 받을 수 있습니다.
        formData.append('images', file);
      }
    }
    const res = await fetch('/api/qna/add', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    if (result.success) {
      showToast.value = true;
      toastMessage.value = t('qna.submitSuccess');
      toastType.value = 'success';
      location.reload();
    } else {
      showToast.value = true;
      toastMessage.value = t('qna.submitFailed');
      toastType.value = 'error';
    }
  } catch (e) {
    showToast.value = true;
    toastMessage.value = t('qna.serverError');
    toastType.value = 'error';
  }
}

</script>

<style scoped>
input::placeholder,
textarea::placeholder {
  color: #ACB2BA;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #00A6D1;
}

/* 체크박스 커스터마이징 */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 1px solid #D9DDE3;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  position: relative;
}

input[type="checkbox"]:checked {
  background-color: #00A6D1;
  border-color: #00A6D1;
}

input[type="checkbox"]:checked::before {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 10px;
  font-weight: bold;
}
</style>