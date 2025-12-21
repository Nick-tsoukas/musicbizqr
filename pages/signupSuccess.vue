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
// If available in your app, this improves match quality a lot:
const user = (typeof useStrapiUser === 'function') ? useStrapiUser() : null

onMounted(async () => {
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

  // 1) Browser pixel (you already had this)
  fbq('track', 'CompleteRegistration', payload)
  fbq('trackCustom', 'SignupCompleted', payload)

  // 2) Server-side CAPI (NEW) — same event_id for dedupe
  try {
    await fetch('/api/meta/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'CompleteRegistration',
        event_id: eventId,
        event_source_url: window.location.href,
        // Send email if you can (server will hash it)
        email: user?.value?.email || undefined,
        custom_data: {
          content_name: 'MBQ Trial Signup',
          status: 'success',
          ...utm,
        },
      }),
    })
  } catch (e) {
    // silent fail (don’t break UX if Meta call fails)
  }

  // 🧼 Clear funnel keys AFTER server call (so eventId remains available)
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
