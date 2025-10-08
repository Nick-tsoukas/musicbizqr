<template>
  <section class="min-h-screen bg-black text-white">
    <div class="w-[90vw] mx-auto py-10 space-y-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold">Admin Dashboard</h1>
          <p class="text-white/60">Overview and quick actions</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-2xl border border-white/10 p-4">
            <div class="text-sm text-white/60">Total Users</div>
            <div class="text-3xl font-bold">
              <span v-if="!usersPending">{{ usersTotal }}</span>
              <span v-else class="opacity-60">…</span>
            </div>
          </div>

          <div class="rounded-2xl border border-white/10 p-4">
            <div class="text-sm text-white/60">Promo QR Scans (ID 46)</div>
            <div class="text-3xl font-bold">
              <span v-if="!promoPending">{{ promo?.scansCount ?? '—' }}</span>
              <span v-else class="opacity-60">…</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Promo QR Card -->
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div class="space-y-3">
          <h2 class="text-2xl font-extrabold">Promo QR (ID 46)</h2>
          <p class="text-white/70">
            {{ promo?.name || 'Promo QR' }} —
            Scans: <span class="font-semibold text-white">{{ promo?.scansCount ?? '—' }}</span>
          </p>
          <div class="flex gap-3">
            <NuxtLink
              v-if="promo?.analyticsUrl"
              to="/analyticsqr/46"
              class="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-violet-600/90 hover:bg-violet-600 px-5 py-2.5 font-semibold shadow-lg ring-1 ring-white/10 transition"
            >
              Open Analytics
            </NuxtLink>
            <a
              v-if="promo?.url"
              :href="promo.url"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-5 py-2.5 font-semibold transition"
            >
              Visit Target
            </a>
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div class="p-4 rounded-3xl border border-white/10 bg-neutral-900 w-fit">
            <img
              v-if="promo?.imageUrl"
              :src="promo.imageUrl"
              alt="Promo QR Code (ID 46)"
              class="w-56 h-56 md:w-64 md:h-64 object-contain"
              decoding="async"
              loading="lazy"
            />
            <div v-else class="text-white/60 text-sm">No image</div>
          </div>
        </div>
      </div>

      <!-- Users table -->
      <div class="rounded-2xl border border-white/10 overflow-hidden">
        <div class="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <h2 class="font-semibold">Users</h2>
          <span class="text-sm text-white/60">Total: {{ usersTotal }}</span>
        </div>

        <div class="overflow-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-white/5 text-white/70">
              <tr>
                <th class="text-left px-4 py-2">ID</th>
                <th class="text-left px-4 py-2">Email</th>
              </tr>
            </thead>

            <tbody v-if="!usersPending && users.length">
              <tr v-for="u in users" :key="u.id" class="border-t border-white/10">
                <td class="px-4 py-2">{{ u.id }}</td>
                <td class="px-4 py-2">{{ u.email }}</td>
              </tr>
            </tbody>

            <tbody v-else-if="usersPending">
              <tr>
                <td class="px-4 py-6 text-white/60" colspan="2">Loading users…</td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td class="px-4 py-6 text-white/60" colspan="2">No users found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Errors (if any) -->
      <div v-if="usersError || promoError" class="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
        <div class="font-semibold text-red-300 mb-1">Errors</div>
        <pre class="text-xs text-red-200 whitespace-pre-wrap">
usersError: {{ usersError?.data || usersError?.message || usersError || '—' }}
promoError: {{ promoError?.data || promoError?.message || promoError || '—' }}
        </pre>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type UserLite = { id: number; email: string }
type PromoQR = {
  id: number
  name: string | null
  url: string | null
  link: string | null
  q_type: string | null
  slugId: string | null
  imageUrl: string | null
  scansCount: number
  analyticsUrl: string | null
}

const {
  data: usersRes,
  pending: usersPending,
  error: usersError,
} = await useFetch<{ users: UserLite[]; total: number }>('/api/admin/users', { server: true })

const {
  data: promoRes,
  pending: promoPending,
  error: promoError,
} = await useFetch<PromoQR>('/api/admin/promo-qr', { server: true })

const users = computed(() => usersRes.value?.users ?? [])
const usersTotal = computed(() => usersRes.value?.total ?? 0)
const promo = computed(() => promoRes.value ?? null)
</script>
