<template>
  <div class="px-4 sm:px-6 py-8 bg-black min-h-screen pt-[var(--header-height)] max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-white">Analytics Dashboard</h2>

    <!-- Insights (MUSE) -->
    <div class="chart-card mb-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-white text-lg font-semibold">Insights (Muse)</h3>
        <span v-if="latestMuse" class="text-gray-400 text-xs">
          {{ humanDayLabel(latestMuse.date) }}
        </span>
      </div>

      <div v-if="museLoading" class="text-gray-300 text-sm">Analyzing…</div>
      <div v-else-if="museError" class="text-red-400 text-sm">Couldn’t load insights.</div>
      <ul v-else-if="insightBullets.length" class="list-disc pl-5 text-gray-200 space-y-1">
        <li v-for="(b, i) in insightBullets" :key="i">{{ b }}</li>
      </ul>
      <div v-else class="text-gray-400 text-sm">No insights yet.</div>
    </div>

<!-- Muse Summary (Phase 2.5 aggregate) -->
<div class="chart-card mb-6">
  <div class="flex items-center justify-between mb-2">
    <h3 class="text-white text-lg font-semibold">Muse Summary</h3>
    <span class="text-gray-400 text-xs">Last {{ museRangeLabel }}</span>
  </div>

  <div v-if="museSummaryLoading" class="text-gray-400 text-sm">Loading summary…</div>

  <div v-else-if="museSummary">
    <!-- Metric grid -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
      <div class="bg-neutral-900 rounded-lg p-3">
        <p class="text-gray-400 text-xs">Page Views</p>
        <p class="text-2xl font-semibold text-white">{{ museSummary.pageViews }}</p>
        <p
          v-if="museSummary.prevComparison !== undefined"
          :class="[
            'text-xs font-medium',
            museSummary.prevComparison > 0
              ? 'text-emerald-400'
              : museSummary.prevComparison < 0
              ? 'text-red-400'
              : 'text-gray-400'
          ]"
        >
          {{ museSummary.prevComparison > 0 ? '+' : '' }}{{ museSummary.prevComparison }} % vs prev
        </p>
      </div>

      <div class="bg-neutral-900 rounded-lg p-3">
        <p class="text-gray-400 text-xs">Link Clicks</p>
        <p class="text-2xl font-semibold text-white">{{ museSummary.linkClicks }}</p>
      </div>

      <div class="bg-neutral-900 rounded-lg p-3">
        <p class="text-gray-400 text-xs">Song Plays</p>
        <p class="text-2xl font-semibold text-white">{{ museSummary.songPlays }}</p>
      </div>

      <div class="bg-neutral-900 rounded-lg p-3">
        <p class="text-gray-400 text-xs">Video Plays</p>
        <p class="text-2xl font-semibold text-white">{{ museSummary.videoPlays }}</p>
      </div>

      <div class="bg-neutral-900 rounded-lg p-3">
        <p class="text-gray-400 text-xs">Engagement Rate</p>
        <p class="text-2xl font-semibold text-white">
          {{ museSummary.engagementRate }}%
        </p>
      </div>
    </div>

    <!-- Highlights -->
    <p class="text-gray-300 text-sm mb-2">
      Growth:
      <span class="text-pink-400 font-bold">{{ museSummary.growthPct }}%</span>
    </p>

    <!-- Top lists -->
    <div class="grid sm:grid-cols-3 gap-3 text-gray-300 text-sm">
      <div>
        <span class="font-semibold text-white">Top Cities:</span><br />
        <span>{{ (museSummary.topCities || []).map(c => c[0]).join(', ') || 'N/A' }}</span>
      </div>
      <div>
        <span class="font-semibold text-white">Top Sources:</span><br />
        <span>{{ (museSummary.topSources || []).map(s => s[0]).join(', ') || 'N/A' }}</span>
      </div>
      <div>
        <span class="font-semibold text-white">Top Platforms:</span><br />
        <span>{{ (museSummary.topPlatforms || []).map(p => p[0]).join(', ') || 'N/A' }}</span>
      </div>
    </div>
  </div>

  <div v-else class="text-gray-400 text-sm">No summary data yet.</div>
