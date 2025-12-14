<script setup>
import { useRoute, useAsyncData, useHead, useRuntimeConfig, computed } from '#imports'

/**
 * Category Hub Page
 * Route: /article/[category]
 * File: pages/article/[category]/index.vue
 *
 * Goals:
 * - Unique hub content (hardcoded HTML per category)
 * - Featured Pillar card (from Strapi: isPillar=true)
 * - Cluster list (exclude pillar)
 * - Hub-appropriate SEO (canonical, OG, Twitter)
 * - Hub JSON-LD: WebSite + Organization + WebPage + BreadcrumbList + FAQPage
 * - Works for SSR and Nitro prerender/SSG
 */

const route = useRoute()
const config = useRuntimeConfig()

const category = String(route.params.category || '').trim()
const baseUrl = computed(() => String(config.public.baseUrl || 'https://musicbizqr.com').replace(/\/$/, ''))

// Pretty category title for display
const displayTitle = computed(() =>
  category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
)

const hubUrl = computed(() => `${baseUrl.value}/article/${category}`)
const articlesIndexUrl = computed(() => `${baseUrl.value}/article`)
const homeUrl = computed(() => `${baseUrl.value}/`)

// ---------------- Hub HTML (hardcoded) ----------------
// Keep hub copy UNIQUE (not a duplicate of the pillar).
// Use absolute internal links only if you prefer; relative links are fine.
const hubHtmlByCategory = {
  'smart-links': `
    <section class="prose prose-invert max-w-none mb-14">
      <p>
        Smart links are the quiet power tool behind modern music careers. In 2026, discovery doesn’t happen in one place—
        it happens everywhere: TikTok hooks, Instagram bios, YouTube shorts, playlist saves, QR codes at shows, and text threads
        between friends. A smart link is how you turn that scattered attention into a single, intentional fan journey.
      </p>

      <p>
        This hub is built to help you understand <strong>smart links for musicians</strong> from the top down:
        what they are, why they outperform basic link-in-bio tools, and how artists use them to drive streams, follows,
        email signups, ticket clicks, and repeat engagement—without sending fans on a scavenger hunt.
      </p>

      <p>
        Start with the complete guide below, then explore the deep dives on conversion psychology, embedded content,
        and tool comparisons. Each link here is chosen because it answers a real fan-behavior problem musicians run into every week.
      </p>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-extrabold mb-4">Quick Start: The Smart Links Library</h2>
      <p class="text-gray-300 mb-6">
        Use these shortcuts to jump straight into the topics that move the needle: conversion, design, embeds, and choosing the right tool.
      </p>

      <div class="grid gap-4 sm:grid-cols-2">
        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/smart-links/what-are-smart-links-for-musicians">
          <div class="text-pink-400 font-bold">Start Here</div>
          <div class="text-white font-extrabold text-lg">The Complete 2026 Guide</div>
          <div class="text-gray-300 text-sm mt-1">Definition, strategy, examples, and what to build first.</div>
        </a>

        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/smart-links/smart-links-vs-link-in-bio-tools">
          <div class="text-pink-400 font-bold">Compare</div>
          <div class="text-white font-extrabold text-lg">Smart Links vs Link-in-Bio</div>
          <div class="text-gray-300 text-sm mt-1">What musicians actually need (and what generic tools miss).</div>
        </a>

        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/smart-links/perfect-smart-link-page-musicians">
          <div class="text-pink-400 font-bold">Build</div>
          <div class="text-white font-extrabold text-lg">Anatomy of a Perfect Page</div>
          <div class="text-gray-300 text-sm mt-1">Structure your page like a fan funnel—not a button list.</div>
        </a>

        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/smart-links/embedded-content-smart-links-for-musicians">
          <div class="text-pink-400 font-bold">Convert</div>
          <div class="text-white font-extrabold text-lg">Embedded Content That Wins</div>
          <div class="text-gray-300 text-sm mt-1">Keep fans listening and watching without sending them away.</div>
        </a>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-extrabold mb-4">Core Topics (Picked for Real-World Results)</h2>
      <p class="text-gray-300 mb-6">
        These are the “high leverage” reads—the ones that make your smart link feel intentional, professional, and hard to ignore.
      </p>

      <ul class="list-disc pl-6 space-y-2 text-gray-200">
        <li><a href="/article/smart-links/smart-link-vs-linktree-musicians">Smart Link vs Linktree: What Every Musician Should Know</a></li>
        <li><a href="/article/smart-links/smart-link-design-psychology">Smart Link Design Psychology: How Layout Impacts Fan Behavior</a></li>
        <li><a href="/article/smart-links/the-psychology-of-fan-conversion-why-smart-links-outperform-link-in-bio-tools-every-time">The Psychology of Fan Conversion: Why Smart Links Outperform Link-in-Bio</a></li>
        <li><a href="/article/smart-links/direct-to-fan-video">Direct-to-Fan Video: The Smart Link Strategy Musicians Overlook</a></li>
        <li><a href="/article/smart-links/best-music-smart-link-tools-2025">The Best Music Smart Link Tools in 2026 (And Why Most Fall Short)</a></li>
      </ul>
    </section>

    <section class="mb-4">
      <h2 class="text-3xl font-extrabold mb-4">What Smart Links Are Becoming</h2>
      <p class="text-gray-300">
        Smart links are evolving from “one link with buttons” into adaptive fan experiences—where content, layout, and calls-to-action
        are designed around actual behavior. The more intentional your hub becomes, the more every click stops being a dead-end and starts
        becoming momentum.
      </p>
    </section>
  `
}

