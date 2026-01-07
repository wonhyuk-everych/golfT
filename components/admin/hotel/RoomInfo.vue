<template>
  <div class="border-b pb-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">객실 정보</h3>
      <button 
        v-if="isEditing" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
        @click="openRoomCreateModal"
      >
        <span class="mr-1">+</span> 신규 객실 추가
      </button>
    </div>
    <div v-if="localHotel.rooms && localHotel.rooms.length > 0" class="space-y-4">
      <div v-for="(room, index) in localHotel.rooms" :key="room.hotelRoomIdx" class="border p-4 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <h4 v-if="!isEditing" class="text-base font-medium">{{ room.roomName }}</h4>
          <input 
            v-else 
            v-model="localHotel.rooms[index].roomName" 
            type="text" 
            class="text-base font-medium border rounded px-2 py-1 w-64"
          >
          <div class="flex items-center">
            <select 
              v-if="isEditing" 
              v-model="localHotel.rooms[index].useYn" 
              class="border rounded px-2 py-1 mr-2"
            >
              <option value="Y">사용중</option>
              <option value="N">미사용</option>
            </select>
            <span v-else-if="room.useYn === 'Y'" class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">사용중</span>
            <span v-else class="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">미사용</span>
            <NuxtLink
              class="ml-2 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              :to="`/admin/hotel/room/${room.hotelRoomIdx}/price`"
            >
              가격 관리
            </NuxtLink>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">객실명(영문)</p>
            <p v-if="!isEditing" class="font-medium">{{ room.roomNameEn || '-' }}</p>
            <input 
              v-else 
              v-model="localHotel.rooms[index].roomNameEn" 
              type="text" 
              class="font-medium border rounded px-2 py-1 w-full"
            >
          </div>
          <div>
            <p class="text-sm text-gray-500">뷰 타입</p>
            <p v-if="!isEditing" class="font-medium">{{ room.viewType || '-' }}</p>
            <input 
              v-else 
              v-model="localHotel.rooms[index].viewType" 
              type="text" 
              class="font-medium border rounded px-2 py-1 w-full"
            >
          </div>
          <div>
            <p class="text-sm text-gray-500">침대 타입</p>
            <p v-if="!isEditing" class="font-medium">{{ room.bedType || '-' }}</p>
            <input 
              v-else 
              v-model="localHotel.rooms[index].bedType" 
              type="text" 
              class="font-medium border rounded px-2 py-1 w-full"
            >
          </div>
          <div>
            <p class="text-sm text-gray-500">성인 수</p>
            <p v-if="!isEditing" class="font-medium">{{ room.adult ?? '-' }}</p>
            <input
              v-else
              v-model.number="localHotel.rooms[index].adult"
              type="number"
              min="0"
              class="font-medium border rounded px-2 py-1 w-full"
            >
          </div>
          <div>
            <p class="text-sm text-gray-500">아동 수</p>
            <p v-if="!isEditing" class="font-medium">{{ room.children ?? '-' }}</p>
            <input
              v-else
              v-model.number="localHotel.rooms[index].children"
              type="number"
              min="0"
              class="font-medium border rounded px-2 py-1 w-full"
            >
          </div>
          <div>
            <p class="text-sm text-gray-500">조식 여부</p>
            <p v-if="!isEditing" class="font-medium">{{ room.breakfastYn === 'Y' ? '포함' : '미포함' }}</p>
            <select 
              v-else 
              v-model="localHotel.rooms[index].breakfastYn" 
              class="font-medium border rounded px-2 py-1 w-full"
            >
              <option value="Y">포함</option>
              <option value="N">미포함</option>
            </select>
          </div>
        </div>
        <div class="mt-4">
          <!-- 이미지 업로드 컴포넌트 (편집 모드) -->
          <div v-if="isEditing">
            <ImageUpload
              :ref="el => { if (el) imageUploadComponents[index] = el }"
              title="객실 이미지"
              :images="getRoomImages(room)"
              :is-editing="true"
              id-field="hotelRoomImageIdx"
              :alt-text="room.roomName || '객실 이미지'"
              :entity-id="room.hotelRoomIdx"
              entity-type="hotel_room"
              @update:images="(newImages) => updateRoomImages(index, newImages)"
              @upload-complete="(success, errorMessage) => handleUploadComplete(success, errorMessage, index)"
            />
          </div>
          
          <!-- 이미지 표시 (보기 모드) -->
          <div v-else>
            <!-- Main room image -->
            <img v-if="room.roomImageUrl" :src="room.roomImageUrl" :alt="room.roomName" class="w-64 h-40 object-cover rounded-lg mb-2">
            
            <!-- Horizontal scrollable room images -->
            <div v-if="room.roomImages && room.roomImages.length > 0" class="overflow-x-auto whitespace-nowrap pb-2">
              <div class="inline-flex space-x-3">
                <div v-for="image in room.roomImages" :key="image.imageUrl" class="inline-block">
                  <img :src="image.imageUrl || image.image_url" :alt="room.roomName" class="w-64 h-40 object-cover rounded-lg">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-8 text-gray-500">
      등록된 객실 정보가 없습니다.
    </div>
  </div>
  
  <!-- 객실 생성 모달 -->
  <div v-if="showRoomCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">신규 객실 추가</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="closeRoomCreateModal">
            <span class="text-xl">&times;</span>
          </button>
        </div>
        <RoomCreate 
          :hotel-idx="localHotel.hotelIdx" 
          @room-created="handleRoomCreated" 
          @close="closeRoomCreateModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from '#imports'
