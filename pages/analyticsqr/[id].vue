<template>
  <div
    class="bg-black pt-[var(--header-height)] text-white min-h-screen mx-auto p-4 w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-3xl"
  >
    <h1 class="text-2xl font-bold mb-4">QR Scans Analytics</h1>

    <div v-if="!isInitialLoading" class="text-xl font-semibold mb-6 space-y-2">
      <p>
        Total Scans (All Time):
        <span class="text-purple-400">{{ totalScans }}</span>
      </p>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap items-center gap-2 mb-8">
      <button
        v-for="(label, days) in rangeOptions"
        :key="days"
        @click="() => handleRangeClick(Number(days))"
        :class="[
          'px-3 py-1 text-sm rounded',
          selectedRange === Number(days) && !selectedDate && !viewToday
            ? 'bg-purple-500 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
        ]"
      >
        {{ label }}
      </button>

      <button
        @click="handleTodayClick"
        :class="[
          'px-3 py-1 text-sm rounded',
          viewToday && !selectedDate
            ? 'bg-teal-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
        ]"
      >
        View Today
      </button>

      <!-- Date Picker -->
      <div class="flex items-center gap-2 ml-auto">
        <input
          type="date"
          v-model="selectedDate"
          :max="todayStr"
          class="bg-gray-800 text-white text-sm px-3 py-1 rounded border border-gray-700"
          @change="handleDateChange"
        />
        <button
          v-if="selectedDate"
          @click="clearDate"
          class="px-3 py-1 text-sm rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          title="Clear selected date"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- first load -->
    <div v-if="isInitialLoading" class="text-white">🔄 Loading data…</div>

    <!-- after first load, never collapse -->
    <div v-else class="space-y-8">
      <!-- Chart card (match band style) -->
      <div class="bg-[#111827] rounded-lg p-4 shadow-lg relative">
        <!-- overlay on refresh -->
        <div
          v-if="isRefreshing"
          class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
        >
          <span class="text-gray-200 text-sm">Refreshing…</span>
        </div>

        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-semibold text-white">
            {{ chartTitle }}
          </h2>
          <span class="text-xs text-gray-400">
            {{ chartSubtitle }}
          </span>
        </div>

        <!-- same ratio box as band page -->
        <div class="chart-wrap ratio-16x9">
          <canvas ref="chartCanvas" class="chart-canvas" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { format, subDays, parseISO } from 'date-fns'

/**
 * We now match the band page:
 * - ensureChart() for lazy import
 * - prepHiDPICanvas() for sharp chart
 * - render when canvas actually exists
 */
const route = useRoute()
const config = useRuntimeConfig()
const qrId = route.params.id as string

const selectedRange = ref<number>(7)
const viewToday = ref(false)
const selectedDate = ref<string | null>(null)
const todayStr = format(new Date(), 'yyyy-MM-dd')

const rangeOptions: Record<number, string> = {
  7: 'Last 7 Days',
  30: 'Last 30 Days',
  90: 'Last 90 Days',
  365: 'Last 1 Year'
}

const isInitialLoading = ref(true)
const isRefreshing = ref(false)

const analyticsData = ref<any[]>([])

/* ---------- chart refs ---------- */
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: any = null
let ChartJs: any = null

async function ensureChart() {
  if (process.server) return null
  if (!ChartJs) {
    ChartJs = (await import('chart.js/auto')).default
  }
  return ChartJs
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

/* ---------- fetch ---------- */
async function fetchAnalyticsData() {
  const res = await fetch(
    `${config.public.strapiUrl}/api/scans?filters[qr][id][$eq]=${qrId}&pagination[pageSize]=1000`
  )
  if (!res.ok) throw new Error(`Status ${res.status}`)
  const json = await res.json()
  analyticsData.value = json.data || []
}

const totalScans = computed(() => analyticsData.value.length)

/* ---------- series builders ---------- */
function getLastNDates(n: number): string[] {
  const today = new Date()
  return Array.from({ length: n }, (_, i) => {
    const d = subDays(today, n - 1 - i)
    return format(d, 'yyyy-MM-dd')
  })
}

function buildDailySeries() {
  const lastDates = getLastNDates(selectedRange.value)
  const counts: Record<string, number> = Object.fromEntries(lastDates.map((d) => [d, 0]))

  analyticsData.value.forEach((scan) => {
    const ts: string | undefined = scan.attributes?.date ?? scan.attributes?.createdAt
    if (!ts) return
    const localKey = format(parseISO(ts), 'yyyy-MM-dd')
    if (counts[localKey] !== undefined) counts[localKey]++
  })

  const labels = lastDates.map((d) => format(new Date(d), 'MMM d'))
  const data = lastDates.map((d) => counts[d])
  return { labels, data, mode: 'daily' as const }
}

function buildHourlySeries(dayStr: string) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const counts: Record<number, number> = Object.fromEntries(hours.map((h) => [h, 0]))

  analyticsData.value.forEach((scan) => {
    const ts: string | undefined = scan.attributes?.date ?? scan.attributes?.createdAt
    if (!ts) return
    const localDayKey = format(parseISO(ts), 'yyyy-MM-dd')
    if (localDayKey === dayStr) {
      const hour = parseISO(ts).getHours()
      counts[hour] = (counts[hour] ?? 0) + 1
    }
  })

  const labels = hours.map((h) => format(new Date(2000, 0, 1, h), 'h a'))
  const data = hours.map((h) => counts[h] ?? 0)
  return { labels, data, mode: 'hourly' as const }
}

