import { defineEventHandler, readBody, getRequestHeader } from 'h3'
import crypto from 'node:crypto'

const seen = new Map<string, number>()
const TTL_MS = 30 * 60 * 1000

function getClientIP (event: any) {
  const cf  = getRequestHeader(event, 'cf-connecting-ip')
  const fwd = getRequestHeader(event, 'x-forwarded-for')
  const xr  = getRequestHeader(event, 'x-real-ip')
  return (cf || fwd || xr || '').split(',')[0].trim()
}

function saltedHash (ip: string, salt: string) {
  if (!ip) return ''
  return crypto.createHash('sha256').update(ip + ':' + salt).digest('hex').slice(0, 32)
}

// Optional fallback geo lookup if not behind Cloudflare
async function lookupGeo(ip: string) {
  // Skip localhost IPs
  if (!ip || ip.startsWith('127.') || ip === '::1') return { city: '', region: '', country: '' }
  try {
    // ipwho.is has generous free limits; swap to your preferred provider anytime
    const res: any = await $fetch(`https://ipwho.is/${ip}`)
    if (res?.success) {
      return {
        city: res.city || '',
        region: res.region || '',
        country: res.country_code || ''
      }
    }
  } catch {}
  return { city: '', region: '', country: '' }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ bandId?: number | string, path?: string, title?: string }>(event)
    const bandId = body?.bandId
    const path   = body?.path
    if (!bandId || !path) {
      event.node.res.statusCode = 400
      return { ok: false, error: 'Missing bandId or path' }
    }

    const userAgent = getRequestHeader(event, 'user-agent') || ''
    const referrer  = getRequestHeader(event, 'referer') || getRequestHeader(event, 'referrer') || ''
    const ip        = getClientIP(event)
    const ipHash    = saltedHash(ip, process.env.IP_SALT || 'change-me')

    // Dedupe
    const bucket = Math.floor(Date.now() / TTL_MS)
    const key = `${bandId}|${path}|${ipHash}|${bucket}`
    const last = seen.get(key)
    if (last && (Date.now() - last) < TTL_MS) {
      return { ok: true, dedup: true }
    }
    seen.set(key, Date.now())

    // Geo via Cloudflare headers if present; otherwise fallback to API
    const cfCountry = getRequestHeader(event, 'cf-ipcountry') || ''
    const cfCity    = getRequestHeader(event, 'cf-ipcity') || ''
    const cfRegion  = getRequestHeader(event, 'cf-ipregion') || ''
    let city = cfCity, region = cfRegion, country = cfCountry
    if (!country && !city && !region) {
      const geo = await lookupGeo(ip)
      city = geo.city
      region = geo.region
      country = geo.country
    }

    // Write to Strapi
    const STRAPI = process.env.STRAPI_URL!
    const TOKEN  = process.env.STRAPI_WRITE_TOKEN!
    if (!STRAPI || !TOKEN) {
      event.node.res.statusCode = 500
      return { ok: false, error: 'Missing STRAPI_URL or STRAPI_WRITE_TOKEN' }
    }

    await $fetch(`${STRAPI}/api/band-page-views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`
      },
      body: {
        data: {
          band: Number(bandId) || bandId,
          timestamp: new Date().toISOString(),
          ipAddress: ipHash,    // store hash (privacy-safe)
          userAgent,
          referrer,
          path,
          city,
          region,
          country
        }
      }
    })

    return { ok: true }
  } catch (e: any) {
    event.node.res.statusCode = 500
    return { ok: false, error: e?.data || e?.message || 'Unknown error' }
  }
})
