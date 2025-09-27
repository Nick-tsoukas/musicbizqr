<script setup lang="ts">
import { useRoute, useRuntimeConfig, useHead } from '#imports'
import { useStrapi } from '#imports'

const route = useRoute()
const { find } = useStrapi()
const config = useRuntimeConfig()

/** Build absolute URL for Strapi media */
function ABS(path?: string | null) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const base = config.public?.strapiURL || ''
  return `${base}${path}`
}

/** Robustly extract the 11-char YouTube ID from an ID or URL with params */
function extractYouTubeId(input?: string): string | null {
  if (!input) return null
  const s = input.trim()

  // already an ID?
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s

  // sometimes we get ID&list=...
  const beforeAmp = s.split('&')[0]
  if (/^[a-zA-Z0-9_-]{11}$/.test(beforeAmp)) return beforeAmp

  try {
    // allow raw "watch?v=..." too
    const url = s.includes('://') ? new URL(s) : new URL(`https://y.t/${s}`)
    const v = url.searchParams.get('v')
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v
    const pathId = url.pathname.split('/').filter(Boolean).pop()
    if (pathId && /^[a-zA-Z0-9_-]{11}$/.test(pathId)) return pathId
  } catch {}

  return null
}

type VM = {
  slug: string
  id: string | null
  title: string
  thumb: string
  description: string
}

/** Fetch single video (server-side) */
const { data: video, error } = await useAsyncData<VM>('howto-detail', async () => {
  const slug = String(route.params.slug || '')
  const resp: any = await find('howtovideos', {
    filters: { slug: { $eq: slug } },
    populate: { Thumbnail: true },          // 👈 exact case
    publicationState: 'live',
  })
  const row = resp?.data?.[0]
  const a = row?.attributes
  if (!a) return null

  return {
    slug: a.slug,
    id: extractYouTubeId(a.YouTubeID),      // 👈 normalize
    title: a.Title,
    thumb: ABS(a.Thumbnail?.data?.attributes?.url),
    description: a.Description || '',
  }
})

/** Fetch some related videos (server-side) */
const { data: related } = await useAsyncData('howto-related', async () => {
  const resp: any = await find('howtovideos', {
    sort: 'createdAt:desc',
    pagination: { pageSize: 6 },
    populate: { Thumbnail: true },          // 👈 exact case
    publicationState: 'live',
  })
  const currentSlug = String(route.params.slug || '')
  return (resp?.data || [])
    .map((v: any) => {
      const a = v.attributes
      return {
        slug: a.slug,
        id: extractYouTubeId(a.YouTubeID),  // 👈 normalize
        title: a.Title,
        thumb: ABS(a.Thumbnail?.data?.attributes?.url),
      }
    })
    .filter((r: any) => r.slug !== currentSlug)
})

useHead(() => ({
  title: video.value?.title ? `${video.value.title} – MusicBizQR` : 'Video – MusicBizQR',
}))
</script>
<template>
  <section class="bg-black min-h-screen pt-[var(--header-height)] py-10 text-white">
    <div class="container mx-auto px-6 text-center">
      <NuxtLink to="/videos" class="text-white/70 hover:text-white block mb-6 text-left">
        ← Back to videos
      </NuxtLink>

      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-extrabold mb-4">
          {{ video?.title || 'Video not found' }}
        </h1>

        <!-- Player -->
        <VideoCard
          v-if="video && video.id"
          :video-id="video.id"
          :title="video.title"
          :thumb="video.thumb"
          :autoplay="false"
          aspect="aspect-[5/4] md:aspect-[4/3] lg:aspect-[16/9]"
          class="mx-auto"
        />
        <p v-else class="text-red-400 mt-4 text-sm">
          Missing or invalid YouTube ID. Check the “YouTubeID” field in Strapi and republish.
        </p>

        <p v-if="video?.description" class="mt-6 text-white/80 whitespace-pre-line text-left">
          {{ video.description }}
        </p>
      </div>
    </div>
  </section>
</template>

