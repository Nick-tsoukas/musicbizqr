<script setup>
import { useRoute, useAsyncData, useHead, useRuntimeConfig } from '#imports'
import { marked } from 'marked'

const route = useRoute()
const category = route.params.category
const slug = route.params.slug
const config = useRuntimeConfig()

const { data: seoPage, error } = await useAsyncData(`article-${category}-${slug}`, () =>
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

const page = seoPage.value?.data?.[0]?.attributes || {}
const pageUrl = `https://musicbizqr.com/article/${category}/${slug}`
const publishedDate = page.publishedAt || new Date().toISOString()
const authorName = page.author?.name || 'MusicBizQR'
const keywordsArray = (page.keywords || '').split(',').map(k => k.trim()).filter(Boolean)
const ogImage = page.ogImage?.url || 'https://musicbizqr.com/default-og.png' // Fallback

useHead({
  title: page.metaTitle || page.title || 'Discover New Music',
  meta: [
    { name: 'description', content: page.metaDescription || page.excerpt || page.title || 'Explore music growth strategies using QR codes and smart links.' },

    // ✅ Open Graph
    { property: 'og:title', content: page.metaTitle || page.title },
    { property: 'og:description', content: page.metaDescription || page.excerpt || page.title },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: ogImage },
    { property: 'article:published_time', content: publishedDate },
    { property: 'article:section', content: category },
    ...keywordsArray.map(tag => ({ property: 'article:tag', content: tag })),

    // ✅ Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: page.metaTitle || page.title },
    { name: 'twitter:description', content: page.metaDescription || page.excerpt || page.title },
    { name: 'twitter:image', content: ogImage },

    // ✅ Author & Keywords
    { name: 'author', content: authorName },
    { name: 'keywords', content: keywordsArray.join(', ') },

    // ✅ Optional polish
    { name: 'theme-color', content: '#000000' }
  ],
  link: [
    { rel: 'canonical', href: pageUrl },
    { rel: 'icon', href: '/favicon.ico' }
  ],
  script: [
    // ✅ Article JSON-LD
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": page.metaTitle || page.title,
        "description": page.metaDescription || page.excerpt || page.title,
        "author": {
          "@type": "Person",
          "name": authorName
        },
        "datePublished": publishedDate,
        "publisher": {
          "@type": "Organization",
          "name": "MusicBizQR",
          "logo": {
            "@type": "ImageObject",
            "url": "https://musicbizqr.com/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": pageUrl
        },
        "image": ogImage,
        "keywords": keywordsArray
      })
    },

    // ✅ Breadcrumbs JSON-LD
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://musicbizqr.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Articles",
            "item": `https://musicbizqr.com/article/${category}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": page.title,
            "item": pageUrl
          }
        ]
      })
    }
  ]
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


  </div>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