</div>



    <!-- Tabs -->
    <div class="flex gap-2 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="selectedTab = tab"
        :class="[
          'px-3 py-1.5 text-sm rounded-full transition-colors',
          selectedTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Range Selector -->
    <div class="flex gap-2 mb-4">
      <button
        v-for="(label, days) in rangeOptions"
        :key="days"
        @click="selectedRange = Number(days)"
        :class="[
          'px-3 py-1 text-sm rounded-full transition-colors',
          selectedRange === Number(days) ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        ]"
      >
        {{ label }}
      </button>
    </div>

    <!-- Date Picker (Only for Today/Hourly) -->
    <div v-if="selectedRange === 1" class="mb-6">
      <label class="text-white mr-2">Select Day:</label>
      <input type="date" v-model="selectedDate" class="bg-gray-800 text-white rounded px-2 py-1" />
    </div>

    <div v-if="isLoading" class="text-white">🔄 Loading data…</div>

    <div v-else class="space-y-6">
      <!-- Page Views / Clicks / Plays -->
      <div class="chart-card">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-white text-lg font-semibold">Page Views</h3>
          <span class="text-gray-400 text-xs">
            {{ selectedRange === 1 ? humanDayLabel(selectedDate) : `Last ${selectedRange} days` }}
          </span>
        </div>
        <div class="chart-wrap ratio-16x9">
          <ClientOnly>
            <canvas ref="viewsCanvas" class="chart-canvas" />
          </ClientOnly>
        </div>
      </div>

      <!-- Link Clicks: Top Platforms (from server rollups) -->
      <div v-if="selectedTab === 'Link Clicks'" class="chart-card">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-white text-lg font-semibold">Top Platforms</h3>
          <span class="text-gray-400 text-xs">{{ totalClicksInRange }} in range</span>
        </div>

        <ul v-if="topClickPlatforms.length" class="text-gray-200 text-sm space-y-2">
          <li
            v-for="[name, count] in topClickPlatforms"
            :key="name"
            class="flex items-center gap-2"
          >
            <span class="inline-block w-28 truncate text-white capitalize">{{ name }}</span>
            <div class="h-2 bg-gray-800 rounded w-full">
              <div
                class="h-2 bg-purple-500 rounded"
                :style="{ width: Math.min(100, Math.round((count / (topClickPlatforms[0]?.[1] || 1)) * 100)) + '%' }"
              />
            </div>
            <span class="text-gray-400 w-10 text-right tabular-nums">{{ count }}</span>
          </li>
        </ul>

        <p v-else class="text-gray-400 text-sm">No clicks in this range.</p>
      </div>

      <!-- Top Cities (from /analytics/geo) -->
      <div class="chart-card">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-white text-lg font-semibold">🌎 Top Cities</h3>
        </div>

        <ul v-if="topCities.length" class="text-gray-200 text-sm space-y-2">
          <li v-for="[city, count] in topCities" :key="city" class="flex items-center gap-2">
            <div class="flex-1 flex items-center gap-2">
              <span class="inline-block w-28 truncate text-white">{{ city }}</span>
              <div class="h-2 bg-gray-800 rounded w-full">
                <div
                  class="h-2 bg-emerald-500 rounded"
                  :style="{ width: Math.min(100, Math.round((count / (topCities[0]?.[1] || 1)) * 100)) + '%' }"
                />
              </div>
            </div>
            <span class="text-gray-400 w-10 text-right tabular-nums">{{ count }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-400 text-sm">No city data yet.</p>
      </div>

      <!-- Sources / Mediums / Referrers (from server rollups) -->
      <div class="chart-card">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-white text-lg font-semibold">Sources</h3>
          <span class="text-gray-400 text-xs">{{ totalViewsInRange }} in range</span>
        </div>

        <p class="text-gray-400 text-sm mb-4 leading-relaxed">
          <span class="text-emerald-400 font-semibold">Where your fans are coming from.</span>
          This shows how listeners found your band page — whether from social media, search,
          QR codes, or other sites. “Source” means the platform or website; “Medium” means
          the type of traffic (social, search, direct, or referral).
        </p>

        <div class="grid md:grid-cols-3 gap-4">
          <!-- By Source -->
          <div>
            <h4 class="text-white font-medium mb-2 flex items-center gap-1">
              By Source <span class="text-gray-500 text-xs">(platform or website)</span>
            </h4>
            <ul v-if="sourceCounts.length" class="text-gray-200 text-sm space-y-2">
              <li v-for="[src, count] in sourceCounts" :key="src" class="flex items-center gap-2">
                <span class="inline-block w-28 truncate text-white capitalize">{{ src }}</span>
                <div class="h-2 bg-gray-800 rounded w-full">
                  <div
                    class="h-2 bg-purple-500 rounded"
                    :style="{ width: Math.min(100, Math.round((count / (sourceCounts[0]?.[1] || 1)) * 100)) + '%' }"
                  ></div>
                </div>
                <span class="text-gray-400 w-10 text-right tabular-nums">{{ count }}</span>
              </li>
            </ul>
            <p v-else class="text-gray-400 text-sm">No source data yet.</p>
          </div>

          <!-- By Medium -->
          <div>
            <h4 class="text-white font-medium mb-2 flex items-center gap-1">
              By Medium <span class="text-gray-500 text-xs">(traffic type)</span>
            </h4>
            <ul v-if="mediumCounts.length" class="text-gray-200 text-sm space-y-2">
              <li v-for="[m, count] in mediumCounts" :key="m" class="flex items-center gap-2">
                <span class="inline-block w-28 truncate text-white capitalize">{{ m }}</span>
                <div class="h-2 bg-gray-800 rounded w-full">
                  <div
                    class="h-2 bg-emerald-500 rounded"
                    :style="{ width: Math.min(100, Math.round((count / (mediumCounts[0]?.[1] || 1)) * 100)) + '%' }"
                  ></div>
                </div>
                <span class="text-gray-400 w-10 text-right tabular-nums">{{ count }}</span>
              </li>
            </ul>
            <p v-else class="text-gray-400 text-sm">No medium data yet.</p>
          </div>

          <!-- Top Referrers -->
          <div>
            <h4 class="text-white font-medium mb-2 flex items-center gap-1">
              Top Referrers <span class="text-gray-500 text-xs">(websites linking to you)</span>
            </h4>
            <ul v-if="topRefDomains.length" class="text-gray-200 text-sm space-y-2">
              <li v-for="[d, count] in topRefDomains" :key="d" class="flex items-center justify-between">
                <span class="truncate w-40 text-white">{{ d }}</span>
                <span class="text-gray-400 tabular-nums">{{ count }}</span>
              </li>
            </ul>
            <p v-else class="text-gray-400 text-sm">No referrer domains yet.</p>
          </div>
        </div>
      </div>

      <!-- Devices (from server rollups) -->
      <div class="chart-card">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-white text-lg font-semibold">Devices</h3>
          <span class="text-gray-400 text-xs">{{ totalDeviceViews }} total</span>
        </div>

        <ul v-if="totalDeviceViews > 0" class="text-gray-200 text-sm divide-y divide-gray-800 mb-3">
          <li v-for="item in deviceBreakdown" :key="item.key" class="flex items-center justify-between py-2">
            <div class="flex items-center gap-2">
              <span class="inline-block w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }" />
              <span class="text-white">{{ item.label }}</span>
            </div>
            <div class="tabular-nums">
              <span class="text-white font-medium mr-2">{{ item.count }}</span>
              <span class="text-gray-400">({{ item.pct }}%)</span>
            </div>
          </li>
        </ul>
        <div v-else class="text-gray-400 text-sm mb-3">No device data yet.</div>

        <div class="chart-wrap square">
          <ClientOnly>
            <canvas ref="deviceCanvas" class="chart-canvas" aria-label="Device distribution" role="img" />
          </ClientOnly>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onBeforeUnmount, computed } from 'vue'
