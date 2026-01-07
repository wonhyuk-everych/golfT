<script setup lang="ts">
interface Props {
  title: string;
  icon?: string;
  navigateUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  navigateUrl: ''
})

const handleClick = () => {
  if (props.navigateUrl) {
    window.location.href = props.navigateUrl;
  }
}
</script>

<template>
  <div class="flex items-center justify-between mb-6 mt-4">
    <h2 class="text-lg font-medium flex items-center gap-2">
      <span>{{ icon }} {{ title }}</span>
    </h2>
    <button 
    v-if="navigateUrl"
    class="flex items-center text-gray-600"
    @click="handleClick"
    >
      <span class="ml-1">
        <!--<img src="~/assets/icons/arrow-right.svg" alt="arrow-right" class="w-[16px] h-[16px]">-->
      </span>
    </button>
  </div>
</template>
