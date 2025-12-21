<script setup>
import {
  useRoute,
  useAsyncData,
  useHead,
  useRuntimeConfig,
  computed,
  nextTick,
  onMounted,
  watch,
} from "#imports";
import { marked } from "marked";

// ---------------- Markdown / Marked Setup ----------------

// Simple, safe slugify that ALWAYS works with strings
function slugify(text) {
  const s = String(text ?? "");

  return s
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, "-") // replace non-word chars with dashes
    .replace(/(^-|-$)+/g, ""); // trim leading/trailing dashes
}

// Modern Marked v8-style renderer
// heading receives a single token: { tokens, depth }
const renderer = {
  heading({ tokens, depth }) {
    // `this.parser.parseInline(tokens)` is the official way to get text
    const text = this.parser.parseInline(tokens);
    const id = slugify(text);

    return `
<h${depth} id="${id}">
  ${text}
</h${depth}>
`;
  },
};

// Register the renderer with marked
marked.use({ renderer });

// Helper to render markdown safely
function renderMarkdown(markdown) {
  return marked.parse(markdown ?? "");
}

// ---------------- Route / Config ----------------
const route = useRoute();
const category = route.params.category;
const slug = route.params.slug;
const config = useRuntimeConfig();

function scrollToTopIfNeeded() {
  // If navigating to a hash (TOC or takeaways), let the router handle it
  if (route.hash) return;

  // Wait until DOM is painted
  nextTick(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  });
}

// Initial load
onMounted(scrollToTopIfNeeded);

// Subsequent navigations between articles
watch(
  () => route.fullPath,
  () => {
    scrollToTopIfNeeded();
  }
);

// ---------------- Article Fetch ----------------
const { data: seoPage, error } = await useAsyncData(
  `article-${category}-${slug}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        "filters[slug][$eq]": slug,
        "filters[category][$eq]": category,
        populate: "*",
      },
    })
);

if (error.value) {
  console.error("Article fetch error:", error.value);
}

const page = seoPage.value?.data?.[0]?.attributes || {};

const pageUrl = `https://musicbizqr.com/article/${category}/${slug}`;
const publishedDate = page.publishedAt || new Date().toISOString();
const authorName = page.author?.name || "MusicBizQR";
const keywordsArray = (page.keywords || "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

// Adjust this to match your Strapi media shape if needed
const ogImage = page.ogImage?.url || "https://musicbizqr.com/default-og.png";

// ---------------- Executive Summary + Key Takeaways ----------------

// Render executive summary markdown (safe: empty string if missing)
const executiveSummaryHtml = computed(() => {
  const md = page.executiveSummary || "";
  if (!md) return "";
  return renderMarkdown(md);
});

// Normalize takeaways JSON (safe for old articles)
const takeaways = computed(() => {
  const raw = page.executiveSummaryTakeaways;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      const label = String(item?.label || item?.text || "").trim();
      const anchorId = String(item?.anchorId || "").trim();
      const description = String(item?.description || "").trim();

      return { label, anchorId, description };
    })
    .filter((t) => t.label && t.anchorId)
    .slice(0, 7);
});

// Optional: smooth-scroll + highlight when a hash is present
function scrollToHashAndHighlight() {
  const id = String(route.hash || "")
    .replace("#", "")
    .trim();
  if (!id) return;

  nextTick(() => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    el.classList.add("anchor-highlight");
    window.setTimeout(() => el.classList.remove("anchor-highlight"), 1400);
  });
}

onMounted(() => {
  scrollToHashAndHighlight();
});

watch(
  () => route.hash,
  () => {
    scrollToHashAndHighlight();
  }
);

onMounted(async () => {
  const fbq = (nuxtApp.$fbq )
  if (!process.client || !fbq) return

  // Build article identifiers
  const slug = String(route.params.slug || '')
  const url = window.location.href

  // Stable event_id for this article view (per session)
  const storageKey = `mbq_event_article_${slug}`
  let eventId = sessionStorage.getItem(storageKey)

  if (!eventId) {
    eventId =
      window.crypto?.randomUUID?.() ||
      `article-${slug}-${Date.now()}-${Math.random().toString(16).slice(2)}`
    sessionStorage.setItem(storageKey, eventId)
  }

  // Pull UTMs saved by plugin (B.2)
  let utm = {}
  try {
    utm = JSON.parse(sessionStorage.getItem('mbq_utm') || '{}')
  } catch {}

  const payload = {
    ...utm,
    event_id: eventId,
    content_name: slug,
    content_category: 'article',
    content_type: 'article',
  }

  // 1) Browser pixel events
  fbq('track', 'ViewContent', payload)
  fbq('trackCustom', 'ArticleViewed', payload)

  // 2) Server-side CAPI (dedupe)
  try {
    await fetch('/api/meta/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'ViewContent',
        event_id: eventId,
        event_source_url: url,
        custom_data: {
          ...payload,
        },
      }),
    })
  } catch {}
})


