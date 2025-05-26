<template>
  <div class="bg-black text-white min-h-screen mx-auto p-4 max-w-5xl">
    <h1 class="text-2xl font-bold mb-4">Analytics Dashboard</h1>

    <!-- 1) Tab Bar -->
    <div class="flex space-x-4 border-b border-gray-700 mb-6">
      <button
        @click="view = 'links'"
        :class="{'border-b-2 border-white': view==='links'}"
        class="px-4 py-2"
      >Links</button>
      <button
        @click="view = 'songs'"
        :class="{'border-b-2 border-white': view==='songs'}"
        class="px-4 py-2"
      >Songs</button>
      <button
        @click="view = 'videos'"
        :class="{'border-b-2 border-white': view==='videos'}"
        class="px-4 py-2"
      >Videos</button>
    </div>

    <!-- 2) Filters (only for Songs/Videos) -->
    <div v-if="view !== 'links'" class="flex items-center space-x-4 mb-8">
      <label class="whitespace-nowrap">Media:</label>
      <select v-model="selectedMedia" class="bg-gray-800 px-2 py-1 rounded">
        <option value="all">All</option>
        <option v-for="m in mediaList" :key="m.id" :value="m.id">
          {{ m.title }}
        </option>
      </select>

      <label class="whitespace-nowrap">Group by:</label>
      <button
        v-for="mode in ['daily','monthly','yearly']"
        :key="mode"
        @click="groupBy = mode"
        :class="btnClass(mode)"
        class="px-2 py-1 rounded"
      >{{ mode.charAt(0).toUpperCase() + mode.slice(1) }}</button>
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
          {{ view==='songs' ? 'Song' : 'Video' }} Plays Over Time (Line)
        </h2>
        <canvas id="mediaLineChart"></canvas>
      </section>
      <section class="mb-12">
        <h2 class="text-xl mb-2">
          {{ view==='songs' ? 'Song' : 'Video' }} Play Counts (Bar)
        </h2>
        <canvas id="mediaBarChart"></canvas>
      </section>
      <section>
        <h2 class="text-xl mb-2">
          {{ view==='songs' ? 'Song' : 'Video' }} Distribution (Pie)
        </h2>
        <canvas id="mediaPieChart"></canvas>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { Chart } from 'chart.js/auto'

type View = 'links' | 'songs' | 'videos'
type GroupBy = 'daily' | 'monthly' | 'yearly'

const route        = useRoute()
const config       = useRuntimeConfig()
const bandId       = route.params.id as string

// --- STATE ---
const view          = ref<View>('links')
const groupBy       = ref<GroupBy>('daily')
const selectedMedia = ref<'all' | number>('all')
const mediaList     = ref<{ id: number; title: string }[]>([])
const linkClicks    = ref<any[]>([])
const mediaPlays    = ref<any[]>([])

// --- FETCH FUNCTIONS ---
async function fetchLinkClicks() {
  const res  = await fetch(`${config.public.strapiUrl}/api/link-clicks/band/${bandId}`)
  const json = await res.json()
  linkClicks.value = json.data || []
}

// replace your existing fetchMediaList and fetchMediaPlays with these:

async function fetchMediaList() {
  // pull all songs & videos so you can build your “mediaList” dropdown
  const [songsRes, videosRes] = await Promise.all([
    fetch(
      `${config.public.strapiUrl}/api/media-plays?` +
      `filters[band][id][$eq]=${bandId}&` +
      `filters[mediaType][$eq]=song&` +
      `pagination[pageSize]=1000`
    ),
    fetch(
      `${config.public.strapiUrl}/api/media-plays?` +
      `filters[band][id][$eq]=${bandId}&` +
      `filters[mediaType][$eq]=video&` +
      `pagination[pageSize]=1000`
    )
  ]);

  if (!songsRes.ok || !videosRes.ok) {
    console.error('Failed to load media list:', songsRes.status, videosRes.status);
    return;
  }

  const songsJson  = await songsRes.json();
  const videosJson = await videosRes.json();

  mediaList.value = [
    ...songsJson.data.map((m: any) => ({ id: m.id, title: m.attributes.title })),
    ...videosJson.data.map((m: any) => ({ id: m.id, title: m.attributes.title }))
  ];
}

async function fetchMediaPlays() {
  // now fetch plays for the currently selected media (or all)
  const type     = view.value === 'songs' ? 'song' : 'video';
  const filterId = selectedMedia.value === 'all'
    ? ''
    : `&filters[id][$eq]=${selectedMedia.value}`;
  const res = await fetch(
    `${config.public.strapiUrl}/api/media-plays?` +
    `filters[band][id][$eq]=${bandId}&` +
    `filters[mediaType][$eq]=${type}` +
    filterId +
    `&pagination[pageSize]=1000`
  );

  if (!res.ok) {
    console.error('Failed to load media plays:', res.status);
    mediaPlays.value = [];
    return;
  }

  const json = await res.json();
  mediaPlays.value = json.data;
}


