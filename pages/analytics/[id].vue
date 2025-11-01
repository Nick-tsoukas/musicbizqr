<template>
  <div class="px-4 sm:px-6 py-8 bg-black min-h-screen pt-[var(--header-height)] max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-white">Analytics Dashboard</h2>

    <!-- Insights (MUSE) -->
    <div class="chart-card mb-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-white text-lg font-semibold">Insights (Muse)</h3>
        <span class="text-gray-400 text-xs">
  {{ humanDayLabel(museDisplayDate) }}
</span>
      </div>

      <div v-if="museLoading" class="text-gray-300 text-sm">Analyzing…</div>
      <div v-else-if="museError" class="text-red-400 text-sm">Couldn’t load insights.</div>
      <ul v-else-if="insightBullets.length" class="list-disc pl-5 text-gray-200 space-y-1">
        <li v-for="(b, i) in insightBullets" :key="i">{{ b }}</li>
      </ul>
      <div v-else class="text-gray-400 text-sm">No insights yet.</div>
    </div>

    <!-- Muse Summary (derived from rollups) -->
    <div class="chart-card mb-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-white text-lg font-semibold">Muse Summary</h3>
        <span class="text-gray-400 text-xs">Last {{ museRangeLabel }}</span>
      </div>

      <div v-if="!liveMuseSummary" class="text-gray-400 text-sm">
        No summary data yet.
      </div>

      <div v-else>
        <!-- Metric grid -->
        <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
          <!-- Page Views -->
          <div class="bg-neutral-900 rounded-lg p-3">
            <p class="text-gray-400 text-xs">Page Views</p>
            <p class="text-2xl font-semibold text-white">
              {{ liveMuseSummary.pageViews ?? 0 }}
            </p>
            <p
              :class="[
                'text-xs font-medium',
                liveMuseSummary.growthPct > 0
                  ? 'text-emerald-400'
                  : liveMuseSummary.growthPct < 0
                    ? 'text-red-400'
                    : 'text-gray-400'
              ]"
            >
              {{ liveMuseSummary.growthPct > 0 ? '+' : '' }}{{ liveMuseSummary.growthPct ?? 0 }}% vs last day
            </p>
          </div>

          <!-- Link Clicks -->
          <div class="bg-neutral-900 rounded-lg p-3">
            <p class="text-gray-400 text-xs">Link Clicks</p>
            <p class="text-2xl font-semibold text-white">
              {{ liveMuseSummary.linkClicks ?? 0 }}
            </p>
          </div>

          <!-- Song Plays -->
          <div class="bg-neutral-900 rounded-lg p-3">
            <p class="text-gray-400 text-xs">Song Plays</p>
            <p class="text-2xl font-semibold text-white">
              {{ liveMuseSummary.songPlays ?? 0 }}
            </p>
          </div>

          <!-- Video Plays -->
          <div class="bg-neutral-900 rounded-lg p-3">
            <p class="text-gray-400 text-xs">Video Plays</p>
            <p class="text-2xl font-semibold text-white">
              {{ liveMuseSummary.videoPlays ?? 0 }}
            </p>
          </div>

          <!-- ✅ QR Scans -->
          <div class="bg-neutral-900 rounded-lg p-3">
            <p class="text-gray-400 text-xs">QR Scans</p>
            <p class="text-2xl font-semibold text-white">
              {{ liveMuseSummary.qrScans ?? 0 }}
            </p>
          </div>

          <!-- Engagement -->
          <div class="bg-neutral-900 rounded-lg p-3">
            <p class="text-gray-400 text-xs">Engagement Rate</p>
            <p class="text-2xl font-semibold text-white">
              {{ liveMuseSummary.engagementRate ?? 0 }}%
            </p>
          </div>
        </div>

        <!-- Top lists -->
        <div class="grid sm:grid-cols-3 gap-3 text-gray-300 text-sm">
          <!-- Top Cities -->
          <div>
            <p class="font-semibold text-white mb-1">Top Cities:</p>
            <p>
              {{
                (liveMuseSummary.topCities && liveMuseSummary.topCities.length)
                  ? liveMuseSummary.topCities.map(c => c[0]).join(', ')
                  : 'N/A'
              }}
            </p>
          </div>

          <!-- Top Sources -->
          <div>
            <p class="font-semibold text-white mb-1">Top Sources:</p>
            <p>
              {{
                (liveMuseSummary.topSources && liveMuseSummary.topSources.length)
                  ? liveMuseSummary.topSources.map(s => s[0]).join(', ')
                  : 'N/A'
              }}
            </p>
          </div>

          <!-- Top Platforms -->
          <div>
            <p class="font-semibold text-white mb-1">Top Platforms:</p>
            <p>
              {{
                (liveMuseSummary.topPlatforms && liveMuseSummary.topPlatforms.length)
                  ? liveMuseSummary.topPlatforms.map(p => p[0]).join(', ')
                  : 'N/A'
              }}
            </p>
          </div>
        </div>
      </div>
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

    <!-- only for first load -->
    <div v-if="isInitialLoading" class="text-white">🔄 Loading data…</div>

    <!-- after first load, never collapse -->
    <div v-else class="space-y-6">
      <!-- Page Views / Clicks / Plays / QR -->
      <div class="chart-card relative">
        <!-- small overlay while refreshing (range change) -->
        <div
          v-if="isRefreshing"
          class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
        >
          <span class="text-gray-200 text-sm">Refreshing…</span>
        </div>

        <div class="flex items-center justify-between mb-2">
          <h3 class="text-white text-lg font-semibold">{{ chartTitle }}</h3>

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
import { format as fmt, parseISO, isValid, getHours } from 'date-fns'
import qs from 'qs'

