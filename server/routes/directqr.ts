// server/routes/directqr.ts
import {
  defineEventHandler,
  getQuery,
  setResponseStatus,
  sendRedirect,
  getRequestURL,
  setCookie,
} from 'h3'

// normalize to https://...
function toAbsoluteHttps(raw: string) {
  const s = (raw || '').trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  return `https://${s}`
}

export default defineEventHandler(async (event) => {
  const reqUrl = getRequestURL(event)
  const cfg = useRuntimeConfig()
  const strapiBase = cfg.public?.strapiUrl

  // hard fail → send to app
  if (!strapiBase) {
    return sendRedirect(event, 'https://musicbizqr.com', 302)
  }

  try {
    // 1) try exact match on QR url
    const mainQuery = {
      'filters[url][$eq]': reqUrl.toString(),
      populate: '*',
    } as const

    const searchUrl = `${strapiBase}/api/qrs`
    const res: any = await $fetch(searchUrl, { method: 'GET', query: mainQuery })
    let row = Array.isArray(res?.data) ? res.data[0] : null

    // 1b) fallback: try match by "id" inside options.data
    if (!row) {
      const incoming = getQuery(event)
      const looseId = (incoming.id as string) || ''
      const fb: any = await $fetch(searchUrl, {
        method: 'GET',
        query: {
          'filters[options][data][$containsi]': looseId,
          populate: '*',
        },
      })
      const fbRows = Array.isArray(fb?.data) ? fb.data : []
      if (!fbRows.length) {
        setResponseStatus(event, 404)
        return 'QR not found'
      }
      row = fbRows[0]
    }

    // 2) basic extract
    const qrId: number = row.id
    const attrs: any = row.attributes || {}
    const bandRel = attrs.band?.data
    const bandId: number | null = bandRel ? bandRel.id : null

    // 3) create scan in Strapi with rich analytics data (non-blocking-ish)
    let createdScanId: number | null = null
    const eventRel = attrs.event?.data
    const eventId: number | null = eventRel ? eventRel.id : null
    
    // Extract UTM params from incoming request
    const incoming = getQuery(event) as Record<string, string | string[]>
    const utmSource = typeof incoming.utm_source === 'string' ? incoming.utm_source : null
    const utmMedium = typeof incoming.utm_medium === 'string' ? incoming.utm_medium : null
    const utmCampaign = typeof incoming.utm_campaign === 'string' ? incoming.utm_campaign : null
    const utmTerm = typeof incoming.utm_term === 'string' ? incoming.utm_term : null
    const utmContent = typeof incoming.utm_content === 'string' ? incoming.utm_content : null
    const gclid = typeof incoming.gclid === 'string' ? incoming.gclid : null
    const fbclid = typeof incoming.fbclid === 'string' ? incoming.fbclid : null
    const ttclid = typeof incoming.ttclid === 'string' ? incoming.ttclid : null
    const twclid = typeof incoming.twclid === 'string' ? incoming.twclid : null

    // Get referrer from request headers
    const reqHeaders = event.node.req.headers || {}
    const referrer = reqHeaders.referer || reqHeaders.referrer || null
    const userAgent = reqHeaders['user-agent'] || null

    try {
      const scanBody = {
        date: new Date().toISOString(),
        qr: qrId,
        band: bandId,
        event: eventId,
        entryType: 'qr',
        referrer,
        userAgent,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        gclid,
        fbclid,
        ttclid,
        twclid,
      }

      // Use the new /track endpoint which extracts CF headers server-side
      const scanRes: any = await $fetch(`${strapiBase}/api/scans/track`, {
        method: 'POST',
        body: scanBody,
        headers: {
          // Forward Cloudflare headers if present
          'cf-ipcountry': reqHeaders['cf-ipcountry'] || '',
          'cf-ipcity': reqHeaders['cf-ipcity'] || '',
          'cf-region': reqHeaders['cf-region'] || '',
          'cf-iplatitude': reqHeaders['cf-iplatitude'] || '',
          'cf-iplongitude': reqHeaders['cf-iplongitude'] || '',
        },
      })
      createdScanId = scanRes?.data?.id ?? null
    } catch {
      // don't block redirect
      createdScanId = null
    }

    // 4) drop a short-lived cookie so the *next* page-view call can tie it to QR
    // keep it tiny; 10 minutes is enough
    const stamp = {
      qrId,
      bandId,
      scanId: createdScanId,
      at: Date.now(),
    }

    setCookie(event, 'mbq_qr_src', JSON.stringify(stamp), {
      httpOnly: false,          // front-end will read it
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10,          // 10 minutes
    })

    // 5) AR redirect (your existing behavior)
    if (attrs.arEnabled) {
      const tmpl = attrs.template || 'test'
      const arUrl = new URL(`/ar/${qrId}`, reqUrl.origin)
      arUrl.searchParams.set('template', tmpl)
      return sendRedirect(event, arUrl.toString(), 302)
    }

    // 6) decide destination
    const { q_type, link, band, event: ev /* tours/albums removed per your note */ } = attrs
    let dest = `${reqUrl.protocol}//${reqUrl.host}`

    // → band profile
    if (q_type === 'bandProfile' && band?.data) {
      const slug = band.data.attributes?.slug
      if (slug) {
        dest = `${reqUrl.protocol}//${reqUrl.host}/${slug}`
      }
    }
    // → event
    else if (q_type === 'events' && ev?.data) {
      const slug = ev.data.attributes?.slug
      if (slug) {
        dest = `${reqUrl.protocol}//${reqUrl.host}/event/${slug}`
      }
    }
    // → external
    else if (q_type === 'externalURL' && link) {
      dest = toAbsoluteHttps(link)
    }
    // else stays on site root

    // 7) preserve UTMs from the incoming request
    const incoming = getQuery(event) as Record<string, string | string[]>
    const out = new URL(dest)
    for (const [k, v] of Object.entries(incoming)) {
      if (k.startsWith('utm_') && typeof v === 'string' && !out.searchParams.has(k)) {
        out.searchParams.set(k, v)
      }
    }

    // 8) redirect
    return sendRedirect(event, out.toString(), 302)
  } catch (err) {
    // any unexpected error → safe redirect
    return sendRedirect(event, 'https://musicbizqr.com/error', 302)
  }
})
