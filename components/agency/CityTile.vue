<template>
  <div 
    class="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all cursor-pointer"
    @click="$emit('open', city)"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3">
        <div 
          class="w-10 h-10 rounded-xl flex items-center justify-center"
          :class="city.isStack ? 'bg-violet-600/20' : 'bg-gray-800'"
        >
          <svg class="w-5 h-5" :class="city.isStack ? 'text-violet-400' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 class="text-white font-medium">{{ city.name }}</h3>
          <p class="text-gray-500 text-xs">{{ city.artistCount }} active artist{{ city.artistCount !== 1 ? 's' : '' }}</p>
        </div>
      </div>
      
      <!-- Stack Badge -->
      <span 
        v-if="city.isStack"
        class="text-xs px-2 py-1 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30"
      >
        STACK
      </span>
    </div>

    <!-- Top Signal -->
    <div v-if="city.topSignal" class="bg-gray-800/50 rounded-xl p-3 mb-3">
      <div class="text-xs text-gray-500 mb-1">Strongest Signal</div>
      <div class="text-sm text-white font-medium">{{ city.topSignal.headline }}</div>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-lg font-bold" :class="accentClass">{{ city.topSignal.hero }}</span>
        <span class="text-xs text-gray-500">{{ city.topSignal.windowLabel }}</span>
      </div>
    </div>

    <!-- Artists Preview -->
    <div class="flex items-center gap-2">
      <div class="flex -space-x-2">
        <div 
          v-for="(artist, idx) in city.artists.slice(0, 4)" 
          :key="artist.bandId"
          class="w-7 h-7 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs text-gray-300"
          :title="artist.name"
        >
          {{ artist.name.charAt(0) }}
        </div>
        <div 
          v-if="city.artists.length > 4"
          class="w-7 h-7 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs text-gray-400"
        >
          +{{ city.artists.length - 4 }}
        </div>
      </div>
      <span class="text-xs text-gray-500 ml-auto">Score: {{ city.topScore }}</span>
    </div>

    <!-- Open Button -->
    <button 
      @click.stop="$emit('open', city)"
      class="w-full mt-3 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors"
    >
      Open City
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  city: {
    type: Object,
    required: true
  }
})

defineEmits(['open'])

const accentClass = computed(() => {
  const accent = props.city.topSignal?.accent || 'violet'
  const classes = {
    violet: 'text-violet-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
  }
  return classes[accent] || classes.violet
})
</script>