/* ---------- Strapi client / route ---------- */
const client = useStrapiClient()
const route = useRoute()

/* ---------- Muse (daily insights list — the top “Insights (Muse)” box) ---------- */
const museRows = ref<any[]>([])
const museLoading = ref(false)
const museError = ref<any>(null)
const latestMuse = computed(() => museRows.value?.[0]?.attributes || null)

/* ---------- Analytics composable (rollups, geo, transitions) ---------- */
const { getRollups, getGeo, getTransitions } = useMuse()

/* ---------- UI state ---------- */
// ✅ added "QR Scans" here
const tabs = ['Page Views', 'Link Clicks', 'Songs', 'Videos', 'QR Scans'] as const
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
const rollups = ref<any | null>(null)
const geo = ref<any | null>(null)
const transitions = ref<any | null>(null)

/* ---------- raw events (only used for hourly chart + daily muse split) ---------- */
const rawPageViews = ref<any[]>([])
const rawLinkClicks = ref<any[]>([])
const rawMediaPlays = ref<any[]>([])
// ✅ new: raw QR scans
const rawQrScans = ref<any[]>([])

const isInitialLoading = ref(true)
const isRefreshing = ref(false)

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

/* ---------- computed from server rollups ---------- */
const totalViewsInRange = computed(() => rollups.value?.totals?.views ?? 0)
const totalClicksInRange = computed(() => rollups.value?.totals?.clicks ?? 0)
// ✅ total QR in range (for later if we want to show)
const totalQrInRange = computed(() => rollups.value?.totals?.qrScans ?? 0)

const sourceCounts = computed<[string, number][]>(() => rollups.value?.sources ?? [])
const mediumCounts = computed<[string, number][]>(() => rollups.value?.mediums ?? [])
const topRefDomains = computed<[string, number][]>(() => rollups.value?.refDomains ?? [])
const topClickPlatforms = computed<[string, number][]>(() => rollups.value?.platforms ?? [])

/* ---------- Top cities (from /analytics/geo) ---------- */
const topCities = computed<[string, number][]>(() => {
  const list = geo.value?.list ?? []
  return list.map((r: any) => [r.city || 'Unknown', r.count]) as [string, number][]
})

