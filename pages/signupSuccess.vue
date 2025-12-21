<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-md shadow-md p-8">
      <h1 class="text-xl font-semibold text-gray-800 mb-2">Signup Success</h1>
      <p class="text-gray-600 mb-4">
        ✅ Your 30-day trial is now active!
      </p>
      <p class="text-gray-600">
        Please check your email for a confirmation link to activate your account.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const nuxtApp = useNuxtApp()

onMounted(() => {
  const fbq = (nuxtApp.$fbq as any)
  if (!process.client || !fbq) return

  // ✅ Stable, stored event_id for "signup completed"
  const storageKey = 'mbq_event_signup_completed'
  let eventId = sessionStorage.getItem(storageKey)

  if (!eventId) {
    eventId =
      window.crypto?.randomUUID?.() ||
      `signup-complete-${Date.now()}-${Math.random().toString(16).slice(2)}`
    sessionStorage.setItem(storageKey, eventId)
  }

  // ✅ Pull UTMs saved by B.2 (if they exist)
  let utm: Record<string, string> = {}
  try {
    utm = JSON.parse(sessionStorage.getItem('mbq_utm') || '{}')
  } catch {}

  const payload = {
    ...utm,
    event_id: eventId,
    content_name: 'MBQ Trial Signup',
    status: 'success',
    event_source: 'nuxt-frontend',
  }

  // ✅ Standard conversion event (best for optimization)
  fbq('track', 'CompleteRegistration', payload)

  // ✅ Optional custom event (useful for custom audiences)
  fbq('trackCustom', 'SignupCompleted', payload)

  // 🧼 Optional: clear funnel keys after success
  // (prevents edge cases if user repeats flow in same session)
  sessionStorage.removeItem('mbq_event_signup_started')
  sessionStorage.removeItem('mbq_event_signup_completed')
})
</script>


<style scoped>
/* (optional) you can tweak these to match your design system */
.bg-gray-900 { background-color: #1a202c; }
.text-gray-600 { color: #718096; }
.text-gray-800 { color: #2d3748; }
</style>
