<template>
  <div class="bg-black text-white min-h-screen mx-auto p-4 max-w-5xl">
    <h1 class="text-2xl font-bold mb-4">Analytics Dashboard</h1>

    <!-- 1) Tab Bar -->
    <div class="flex space-x-4 border-b border-gray-700 mb-6">
      <button
        @click="view = 'links'"
        :class="{ 'border-b-2 border-white': view==='links' }"
        class="px-4 py-2"
      >Links</button>
      <button
        @click="view = 'songs'"
        :class="{ 'border-b-2 border-white': view==='songs' }"
        class="px-4 py-2"
      >Songs</button>
      <button
        @click="view = 'videos'"
        :class="{ 'border-b-2 border-white': view==='videos' }"
        class="px-4 py-2"
      >Videos</button>
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
        @click="groupBy='daily'"
        :class="btnClass('daily')"
        class="px-2 py-1 rounded"
      >Daily</button>
      <button
        @click="groupBy='monthly'"
        :class="btnClass('monthly')"
        class="px-2 py-1 rounded"
      >Monthly</button>
      <button
        @click="groupBy='yearly'"
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

type View    = 'links' | 'songs' | 'videos'
type GroupBy = 'daily' | 'weekly' | 'monthly' | 'yearly'

const route = useRoute()
const config = useRuntimeConfig()
const bandId = route.params.id as string

// --- STATE ---
const view          = ref<View>('links')
const groupBy       = ref<GroupBy>('daily')
const selectedMedia = ref<'all' | number>('all')
const mediaList     = ref<{ id: number; title: string }[]>([])
const linkClicks    = ref<any[]>([])
const mediaPlays    = ref<{ id: number; title: string; timestamp: string }[]>([])

// --- FETCH FUNCTIONS ---
async function fetchLinkClicks() {
  const res  = await fetch(`${config.public.strapiUrl}/api/link-clicks/band/${bandId}`)
  const json = await res.json()
  linkClicks.value = Array.isArray(json.data) ? json.data : []
  console.log('[fetchLinkClicks] →', linkClicks.value)
}

async function fetchMediaList() {
  const songUrl  = `${config.public.strapiUrl}/api/media-plays?filters[band]=${bandId}&filters[mediaType]=song&pagination[pageSize]=1000`
  const videoUrl = `${config.public.strapiUrl}/api/media-plays?filters[band]=${bandId}&filters[mediaType]=video&pagination[pageSize]=1000`
  console.log('[fetchMediaList] songUrl →', songUrl)
  console.log('[fetchMediaList] videoUrl →', videoUrl)

  try {
    const [sRes, vRes] = await Promise.all([fetch(songUrl), fetch(videoUrl)])
    console.log('[fetchMediaList] sRes.ok?', sRes.ok, 'vRes.ok?', vRes.ok)

    const [sJson, vJson] = await Promise.all([sRes.json(), vRes.json()])
    console.log('[fetchMediaList] sJson →', sJson)
    console.log('[fetchMediaList] vJson →', vJson)

    if (!Array.isArray(sJson.data) || !Array.isArray(vJson.data)) {
      throw new Error('Unexpected data format')
    }

    mediaList.value = [
      ...sJson.data.map((m: any) => {
        console.log('[fetchMediaList] song item →', m)
        return { id: m.id, title: m.attributes?.title ?? m.title }
      }),
      ...vJson.data.map((m: any) => {
        console.log('[fetchMediaList] video item →', m)
        return { id: m.id, title: m.attributes?.title ?? m.title }
      }),
    ]

    console.log('[fetchMediaList] final mediaList →', mediaList.value)
  } catch (err: any) {
    console.error('[fetchMediaList] failed:', err.message || err)
    mediaList.value = []
  }
}

