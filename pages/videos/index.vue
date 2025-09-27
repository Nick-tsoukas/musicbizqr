<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStrapi } from '#imports'

const { find } = useStrapi()
const q = ref('')
const loading = ref(true)
const items = ref<{ slug: string; id: string; title: string; thumb: string; description?: string }[]>([])

const ABS = (path?: string) => {
  // make Strapi relative URLs absolute
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = useRuntimeConfig().public?.strapiURL || process.env.STRAPI_URL || ''
  return `${base}${path}`
}

async function fetchVideosFromStrapi() {
  try {
   const resp: any = await find('howtovideos', {
  populate: { Thumbnail: true },           // 👈 Capital T
  sort: 'createdAt:desc',
  pagination: { pageSize: 24 },
  publicationState: 'live',
})

items.value = (resp?.data || []).map((v: any) => ({
  slug: v.attributes.slug,                 // slug is lowercase in your schema
  id: v.attributes.YouTubeID,              // 👈 Capitalized field
  title: v.attributes.Title,               // 👈
  thumb: ABS(v.attributes.Thumbnail?.data?.attributes?.url), // 👈
  description: v.attributes.Description || '',               // 👈
}))

  } finally {
    console.log(items.value, ' this is item loged out to its value')
    loading.value = false
  }
}

onMounted(fetchVideosFromStrapi)

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return items.value
  return items.value.filter(v =>
    (v.title || '').toLowerCase().includes(term) ||
    (v.slug || '').toLowerCase().includes(term)
  )
})

useHead({
  title: 'Videos – MusicBizQR',
  meta: [{ name: 'description', content: 'Tutorials: QR codes, smart links, analytics for musicians with MusicBizQR.' }],
})
</script>

<template>
  <section class="bg-black min-h-screen pt-[var(--header-height)] py-10">
    <div class="container max-w-7xl mx-auto px-6">
      <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-white">🎥 Tutorials</h1>
          <p class="text-white/70 mt-1">Learn QR codes, smart links, and growth tactics with MusicBizQR.</p>
        </div>
        <div class="w-full md:w-80">
          <input
            v-model="q"
            type="search"
            placeholder="Search videos…"
            class="w-full rounded-lg bg-neutral-900 border border-white/10 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
      </header>

      <div v-if="loading" class="text-white/70">Loading…</div>

      <div v-else>
        <div v-if="!filtered.length" class="text-white/70">No videos found.</div>

        <!-- Balanced grid with generous vertical rhythm -->
        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12"
        >
          <NuxtLink
            v-for="v in filtered"
            :key="v.slug"
            :to="`/videos/${v.slug}`"
            class="block group"
          >
            <!-- Card wrapper adds separation & polish -->
            <div
              class="h-full rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4
                     transition-transform hover:scale-[1.01] hover:bg-white/10"
            >
              <VideoCard
                v-if="v.id"
                :video-id="v.id"
                :title="v.title"
                :thumb="v.thumb"
                :autoplay="false"
                aspect="aspect-[16/9]"
                class="rounded-xl overflow-hidden"
              />
              <div v-else class="text-red-400 text-sm mt-2">No YouTubeID set</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

