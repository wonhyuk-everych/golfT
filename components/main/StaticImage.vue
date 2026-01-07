<template>
  <img :src="src" :alt="alt" :class="className">
</template>

<script setup lang="ts">
defineProps<{
  src: string;
  alt: string;
  className?: string;
}>();
</script>
