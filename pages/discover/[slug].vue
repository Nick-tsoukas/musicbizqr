<script setup>
import { useRoute, useAsyncData, useHead } from '#imports'
import { marked } from 'marked'

const route = useRoute()
const slug = route.params.slug

const { data: seoPage, error } = await useAsyncData(`seo-${slug}`, () =>
  $fetch(`${useRuntimeConfig().public.strapiUrl}/api/seo-pages?filters[slug][$eq]=${slug}&populate=*`)
)

if (error.value) {
  console.error('SEO page fetch error:', error.value)
}

const page = seoPage.value?.data?.[0]?.attributes || {}

useHead({
  title: page.title || 'Discover New Music',
  meta: [
    {
      name: 'description',
      content: page.title || 'Explore artist QR tech and music marketing tips.',
    },
  ],
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
