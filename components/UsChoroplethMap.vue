<template>
  <div class="us-choropleth-map" ref="mapContainer">
    <div class="relative w-full" style="max-width: 100%; aspect-ratio: 1.6;">
      <svg
        viewBox="0 0 960 600"
        class="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g class="states">
          <path
            v-for="(d, id) in US_STATE_PATHS"
            :key="id"
            :id="String(id)"
            :d="d"
            :fill="getStateFill(String(id))"
            :stroke="selectedState === String(id) ? '#10b981' : '#475569'"
            :stroke-width="selectedState === String(id) ? 1.5 : 0.5"
            class="state-path cursor-pointer transition-colors duration-150"
            @mouseenter="handleHover(String(id), $event)"
            @mouseleave="handleHoverEnd"
            @click="handleClick(String(id))"
          />
        </g>
      </svg>
      
      <!-- Tooltip -->
      <div
        v-if="hoveredState && tooltipPos"
        class="absolute pointer-events-none bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs shadow-lg z-10"
        :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px', transform: 'translate(-50%, -100%)' }"
      >
        <div class="font-medium text-white">{{ getStateName(hoveredState) }}</div>
        <div class="text-slate-300">{{ getStateCount(hoveredState).toLocaleString() }} {{ metricLabel }}</div>
      </div>
    </div>
    
    <!-- Legend -->
    <div class="flex items-center justify-center mt-1 gap-2 text-xs text-slate-400">
      <span>Low</span>
      <div class="w-20 h-1 rounded" :style="{ background: legendGradient }"></div>
      <span>High</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { US_STATE_PATHS, STATE_NAMES } from '~/composables/useUsStatesMap'

interface StateCount {
  state: string
  count: number
}

interface Props {
  states: StateCount[]
  max: number
  metric?: string
  colorLow?: string
  colorHigh?: string
}

const props = withDefaults(defineProps<Props>(), {
  metric: 'views',
  colorLow: '#1e293b',
  colorHigh: '#10b981'
})

const emit = defineEmits<{
  (e: 'stateSelected', state: string | null): void
  (e: 'stateHover', state: string | null): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const hoveredState = ref<string | null>(null)
const selectedState = ref<string | null>(null)
const tooltipPos = ref<{ x: number; y: number } | null>(null)

// Create count lookup
const countLookup = computed(() => {
  const lookup: Record<string, number> = {}
  for (const s of props.states) {
    lookup[s.state] = s.count
  }
  return lookup
})

const metricLabel = computed(() => {
  const labels: Record<string, string> = {
    views: 'views',
    qrScans: 'scans',
    linkClicks: 'clicks',
    follows: 'follows'
  }
  return labels[props.metric] || props.metric
})

const legendGradient = computed(() => {
  return `linear-gradient(to right, ${props.colorLow}, ${props.colorHigh})`
})

function getStateName(id: string): string {
  return STATE_NAMES[id] || id
}

function getStateCount(id: string): number {
  return countLookup.value[id] || 0
}

function getStateFill(id: string): string {
  const count = getStateCount(id)
  if (count === 0 || props.max === 0) return props.colorLow
  
  // Use log scale for better distribution
  const logCount = Math.log(count + 1)
  const logMax = Math.log(props.max + 1)
  const ratio = Math.min(logCount / logMax, 1)
  
  return interpolateColor(props.colorLow, props.colorHigh, ratio)
}

function interpolateColor(color1: string, color2: string, ratio: number): string {
  const hex = (c: string) => parseInt(c, 16)
  const r1 = hex(color1.slice(1, 3)), g1 = hex(color1.slice(3, 5)), b1 = hex(color1.slice(5, 7))
  const r2 = hex(color2.slice(1, 3)), g2 = hex(color2.slice(3, 5)), b2 = hex(color2.slice(5, 7))
  
  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function handleHover(stateId: string, event: MouseEvent) {
  hoveredState.value = stateId
  emit('stateHover', stateId)
  
  if (mapContainer.value) {
    const rect = mapContainer.value.getBoundingClientRect()
    tooltipPos.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top - 10
    }
  }
}

function handleHoverEnd() {
  hoveredState.value = null
  tooltipPos.value = null
  emit('stateHover', null)
}

function handleClick(stateId: string) {
  selectedState.value = selectedState.value === stateId ? null : stateId
  emit('stateSelected', selectedState.value)
}
</script>

<style scoped>
.state-path:hover {
  filter: brightness(1.3);
}
</style>
