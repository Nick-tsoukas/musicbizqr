<template>
  <button
    @click="goBack"
    aria-label="Go back"
    class="flex items-center justify-center
           w-10 h-10 absolute
           text-gray-600 hover:text-gray-800
           focus:outline-none focus:ring-2 focus:ring-gray-500
           rounded transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6"
      :class="{ 'scale-x-[-1]': rtl }"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route  = useRoute()
const rtl    = computed(() => document?.dir?.toLowerCase() === 'rtl')

function goBack() {
  // 1) If we’re on an event page, send to /bandSlug#upcoming-events and then scroll
  if (route.path.startsWith('/event/') && route.query.slug) {
    const slug = String(route.query.slug)
    router.push({ path: `/${slug}`, hash: '#upcoming-events' })
      .then(() => {
        // give Nuxt a tick to render, then scroll
        const el = document.getElementById('upcoming-events')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      })
    return
  }

  // 2) Otherwise, normal history back
  if (window.history.length > 1) {
    return router.back()
  }

  // 3) Fallback
  return router.push('/dashboard')
}
</script>
