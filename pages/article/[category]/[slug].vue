<script setup>
import { useRoute, useAsyncData, useHead, useRuntimeConfig, computed } from '#imports'
import { marked } from 'marked'


const renderer = new marked.Renderer()

renderer.heading = (text, level) => {
  const id = slugify(text)
  return `<h${level} id="${id}">${text}</h${level}>`
}

marked.setOptions({ renderer })
const route = useRoute()
const category = route.params.category
const slug = route.params.slug
const config = useRuntimeConfig()



const slugify = (text: string) => {
  return text
    .toLowerCase()
    // keep only letters, numbers, spaces, and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // convert spaces to single hyphens
    .replace(/\s+/g, '-')
    // collapse multiple hyphens
    .replace(/-+/g, '-')
    // trim leading/trailing hyphens
    .replace(/^-|-$/g, '')
}

// ---------------- Article Fetch ----------------
const { data: seoPage, error } = await useAsyncData(
  `article-${category}-${slug}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        'filters[slug][$eq]': slug,
        'filters[category][$eq]': category,
        populate: '*'
      }
    })
)

if (error.value) {
  console.error('Article fetch error:', error.value)
}

// ---------------- Related Posts ----------------
const { data: articles, error: relatedError } = await useAsyncData(
  `related-${category}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        'filters[category][$eq]': category,
        sort: ['publishedAt:desc'],
        pagination: { limit: 3 },
        fields: ['title', 'slug', 'metaTitle', 'metaDescription']
      }
    })
)

if (relatedError.value) {
  console.error('Related posts fetch error:', relatedError.value)
}

const page = seoPage.value?.data?.[0]?.attributes || {}

const pageUrl = `https://musicbizqr.com/article/${category}/${slug}`
const publishedDate = page.publishedAt || new Date().toISOString()
const authorName = page.author?.name || 'MusicBizQR'
const keywordsArray = (page.keywords || '')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean)

// Adjust this to match your Strapi media shape if needed
const ogImage =
  page.ogImage?.url || 'https://musicbizqr.com/default-og.png'

// ---------------- JSON-LD from Strapi ----------------
// We assume you added a JSON field called "jsonLd" to the seo-page type
const jsonLdString = computed(() => {
  if (!page.jsonLd) return null
  try {
    return JSON.stringify(page.jsonLd)
  } catch (e) {
    console.error('Error stringifying JSON-LD from Strapi', e)
    return null
  }
})

// ---------------- SEO Head ----------------
useHead(() => {
  const title = page.metaTitle || page.title || 'Discover New Music'
  const description =
    page.metaDescription ||
    page.excerpt ||
    page.title ||
    'Explore music growth strategies using QR codes and smart links.'

  const meta = [
    { name: 'description', content: description },

    // ✅ Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: ogImage },
    { property: 'article:published_time', content: publishedDate },
    { property: 'article:section', content: category },
    ...keywordsArray.map(tag => ({ property: 'article:tag', content: tag })),

    // ✅ Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },

    // ✅ Author & Keywords
    { name: 'author', content: authorName },
    { name: 'keywords', content: keywordsArray.join(', ') },

    // ✅ Optional polish
    { name: 'theme-color', content: '#000000' }
  ]

  const link = [
    { rel: 'canonical', href: pageUrl },
    { rel: 'icon', href: '/favicon.ico' }
  ]

  const script = []

  if (jsonLdString.value) {
    // ✅ Use JSON-LD from Strapi (your @graph template)
    script.push({
      type: 'application/ld+json',
      children: jsonLdString.value
    })
  } else {
    // 🔁 Fallback: Article + Breadcrumb JSON-LD (what you had before)
    script.push(
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: description,
          author: {
            '@type': 'Person',
            name: authorName
          },
          datePublished: publishedDate,
          publisher: {
            '@type': 'Organization',
            name: 'MusicBizQR',
            logo: {
              '@type': 'ImageObject',
              url: 'https://musicbizqr.com/logo.png'
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': pageUrl
          },
          image: ogImage,
          keywords: keywordsArray
        })
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://musicbizqr.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Articles',
              item: `https://musicbizqr.com/article/${category}`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: page.title,
              item: pageUrl
            }
          ]
        })
      }
    )
  }

  return {
    title,
    meta,
    link,
    script
  }
})
</script>



<template>
  <div class="bg-black text-white py-16 px-6 max-w-3xl mx-auto">
    <h1 class="text-3xl md:text-5xl font-extrabold mb-8 text-gradient">
      {{ page.title }}
    </h1>




    <div
      class="prose prose-invert max-w-none"
      v-html="marked(page.content || '')"
    />

    <section class="bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-2xl shadow-xl my-12 overflow-hidden">
  <div class="grid md:grid-cols-2 gap-6 p-6 md:p-10 items-center">
    <!-- Text -->
    <div>
      <h2 class="text-3xl font-extrabold mb-4">Built for Musicians. Powered by Smart Links.</h2>
      <p class="text-lg mb-4">
        MusicBizQR gives you a powerful landing page with streaming links, videos, social buttons, and real-time fan analytics — all from a single QR code.
      </p>
      <ul class="space-y-2 mb-6">
        <li>🎯 Unlimited link clicks & analytics</li>
        <li>📈 Track Spotify streams, YouTube plays, and QR scans</li>
        <li>📱 Mobile-optimized artist pages</li>
        <li>🚀 Create your first Smart Link in seconds</li>
      </ul>
      <NuxtLink to="/signup" class="inline-block bg-white text-black font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-200 transition">
        Start Your Free Trial
      </NuxtLink>
    </div>

    <!-- Screenshot -->
    <div class="flex justify-center">
      <img
        src="public\screenshotappnovideo.png"
        alt="MusicBizQR dashboard"
        class="rounded-xl w-full max-w-md shadow-2xl"
        loading="lazy"
      />
    </div>
  </div>
</section>

<div class="h-40 flex justify-center items-center">
        <NuxtLink to="/"><img src="@/assets/musicbizlogo.png" class="h-12" /></NuxtLink>
      </div>
  </div>

  <!-- i want to add the last 3 posts here as related posts to the category  -->
  <div v-if="articles?.data?.length" class="space-y-8 max-w-3xl mx-auto mt-16 px-6">
    <h2 class="text-2xl font-bold text-pink-400">Realted Posts</h2>
  <div
    v-for="post in articles.data"
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
</div>


</template>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
