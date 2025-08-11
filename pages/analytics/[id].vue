<template>
  <div class="px-6 py-8 bg-black min-h-screen pt-[var(--header-height)]">
    <h2 class="text-2xl font-bold mb-6 text-white">Analytics Dashboard</h2>

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
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Range Selector -->
    <div class="flex space-x-2 mb-4">
      <button
        v-for="(label, days) in rangeOptions"
        :key="days"
        @click="selectedRange = Number(days)"
        :class="[
          'px-3 py-1 text-sm rounded',
          selectedRange === Number(days)
            ? 'bg-purple-500 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
        ]"
      >
        {{ label }}
      </button>
    </div>

    <!-- Date Picker (Only for Today/Hourly) -->
    <div v-if="selectedRange === 1" class="mb-6">
      <label class="text-white mr-2">Select Day:</label>
      <input
        type="date"
        v-model="selectedDate"
        class="bg-gray-800 text-white rounded px-2 py-1"
      />
    </div>

    <div v-if="isLoading" class="text-white">🔄 Loading data…</div>

    <div v-else class="space-y-8">
      <div class="bg-gray-900 rounded-lg p-4 shadow-lg">
        <canvas ref="lineChartCanvas" class="w-full h-64"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useRoute, useStrapiClient } from '#imports'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { parseISO, format, subDays, getHours } from 'date-fns'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const client = useStrapiClient()
const route = useRoute()

const tabs = ['Page Views', 'Link Clicks', 'Songs', 'Videos']
const selectedTab = ref('Page Views')
const rangeOptions = {
  1: 'Daily',
  7: 'Last 7 Days',
  30: 'Last 30 Days',
  365: 'Last 1 Year',
}
const selectedRange = ref(1)
const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))

const isLoading = ref(true)
const rawPageViews = ref([])
const rawLinkClicks = ref([])
const rawMediaPlays = ref([])

const lineChartCanvas = ref(null)
let lineChartInstance = null

function getLastNDates(n) {
  const today = new Date()
  return Array.from({ length: n }, (_, i) => {
    const d = subDays(today, n - 1 - i)
    return format(d, 'yyyy-MM-dd')
  })
}

