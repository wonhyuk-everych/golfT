<template>
  <div class="tournament-detail-page pb-20">
    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />
    
    <NavigationBar mode="back_title" :show-bell="false" :title="locale === 'ko' ? tournamentData.title : tournamentData.title_en" back-color="black" />

    <div class="pt-16">
      <!-- 로딩 상태 표시 -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>

      <!-- 오류 메시지 -->
      <div v-else-if="error" class="p-4 text-center text-red-500">
        {{ error }}
      </div>
      
      <!-- 토너먼트 상세 컨텐츠 -->
      <div v-else class="tournament-content">
        <!-- 종료된 대회 안내 배너 -->
        <div v-if="tournamentData.is_ended" class="mx-4 mt-2 mb-4 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800 px-4 py-3">
          {{ $t('tournament.endedTournament') }}
        </div>
        
        <!-- 메인 이미지 슬라이더 -->
        <div v-if="tournamentData.image_main_list && tournamentData.image_main_list.length > 0">
          <ImageSlider :images="mainImageList" />
        </div>
        
        <!-- 타이틀과 가격 (피그마 디자인 기반) -->
        <div class="px-4 py-6">
          <div class="font-bold text-[20px] text-[#1A1A1A] leading-[1.5em] tracking-tighter">
            {{ locale === 'ko' ? tournamentData.title : tournamentData.title_en }}
          </div>
          <div class="font-bold text-[20px] text-[#00A6D1] leading-[1.5em] tracking-tighter">
            <!--{{ $t('tournament.price') }} {{ formatOnlyWonPrice(tournamentData.price, locale) }} -->
            {{ tournamentData.price_explain }}
          </div>
        </div>
        
        <!-- 동적 폼 섹션 -->
        <div class="form-section mt-4">
          <h2 class="text-lg font-bold px-4 mb-2">{{ $t('tournament.formTitle') }}</h2>
          
          <!-- 폼 로딩 상태 -->
          <div v-if="formLoading" class="flex justify-center items-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
          </div>
          
          <!-- 폼 오류 -->
          <div v-else-if="formError" class="p-4 text-center text-red-500">
            {{ formError }}
          </div>
          
          <!-- 동적 폼 컴포넌트 -->
          <DynamicForm 
            v-else-if="formFields.length > 0"
            ref="dynamicFormRef"
            :form-fields="formFields" 
            @submit="handleFormSubmit"
          />
        </div>

        <!-- 이미지 업로드 -->
        <div v-if="tournamentData.image_use_yn === 'Y'" class="form-section">
          <h2 class="text-lg font-bold px-4 mb-2">
            <span :class="{ 'text-[#00A6D1]': tournamentData.image_important_yn === 'Y' }">{{ tournamentData.image_title }}</span>
          </h2>
          <div class="px-4 py-6">
            <imageUpload v-model="uploadedFiles" @error="onUploadError" @files-ready="onFilesReady" />
            <div v-if="showImageError && tournamentData.image_important_yn === 'Y' && (!uploadedFiles || uploadedFiles.length === 0)" class="text-red-500 text-xs mt-1">
              필수 항목입니다
            </div>
          </div>
        </div>

        <!-- 토너먼트 설명 이미지 리스트 -->
        <div v-if="tournamentData.image_explain_list && tournamentData.image_explain_list.length > 0">
          <div v-for="(imageUrl, index) in tournamentData.image_explain_list" :key="index" class="w-full overflow-hidden">
            <img :src="imageUrl" :alt="`tournament explain image ${index + 1}`" class="w-full object-cover">
          </div>
        </div>
        
        <div class="form-section">
          <Policy />
        </div>
      </div>
    </div>

    <Footer />
    
    <!-- 하단 고정 버튼 -->
    <div v-if="tournamentData.is_ended === false" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center">
      <button class="flex-[1_1_35%] py-4 bg-[#6D747D] text-white font-medium" @click="openKakaoTalk">
        {{ $t('tournament.kakaoTalk') }}
      </button>
      <!--<button class="flex-[1_1_35%] py-4 bg-[#6D747D] text-white font-medium" @click="popupCartConfirm">
        {{ $t('common.addToCart') }}
      </button>-->
      <button class="flex-[1_1_65%] py-4 bg-primary text-white font-medium" @click="reservationTournament">
        {{ $t('tournament.submit') }}
      </button>
    </div>

    <div v-if="showCartConfirmPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pl-4 pr-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full relative">
        <p class="mb-6 text-sm">{{ $t('common.addToCartMessage') }}</p>
        <div class="flex justify-end gap-2">
          <button 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700" 
            @click="closeCartConfirmPopup"
          >
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="px-4 py-2 bg-primary text-white rounded-md flex items-center justify-center" 
            @click="submitTournamentAddCart"
            :disabled="isAddingToCart"
          >
            <span v-if="isAddingToCart" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ isAddingToCart ? ($t('common.processing')) : $t('common.addToCart') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 예약 확인 팝업 -->
    <div v-if="showReservationConfirmPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pl-4 pr-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full relative">
        <p class="mb-6 text-sm">선택하신 사항으로 대회를 신청 하시겠습니까?</p>
        <div class="flex justify-end gap-2">
          <button 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700" 
            @click="closeReservationConfirmPopup"
            :disabled="isReserving"
          >
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="px-4 py-2 bg-primary text-white rounded-md flex items-center justify-center" 
            @click="submitReservation"
            :disabled="isReserving"
          >
            <span v-if="isReserving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ isReserving ? ($t('common.processing')) : $t('common.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import NavigationBar from '~/components/common/NavigationBar.vue'
