// server/routes/sitemap.xml.ts
import { serverQueryContent } from '#content'
import { defineEventHandler, send } from 'h3'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://musicbizqr.com'

  const staticRoutes = [
    '/', '/signup', '/login', '/dashboard', '/createqr', '/createband',
    '/contact', '/account', '/privacypolicy', '/termsofservice',
    '/signupSuccess', '/signupCancelled', '/discover', '/newevent',
    '/error', '/directqr', '/test'
  ]

  // Fetch articles from Strapi
  const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/seo-pages?populate=category&pagination[pageSize]=1000`)
  const { data: articles } = await strapiRes.json()

  const categories = new Set<string>()
  const urls = []

  // Static routes
  staticRoutes.forEach((path) => {
    urls.push({
      loc: `${baseUrl}${path}`,
      changefreq: 'weekly',
      priority: 0.7,
    })
  })

  // Articles and category routes
  for (const page of articles) {
    const category = page.attributes.category || 'uncategorized'
    const slug = page.attributes.slug
    const lastmod = page.attributes.updatedAt

    urls.push({
      loc: `${baseUrl}/article/${category}/${slug}`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.9,
    })

    categories.add(category)
  }

  categories.forEach((cat) => {
    urls.push({
      loc: `${baseUrl}/article/${cat}`,
      changefreq: 'weekly',
      priority: 0.7,
    })
  })

  // XML generation
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(url => `
      <url>
        <loc>${url.loc}</loc>
        ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
      </url>
    `),
    '</urlset>'
  ].join('\n')

  send(event, xml, 'application/xml')
})
