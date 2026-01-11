<template>
  <div class="chart-card mb-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <h3 class="text-white text-lg font-semibold">MBQ Pulse</h3>
        <span
          :class="[
            'px-2 py-0.5 text-xs font-medium rounded-full',
            momentumClass,
          ]"
        >
          {{ momentumLabel }}
        </span>
      </div>
      <span class="text-gray-400 text-xs">{{ rangeLabel }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <span class="text-gray-400 text-sm">Loading pulse data…</span>
    </div>

    <!-- No Data State -->
    <div v-else-if="!pulse || pulse.pulseScore === 0" class="text-center py-6">
      <div class="text-4xl mb-2">📊</div>
      <p class="text-gray-400 text-sm">No activity recorded yet.</p>
      <p class="text-gray-500 text-xs mt-1">Share your link or QR code to start tracking.</p>
    </div>

    <!-- Pulse Data -->
    <div v-else class="grid md:grid-cols-3 gap-4">
      <!-- Pulse Score -->
      <div class="flex flex-col items-center justify-center bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-xl p-4">
        <div class="relative w-24 h-24">
          <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              class="text-gray-800"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              :stroke-dasharray="`${(pulse.pulseScore / 100) * 251.2} 251.2`"
              stroke-linecap="round"
              :class="scoreColorClass"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-2xl font-bold text-white">{{ pulse.pulseScore }}</span>
          </div>
        </div>
        <p class="text-gray-400 text-xs mt-2">Pulse Score</p>
      </div>

      <!-- Drivers -->
      <div class="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-xl p-4">
        <p class="text-gray-400 text-xs mb-3 uppercase tracking-wide">Key Drivers</p>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center gap-2 text-gray-200">
            <span :class="growthIconClass">{{ growthIcon }}</span>
            <span>{{ growthText }}</span>
          </li>
          <li class="flex items-center gap-2 text-gray-200">
            <span class="text-purple-400">📍</span>
            <span>Top city: <span class="text-white font-medium capitalize">{{ pulse.drivers?.topCity || 'N/A' }}</span></span>
          </li>
          <li class="flex items-center gap-2 text-gray-200">
            <span class="text-blue-400">🔗</span>
            <span>Top source: <span class="text-white font-medium capitalize">{{ pulse.drivers?.topSource || 'direct' }}</span></span>
          </li>
        </ul>
      </div>

      <!-- Next Best Action -->
      <div class="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-xl p-4">
        <p class="text-gray-400 text-xs mb-2 uppercase tracking-wide">Next Best Action</p>
        <p class="text-white font-medium text-sm mb-2">{{ pulse.nextBestAction?.title || 'Keep Building' }}</p>
        <p class="text-gray-400 text-xs mb-3">{{ pulse.nextBestAction?.reason || '' }}</p>
        <ul class="space-y-1 mb-3">
          <li
            v-for="(step, i) in (pulse.nextBestAction?.steps || []).slice(0, 3)"
            :key="i"
            class="text-gray-300 text-xs flex items-start gap-2"
          >
            <span class="text-emerald-400 mt-0.5">•</span>
            <span>{{ step }}</span>
          </li>
        </ul>
        <!-- CTA Button -->
        <NuxtLink
          v-if="pulse.nextBestAction?.deepLink && pulse.nextBestAction?.cta"
          :to="pulse.nextBestAction.deepLink"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 hover:bg-purple-500/30 transition-colors"
        >
          {{ pulse.nextBestAction.cta }}
          <span class="text-purple-300">→</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface PulseData {
  pulseScore: number
  momentumState: 'surging' | 'warming' | 'steady' | 'cooling'
  drivers: {
    primaryMetric: string
    growthPct: number
    topSource: string
    topCity: string
    topDevice: string
  }
  nextBestAction: {
    title: string
    reason: string
    steps: string[]
    cta?: string | null
    deepLink?: string | null
  }
}

const props = defineProps<{
  pulse: PulseData | null
  loading: boolean
  rangeLabel: string
}>()

const momentumClass = computed(() => {
  if (!props.pulse) return 'bg-gray-700 text-gray-300'
  switch (props.pulse.momentumState) {
    case 'surging':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    case 'warming':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    case 'cooling':
      return 'bg-red-500/20 text-red-300 border border-red-500/30'
    default:
      return 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
  }
})

const momentumLabel = computed(() => {
  if (!props.pulse) return 'No Data'
  switch (props.pulse.momentumState) {
    case 'surging':
      return '🚀 Surging'
    case 'warming':
      return '📈 Warming'
    case 'cooling':
      return '📉 Cooling'
    default:
      return '➡️ Steady'
  }
})

const scoreColorClass = computed(() => {
  if (!props.pulse) return 'text-gray-600'
  const score = props.pulse.pulseScore
  if (score >= 70) return 'text-emerald-500'
  if (score >= 40) return 'text-amber-500'
  return 'text-red-500'
})

const growthIcon = computed(() => {
  if (!props.pulse) return '➡️'
  const pct = props.pulse.drivers?.growthPct || 0
  if (pct > 0) return '📈'
  if (pct < 0) return '📉'
  return '➡️'
})

const growthIconClass = computed(() => {
  if (!props.pulse) return 'text-gray-400'
  const pct = props.pulse.drivers?.growthPct || 0
  if (pct > 0) return 'text-emerald-400'
  if (pct < 0) return 'text-red-400'
  return 'text-gray-400'
})

const growthText = computed(() => {
  if (!props.pulse) return 'No change'
  const pct = props.pulse.drivers?.growthPct || 0
  if (pct > 0) return `+${pct}% vs previous period`
  if (pct < 0) return `${pct}% vs previous period`
  return 'No change vs previous period'
})
</script>

<style scoped>
.chart-card {
  @apply bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg;
}
</style>
