<script setup>
import { useRoute, useAsyncData, useSeoMeta, useHead, useRuntimeConfig } from '#imports'
import { marked } from 'marked'

const route = useRoute()
const slug = route.params.slug
const config = useRuntimeConfig()

// Fetch page content from Strapi
const { data: seoPage, error } = await useAsyncData(`seo-${slug}`, () =>
  $fetch(`${config.public.strapiUrl}/api/seo-pages?filters[slug][$eq]=${slug}&populate=*`)
)

if (error.value) {
  console.error('SEO page fetch error:', error.value)
}

const page = seoPage.value?.data?.[0]?.attributes || {}
const pageUrl = `https://musicbizqr.com/article/${slug}`
const publishedDate = page.publishedAt || new Date().toISOString()
const updatedDate = page.updatedAt || publishedDate
const ogImage = page.ogImage?.url || 'https://musicbizqr.com/default-og.png'

// 🔥 SEO META TAGS (Nuxt SEO)
useSeoMeta({
  title: () => page.title || 'Discover New Music',
  description: () => page.excerpt || page.title || '',
  ogTitle: () => page.title,
  ogDescription: () => page.excerpt || page.title,
  ogUrl: () => pageUrl,
  ogImage: () => ogImage,
  twitterTitle: () => page.title,
  twitterDescription: () => page.excerpt || page.title,
  twitterImage: () => ogImage,
  twitterCard: 'summary_large_image',
  canonical: () => pageUrl
})

// 🔍 JSON-LD STRUCTURED DATA
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: page.title,
        description: page.excerpt || page.title,
        author: {
          '@type': 'Organization',
          name: 'MusicBizQR'
        },
        image: ogImage,
        datePublished: publishedDate,
        dateModified: updatedDate,
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
