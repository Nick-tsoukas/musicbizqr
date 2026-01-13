<template>
  <div class="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-white font-semibold">After-Show Lift</h3>
        <p class="text-gray-500 text-xs mt-0.5">Momentum boost from live shows</p>
      </div>
      <div 
        class="w-10 h-10 rounded-xl flex items-center justify-center"
        :class="lift.lift > 0 ? 'bg-emerald-600/20' : 'bg-gray-800'"
      >
        <svg class="w-5 h-5" :class="lift.lift > 0 ? 'text-emerald-400' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
    </div>

    <!-- Lift Percentage -->
    <div class="text-center mb-6">
      <div class="text-5xl font-bold" :class="lift.lift > 0 ? 'text-emerald-400' : 'text-gray-400'">
        {{ lift.lift > 0 ? '+' : '' }}{{ lift.lift }}%
      </div>
      <p class="text-gray-500 text-sm mt-1">average lift on show days</p>
    </div>

    <!-- Comparison Bars -->
    <div class="space-y-3">
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-gray-400">After-Show Days</span>
          <span class="text-emerald-400 font-medium">{{ lift.avgAfterShow }}</span>
        </div>
        <div class="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all"
            :style="{ width: `${lift.avgAfterShow}%` }"
          />
        </div>
      </div>
      
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-gray-400">Baseline Days</span>
          <span class="text-gray-300 font-medium">{{ lift.avgBaseline }}</span>
        </div>
        <div class="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gray-600 rounded-full transition-all"
            :style="{ width: `${lift.avgBaseline}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4 text-center">
      <div>
        <div class="text-lg font-bold text-white">{{ lift.afterShowCount }}</div>
        <div class="text-xs text-gray-500">show days tracked</div>
      </div>
      <div>
        <div class="text-lg font-bold text-white">{{ lift.baselineCount }}</div>
        <div class="text-xs text-gray-500">baseline days</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAgencyPortalStore } from '~/stores/agencyPortal'

const store = useAgencyPortalStore()

const lift = computed(() => store.afterShowLift)
</script>
