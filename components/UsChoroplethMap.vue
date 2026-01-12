<template>
  <div class="us-choropleth-map" ref="mapContainer">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-64 text-red-400 text-sm">
      {{ error }}
    </div>
    <div v-else class="relative">
      <svg
        :viewBox="viewBox"
        class="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          v-for="state in statesData"
          :key="state.id"
          :id="state.id"
          :d="state.d"
          :fill="getStateFill(state.id)"
          :stroke="selectedState === state.id ? '#10b981' : '#374151'"
          :stroke-width="selectedState === state.id ? 2 : 0.5"
          class="state-path cursor-pointer transition-all duration-200"
          @mouseenter="handleHover(state.id, $event)"
          @mouseleave="handleHoverEnd"
          @click="handleClick(state.id)"
        />
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
      
      <!-- Legend -->
      <div class="flex items-center justify-center mt-4 gap-2 text-xs text-slate-400">
        <span>Low</span>
        <div class="w-32 h-2 rounded" :style="{ background: legendGradient }"></div>
        <span>High</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

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
const loading = ref(true)
const error = ref<string | null>(null)
const statesData = ref<Array<{ id: string; d: string; name: string }>>([])
const viewBox = ref('0 0 959 593')
const hoveredState = ref<string | null>(null)
const selectedState = ref<string | null>(null)
const tooltipPos = ref<{ x: number; y: number } | null>(null)

// State name lookup
const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia'
}

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

async function loadMapData() {
  loading.value = true
  error.value = null
  
  try {
    // Fetch SVG from a reliable CDN
    const response = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
    if (!response.ok) throw new Error('Failed to load map data')
    
    const geojson = await response.json()
    
    // Convert GeoJSON to SVG paths
    statesData.value = geojson.features.map((feature: any) => {
      const stateCode = getStateCodeFromName(feature.properties.name)
      return {
        id: stateCode,
        name: feature.properties.name,
        d: geoJsonToSvgPath(feature.geometry)
      }
    }).filter((s: any) => s.id && s.d)
    
  } catch (err) {
    console.error('[UsChoroplethMap] Error loading map:', err)
    // Fallback to simplified inline paths
    loadFallbackPaths()
  } finally {
    loading.value = false
  }
}

function getStateCodeFromName(name: string): string {
  const nameToCode: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
    'District of Columbia': 'DC'
  }
  return nameToCode[name] || ''
}

function geoJsonToSvgPath(geometry: any): string {
  if (!geometry || !geometry.coordinates) return ''
  
  const coords = geometry.type === 'MultiPolygon' 
    ? geometry.coordinates.flat() 
    : geometry.coordinates
  
  // Simple projection (Albers USA approximation)
  const project = (lon: number, lat: number): [number, number] => {
    const x = (lon + 125) * 7.5
    const y = (52 - lat) * 10
    return [x, y]
  }
  
  let path = ''
  for (const ring of coords) {
    if (!Array.isArray(ring) || ring.length === 0) continue
    const points = ring.map((coord: number[]) => project(coord[0], coord[1]))
    path += 'M' + points.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L') + 'Z'
  }
  
  return path
}

function loadFallbackPaths() {
  // Simplified rectangular representation as fallback
  const cols = 11, rows = 5
  const w = 80, h = 100
  const states = Object.keys(STATE_NAMES)
  
  statesData.value = states.map((id, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = col * w + 10
    const y = row * h + 10
    return {
      id,
      name: STATE_NAMES[id],
      d: `M${x},${y}h${w-5}v${h-5}h${-(w-5)}Z`
    }
  })
  
  viewBox.value = `0 0 ${cols * w + 20} ${rows * h + 20}`
}

onMounted(() => {
  loadMapData()
})
</script>

<style scoped>
.state-path:hover {
  filter: brightness(1.3);
}
</style>
