<template>
  <div
    class="bg-black text-white min-h-screen mx-auto p-4 w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-3xl"
  >
    <h1 class="text-2xl font-bold mb-4">QR Code Analytics</h1>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div v-else>
      <div class="my-8">
        <h2 class="mb-2">Scans Over Time</h2>
        <canvas id="lineChart"></canvas>
      </div>
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

const loading = ref(true);
const scans = ref<any[]>([]);

// 1) Record a new scan on page visit
async function recordScan() {
  try {
    await fetch(
      `${config.public.strapiUrl}/api/scans`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { qr: qrId } })
      }
    );
  } catch (err) {
    console.error("Error recording scan:", err);
  }
}

// 2) Fetch all scans for this QR
async function fetchScans() {
  try {
    const res = await fetch(
      `${config.public.strapiUrl}/api/scans?filters[qr][id][$eq]=${qrId}&pagination[pageSize]=1000`
    );
    const json = await res.json();
    scans.value = json.data || [];
  } catch (err) {
    console.error("Error fetching scans:", err);
  }
}

// 3) Group scans by day (YYYY-MM-DD)
const scansByDate = computed(() => {
  const counts: Record<string, number> = {};
  scans.value.forEach((scan) => {
    const day = new Date(scan.attributes.createdAt)
                  .toISOString()
                  .slice(0, 10);
    counts[day] = (counts[day] || 0) + 1;
  });
  const labels = Object.keys(counts).sort();
  const data = labels.map(d => counts[d]);
  return { labels, data };
});

onMounted(async () => {
  // record first, then re-fetch including the new one
  await recordScan();
  await fetchScans();
  loading.value = false;

  // wait for DOM & canvas
  await nextTick();
  const ctx = (document.getElementById("lineChart") as HTMLCanvasElement)
                .getContext("2d");
  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: scansByDate.value.labels,
      datasets: [{
        label: "Scans per Day",
        data: scansByDate.value.data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { beginAtZero: true, ticks: { color: "#fff" } },
      },
      plugins: {
        legend: { labels: { color: "#fff" } }
      }
    }
  });
});
</script>

<style scoped>
.spinner {
  border: 8px solid #444;
  border-top: 8px solid #00ff00;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40vh;
}
canvas {
  background-color: #000;
  border: 1px solid #444;
  width: 100% !important;
  height: auto !important;
  margin-bottom: 1.5rem;
}
</style>
