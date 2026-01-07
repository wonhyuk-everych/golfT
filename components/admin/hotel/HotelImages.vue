<template>
  <div class="border-b border-gray-200 pb-5">
    <ImageUpload
      ref="imageUploadComponent"
      title="호텔 이미지"
      :images="imagesForUpload"
      :is-editing="isEditing"
      id-field="hotelImageIdx"
      :alt-text="hotel?.nameKr || '호텔 이미지'"
      :entity-id="hotel?.hotelIdx"
      entity-type="hotel"
      @update:images="updateImages"
      @upload-complete="handleUploadComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from '#imports';
import ImageUpload from '~/components/admin/common/imageUpload.vue';

const props = defineProps({
  hotel: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});


const emit = defineEmits<{
  (e: 'update:hotel', value: any): void;
  (e: 'upload-complete', success: boolean, error?: string): void;
}>();

// 이미지 업로드 컴포넌트 참조
const imageUploadComponent = ref<InstanceType<typeof ImageUpload> | null>(null);

// 타입 정의
interface HotelImageInput {
  hotelImageIdx?: number;
  imageUrl?: string;
  sort?: number;
  mainYn?: string;
  useYn?: string;
  file?: File | null;
}

interface UploadImageItem {
  hotelImageIdx?: number;
  image_url: string;
  sort?: number;
  main_yn?: string;
  use_yn?: string;
  file?: File | null;
}

// 편집용 호텔 이미지 상태 관리
const editedHotelImages = ref<HotelImageInput[]>([]);

// 수정 모드 진입 시 기존 호텔 이미지를 복사
watch(
  () => props.isEditing,
  (newVal, _) => {
    if (newVal && props.hotel && Array.isArray(props.hotel.images)) {
      // hotel.images를 변환하여 editedHotelImages에 복사
      editedHotelImages.value = props.hotel.images.map(img => ({ ...img }));
    }
    // 수정 모드 해제 시에는 필요에 따라 초기화할 수 있음
    // else if (!newVal) {
    //   editedHotelImages.value = [];
    // }
  },
  { immediate: true }
);
const error = ref<string | null>(null);

// 호텔 이미지 형식 변환 (호텔 이미지 형식 -> 공통 이미지 업로드 컴포넌트 형식)
const convertHotelImages = (hotelImages: HotelImageInput[]): UploadImageItem[] => {
  if (!hotelImages || !Array.isArray(hotelImages)) return [];
  
  return hotelImages.map(img => ({
    hotelImageIdx: img.hotelImageIdx,
    image_url: img.imageUrl || '',
    sort: img.sort || 0,
    main_yn: img.mainYn || 'N',
    use_yn: img.useYn || 'Y',
    file: img.file || null
  }));
};

// 렌더마다 새 배열이 생성되지 않도록 메모이즈된 계산 속성 사용
const imagesForUpload = computed<UploadImageItem[]>(() => {
  const base = props.isEditing ? editedHotelImages.value : (props.hotel.images || []);
  return convertHotelImages(base as HotelImageInput[]);
});

// 이미지 업데이트 핸들러 (ImageUpload 컴포넌트에서 전달받음)
const updateImages = (newImages: UploadImageItem[]) => {
  if (newImages && Array.isArray(newImages)) {
    // 이미지 형식 변환 (공통 이미지 업로드 컴포넌트 형식 -> 호텔 이미지 형식)
    const convertedImages = newImages.map(img => ({
      hotelImageIdx: img.hotelImageIdx,
      hotelIdx: props.hotel.hotelIdx,
      imageType: 'hotel',
      imageUrl: img.image_url,
      sort: img.sort || 0,
      mainYn: img.main_yn || 'N',
      useYn: img.use_yn || 'Y',
      file: img.file || null
    }));
    
    editedHotelImages.value = convertedImages;
    
    // 부모 컴포넌트에 업데이트된 호텔 정보 전달
    const updatedHotel = { ...props.hotel, images: convertedImages };
    emit('update:hotel', updatedHotel);
  }
};

// 이미지 업로드 완료 핸들러
const handleUploadComplete = (success: boolean, errorMessage?: string) => {
  if (!success && errorMessage) {
    error.value = errorMessage;
  }
  emit('upload-complete', success, errorMessage);
};

// 모든 이미지 업로드 처리 함수 (외부에서 호출 가능)
const uploadAllImages = async () => {
  if (imageUploadComponent.value) {
    return await imageUploadComponent.value.uploadAllImages();
  }
  return false;
};

// 외부에서 호출 가능한 함수 노출
defineExpose({ uploadAllImages });
</script>
