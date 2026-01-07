<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Layout handling is now done via Nuxt layouts
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.main-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav-link.active {
  color: #0066ff;
  border-bottom: 2px solid #0066ff;
}

.login-btn {
  padding: 0.5rem 1rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}
</style>
