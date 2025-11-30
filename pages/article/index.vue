<script setup>
import { useAsyncData, useRuntimeConfig, useHead } from '#imports'

const config = useRuntimeConfig()

const { data: seoPages, error } = await useAsyncData('all-seo-pages', () =>
  $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
    params: {
      populate: '*',
      sort: ['publishedAt:desc'],
      pagination: { limit: 1000 }
    }
  })
)

if (error.value) {
  console.error('❌ Error fetching SEO pages:', error.value)
}

// Extract unique categories
const categories = computed(() => {
  const all = seoPages.value?.data || []
  const unique = [...new Set(all.map(p => p.attributes.category))]
  return unique.filter(Boolean)
})

useHead({
  title: 'Articles | MusicBizQR',
  meta: [
    {
      name: 'description',
      content: 'Browse powerful articles on QR code marketing, music promotion, fan engagement and more.',
    },
    { property: 'og:title', content: 'Articles | MusicBizQR' },
    {
      property: 'og:description',
      content: 'Browse powerful articles on QR code marketing, music promotion, fan engagement and more.',
    },
    { property: 'og:url', content: 'https://musicbizqr.com/article' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [{ rel: 'canonical', href: 'https://musicbizqr.com/article' }]
})

watchEffect(() => {
  if (seoPages.value) {
    console.log('SEO pages:', seoPages.value.data.length)

    const cats = seoPages.value.data.map(p => ({
      title: p.attributes.title,
      slug: p.attributes.slug,
      category: p.attributes.category
    }))

    console.table(cats)
  }
})
</script>

<template>
  <div class="bg-black text-white py-16 px-6 max-w-5xl mx-auto">
    <h1 class="text-4xl font-extrabold mb-8 text-gradient">
      Explore Articles by Category
    </h1>

    <div v-if="categories.length" class="grid gap-6 md:grid-cols-2">
      <NuxtLink
        v-for="cat in categories"
        :key="cat"
        :to="`/article/${cat}`"
        class="block p-6 rounded-lg shadow bg-gray-900 hover:bg-gray-800 transition"
      >
        <h2 class="text-xl font-bold capitalize mb-2 text-pink-400">
          {{ cat.replace(/-/g, ' ') }}
        </h2>
        <p class="text-gray-300">
          Articles about {{ cat.replace(/-/g, ' ') }} to help you grow your music career.
        </p>
      </NuxtLink>
    </div>

    <div v-else class="text-gray-400 italic">No categories found.</div>
     <!-- Videos Section -->
 
  </div>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
