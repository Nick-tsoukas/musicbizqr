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
import { computed, nextTick } from 'vue'
// replace with your actual auth composable
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route  = useRoute()
const { user } = useAuth()
const isLoggedIn = computed(() => !!user.value)

function scrollToUpcoming() {
  nextTick(() => {
    const el = document.getElementById('upcoming-events')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })
}

function goBack() {
  // 1) If on an event page with ?slug=... → go /{slug}#upcoming-events
  if (route.path.startsWith('/event/') && route.query.slug) {
    const raw  = route.query.slug
    const slug = Array.isArray(raw) ? raw[0] : (raw as string)
    router.push({ path: `/${slug}`, hash: '#upcoming-events' })
      .then(scrollToUpcoming)
    return
  }

  // 2) Logged-in users → dashboard
  if (isLoggedIn.value) {
    router.push('/dashboard')
    return
  }

  // 3) Not logged in → back if possible, else home
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
