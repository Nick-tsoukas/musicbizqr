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
  
  // Debug mode: add ?debug=1 to see JSON response instead of redirect
  const queryParams = getQuery(event)
  const debugMode = queryParams.debug === '1'

  // hard fail → send to app
  if (!strapiBase) {
    return sendRedirect(event, 'https://musicbizqr.com', 302)
  }

  try {
    // 1) try exact match on QR url
    // Use deep populate to ensure band.slug is included
    const mainQuery = {
      'filters[url][$eq]': reqUrl.toString(),
      'populate': '*',
    } as const

    const searchUrl = `${strapiBase}/api/qrs`
    console.log('[directqr] Looking up URL:', reqUrl.toString())
    const res: any = await $fetch(searchUrl, { method: 'GET', query: mainQuery })
    let row = Array.isArray(res?.data) ? res.data[0] : null
    let foundBy = row ? 'url-exact-match' : null

    // 1b) fallback: try direct lookup by Strapi record ID
    if (!row) {
      const incoming = getQuery(event)
      const looseId = (incoming.id as string) || ''
      
      console.log('[directqr] URL match failed, trying fallbacks with id:', looseId)
      
      // If id is numeric, try direct record lookup first
      if (looseId && /^\d+$/.test(looseId)) {
        try {
          const directRes: any = await $fetch(`${strapiBase}/api/qrs/${looseId}`, {
            method: 'GET',
            query: {
              'populate': '*',
            },
          })
          if (directRes?.data) {
            row = directRes.data
            foundBy = 'direct-strapi-id'
          }
        } catch (directErr) {
          // Record not found by ID, continue to other fallbacks
        }
      }
      
      // 1c) fallback: try match by slugId field
      if (!row && looseId) {
        const slugIdRes: any = await $fetch(searchUrl, {
          method: 'GET',
          query: {
            'filters[slugId][$eq]': looseId,
            'populate': '*',
          },
        })
        const slugIdRows = Array.isArray(slugIdRes?.data) ? slugIdRes.data : []
        if (slugIdRows.length) {
          row = slugIdRows[0]
          foundBy = 'slugId-field'
        }
      }
      
      // 1d) fallback: try match by "id" inside options.data
      if (!row && looseId) {
        const fb: any = await $fetch(searchUrl, {
          method: 'GET',
          query: {
            'filters[options][data][$containsi]': looseId,
            'populate': '*',
          },
        })
        const fbRows = Array.isArray(fb?.data) ? fb.data : []
        if (fbRows.length) {
          row = fbRows[0]
          foundBy = 'options-data-containsi'
        }
      }
      
      if (!row) {
        setResponseStatus(event, 404)
        return 'QR not found'
      }
    }

    // 2) basic extract
    const qrId: number = row.id
    const attrs: any = row.attributes || {}
    
    // DEBUG: Log the full row structure to understand what we're getting
    console.log('[directqr] Found by:', foundBy)
    console.log('[directqr] Found row ID:', qrId)
    console.log('[directqr] Row structure:', JSON.stringify(row, null, 2))
    console.log('[directqr] Attrs keys:', Object.keys(attrs))
    console.log('[directqr] q_type:', attrs.q_type)
    console.log('[directqr] band attr:', JSON.stringify(attrs.band))
    
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
    const { q_type, link, band, event: ev /* tours/albums removed per your note */ } = attrs
    let dest = `${reqUrl.protocol}//${reqUrl.host}`

    // Debug logging for QR routing issues
    console.log('[directqr] QR ID:', qrId, 'q_type:', q_type)
    console.log('[directqr] band relation:', JSON.stringify(band))

    // → band profile
    if (q_type === 'bandProfile') {
      // Handle both Strapi v4 response formats:
      // Format 1: band.data.attributes.slug (nested)
      // Format 2: band.data.slug (flattened by custom controller)
      // Format 3: band.slug (direct relation)
      let slug: string | null = null
      
      if (band?.data?.attributes?.slug) {
        slug = band.data.attributes.slug
      } else if (band?.data?.slug) {
        slug = band.data.slug
      } else if (band?.slug) {
        slug = band.slug
      }
      
      console.log('[directqr] Resolved band slug:', slug)
      
      if (slug) {
        dest = `${reqUrl.protocol}//${reqUrl.host}/${slug}`
      } else {
        console.warn('[directqr] WARNING: bandProfile QR has no valid band slug! QR ID:', qrId, 'Band data:', JSON.stringify(band))
      }
    }
    // → event
    else if (q_type === 'events') {
      let slug: string | null = null
      
      if (ev?.data?.attributes?.slug) {
        slug = ev.data.attributes.slug
      } else if (ev?.data?.slug) {
        slug = ev.data.slug
      } else if (ev?.slug) {
        slug = ev.slug
      }
      
      if (slug) {
        dest = `${reqUrl.protocol}//${reqUrl.host}/event/${slug}`
      }
    }
    // → external
    else if (q_type === 'externalURL' && link) {
      dest = toAbsoluteHttps(link)
    }
    // else stays on site root
    
    console.log('[directqr] Final destination:', dest)

    // 7) preserve UTMs from the incoming request (reuse incoming from above)
    const out = new URL(dest)
    for (const [k, v] of Object.entries(incoming)) {
      if (k.startsWith('utm_') && typeof v === 'string' && !out.searchParams.has(k)) {
        out.searchParams.set(k, v)
      }
    }

    // Debug mode: return JSON instead of redirect
    if (debugMode) {
      return {
        foundBy,
        qrId,
        q_type: attrs.q_type,
        band: attrs.band,
        link: attrs.link,
        resolvedSlug: attrs.band?.data?.attributes?.slug || attrs.band?.data?.slug || attrs.band?.slug || null,
        destination: out.toString(),
        rowKeys: Object.keys(row),
        attrsKeys: Object.keys(attrs),
      }
    }

    // 8) redirect
    return sendRedirect(event, out.toString(), 302)
  } catch (err) {
    // any unexpected error → safe redirect
    return sendRedirect(event, 'https://musicbizqr.com/error', 302)
  }
})
