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
  </div>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