/* ---------- devices (from rollups) ---------- */
const deviceLegend = [
  { key: 'desktop', label: 'Desktop', color: '#8B5CF6' },
  { key: 'mobile', label: 'Mobile', color: '#10B981' },
  { key: 'tablet', label: 'Tablet', color: '#F59E0B' },
  { key: 'bot', label: 'Bot', color: '#6B7280' },
  { key: 'unknown', label: 'Unknown', color: '#9CA3AF' }
] as const

const deviceCounts = computed(
  () => rollups.value?.devices ?? { desktop: 0, mobile: 0, tablet: 0, bot: 0, unknown: 0 }
)
const totalDeviceViews = computed(() =>
  Object.values(deviceCounts.value).reduce(
    (a: any, b: any) => a + (Number.isFinite(b) ? b : 0),
    0
  )
)
const deviceBreakdown = computed(() => {
  const counts: any = deviceCounts.value
  const total = totalDeviceViews.value || 1
  return deviceLegend.map((x) => ({
    ...x,
    count: counts[x.key] || 0,
    pct: Math.round(((counts[x.key] || 0) / total) * 1000) / 10
  }))
})

/* ---------- Muse range label (for the card) ---------- */
const museRangeLabel = computed(() => {
  if (selectedRange.value === 7) return 'Last 7 Days'
  if (selectedRange.value === 30) return 'Last 30 Days'
  if (selectedRange.value === 365) return 'Last 1 Year'
  if (selectedRange.value === 1) return 'Today'
  return `Last ${selectedRange.value} Days`
})

const chartTitle = computed(() => {
  if (selectedRange.value === 1) {
    if (selectedTab.value === 'Page Views') return 'Page Views (Hourly)'
    if (selectedTab.value === 'Link Clicks') return 'Link Clicks (Hourly)'
    if (selectedTab.value === 'Songs') return 'Song Plays (Hourly)'
    if (selectedTab.value === 'Videos') return 'Video Plays (Hourly)'
    if (selectedTab.value === 'QR Scans') return 'QR Scans (Hourly)'
  } else {
    if (selectedTab.value === 'Page Views') return `Page Views (Last ${selectedRange.value} Days)`
    if (selectedTab.value === 'Link Clicks') return `Link Clicks (Last ${selectedRange.value} Days)`
    if (selectedTab.value === 'Songs') return `Song Plays (Last ${selectedRange.value} Days)`
    if (selectedTab.value === 'Videos') return `Video Plays (Last ${selectedRange.value} Days)`
    if (selectedTab.value === 'QR Scans') return `QR Scans (Last ${selectedRange.value} Days)`
  }
  return 'Analytics'
})

/* ---------------- helper: count songs/videos from RAW media (STRICT) ---------------- */
function countMediaFromRaw(rows: any[], yyyymmdd: string) {
  let songs = 0
  let videos = 0

  for (const r of rows) {
    const a = r?.attributes || r || {}
    const ts = a.timestamp || a.createdAt || a.updatedAt
    if (!ts) continue

    const d = parseISO(ts)
    if (!isValid(d)) continue
    const day = fmt(d, 'yyyy-MM-dd')
    if (day !== yyyymmdd) continue

    const kind = String(a.kind || a.mediaType || a.type || '').toLowerCase().trim()

    const isSong =
      kind.includes('song') ||
      kind.includes('audio') ||
      kind.includes('spotify') ||
      kind.includes('apple') ||
      kind.includes('music') ||
      kind.includes('soundcloud')

    const isVideo =
      kind.includes('video') ||
      kind.includes('youtube') ||
      kind.includes('vimeo') ||
      kind.includes('tiktok')

    if (isSong) {
      songs++
    } else if (isVideo) {
      videos++
    }
  }

  return { songs, videos }
}

