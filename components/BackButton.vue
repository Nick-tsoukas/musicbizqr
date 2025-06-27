<template>
  <button
    @click="goBack"
    aria-label="Go back"
    class="absolute top-16 left-16 flex items-center justify-center
           w-10 h-10 text-gray-200 hover:text-gray-800
           focus:outline-none focus:ring-2 focus:ring-gray-500
           rounded transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6"
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
import { nextTick } from 'vue'

const router = useRouter()
const route  = useRoute()

function scrollToUpcoming() {
  nextTick(() => {
    const el = document.getElementById('upcoming-events')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })
}

function goBack() {
  // 1) If we’re on an event page, route to /{slug}#upcoming-events
  if (route.path.startsWith('/event/') && route.query.slug) {
    const raw  = route.query.slug
    const slug = Array.isArray(raw) ? raw[0] : (raw as string)
    router.push({ path: `/${slug}`, hash: '#upcoming-events' })
      .then(scrollToUpcoming)
    return
  }

  // 2) Otherwise, always go to dashboard
  router.push('/dashboard')
}
</script>
