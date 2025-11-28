<script setup>
import { useRoute, useAsyncData, useHead, useRuntimeConfig, computed } from '#imports'
import { marked } from 'marked'

const route = useRoute()
const category = route.params.category
const config = useRuntimeConfig()

// Pretty category title for fallback
const displayTitle = computed(() =>
  category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
)

// 1) Fetch pillar page content by slug = category
const { data: pillarData, error: pillarError } = await useAsyncData(
  `pillar-${category}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        'filters[slug][$eq]': category,
        populate: '*'
      }
    })
)

if (pillarError?.value) {
  console.error('Pillar fetch error:', pillarError.value)
}

const page = computed(() => pillarData.value?.data?.[0]?.attributes || {})

const pageUrl = computed(() => `https://musicbizqr.com/article/${category}`)
const publishedDate = computed(
  () => page.value.publishedAt || new Date().toISOString()
)
const authorName = computed(() => page.value.author?.name || 'MusicBizQR')
const keywordsArray = computed(() =>
  (page.value.keywords || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
)

const ogImage = computed(
  () => page.value.ogImage?.url || 'https://musicbizqr.com/default-og.png'
)

// Stringify jsonLd from Strapi (if present)
const jsonLdString = computed(() => {
  if (!page.value.jsonLd) return null
  try {
    return JSON.stringify(page.value.jsonLd)
  } catch (e) {
    console.error('Error stringifying JSON-LD for pillar', e)
    return null
  }
})

// Dynamic head tags (use page data if available, fallback to displayTitle)
useHead(() => {
  const title =
    page.value.metaTitle || page.value.title || `${displayTitle.value} | MusicBizQR`
  const description =
    page.value.metaDescription ||
    page.value.excerpt ||
    `Explore powerful articles about ${displayTitle.value} and how to grow your music using QR codes and smart links.`

  const meta = [
    { name: 'description', content: description },

    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: pageUrl.value },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: ogImage.value },

    // Article specifics
    { property: 'article:published_time', content: publishedDate.value },
    { property: 'article:section', content: category },
    ...keywordsArray.value.map((tag) => ({
      property: 'article:tag',
      content: tag
    })),

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage.value },

    // Extra
    { name: 'author', content: authorName.value },
    { name: 'keywords', content: keywordsArray.value.join(', ') }
  ]

  const link = [
    { rel: 'canonical', href: pageUrl.value },
    { rel: 'icon', href: '/favicon.ico' }
  ]

  const script = []

  if (jsonLdString.value) {
    // ✅ Use JSON-LD from Strapi (full @graph with Article + FAQ + Breadcrumbs)
    script.push({
      type: 'application/ld+json',
      children: jsonLdString.value
    })
  }

  return {
    title,
    meta,
    link,
    script
  }
})

// Pillar HTML (Markdown → HTML)
const pillarHtml = computed(() => {
  if (!page.value.content) return null
  return marked.parse(page.value.content)
})

// 2) Fetch list of cluster articles in this category
const { data: articles, error: articlesError } = await useAsyncData(
  `category-${category}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        'filters[category][$eq]': category,
        populate: '*',
        sort: ['publishedAt:desc']
      }
    })
)

if (articlesError?.value) {
  console.error('Category articles fetch error:', articlesError.value)
}
</script>


<template>
  <div class="bg-black text-white px-4 py-16 max-w-3xl mx-auto">

    <!-- Pillar Header -->
    <h1 class="text-4xl font-extrabold mb-4 text-gradient">
      {{ displayTitle }}
    </h1>

    <!-- Pillar Body (Markdown → HTML) -->
    <div v-if="pillarHtml" class="prose prose-invert mb-12" v-html="pillarHtml"></div>

    <!-- Fallback Intro -->
    <p v-else class="mb-10 text-lg text-gray-300">
      Articles about {{ displayTitle }} to help you grow your fanbase and monetize your music.
    </p>

    <!-- Cluster Articles f -->
    <div v-if="articles?.data?.length" class="space-y-8">
      <div
        v-for="post in articles.data"
        :key="post.id"
        class="bg-gray-900 p-6 rounded-lg shadow hover:bg-gray-800 transition"
      >
        <NuxtLink
          :to="`/article/${category}/${post.attributes.slug}`"
          class="text-2xl font-bold text-pink-400"
        >
          {{ post.attributes.title }}
        </NuxtLink>
        <p class="text-sm text-gray-400 mt-2">
          {{ post.attributes.metaDescription }}
        </p>
      </div>
    </div>

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
/* optional: if you use Tailwind CSS Typography plugin */
.prose-invert {
  /* adjust if needed */
}
</style>
