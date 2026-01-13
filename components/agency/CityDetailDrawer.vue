<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen && city" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60" @click="$emit('close')" />
        
        <!-- Drawer -->
        <div class="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-gray-900 border-l border-gray-800 flex flex-col">
          <!-- Header -->
          <div class="p-4 border-b border-gray-800">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  :class="city.isStack ? 'bg-violet-600/20' : 'bg-gray-800'"
                >
                  <svg class="w-6 h-6" :class="city.isStack ? 'text-violet-400' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-white font-semibold text-lg">{{ city.name }}</h2>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-400 text-sm">{{ city.artistCount }} artists</span>
                    <span 
                      v-if="city.isStack"
                      class="text-xs px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30"
                    >
                      CITY STACK
                    </span>
                  </div>
                </div>
              </div>
              <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4">
            <!-- Stack Alert -->
            <div 
              v-if="city.isStack"
              class="bg-violet-600/10 border border-violet-500/30 rounded-xl p-4 mb-4"
            >
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-violet-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <div class="text-violet-300 font-medium text-sm">City Stack Detected</div>
                  <p class="text-violet-400/70 text-xs mt-1">
                    Multiple roster artists are performing well in {{ city.name }}. 
                    Consider coordinated territorial strategy.
                  </p>
                </div>
              </div>
            </div>

            <!-- Artists List -->
            <div class="space-y-3">
              <h3 class="text-gray-400 text-sm font-medium">Active Artists</h3>
              
              <div 
                v-for="artist in city.artists" 
                :key="artist.bandId"
                class="bg-gray-800/50 border border-gray-700 rounded-xl p-3"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center">
                      <span class="text-gray-300 font-medium">{{ artist.name.charAt(0) }}</span>
                    </div>
                    <div>
                      <div class="text-white font-medium text-sm">{{ artist.name }}</div>
                      <div class="text-gray-500 text-xs">{{ artist.genre }}</div>
                    </div>
                  </div>
                  <button 
                    @click="$emit('openArtist', artist.bandId)"
                    class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium rounded-lg transition-colors"
                  >
                    Open
                  </button>
                </div>

                <!-- Artist's signals for this city -->
                <div v-if="getArtistCitySignals(artist.bandId).length" class="mt-3 pt-3 border-t border-gray-700">
                  <div 
                    v-for="signal in getArtistCitySignals(artist.bandId).slice(0, 2)" 
                    :key="signal.id"
                    class="flex items-center justify-between py-1"
                  >
                    <div class="text-xs text-gray-400">{{ signal.headline }}</div>
                    <div class="text-xs font-medium" :class="getAccentClass(signal.accent)">
                      {{ signal.hero }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- All City Signals -->
            <div class="mt-6">
              <h3 class="text-gray-400 text-sm font-medium mb-3">Recent Signals</h3>
              <div class="space-y-2">
                <div 
                  v-for="signal in city.signals.slice(0, 10)" 
                  :key="signal.id"
                  class="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg"
                >
                  <div class="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                    {{ signal.band?.name?.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-white truncate">{{ signal.headline }}</div>
                    <div class="text-xs text-gray-500">{{ signal.band?.name }}</div>
                  </div>
                  <div class="text-sm font-medium" :class="getAccentClass(signal.accent)">
                    {{ signal.hero }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  city: Object
})

defineEmits(['close', 'openArtist'])

function getArtistCitySignals(bandId) {
  if (!props.city?.signals) return []
  return props.city.signals.filter(s => s.bandId === bandId)
}

function getAccentClass(accent) {
  const classes = {
    violet: 'text-violet-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
  }
  return classes[accent] || classes.violet
}
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
