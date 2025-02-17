<template>
  <div
    class="bg-black text-white min-h-screen mx-auto p-4 w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-3xl"
  >
    <h1 class="text-2xl font-bold mb-4">Analytics Charts</h1>

    <!-- You can add buttons to switch grouping if desired:
    <div class="mb-4">
      <button @click="groupBy = 'daily'" class="mr-2 px-4 py-2 bg-gray-700 rounded">Daily</button>
      <button @click="groupBy = 'monthly'" class="px-4 py-2 bg-gray-700 rounded">Monthly</button>
    </div>
    -->

    <div class="my-20">
      <h2 class="mb-2 mt-6">Clicks by Platform (Bar Chart)</h2>
      <canvas id="barChart"></canvas>
    </div>

    <div class="my-20">
      <h2 class="mb-2">Clicks Over Time (Line Chart)</h2>
      <canvas id="lineChart"></canvas>
    </div>

    <div class="my-20">
      <h2 class="mb-2 mt-6">Clicks Distribution (Pie Chart)</h2>
      <canvas id="pieChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { useRoute, useRuntimeConfig } from "#imports";
import { Chart } from "chart.js/auto";

interface ClickEvent {
  timestamp: string;
  id: number;
  platform: string;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

const route = useRoute();
const config = useRuntimeConfig();
const bandId = route.params.id;

// New: Reactive variable to choose grouping mode: "daily" or "monthly"
const groupBy = ref<"daily" | "monthly">("daily");

const analyticsData = ref<ClickEvent[]>([]);

const fetchAnalyticsData = async () => {
  try {
    const res = await fetch(
      `${config.public.strapiUrl}/api/link-clicks/band/${bandId}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch analytics data");
    }
    const data = await res.json();
    analyticsData.value = data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
  }
};

// Updated: Group data by full date (YYYY-MM-DD) or by month (YYYY-MM)
const timeSeriesData = computed(() => {
  const groups: Record<string, number> = {};
  analyticsData.value.forEach((event) => {
    const date = new Date(event.timestamp);
    let rawKey: string;
    if (groupBy.value === "daily") {
      rawKey = date.toISOString().slice(0, 10); // e.g., "2025-02-17"
    } else {
      rawKey = date.toISOString().slice(0, 7); // e.g., "2025-02"
    }
    groups[rawKey] = (groups[rawKey] || 0) + event.clickCount;
  });
  const rawKeys = Object.keys(groups).sort();
  if (groupBy.value === "daily") {
    const labels = rawKeys.map((key) => {
      const date = new Date(key);
      // Format as "Jan 25 2025" (remove the comma)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).replace(',', '');
    });
    return { labels, data: rawKeys.map(key => groups[key]) };
  } else {
    const labels = rawKeys.map((key) => {
      const [year, month] = key.split("-");
      const date = new Date(Number(year), Number(month) - 1);
      // Format as "Jan 2025"
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    });
    return { labels, data: rawKeys.map(key => groups[key]) };
  }
});

// Group data by platform for bar and pie charts (unchanged)
const platformCounts = computed(() => {
  const counts: Record<string, number> = {};
  analyticsData.value.forEach((event) => {
    const platform = event.platform;
    counts[platform] = (counts[platform] || 0) + event.clickCount;
  });
  const labels = Object.keys(counts);
  const data = labels.map((label) => counts[label]);
  return { labels, data };
});

onMounted(async () => {
  await fetchAnalyticsData();

  // LINE CHART: Clicks Over Time
  const lineCtx = (document.getElementById("lineChart") as HTMLCanvasElement).getContext("2d");
  new Chart(lineCtx, {
    type: "line",
    data: {
      labels: timeSeriesData.value.labels,
      datasets: [
        {
          label: "Clicks Over Time",
          data: timeSeriesData.value.data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      layout: {
        padding: { top: 20, bottom: 50 }
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: "#fff" } },
        x: { ticks: { color: "#fff" } },
      },
      plugins: { legend: { labels: { color: "#fff", padding: 50 } } },
    },
  });

  // BAR CHART: Clicks by Platform
  const barCtx = (document.getElementById("barChart") as HTMLCanvasElement).getContext("2d");
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: platformCounts.value.labels,
      datasets: [
        {
          label: "Clicks by Platform",
          data: platformCounts.value.data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 159, 64, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true, ticks: { color: "#fff" } },
        x: { ticks: { color: "#fff" } },
      },
      plugins: { legend: { labels: { color: "#fff" } } },
    },
  });

  // PIE CHART: Clicks Distribution by Platform
  const pieCtx = (document.getElementById("pieChart") as HTMLCanvasElement).getContext("2d");
  new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: platformCounts.value.labels,
      datasets: [
        {
          label: "Clicks Distribution",
          data: platformCounts.value.data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 159, 64, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: { legend: { labels: { color: "#fff" } } },
      scales: undefined,
    },
  });
});
</script>

<style scoped>
canvas {
  background-color: #000;
  border: 1px solid #444;
  margin-bottom: 20px;
  width: 100% !important;
}

.spinner {
  border: 8px solid rgba(0, 255, 0, 0.2);
  border-top: 8px solid #00ff00;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99999999999999;
}
</style>
