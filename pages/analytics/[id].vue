<template>
  <div class="bg-black text-white min-h-screen mx-auto p-4 max-w-5xl">
    <h1 class="text-2xl font-bold mb-4">Analytics Dashboard</h1>

    <!-- 1) Tab Bar -->
    <div class="flex space-x-4 border-b border-gray-700 mb-6">
      <button
        @click="view = 'links'"
        :class="{ 'border-b-2 border-white': view === 'links' }"
        class="px-4 py-2"
      >Links</button>
      <button
        @click="view = 'songs'"
        :class="{ 'border-b-2 border-white': view === 'songs' }"
        class="px-4 py-2"
      >Songs</button>
      <button
        @click="view = 'videos'"
        :class="{ 'border-b-2 border-white': view === 'videos' }"
        class="px-4 py-2"
      >Videos</button>
    </div>

    <!-- 1.5) Time Range Selector -->
    <div class="flex items-center space-x-4 mb-6">
      <label class="font-medium">Range:</label>
      <select v-model="selectedRange" class="bg-gray-800 px-2 py-1 rounded">
        <option v-for="r in ranges" :key="r.key" :value="r.key">
          {{ r.label }}
        </option>
      </select>
    </div>

    <!-- 2) Filters for Songs/Videos -->
    <div v-if="view !== 'links'" class="flex items-center space-x-4 mb-8">
      <label>Media:</label>
      <select v-model="selectedMedia" class="bg-gray-800 px-2 py-1 rounded">
        <option value="all">All</option>
        <option v-for="m in mediaList" :key="m.id" :value="m.id">
          {{ m.title }}
        </option>
      </select>

      <label>Group by:</label>
      <button
        @click="groupBy = 'daily'"
        :class="btnClass('daily')"
        class="px-2 py-1 rounded"
      >Daily</button>
      <button
        @click="groupBy = 'weekly'"
        :class="btnClass('weekly')"
        class="px-2 py-1 rounded"
      >Weekly</button>
      <button
        @click="groupBy = 'monthly'"
        :class="btnClass('monthly')"
        class="px-2 py-1 rounded"
      >Monthly</button>
      <button
        @click="groupBy = 'yearly'"
        :class="btnClass('yearly')"
        class="px-2 py-1 rounded"
      >Yearly</button>
    </div>

    <!-- 3) Chart Canvases -->
    <div v-if="view === 'links'">
      <section class="mb-12">
        <h2 class="text-xl mb-2">Clicks by Platform (Bar)</h2>
        <canvas id="barChart"></canvas>
      </section>
      <section class="mb-12">
        <h2 class="text-xl mb-2">Clicks Over Time (Line)</h2>
        <canvas id="lineChart"></canvas>
      </section>
      <section>
        <h2 class="text-xl mb-2">Clicks Distribution (Pie)</h2>
        <canvas id="pieChart"></canvas>
      </section>
    </div>

    <div v-else>
      <section class="mb-12">
        <h2 class="text-xl mb-2">
          {{ view === 'songs' ? 'Song' : 'Video' }} Plays Over Time (Line)
        </h2>
        <canvas id="mediaLineChart"></canvas>
      </section>
      <section class="mb-12">
        <h2 class="text-xl mb-2">
          {{ view === 'songs' ? 'Song' : 'Video' }} Play Counts (Bar)
        </h2>
        <canvas id="mediaBarChart"></canvas>
      </section>
      <section>
        <h2 class="text-xl mb-2">
          {{ view === 'songs' ? 'Song' : 'Video' }} Distribution (Pie)
        </h2>
        <canvas id="mediaPieChart"></canvas>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)

// --- TYPES ---
type View = 'links' | 'songs' | 'videos'
type GroupBy = 'daily' | 'weekly' | 'monthly' | 'yearly'
type RangeKey = 'd1' | 'd7' | 'd30' | 'm3' | 'm6' | 'y1' | 'all'

// --- ROUTE & CONFIG ---
const route = useRoute()
const config = useRuntimeConfig()
const bandId = route.params.id as string

// --- RANGES ---
const ranges = [
  { label: '24h', key: 'd1',  amount: 1, unit: 'day' },
  { label: '7d',  key: 'd7',  amount: 7, unit: 'day' },
  { label: '30d', key: 'd30', amount: 30, unit: 'day' },
  { label: '3mo', key: 'm3',  amount: 3, unit: 'month' },
  { label: '6mo', key: 'm6',  amount: 6, unit: 'month' },
  { label: '1y',  key: 'y1',  amount: 1, unit: 'year' },
  { label: 'All', key: 'all', amount: 0, unit: 'day' },
] as const

const selectedRange = ref<RangeKey>('all')
const startDate = computed(() => {
  const spec = ranges.find(r => r.key === selectedRange.value)!
  return spec.key === 'all'
    ? null
    : dayjs().subtract(spec.amount, spec.unit as any)
})