// ---------------- Related Posts ----------------
const { data: articles, error: relatedError } = await useAsyncData(
  `related-${category}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        "filters[category][$eq]": category,
        sort: ["publishedAt:desc"],
        pagination: { limit: 3 },
        fields: ["title", "slug", "metaTitle", "metaDescription"],
      },
    })
);

if (relatedError.value) {
  console.error("Related posts fetch error:", relatedError.value);
}

// ---------------- JSON-LD from Strapi ----------------
// We assume you added a JSON field called "jsonLd" to the seo-page type
const jsonLdString = computed(() => {
  if (!page.jsonLd) return null;
  try {
    return JSON.stringify(page.jsonLd);
  } catch (e) {
    console.error("Error stringifying JSON-LD from Strapi", e);
    return null;
  }
});

// ---------------- SEO Head ----------------
useHead(() => {
  const title = page.metaTitle || page.title || "Discover New Music";
  const description =
    page.metaDescription ||
    page.excerpt ||
    page.title ||
    "Explore music growth strategies using QR codes and smart links.";

  const meta = [
    { name: "description", content: description },

    // ✅ Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: pageUrl },
    { property: "og:type", content: "article" },
    { property: "og:image", content: ogImage },
    { property: "article:published_time", content: publishedDate },
    { property: "article:section", content: category },
    ...keywordsArray.map((tag) => ({ property: "article:tag", content: tag })),

    // ✅ Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },

    // ✅ Author & Keywords
    { name: "author", content: authorName },
    { name: "keywords", content: keywordsArray.join(", ") },

    // ✅ Optional polish
    { name: "theme-color", content: "#000000" },
  ];

  const link = [
    { rel: "canonical", href: pageUrl },
    { rel: "icon", href: "/favicon.ico" },
  ];

  const script = [];

  if (jsonLdString.value) {
    // ✅ Use JSON-LD from Strapi (your @graph template)
    script.push({
      type: "application/ld+json",
      children: jsonLdString.value,
    });
  } else {
    // 🔁 Fallback: Article + Breadcrumb JSON-LD
    script.push(
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: description,
          author: {
            "@type": "Person",
            name: authorName,
          },
          datePublished: publishedDate,
          publisher: {
            "@type": "Organization",
            name: "MusicBizQR",
            logo: {
              "@type": "ImageObject",
              url: "https://musicbizqr.com/logo.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
          },
          image: ogImage,
          keywords: keywordsArray,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://musicbizqr.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Articles",
              item: `https://musicbizqr.com/article/${category}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: page.title,
              item: pageUrl,
            },
          ],
        }),
      }
    );
  }

  return {
    title,
    meta,
    link,
    script,
  };
});
</script>

<template>
  <div class="bg-black text-white py-16 px-6 max-w-3xl mx-auto">
    <h1 class="text-3xl md:text-5xl font-extrabold mb-8 text-gradient">
      {{ page.title }}
    </h1>

    <!-- Executive Summary + Key Takeaways (only shows if present) -->
    <section
      v-if="executiveSummaryHtml || takeaways.length"
      class="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-10"
    >
      <h2 class="text-xl font-extrabold text-pink-400 mb-3">
        Executive Summary
      </h2>

      <div
        v-if="executiveSummaryHtml"
        class="prose prose-invert max-w-none"
        v-html="executiveSummaryHtml"
      />

      <div v-if="takeaways.length" class="mt-6">
        <h3 class="text-lg font-bold mb-3">Key Takeaways</h3>

        <ul class="space-y-3">
          <li
            v-for="(t, i) in takeaways"
            :key="`${t.anchorId}-${i}`"
            class="flex gap-3"
          >
            <span class="text-pink-400 font-bold">•</span>

            <!-- Native hash behavior; our watcher will smooth-scroll + highlight -->
            <a
              :href="`#${t.anchorId}`"
              class="text-gray-100 hover:text-pink-300 transition underline decoration-gray-600 hover:decoration-pink-400"
            >
              {{ t.label }}
            </a>
            <p v-if="t.description" class="text-sm text-gray-400 mt-1">
              {{ t.description }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <div
      class="prose prose-invert max-w-none"
      v-html="renderMarkdown(page.content || '')"
    />

    <section
      class="bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-2xl shadow-xl my-12 overflow-hidden"
    >
      <div class="grid md:grid-cols-2 gap-6 p-6 md:p-10 items-center">
        <!-- Text -->
        <div>
          <h2 class="text-3xl font-extrabold mb-4">
            Built for Musicians. Powered by Smart Links.
          </h2>
          <p class="text-lg mb-4">
            MusicBizQR gives you a powerful landing page with streaming links,
            videos, social buttons, and real-time fan analytics — all from a
            single QR code.
          </p>
          <ul class="space-y-2 mb-6">
            <li>🎯 Unlimited link clicks & analytics</li>
            <li>📈 Track Spotify streams, YouTube plays, and QR scans</li>
            <li>📱 Mobile-optimized artist pages</li>
            <li>🚀 Create your first Smart Link in seconds</li>
          </ul>
          <NuxtLink
            to="/signup"
            class="inline-block bg-white text-black font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-200 transition"
          >
            Start Your Free Trial
          </NuxtLink>
        </div>

        <!-- Screenshot -->
        <div class="flex justify-center">
          <img
            src="/screenshotappnovideo.png"
            alt="MusicBizQR dashboard"
            class="rounded-xl w-full max-w-md shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <div class="h-40 flex justify-center items-center">
      <NuxtLink to="/">
        <img src="@/assets/musicbizlogo.png" class="h-12" />
      </NuxtLink>
    </div>
  </div>

  <!-- Related posts -->
  <div
    v-if="articles?.data?.length"
    class="space-y-8 max-w-3xl mx-auto mt-16 px-6"
  >
    <h2 class="text-2xl font-bold text-pink-400">Related Posts</h2>
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

.anchor-highlight {
  outline: 2px solid rgba(236, 72, 153, 0.9);
  border-radius: 12px;
  scroll-margin-top: 96px;
}
</style>
