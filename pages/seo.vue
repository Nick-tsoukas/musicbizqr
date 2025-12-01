<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const articles = ref<any[]>([])

const BASE_URL = 'https://musicbizqr.com'

onMounted(async () => {
  try {
    const res = await fetch('https://qrserver-production.up.railway.app/api/seo-pages?populate=category&pagination[pageSize]=100')
    const json = await res.json()

    articles.value = json.data || []

    console.log('📝 All Articles with URLs:')
    articles.value.forEach((article) => {
      const { title, slug, category } = article.attributes

      // If category is a simple string field (most likely in your setup)
      const categorySlug =
        typeof category === 'string'
          ? category
          // If you ever switch to a relation like category.data.attributes.slug
          : category?.data?.attributes?.slug || category?.data?.attributes?.name || ''

      // Build the path:
      // - Pillar: /article/:category
      // - Child article: /article/:category/:slug
      let path = ''
      if (categorySlug) {
        if (slug === categorySlug) {
          // Pillar page
          path = `/article/${categorySlug}`
        } else {
          // Normal article under a category
          path = `/article/${categorySlug}/${slug}`
        }
      } else {
        // Fallback if no category (shouldn't really happen, but just in case)
        path = `/article/${slug}`
      }

      const fullUrl = `${BASE_URL}${path}`

      console.log(`- ${title} → ${fullUrl}`)
    })
  } catch (err) {
    console.error('❌ Failed to fetch articles:', err)
  }
})
</script>