import ImageSlider from '~/components/common/ImageSlider.vue'
import imageUpload from '~/components/common/imageUpload.vue'
import Footer from '~/components/common/Footer.vue'
import DynamicForm from '~/components/tournament/DynamicForm.vue'
import { formatOnlyWonPrice } from '~/utils/formatters'
import ToastMessage from '~/components/common/ToastMessage.vue'
import Policy from '~/components/common/Policy.vue'
import { useI18n } from 'vue-i18n'
import { createError, showError } from '#imports'

interface FileWithPreview extends File {
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
// API 타입 정의
interface TournamentData {
  tournament_idx: number;
  title: string;
  title_en: string;
  price: number;
  price_explain: string;
  start_date: string;
  end_date: string;
  content: string;
  tournament_status: string;
  image_use_yn?: string;
  image_title?: string;
  image_important_yn?: string;
  image_main_list: string[];
  image_explain_list: string[];
  is_ended: boolean;
}
type TournamentApiResponse = TournamentData & { error?: string };
const uploadedFiles = ref<FileWithPreview[]>([])
const serializableFiles = ref<SerializableFile[]>([])

const { locale, t } = useI18n()

definePageMeta({
  name: 'tournament'
})

const route = useRoute()
const router = useRouter()
const tournamentId = route.params.id

// useUserSession 추가
const { loggedIn } = useUserSession();

// 토너먼트 데이터 상태 관리
const tournamentData = ref({
  tournament_idx: 0,
  title: '',
  title_en: '',
  price: 0,
  price_explain: '',
  start_date: '',
  end_date: '',
  content: '',
  tournament_status: 'Y',
  image_use_yn: 'N',
  image_title: '',
  image_important_yn: 'N',
  image_main_list: [],
  image_explain_list: [],
  is_ended: false
})
const isLoading = ref(true)
const error = ref('')
const tournamentTitle = ref('')

// 폼 데이터 상태 관리
const formFields = ref([])
const formLoading = ref(true)
const formError = ref('')
const formSubmitSuccess = ref(false)
const formDataValue = ref('')

// Toast 관련 상태
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 장바구니 확인 팝업 상태 관리
const showCartConfirmPopup = ref(false);
// 장바구니 추가 중 로딩 상태
const isAddingToCart = ref(false);
// 예약 확인 팝업 상태 관리
const showReservationConfirmPopup = ref(false);
// 예약 진행 중 로딩 상태
const isReserving = ref(false);
// 이미지 업로드 에러 표시 상태
const showImageError = ref(false);

// ImageSlider 컴포넌트용 메인 이미지 리스트
const mainImageList = computed(() => {
  return tournamentData.value.image_main_list.map((url, index) => ({
    url: url,
    label: `${locale.value === 'ko' ? tournamentData.value.title : tournamentData.value.title_en} - ${index + 1}`
  }))
})

const popupCartConfirm = () => {
  showCartConfirmPopup.value = true;
}

// 장바구니 확인 팝업 닫기
const closeCartConfirmPopup = () => {
  showCartConfirmPopup.value = false;
};

// 토너먼트 상세 데이터 가져오기
const fetchTournamentDetail = async () => {
  try {
    isLoading.value = true
    const data = await $fetch<TournamentApiResponse>(`/api/tournament/${tournamentId}`)
    
    if ('error' in data && data.error) {
      const message = data.error || '잘못된 페이지입니다.'
      showError(createError({ statusCode: 404, statusMessage: message }))
      return
    }
    
    tournamentData.value = data
    tournamentTitle.value = data.title
    
    // 토너먼트 데이터를 가져온 후 폼 데이터 가져오기
    await fetchFormData()
  } catch (e) {
    console.error('fail code[E5]', e)
    const message = '잘못된 페이지입니다.'
    showError(createError({ statusCode: 404, statusMessage: message }))
  } finally {
    isLoading.value = false
  }
}

// 폼 데이터 가져오기 (tournamentData.content에서 JSON 파싱)
const fetchFormData = async () => {
  try {
    formLoading.value = true
    
    // tournamentData.content에서 JSON 파싱
    if (tournamentData.value.content) {
      try {
        // content 필드의 JSON 문자열을 객체로 파싱
        const formData = JSON.parse(tournamentData.value.content)
        
        // content 배열이 있는지 확인
        if (formData && formData.content && Array.isArray(formData.content)) {
          formFields.value = formData.content
        } else {
          console.error('fail code[E1]', formData)
          formError.value = 'fail code[E1]'
        }
      } catch (parseError) {
        console.error('fail code[E2]', parseError)
        formError.value = 'fail code[E2]'
      }
    } else {
      console.error('fail code[E3]', 'form data is empty')
      formError.value = 'fail code[E3]'
    }
  } catch (e) {
    console.error('fail code[E4]', 'form data fetch error:', e)
    formError.value = 'fail code[E4]'
  } finally {
    formLoading.value = false
  }
}

// 폼 제출 처리
type TournamentFormData = { [key: string]: string | number | boolean | File | FileWithPreview | undefined };
const handleFormSubmit = async (formData: TournamentFormData) => {
  try {
    formDataValue.value = formData;
    if (!checkLoginStatus()) {
      closeCartConfirmPopup()
      return;
    }
    
  } catch (e) {
    console.error('fail code[E5]', 'form submit error:', e);
    showToast.value = true;
    toastMessage.value = t('common.addToCartError');
    toastType.value = 'error';
  }
}

// 이미지 업로드 컴포넌트에서 변환된 파일 받기
const onFilesReady = (files: SerializableFile[]) => {
  serializableFiles.value = files
}

// 이미지 업로드 오류 처리
const onUploadError = (errorMessage: string) => {
  showToast.value = true
  toastMessage.value = errorMessage
  toastType.value = 'error'
}

const requestAddCart = async () => {
  try {
    // 로딩 상태 활성화
    isAddingToCart.value = true;
    
    // 폼 데이터와 tournament_idx를 함께 전송
    const response = await $fetch('/api/tournament/add-cart', {
      method: 'POST',
      body: {
        tournament_idx: tournamentData.value.tournament_idx,
        form_data: formDataValue.value,
        image_files: serializableFiles.value
      }
    })
    
    // Type guard for response.success property
    if ('success' in response && typeof response.success === 'boolean' && response.success) {
      // 성공 메시지 표시
      showToast.value = true;
      toastMessage.value = t('common.addToCartSuccess');
      toastType.value = 'success';
      
      // 장바구니로 이동
      router.push('/shopping_cart');
    } else {
      // 오류 메시지 표시
      showToast.value = true;
      toastMessage.value = t('common.addToCartError');
      toastType.value = 'error';
    }
  } catch (error) {
    console.error('장바구니 추가 중 오류 발생:', error);
    showToast.value = true;
    toastMessage.value = t('common.addToCartError');
    toastType.value = 'error';
  } finally {
    // 로딩 상태 비활성화
    isAddingToCart.value = false;
  }
}

// 동적 폼 컴포넌트 참조
const dynamicFormRef = ref(null)

// 토너먼트 신청 버튼 클릭 핸들러
const reservationTournament = () => {
  if (!checkLoginStatus()) {
    return;
  }
  
  // 이미지 필수 체크
  if (tournamentData.value.image_use_yn === 'Y' && tournamentData.value.image_important_yn === 'Y') {
    if (!uploadedFiles.value || uploadedFiles.value.length === 0) {
      showImageError.value = true;
      return;
    }
  }
  
  // 이미지 에러 초기화
  showImageError.value = false;
  
  if (dynamicFormRef.value && dynamicFormRef.value.submitForm()) {
    // 확인 팝업 표시
    showReservationConfirmPopup.value = true;
  }
}

// 예약 확인 팝업 닫기
const closeReservationConfirmPopup = () => {
  showReservationConfirmPopup.value = false;
};

// 예약 API 호출
const submitReservation = async () => {
  // 이미 처리 중이면 중복 클릭 방지
  if (isReserving.value) return;
  
  try {
    isReserving.value = true;
    
    const response = await $fetch('/api/tournament/reservation', {
      method: 'POST',
      body: {
        tournament_idx: tournamentData.value.tournament_idx,
        form_data: formDataValue.value,
        images: serializableFiles.value,
        total_price: 0
      }
    })
    
    if ('success' in response && typeof response.success === 'boolean' && response.success) {
      // 성공 메시지 표시
      showToast.value = true;
      toastMessage.value = '예약이 완료되었습니다';
      toastType.value = 'success';
      
      // 팝업 닫기
      closeReservationConfirmPopup();
      
      // 예약 페이지로 이동
      setTimeout(() => {
        router.push('/reservation?activeType=T');
      }, 1000);
    } else {
      // 오류 메시지 표시
      showToast.value = true;
      toastMessage.value = '예약 처리 중 오류가 발생했습니다.';
      toastType.value = 'error';
    }
  } catch (error) {
    console.error('예약 처리 중 오류 발생:', error);
    showToast.value = true;
    toastMessage.value = '예약 처리 중 오류가 발생했습니다.';
    toastType.value = 'error';
  } finally {
    isReserving.value = false;
  }
}

// 토너먼트 추가 버튼 클릭 핸들러
const submitTournamentAddCart = () => {
  // 이미 처리 중이면 중복 클릭 방지
  if (isAddingToCart.value) return;
  
  if (dynamicFormRef.value) {
    if(dynamicFormRef.value.submitForm()){
      requestAddCart()
      // 성공적으로 요청이 시작되면 팝업은 닫지 않음 (로딩 표시를 위해)
      // 요청 완료 후 closeCartConfirmPopup()이 호출됨
    } else {
      // 폼 유효성 검사 실패 시 팝업 닫기
      closeCartConfirmPopup()
    }
  }
}

// 컴포넌트 마운트 시 토너먼트 상세 데이터 가져오기
onMounted(() => {
  fetchTournamentDetail()
})

// 카카오톡 문의
const openKakaoTalk = () => {
  // 카카오톡 채널 URL
  location.href = 'https://golft.channel.io/'
}

const checkLoginStatus = () => {
  if (!loggedIn.value) {
    showToast.value = true;
    toastMessage.value = t('common.loginRequired');
    toastType.value = 'warning';
    return false;
  }
  return true;
};
</script>

<style scoped>
.tournament-content img {
  max-width: 100%;
  height: auto;
}

.form-section {
  background-color: #f9f9f9;
  padding-top: 16px;
  padding-bottom: 24px;
}
</style>