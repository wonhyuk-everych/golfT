<template>
  <div class="space-y-6">
    <!-- 객실 이미지 업로드 -->
    <div>
      <ImageUpload
        ref="imageUploadComponent"
        title="객실 이미지"
        :images="roomImages"
        :is-editing="true"
        id-field="hotelRoomImageIdx"
        :alt-text="newRoom.roomName || '객실 이미지'"
        :entity-id="props.hotelIdx"
        entity-type="hotel_room"
        @update:images="updateImages"
        @upload-complete="handleUploadComplete"
      />
    </div>
    
    <!-- 객실 정보 폼 -->
    <form class="space-y-4" @submit.prevent="createRoom">
      <!-- 객실명 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">객실명 (필수)</label>
          <input 
            v-model="newRoom.roomName" 
            type="text" 
            required 
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">객실명(영문)</label>
          <input 
            v-model="newRoom.roomNameEn" 
            type="text" 
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
      </div>
      
      <!-- 뷰 타입, 침대 타입 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">뷰 타입</label>
          <input 
            v-model="newRoom.viewType" 
            type="text" 
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">침대 타입</label>
          <input 
            v-model="newRoom.bedType" 
            type="text" 
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
      </div>

      <!-- 인원 (성인/아동) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">성인 수</label>
          <input
            v-model.number="newRoom.adult"
            type="number"
            min="0"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">아동 수</label>
          <input
            v-model.number="newRoom.children"
            type="number"
            min="0"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
      </div>
      
      <!-- 조식 여부, 사용 여부 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">조식 여부</label>
          <select 
            v-model="newRoom.breakfastYn" 
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Y">포함</option>
            <option value="N">미포함</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">사용 여부</label>
          <select 
            v-model="newRoom.useYn" 
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Y">사용중</option>
            <option value="N">미사용</option>
          </select>
        </div>
      </div>
      
      <!-- 버튼 -->
      <div class="flex justify-end space-x-3 pt-4">
        <button 
          type="button" 
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          @click="$emit('close')" 
        >
          취소
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '저장중...' : '저장' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'
import ImageUpload from '~/components/admin/common/imageUpload.vue'

const props = defineProps({
  hotelIdx: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['room-created', 'close'])

// 새 객실 데이터
const newRoom = ref({
  hotelIdx: props.hotelIdx,
  roomName: '',
  roomNameEn: '',
  roomProductPrice: 0,
  roomSalePrice: 0,
  viewType: '',
  bedType: '',
  adult: 2,
  children: 0,
  breakfastYn: 'N',
  useYn: 'Y'
})

// 객실 이미지 관리
const roomImages = ref<Array<RoomImage>>([])

// 이미지 업로드 컴포넌트 참조
const imageUploadComponent = ref<InstanceType<typeof ImageUpload> | null>(null)

// 이미지 형식 정의
interface RoomImage {
  hotelRoomImageIdx?: number;
  image_url: string;
  sort: number;
  use_yn: string;
  file?: File | null;
  [key: string]: unknown; // 추가 필드를 위한 인덱스 서문 - any 대신 unknown 사용
}

// 이미지 업데이트 핸들러 (ImageUpload 컴포넌트에서 전달받음)
const updateImages = (newImages: Array<RoomImage>) => {
  if (newImages && Array.isArray(newImages)) {
    roomImages.value = newImages;
  }
}

// 이미지 업로드 완료 핸들러
const handleUploadComplete = (success: boolean, errorMessage?: string) => {
  if (!success && errorMessage) {
    alert(`이미지 업로드 오류: ${errorMessage}`)
  }
}

const isSubmitting = ref(false)

// 객실 생성 함수
const createRoom = async () => {
  try {
    isSubmitting.value = true

    // 이미지 데이터 준비
    let uploadSuccess = true;
    if (imageUploadComponent.value && roomImages.value.length > 0) {
      uploadSuccess = await imageUploadComponent.value.uploadAllImages();
    }

    if (!uploadSuccess) {
      alert('이미지 업로드 중 오류가 발생했습니다.');
      isSubmitting.value = false;
      return;
    }

    // 이미지 데이터 준비
    const imageData: RoomImage[] = roomImages.value.map(img => ({
      image_url: img.image_url,
      sort: img.sort || 0,
      use_yn: img.use_yn || 'Y',
      file: img.file || null
    }));

    // API 호출 (이미지 포함)
    const response = await $fetch('/api/admin/hotel/room', {
      method: 'POST',
      body: {
        ...newRoom.value,
        roomImages: imageData
      }
    });
    
    // 생성된 객실 데이터를 부모에게 전달
    emit('room-created', response.room);
    
  } catch (error) {
    console.error('Error creating room:', error);
    alert('객실 생성 중 오류가 발생했습니다.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>