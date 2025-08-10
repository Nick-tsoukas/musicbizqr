<template>
  <div class="px-6 py-8 bg-black min-h-screen pt-[var(--header-height)]">
    <h2 class="text-2xl font-bold mb-6 text-white">Event Analytics</h2>

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

    <!-- Date Picker for 1-day -->
    <div v-if="selectedRange === 1" class="mb-6">
      <label class="text-white mr-2">Select Day:</label>
      <input
        type="date"
        v-model="selectedDate"
        class="bg-gray-800 text-white rounded px-2 py-1"
      />
    </div>

    <!-- event title  -->

    <h3 v-if="eventTitle" class="text-xl font-semibold text-white mb-4">
      Event title : {{ eventTitle }}
    </h3>

    <!-- Chart -->
    <div v-if="!isLoading" class="bg-gray-900 rounded-lg p-4 shadow-lg">
      <canvas ref="lineChartCanvas" class="w-full h-64"></canvas>
    </div>
    <div v-else class="text-white">🔄 Loading analytics…</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import { useRoute, useStrapiClient } from "#imports";
import { parseISO, format, getHours, subDays } from "date-fns";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const route = useRoute();
const client = useStrapiClient();

const selectedRange = ref(1);
const selectedDate = ref(format(new Date(), "yyyy-MM-dd"));

const rangeOptions = {
  1: "Today",
  7: "Last 7 Days",
  30: "Last 30 Days",
  365: "Last 1 Year",
};

const eventTitle = computed(() => {
  const firstView = rawViews.value[0];
  return firstView?.attributes?.event?.data?.attributes?.title || "Event";
});

const rawViews = ref([]);
const isLoading = ref(true);
const lineChartCanvas = ref(null);
let lineChartInstance = null;

function getLastNDates(n) {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = subDays(today, n - 1 - i);
    return format(d, "yyyy-MM-dd");
  });
}

async function fetchViews() {
  isLoading.value = true;
  console.log("📡 Fetching event views for ID:", route.params.eventId);

  try {
    const { data } = await client("/event-page-views", {
      params: {
        filters: {
          event: {
            id: {
              $eq: route.params.eventId,
            },
          },
        },
        sort: ["timestamp:desc"],
        populate: "event",
      },
    });

    console.log("✅ Filtered event views:", data);
    rawViews.value = data;
  } catch (err) {
    console.error(
      "❌ Error fetching filtered event views:",
      err?.response || err
    );
  } finally {
    isLoading.value = false;

    // Wait for canvas to be visible in DOM
    await nextTick();
    await nextTick();

    renderChart();
  }
}

function renderChart() {
  const ctx = lineChartCanvas.value?.getContext("2d");
  if (!ctx) {
    console.error("❌ [renderChart] Could not get canvas context");
    return;
  }

  console.log("📊 [renderChart] Selected range:", selectedRange.value);
  console.log("📊 [renderChart] Selected date:", selectedDate.value);
  console.log("📊 [renderChart] Raw views count:", rawViews.value.length);

  let labels = [];
  let dataPoints = [];
  let title = "";

  if (selectedRange.value === 1) {
    labels = Array.from(
      { length: 24 },
      (_, i) => `${String(i).padStart(2, "0")}:00`
    );
    const day = selectedDate.value;
    const counts = labels.reduce((acc, hour) => ({ ...acc, [hour]: 0 }), {});

    rawViews.value.forEach((view) => {
      const ts = view?.attributes?.timestamp;
      if (!ts) return;

      const date = format(parseISO(ts), "yyyy-MM-dd");
      const hour = `${String(getHours(parseISO(ts))).padStart(2, "0")}:00`;

      if (date === day) {
        counts[hour]++;
      }
    });

    dataPoints = labels.map((h) => counts[h]);
    title = `Event Views – Hourly for ${day}`;
    console.log("⏱ [renderChart] Hourly data points:", dataPoints);
  } else {
    labels = getLastNDates(selectedRange.value);
    const counts = labels.reduce((acc, date) => ({ ...acc, [date]: 0 }), {});

    rawViews.value.forEach((view) => {
      const ts = view?.attributes?.timestamp;
      if (!ts) return;

      const day = format(parseISO(ts), "yyyy-MM-dd");
      if (counts[day] !== undefined) counts[day]++;
    });

    dataPoints = labels.map((d) => counts[d]);
    title = `Event Views – Last ${selectedRange.value} Days`;
    console.log("📅 [renderChart] Daily data points:", dataPoints);
  }

  lineChartInstance?.destroy();
  lineChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Views",
          data: dataPoints,
          borderColor: "#8B5CF6",
          backgroundColor: "#8B5CF6",
          fill: false,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "white" }, grid: { color: "#444" } },
        y: {
          beginAtZero: true,
          ticks: { color: "white" },
          grid: { color: "#444" },
        },
      },
      plugins: {
        legend: { labels: { color: "white" } },
        title: {
          display: true,
          text: title,
          color: "white",
          font: { size: 18 },
        },
      },
    },
  });
}

onMounted(fetchViews);

watch([selectedRange, selectedDate], () => {
  if (!isLoading.value) {
    console.log("🔄 [watch] Redrawing chart due to change");
    renderChart();
  }
});

onBeforeUnmount(() => {
  lineChartInstance?.destroy();
});
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
