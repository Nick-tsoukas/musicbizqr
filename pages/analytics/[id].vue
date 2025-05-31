<template>
  <div class="px-6 py-8 bg-black min-h-screen">
    <h2 class="text-2xl font-bold mb-6 text-white">
      Analytics Dashboard
    </h2>

    <!-- Tabs: Link Clicks / Songs / Videos -->
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

    <!-- Range Selector: 7 days / 30 days / 90 days / 1 year -->
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

    <!-- Chart Container -->
    <div v-if="isLoading" class="text-white">
      🔄 Loading data… (check console for details)
    </div>

    <div v-else class="bg-gray-900 rounded-lg p-4 shadow-lg">
      <canvas ref="chartCanvas" class="w-full h-64"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from '#imports'
import { useStrapiClient } from '#imports'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import {
  parseISO,
  format,
  subDays
} from 'date-fns'

// 1) Register Chart.js components:
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const client = useStrapiClient()
const route = useRoute()

/** Tabs to switch between datasets */
const tabs = ['Link Clicks', 'Songs', 'Videos']
const selectedTab = ref<string>(tabs[0])

/** Time‐range options in days */
const rangeOptions: Record<number, string> = {
  7: 'Last 7 Days',
  30: 'Last 30 Days',
  90: 'Last 90 Days',
  365: 'Last 1 Year'
}
const selectedRange = ref<number>(7) // default to 7 days

/** Loading indicator */
const isLoading = ref<boolean>(true)

/** Raw fetched data from Strapi */
const rawLinkClicks = ref<any[]>([])
const rawMediaPlays = ref<any[]>([])

/** Reference to the <canvas> element */
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

/** Utility: build an array of date‐strings (yyyy-MM-dd) for the last N days */
function getLastNDates(n: number): string[] {
  const today = new Date()
  return Array.from({ length: n }, (_, i) => {
    const d = subDays(today, n - 1 - i)
    return format(d, 'yyyy-MM-dd')
  })
}

/** Utility: build an array of date‐strings for the last N calendar days */
function getDateRangeArray(rangeDays: number): string[] {
  return getLastNDates(rangeDays)
}

/** Tally link clicks by platform and date */
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

  for (const entry of clicks) {
    const { platform, timestamp, clickCount = 1 } = entry
    if (!platform || !timestamp) continue
    const day = format(parseISO(timestamp), 'yyyy-MM-dd')
    if (lastDates.includes(day)) {
      counts[platform][day] += clickCount
    }
  }

  return { platforms, counts }
}

/**
 * Tally media plays by mediaType (“song” or “video”) AND by title, for each date.
 * Returns an object:
 *    { titles: string[], countsByTitle: { [title]: { [date]: number } } }
 */
function tallyMediaPlaysByTitle(
  plays: Array<{ timestamp: string; mediaType: 'song' | 'video'; title: string }>,
  lastDates: string[],
  mediaType: 'song' | 'video'
) {
  const filtered = plays.filter((p) => p.mediaType === mediaType)
  const titles = Array.from(new Set(filtered.map((p) => p.title).filter(Boolean)))
  const countsByTitle: Record<string, Record<string, number>> = {}
  for (const t of titles) {
    countsByTitle[t] = {}
    lastDates.forEach((d) => {
      countsByTitle[t][d] = 0
    })
  }

  for (const entry of filtered) {
    const day = format(parseISO(entry.timestamp), 'yyyy-MM-dd')
    const t = entry.title
    if (titles.includes(t) && lastDates.includes(day)) {
      countsByTitle[t][day] += 1
    }
  }

  return { titles, countsByTitle }
}

/** Build a Chart.js dataset for link‐clicks (one line per platform) */
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

/** Build a Chart.js dataset for media plays by title (one line per title) */
function buildMediaPlaysDatasetByTitle(
  titles: string[],
  countsByTitle: Record<string, Record<string, number>>,
  lastDates: string[]
) {
  const palette = [
    '#3B82F6', '#EC4899', '#10B981', '#F59E0B',
    '#8B5CF6', '#EF4444', '#3F51B5', '#795548'
  ]

  return titles.map((t, idx) => {
    const color = palette[idx % palette.length]
    return {
      label: t.length > 20 ? t.slice(0, 20) + '…' : t,
      data: lastDates.map((d) => countsByTitle[t][d] || 0),
      borderColor: color,
      backgroundColor: color,
      fill: true,
      tension: 0.3,
      pointRadius: 3
    }
  })
}

