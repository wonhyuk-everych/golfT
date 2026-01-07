<template>
  <div class="space-y-6">
    <!-- 공지사항 검색 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">공지사항 검색</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">공지 유형</label>
          <select v-model="searchParams.notice_type" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">전체</option>
            <option v-for="type in noticeTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">사용 여부</label>
          <select v-model="searchParams.use_yn" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">전체</option>
            <option value="Y">사용</option>
            <option value="N">미사용</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">제목 또는 내용</label>
          <input
            v-model="searchParams.searchWord"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="제목 또는 내용 입력"
          />
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          class="mr-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
          @click="handleReset"
        >
          초기화
        </button>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          @click="handleSearch"
        >
          검색
        </button>
      </div>
    </div>

    <!-- 공지사항 결과 테이블 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="flex justify-end mb-4">
        <button type="button" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" @click="goAdd">공지사항 등록</button>
      </div>
      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용 여부</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="notice in noticeList" :key="notice.notice_idx" class="hover:bg-gray-50 cursor-pointer" @click="goDetail(notice.notice_idx)">
              <td class="px-6 py-4 whitespace-nowrap">{{ getNoticeTypeLabel(notice.notice_type) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ notice.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ notice.use_yn === 'Y' ? '사용' : '미사용' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(notice.created_at) }}</td>
            </tr>
            <tr v-if="noticeList.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-400">검색 결과가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goAdd = () => {
  router.push('/admin/notice/add');
};

// 공지 유형 예시 (필요시 API로 대체)
const noticeTypes = [
  { value: 'N', label: '공지사항' },
  { value: 'R', label: '예약' },
  { value: 'T', label: '대회' },
  { value: 'E', label: '이벤트' },
];

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface NoticeItem {
  notice_idx: number;
  notice_type: string;
  title: string;
  content: string;
  use_yn: string;
  created_at: string;
}

const noticeList = ref<NoticeItem[]>([]);
const searchParams = ref({
  notice_type: '',
  use_yn: '',
  searchWord: '',
});

const fetchNoticeList = async () => {
  const params: any = {};
  if (searchParams.value.notice_type) params.notice_type = searchParams.value.notice_type;
  if (searchParams.value.use_yn) params.use_yn = searchParams.value.use_yn;
  if (searchParams.value.searchWord) params.searchWord = searchParams.value.searchWord;

  try {
    const response = await $fetch('/api/admin/notice/search', { params });
    noticeList.value = response.list || [];
  } catch (e) {
    noticeList.value = [];
  }
};

const handleSearch = () => {
  fetchNoticeList();
};

const handleReset = () => {
  searchParams.value = {
    notice_type: '',
    use_yn: '',
    searchWord: '',
  };
  fetchNoticeList();
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString();
};

const getNoticeTypeLabel = (type: string) => {
  const found = noticeTypes.find(t => t.value === type);
  return found ? found.label : type;
};

const goDetail = (notice_idx: number) => {
  router.push(`/admin/notice/${notice_idx}`);
};

onMounted(() => {
  fetchNoticeList();
});
</script>

<style>
</style>