import { useRoute, useStrapiClient } from '#imports'
import { format as fmt, parseISO, isValid, subDays, getHours } from 'date-fns'
import qs from 'qs'

/* ---------- Strapi client / route ---------- */
const client = useStrapiClient()
const route = useRoute()

/* ---------- Muse (daily insights) ---------- */
const museRows = ref<any[]>([])
const museLoading = ref(false)
const museError = ref<any>(null)

const latestMuse = computed(() => museRows.value?.[0]?.attributes || null)

const { getMuseSummary } = useMuse()
const museSummary = ref<any|null>(null)
const museSummaryLoading = ref(false)
const museRange = ref('7d')

const museRangeLabel = computed(() =>
  museRange.value === '7d' ? '7 Days'
  : museRange.value === '30d' ? '30 Days'
  : museRange.value === '365d' ? '1 Year'
  : museRange.value
)

async function fetchMuseSummary() {
  museSummaryLoading.value = true
  try {
    const bandId = Number(route.params.id)
    console.log('[Muse] Fetching summary for band:', bandId, 'range:', museRange.value)

    const res = await getMuseSummary(bandId, museRange.value)
    console.log('[Muse] Raw response:', res)

    museSummary.value = res?.summary || null
    console.log('[Muse] Parsed summary:', museSummary.value)
  } catch (err) {
    console.error('[Muse] Error fetching summary:', err)
  } finally {
    museSummaryLoading.value = false
  }
}


