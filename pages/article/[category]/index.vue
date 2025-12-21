<script setup>
import { useRoute, useAsyncData, useHead, useRuntimeConfig, computed } from '#imports'

const route = useRoute()
const config = useRuntimeConfig()

const category = String(route.params.category || '').trim()
const baseUrl = computed(() =>
  String(config.public.baseUrl || 'https://musicbizqr.com').replace(/\/$/, '')
)

const displayTitle = computed(() =>
  category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
)



const hubUrl = computed(() => `${baseUrl.value}/article/${category}`)
const articlesIndexUrl = computed(() => `${baseUrl.value}/article`)
const homeUrl = computed(() => `${baseUrl.value}/`)



// ---------- Hardcoded hub HTML ----------
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
        and tool comparisons.
      </p>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-extrabold mb-4">Quick Start: The Smart Links Library</h2>
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
  `,
  'qr-code-strategy': `
    <section class="prose prose-invert max-w-none mb-14">
      <p>
        QR codes aren’t a gimmick for musicians — they’re the fastest bridge between a real-world moment and a digital fan action.
        Posters, flyers, merch inserts, tip jars, stage banners, table tents, ticket stubs, even a phone screen at the merch booth:
        QR codes turn all of it into clickable momentum.
      </p>
      <p>
        But most artists use QR codes like a shortcut: one code, one random link, no strategy. The result is wasted scans and
        zero insight. A real <strong>QR code strategy</strong> treats every scan like a measurable entry point into your fan funnel —
        where you can drive streams, follows, ticket clicks, email signups, and merch sales <em>without guessing</em>.
      </p>
      <p>
        This hub is your library for building QR codes the right way: what to link to, where to place codes, how to track results,
        and how to design scans that actually convert — not just “look cool.”
      </p>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-extrabold mb-4">Quick Start: QR Code Strategy Library</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/qr-code-strategy">
          <div class="text-pink-400 font-bold">Pillar</div>
          <div class="text-white font-extrabold text-lg">The QR Code Strategy Hub</div>
          <div class="text-gray-300 text-sm mt-1">Your complete framework for scans, funnels, tracking, and growth.</div>
        </a>

        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/qr-code-strategy/how-to-make-qr-code-for-music">
          <div class="text-pink-400 font-bold">Start Here</div>
          <div class="text-white font-extrabold text-lg">How to Make a QR Code for Music</div>
          <div class="text-gray-300 text-sm mt-1">The right destinations, best practices, and mistakes to avoid.</div>
        </a>

        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/qr-code-strategy/qr-codes-for-musicians">
          <div class="text-pink-400 font-bold">Use Cases</div>
          <div class="text-white font-extrabold text-lg">QR Codes for Musicians</div>
          <div class="text-gray-300 text-sm mt-1">Where QR codes belong in your marketing — online and on the street.</div>
        </a>

        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/qr-code-strategy/qr-code-tracking-for-musicians">
          <div class="text-pink-400 font-bold">Track</div>
          <div class="text-white font-extrabold text-lg">QR Code Tracking for Musicians</div>
          <div class="text-gray-300 text-sm mt-1">Measure scans, locations, and conversion — and improve what’s working.</div>
        </a>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="text-3xl font-extrabold mb-4">Where QR Codes Convert Best</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/qr-code-strategy/qr-codes-for-concerts">
          <div class="text-pink-400 font-bold">Live Shows</div>
          <div class="text-white font-extrabold text-lg">QR Codes for Concerts</div>
          <div class="text-gray-300 text-sm mt-1">From posters to merch tables — turn a crowd into a funnel.</div>
        </a>

        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/qr-code-strategy/qr-code-for-merch">
          <div class="text-pink-400 font-bold">Merch</div>
          <div class="text-white font-extrabold text-lg">QR Codes for Merch</div>
          <div class="text-gray-300 text-sm mt-1">Add scans to shirts, stickers, inserts, and receipts for repeat traffic.</div>
        </a>

        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/qr-code-strategy/spotify-qr-code-for-artists">
          <div class="text-pink-400 font-bold">Streaming</div>
          <div class="text-white font-extrabold text-lg">Spotify QR Codes for Artists</div>
          <div class="text-gray-300 text-sm mt-1">Drive saves and follows without hoping they search your name later.</div>
        </a>

        <a class="bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition" href="/article/qr-code-strategy/qr-code-to-email-signup">
          <div class="text-pink-400 font-bold">Email List</div>
          <div class="text-white font-extrabold text-lg">QR Codes to Email Signup</div>
          <div class="text-gray-300 text-sm mt-1">Own your audience by turning physical moments into subscribers.</div>
        </a>
      </div>
    </section>
  `
}

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
      a: 'Yes. By reducing friction and presenting the “next best action” clearly, more fans follow, save, and click through instead of bouncing.'
    }
  ]
}
const hubFaq = computed(() => faqByCategory[category] || [])

// ---------- Strapi helper (querystring-safe) ----------
function buildUrl(path, qsObj = {}) {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(qsObj)) {
    if (v === undefined || v === null || v === '') continue
    qs.set(k, String(v))
  }
  return `${config.public.strapiUrl}${path}?${qs.toString()}`
}
function toAbsMaybe(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${config.public.strapiUrl}${url}`
}

