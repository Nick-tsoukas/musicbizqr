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
      <!-- Page Views -->
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

      <!-- Top Cities -->
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
                  :style="{ width: Math.min(100, Math.round((count / topCities[0][1]) * 100)) + '%' }"
                />
              </div>
            </div>
            <span class="text-gray-400 w-10 text-right tabular-nums">{{ count }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-400 text-sm">No city data yet.</p>
      </div>

      <!-- Devices -->
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

const insightBullets = computed(() => {
  const m = latestMuse.value
  if (!m) return []
  const out: string[] = []

  // 1) Growth
  const g = Math.round((m.growthPct || 0) * 10) / 10
  if (g > 0) out.push(`Traffic grew ${g}% vs. yesterday.`)
  else if (g < 0) out.push(`Traffic fell ${Math.abs(g)}% vs. yesterday.`)
  else out.push(`Traffic is flat vs. yesterday.`)

  // 2) Top city
  const topCity = Array.isArray(m.topCities) && m.topCities[0]?.[0] ? m.topCities[0][0] : null
  if (topCity) out.push(`Most visits came from ${topCity || 'Unknown'}.`)
  else out.push(`No location data yet.`)

  // 3) Engagement mix
  const clicks = m.linkClicks || 0
  const songs  = m.songPlays  || 0
  const vids   = m.videoPlays || 0
  if (clicks > 0 || songs > 0 || vids > 0) {
    const parts = []
    if (clicks) parts.push(`${clicks} link ${clicks === 1 ? 'click' : 'clicks'}`)
    if (songs)  parts.push(`${songs} song ${songs === 1 ? 'play' : 'plays'}`)
    if (vids)   parts.push(`${vids} video ${vids === 1 ? 'play' : 'plays'}`)
    out.push(`Engagement: ${parts.join(', ')}.`)
  } else {
    out.push(`No downstream engagement yet (links/songs/videos).`)
  }

  return out
})


async function fetchMuse() {
  const bandId = Number(route.params.id)
  const query = qs.stringify(
    {
      filters: { key: { $startsWith: `${bandId}:` } }, // filter via key prefix: "<bandId>:YYYY-MM-DD"
      sort: ['date:desc'],
      pagination: { limit: 14 }
    },
    { encodeValuesOnly: true }
  )

  const url = `/band-insights-daily?${query}`
  museLoading.value = true
  museError.value = null
  console.log('[MUSE] GET', url)

  try {
    const res = await client(url)
    console.log('[MUSE] OK:', res)
    museRows.value = res?.data ?? []
  } catch (e: any) {
    const status = e?.response?.status
    const body = e?.response?._data || e
    console.error('[MUSE] ERR:', status, body)
    museError.value = body
  } finally {
    museLoading.value = false
  }
}

/* ---------- Chart.js: client-only lazy load ---------- */
let ChartJs: any = null
async function ensureChart() {
  if (process.server) return null
  if (!ChartJs) {
    ChartJs = (await import('chart.js/auto')).default // auto-registers everything
  }
  return ChartJs
}

/* ---------- UI state ---------- */
const tabs = ['Page Views', 'Link Clicks', 'Songs', 'Videos'] as const
const selectedTab = ref<typeof tabs[number]>('Page Views')

const rangeOptions: Record<number, string> = {
  1: 'Daily',
  7: 'Last 7 Days',
  30: 'Last 30 Days',
  365: 'Last 1 Year'
}
const selectedRange = ref<number>(1)
const selectedDate = ref(fmt(new Date(), 'yyyy-MM-dd'))

const isLoading = ref(true)
const rawPageViews = ref<any[]>([])
const rawLinkClicks = ref<any[]>([])
const rawMediaPlays = ref<any[]>([])

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

/* ---------- device breakdown ---------- */
function classifyUA(ua = '') {
  const s = ua.toLowerCase().trim()
  if (!s) return 'unknown'
  if (/bot|crawl|spider|slurp|bingpreview|headless/.test(s)) return 'bot'
  if (/ipad|tablet/.test(s)) return 'tablet'
  if (/android/.test(s) && !/mobile/.test(s)) return 'tablet'
  if (/mobile|iphone|ipod|android.*mobile/.test(s)) return 'mobile'
  return 'desktop'
}

const deviceLegend = [
  { key: 'desktop', label: 'Desktop', color: '#8B5CF6' },
  { key: 'mobile', label: 'Mobile', color: '#10B981' },
  { key: 'tablet', label: 'Tablet', color: '#F59E0B' },
  { key: 'bot', label: 'Bot', color: '#6B7280' },
  { key: 'unknown', label: 'Unknown', color: '#9CA3AF' }
] as const

const deviceCounts = computed(() => {
  const c: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0, bot: 0, unknown: 0 }
  for (const v of rawPageViews.value || []) {
    const ua = v?.attributes?.userAgent || ''
    c[classifyUA(ua)]++
  }
  return c
})
const totalDeviceViews = computed(() => rawPageViews.value?.length || 0)
const deviceBreakdown = computed(() => {
  const counts = deviceCounts.value
  const total = totalDeviceViews.value || 1
  return deviceLegend.map((x) => ({
    ...x,
    count: counts[x.key] || 0,
    pct: Math.round(((counts[x.key] || 0) / total) * 1000) / 10
  }))
})

