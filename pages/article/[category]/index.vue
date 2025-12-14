<script setup>
import { useRoute, useAsyncData, useHead, useRuntimeConfig, computed } from '#imports'

const route = useRoute()
const config = useRuntimeConfig()

const category = String(route.params.category || '').trim()

const baseUrl = computed(() =>
  String(config.public.baseUrl || 'https://musicbizqr.com').replace(/\/$/, '')
)

const displayTitle = computed(() =>
  category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
)

const hubUrl = computed(() => `${baseUrl.value}/article/${category}`)
const articlesIndexUrl = computed(() => `${baseUrl.value}/article`)
const homeUrl = computed(() => `${baseUrl.value}/`)

// ---------------- Hub HTML / FAQ (SAFE defaults) ----------------
const hubHtmlByCategory = {
  'smart-links': `
    <section class="prose prose-invert max-w-none mb-14">
      <p>
        Smart links are the quiet power tool behind modern music careers...
      </p>
    </section>
  `
}
const hubHtml = computed(() => hubHtmlByCategory[category] || null)

const faqByCategory = {
  'smart-links': [
    { q: 'What is a smart link for musicians?', a: '...' },
    { q: 'How is a smart link different from a basic link-in-bio tool?', a: '...' },
    { q: 'Do smart links help increase streams and followers?', a: '...' }
  ]
}
const hubFaq = computed(() => faqByCategory[category] || []) // always array

// ---------------- 1) Pillar fetch ----------------
const { data: pillarRes, error: pillarError } = await useAsyncData(
  `hub-pillar-${category}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        'filters[category][$eq]': category,
        'filters[isPillar][$eq]': true,
        sort: ['publishedAt:desc'],
        pagination: { limit: 1 },
        populate: '*'
      }
    })
)

if (pillarError.value) console.error('Hub pillar fetch error:', pillarError.value)

const pillar = computed(() => pillarRes.value?.data?.[0]?.attributes || null)
const pillarSlug = computed(() => pillar.value?.slug || null)

// ---------------- 2) Cluster fetch (COPY slug-page pattern) ----------------
// Fetch by category ONLY (like your working related posts), then filter locally.
const { data: clusterRes, error: clusterError } = await useAsyncData(
  `hub-cluster-${category}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        'filters[category][$eq]': category,
        sort: ['publishedAt:desc'],
        pagination: { limit: 50 },
        fields: ['title', 'slug', 'metaTitle', 'metaDescription', 'isPillar']
      }
    })
)

if (clusterError.value) console.error('Hub cluster fetch error:', clusterError.value)

const clusterArticles = computed(() => {
  const rows = clusterRes.value?.data || []

  // remove pillar reliably, even if isPillar is null/missing
  return rows.filter((p) => {
    const a = p?.attributes || {}
    if (pillarSlug.value && a.slug === pillarSlug.value) return false
    if (a.isPillar === true) return false
    return true
  })
})

// ---------------- Head ----------------
useHead(() => {
  const title = pillar.value?.metaTitle || `${displayTitle.value} | MusicBizQR`
  const description =
    pillar.value?.metaDescription ||
    `Browse ${displayTitle.value} articles to help you grow your music using smart links, QR codes, and fan funnel strategy.`

  return {
    title,
    link: [
      { rel: 'canonical', href: hubUrl.value },
      { rel: 'icon', href: '/favicon.ico' }
    ],
    meta: [
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: hubUrl.value }
    ]
  }
})
</script>



<template>
  <div class="bg-black text-white px-4 py-16 max-w-3xl mx-auto">
    <h1 class="text-4xl font-extrabold mb-6 text-gradient">
      {{ displayTitle }}
    </h1>

    <!-- Hub content -->
    <div v-if="hubHtml" v-html="hubHtml" class="mb-10" />

    <!-- Featured Pillar -->
    <section v-if="pillar?.slug" class="mb-14">
      <div class="bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h2 class="text-2xl font-bold text-pink-400 mb-2">
          Start Here: The Complete Guide
        </h2>
        <NuxtLink
          :to="`/article/${category}/${pillar.slug}`"
          class="text-3xl font-extrabold leading-tight"
        >
          {{ pillar.title }}
        </NuxtLink>
        <p v-if="pillar.metaDescription" class="text-gray-300 mt-3">
          {{ pillar.metaDescription }}
        </p>
      </div>
    </section>

    <!-- FAQ -->
    <section v-if="hubFaq.length" class="mb-14">
      <h2 class="text-2xl font-bold text-pink-400 mb-6">FAQ</h2>
      <div class="space-y-4">
        <details
          v-for="(item, idx) in hubFaq"
          :key="idx"
          class="bg-gray-900 rounded-xl p-5 shadow hover:bg-gray-800 transition"
        >
          <summary class="cursor-pointer font-extrabold text-white">
            {{ item.q }}
          </summary>
          <p class="text-gray-300 mt-3">
            {{ item.a }}
          </p>
        </details>
      </div>
    </section>

    <!-- Cluster list -->
    <section v-if="clusterArticles.length" class="space-y-8">
      <h2 class="text-2xl font-bold text-pink-400">Latest Articles</h2>

      <div
        v-for="post in clusterArticles"
        :key="post.id"
        class="bg-gray-900 p-6 rounded-lg shadow hover:bg-gray-800 transition"
      >
        <NuxtLink
          :to="`/article/${category}/${post.attributes.slug}`"
          class="text-2xl font-bold text-pink-400"
        >
          {{ post.attributes.metaTitle || post.attributes.title }}
        </NuxtLink>
        <p class="text-sm text-gray-400 mt-2">
          {{ post.attributes.metaDescription }}
        </p>
      </div>
    </section>

    <div v-else class="text-gray-400 italic">
      No articles found in this category yet.
    </div>
  </div>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