// --- STATE ---
const view = ref<View>('links')
const groupBy = ref<GroupBy>('daily')
const selectedMedia = ref<'all' | number>('all')
const mediaList = ref<{ id: number; title: string }[]>([])
const linkClicks = ref<{ timestamp: string; clickCount: number; platform: string }[]>([])
const mediaPlays = ref<{ id: number; title: string; timestamp: string; clickCount: number }[]>([])

// Chart.js reference - client-only import
let ChartRef: any = null

// Map your groupBy into valid time units for the X-axis
const unitMap: Record<GroupBy, string> = {
  daily:   'hour',
  weekly:  'week',
  monthly: 'month',
  yearly:  'year'
}

// --- FETCH FUNCTIONS ---
async function fetchLinkClicks() {
  const url = `${config.public.strapiUrl}/api/link-clicks/band/${bandId}`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error('fetchLinkClicks failed:', res.status, await res.text())
      linkClicks.value = []
      return
    }
    const json = await res.json()
    const items: any[] = Array.isArray(json)
      ? json
      : Array.isArray(json.data)
      ? json.data
      : []
    linkClicks.value = items.map(item => ({
      timestamp:  item.timestamp   ?? item.attributes?.createdAt   ?? '',
      clickCount: item.clickCount  ?? item.attributes?.clickCount  ?? item.count ?? 0,
      platform:   item.platform    ?? item.attributes?.platform    ?? 'Unknown'
    }))
  } catch (err) {
    console.error('fetchLinkClicks error:', err)
    linkClicks.value = []
  }
}

async function fetchMediaList() {
  try {
    const songUrl  = `${config.public.strapiUrl}/api/media-plays?filters[band]=${bandId}&filters[mediaType]=song&pagination[pageSize]=1000`
    const videoUrl = `${config.public.strapiUrl}/api/media-plays?filters[band]=${bandId}&filters[mediaType]=video&pagination[pageSize]=1000`
    const [sRes, vRes] = await Promise.all([fetch(songUrl), fetch(videoUrl)])
    if (!sRes.ok || !vRes.ok) throw new Error(`Songs ${sRes.status}, Videos ${vRes.status}`)
    const [{ data: sData }, { data: vData }] = await Promise.all([sRes.json(), vRes.json()])
    // dedupe by title
    const combined = [
      ...sData.map((m: any) => ({ id: m.id, title: m.attributes?.title ?? m.title })),
      ...vData.map((m: any) => ({ id: m.id, title: m.attributes?.title ?? m.title }))
    ]
    const seen = new Set<string>()
    mediaList.value = combined.filter(item => {
      if (seen.has(item.title)) return false
      seen.add(item.title)
      return true
    })
  } catch (err) {
    console.error('fetchMediaList failed:', err)
    mediaList.value = []
  }
}

async function fetchMediaPlays() {
  try {
    const type  = view.value === 'songs' ? 'song' : 'video'
    const extra = selectedMedia.value === 'all' ? '' : `&filters[id]=${selectedMedia.value}`
    const url   = `${config.public.strapiUrl}/api/media-plays?filters[band]=${bandId}&filters[mediaType]=${type}${extra}&pagination[pageSize]=1000`
    const res   = await fetch(url)
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const { data } = await res.json()
    mediaPlays.value = Array.isArray(data)
      ? data.map((m: any) => ({
          id:         m.id,
          title:      m.attributes?.title   ?? m.title,
          timestamp:  m.attributes?.timestamp ?? m.timestamp,
          clickCount: 1
        }))
      : []
  } catch (err) {
    console.error('fetchMediaPlays failed:', err)
    mediaPlays.value = []
  }
}

// --- HELPERS ---
function filterByRange(arr: any[]) {
  if (!startDate.value) return arr
  return arr.filter(evt => dayjs(evt.timestamp).isAfter(startDate.value!))
}

function aggregateByPeriod(arr: any[], keyFn: (d: dayjs.Dayjs) => string) {
  const map: Record<string, number> = {}
  arr.forEach(evt => {
    const dt = dayjs(evt.timestamp)
    if (!dt.isValid()) return
    const key = keyFn(dt)
    map[key] = (map[key] || 0) + evt.clickCount
  })
  const keys = Object.keys(map).sort()
  return { labels: keys, data: keys.map(k => map[k]) }
}

// --- COMPUTED FOR LINKS: MULTI-SERIES LINE ---
const timeSeriesByPlatform = computed(() => {
  const arr = filterByRange(linkClicks.value)
  const bucket = (dt: dayjs.Dayjs) => {
    if (groupBy.value === 'daily')   return dt.format('YYYY-MM-DD HH:mm')
    if (groupBy.value === 'weekly')  return dt.isoWeekYear() + '-W' + String(dt.isoWeek()).padStart(2,'0')
    if (groupBy.value === 'monthly') return dt.format('YYYY-MM')
    return dt.format('YYYY')
  }
  const allKeys = Array.from(new Set(arr.map(e => bucket(dayjs(e.timestamp))))).sort()
  const platforms = Array.from(new Set(arr.map(e => e.platform)))
  const datasets = platforms.map(platform => {
    const counts: Record<string, number> = {}
    arr.filter(e => e.platform === platform).forEach(e => {
      const k = bucket(dayjs(e.timestamp))
      counts[k] = (counts[k] || 0) + e.clickCount
    })
    return {
      label:    platform,
      data:     allKeys.map(k => counts[k] || 0),
      fill:     false,
      tension:  0.2
    }
  })
  return { labels: allKeys, datasets }
})

