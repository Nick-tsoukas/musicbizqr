<script setup>
import { useAsyncData, useRuntimeConfig, useHead } from '#imports'

const config = useRuntimeConfig()



const { data: seoPages, error } = await useAsyncData('all-seo-pages', () =>
  $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
    params: {
      populate: '*',
      sort: 'publishedAt:desc', // string is fine here
      'pagination[page]': 1,
      'pagination[pageSize]': 200, // or 1000 if your maxLimit allows it
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

watchEffect(() => {
  if (!seoPages.value) return

  const rows = seoPages.value.data.map(p => ({
    id: p.id,
    title: p.attributes.title,
    slug: p.attributes.slug,
    category: p.attributes.category,
    rawCategory: JSON.stringify(p.attributes.category),
  }))

  console.log("=======================================")
  console.log("🔍 TOTAL ARTICLES FETCHED:", rows.length)
  console.log("🔍 DISTINCT RAW CATEGORIES:", [
    ...new Set(rows.map(r => r.category))
  ])
  console.log("=======================================")

  // 1. Show FULL table
  console.table(rows)

  // 2. Show rows with EMPTY or INVALID categories
  const emptyCats = rows.filter(r => !r.category || r.category.trim() === "")
  if (emptyCats.length) {
    console.warn("⚠️ EMPTY / INVALID CATEGORY ROWS:")
    console.table(emptyCats)
  }

  // 3. Show trimmed categories to identify trailing spaces
  const weirdCats = rows.filter(
    r => r.category && r.category !== r.category.trim()
  )
  if (weirdCats.length) {
    console.warn("⚠️ CATEGORY WITH TRAILING SPACES:")
    console.table(weirdCats)
  }

  // 4. Show duplicate slugs
  const slugMap = {}
  rows.forEach(r => {
    slugMap[r.slug] = slugMap[r.slug] ? [...slugMap[r.slug], r] : [r]
  })
  const dupes = Object.values(slugMap).filter(list => list.length > 1)
  if (dupes.length) {
    console.warn("⚠️ DUPLICATE SLUGS DETECTED:")
    console.log(dupes)
  }

  // 5. Show the “music-marketing” article if it exists
  const mm = rows.filter(r => r.slug === "music-marketing")
  console.log("🎯 music-marketing entry:", mm)
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