/* ---------- top cities ---------- */
const topCities = computed<[string, number][]>(() => {
  const counts: Record<string, number> = {}
  rawPageViews.value.forEach((v) => {
    const city = v?.attributes?.city || 'Unknown'
    counts[city] = (counts[city] || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) as [string, number][]
})

/* ---------- fetch raw analytics ---------- */
async function fetchAndRender() {
  isLoading.value = true

  const [viewsRes, clicksRes, mediaRes] = await Promise.all([
    client('/band-page-views', {
      params: { filters: { band: { id: route.params.id } }, sort: ['timestamp:desc'], pagination: { limit: 500 } }
    }),
    client(`/link-clicks/band/${route.params.id}`),
    client('/media-plays', {
      params: { filters: { band: { id: route.params.id } }, sort: ['timestamp:desc'], pagination: { limit: 500 } }
    })
  ])

  rawPageViews.value = viewsRes.data || []
  rawLinkClicks.value = clicksRes.data || []
  rawMediaPlays.value = mediaRes.data || []

  isLoading.value = false

  // Ensure Chart.js is ready before rendering
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

  if (selectedTab.value === 'Page Views') {
    if (selectedRange.value === 1) {
      // hourly -> BAR
      const hours = Array.from({ length: 24 }, (_, i) => i)
      const counts: Record<number, number> = Object.fromEntries(hours.map((h) => [h, 0]))
      const dayISO = selectedDate.value

      for (const v of rawPageViews.value) {
        const ts = v?.attributes?.timestamp
        if (!ts) continue
        const d = parseISO(ts)
        if (!isValid(d)) continue
        if (fmt(d, 'yyyy-MM-dd') !== dayISO) continue
        counts[getHours(d)]++
      }

      labels = hours.map((h) => fmt(new Date(2000, 0, 1, h), 'h a')) // 12h
      data = hours.map((h) => counts[h] || 0)
      chartType = 'bar'
      title = 'Page Views (Hourly)'
    } else {
      // daily -> LINE
      const days = Array.from({ length: selectedRange.value }, (_, i) => {
        const d = subDays(new Date(), selectedRange.value - 1 - i)
        return fmt(d, 'yyyy-MM-dd')
      })
      const counts: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]))
      for (const v of rawPageViews.value) {
        const ts = v?.attributes?.timestamp
        if (!ts) continue
        const d = parseISO(ts)
        if (!isValid(d)) continue
        const key = fmt(d, 'yyyy-MM-dd')
        if (counts[key] !== undefined) counts[key]++
      }
      labels = days.map((d) => fmt(parseISO(`${d}T00:00:00`), 'MMM d'))
      data = days.map((d) => counts[d] || 0)
      chartType = 'line'
      title = `Page Views (Last ${selectedRange.value} Days)`
    }
  } else {
    // empty for other tabs for now
    labels = []
    data = []
    chartType = 'line'
    title = `${selectedTab.value}`
  }

  viewsChart?.destroy()
  viewsChart = new ChartJs(ctx, {
    type: chartType,
    data: {
      labels,
      datasets: [
        {
          label: selectedRange.value === 1 ? 'Views' : 'Page Views',
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
            title(items) {
              return items[0]?.label || ''
            },
            label(ctx) {
              const v = ctx.raw as number
              return `${v} ${v === 1 ? 'view' : 'views'}`
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
  await ensureChart()      // make sure Chart is client-loaded
  await fetchAndRender()   // fetch raw analytics + render charts
  await fetchMuse()        // fetch daily insights (Muse)
})

watch([selectedTab, selectedRange, selectedDate, rawPageViews], async () => {
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