/* ---------------- core media splitter ---------------- */
function deriveSongVideoSplit(opts: {
  selectedRange: number
  rollups: any
  transitions: any
  rawMediaPlays: any[]
  selectedDate: string
}) {
  const { selectedRange, rollups, transitions, rawMediaPlays, selectedDate } = opts

  const totals = rollups?.totals || {}
  const totalPlays = totals.plays ?? 0
  const totalSongPlays = totals.songPlays ?? 0
  const totalVideoPlays = totals.videoPlays ?? 0

  if (selectedRange === 1) {
    const fromRaw = countMediaFromRaw(rawMediaPlays, selectedDate)
    if (fromRaw.songs > 0 || fromRaw.videos > 0) {
      return {
        songPlays: fromRaw.songs,
        videoPlays: fromRaw.videos,
        source: 'raw-daily'
      }
    }

    return {
      songPlays: totalSongPlays,
      videoPlays: totalVideoPlays,
      source: 'rollups-daily-fallback'
    }
  }

  if (typeof totalSongPlays === 'number' || typeof totalVideoPlays === 'number') {
    return {
      songPlays: totalSongPlays,
      videoPlays: totalVideoPlays,
      source: 'rollups-range'
    }
  }

  const tMedia = transitions?.media
  if (tMedia && (typeof tMedia.songs === 'number' || typeof tMedia.videos === 'number')) {
    return {
      songPlays: tMedia.songs ?? 0,
      videoPlays: tMedia.videos ?? 0,
      source: 'transitions-range'
    }
  }

  return {
    songPlays: totalPlays,
    videoPlays: 0,
    source: 'range-last-fallback'
  }
}

/* ============================================================================ */
/*   Build Muse summary from rollups + transitions + raw                        */
/* ============================================================================ */
const liveMuseSummary = computed(() => {
  const r = rollups.value
  if (!r) return null

  const views = r.totals?.views ?? 0
  const clicks = r.totals?.clicks ?? 0
  const plays = r.totals?.plays ?? 0
  const qrScans = r.totals?.qrScans ?? 0   // ✅ NEW

  const split = deriveSongVideoSplit({
    selectedRange: selectedRange.value,
    rollups: r,
    transitions: transitions.value,
    rawMediaPlays: rawMediaPlays.value,
    selectedDate: selectedDate.value
  })

  const engagementRate =
    views > 0 ? Math.round(((clicks + plays + qrScans) / views) * 1000) / 10 : 0

  // growth
  const series = Array.isArray(r.series) ? r.series : []
  let growthPct = 0
  if (series.length >= 2) {
    const last = series[series.length - 1]?.views || 0
    const prev = series[series.length - 2]?.views || 0
    if (prev > 0) {
      growthPct = Math.round(((last - prev) / prev) * 1000) / 10
    } else if (last > 0) {
      growthPct = 100
    }
  }

  const topCities = Array.isArray(geo.value?.list)
    ? geo.value!.list.map((r: any) => [r.city || 'unknown', r.count]).slice(0, 3)
    : []

  const topSources = Array.isArray(r.sources) ? r.sources.slice(0, 3) : []
  const topPlatforms = Array.isArray(r.platforms) ? r.platforms.slice(0, 3) : []

  const summary = {
    pageViews: views,
    linkClicks: clicks,
    songPlays: split.songPlays,
    videoPlays: split.videoPlays,
    qrScans,                            // ✅ expose to template
    engagementRate,
    growthPct,
    prevComparison: 0,
    topCities,
    topSources,
    topPlatforms,
    days: selectedRange.value,
    mediaSource: split.source
  }

  console.log('[muse] liveMuseSummary →', summary)
  return summary
})

// when <canvas> actually mounts inside <ClientOnly>, render the chart
watch(
  () => viewsCanvas.value,
  async (canvas) => {
    if (!canvas) return
    await ensureChart()
    renderViewsChart()
    renderDeviceDoughnut()
  }
)

/* ---------- Insight bullets (top box) ---------- */
const serverMuse = computed(() => rollups.value?.muse || null)