async function fetchMediaPlays() {
  const type  = view.value === 'songs' ? 'song' : 'video'
  const extra = selectedMedia.value === 'all' ? '' : `&filters[id]=${selectedMedia.value}`
  const url   = `${config.public.strapiUrl}/api/media-plays?filters[band]=${bandId}&filters[mediaType]=${type}${extra}&pagination[pageSize]=1000`
  console.log('[fetchMediaPlays] URL →', url)

  try {
    const res  = await fetch(url)
    console.log('[fetchMediaPlays] res.ok?', res.ok)

    const json = await res.json()
    console.log('[fetchMediaPlays] json →', json)

    if (!Array.isArray(json.data)) {
      throw new Error('Unexpected data format')
    }

    mediaPlays.value = json.data.map((m: any) => {
      console.log('[fetchMediaPlays] raw item →', m)
      const title     = m.attributes?.title     ?? m.title
      const timestamp = m.attributes?.timestamp ?? m.timestamp
      return { id: m.id, title, timestamp }
    })

    console.log('[fetchMediaPlays] final mediaPlays →', mediaPlays.value)
  } catch (err: any) {
    console.error('[fetchMediaPlays] failed:', err.message || err)
    mediaPlays.value = []
  }
}

// --- HELPERS ---
function formatLabel(raw: string): string {
  if (groupBy.value === 'monthly') {
    const [y,m] = raw.split('-')
    return new Date(+y, +m-1).toLocaleDateString('en-US',{ month:'short',year:'numeric' })
  }
  if (groupBy.value === 'yearly') return raw
  if (groupBy.value === 'weekly') return raw.replace('-', ' Week ')
  return raw.includes('-')
    ? new Date(raw).toLocaleDateString('en-US',{ month:'short',day:'numeric' })
    : `${raw}:00`
}

// --- AGGREGATIONS ---
const timeSeriesData = computed(() => {
  const arr = view.value === 'links' ? linkClicks.value : mediaPlays.value

  // DAILY
  if (groupBy.value === 'daily') {
    const counts = Array(24).fill(0)
    arr.forEach((evt: any) => {
      const ts = new Date(evt.timestamp)
      counts[ts.getHours()] += view.value === 'links' ? evt.clickCount : 1
    })
    return { labels: counts.map((_,i) => String(i).padStart(2,'0')), data: counts }
  }

  // WEEKLY
  if (groupBy.value === 'weekly') {
    const groups: Record<string,number> = {}
    arr.forEach((evt: any) => {
      const d = new Date(evt.timestamp)
      const w = Math.ceil((((d.getTime() - new Date(d.getFullYear(),0,1).getTime())/86400000) +
                new Date(d.getFullYear(),0,1).getDay()+1)/7)
      const key = `${d.getFullYear()}-${String(w).padStart(2,'0')}`
      groups[key] = (groups[key]||0) + (view.value==='links' ? evt.clickCount : 1)
    })
    const sorted = Object.keys(groups).sort()
    return { labels: sorted, data: sorted.map(k => groups[k]) }
  }

  // MONTHLY / YEARLY
  const groups: Record<string,number> = {}
  arr.forEach((evt: any) => {
    const d   = new Date(evt.timestamp)
    const key = groupBy.value==='monthly'
      ? d.toISOString().slice(0,7)
      : String(d.getFullYear())
    groups[key] = (groups[key]||0) + (view.value==='links' ? evt.clickCount : 1)
  })
  const sorted = Object.keys(groups).sort()
  return { labels: sorted, data: sorted.map(k => groups[k]) }
})

const distributionData = computed(() => {
  const arr = view.value === 'links' ? linkClicks.value : mediaPlays.value
  const counts: Record<string,number> = {}
  arr.forEach((evt: any) => {
    const cat = view.value==='links' ? evt.platform : evt.title
    const inc = view.value==='links' ? evt.clickCount : 1
    counts[cat] = (counts[cat]||0) + inc
  })
  const labels = Object.keys(counts)
  return { labels, data: labels.map(l => counts[l]) }
})

