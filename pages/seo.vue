<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const articles = ref<any[]>([])

const BASE_URL = 'https://musicbizqr.com'

onMounted(async () => {
  try {
    const res = await fetch(
      'https://qrserver-production.up.railway.app/api/seo-pages?populate=category&pagination[pageSize]=100'
    )
    const json = await res.json()

    articles.value = json.data || []

    const formatDate = (isoString: string) => {
      const date = new Date(isoString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    console.log('📝 All Articles with URLs and Updated Dates:')
    articles.value.forEach((article) => {
      const { title, slug, category, updatedAt } = article.attributes

      const categorySlug =
        typeof category === 'string'
          ? category
          : category?.data?.attributes?.slug || category?.data?.attributes?.name || ''

      let path = ''
      if (categorySlug) {
        if (slug === categorySlug) {
          path = `/article/${categorySlug}` // Pillar page
        } else {
          path = `/article/${categorySlug}/${slug}`
        }
      } else {
        path = `/article/${slug}` // fallback
      }

      const fullUrl = `${BASE_URL}${path}`
      const updatedDate = updatedAt ? formatDate(updatedAt) : 'N/A'

      console.log(`- ${title} → ${fullUrl} (Updated: ${updatedDate})`)
    })
  } catch (err) {
    console.error('❌ Failed to fetch articles:', err)
  }
})
</script>
