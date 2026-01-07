<template>
  <div class="flex flex-col gap-1">
    <span class="text-primary text-sm font-bold">{{ title }}</span>
    <div v-if="text">
      <div v-if="hasNewlines(text)" class="text-text-secondary text-sm">
        <ul class="list-disc pl-5">
          <li v-for="(item, index) in splitTextToList(text)" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
      <span v-else class="text-text-secondary text-sm">{{ text }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { hasNewlines, splitTextToList } from '~/utils/formatters'

interface Props {
  title: string
  text?: string | null
}

defineProps<Props>()
</script>