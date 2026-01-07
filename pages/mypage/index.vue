<template>
  <div class="mypage-page bg-white h-[100vh]">
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('mypage.title')" back-color="black"/>

    <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />

    <div class="flex flex-col bg-white gap-6 pt-6 pl-6 mt-[65px]">
      <div class="flex flex-col gap-4">
        <!-- 프로필 정보 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- 프로필 이미지 -->
            <div class="w-14 h-14 bg-red-400 rounded-full flex items-center justify-center">
              <div class="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              </div>
            </div>
            <!-- 사용자 정보 -->
            <div class="flex flex-col gap-0.5 py-1">
              <h2 class="text-black text-xl font-bold leading-6 tracking-tight">
                {{ user?.name_kr }}
              </h2>
              <p class="text-gray-400 text-sm leading-5 tracking-tight">
                멤버쉽
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Divider :offset-px="0"/>

    <!-- 예약 정보 섹션 -->
    <div class="flex flex-col bg-white gap-6">
      <!-- 섹션 타이틀 -->
      <div class="px-6 flex items-center justify-between">
        <h3 class="text-black text-base leading-6 tracking-tight font-bold">{{ $t('mypage.memberInfo') }}</h3>
        
      </div>

      <!-- 회원정보 리스트 -->
      <div class="flex flex-col gap-3">
        <!-- 동적 렌더링 -->
        <div 
          v-for="(item, index) in memberInfo" 
          :key="index"
          class="flex items-left gap-2 px-6 py-1.5"
        >
          <div class="flex items-left gap-4 w-full">
            <div class="flex items-left w-20 flex-shrink-0">
              <span class="text-sm font-normal text-gray-400">{{ item.label }}</span>
            </div>
            <div class="flex items-left flex-1">
              <template v-if="item.key === 'name_kr'">
                <template v-if="isEditingName">
                  <input v-model="editName" class="border rounded px-2 py-1 text-sm w-32" />
                  <button class="ml-2 text-xs font-normal text-cyan-600 hover:text-cyan-700" @click="handleEditComplete">{{ $t('mypage.complete') }}</button>
                </template>
                <template v-else>
                  <span class="text-sm font-normal text-gray-900">{{ item.value }}</span>
                  <button class="ml-2 text-xs font-normal text-cyan-600 hover:text-cyan-700" @click="handleEdit">{{ $t('mypage.edit') }}</button>
                </template>
              </template>
              <template v-else>
                <span class="text-sm font-normal text-gray-900">{{ item.value }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Divider :offset-px="0"/>

    <div class="flex flex-col bg-white gap-6">
      <!-- 섹션 타이틀 -->
      <div class="px-6 flex items-center justify-between">
        <h3 class="text-black text-base leading-6 tracking-tight font-bold">{{ $t('mypage.settings') }}</h3>
      </div>

      <div class="flex flex-col gap-3">
        <!-- 언어 변경 -->
        <button 
          class="flex flex-col justify-center gap-2 px-6 py-1.5 hover:bg-gray-50 transition-colors"
          @click="handleWithdrawal"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col justify-center flex-1">
              <span class="text-gray-400 text-sm leading-5 tracking-tight text-left">{{ $t('mypage.withdrawal') }}</span>
            </div>
            <div class="w-5 h-5 flex items-center justify-center">
              <img src="~/assets/icons/arrow-right-gray.svg" alt="arrow" class="w-5 h-4 text-gray-700" />
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import NavigationBar from '~/components/common/NavigationBar.vue'
import ToastMessage from '~/components/common/ToastMessage.vue'
import Divider from '~/components/common/Divider.vue'

definePageMeta({
  middleware: ['auth'],
  title: 'mypage'
})

const { t } = useI18n()

useLayout('mypage')

const { user, fetch: refreshSession } = useUserSession()


const memberInfo = ref([
  { label: t('mypage.name'), value: '', key: 'name_kr' },
  { label: t('mypage.phone'), value: '', key: 'phone' },
  { label: t('mypage.birthday'), value: '', key: 'birthday' },
  { label: t('mypage.gender'), value: '', key: 'gender' },
])

const loading = ref(true)
const error = ref('')

// Toast 관련 상태
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

onMounted(async () => {
  try {
    loading.value = true
    error.value = ''
    if (!user.value || !user.value.member_idx) {
      error.value = '로그인 정보가 올바르지 않습니다.'
      return
    }
    const data = await $fetch(`/api/member/${user.value.member_idx}`)
    memberInfo.value = [
      { label: t('mypage.name'), value: data.name_kr || '', key: 'name_kr' },
      { label: t('mypage.phone'), value: data.phone || '', key: 'phone' },
      { label: t('mypage.birthday'), value: data.birthday || '', key: 'birthday' },
      { label: t('mypage.gender'), value: data.gender === 'M' ? t('mypage.genderMale') : data.gender === 'F' ? t('mypage.genderFemale') : '', key: 'gender' },
    ]
  } catch (e) {
    error.value = '회원 정보를 불러오는 데 실패했습니다.'
  } finally {
    loading.value = false
  }
})

const isEditingName = ref(false)
const editName = ref('')

const handleEdit = () => {
  const nameItem = memberInfo.value.find(item => item.key === 'name_kr')
  editName.value = nameItem ? nameItem.value : ''
  isEditingName.value = true
}

const handleEditComplete = async () => {
  if (!user.value || !user.value.member_idx) return
  try {
    const res = await $fetch(`/api/member/${user.value.member_idx}`, {
      method: 'PUT',
      body: { name_kr: editName.value }
    })
    if (res.success) {
      // 이름 갱신
      memberInfo.value = memberInfo.value.map(item =>
        item.key === 'name_kr' ? { ...item, value: editName.value } : item
      )
      isEditingName.value = false
      showToast.value = true
      toastMessage.value = t('mypage.nameChangeSuccess')
      toastType.value = 'success'
    } else {
      showToast.value = true
      toastMessage.value = t('mypage.nameChangeFailed')
      toastType.value = 'error'
    }
  } catch (e) {
    console.error('Name change error:', e)
    showToast.value = true
    toastMessage.value = t('mypage.nameChangeError')
    toastType.value = 'error'
  }
}

const handleWithdrawal = async () => {
  try {
    // 회원 탈퇴 API 호출
    const res = await $fetch<{ success: boolean }>('/api/member/withdrawal', { method: 'POST' })
    if (res && res.success) {
      // 로그아웃 처리
      await $fetch('/api/auth/logout', { method: 'POST' })
      await refreshSession()
      // 성공 토스트
      showToast.value = true
      toastMessage.value = t('mypage.withdrawalSuccess')
      toastType.value = 'success'
      // 메인으로 이동
      await navigateTo('/')
    } else {
      showToast.value = true
      toastMessage.value = t('mypage.withdrawalFailed')
      toastType.value = 'error'
    }
  } catch (e) {
    console.error('Withdrawal error:', e)
    showToast.value = true
    toastMessage.value = t('mypage.withdrawalError')
    toastType.value = 'error'
  }
}

</script>

<style>

</style>