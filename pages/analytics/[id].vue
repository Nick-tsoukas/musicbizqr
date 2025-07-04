<template>
  <div class="px-6 py-8 bg-black min-h-screen pt-[var(--header-height)]">
    <h2 class="text-2xl font-bold mb-6 text-white">
      Analytics Dashboard
    </h2>

    <!-- Tabs -->
    <div class="flex space-x-4 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="selectedTab = tab"
        :class="[
          'px-4 py-2 font-medium rounded',
          selectedTab === tab
            ? 'bg-purple-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Range Selector -->
    <div class="flex space-x-2 mb-8">
      <button
        v-for="(label, days) in rangeOptions"
        :key="days"
        @click="selectedRange = Number(days)"
        :class="[
          'px-3 py-1 text-sm rounded',
          selectedRange === Number(days)
            ? 'bg-purple-500 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        ]"
      >
        {{ label }}
      </button>
    </div>

    <div v-if="isLoading" class="text-white">
      🔄 Loading data… (check console for details)
    </div>

    <div v-else class="space-y-8">
      <!-- Line Chart -->
      <div class="bg-gray-900 rounded-lg p-4 shadow-lg">
        <canvas ref="lineChartCanvas" class="w-full h-64"></canvas>
      </div>
      <!-- Bar Chart -->
      <div class="bg-gray-900 rounded-lg p-4 shadow-lg">
        <h3 class="text-lg font-medium text-white mb-2">
          Total Clicks by Platform
        </h3>
        <canvas ref="barChartCanvas" class="w-full h-64"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useStrapiClient } from '#imports'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { parseISO, format, subDays } from 'date-fns'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler
)

const client = useStrapiClient()
const route = useRoute()

const tabs = ['Link Clicks', 'Songs', 'Videos']
const selectedTab = ref<string>(tabs[0])

const rangeOptions: Record<number, string> = {
  7: 'Last 7 Days',
  30: 'Last 30 Days',
  90: 'Last 90 Days',
  365: 'Last 1 Year'
}
const selectedRange = ref<number>(7)

const isLoading = ref<boolean>(true)
const rawLinkClicks = ref<any[]>([])
const rawMediaPlays = ref<any[]>([])

const lineChartCanvas = ref<HTMLCanvasElement | null>(null)
const barChartCanvas = ref<HTMLCanvasElement | null>(null)
let lineChartInstance: Chart | null = null
let barChartInstance: Chart | null = null

function getLastNDates(n: number): string[] {
  const today = new Date()
  return Array.from({ length: n }, (_, i) => {
    const d = subDays(today, n - 1 - i)
    return format(d, 'yyyy-MM-dd')
  })
}

function getDateRangeArray(rangeDays: number): string[] {
  return getLastNDates(rangeDays)
}

function tallyLinkClicks(
  clicks: Array<{ timestamp: string; platform: string; clickCount?: number }>,
  lastDates: string[]
) {
  const platforms = Array.from(
    new Set(clicks.map((e) => e.platform).filter(Boolean))
  )
  const counts: Record<string, Record<string, number>> = {}
  platforms.forEach((plat) => {
    counts[plat] = {}
    lastDates.forEach((day) => {
      counts[plat][day] = 0
    })
  })
  for (const { platform, timestamp, clickCount = 1 } of clicks) {
    if (!platform || !timestamp) continue
    const day = format(parseISO(timestamp), 'yyyy-MM-dd')
    if (lastDates.includes(day)) {
      counts[platform][day] += clickCount
    }
  }
  return { platforms, counts }
}

function tallyMediaPlaysByTitle(
  plays: Array<{ timestamp: string; mediaType: 'song' | 'video'; title: string }>,
  lastDates: string[],
  mediaType: 'song' | 'video'
) {
  const filtered = plays.filter((p) => p.mediaType === mediaType)
  const titles = Array.from(new Set(filtered.map((p) => p.title).filter(Boolean)))
  const countsByTitle: Record<string, Record<string, number>> = {}
  titles.forEach((t) => {
    countsByTitle[t] = {}
    lastDates.forEach((d) => { countsByTitle[t][d] = 0 })
  })
  for (const { timestamp, title } of filtered) {
    const day = format(parseISO(timestamp), 'yyyy-MM-dd')
    if (titles.includes(title) && lastDates.includes(day)) {
      countsByTitle[title][day] += 1
    }
  }
  return { titles, countsByTitle }
}

function buildLinkClicksDataset(
  platforms: string[],
  counts: Record<string, Record<string, number>>,
  lastDates: string[]
) {
  const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444']
  return platforms.map((plat, idx) => ({
    label: plat,
    data: lastDates.map((d) => counts[plat][d] || 0),
    borderColor: colors[idx % colors.length],
    backgroundColor: colors[idx % colors.length],
    fill: false,
    tension: 0.3,
    pointRadius: 3
  }))
}

