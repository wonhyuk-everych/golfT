<template>
  <div :class="['border border-gray-300 rounded-md px-2 py-3 bg-white select-box-container', $attrs.class]">
    <span class="text-gray-500 text-sm text-center block">
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
});
</script>