// Hub HTML + FAQ per category
const hubHtml = computed(() => hubHtmlByCategory[category] || null)

const faqByCategory = {
  'smart-links': [
    {
      q: 'What is a smart link for musicians?',
      a: 'A smart link is a single, artist-controlled page that brings together your music, videos, socials, tour dates, merch, and key fan actions in one place—designed to reduce friction and increase conversion.'
    },
    {
      q: 'How is a smart link different from a basic link-in-bio tool?',
      a: 'Basic link-in-bio tools are generic lists of buttons. Smart links are built around fan behavior: embedded media, clear hierarchy, analytics, and conversion-first layouts that guide fans toward listening, following, and supporting.'
    },
    {
      q: 'Do smart links help increase streams and followers?',
      a: 'Yes. The main advantage is reduced friction. When fans can listen immediately and see the next best action (follow, save, join email, buy tickets), more of them take the next step instead of dropping off.'
    },
    {
      q: 'Should I send fans to one smart link for everything?',
      a: 'Usually, yes—use one primary smart link as your “home base,” then create campaign-specific variants for releases, tours, QR posters, or ads so you can measure performance and tailor calls-to-action.'
    },
    {
      q: 'How do QR codes connect with smart links?',
      a: 'QR codes turn real-world moments into digital fan journeys. A scan should land on a page that instantly plays music, shows the next best action, and tracks what happens—smart links are the natural destination.'
    }
  ]
}

const hubFaq = computed(() => faqByCategory[category] || [])

// ---------------- Strapi Fetches (Pillar + Cluster) ----------------
const { data: pillarData, error: pillarError } = await useAsyncData(
  `pillar-${category}`,
  () => {
    if (!category) return { data: [] }
    return $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        'filters[category][$eq]': category,
        'filters[isPillar][$eq]': true,
        pagination: { limit: 1 },
        sort: ['publishedAt:desc'],
        fields: ['title', 'slug', 'metaTitle', 'metaDescription', 'publishedAt', 'keywords'],
        populate: { ogImage: true, author: true }
      }
    })
  }
)

if (pillarError?.value) console.error('Pillar fetch error:', pillarError.value)

const pillar = computed(() => pillarData.value?.data?.[0]?.attributes || null)

const ogImage = computed(() => {
  const url = pillar.value?.ogImage?.url
  // If Strapi returns relative URLs, you might need `${config.public.strapiUrl}${url}`
  return url || `${baseUrl.value}/default-og.png`
})

const keywordsArray = computed(() =>
  (pillar.value?.keywords || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
)

const { data: articles, error: articlesError } = await useAsyncData(
  `category-${category}`,
  () => {
    if (!category) return { data: [] }
    return $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        'filters[category][$eq]': category,
        'filters[isPillar][$ne]': true,
        sort: ['publishedAt:desc'],
        pagination: { limit: 50 },
        fields: ['title', 'slug', 'metaTitle', 'metaDescription']
      }
    })
  }
)

if (articlesError?.value) console.error('Category articles fetch error:', articlesError.value)