const museDisplayDate = computed(() => {
  // 1) prefer rollups → latest day in series
  const s = rollups.value?.series
  if (Array.isArray(s) && s.length) {
    const last = s[s.length - 1]
    if (last?.date) return last.date
  }

  // 2) fallback to stored muse
  const m = latestMuse.value
  if (m?.date) return m.date

  // 3) fallback to today
  return fmt(new Date(), 'yyyy-MM-dd')
})

const insightBullets = computed(() => {
  // 1) prefer live server muse (today)
  const serverList = serverMuse.value?.insights
  if (Array.isArray(serverList) && serverList.length) {
    // hard cap to 3 for UX
    return serverList
      .slice(0, 3)
      .map((i: any) => i?.title)
      .filter(Boolean)
  }

  // 2) fallback to stored /band-insights-daily
  const m = latestMuse.value
  if (!m) return []
  const out: string[] = []

  const g = Math.round((m.growthPct || 0) * 10) / 10
  if (g > 0) out.push(`Traffic grew ${g}% vs. yesterday.`)
  else if (g < 0) out.push(`Traffic fell ${Math.abs(g)}% vs. yesterday.`)
  else out.push(`Traffic is flat vs. yesterday.`)

  return out.slice(0, 3)
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

/* ---------- fetch Muse daily insights (for the “Insights (Muse)” list) ---------- */
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
  } catch (e: any) {
    museError.value = e?.response?._data || e
  } finally {
    museLoading.value = false
  }
}