// --- HELPERS ---
function formatLabel(raw:string) {
  // daily -> "Jan 25 2025", monthly -> "Jan 2025", yearly -> "2025"
  if (groupBy.value === 'daily') {
    const d = new Date(raw)
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
  }
  if (groupBy.value === 'monthly') {
    const [y,m] = raw.split('-')
    const d = new Date(+y, +m-1)
    return d.toLocaleDateString('en-US', { month:'short', year:'numeric' })
  }
  return raw
}

const timeSeriesData = computed(() => {
  const arr = view.value==='links' ? linkClicks.value : mediaPlays.value
  const groups: Record<string, number> = {}
  arr.forEach(evt => {
    const ts = new Date(evt.attributes?.timestamp || evt.timestamp)
    let key = ''
    if (groupBy.value==='daily')   key = ts.toISOString().slice(0,10)
    if (groupBy.value==='monthly') key = ts.toISOString().slice(0,7)
    if (groupBy.value==='yearly')  key = String(ts.getFullYear())
    groups[key] = (groups[key]||0) + (view.value==='links' ? evt.clickCount : 1)
  })
  const sorted = Object.keys(groups).sort()
  return {
    labels: sorted.map(formatLabel),
    data:   sorted.map(k=>groups[k])
  }
})

const distributionData = computed(() => {
  const arr = view.value==='links' ? linkClicks.value : mediaPlays.value
  const counts: Record<string, number> = {}
  arr.forEach(evt => {
    const key = view.value==='links' ? evt.platform : evt.attributes.title
    counts[key] = (counts[key]||0) + (view.value==='links' ? evt.clickCount : 1)
  })
  const labels = Object.keys(counts)
  return { labels, data: labels.map(l=>counts[l]) }
})

// --- CHART HELPERS ---
let charts: Chart[] = []
function destroyCharts() {
  charts.forEach(c => c.destroy())
  charts = []
}
function getCtx(id:string) {
  const canvas = document.getElementById(id) as HTMLCanvasElement | null
  return canvas?.getContext('2d') ?? null
}
function drawLine(ctx:any, series:any, label:string) {
  return new Chart(ctx, { type:'line', data:{ labels:series.labels, datasets:[{ label, data:series.data, fill:true, borderWidth:2 }]}, options:{ scales:{ y:{ beginAtZero:true } } } })
}
function drawBar(ctx:any, dist:any, label:string) {
  return new Chart(ctx, { type:'bar', data:{ labels:dist.labels, datasets:[{ label, data:dist.data, borderWidth:1 }]}, options:{ scales:{ y:{ beginAtZero:true } } } })
}
function drawPie(ctx:any, dist:any) {
  return new Chart(ctx, { type:'pie', data:{ labels:dist.labels, datasets:[{ data:dist.data }] } })
}

function renderCharts() {
  destroyCharts()
  if (view.value === 'links') {
    const barCtx  = getCtx('barChart')
    const lineCtx = getCtx('lineChart')
    const pieCtx  = getCtx('pieChart')
    if (barCtx)  charts.push(drawBar(barCtx, distributionData.value, 'Clicks by Platform'))
    if (lineCtx) charts.push(drawLine(lineCtx, timeSeriesData.value, 'Clicks Over Time'))
    if (pieCtx)  charts.push(drawPie(pieCtx, distributionData.value))
  } else {
    const lineCtx = getCtx('mediaLineChart')
    const barCtx  = getCtx('mediaBarChart')
    const pieCtx  = getCtx('mediaPieChart')
    const label   = view.value === 'songs' ? 'Song' : 'Video'
    if (lineCtx) charts.push(drawLine(lineCtx, timeSeriesData.value, `${label} Plays Over Time`))
    if (barCtx)  charts.push(drawBar(barCtx, distributionData.value, `${label} Play Counts`))
    if (pieCtx)  charts.push(drawPie(pieCtx, distributionData.value))
  }
}

// --- WATCHERS ---
watch([view, groupBy, selectedMedia], async () => {
  if (view.value !== 'links') {
    await fetchMediaPlays()
  }
  await nextTick()
  renderCharts()
})

// --- INITIAL MOUNT ---
onMounted(async () => {
  await fetchLinkClicks()
  await fetchMediaList()
  await fetchMediaPlays()
  await nextTick()
  renderCharts()
})

// --- UTILS FOR BUTTON CLASSES ---
function btnClass(mode:GroupBy) {
  return {
    'bg-gray-700': groupBy.value !== mode,
    'bg-white text-black':   groupBy.value === mode
  }
}
</script>

<style scoped>
canvas {
  background: #000;
  margin-bottom: 2rem;
  width: 100% !important;
}
</style>