// --- COMPUTED FOR SONGS/VIDEOS: SINGLE SERIES LINE DATA + DISTRIBUTION ---
const timeSeriesData = computed(() => {
  const raw = view.value === 'links' ? linkClicks.value : mediaPlays.value
  const arr = filterByRange(raw)
  switch (groupBy.value) {
    case 'daily':   return aggregateByPeriod(arr, dt => dt.format('YYYY-MM-DD'))
    case 'weekly':  return aggregateByPeriod(arr, dt => dt.isoWeekYear() + '-W' + String(dt.isoWeek()).padStart(2,'0'))
    case 'monthly': return aggregateByPeriod(arr, dt => dt.format('YYYY-MM'))
    case 'yearly':  return aggregateByPeriod(arr, dt => dt.format('YYYY'))
  }
})
const distributionData = computed(() => {
  const raw = view.value === 'links' ? linkClicks.value : mediaPlays.value
  const arr = filterByRange(raw)
  const map: Record<string, number> = {}
  arr.forEach(evt => {
    const cat = view.value === 'links' ? evt.platform : evt.title
    map[cat] = (map[cat] || 0) + evt.clickCount
  })
  const labels = Object.keys(map)
  return { labels, data: labels.map(l => map[l]) }
})

// --- DRAW & RENDER ---
import 'chartjs-adapter-luxon'

function drawTimeChart(id: string, series: any, title: string) {
  const ctx = (document.getElementById(id) as HTMLCanvasElement).getContext('2d')!
  return new ChartRef(ctx, {
    type: 'line',
    data: { labels: series.labels, datasets: series.datasets },
    options: {
      plugins: {
        title:  { display: true, text: title, color: '#fff' },
        legend: { labels: { color: '#fff' } }
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: unitMap[groupBy.value] },
          ticks: { color: '#fff' },
          grid:  { color: '#333' }
        },
        y: {
          beginAtZero: true,
          ticks:        { color: '#fff' },
          grid:         { color: '#333' }
        }
      }
    }
  })
}

function drawChart(id: string, type: string, series: any, label: string) {
  const ctx = (document.getElementById(id) as HTMLCanvasElement).getContext('2d')!
  return new ChartRef(ctx, {
    type,
    data: { labels: series.labels, datasets: [{ label, data: series.data }] },
    options: {
      scales: {
        x: { ticks: { color: '#fff' }, grid: { color: '#333' } },
        y: { beginAtZero: true, ticks: { color: '#fff' }, grid: { color: '#333' } }
      },
      plugins: {
        legend: { labels: { color: '#fff' } }
      }
    }
  })
}

let charts: any[] = []
async function renderCharts() {
  await nextTick()
  charts.forEach(c => c.destroy())
  charts = []

  if (view.value === 'links') {
    charts.push(drawChart  ('barChart', 'bar', timeSeriesByPlatform.value, 'Clicks by Platform'))
    charts.push(drawTimeChart('lineChart', timeSeriesByPlatform.value, 'Clicks Over Time by Platform'))
    charts.push(drawChart  ('pieChart','pie', distributionData.value, 'Clicks Distribution'))
  } else {
    const lbl = view.value === 'songs' ? 'Song Plays' : 'Video Plays'
    charts.push(drawTimeChart('mediaLineChart', {
      labels:   timeSeriesData.value.labels,
      datasets: [{ label: lbl, data: timeSeriesData.value.labels.map((l,i) => ({ x: l, y: timeSeriesData.value.data[i] })), fill:false, tension:0.2 }]
    }, lbl + ' Over Time'))
    charts.push(drawChart('mediaBarChart','bar', distributionData.value, lbl + ' Counts'))
    charts.push(drawChart('mediaPieChart','pie', distributionData.value, lbl + ' Distribution'))
  }
}

// --- WATCH & MOUNT ---
watch([view, groupBy, selectedMedia, selectedRange], async () => {
  if (view.value !== 'links') await fetchMediaPlays()
  await renderCharts()
})

onMounted(async () => {
  const chartMod   = await import('chart.js/auto')
  await import('chartjs-adapter-luxon')
  ChartRef = chartMod.Chart

  await fetchLinkClicks()
  await fetchMediaList()
  await fetchMediaPlays()
  await renderCharts()
})

function btnClass(mode: GroupBy) {
  return {
    'bg-gray-700':         groupBy.value !== mode,
    'bg-white text-black': groupBy.value === mode
  }
}
</script>



<style scoped>
canvas {
  background:   #000;
  margin-bottom: 2rem;
  width:         100% !important;
}
</style>
