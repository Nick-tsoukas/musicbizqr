<template>
  <Teleport to="body">
    <a
      v-if="isAuthenticated"
      href="/dashboard"
      class="back-to-app-btn"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>Back to App</span>
    </a>
  </Teleport>
</template>

<script setup>
const user = useStrapiUser()
const isAuthenticated = computed(() => !!user.value)
</script>

<style scoped>
.back-to-app-btn {
  position: fixed;
  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  z-index: 9999;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.back-to-app-btn:hover {
  background: rgba(0, 0, 0, 0.85);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateX(-50%) translateY(-2px);
}

.back-to-app-btn:active {
  transform: translateX(-50%) scale(0.98);
}
</style>