async function fetchAndRender(silent = false) {
  if (silent) {
    isRefreshing.value = true
  } else {
    isInitialLoading.value = true
  }

  const bandId = Number(route.params.id)
  const rangeKey = `${selectedRange.value}d`

  console.log('[analytics] fetching rollups for', { bandId, rangeKey })

  const [r, g, t] = await Promise.all([
    getRollups(bandId, rangeKey),
    getGeo(bandId, rangeKey),
    getTransitions(bandId, rangeKey)
  ])

  rollups.value = r
  geo.value = g
  transitions.value = t

  // ✅ daily raw fetch (1 day → we want raw rows)
  if (selectedRange.value === 1) {
    // build the 2 scan URLs with qs so deep filters actually work
    const scansDirectQuery = qs.stringify(
      {
        filters: {
          band: {
            id: { $eq: bandId }
          }
        },
        sort: ['date:desc'],
        pagination: { limit: 500 },
        populate: { qr: { populate: ['band'] } }
      },
      { encodeValuesOnly: true }
    )

    const scansViaQrQuery = qs.stringify(
      {
        filters: {
          qr: {
            band: {
              id: { $eq: bandId }
            }
          }
        },
        sort: ['date:desc'],
        pagination: { limit: 500 },
        populate: { qr: { populate: ['band'] } }
      },
      { encodeValuesOnly: true }
    )

    const [
      viewsRes,
      clicksRes,
      mediaRes,
      scansDirectRes,
      scansViaQrRes
    ] = await Promise.all([
      // page views (by band)
      client('/band-page-views', {
        params: {
          filters: { band: { id: bandId } },
          sort: ['timestamp:desc'],
          pagination: { limit: 500 }
        }
      }),
      // link clicks (you already expose /link-clicks/band/:id)
      client(`/link-clicks/band/${bandId}`),
      // media plays (two styles, keep your fallback)
      client(`/media-plays/band/${bandId}`).catch(() =>
        client('/media-plays', {
          params: {
            filters: { band: { id: bandId } },
            sort: ['timestamp:desc'],
            pagination: { limit: 500 }
          }
        })
      ),
      // ✅ scans with band directly on scan
      client(`/scans?${scansDirectQuery}`),
      // ✅ scans where scan.qr.band = bandId
      client(`/scans?${scansViaQrQuery}`)
    ])

    // helpers (same as before)
    const toArray = (res: any) => {
      if (!res) return []
      if (Array.isArray(res)) return res
      if (Array.isArray(res.data)) return res.data
      if (Array.isArray(res.results)) return res.results
      if (res.data && !Array.isArray(res.data)) return [res.data]
      return []
    }

    const unifyMedia = (rows: any[]) =>
      rows.map((r) => {
        const a = r?.attributes || r || {}
        return {
          id: r?.id ?? a?.id,
          attributes: {
            ...a,
            timestamp:
              a.timestamp ||
              a.createdAt ||
              a.updatedAt ||
              r?.timestamp ||
              r?.createdAt ||
              r?.updatedAt ||
              null,
            kind: String(a.kind ?? a.type ?? a.mediaType ?? '').toLowerCase(),
            title: a.title ?? r?.title ?? ''
          }
        }
      })

    const unifyClicks = (rows: any[]) =>
      rows.map((r) => {
        const a = r?.attributes || r || {}
        return {
          id: r?.id ?? a?.id,
          attributes: {
            ...a,
            timestamp: a.timestamp || a.createdAt || r?.timestamp || r?.createdAt || null,
            platform:
              a.platform ??
              a.provider ??
              a.source ??
              r?.platform ??
              r?.provider ??
              r?.source ??
              '',
            url: a.url ?? r?.url ?? ''
          }
        }
      })

    const unifyScans = (rows: any[]) =>
      rows.map((r) => {
        const a = r?.attributes || r || {}
        return {
          id: r?.id ?? a?.id,
          attributes: {
            ...a,
            // your schema uses "date"
            timestamp: a.date || a.timestamp || a.createdAt || a.updatedAt || null,
            qr: a.qr || null
          }
        }
      })

    // assign raw
    rawPageViews.value = toArray(viewsRes)
    rawLinkClicks.value = unifyClicks(toArray(clicksRes))
    rawMediaPlays.value = unifyMedia(toArray(mediaRes))

    // ✅ merge scans from both queries
    const scansDirect = unifyScans(toArray(scansDirectRes))
    const scansViaQr = unifyScans(toArray(scansViaQrRes))

    const seen = new Set<string | number>()
    const merged: any[] = []

    for (const s of [...scansDirect, ...scansViaQr]) {
      const key = s.id || s.attributes?.id
      if (key && !seen.has(key)) {
        seen.add(key)
        merged.push(s)
      }
    }

    rawQrScans.value = merged
  } else {
    // non-daily: no raw rows
    rawPageViews.value = []
    rawLinkClicks.value = []
    rawMediaPlays.value = []
    rawQrScans.value = []
  }

  await ensureChart()
  await nextTick()
  renderViewsChart()
  renderDeviceDoughnut()

  if (!silent) {
    isInitialLoading.value = false
  } else {
    isRefreshing.value = false
  }
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

  if (selectedRange.value === 1) {
    // DAILY / HOURLY
    let rows: any[] = []
    if (selectedTab.value === 'Page Views') {
      rows = rawPageViews.value
    } else if (selectedTab.value === 'Link Clicks') {
      rows = rawLinkClicks.value
    } else if (selectedTab.value === 'QR Scans') {
      rows = rawQrScans.value
    } else {
      // Songs OR Videos → work off media, but filter by kind
      rows = rawMediaPlays.value
    }

    const hours = Array.from({ length: 24 }, (_, i) => i)
    const counts: Record<number, number> = Object.fromEntries(hours.map((h) => [h, 0]))
    const dayISO = selectedDate.value

    for (const v of rows) {
      const ts = tsOf(v)
      if (!ts) continue
      const d = parseISO(ts)
      if (!isValid(d)) continue
      if (fmt(d, 'yyyy-MM-dd') !== dayISO) continue

      // 🔑 filter by media kind ONLY for Songs / Videos
      if (selectedTab.value === 'Songs' || selectedTab.value === 'Videos') {
        const a = v?.attributes || v || {}
        const kind = String(a.kind || a.mediaType || a.type || '').toLowerCase().trim()

        const isSong =
          kind.includes('song') ||
          kind.includes('audio') ||
          kind.includes('spotify') ||
          kind.includes('apple') ||
          kind.includes('music') ||
          kind.includes('soundcloud')

        const isVideo =
          kind.includes('video') ||
          kind.includes('youtube') ||
          kind.includes('vimeo') ||
          kind.includes('tiktok')

        if (selectedTab.value === 'Songs' && !isSong) continue
        if (selectedTab.value === 'Videos' && !isVideo) continue
      }

      counts[getHours(d)]++
    }

    labels = hours.map((h) => fmt(new Date(2000, 0, 1, h), 'h a'))
    data = hours.map((h) => counts[h] || 0)
    chartType = 'bar'
    title =
      selectedTab.value === 'Page Views'
        ? 'Page Views (Hourly)'
        : selectedTab.value === 'Link Clicks'
          ? 'Link Clicks (Hourly)'
          : selectedTab.value === 'QR Scans'
            ? 'QR Scans (Hourly)'
            : `${selectedTab.value} (Hourly)`
  } else {
    // RANGE (7/30/365)
    const s = rollups.value?.series ?? []
    labels = s.map((d: any) => fmt(parseISO(`${d.date}T00:00:00`), 'MMM d'))

    data = s.map((d: any) => {
      if (selectedTab.value === 'Page Views') return d.views
      if (selectedTab.value === 'Link Clicks') return d.clicks
      if (selectedTab.value === 'Songs') return d.songPlays ?? 0
      if (selectedTab.value === 'Videos') return d.videoPlays ?? 0
      if (selectedTab.value === 'QR Scans') return d.qrScans ?? 0
      return d.plays ?? 0
    })

    chartType = 'line'
    title =
      selectedTab.value === 'Page Views'
        ? `Page Views (Last ${selectedRange.value} Days)`
        : selectedTab.value === 'Link Clicks'
          ? `Link Clicks (Last ${selectedRange.value} Days)`
          : selectedTab.value === 'QR Scans'
            ? `QR Scans (Last ${selectedRange.value} Days)`
            : `${selectedTab.value} (Last ${selectedRange.value} Days)`
  }

  const datasetLabel =
    selectedTab.value === 'Page Views'
      ? selectedRange.value === 1
        ? 'Views'
        : 'Page Views'
      : selectedTab.value === 'Link Clicks'
        ? 'Link Clicks'
        : selectedTab.value === 'Songs'
          ? 'Song Plays'
          : selectedTab.value === 'Videos'
            ? 'Video Plays'
            : 'QR Scans'

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
            title(items) {
              return items[0]?.label || ''
            },
            label(ctx) {
              const v = ctx.raw as number
              const noun =
                selectedTab.value === 'Page Views'
                  ? 'view'
                  : selectedTab.value === 'Link Clicks'
                    ? 'click'
                    : selectedTab.value === 'QR Scans'
                      ? 'scan'
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

/* ---------- DEBUG WATCHES ---------- */
watch(
  () => [selectedRange.value, selectedDate.value],
  ([r, d]) => {
    console.log('[watch] selectedRange/date →', { r, d })
  }
)

watch(
  () => rawMediaPlays.value,
  (val) => {
    console.log('[watch] rawMediaPlays changed →', val.map((v: any) => v?.attributes ?? v))
  }
)

watch(
  () => transitions.value,
  (val) => {
    console.log('[watch] transitions changed →', val)
  }
)

watch(
  () => rollups.value,
  (val) => {
    console.log('[watch] rollups changed →', val)
  }
)

/* ---------- lifecycle ---------- */
onMounted(async () => {
  await ensureChart()
  await fetchAndRender(false) // first load
  await fetchMuse()
})

// when range changes → silent refresh
watch(selectedRange, async () => {
  await fetchAndRender(true)
})

// when tab/date/rollups change → just re-render
watch([selectedTab, selectedDate, rollups], async () => {
  if (!isInitialLoading.value) {
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
  background: #111827;
  border-radius: 0.75rem;
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

input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
