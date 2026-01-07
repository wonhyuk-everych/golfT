<!-- Admin Layout -->
<template>
  <div class="min-h-screen bg-gray-100">
    <AdminHeader />
    <AdminSidebar />
    <main class="ml-64 pt-16 min-h-screen">
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script>