onMounted(fetchMuseSummary)


const insightBullets = computed(() => {
  const m = latestMuse.value
  if (!m) return []
  const out: string[] = []

  const g = Math.round((m.growthPct || 0) * 10) / 10
  if (g > 0) out.push(`Traffic grew ${g}% vs. yesterday.`)
  else if (g < 0) out.push(`Traffic fell ${Math.abs(g)}% vs. yesterday.`)
  else out.push(`Traffic is flat vs. yesterday.`)

  const topCity = Array.isArray(m.topCities) && m.topCities[0]?.[0] ? m.topCities[0][0] : null
  if (topCity) out.push(`Most visits came from ${topCity || 'Unknown'}.`)
  else out.push(`No location data yet.`)

  const clicks = m.linkClicks || 0
  const songs  = m.songPlays  || 0
  const vids   = m.videoPlays || 0
  if (clicks > 0 || songs > 0 || vids > 0) {
    const parts:string[] = []
    if (clicks) parts.push(`${clicks} link ${clicks === 1 ? 'click' : 'clicks'}`)
    if (songs)  parts.push(`${songs} song ${songs === 1 ? 'play' : 'plays'}`)
    if (vids)   parts.push(`${vids} video ${vids === 1 ? 'play' : 'plays'}`)
    out.push(`Engagement: ${parts.join(', ')}.`)
  } else {
    out.push(`No downstream engagement yet (links/songs/videos).`)
  }

  return out
})

/* ---------- Muse/Analytics composable ---------- */
// Auto-imported in Nuxt 3 if file is /composables/useMuse.ts
const { getRollups, getGeo, getTransitions } = useMuse()

/* ---------- UI state ---------- */
const tabs = ['Page Views', 'Link Clicks', 'Songs', 'Videos'] as const
const selectedTab = ref<typeof tabs[number]>('Page Views')

const rangeOptions: Record<number, string> = {
  1: 'Daily',
  7: 'Last 7 Days',
  30: 'Last 30 Days',
  365: 'Last 1 Year'
}
const selectedRange = ref<number>(30)
const selectedDate = ref(fmt(new Date(), 'yyyy-MM-dd'))

/* ---------- server rollup state ---------- */
const rollups = ref<any|null>(null)
const geo = ref<any|null>(null)
const transitions = ref<any|null>(null)

/* ---------- raw events (only used for hourly chart) ---------- */
const rawPageViews = ref<any[]>([])
const rawLinkClicks = ref<any[]>([])
const rawMediaPlays = ref<any[]>([])

const isLoading = ref(true)

/* ---------- canvases / chart handles ---------- */
const viewsCanvas = ref<HTMLCanvasElement | null>(null)
let viewsChart: any = null

const deviceCanvas = ref<HTMLCanvasElement | null>(null)
let deviceChart: any = null

