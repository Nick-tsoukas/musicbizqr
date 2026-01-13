<template>
  <AgencyLayout>
    <div class="max-w-4xl mx-auto">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white mb-2">Signals Feed</h1>
        <p class="text-gray-400">All signals across your roster, chronologically</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 mb-6">
        <!-- Type Filter -->
        <select
          v-model="filterType"
          class="px-4 py-2 bg-gray-900/60 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
        >
          <option value="">All Types</option>
          <option v-for="type in signalTypes" :key="type" :value="type">
            {{ formatType(type) }}
          </option>
        </select>

        <!-- City Filter -->
        <select
          v-model="filterCity"
          class="px-4 py-2 bg-gray-900/60 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
        >
          <option value="">All Cities</option>
          <option v-for="city in cities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>

        <!-- Score Filter -->
        <select
          v-model="filterScore"
          class="px-4 py-2 bg-gray-900/60 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
        >
          <option value="">All Scores</option>
          <option value="85">85+ (High)</option>
          <option value="70">70+ (Medium)</option>
          <option value="55">55+ (Low)</option>
        </select>

        <!-- Show Handled Toggle -->
        <label class="flex items-center gap-2 px-4 py-2 bg-gray-900/60 border border-gray-800 rounded-xl text-sm cursor-pointer">
          <input 
            v-model="showHandled" 
            type="checkbox" 
            class="w-4 h-4 rounded border-gray-600 bg-gray-800 text-violet-600 focus:ring-violet-500"
          />
          <span class="text-gray-300">Show handled</span>
        </label>

        <!-- Clear Filters -->
        <button 
          v-if="hasFilters"
          @click="clearFilters"
          class="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          Clear filters
        </button>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-center">
          <div class="text-2xl font-bold text-white">{{ filteredSignals.length }}</div>
          <div class="text-xs text-gray-500">Signals</div>
        </div>
        <div class="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-center">
          <div class="text-2xl font-bold text-emerald-400">{{ highScoreCount }}</div>
          <div class="text-xs text-gray-500">High Priority</div>
        </div>
        <div class="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-center">
          <div class="text-2xl font-bold text-violet-400">{{ handledCount }}</div>
          <div class="text-xs text-gray-500">Handled</div>
        </div>
        <div class="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-center">
          <div class="text-2xl font-bold text-amber-400">{{ unhandledCount }}</div>
          <div class="text-xs text-gray-500">Unhandled</div>
        </div>
      </div>

      <!-- Signals List -->
      <div class="space-y-3">
        <SignalFeedItem
          v-for="signal in filteredSignals"
          :key="signal.id"
          :signal="signal"
          @open="openArtist"
          @handle="handleSignal"
          @task="openTaskDrawer"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!filteredSignals.length" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-white font-medium mb-1">No signals found</h3>
        <p class="text-gray-500 text-sm">Try adjusting your filters</p>
      </div>
    </div>

    <!-- Task Drawer -->
    <TaskDrawer
      :is-open="taskDrawerOpen"
      :band-id="selectedSignal?.bandId"
      :signal="selectedSignal"
      @close="taskDrawerOpen = false"
    />
  </AgencyLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAgencyPortalStore } from '~/stores/agencyPortal'
import { SIGNAL_TYPES } from '~/utils/agencyPortal/mockData'

useHead({
  title: 'Signals Feed - Agency Portal',
  meta: [
    { name: 'robots', content: 'noindex,nofollow' }
  ]
})

const router = useRouter()
const store = useAgencyPortalStore()

const filterType = ref('')
const filterCity = ref('')
const filterScore = ref('')
const showHandled = ref(false)
const taskDrawerOpen = ref(false)
const selectedSignal = ref(null)

const signalTypes = Object.values(SIGNAL_TYPES)

const cities = computed(() => {
  const citySet = new Set()
  store.allSignals.forEach(s => {
    if (s.context?.city) citySet.add(s.context.city)
  })
  return Array.from(citySet).sort()
})

const hasFilters = computed(() => {
  return filterType.value || filterCity.value || filterScore.value || showHandled.value
})

const filteredSignals = computed(() => {
  let signals = [...store.allSignals]
  
  // Sort by createdAt descending
  signals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  
  // Filter by type
  if (filterType.value) {
    signals = signals.filter(s => s.type === filterType.value)
  }
  
  // Filter by city
  if (filterCity.value) {
    signals = signals.filter(s => s.context?.city === filterCity.value)
  }
  
  // Filter by score
  if (filterScore.value) {
    const minScore = parseInt(filterScore.value)
    signals = signals.filter(s => s.score >= minScore)
  }
  
  // Filter handled
  if (!showHandled.value) {
    signals = signals.filter(s => !store.isSignalHandled(s.id))
  }
  
  return signals
})

const highScoreCount = computed(() => filteredSignals.value.filter(s => s.score >= 85).length)
const handledCount = computed(() => store.allSignals.filter(s => store.isSignalHandled(s.id)).length)
const unhandledCount = computed(() => store.allSignals.filter(s => !store.isSignalHandled(s.id)).length)

function formatType(type) {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

function clearFilters() {
  filterType.value = ''
  filterCity.value = ''
  filterScore.value = ''
  showHandled.value = false
}

function openArtist(bandId) {
  router.push(`/agency/artists/${bandId}`)
}

function handleSignal(signalId) {
  store.handleSignal(signalId)
}

function openTaskDrawer(signal) {
  selectedSignal.value = signal
  taskDrawerOpen.value = true
}
</script>
