<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const articles = ref([])

onMounted(async () => {
  try {
    const res = await fetch('https://qrserver-production.up.railway.app/api/seo-pages?populate=category&pagination[pageSize]=100')
    const json = await res.json()

    articles.value = json.data || []

    console.log('📝 All Articles:')
    articles.value.forEach(article => {
      const { title, slug } = article.attributes
      console.log(`- ${title} [/${slug}]`)
    })
  } catch (err) {
    console.error('❌ Failed to fetch articles:', err)
  }
})
</script>