// --- CHART DRAWERS ---
function drawLine(ctx: CanvasRenderingContext2D, series:any, label:string) {
  return new Chart(ctx, {
    type:'line',
    data:{ labels: series.labels.map(formatLabel), datasets:[{
      label, data:series.data,
      borderColor:'rgba(124,58,237,1)',
      backgroundColor:'rgba(124,58,237,0.2)',
      borderWidth:3, pointRadius:4, fill:true
    }]},
    options:{
      scales:{
        x:{ ticks:{ color:'#fff' }, grid:{ color:'#333' } },
        y:{ ticks:{ color:'#fff' }, grid:{ color:'#333' } }
      },
      plugins:{
        tooltip:{ backgroundColor:'#222', titleColor:'#fff', bodyColor:'#fff' },
        legend:{ labels:{ color:'#fff' } }
      }
    }
  })
}

function drawBar(ctx: CanvasRenderingContext2D, dist:any, label:string) {
  return new Chart(ctx,{
    type:'bar',
    data:{
      labels: dist.labels.map(formatLabel),
      datasets:[{
        label, data:dist.data,
        backgroundColor:'rgba(124,58,237,0.8)',
        borderColor:'rgba(124,58,237,1)',
        borderWidth:1, barThickness:24
      }]
    },
    options:{
      scales:{
        x:{ ticks:{ color:'#fff' }, grid:{ display:false } },
        y:{ ticks:{ color:'#fff' }, grid:{ color:'#333' } }
      },
      plugins:{ legend:{ labels:{ color:'#fff' } } }
    }
  })
}

function drawPie(ctx: CanvasRenderingContext2D, dist:any) {
  return new Chart(ctx,{
    type:'pie',
    data:{
      labels:dist.labels,
      datasets:[{
        data:dist.data,
        backgroundColor:[
          'rgba(124,58,237,0.8)',
          'rgba(99,102,241,0.8)',
          'rgba(236,72,153,0.8)',
          'rgba(16,185,129,0.8)',
          'rgba(253,224,71,0.8)'
        ],
        borderColor:'#000', borderWidth:1
      }]
    },
    options:{
      plugins:{
        legend:{ labels:{ color:'#fff' } },
        tooltip:{ backgroundColor:'#222', titleColor:'#fff', bodyColor:'#fff' }
      }
    }
  })
}

let charts: Chart[] = []
function destroyCharts() { charts.forEach(c => c.destroy()); charts = [] }

async function renderCharts() {
  await nextTick()
  destroyCharts()
  if (view.value === 'links') {
    charts.push(drawBar(
      (document.getElementById('barChart') as HTMLCanvasElement).getContext('2d')!,
      distributionData.value, 'Clicks by Platform'
    ))
    charts.push(drawLine(
      (document.getElementById('lineChart') as HTMLCanvasElement).getContext('2d')!,
      timeSeriesData.value, 'Clicks Over Time'
    ))
    charts.push(drawPie(
      (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d')!,
      distributionData.value
    ))
  } else {
    charts.push(drawLine(
      (document.getElementById('mediaLineChart') as HTMLCanvasElement).getContext('2d')!,
      timeSeriesData.value,
      `${view.value==='songs'?'Song':'Video'} Plays Over Time`
    ))
    charts.push(drawBar(
      (document.getElementById('mediaBarChart') as HTMLCanvasElement).getContext('2d')!,
      distributionData.value,
      `${view.value==='songs'?'Song':'Video'} Play Counts`
    ))
    charts.push(drawPie(
      (document.getElementById('mediaPieChart') as HTMLCanvasElement).getContext('2d')!,
      distributionData.value
    ))
  }
}

// --- WATCH & MOUNT ---
watch([view, groupBy, selectedMedia], async () => {
  if (view.value !== 'links') await fetchMediaPlays()
  await renderCharts()
})

onMounted(async () => {
  await fetchLinkClicks()
  await fetchMediaList()
  await fetchMediaPlays()
  await renderCharts()
})

// --- BUTTON CLASSES ---
function btnClass(mode: GroupBy) {
  return {
    'bg-gray-700':         groupBy.value !== mode,
    'bg-white text-black': groupBy.value === mode,
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