/* ---------- helpers (format) ---------- */
function humanDayLabel(yyyy_mm_dd: string) {
  const d = parseISO(`${yyyy_mm_dd}T00:00:00`)
  return isValid(d) ? fmt(d, 'EEE, MMM d') : ''
}
function fmtHour12(ts: string) {
  const d = parseISO(ts)
  return isValid(d) ? fmt(d, 'h a') : ''
}

/* ---------- computed from server rollups ---------- */
const totalViewsInRange   = computed(() => rollups.value?.totals?.views  ?? 0)
const totalClicksInRange  = computed(() => rollups.value?.totals?.clicks ?? 0)

const sourceCounts   = computed<[string, number][]>(() => rollups.value?.sources    ?? [])
const mediumCounts   = computed<[string, number][]>(() => rollups.value?.mediums    ?? [])
const topRefDomains  = computed<[string, number][]>(() => rollups.value?.refDomains ?? [])
const topClickPlatforms = computed<[string, number][]>(() => rollups.value?.platforms ?? [])

const topCities = computed<[string, number][]>(() => {
  const list = geo.value?.list ?? []
  return list.map((r:any) => [r.city || 'Unknown', r.count]) as [string, number][]
})

/* ---------- devices (from rollups) ---------- */
const deviceLegend = [
  { key: 'desktop', label: 'Desktop', color: '#8B5CF6' },
  { key: 'mobile',  label: 'Mobile',  color: '#10B981' },
  { key: 'tablet',  label: 'Tablet',  color: '#F59E0B' },
  { key: 'bot',     label: 'Bot',     color: '#6B7280' },
  { key: 'unknown', label: 'Unknown', color: '#9CA3AF' }
] as const

const deviceCounts = computed(() => rollups.value?.devices ?? { desktop:0, mobile:0, tablet:0, bot:0, unknown:0 })
const totalDeviceViews = computed(() =>
  Object.values(deviceCounts.value).reduce((a:any, b:any) => a + (Number.isFinite(b) ? b : 0), 0)
)
const deviceBreakdown = computed(() => {
  const counts:any = deviceCounts.value
  const total = totalDeviceViews.value || 1
  return deviceLegend.map((x) => ({
    ...x,
    count: counts[x.key] || 0,
    pct: Math.round(((counts[x.key] || 0) / total) * 1000) / 10
  }))
})

/* ---------- Chart.js: client-only lazy load ---------- */
let ChartJs: any = null
async function ensureChart() {
  if (process.server) return null
  if (!ChartJs) {
    ChartJs = (await import('chart.js/auto')).default
  }
  return ChartJs
}

/* ---------- normalize timestamp on raw rows ---------- */
function tsOf(row: any): string | null {
  const a = row?.attributes || row || {}
  return a.timestamp || a.createdAt || a.updatedAt || null
}

/* ---------- fetch Muse daily insights ---------- */
async function fetchMuse() {
  const bandId = Number(route.params.id)
  const query = qs.stringify(
    {
      filters: { key: { $startsWith: `${bandId}:` } },
      sort: ['date:desc'],
      pagination: { limit: 14 }
    },
    { encodeValuesOnly: true }
  )

  const url = `/band-insights-daily?${query}`
  museLoading.value = true
  museError.value = null
  try {
    const res = await client(url)
    museRows.value = res?.data ?? []
  } catch (e:any) {
    museError.value = e?.response?._data || e
  } finally {
    museLoading.value = false
  }
}