function renderLineChart() {
  const canvas = lineChartCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let labels = []
  let datasets = []
  let title = ''
  const day = selectedDate.value

  const hourlyLabels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
  const dailyLabels = getLastNDates(selectedRange.value)

  if (selectedTab.value === 'Page Views') {
    if (selectedRange.value === 1) {
      const counts = Object.fromEntries(hourlyLabels.map((h) => [h, 0]))
      rawPageViews.value.forEach((view) => {
        const ts = view?.attributes?.timestamp
        if (!ts) return
        const date = format(parseISO(ts), 'yyyy-MM-dd')
        if (date !== day) return
        const hour = `${String(getHours(parseISO(ts))).padStart(2, '0')}:00`
        if (counts[hour] !== undefined) counts[hour]++
      })
      labels = hourlyLabels
      datasets = [
        {
          label: `Page Views (${day})`,
          data: labels.map((h) => counts[h]),
          borderColor: '#10B981',
          backgroundColor: '#10B981',
          fill: false,
          tension: 0.3,
          pointRadius: 3,
        },
      ]
      title = `Page Views (Hourly)`
    } else {
      const counts = Object.fromEntries(dailyLabels.map((d) => [d, 0]))
      rawPageViews.value.forEach((view) => {
        const ts = view?.attributes?.timestamp
        if (!ts) return
        const date = format(parseISO(ts), 'yyyy-MM-dd')
        if (counts[date] !== undefined) counts[date]++
      })
      labels = dailyLabels
      datasets = [
        {
          label: 'Page Views',
          data: labels.map((d) => counts[d]),
          borderColor: '#10B981',
          backgroundColor: '#10B981',
          fill: false,
          tension: 0.3,
          pointRadius: 3,
        },
      ]
      title = `Page Views (Last ${selectedRange.value} Days)`
    }
  }

  if (selectedTab.value === 'Link Clicks') {
    if (selectedRange.value === 1) {
      const counts = {}
      rawLinkClicks.value.forEach((item) => {
        const { platform, timestamp } = item
        const date = format(parseISO(timestamp), 'yyyy-MM-dd')
        const hour = `${String(getHours(parseISO(timestamp))).padStart(2, '0')}:00`
        if (date === day && platform) {
          counts[platform] ??= Object.fromEntries(hourlyLabels.map((h) => [h, 0]))
          counts[platform][hour]++
        }
      })
      labels = hourlyLabels
      datasets = Object.entries(counts).map(([plat, data], idx) => ({
        label: plat,
        data: labels.map((h) => data[h]),
        borderColor: ['#8B5CF6', '#EC4899', '#10B981'][idx % 3],
        backgroundColor: ['#8B5CF6', '#EC4899', '#10B981'][idx % 3],
        fill: false,
        tension: 0.3,
        pointRadius: 3,
      }))
      title = `Link Clicks (Hourly)`
    } else {
      const platforms = [...new Set(rawLinkClicks.value.map((c) => c.platform))]
      const counts = Object.fromEntries(
        platforms.map((p) => [p, Object.fromEntries(dailyLabels.map((d) => [d, 0]))])
      )
      rawLinkClicks.value.forEach((c) => {
        const date = format(parseISO(c.timestamp), 'yyyy-MM-dd')
        if (counts[c.platform]?.[date] !== undefined) {
          counts[c.platform][date]++
        }
      })
      labels = dailyLabels
      datasets = platforms.map((p, idx) => ({
        label: p,
        data: labels.map((d) => counts[p][d]),
        borderColor: ['#8B5CF6', '#EC4899', '#10B981'][idx % 3],
        backgroundColor: ['#8B5CF6', '#EC4899', '#10B981'][idx % 3],
        fill: false,
        tension: 0.3,
        pointRadius: 3,
      }))
      title = `Link Clicks (Last ${selectedRange.value} Days)`
    }
  }

  if (selectedTab.value === 'Songs' || selectedTab.value === 'Videos') {
    const type = selectedTab.value === 'Songs' ? 'song' : 'video'
    const filtered = rawMediaPlays.value.filter((m) => m.mediaType === type)
    if (selectedRange.value === 1) {
      const counts = {}
      filtered.forEach((m) => {
        const hour = `${String(getHours(parseISO(m.timestamp))).padStart(2, '0')}:00`
        const date = format(parseISO(m.timestamp), 'yyyy-MM-dd')
        if (date === day) {
          counts[m.title] ??= Object.fromEntries(hourlyLabels.map((h) => [h, 0]))
          counts[m.title][hour]++
        }
      })
      labels = hourlyLabels
      datasets = Object.entries(counts).map(([title, data], idx) => ({
        label: title,
        data: labels.map((h) => data[h]),
        borderColor: ['#3B82F6', '#EC4899', '#10B981'][idx % 3],
        backgroundColor: ['#3B82F6', '#EC4899', '#10B981'][idx % 3],
        fill: false,
        tension: 0.3,
        pointRadius: 3,
      }))
      title = `${selectedTab.value} Plays (Hourly)`
    } else {
      const titles = [...new Set(filtered.map((m) => m.title))]
      const counts = Object.fromEntries(
        titles.map((t) => [t, Object.fromEntries(dailyLabels.map((d) => [d, 0]))])
      )
      filtered.forEach((m) => {
        const date = format(parseISO(m.timestamp), 'yyyy-MM-dd')
        if (counts[m.title]?.[date] !== undefined) {
          counts[m.title][date]++
        }
      })
      labels = dailyLabels
      datasets = titles.map((t, idx) => ({
        label: t,
        data: labels.map((d) => counts[t][d]),
        borderColor: ['#3B82F6', '#EC4899', '#10B981'][idx % 3],
        backgroundColor: ['#3B82F6', '#EC4899', '#10B981'][idx % 3],
        fill: false,
        tension: 0.3,
        pointRadius: 3,
      }))
      title = `${selectedTab.value} Plays (Last ${selectedRange.value} Days)`
    }
  }

  lineChartInstance?.destroy()
  lineChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: 'white' }, grid: { color: '#444' } },
        y: { ticks: { color: 'white' }, grid: { color: '#444' }, beginAtZero: true },
      },
      plugins: {
        legend: { labels: { color: 'white' } },
        title: { display: true, text: title, color: 'white', font: { size: 18 } },
      },
    },
  })
}

async function fetchAndRender() {
  isLoading.value = true

  const [viewsRes, clicksRes, mediaRes] = await Promise.all([
    client('/band-page-views', {
      params: { filters: { band: { id: route.params.id } }, sort: ['timestamp:desc'] },
    }),
    client(`/link-clicks/band/${route.params.id}`),
    client('/media-plays', {
      params: { filters: { band: { id: route.params.id } }, sort: ['timestamp:desc'] },
    }),
  ])

  rawPageViews.value = viewsRes.data
  rawLinkClicks.value = clicksRes.data
  rawMediaPlays.value = mediaRes.data

  isLoading.value = false
  await nextTick()
  renderLineChart()
}

onMounted(fetchAndRender)
watch([selectedTab, selectedRange, selectedDate], () => {
  if (!isLoading.value) renderLineChart()
})
onBeforeUnmount(() => {
  lineChartInstance?.destroy()
})
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 600px !important;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1); /* makes black icons white */
}
</style>