function buildMediaPlaysDatasetByTitle(
  titles: string[],
  countsByTitle: Record<string, Record<string, number>>,
  lastDates: string[]
) {
  const palette = [
    '#3B82F6', '#EC4899', '#10B981', '#F59E0B',
    '#8B5CF6', '#EF4444', '#3F51B5', '#795548'
  ]
  return titles.map((t, idx) => ({
    label: t.length > 20 ? t.slice(0, 20) + '…' : t,
    data: lastDates.map((d) => countsByTitle[t][d] || 0),
    borderColor: palette[idx % palette.length],
    backgroundColor: palette[idx % palette.length],
    fill: true,
    tension: 0.3,
    pointRadius: 3
  }))
}

function buildChartOptions(xLabels: string[]) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: 'white' }, grid: { color: '#444' } },
      y: { ticks: { color: 'white' }, grid: { color: '#444' } }
    },
    plugins: {
      legend: { labels: { color: 'white' }, position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.formattedValue}`
        }
      }
    }
  }
}

function computePlatformTotals(clicks: Array<{ platform?: string; clickCount?: number }>) {
  const totals: Record<string, number> = {}
  clicks.forEach(({ platform = 'Unknown', clickCount = 1 }) => {
    totals[platform] = (totals[platform] || 0) + clickCount
  })
  const labels = Object.keys(totals)
  const data = labels.map((l) => totals[l])
  return { labels, data }
}

function renderLineChart() {
  const canvas = lineChartCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dateLabels = getDateRangeArray(selectedRange.value)
  let datasets: any[] = []
  let title = ''

  if (selectedTab.value === 'Link Clicks') {
    const { platforms, counts } = tallyLinkClicks(rawLinkClicks.value, dateLabels)
    datasets = buildLinkClicksDataset(platforms, counts, dateLabels)
    title = `Link Clicks (Last ${selectedRange.value} Days)`
  } else {
    const mediaType = selectedTab.value === 'Songs' ? 'song' : 'video'
    const { titles, countsByTitle } = tallyMediaPlaysByTitle(rawMediaPlays.value, dateLabels, mediaType)
    datasets = buildMediaPlaysDatasetByTitle(titles, countsByTitle, dateLabels)
    title = `${selectedTab.value} Plays (Last ${selectedRange.value} Days)`
  }

  lineChartInstance?.destroy()
  lineChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels: dateLabels, datasets },
    options: {
      ...buildChartOptions(dateLabels),
      plugins: {
        ...buildChartOptions(dateLabels).plugins,
        title: { display: true, text: title, color: 'white', font: { size: 18 } }
      }
    }
  })
}

function renderBarChart() {
  const canvas = barChartCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { labels, data } = computePlatformTotals(rawLinkClicks.value)
  barChartInstance?.destroy()
  barChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Total Clicks', data }] },
    options: {
      ...buildChartOptions(labels),
      plugins: {
        ...buildChartOptions(labels).plugins,
        title: { display: true, text: 'Total Clicks by Platform', color: 'white', font: { size: 18 } }
      },
      scales: {
        x: {
          ...buildChartOptions(labels).scales.x,
          ticks: { ...buildChartOptions(labels).scales.x.ticks, callback: (v: any) => labels[v], maxRotation: 45, minRotation: 45 }
        },
        y: { ...buildChartOptions(labels).scales.y, beginAtZero: true }
      }
    }
  })
}

async function fetchAndRender() {
  isLoading.value = true

  // 1) Fetch link-clicks
  const { data: clicks } = await client(
    `/link-clicks/band/${encodeURIComponent(route.params.id as string)}`,
    { params: { populate: ['band'], sort: ['timestamp:desc'] } }
  )
  rawLinkClicks.value = clicks

  // 2) Fetch media plays
  const { data: plays } = await client('/media-plays', {
    params: { filters: { band: { id: route.params.id } }, populate: ['band'], sort: ['timestamp:desc'] }
  })
  rawMediaPlays.value = plays

  isLoading.value = false

  // Wait for the DOM (v-if swap + canvases)
  await nextTick()
  await nextTick()

  renderLineChart()
  renderBarChart()
}

onMounted(fetchAndRender)
watch(() => route.params.id, fetchAndRender)
onBeforeUnmount(() => {
  lineChartInstance?.destroy()
  barChartInstance?.destroy()
})
watch([selectedTab, selectedRange], () => {
  if (!isLoading.value) renderLineChart()
})
watch(rawLinkClicks, () => {
  if (!isLoading.value) renderBarChart()
})
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 600px !important;
}
</style>