/* ---------- fetch rollups + (raw if hourly) ---------- */
async function fetchAndRender() {
  isLoading.value = true
  const bandId = Number(route.params.id)
  const rangeKey = `${selectedRange.value}d`

  // 1) server aggregations
  const [r, g, t] = await Promise.all([
    getRollups(bandId, rangeKey),
    getGeo(bandId, rangeKey),
    getTransitions(bandId, rangeKey),
  ])
  rollups.value = r
  geo.value = g
  transitions.value = t

  // 2) only fetch raw if we need hourly chart
  if (selectedRange.value === 1) {
    const [viewsRes, clicksRes, mediaRes] = await Promise.all([
      client('/band-page-views', {
        params: { filters: { band: { id: route.params.id } }, sort: ['timestamp:desc'], pagination: { limit: 500 } }
      }),
      client(`/link-clicks/band/${route.params.id}`),
      client(`/media-plays/band/${route.params.id}`).catch(() =>
        client('/media-plays', {
          params: { filters: { band: { id: route.params.id } }, sort: ['timestamp:desc'], pagination: { limit: 500 } }
        })
      )
    ])

    const toArray = (res:any) => {
      if (!res) return []
      if (Array.isArray(res)) return res
      if (Array.isArray(res.data)) return res.data
      if (Array.isArray(res.results)) return res.results
      if (res.data && !Array.isArray(res.data)) return [res.data]
      return []
    }

    const unifyMedia = (rows:any[]) =>
      rows.map((r) => {
        const a = r?.attributes || r || {}
        return {
          id: r?.id ?? a?.id,
          attributes: {
            ...a,
            timestamp: a.timestamp || a.createdAt || a.updatedAt || r?.timestamp || r?.createdAt || r?.updatedAt || null,
            kind: String(a.kind ?? a.type ?? a.mediaType ?? '').toLowerCase(),
            title: a.title ?? r?.title ?? ''
          }
        }
      })

    const unifyClicks = (rows:any[]) =>
      rows.map((r) => {
        const a = r?.attributes || r || {}
        return {
          id: r?.id ?? a?.id,
          attributes: {
            ...a,
            timestamp: a.timestamp || a.createdAt || r?.timestamp || r?.createdAt || null,
            platform: a.platform ?? a.provider ?? a.source ?? r?.platform ?? r?.provider ?? r?.source ?? '',
            url: a.url ?? r?.url ?? ''
          }
        }
      })

    rawPageViews.value  = toArray(viewsRes)
    rawLinkClicks.value = unifyClicks(toArray(clicksRes))
    rawMediaPlays.value = unifyMedia(toArray(mediaRes))
  } else {
    rawPageViews.value = []
    rawLinkClicks.value = []
    rawMediaPlays.value = []
  }

  isLoading.value = false

  await ensureChart()
  await nextTick()
  renderViewsChart()
  renderDeviceDoughnut()
}

/* ---------- HiDPI canvas ---------- */
function prepHiDPICanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.max(1, window.devicePixelRatio || 1)
  const rect = canvas.getBoundingClientRect()
  canvas.width = Math.round(rect.width * dpr)
  canvas.height = Math.round(rect.height * dpr)
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

