<template>
  <div class="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-white font-semibold">Roster Momentum</h3>
        <p class="text-gray-500 text-xs mt-0.5">Average momentum index across roster</p>
      </div>
      <div class="flex gap-1">
        <button 
          @click="days = 7"
          class="px-3 py-1 text-xs rounded-lg transition-colors"
          :class="days === 7 ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'"
        >
          7d
        </button>
        <button 
          @click="days = 30"
          class="px-3 py-1 text-xs rounded-lg transition-colors"
          :class="days === 30 ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'"
        >
          30d
        </button>
      </div>
    </div>

    <!-- Current Value -->
    <div class="flex items-end gap-3 mb-4">
      <span class="text-4xl font-bold text-white">{{ currentAvg }}</span>
      <span 
        class="text-sm font-medium mb-1"
        :class="trendDirection >= 0 ? 'text-emerald-400' : 'text-red-400'"
      >
        {{ trendDirection >= 0 ? '+' : '' }}{{ trendDirection }}
      </span>
    </div>

    <!-- Sparkline Chart -->
    <div class="h-16 relative">
      <svg class="w-full h-full" preserveAspectRatio="none">
        <!-- Grid lines -->
        <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#374151" stroke-width="1" stroke-dasharray="4" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#374151" stroke-width="1" stroke-dasharray="4" />
        <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#374151" stroke-width="1" stroke-dasharray="4" />
        
        <!-- Area fill -->
        <path 
          :d="areaPath" 
          fill="url(#gradient)" 
          opacity="0.3"
        />
        
        <!-- Line -->
        <polyline 
          :points="linePoints" 
          fill="none" 
          stroke="#8b5cf6" 
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#8b5cf6" />
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <!-- Labels -->
    <div class="flex justify-between text-xs text-gray-500 mt-2">
      <span>{{ days }}d ago</span>
      <span>Today</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAgencyPortalStore } from '~/stores/agencyPortal'

const store = useAgencyPortalStore()
const days = ref(7)

const trendData = computed(() => store.rosterMomentumTrend(days.value))

const currentAvg = computed(() => {
  if (!trendData.value.length) return 0
  return trendData.value[trendData.value.length - 1].avgIndex
})

const trendDirection = computed(() => {
  if (trendData.value.length < 2) return 0
  const first = trendData.value[0].avgIndex
  const last = trendData.value[trendData.value.length - 1].avgIndex
  return last - first
})

const linePoints = computed(() => {
  if (!trendData.value.length) return ''
  const max = Math.max(...trendData.value.map(d => d.avgIndex), 100)
  const min = Math.min(...trendData.value.map(d => d.avgIndex), 0)
  const range = max - min || 1
  
  return trendData.value.map((d, i) => {
    const x = (i / (trendData.value.length - 1)) * 100
    const y = 100 - ((d.avgIndex - min) / range) * 100
    return `${x}%,${y}%`
  }).join(' ')
})

const areaPath = computed(() => {
  if (!trendData.value.length) return ''
  const max = Math.max(...trendData.value.map(d => d.avgIndex), 100)
  const min = Math.min(...trendData.value.map(d => d.avgIndex), 0)
  const range = max - min || 1
  
  const points = trendData.value.map((d, i) => {
    const x = (i / (trendData.value.length - 1)) * 100
    const y = 100 - ((d.avgIndex - min) / range) * 100
    return `${x} ${y}`
  })
  
  return `M 0 100 L 0 ${100 - ((trendData.value[0].avgIndex - min) / range) * 100} ` +
         points.map((p, i) => `L ${p}`).join(' ') +
         ` L 100 100 Z`
})
</script>
