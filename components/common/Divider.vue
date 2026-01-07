<template>
  <div
    class="border-t border-gray-100 border-[3px] mt-6 mb-6"
    :style="{ width: `calc(100% + ${offsetValue()})` }"
  />
</template>

<script setup lang="ts">
interface Props {
  // Extra width to add to 100%, in px. Accepts number (px) or string like '20px'.
  offsetPx?: number | string
}

const props = defineProps<Props>()

function offsetValue(): string {
  const v = props.offsetPx
  if (v === undefined || v === null || v === '') return '34px'
  return typeof v === 'number' ? `${v}px` : String(v)
}
</script>