/* ---------- charts ---------- */
function renderViewsChart() {
  if (!ChartJs) return
  const canvas = viewsCanvas.value
  if (!canvas) return
  const ctx = prepHiDPICanvas(canvas)

  let labels: string[] = []
  let data: number[] = []
  let chartType: 'bar' | 'line' = 'bar'
  let title = ''

  // Hourly (Daily range) — use raw events
  if (selectedRange.value === 1) {
    let rows:any[] = []
    if (selectedTab.value === 'Page Views') rows = rawPageViews.value
    else if (selectedTab.value === 'Link Clicks') rows = rawLinkClicks.value
    else rows = rawMediaPlays.value

    const iter = (fn: (d: Date, k?: string) => void) => {
      for (const v of rows) {
        const a = v?.attributes || v || {}
        const ts = tsOf(v)
        if (!ts) continue
        const d = parseISO(ts)
        if (!isValid(d)) continue
        fn(d, a?.kind)
      }
    }

    const hours = Array.from({ length: 24 }, (_, i) => i)
    const counts: Record<number, number> = Object.fromEntries(hours.map((h) => [h, 0]))
    const dayISO = selectedDate.value

    iter((d) => {
      if (fmt(d, 'yyyy-MM-dd') !== dayISO) return
      counts[getHours(d)]++
    })

    labels = hours.map((h) => fmt(new Date(2000, 0, 1, h), 'h a'))
    data = hours.map((h) => counts[h] || 0)
    chartType = 'bar'
    title =
      selectedTab.value === 'Page Views'
        ? 'Page Views (Hourly)'
        : `${selectedTab.value} (Hourly)`
  } else {
    // Multi-day line — use server rollups.series
    const s = rollups.value?.series ?? [] // [{date, views, clicks, plays}]
    labels = s.map((d:any) => fmt(parseISO(`${d.date}T00:00:00`), 'MMM d'))
    data = s.map((d:any) => {
      if (selectedTab.value === 'Page Views') return d.views
      if (selectedTab.value === 'Link Clicks') return d.clicks
      return d.plays // Songs/Videos aggregated together (can split later)
    })
    chartType = 'line'
    title =
      selectedTab.value === 'Page Views'
        ? `Page Views (Last ${selectedRange.value} Days)`
        : `${selectedTab.value} (Last ${selectedRange.value} Days)`
  }

  const datasetLabel = (() => {
    switch (selectedTab.value) {
      case 'Page Views': return selectedRange.value === 1 ? 'Views' : 'Page Views'
      case 'Link Clicks': return 'Link Clicks'
      case 'Songs': return 'Song Plays'
      case 'Videos': return 'Video Plays'
      default: return selectedTab.value
    }
  })()

  viewsChart?.destroy()
  viewsChart = new ChartJs(ctx, {
    type: chartType,
    data: {
      labels,
      datasets: [
        {
          label: datasetLabel,
          data,
          borderWidth: 2,
          borderColor: '#10B981',
          backgroundColor: chartType === 'bar' ? '#10B981' : 'rgba(16,185,129,.25)',
          tension: 0.3,
          pointRadius: chartType === 'line' ? 3 : 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 6 },
      scales: {
        x: {
          ticks: { color: '#E5E7EB', maxRotation: 0, autoSkip: true, autoSkipPadding: 8 },
          grid: { color: '#30343b', drawTicks: false }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#E5E7EB', precision: 0 },
          grid: { color: '#30343b' }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#E5E7EB', usePointStyle: true, pointStyle: 'circle' },
        position: 'bottom'
        },
        title: { display: true, text: title, color: 'white', font: { size: 16, weight: '600' } },
        tooltip: {
          callbacks: {
            title(items) { return items[0]?.label || '' },
            label(ctx) {
              const v = ctx.raw as number
              const noun =
                selectedTab.value === 'Page Views' ? 'view'
                : selectedTab.value === 'Link Clicks' ? 'click'
                : 'play'
              return `${v} ${v === 1 ? noun : noun + 's'}`
            }
          }
        }
      }
    }
  })
}

function renderDeviceDoughnut() {
  if (!ChartJs) return
  const canvas = deviceCanvas.value
  if (!canvas) return
  const ctx = prepHiDPICanvas(canvas)

  const counts = deviceCounts.value
  const labels = deviceLegend.map((x) => x.label)
  const data = deviceLegend.map((x) => counts[x.key] || 0)
  const colors = deviceLegend.map((x) => x.color)

  deviceChart?.destroy()
  deviceChart = new ChartJs(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: '#0B1220',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          labels: { color: '#E5E7EB', usePointStyle: true, pointStyle: 'circle' },
          position: 'top'
        },
        title: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              const v = ctx.raw as number
              const label = ctx.label || ''
              return `${label}: ${v}`
            }
          }
        }
      }
    }
  })
}

/* ---------- lifecycle ---------- */
onMounted(async () => {
  await ensureChart()
  await fetchAndRender()   // server rollups (+ raw if daily)
  await fetchMuse()        // daily insights
})

// Re-fetch when range changes; re-render when tab/date changes
watch(selectedRange, async () => {
  await fetchAndRender()
})

watch([selectedTab, selectedDate, rollups], async () => {
  if (!isLoading.value) {
    await ensureChart()
    renderViewsChart()
    renderDeviceDoughnut()
  }
})

onBeforeUnmount(() => {
  viewsChart?.destroy()
  deviceChart?.destroy()
})
</script>

<style scoped>
.chart-card {
  background: #111827; /* gray-900 */
  border-radius: 0.75rem; /* rounded-lg */
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.text-emerald-400 { transition: color 0.4s, transform 0.4s; }
.text-emerald-400:hover { transform: scale(1.05); }


.chart-wrap {
  position: relative;
  width: 100%;
}
.chart-wrap.ratio-16x9 { aspect-ratio: 16 / 9; }
.chart-wrap.square { aspect-ratio: 1 / 1; }

.chart-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* date picker icon on dark bg */
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
