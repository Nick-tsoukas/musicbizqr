<template>
  <div
    class="bg-black pt-[var(--header-height)] text-white min-h-screen mx-auto p-4 w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-3xl"
  >
    <h1 class="text-2xl font-bold mb-4">QR Scans Over Time</h1>

    <div class="my-20">
      <h2 class="mb-2">Scans Over Time</h2>
      <canvas id="lineChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { useRoute, useRuntimeConfig } from "#imports";
import { Chart } from "chart.js/auto";

const route = useRoute();
const config = useRuntimeConfig();
const qrId = route.params.id as string;

const analyticsData = ref<any[]>([]);

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

const timeSeriesData = computed(() => {
  const counts: Record<string, number> = {};
  analyticsData.value.forEach((scan) => {
    // use createdAt or timestamp field
    const dateStr = scan.attributes.createdAt;
    const date = new Date(dateStr);
    const key = date.toISOString().slice(0, 10); // YYYY-MM-DD
    counts[key] = (counts[key] || 0) + 1;
  });
  const sortedKeys = Object.keys(counts).sort();
  const labels = sortedKeys.map(k => {
    const d = new Date(k);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).replace(",", "");
  });
  const data = sortedKeys.map(k => counts[k]);
  return { labels, data };
});

onMounted(async () => {
  await fetchAnalyticsData();
  // wait for DOM
  await nextTick();

  const ctx = (document.getElementById("lineChart") as HTMLCanvasElement)
                .getContext("2d");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: timeSeriesData.value.labels,
      datasets: [{
        label: "Scans Over Time",
        data: timeSeriesData.value.data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      }]
    },
    options: {
      layout: { padding: { top: 20, bottom: 50 } },
      scales: {
        y: { beginAtZero: true, ticks: { color: "#fff" } },
        x: { ticks: { color: "#fff" } },
      },
      plugins: { legend: { labels: { color: "#fff", padding: 20 } } },
    }
  });
});
</script>

<style scoped>
canvas {
  background-color: #000;
  border: 1px solid #444;
  width: 100% !important;
  height: auto;
}
</style>
