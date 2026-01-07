<template>
  <div :class="['flex flex-col gap-3 px-8 py-2', $attrs.class]">
    <div class="flex items-center gap-2">
      <img :src="icon" alt="icon" />
      <span class="text-sm text-cyan-500">{{ label }}</span>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>

defineProps({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
});

defineOptions({
  inheritAttrs: false
});
</script>
