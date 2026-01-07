<template>
  <div class="max-w-3xl mx-auto py-8 space-y-8">
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">QnA 상세</h2>
      <div v-if="loading" class="text-center text-gray-400">로딩 중...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-else>
        <div class="mb-4">
          <span class="text-sm text-gray-500">유형:</span>
          <span class="ml-2 font-semibold">{{ qna?.qna_type_name_kr }}</span>
        </div>
        <div class="mb-4">
          <span class="text-sm text-gray-500">제목:</span>
          <span class="ml-2 font-semibold">{{ qna?.title }}</span>
        </div>
        <div class="mb-4">
          <span class="text-sm text-gray-500">작성자:</span>
          <span class="ml-2">{{ qna?.member_name_kr }}</span>
          <span class="ml-6 text-sm text-gray-500">등록일:</span>
          <span class="ml-2">{{ formatDate(qna?.created_at) }}</span>
        </div>
        <div class="mb-4">
          <span class="text-sm text-gray-500">내용:</span>
          <div class="mt-2 p-3 bg-gray-50 rounded border min-h-[80px] whitespace-pre-line">{{ qna?.content }}</div>
        </div>
        <div v-if="images.length > 0" class="mb-4">
          <span class="text-sm text-gray-500">첨부 이미지:</span>
          <div class="flex flex-wrap gap-2 mt-2">
            <img v-for="img in images" :key="img.image_url" :src="img.image_url" class="w-32 h-32 object-cover rounded border" />
          </div>
        </div>
        <div class="mb-4">
          <span class="text-sm text-gray-500">답변 상태:</span>
          <span :class="getAnswerStatusClass(qna?.answer_status)" class="ml-2 font-semibold">{{ getAnswerStatusText(qna?.answer_status) }}</span>
        </div>
        <div v-if="qna?.answer_status === 'C'" class="mb-4">
          <div class="mb-2 text-sm text-gray-500">답변</div>
          <div class="p-3 bg-green-50 rounded border min-h-[80px] whitespace-pre-line">{{ qna?.answer }}</div>
          <div class="mt-2 text-xs text-gray-400">
            답변자: {{ qna?.admin_member_name_kr || '-' }} / 답변일: {{ formatDate(qna?.answer_date) }}
          </div>
        </div>
        <div v-else class="mb-4">
          <div class="mb-2 text-sm text-gray-500">답변 작성</div>
          <textarea v-model="answerInput" rows="4" class="w-full border rounded p-2" placeholder="답변 내용을 입력하세요"></textarea>
          <div class="mt-2 flex justify-end">
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" @click="submitAnswer" :disabled="answerLoading">
              {{ answerLoading ? '저장 중...' : '답변 저장' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Define this page to use admin layout
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute();
const router = useRouter();
const qna_idx = route.params.qna_idx;

const qna = ref<any>(null);
const images = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const answerInput = ref('');
const answerLoading = ref(false);

const fetchDetail = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await $fetch('/api/qna/detail', { params: { qna_idx } });
    if (response.error) {
      error.value = response.error;
      return;
    }
    qna.value = response.qna;
    images.value = response.images || [];
    answerInput.value = '';
  } catch (e: any) {
    error.value = e?.message || '상세 조회 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
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

const submitAnswer = async () => {
  if (!answerInput.value.trim()) {
    alert('답변 내용을 입력하세요.');
    return;
  }
  answerLoading.value = true;
  try {
    // TODO: 실제 관리자 정보에서 member_idx를 가져와야 함
    await $fetch('/api/admin/qna/answer', {
      method: 'POST',
      body: {
        qna_idx,
        answer: answerInput.value,
        // answer_member_idx: ... (로그인 세션에서 추출)
      }
    });
    alert('답변이 저장되었습니다.');
    await fetchDetail();
  } catch (e: any) {
    alert(e?.message || '답변 저장 중 오류가 발생했습니다.');
  } finally {
    answerLoading.value = false;
  }
};

onMounted(() => {
  fetchDetail();
});
</script>

<style scoped>
</style>