// ---------------- JSON-LD for HUB ----------------
const jsonLdHub = computed(() => {
  const catName = displayTitle.value
  const pageTitle = `${catName} | MusicBizQR`
  const pageDescription =
    pillar.value?.metaDescription ||
    `Browse ${catName} articles to help you grow your music using smart links, QR codes, and fan funnel strategy.`

  const faqEntities = hubFaq.value.map((item) => ({
    '@type': 'Question',
    'name': item.q,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': item.a
    }
  }))

  const graph = [
    {
      '@id': `${baseUrl.value}/#website`,
      '@type': 'WebSite',
      'url': `${baseUrl.value}/`,
      'name': 'MusicBizQR',
      'inLanguage': 'en',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${baseUrl.value}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@id': `${baseUrl.value}/#organization`,
      '@type': 'Organization',
      'name': 'MusicBizQR',
      'url': `${baseUrl.value}/`,
      'inLanguage': 'en'
    },
    {
      '@id': `${hubUrl.value}/#webpage`,
      '@type': 'WebPage',
      'url': hubUrl.value,
      'name': pageTitle,
      'inLanguage': 'en',
      'isPartOf': { '@id': `${baseUrl.value}/#website` },
      'about': { '@id': `${baseUrl.value}/#organization` },
      'breadcrumb': { '@id': `${hubUrl.value}/#breadcrumb` },
      'primaryImageOfPage': {
        '@type': 'ImageObject',
        '@id': `${hubUrl.value}/#primaryimage`,
        'url': ogImage.value
      },
      'potentialAction': {
        '@type': 'ReadAction',
        'target': [hubUrl.value]
      },
      'description': pageDescription
    },
    {
      '@id': `${hubUrl.value}/#breadcrumb`,
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': homeUrl.value },
        { '@type': 'ListItem', 'position': 2, 'name': 'Articles', 'item': articlesIndexUrl.value },
        { '@type': 'ListItem', 'position': 3, 'name': catName, 'item': hubUrl.value }
      ]
    }
  ]

  // Add FAQ schema only if we have Q&A
  if (faqEntities.length) {
    graph.push({
      '@id': `${hubUrl.value}/#faq`,
      '@type': 'FAQPage',
      'url': hubUrl.value,
      'inLanguage': 'en',
      'mainEntity': faqEntities
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  }
})

// ---------------- Head (Hub SEO, not Article) ----------------
useHead(() => {
  const title =
    pillar.value?.metaTitle ||
    `${displayTitle.value} | MusicBizQR`

  const description =
    pillar.value?.metaDescription ||
    `Browse ${displayTitle.value} articles to help you grow your music using smart links, QR codes, and fan funnel strategy.`

  const meta = [
    { name: 'description', content: description },

    // Open Graph (hub = website)
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: hubUrl.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: ogImage.value },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage.value },

    ...(keywordsArray.value.length ? [{ name: 'keywords', content: keywordsArray.value.join(', ') }] : [])
  ]

  const link = [
    { rel: 'canonical', href: hubUrl.value },
    { rel: 'icon', href: '/favicon.ico' }
  ]

  const script = [
    {
      type: 'application/ld+json',
      children: JSON.stringify(jsonLdHub.value)
    }
  ]

  return { title, meta, link, script }
})
</script>

<template>
  <div class="bg-black text-white px-4 py-16 max-w-3xl mx-auto">
    <h1 class="text-4xl font-extrabold mb-6 text-gradient">
      {{ displayTitle }}
    </h1>

    <!-- Hub content (hardcoded HTML per category) -->
    <div v-if="hubHtml" v-html="hubHtml" />

    <!-- Featured Pillar Card -->
    <section v-if="pillar?.slug" class="mb-14">
      <div class="bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h2 class="text-2xl font-bold text-pink-400 mb-2">
          Start Here: The Complete Guide
        </h2>

        <NuxtLink
          :to="`/article/${category}/${pillar.slug}`"
          class="text-3xl font-extrabold leading-tight"
        >
          {{ pillar.title }}
        </NuxtLink>

        <p v-if="pillar.metaDescription" class="text-gray-300 mt-3">
          {{ pillar.metaDescription }}
        </p>

        <div class="mt-4">
          <NuxtLink
            :to="`/article/${category}/${pillar.slug}`"
            class="inline-block bg-white text-black font-semibold px-5 py-3 rounded-xl shadow hover:bg-gray-200 transition"
          >
            Read the Complete Guide
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FAQ (hub-specific) -->
    <section v-if="hubFaq.length" class="mb-14">
      <h2 class="text-2xl font-bold text-pink-400 mb-6">Smart Links FAQ</h2>

      <div class="space-y-4">
        <details
          v-for="(item, idx) in hubFaq"
          :key="idx"
          class="bg-gray-900 rounded-xl p-5 shadow hover:bg-gray-800 transition"
        >
          <summary class="cursor-pointer font-extrabold text-white">
            {{ item.q }}
          </summary>
          <p class="text-gray-300 mt-3">
            {{ item.a }}
          </p>
        </details>
      </div>
    </section>

    <!-- Cluster list -->
    <section v-if="articles?.data?.length" class="space-y-8">
      <h2 class="text-2xl font-bold text-pink-400">Latest Articles</h2>

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
    </section>

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
</style>