import RoomCreate from './RoomCreate.vue'
import ImageUpload from '~/components/admin/common/imageUpload.vue'

const props = defineProps({
  hotel: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})


// 로컬 호텔 데이터 생성 (프롭 변형 방지)
const localHotel = ref(JSON.parse(JSON.stringify(props.hotel)))

// 호텔 데이터가 변경되면 로컬 데이터도 업데이트
watch(() => props.hotel, (newVal: unknown) => {
  localHotel.value = JSON.parse(JSON.stringify(newVal))
}, { deep: true })

// 수정된 데이터 전달
const emit = defineEmits(['update:hotel', 'update:is-editing'])

// 로컬 데이터가 변경될 때마다 부모 컴포넌트로 즉시 전달
watch(() => localHotel.value, () => {
  if (props.isEditing) {
    emit('update:hotel', localHotel.value)
  }
}, { deep: true })

// 객실 생성 모달 관련 상태 및 함수
const showRoomCreateModal = ref(false)

// 모달 열기
const openRoomCreateModal = () => {
  showRoomCreateModal.value = true
}

// 모달 닫기
const closeRoomCreateModal = () => {
  showRoomCreateModal.value = false
}

// 객실 생성 완료 처리
const handleRoomCreated = (newRoom) => {
  // 새 객실을 로컬 호텔 데이터에 추가
  if (!localHotel.value.rooms) {
    localHotel.value.rooms = []
  }
  localHotel.value.rooms.push(newRoom)
  
  // 모달 닫기
  closeRoomCreateModal()
}

// 이미지 업로드 관련 기능

// 이미지 업로드 컴포넌트 참조 배열
const imageUploadComponents = ref<Record<number, InstanceType<typeof ImageUpload> | null>>({});

// 이미지 형식 정의
interface RoomImage {
  hotelRoomImageIdx?: number;
  image_url: string;
  imageUrl?: string;
  sort: number;
  use_yn: string;
  main_yn?: string;
  file?: File | null;
  [key: string]: unknown; // 추가 필드를 위한 인덱스 서문
}

// 객실 이미지 가져오기 (기존 이미지 형식 변환)
const getRoomImages = (room: Record<string, unknown>): RoomImage[] => {
  // roomImages 배열이 있으면 사용
  if (room.roomImages && Array.isArray(room.roomImages)) {
    return room.roomImages.map((img: Record<string, unknown>, idx: number) => ({
        hotelRoomImageIdx: img.hotelRoomImageIdx,
        image_url: img.imageUrl || img.image_url || '',
        sort: img.sort || idx + 1,
        use_yn: img.use_yn || 'Y',
        main_yn: img.main_yn || (idx === 0 ? 'Y' : 'N'),
        file: img.file
    }));
  }
  
  // roomImages가 없고 roomImageUrl이 있는 경우 단일 이미지 생성
  if (room.roomImageUrl) {
    return [{
      image_url: room.roomImageUrl,
      sort: 1,
      use_yn: 'Y',
      main_yn: 'Y',
      file: null
    }];
  }
  
  // 이미지가 없는 경우 빈 배열 반환
  return [];
};

