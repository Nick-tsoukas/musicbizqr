<template>
  <div class="space-y-6">
    <!-- Scene Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">Proof & Analytics</h1>
      <p class="text-white/60 text-lg">See exactly what's working. Data you can act on.</p>
    </div>

    <!-- Momentum Badge -->
    <div class="flex justify-center mb-6">
      <div :class="[
        'inline-flex items-center gap-3 px-5 py-3 rounded-full border',
        momentumState === 'breakout' ? 'border-red-400/50 bg-red-500/10' :
        momentumState === 'heating' ? 'border-orange-400/50 bg-orange-500/10' :
        momentumState === 'watching' ? 'border-yellow-400/50 bg-yellow-500/10' :
        'border-blue-400/50 bg-blue-500/10',
      ]">
        <div :class="[
          'w-3 h-3 rounded-full animate-pulse',
          momentumState === 'breakout' ? 'bg-red-400' :
          momentumState === 'heating' ? 'bg-orange-400' :
          momentumState === 'watching' ? 'bg-yellow-400' :
          'bg-blue-400',
        ]" />
        <span :class="momentumColor" class="font-semibold">{{ momentumLabel }}</span>
      </div>
    </div>

    <!-- Big Counters -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div
        v-for="stat in mainStats"
        :key="stat.key"
        class="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-xl p-4 text-center group hover:border-purple-400/30 transition"
      >
        <div class="text-3xl md:text-4xl font-bold text-white tabular-nums">
          <CountUp :value="stat.value" />
        </div>
        <div class="text-white/60 text-sm mt-1">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Two Column: Chart + Cities -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Activity Chart -->
      <div class="bg-gradient-to-b from-white/5 to-black/40 border border-white/10 rounded-2xl p-5">
        <h3 class="text-white font-semibold text-lg mb-4">Activity Over Time</h3>
        <div class="h-48 flex items-end gap-1">
          <div
            v-for="(bar, idx) in chartBars"
            :key="idx"
            class="flex-1 bg-purple-500/40 rounded-t transition-all duration-500 hover:bg-purple-500/60"
            :style="{ height: bar.height + '%' }"
          />
        </div>
        <div class="flex justify-between mt-2 text-white/40 text-xs">
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </div>

      <!-- Top Cities -->
      <div class="bg-gradient-to-b from-white/5 to-black/40 border border-white/10 rounded-2xl p-5">
        <h3 class="text-white font-semibold text-lg mb-4">Top Cities</h3>
        <div class="space-y-3">
          <div
            v-for="(city, idx) in sortedCities"
            :key="city.name"
            class="relative"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-white text-sm">{{ city.name }}</span>
              <span class="text-white/60 text-sm tabular-nums">{{ city.count }}</span>
            </div>
            <div class="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                :class="[
                  'h-full rounded-full transition-all duration-700',
                  idx === 0 ? 'bg-purple-500' :
                  idx === 1 ? 'bg-purple-400' :
                  idx === 2 ? 'bg-purple-300' :
                  'bg-purple-200/60',
                  cityPulse === city.name ? 'animate-pulse' : '',
                ]"
                :style="{ width: getCityWidth(city.count) + '%' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Levers -->
    <div class="flex flex-wrap justify-center gap-4 mt-6">
      <button
        type="button"
        class="px-6 py-3 rounded-xl border border-purple-400/50 bg-purple-500/20 text-purple-200 font-semibold hover:bg-purple-500/30 transition"
        @click="handleFanBurst"
      >
        🚀 Simulate 50 Fans Hit the Link
      </button>
      <button
        type="button"
        class="px-6 py-3 rounded-xl border border-violet-400/50 bg-violet-500/20 text-violet-200 font-semibold hover:bg-violet-500/30 transition"
        @click="handleShares"
      >
        📤 Simulate 10 Shares
      </button>
    </div>

    <!-- Platform Breakdown -->
    <div class="bg-gradient-to-b from-white/5 to-black/40 border border-white/10 rounded-2xl p-5">
      <h3 class="text-white font-semibold text-lg mb-4">Platform Breakdown</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="platform in platformStats"
          :key="platform.key"
          class="bg-black/30 border border-white/10 rounded-xl p-4 text-center"
        >
          <div class="text-2xl mb-1">{{ platform.icon }}</div>
          <div class="text-xl font-bold text-white tabular-nums">
            <CountUp :value="platform.value" />
          </div>
          <div class="text-white/50 text-xs">{{ platform.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDemoShow } from '@/composables/useDemoShow'

const {
  demoStats,
  topCities,
  momentumState,
  momentumLabel,
  momentumColor,
  simulateFanBurst,
  simulateShares,
} = useDemoShow()

const cityPulse = ref('')

const mainStats = computed(() => [
  { key: 'visits', label: 'Profile Visits', value: demoStats.value.profileVisits },
  { key: 'plays', label: 'Plays', value: demoStats.value.spotifyClicks + demoStats.value.youtubePlays },
  { key: 'clicks', label: 'Link Clicks', value: demoStats.value.spotifyClicks + demoStats.value.appleMusicClicks + demoStats.value.ticketClicks },
  { key: 'follows', label: 'Follows', value: demoStats.value.follows },
  { key: 'shared', label: 'Moments Shared', value: demoStats.value.momentsShared },
])

const platformStats = computed(() => [
  { key: 'spotify', label: 'Spotify', icon: '🎵', value: demoStats.value.spotifyClicks },
  { key: 'apple', label: 'Apple Music', icon: '🍎', value: demoStats.value.appleMusicClicks },
  { key: 'youtube', label: 'YouTube', icon: '📺', value: demoStats.value.youtubePlays },
  { key: 'tickets', label: 'Tickets', icon: '🎟️', value: demoStats.value.ticketClicks },
])

const sortedCities = computed(() => {
  return [...topCities.value].sort((a, b) => b.count - a.count).slice(0, 5)
})

const chartBars = computed(() => {
  const base = demoStats.value.profileVisits
  return Array.from({ length: 7 }, (_, i) => {
    const variance = Math.random() * 0.4 + 0.3
    const trend = (i + 1) / 7
    return { height: Math.min(100, variance * trend * 100) }
  })
})

function getCityWidth(count) {
  const max = sortedCities.value[0]?.count || 1
  return Math.round((count / max) * 100)
}

function handleFanBurst() {
  simulateFanBurst(50)
  // Pulse a random city
  const randomCity = sortedCities.value[Math.floor(Math.random() * sortedCities.value.length)]
  cityPulse.value = randomCity?.name || ''
  setTimeout(() => { cityPulse.value = '' }, 1000)
}

function handleShares() {
  simulateShares(10)
}

// Watch for city changes to trigger pulse
watch(topCities, () => {
  const top = sortedCities.value[0]
  if (top) {
    cityPulse.value = top.name
    setTimeout(() => { cityPulse.value = '' }, 800)
  }
}, { deep: true })
</script>

<script>
// Simple count-up component
const CountUp = {
  props: {
    value: { type: Number, default: 0 },
    duration: { type: Number, default: 500 },
  },
  data() {
    return { displayValue: 0 }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal, oldVal) {
        this.animateTo(oldVal || 0, newVal)
      },
    },
  },
  methods: {
    animateTo(from, to) {
      const start = performance.now()
      const animate = (now) => {
        const progress = Math.min((now - start) / this.duration, 1)
        this.displayValue = Math.round(from + (to - from) * progress)
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    },
  },
  template: '<span>{{ displayValue }}</span>',
}

export default {
  components: { CountUp },
}
</script>
