<template>
  <div class="h-[100vh]">
    <NavigationBar mode="back" :show-bell="false" />
    
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">{{ $t('settings.language') }}</h1>
      
      <div class="bg-white rounded-lg shadow p-4">
        <p class="text-gray-600 mb-4">{{ $t('settings.selectLanguage') }}</p>
        
        <div class="space-y-3">
          <div 
            v-for="locale in availableLocales" 
            :key="locale.code"
            class="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            :class="{ 'border-primary bg-blue-50': currentLocale === locale.code }"
            @click="changeLanguage(locale.code)"
          >
            <span class="font-medium">{{ locale.name }}</span>
            <div v-if="currentLocale === locale.code" class="w-4 h-4 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '~/components/common/NavigationBar.vue'

definePageMeta({
  name: 'settings-language'
})

const { currentLocale, availableLocales, changeLocale } = useLocalization()

function changeLanguage(locale: string) {
  changeLocale(locale)
}
</script>