// 이미지 업데이트 핸들러
const updateRoomImages = (roomIndex: number, newImages: RoomImage[]) => {
  if (!localHotel.value.rooms[roomIndex].roomImages) {
    localHotel.value.rooms[roomIndex].roomImages = [];
  }
  
  // 이미지 배열 업데이트
  localHotel.value.rooms[roomIndex].roomImages = newImages;
  
  // 메인 이미지가 있으면 roomImageUrl도 업데이트
  const mainImage = newImages.find(img => img.main_yn === 'Y');
  if (mainImage) {
    localHotel.value.rooms[roomIndex].roomImageUrl = mainImage.image_url;
  }
};

// 이미지 업로드 완료 핸들러
const handleUploadComplete = (success: boolean, errorMessage?: string, _roomIndex?: number) => {
  if (!success && errorMessage) {
    alert(`이미지 업로드 오류: ${errorMessage}`);
  }
};

// 객실 정보 업데이트 전 이미지 업로드 처리
const uploadAllRoomImages = async () => {
  if (!isEditing.value) return true;
  
  // 각 객실의 이미지 업로드 처리
  for (const [index, room] of localHotel.value.rooms.entries()) {
    const uploadComponent = imageUploadComponents.value[index];
    if (uploadComponent && room.roomImages && room.roomImages.length > 0) {
      const uploadSuccess = await uploadComponent.uploadAllImages();
      if (!uploadSuccess) {
        alert(`객실 "${room.roomName}"의 이미지 업로드 중 오류가 발생했습니다.`);
        return false;
      }
    }
  }
  
  return true;
};

// 객실 정보 저장 함수
const saveRoomChanges = async (roomIndex: number) => {
  if (!props.isEditing) return;
  
  try {
    const room = localHotel.value.rooms[roomIndex];
    const uploadComponent = imageUploadComponents.value[roomIndex];
    if (uploadComponent) {
      try {
      const uploadSuccess = await uploadComponent.uploadAllImages();
      if (!uploadSuccess) {
        alert(`객실 "${room.roomName}"의 이미지 업로드 중 오류가 발생했습니다.`);
        return;
      }
      } catch (error) {
        console.error(`Room ${roomIndex} - Upload error:`, error);
        alert(`객실 "${room.roomName}"의 이미지 업로드 중 오류가 발생했습니다.`);
        return;
      }
    }
    
    const formattedImages = room.roomImages?.map(img => {
      // 서버가 기대하는 형식으로 객체 변환
      return {
        hotelRoomImageIdx: img.hotelRoomImageIdx,
        image_url: img.image_url || img.imageUrl, // 두 형식 모두 지원
        sort: img.sort || 0,
        main_yn: img.main_yn || 'N',
        use_yn: img.use_yn || 'Y'
      };
    }) || [];
    
    console.log('Sending room images:', formattedImages);
    
    // API 호출하여 객실 정보 업데이트
    const response = await $fetch(`/api/admin/hotel/room/${room.hotelRoomIdx}`, {
      method: 'PUT',
      body: {
        ...room,
        hotelIdx: props.hotel.hotelIdx,
        roomImages: formattedImages
      }
    });
    
    console.log('Room update response:', response);
    
    // 성공 메시지 표시
    if (response.success) {
      // 업데이트된 객실 정보로 교체
      localHotel.value.rooms[roomIndex] = response.room;
      alert(`객실 "${room.roomName}" 정보가 성공적으로 저장되었습니다.`);
    }
    
  } catch (error) {
    console.error('객실 정보 저장 오류:', error);
    alert('객실 정보 저장 중 오류가 발생했습니다.');
  }
};

// 모든 객실 정보 저장
const saveAllRoomChanges = async () => {
  if (!props.isEditing) return true;
  
  try {
    // 각 객실 정보 저장
    for (let i = 0; i < localHotel.value.rooms.length; i++) {
      await saveRoomChanges(i);
    }
    return true;
  } catch (error) {
    console.error('객실 정보 저장 오류:', error);
    return false;
  }
};

// 호텔 정보 저장 전에 이미지 업로드 처리를 위해 함수 노출
defineExpose({
  uploadAllRoomImages,
  saveAllRoomChanges
});
</script>
