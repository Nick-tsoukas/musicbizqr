<template>
  <div
    class="bg-black pt-[var(--header-height)] text-white min-h-screen mx-auto p-4 w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-3xl"
  >
    <h1 class="text-2xl font-bold mb-4">QR Scans Analytics</h1>

    <div v-if="!isLoading" class="text-xl font-semibold mb-6 space-y-2">
      <p>Total Scans (All Time): <span class="text-purple-400">{{ totalScans }}</span></p>
      <p>Avg Scans/Day (last {{ selectedRange }}d): <span class="text-purple-400">{{ averageScansPerDay }}</span></p>
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
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
        ]"
      >
        {{ label }}
      </button>
      <button
        @click="viewToday = true"
        class="px-3 py-1 text-sm rounded bg-teal-600 text-white hover:bg-teal-500"
      >
        View Today (Hourly)
      </button>
    </div>

    <div v-if="isLoading" class="text-white">🔄 Loading data…</div>

    <div v-else class="space-y-8">
      <!-- Line Chart -->
      <div class="bg-gray-900 rounded-lg p-4 shadow-lg">
        <canvas ref="chartCanvas" class="w-full h-64"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { useRoute, useRuntimeConfig } from "#imports";
import { Chart, registerables } from "chart.js";
import { format, subDays } from "date-fns";

Chart.register(...registerables);

const route = useRoute();
const config = useRuntimeConfig();
const qrId = route.params.id as string;

const selectedRange = ref<number>(7);
const viewToday = ref(false);

const rangeOptions: Record<number, string> = {
  7: "Last 7 Days",
  30: "Last 30 Days",
  90: "Last 90 Days",
  365: "Last 1 Year",
};

const isLoading = ref(true);
const analyticsData = ref<any[]>([]);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

function getLastNDates(n: number): string[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = subDays(today, n - 1 - i);
    return format(d, "yyyy-MM-dd");
  });
}

async function fetchAnalyticsData() {
  try {
    const res = await fetch(
      `${config.public.strapiUrl}/api/scans?filters[qr][id][$eq]=${qrId}&pagination[pageSize]=1000`
    );
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    analyticsData.value = json.data || [];
  } catch (err) {
    console.error("Error fetching scan data:", err);
  }
}

const totalScans = computed(() => analyticsData.value.length);

const averageScansPerDay = computed(() => {
  const { data } = buildTimeSeries();
  const total = data.reduce((sum, n) => sum + n, 0);
  return (total / selectedRange.value).toFixed(2);
});

function buildTimeSeries() {
  if (viewToday.value) return buildHourlySeries();

  const lastDates = getLastNDates(selectedRange.value);
  const counts: Record<string, number> = Object.fromEntries(
    lastDates.map((d) => [d, 0])
  );

  analyticsData.value.forEach((scan) => {
    const dateStr = scan.attributes.createdAt.slice(0, 10);
    if (counts[dateStr] !== undefined) counts[dateStr]++;
  });

  const labels = lastDates.map((d) => format(new Date(d), "MMM d, yyyy"));
  const data = lastDates.map((d) => counts[d]);
  return { labels, data };
}

function buildHourlySeries() {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const counts: Record<number, number> = Object.fromEntries(
    hours.map((_, h) => [h, 0])
  );

  analyticsData.value.forEach((scan) => {
    const timestamp = scan.attributes.createdAt;
    if (timestamp.startsWith(todayStr)) {
      const hour = new Date(timestamp).getHours();
      counts[hour]++;
    }
  });

  const labels = hours;
  const data = hours.map((_, i) => counts[i]);
  return { labels, data };
}

function renderChart() {
  const { labels, data } = buildTimeSeries();
  const ctx = chartCanvas.value?.getContext("2d");
  if (!ctx) return;

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Scans",
          data,
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139,92,246,0.3)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: "white", autoSkip: true },
          grid: { color: "#444" },
        },
        y: {
          beginAtZero: true,
          ticks: { color: "white", stepSize: 1 },
          grid: { color: "#444" },
        },
      },
      plugins: {
        legend: { labels: { color: "white" }, position: "top" },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue}`,
          },
        },
      },
    },
  });
}

async function fetchAndRender() {
  isLoading.value = true;
  await fetchAnalyticsData();
  isLoading.value = false;
  await nextTick();
  renderChart();
}

onMounted(fetchAndRender);
watch([selectedRange, viewToday], () => {
  if (!isLoading.value) renderChart();
});
onBeforeUnmount(() => {
  chartInstance?.destroy();
});
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 600px !important;
  background-color: #000;
  border: 1px solid #444;
}
</style>