// ---------- 1) Pillar fetch ----------
const { data: pillarData, error: pillarError } = await useAsyncData(
  `pillar-${category}`,
  async () => {
    if (!category) return { data: [] }

    const url = buildUrl('/api/seo-pages', {
      // TEMP: safer than $eq if you have trailing spaces or weird category values
      'filters[category][$containsi]': category,

      // ✅ reliable boolean filter
      'filters[isPillar][$eq]': 'true',

      'pagination[pageSize]': '1',
      'sort[0]': 'publishedAt:desc',
      'fields[0]': 'title',
      'fields[1]': 'slug',
      'fields[2]': 'metaTitle',
      'fields[3]': 'metaDescription',
      'fields[4]': 'publishedAt',
      'fields[5]': 'keywords',
      'populate[ogImage]': '*',
      'populate[author]': '*'
    })

    const res = await $fetch(url)
    console.log('✅ pillar url:', url)
    console.log('✅ pillar count:', res?.data?.length)
    return res
  }
)

if (pillarError?.value) console.error('Pillar fetch error:', pillarError.value)

const pillar = computed(() => pillarData.value?.data?.[0]?.attributes || null)

const ogImage = computed(() => {
  const rel =
    pillar.value?.ogImage?.data?.attributes?.url ||
    pillar.value?.ogImage?.url
  const abs = toAbsMaybe(rel)
  return abs || `${baseUrl.value}/default-og.png`
})

