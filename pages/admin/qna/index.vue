<template>
  <div class="space-y-6">
    <!-- QnA 검색 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">QnA 검색</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">QnA 유형</label>
          <select v-model="searchParams.qna_type_idx" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">전체</option>
            <option v-for="type in qnaTypes" :key="type.qna_type_idx" :value="type.qna_type_idx">
              {{ type.name_kr }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">답변 상태</label>
          <select v-model="searchParams.answer_status" class="w-full px-3 py-2 border border-gray-300 rounded-md">
  <option value="">전체</option>
  <option value="C">답변 완료</option>
  <option value="W">답변 대기</option>
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

    <!-- QnA 결과 테이블 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">답변상태</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="qna in qnaList" :key="qna.qna_idx" class="hover:bg-gray-50 cursor-pointer" @click="goDetail(qna.qna_idx)">
              <td class="px-6 py-4 whitespace-nowrap">{{ qna.qna_type_name_kr }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ qna.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ qna.member_name_kr }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(qna.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getAnswerStatusClass(qna.answer_status)">
                  {{ getAnswerStatusText(qna.answer_status) }}
                </span>
              </td>
            </tr>
            <tr v-if="qnaList.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-400">검색 결과가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

interface QnaType {
  qna_type_idx: number;
  name_kr: string;
  name_en: string;
}

interface QnaItem {
  qna_idx: number;
  qna_type_name_kr: string;
  qna_type_name_en: string;
  title: string;
  content: string;
  created_at: string;
  answer_status: string;
  member_name_kr: string;
}

const qnaTypes = ref<QnaType[]>([]);
const qnaList = ref<QnaItem[]>([]);
const searchParams = ref({
  qna_type_idx: '',
  answer_status: '',
  searchWord: '',
});

const fetchQnaTypes = async () => {
  try {
    const response = await $fetch('/api/qna/qna-types');
    qnaTypes.value = response.qnaTypes || [];
  } catch (e) {
    qnaTypes.value = [];
  }
};

const fetchQnaList = async () => {
  const params: any = {};
  if (searchParams.value.qna_type_idx) params.qna_type_idx = searchParams.value.qna_type_idx;
  if (searchParams.value.answer_status) params.answer_status = searchParams.value.answer_status;
  if (searchParams.value.searchWord) params.searchWord = searchParams.value.searchWord;

  try {
    const response = await $fetch('/api/admin/qna/search', { params });
    qnaList.value = response.list || [];
  } catch (e) {
    qnaList.value = [];
  }
};

const handleSearch = () => {
  fetchQnaList();
};

const handleReset = () => {
  searchParams.value = {
    qna_type_idx: '',
    answer_status: '',
    searchWord: '',
  };
  fetchQnaList();
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString();
};

const getAnswerStatusClass = (status: string) => {
  if (status === 'C') return 'text-green-600 font-semibold';
  if (status === 'W') return 'text-red-500 font-semibold';
  return '';
};
const getAnswerStatusText = (status: string) => {
  if (status === 'C') return '답변 완료';
  if (status === 'W') return '답변 대기';
  return '알 수 없음';
};

import { useRouter } from 'vue-router';
const router = useRouter();

const goDetail = (qna_idx: number) => {
  router.push(`/admin/qna/${qna_idx}`);
};

onMounted(() => {
  fetchQnaTypes();
  fetchQnaList();
});
</script>

<style>
</style>