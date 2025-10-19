// server/routes/directqr.ts
import { defineEventHandler, getQuery, setResponseStatus, sendRedirect, getRequestURL, getHeader } from 'h3'

// Small helper to ensure absolute https URL
function toAbsoluteHttps(raw: string) {
  const s = (raw || '').trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  return `https://${s}`
}

export default defineEventHandler(async (event) => {
  // Reconstruct the full URL you stored in Strapi previously: origin + path + query
  const reqUrl = getRequestURL(event) // e.g. https://musicbizqr.com/directqr?id=UUID&...
  const fullUrl = reqUrl.toString()

  const cfg = useRuntimeConfig()
  const strapiBase = cfg.public?.strapiUrl
  if (!strapiBase) {
    // Misconfig → avoid blank page
    return sendRedirect(event, 'https://musicbizqr.com', 302)
  }

  try {
    // 1) Fetch by exact URL match (your current behavior)
    // NOTE: If you later migrate to a dedicated "code" field, switch to code[$eq].
    const query = {
      'filters[url][$eq]': fullUrl,
      'populate': '*'
    }

    const searchUrl = `${strapiBase}/api/qrs`
    const res: any = await $fetch(searchUrl, { method: 'GET', query })
    const rows = Array.isArray(res?.data) ? res.data : []
    if (!rows.length) {
      // If exact match fails (www/apex or protocol differences), try a looser contains on options.data
      const fallback: any = await $fetch(searchUrl, {
        method: 'GET',
        query: {
          'filters[options][data][$containsi]': (getQuery(event).id as string) || '',
          'populate': '*'
        }
      })
      const fallbackRows = Array.isArray(fallback?.data) ? fallback.data : []
      if (!fallbackRows.length) {
        setResponseStatus(event, 404)
        return 'QR not found'
      }
      rows.push(fallbackRows[0])
    }

    // 2) Use the first matching QR entry
    const row = rows[0]
    const qrId = row.id
    const attrs = row.attributes || {}

    // 3) AR redirect if enabled
    if (attrs.arEnabled) {
      const tmpl = attrs.template || 'test'
      const arUrl = new URL(`/ar/${qrId}`, reqUrl.origin)
      arUrl.searchParams.set('template', tmpl)
      return sendRedirect(event, arUrl.toString(), 302)
    }

    // 4) Record the scan (fire-and-forget; do not block redirect)
    try {
      const body = { data: { date: new Date().toISOString(), qr: qrId } }
      // If your Strapi needs auth here, add headers.
      const p = $fetch(`${strapiBase}/api/scans`, { method: 'POST', body })
      // Avoid delaying the redirect:
      // @ts-expect-error waitUntil may exist under some adapters
      event.waitUntil?.(p)
    } catch {
      // ignore logging failures
    }

    // 5) Decide destination (server-side redirect)
    const { q_type, link, band, event: ev, tour, album, stream } = attrs
    let dest = 'https://musicbizqr.com'

    if (q_type === 'bandProfile' && band?.data) {
      const slug = band.data.attributes?.slug
      if (slug) dest = `${reqUrl.protocol}//${reqUrl.host}/${slug}`
    } else if (q_type === 'events' && ev?.data) {
      const slug = ev.data.attributes?.slug
      if (slug) dest = `${reqUrl.protocol}//${reqUrl.host}/event/${slug}`
    } else if (q_type === 'tours' && tour?.data) {
      const slug = tour.data.attributes?.slug
      if (slug) dest = `${reqUrl.protocol}//${reqUrl.host}/tour/${slug}`
    } else if (q_type === 'albums' && album?.data) {
      const slug = album.data.attributes?.slug
      if (slug) dest = `${reqUrl.protocol}//${reqUrl.host}/album/${slug}`
    } else if (q_type === 'stream' && stream?.data) {
      const sid = stream.data.id
      if (sid) dest = `${reqUrl.protocol}//${reqUrl.host}/stream/${sid}`
    } else if (q_type === 'social') {
      dest = `${reqUrl.protocol}//${reqUrl.host}/social/${qrId}`
    } else if (q_type === 'externalURL' && link) {
      dest = toAbsoluteHttps(link)
    } else {
      // fallback
      dest = `${reqUrl.protocol}//${reqUrl.host}/dashboard`
    }

    // 6) Preserve UTMs from the incoming request when redirecting externally
    const incoming = getQuery(event) as Record<string, string | string[]>
    const out = new URL(dest)
    for (const [k, v] of Object.entries(incoming)) {
      if (k.startsWith('utm_') && typeof v === 'string' && !out.searchParams.has(k)) {
        out.searchParams.set(k, v)
      }
    }

    // 7) Redirect immediately
    return sendRedirect(event, out.toString(), 302)

  } catch (e) {
    // Any error → safe redirect
    return sendRedirect(event, 'https://musicbizqr.com/error', 302)
  }
})