const keywordsArray = computed(() =>
  (pillar.value?.keywords || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
)




const categoryStr = computed(() => String(route.params.category || '').trim())
const clusterKey = computed(() => `cluster-${categoryStr.value || 'none'}`)
const categoryForSearch = computed(() =>
  categoryStr.value.replace(/-/g, ' ').trim()
)


function safePreview(obj, max = 600) {
  try {
    const s = JSON.stringify(obj)
    return s.length > max ? s.slice(0, max) + '…(truncated)' : s
  } catch (e) {
    return String(obj)
  }
}

const clusterUrl = computed(() =>
  buildUrl('/api/seo-pages', {
    'filters[category][$eq]': categoryStr.value,
       // ✅ include NULL (your non-pillars) OR false (future-proof)
    'filters[$or][0][isPillar][$null]': 'true',
    'filters[$or][1][isPillar][$eq]': 'false',
    'pagination[pageSize]': '50',
    'sort[0]': 'publishedAt:desc',
    'fields[0]': 'title',
    'fields[1]': 'slug',
    'fields[2]': 'metaTitle',
    'fields[3]': 'metaDescription'
  })
)

console.log('🔥 clusterUrl FINAL:', clusterUrl.value)


const { data: clusterData, pending: clusterPending, error: clusterError, refresh: refreshCluster } =
  await useAsyncData(
    `cluster-${categoryStr.value || 'none'}`,
    async () => {
      const url = clusterUrl.value

      // --------- MEGA LOGS ---------
      console.log('===============================')
      console.log('🚀 CLUSTER ASYNCDATA START')
      console.log('env:', process.server ? 'SERVER' : 'CLIENT')
      console.log('route:', route.fullPath)
      console.log('categoryStr:', categoryStr.value)
      console.log('url:', url)
      console.log('strapiUrl config:', config.public.strapiUrl)
      console.log('===============================')

      // 1) try $fetch (Nuxt)
      try {
        const res = await $fetch(url)
        console.log('✅ $fetch OK')
        console.log('✅ $fetch type:', typeof res)
        console.log('✅ $fetch preview:', safePreview(res))
        console.log('✅ $fetch data length:', res?.data?.length)
        console.log('✅ $fetch first:', res?.data?.[0])
        console.log('🚀 CLUSTER ASYNCDATA END ($fetch)')
        console.log('===============================')
        return res
      } catch (e) {
        console.error('❌ $fetch FAILED:', e)
      }

      // 2) fallback to raw fetch so we can inspect status/headers/body
      try {
        const r = await fetch(url, { method: 'GET' })
        console.log('✅ raw fetch status:', r.status, r.statusText)
        console.log('✅ raw fetch content-type:', r.headers.get('content-type'))
        const text = await r.text()
        console.log('✅ raw fetch body length:', text.length)
        console.log('✅ raw fetch body preview:', text.slice(0, 800))
        let json = null
        try {
          json = JSON.parse(text)
          console.log('✅ raw fetch JSON parsed')
          console.log('✅ raw fetch data length:', json?.data?.length)
          console.log('✅ raw fetch first:', json?.data?.[0])
        } catch (parseErr) {
          console.error('❌ raw fetch JSON parse failed:', parseErr)
        }
        console.log('🚀 CLUSTER ASYNCDATA END (raw fetch)')
        console.log('===============================')
        return json || { data: [] }
      } catch (e2) {
        console.error('❌ raw fetch FAILED:', e2)
        console.log('🚀 CLUSTER ASYNCDATA END (failed)')
        console.log('===============================')
        return { data: [] }
      }
    },
    {
      watch: [categoryStr],
      server: true
    }
  )

// This will show you if Nuxt is giving you a Ref, an object, etc.

console.log('🧩 clusterPending:', clusterPending.value)
console.log('🧩 clusterError:', clusterError.value || null)
console.log('🧩 clusterData.value preview:', safePreview(clusterData.value))


const clusterArticles = computed(() => {
  const v = clusterData.value
  if (Array.isArray(v)) return v
  return v?.data || []
})





const DEBUG = true

async function debugSeoPages() {
  if (!DEBUG) return

  console.log('===============================')
  console.log('🔎 SEO DEBUG START')
  console.log('Route category param:', route.params.category)
  console.log('Computed categoryStr:', categoryStr.value)
  console.log('Computed categoryForSearch:', categoryForSearch.value)
  console.log('Strapi URL:', config.public.strapiUrl)
  console.log('===============================')

  // 1) Can we fetch anything at all?
  const urlAny = buildUrl('/api/seo-pages', {
    'pagination[pageSize]': '5',
    'sort[0]': 'publishedAt:desc',
    // include these fields so we can inspect them
    'fields[0]': 'title',
    'fields[1]': 'slug',
    'fields[2]': 'category',
    'fields[3]': 'isPillar',
    'fields[4]': 'publishedAt'
  })

  const anyRes = await $fetch(urlAny).catch((e) => {
    console.error('❌ Unfiltered fetch failed:', e)
    return null
  })

  console.log('✅ Unfiltered URL:', urlAny)
  console.log('✅ Unfiltered count:', anyRes?.data?.length)
  console.log('✅ Unfiltered sample raw:', anyRes?.data?.[0])

  if (!anyRes?.data?.length) {
    console.warn('⚠️ ZERO results from unfiltered /api/seo-pages')
    console.warn('This almost always means: Strapi Permissions OR Draft/Publish not public.')
    console.warn('Go to Strapi Admin → Settings → Users & Permissions → Public → seo-page → find + findOne must be enabled.')
    console.warn('Also check that the entries are actually Published.')
    console.log('🔎 SEO DEBUG END (early)')
    console.log('===============================')
    return
  }

  // 2) Pull a bigger sample to inspect categories
  const urlSample = buildUrl('/api/seo-pages', {
    'pagination[pageSize]': '200',
    'sort[0]': 'publishedAt:desc',
    'fields[0]': 'category',
    'fields[1]': 'isPillar',
    'fields[2]': 'slug'
  })

  const sampleRes = await $fetch(urlSample).catch((e) => {
    console.error('❌ Sample fetch failed:', e)
    return null
  })

  const rows = sampleRes?.data || []
  console.log('✅ Sample URL:', urlSample)
  console.log('✅ Sample count:', rows.length)

  const categories = {}
  const isPillarCounts = { true: 0, false: 0, null: 0, other: 0 }

  for (const r of rows) {
    const a = r?.attributes || {}

    const cat = a.category
    const catKey =
      cat === null || cat === undefined || cat === ''
        ? '(empty)'
        : String(cat)

    categories[catKey] = (categories[catKey] || 0) + 1

    const p = a.isPillar
    if (p === true) isPillarCounts.true++
    else if (p === false) isPillarCounts.false++
    else if (p === null || p === undefined) isPillarCounts.null++
    else isPillarCounts.other++
  }

  console.log('📌 DISTINCT CATEGORIES (value -> count):', categories)
  console.log('📌 isPillar counts:', isPillarCounts)

  // 3) Test filters directly
  const tests = [
    { label: 'containsi route param', filter: categoryStr.value },
    { label: 'containsi hyphen->space', filter: categoryForSearch.value },
    { label: 'eq route param', filterEq: categoryStr.value },
    { label: 'eq hyphen->space', filterEq: categoryForSearch.value }
  ]

  for (const t of tests) {
    let testUrl
    if (t.filter) {
      testUrl = buildUrl('/api/seo-pages', {
        'filters[category][$containsi]': t.filter,
        'pagination[pageSize]': '5',
        'sort[0]': 'publishedAt:desc',
        'fields[0]': 'category',
        'fields[1]': 'isPillar',
        'fields[2]': 'slug'
      })
    } else {
      testUrl = buildUrl('/api/seo-pages', {
        'filters[category][$eq]': t.filterEq,
        'pagination[pageSize]': '5',
        'sort[0]': 'publishedAt:desc',
        'fields[0]': 'category',
        'fields[1]': 'isPillar',
        'fields[2]': 'slug'
      })
    }

    const testRes = await $fetch(testUrl).catch((e) => {
      console.error(`❌ Test failed (${t.label}):`, e)
      return null
    })

    console.log(`🧪 TEST: ${t.label}`)
    console.log('URL:', testUrl)
    console.log('count:', testRes?.data?.length)
    console.log('sample:', testRes?.data?.[0])
  }

  console.log('🔎 SEO DEBUG END')
  console.log('===============================')
}

// run once on page load
await debugSeoPages()




// ---------- JSON-LD ----------
const jsonLdHub = computed(() => {
  const catName = displayTitle.value
  const title = pillar.value?.metaTitle || `${catName} | MusicBizQR`
  const description =
    pillar.value?.metaDescription ||
    `Browse ${catName} articles to help you grow your music using smart links, QR codes, and fan funnel strategy.`

  const faqEntities = hubFaq.value.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a }
  }))

  const graph = [
    {
      '@id': `${baseUrl.value}/#website`,
      '@type': 'WebSite',
      url: `${baseUrl.value}/`,
      name: 'MusicBizQR',
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl.value}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@id': `${baseUrl.value}/#organization`,
      '@type': 'Organization',
      name: 'MusicBizQR',
      url: `${baseUrl.value}/`,
      inLanguage: 'en'
    },
    {
      '@id': `${hubUrl.value}/#webpage`,
      '@type': 'WebPage',
      url: hubUrl.value,
      name: title,
      description,
      inLanguage: 'en',
      isPartOf: { '@id': `${baseUrl.value}/#website` },
      about: { '@id': `${baseUrl.value}/#organization` },
      breadcrumb: { '@id': `${hubUrl.value}/#breadcrumb` },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        '@id': `${hubUrl.value}/#primaryimage`,
        url: ogImage.value
      }
    },
    {
      '@id': `${hubUrl.value}/#breadcrumb`,
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl.value },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: articlesIndexUrl.value },
        { '@type': 'ListItem', position: 3, name: catName, item: hubUrl.value }
      ]
    }
  ]

  if (faqEntities.length) {
    graph.push({
      '@id': `${hubUrl.value}/#faq`,
      '@type': 'FAQPage',
      url: hubUrl.value,
      inLanguage: 'en',
      mainEntity: faqEntities
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
})

// ---------- Head ----------
useHead(() => {
  const title = pillar.value?.metaTitle || `${displayTitle.value} | MusicBizQR`
  const description =
    pillar.value?.metaDescription ||
    `Browse ${displayTitle.value} articles to help you grow your music using smart links, QR codes, and fan funnel strategy.`

  return {
    title,
    link: [
      { rel: 'canonical', href: hubUrl.value },
      { rel: 'icon', href: '/favicon.ico' }
    ],
    meta: [
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: hubUrl.value },
      { property: 'og:image', content: ogImage.value },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage.value },
      ...(keywordsArray.value.length ? [{ name: 'keywords', content: keywordsArray.value.join(', ') }] : [])
    ],
    script: [
      { type: 'application/ld+json', children: JSON.stringify(jsonLdHub.value) }
    ]
  }
})
</script>


<template>
  <div class="bg-black text-white px-4 py-16 max-w-3xl mx-auto">
    <h1 class="text-4xl font-extrabold mb-6 text-gradient">
      {{ displayTitle }}
    </h1>

    <!-- Hub content -->
    <div v-if="hubHtml" v-html="hubHtml" class="mb-10" />

    <!-- Featured Pillar -->
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
      </div>
    </section>

    <!-- FAQ -->
    <section v-if="hubFaq.length" class="mb-14">
      <h2 class="text-2xl font-bold text-pink-400 mb-6">FAQ</h2>
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
    <section v-if="clusterArticles.length" class="space-y-8">
      <h2 class="text-2xl font-bold text-pink-400">Latest Articles</h2>

      <div
        v-for="post in clusterArticles"
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
