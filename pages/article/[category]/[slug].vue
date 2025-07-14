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

useHead({
  title: page.metaTitle || page.title || 'Discover New Music',
  meta: [
    {
      name: 'description',
      content: page.metaDescription || page.excerpt || page.title || 'Explore music growth strategies using QR codes and smart links.',
    },
    { property: 'og:title', content: page.metaTitle || page.title },
    { property: 'og:description', content: page.metaDescription || page.excerpt || page.title },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: page.ogImage?.url },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: page.metaTitle || page.title },
    { name: 'twitter:description', content: page.metaDescription || page.excerpt || page.title },
    { name: 'keywords', content: page.keywords || '' }
  ],
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": page.metaTitle || page.title,
        "description": page.metaDescription || page.excerpt || page.title,
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
