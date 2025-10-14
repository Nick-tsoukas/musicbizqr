import { getGAClient } from '~/server/utils/gaClient'

const TEN_MIN = 600

export default defineEventHandler(async (event) => {
  const { gaPropertyId } = useRuntimeConfig()
  if (!gaPropertyId) {
    throw createError({ statusCode: 500, statusMessage: 'Missing GA_PROPERTY_ID (runtimeConfig.gaPropertyId)' })
  }

  const q = getQuery(event)
  const iebaStart = process.env.IEBA_START || '2025-10-05'

  const startDate = (typeof q.start === 'string' && q.start.trim()) || iebaStart
  const endDate   = (typeof q.end   === 'string' && q.end.trim())   || 'today'

  // Hosts: default to production; allow comma list; allow 'all' to disable host filter entirely
  const hostParam = (typeof q.host === 'string' && q.host.trim()) || 'musicbizqr.com'
  const hosts = hostParam.toLowerCase() === 'all'
    ? []
    : hostParam.split(',').map(h => h.trim()).filter(Boolean)

  // Paths: include common homepage variants. You can override via ?paths=/,,/home,/index.html
  const pathsParam = (typeof q.paths === 'string' && q.paths.trim()) || '/,,/home,/index.html'
  const paths = pathsParam.split(',').map(p => p.trim()).filter(Boolean)

  // Build hostName OR group (only if hosts provided)
  const hostExpr = hosts.length
    ? (hosts.length === 1
        ? { filter: { fieldName: 'hostName', stringFilter: { matchType: 'EXACT', value: hosts[0] } } }
        : { orGroup: { expressions: hosts.map(h => ({ filter: { fieldName: 'hostName', stringFilter: { matchType: 'EXACT', value: h } } })) } })
    : null

  // Page path IN-list for provided variants
  const pathExpr = { filter: { fieldName: 'pagePath', inListFilter: { values: paths } } }

  // Combine filters
  const dimensionFilter = hostExpr
    ? { andGroup: { expressions: [hostExpr, pathExpr] } }
    : pathExpr

  // Cache
  const nocache = q.nocache === '1' || q.nocache === 'true'
  const key = `ga:home-views-by-city:v3:${startDate}:${endDate}:${hosts.join('|')}:${paths.join('|')}`
  const storage = useStorage()
  if (!nocache) {
    const cached = await storage.getItem(key)
    if (cached) return cached
  }

  const client = getGAClient()
  const property = `properties/${gaPropertyId}`

  // City breakdown
  const [resp] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'totalUsers' }
    ],
    dimensions: [{ name: 'city' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    dimensionFilter
  })

  // Totals
  const [totalsResp] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'totalUsers' }
    ],
    dimensionFilter
  })

  const rows = (resp?.rows || []).map(r => ({
    city: r.dimensionValues?.[0]?.value || '(unknown)',
    pageViews: Number(r.metricValues?.[0]?.value || 0),
    users:     Number(r.metricValues?.[1]?.value || 0)
  }))

  const tm = totalsResp?.rows?.[0]?.metricValues || []
  const totals = {
    pageViews: Number(tm?.[0]?.value || 0),
    users:     Number(tm?.[1]?.value || 0)
  }

  const payload = {
    startDate, endDate,
    hosts: hosts.length ? hosts : ['(all)'],
    paths,
    totals, rows
  }

  await storage.setItem(key, payload, { ttl: TEN_MIN })
  return payload
})
