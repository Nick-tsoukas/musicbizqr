<script setup>
import { useRoute, useAsyncData, useHead, useRuntimeConfig } from "#imports";

const route = useRoute();
const category = route.params.category;
const config = useRuntimeConfig();

const capitalized = category
  .replace(/-/g, " ")
  .replace(/\b\w/g, (l) => l.toUpperCase());

useHead({
  title: `${capitalized} | MusicBizQR`,
  meta: [
    {
      name: "description",
      content: `Explore powerful articles about ${capitalized} and how to grow your music using QR codes and smart links.`,
    },
    { property: "og:title", content: `${capitalized} | MusicBizQR` },
    {
      property: "og:description",
      content: `Explore powerful articles about ${capitalized} and how to grow your music using QR codes and smart links.`,
    },
    {
      property: "og:url",
      content: `https://musicbizqr.com/article/${category}`,
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${capitalized} | MusicBizQR` },
    {
      name: "twitter:description",
      content: `Explore powerful articles about ${capitalized} and how to grow your music using QR codes and smart links.`,
    },
  ],
  link: [
    { rel: "canonical", href: `https://musicbizqr.com/article/${category}` },
  ],
});

const { data: articles, error } = await useAsyncData(
  `category-${category}`,
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        "filters[category][$eq]": category,
        populate: "*",
        sort: ["publishedAt:desc"],
      },
    })
);

if (error.value) {
  console.error("❌ SEO category fetch error:", error.value);
} else {
  console.log("✅ SEO pages in category:", articles.value);
}
</script>

<template>
  <div class="bg-black text-white px-4 py-16 max-w-5xl mx-auto">
    <h1 class="text-4xl font-extrabold mb-4 text-gradient">
      {{ category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) }}
    </h1>

    <p class="mb-10 text-lg text-gray-300">
      Articles about
      {{ category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) }}
      to help you grow your fanbase and monetize your music.
    </p>

    <div v-if="articles?.data?.length" class="space-y-8">
      <div
        v-for="post in articles.data"
        :key="post.id"
        class="bg-gray-900 p-6 rounded-lg shadow hover:bg-gray-800 transition"
      >
        <NuxtLink
          :to="`/article/${category}/${post.attributes.slug}`"
          class="text-2xl font-bold text-pink-400"
        >
          {{ post.attributes.title }}
        </NuxtLink>
        <p class="text-sm text-gray-400 mt-2">
          {{ post.attributes.metaDescription }}
        </p>
       
      </div>
    </div>

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
