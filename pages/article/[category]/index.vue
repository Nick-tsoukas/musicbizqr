<script setup>
import { useRoute, useAsyncData, useHead, useRuntimeConfig } from '#imports'
import { marked } from 'marked'

const route = useRoute()
const category = route.params.category
const config = useRuntimeConfig()

// pretty title
const displayTitle = category
  .replace(/-/g, ' ')
  .replace(/\b\w/g, (l) => l.toUpperCase())

// HEAD tags
useHead({
  title: `${displayTitle} | MusicBizQR`,
  meta: [
    { name: 'description', content: `Explore powerful articles about ${displayTitle} and how to grow your music using QR codes and smart links.` },
    { property: 'og:title', content: `${displayTitle} | MusicBizQR` },
    { property: 'og:description', content: `Explore powerful articles about ${displayTitle} and how to grow your music using QR codes and smart links.` },
    { property: 'og:url', content: `https://musicbizqr.com/article/${category}` },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${displayTitle} | MusicBizQR` },
    { name: 'twitter:description', content: `Explore powerful articles about ${displayTitle} and how to grow your music using QR codes and smart links.` },
  ],
  link: [
    { rel: 'canonical', href: `https://musicbizqr.com/article/${category}` },
  ],
})

// 1) fetch pillar page content by slug = category
const { data: pillarData } = await useAsyncData(
  `pillar-${category}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        'filters[slug][$eq]': category,
        populate: '*',
      },
    })
)

// 2) fetch list of cluster articles in this category
const { data: articles } = await useAsyncData(
  `category-${category}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        'filters[category][$eq]': category,
        populate: '*',
        sort: ['publishedAt:desc'],
      },
    })
)

// extract pillar HTML (assuming your Strapi field is markdown in attributes.content)
const pillarHtml = computed(() => {
  const page = pillarData.value?.data?.[0]
  if (!page?.attributes?.content) return null
  return marked.parse(page.attributes.content)
})
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

    <!-- Cluster Articles -->
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