function buildTimeSeries() {
  if (selectedDate.value) return buildHourlySeries(selectedDate.value)
  if (viewToday.value) return buildHourlySeries(todayStr)
  return buildDailySeries()
}

/* ---------- UI labels ---------- */
const selectedLabel = computed(() => {
  if (selectedDate.value) return format(parseISO(selectedDate.value), 'MMM d, yyyy')
  if (viewToday.value) return 'Today'
  return rangeOptions[selectedRange.value] || `Last ${selectedRange.value} days`
})

const chartTitle = computed(() => {
  if (selectedDate.value) return 'QR Scans (Hourly)'
  if (viewToday.value) return 'QR Scans (Today, Hourly)'
  return `QR Scans (Last ${selectedRange.value} Days)`
})

const chartSubtitle = computed(() => {
  if (selectedDate.value) return selectedLabel.value
  if (viewToday.value) return format(new Date(), 'EEE, MMM d')
  return selectedLabel.value
})

/* ---------- chart render ---------- */
function renderChart() {
  if (!ChartJs) return
  const canvas = chartCanvas.value
  if (!canvas) return
  const ctx = prepHiDPICanvas(canvas)

  const series = buildTimeSeries()
  const { labels, data, mode } = series

  const datasetLabel = mode === 'hourly' ? 'Scans (per hour)' : 'Scans (per day)'

  chartInstance?.destroy()
  chartInstance = new ChartJs(ctx, {
    type: mode === 'hourly' ? 'bar' : 'line',
    data: {
      labels,
      datasets: [
        {
          label: datasetLabel,
          data,
          borderWidth: 2,
          borderColor: '#8B5CF6',
          backgroundColor: mode === 'hourly' ? '#8B5CF6' : 'rgba(139,92,246,.25)',
          tension: 0.3,
          pointRadius: mode === 'hourly' ? 0 : 3
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
          ticks: { color: '#E5E7EB', precision: 0, stepSize: 1 },
          grid: { color: '#30343b' }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#E5E7EB', usePointStyle: true, pointStyle: 'circle' },
          position: 'bottom'
        },
        title: {
          display: true,
          text: chartTitle.value,
          color: 'white',
          font: { size: 16, weight: '600' }
        },
        tooltip: {
          callbacks: {
            title(items) {
              return items[0]?.label || ''
            },
            label(ctx) {
              const v = ctx.raw as number
              return `${v} scan${v === 1 ? '' : 's'}`
            }
          }
        }
      }
    }
  })
}

/* ---------- fetch + render orchestration ---------- */
async function fetchAndRender(silent = false) {
  try {
    if (silent) {
      isRefreshing.value = true
    } else {
      isInitialLoading.value = true
    }

    await fetchAnalyticsData()
    await ensureChart()
    await nextTick()
    renderChart()
  } catch (err) {
    console.error('Error fetching scan data:', err)
  } finally {
    if (silent) {
      isRefreshing.value = false
    } else {
      isInitialLoading.value = false
    }
  }
}

/* ---------- event handlers ---------- */
function handleRangeClick(days: number) {
  selectedDate.value = null
  viewToday.value = false
  selectedRange.value = days
  fetchAndRender(true)
}

function handleTodayClick() {
  selectedDate.value = null
  viewToday.value = true
  fetchAndRender(true)
}

function handleDateChange() {
  if (selectedDate.value) {
    viewToday.value = false
  }
  fetchAndRender(true)
}

function clearDate() {
  selectedDate.value = null
  fetchAndRender(true)
}

/* ---------- lifecycle ---------- */
onMounted(async () => {
  await ensureChart()
  await fetchAndRender(false)
})

/**
 * 🔑 this is the piece that was making the band chart “just work”
 * If the canvas wasn't ready on first render, we try again as soon as it exists
 */
watch(
  () => chartCanvas.value,
  async (canvas) => {
    if (!canvas) return
    if (!isInitialLoading.value && !isRefreshing.value) {
      await ensureChart()
      renderChart()
    }
  }
)

// if user changes just the reactive filters → re-render only
watch([selectedRange, viewToday, selectedDate], async () => {
  if (!isInitialLoading.value && !isRefreshing.value) {
    await ensureChart()
    renderChart()
  }
})

onBeforeUnmount(() => {
  chartInstance?.destroy()
})
</script>

<style scoped>
.chart-wrap {
  position: relative;
  width: 100%;
}
.chart-wrap.ratio-16x9 {
  aspect-ratio: 16 / 9;
}
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
