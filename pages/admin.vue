<!-- pages/admin.vue -->
<template>
  <section class="min-h-screen bg-black text-white">
    <div class="w-[90vw] mx-auto py-10 space-y-6">
      <h1 class="text-3xl font-extrabold">Admin (bootstrap)</h1>
      <p class="text-white/70">Open the browser console — we’re logging Strapi responses.</p>

      <div class="rounded-xl border border-white/10 p-4">
        <div class="text-sm text-white/60">Users fetch status</div>
        <div class="mt-1">
          <code class="text-xs">
            pending: {{ usersPending }} |
            error: {{ !!usersError }}
          </code>
        </div>
      </div>

      <div class="rounded-xl border border-white/10 p-4">
        <div class="text-sm text-white/60">QR #46 fetch status</div>
        <div class="mt-1">
          <code class="text-xs">
            pending: {{ qrPending }} |
            error: {{ !!qrError }}
          </code>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const base = config.public.strapiUrl
const token = config.public.strapiToken

const headers = computed(() =>
  token ? { Authorization: `Bearer ${token}` } : undefined
)

/**
 * Strapi v4 notes:
 * - If your "users" are the Users & Permissions plugin users, the endpoint is `/api/users`
 *   (requires proper permissions or an admin/user token).
 * - If you have your own collection type (e.g. "users" or "user-profiles"), use that path instead:
 *   `/api/user-profiles` etc.
 * Adjust the path below to match your Strapi.
 */

// FETCH: users (client-side so logs show in browser console)
const {
  data: usersRes,
  pending: usersPending,
  error: usersError,
} = await useFetch(`${base}/api/users`, {
  headers: headers.value,
  server: false, // run on client so console.log is visible in your devtools
})

// FETCH: QR with id 46 (populate if you need relations)
const {
  data: qrRes,
  pending: qrPending,
  error: qrError,
} = await useFetch(`${base}/api/qrs/46?populate=*`, {
  headers: headers.value,
  server: false,
})

// Log results whenever they arrive
watchEffect(() => {
  if (usersRes.value) {
    console.log('[ADMIN] usersRes:', usersRes.value)
    // Example helpers you may want next:
    // const emails = Array.isArray(usersRes.value) ? usersRes.value.map(u => u.email) : []
    // console.log('[ADMIN] emails:', emails, 'total:', emails.length)
  }
  if (qrRes.value) {
    console.log('[ADMIN] qrRes (id=46):', qrRes.value)
    // Example access pattern if it's a collection type:
    // const entity = qrRes.value.data
    // const scans = entity?.attributes?.scans
    // console.log('[ADMIN] qr scans:', scans)
  }

  if (usersError.value) console.error('[ADMIN] usersError:', usersError.value)
  if (qrError.value) console.error('[ADMIN] qrError:', qrError.value)
})
</script>
