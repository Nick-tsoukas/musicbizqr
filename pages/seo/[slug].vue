<script setup>
import { useRoute, useAsyncData, useHead, useRuntimeConfig } from '#imports'
import { marked } from 'marked'

const route = useRoute()
const slug = route.params.slug
const config = useRuntimeConfig()

const { data: seoPage, error } = await useAsyncData(`seo-${slug}`, () =>
  $fetch(`${config.public.strapiUrl}/api/seo-pages?filters[slug][$eq]=${slug}&populate=*`)
)

if (error.value) {
  console.error('SEO page fetch error:', error.value)
}

const page = seoPage.value?.data?.[0]?.attributes || {}
const pageUrl = `https://musicbizqr.com/seo/${slug}`
const publishedDate = page.publishedAt || new Date().toISOString()

useHead({
  title: page.title || 'Discover New Music',
  meta: [
    {
      name: 'description',
      content: page.excerpt || page.title || 'Explore artist QR tech and music marketing tips.',
    },
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.excerpt || page.title },
    { property: "og:url", content: pageUrl },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.excerpt || page.title }
  ],
  link: [{ rel: "canonical", href: pageUrl }],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": page.title,
        "description": page.excerpt || page.title,
        "author": {
          "@type": "Organization",
          "name": "MusicBizQR"
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
        }
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
