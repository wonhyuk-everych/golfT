<script setup lang="ts">
import ToastMessage from '~/components/common/ToastMessage.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

interface Category {
  id: number;
  icon: string;
  name: string;
  link: string;
  overflow?: boolean;
}

const props = defineProps<{
  categories: Category[]
}>();

const getIconUrl = (icon: string) => {
  return `/images/category/${icon}`
}

const navigateToCategory = (id: number, link: string) => {
  if(link){
    // Open external links in a new tab, otherwise use Nuxt navigation
    if (/^https?:\/\//i.test(link)) {
      window.open(link, '_blank', 'noopener,noreferrer')
    } else {
      navigateTo(link)
    }
    return
  }else{
    showToast.value = true;
    toastMessage.value = t('common.serviceNotReady');
    toastType.value = 'warning';
  }
}
</script>

<template>
  <ToastMessage 
      v-model:show="showToast" 
      :message="toastMessage" 
      :type="toastType" 
      :duration="3000" 
    />

  <section class="px-4 py-8">
    <div class="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
      <div
        v-for="category in categories" 
        :key="category.id" 
        class="flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer"
        @click="navigateToCategory(category.id, category.link)">
        <template v-if="!category.overflow">
          <div class="w-16 h-16 bg-[#F0F3F7] rounded-[25px] mb-2 mx-auto flex items-center justify-center">
            <img :src="getIconUrl(category.icon)" :alt="category.name" class="w-8 h-8 object-contain">
          </div>
        </template>
        <template v-else>
          <div class="w-16 h-16 rounded-full overflow-hidden mb-2">
            <img :src="getIconUrl(category.icon)" :alt="category.name" class="w-full h-full object-cover">
          </div>
        </template>
        <span class="font-pretendard tracking-[-0.02em] text-sm sm:text-base font-medium text-text-primary">{{ category.name }}</span>
      </div>
    </div>
  </section>
</template>