/** Build chart options (common across all three charts) */
function buildChartOptions(xLabels: string[]) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: 'white',
          callback: (val: any) => {
            const iso = xLabels[val] + 'T00:00:00'
            return format(parseISO(iso), 'MM/dd')
          }
        },
        grid: { color: '#444' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: '#444' }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'white'
        },
        position: 'top' as const
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false as const,
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.formattedValue}`
          }
        }
      }
    }
  }
}

/** Primary method: rebuild (or create) Chart.js instance whenever tab/range/data changes */
function renderChart() {
  if (!chartCanvas.value) return
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const dateLabels = getDateRangeArray(selectedRange.value)
  let datasets: any[] = []
  let chartTitle = ''

  if (selectedTab.value === 'Link Clicks') {
    const { platforms, counts } = tallyLinkClicks(rawLinkClicks.value, dateLabels)
    datasets = buildLinkClicksDataset(platforms, counts, dateLabels)
    chartTitle = `Link Clicks (Last ${selectedRange.value} Days)`
  } 
  else if (selectedTab.value === 'Songs') {
    const { titles, countsByTitle } = tallyMediaPlaysByTitle(
      rawMediaPlays.value,
      dateLabels,
      'song'
    )
    datasets = buildMediaPlaysDatasetByTitle(titles, countsByTitle, dateLabels)
    chartTitle = `Song Plays (Last ${selectedRange.value} Days)`
  } 
  else if (selectedTab.value === 'Videos') {
    const { titles, countsByTitle } = tallyMediaPlaysByTitle(
      rawMediaPlays.value,
      dateLabels,
      'video'
    )
    datasets = buildMediaPlaysDatasetByTitle(titles, countsByTitle, dateLabels)
    chartTitle = `Video Plays (Last ${selectedRange.value} Days)`
  }

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dateLabels,
      datasets
    },
    options: {
      ...buildChartOptions(dateLabels),
      plugins: {
        ...buildChartOptions(dateLabels).plugins,
        title: {
          display: true,
          text: chartTitle,
          color: 'white',
          font: { size: 18 }
        }
      }
    }
  })
}

/** WATCH both selectedTab and selectedRange; whenever they change, rerender the chart */
watch([selectedTab, selectedRange], () => {
  if (!isLoading.value) {
    renderChart()
  }
})

/** On mount, fetch both link‐clicks and media‐plays for this band */
onMounted(async () => {
  console.log('▶️ Mounted Analytics Dashboard, params =', route.params)
  const bandId = route.params.id as string

  try {
    // 1) Fetch link‐clicks for this band
    const { data: clicks } = await client(
      `/link-clicks/band/${encodeURIComponent(bandId)}`,
      {
        params: {
          populate: ['band'],
          sort: ['timestamp:desc']
        }
      }
    )
    rawLinkClicks.value = clicks
    console.log('🔗 Link Clicks:', rawLinkClicks.value)

    // 2) Fetch media‐plays for this band
    console.log(`🔍 Fetching media-plays for band/${bandId}…`)
    const { data: playsResponse } = await client('/media-plays', {
      params: {
        filters: { band: { id: bandId } },
        populate: ['band'],
        sort: ['timestamp:desc']
      }
    })
    rawMediaPlays.value = playsResponse
    console.log('🎥 Media Plays:', rawMediaPlays.value)

    // 3) Mark loading as false and wait for DOM to update before rendering
    isLoading.value = false
    await nextTick()
    renderChart()
  } catch (e) {
    console.error('❌ Error fetching analytics data:', e)
    isLoading.value = false
  }
})

</script>

<style scoped>
/* Chart container must have a fixed height for Chart.js to render correctly */
canvas {
  width: 100% !important;
  height: 300px !important;
}
</style>
