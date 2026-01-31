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
    // 1) Use the new lookup endpoint that bypasses entityService permission issues
    const incoming = getQuery(event) as Record<string, string | string[]>
    const looseId = (incoming.id as string) || ''
    
    const lookupUrl = `${strapiBase}/api/qrs/lookup`
    const lookupRes: any = await $fetch(lookupUrl, {
      method: 'GET',
      query: {
        url: reqUrl.toString(),
        id: looseId,
      },
    }).catch(() => null)
    
    let row = lookupRes?.data ? { id: lookupRes.data.id, attributes: lookupRes.data } : null
    
    if (!row) {
      setResponseStatus(event, 404)
      return 'QR not found'
    }

    // 2) basic extract
    const qrId: number = row.id
    const attrs: any = row.attributes || {}
    // The lookup endpoint returns band directly (not nested under .data)
    const bandId: number | null = attrs.band?.id || null

    // 3) create scan in Strapi with rich analytics data (non-blocking-ish)
    let createdScanId: number | null = null
    // The lookup endpoint returns event directly (not nested under .data)
    const eventId: number | null = attrs.event?.id || null
    
    // Extract UTM params from incoming request (reuse incoming from above)
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
      // Build headers object, only including non-empty Cloudflare headers
      const forwardHeaders: Record<string, string> = {}
      const cfHeaderKeys = ['cf-ipcountry', 'cf-ipcity', 'cf-region', 'cf-iplatitude', 'cf-iplongitude']
      for (const key of cfHeaderKeys) {
        const val = reqHeaders[key]
        if (val && typeof val === 'string') {
          forwardHeaders[key] = val
        }
      }
      
      const scanRes: any = await $fetch(`${strapiBase}/api/scans/track`, {
        method: 'POST',
        body: scanBody,
        headers: forwardHeaders,
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
    const { q_type, link, band, event: ev } = attrs
    let dest = `${reqUrl.protocol}//${reqUrl.host}`

    // Debug logging for QR routing issues
    console.log('[directqr] QR ID:', qrId, 'q_type:', q_type)
    console.log('[directqr] band relation:', JSON.stringify(band))

    // → band profile (lookup endpoint returns band directly with slug)
    if (q_type === 'bandProfile' && band?.slug) {
      dest = `${reqUrl.protocol}//${reqUrl.host}/${band.slug}`
      console.log('[directqr] Resolved band slug:', band.slug)
    }
    // → event (lookup endpoint returns event directly with slug)
    else if (q_type === 'events' && ev?.slug) {
      dest = `${reqUrl.protocol}//${reqUrl.host}/event/${ev.slug}`
    }
    // → external
    else if (q_type === 'externalURL' && link) {
      dest = toAbsoluteHttps(link)
    }
    // else stays on site root
    
    if (q_type === 'bandProfile' && !band?.slug) {
      console.warn('[directqr] WARNING: bandProfile QR has no valid band slug! QR ID:', qrId, 'Band data:', JSON.stringify(band))
    }
    
    console.log('[directqr] Final destination:', dest)

    // 7) preserve UTMs from the incoming request (reuse incoming from above)
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
