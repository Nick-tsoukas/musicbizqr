<template>
  <Transition
    enter-active-class="transition-all duration-250 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="showToast"
      class="fixed z-50 bottom-4 right-4 md:bottom-6 md:right-6 left-4 md:left-auto md:w-80"
    >
      <div class="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 p-4">
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent to-neon-purple flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-white font-semibold text-sm">
              MBQ just improved 🚀
            </p>
            <p class="text-gray-400 text-xs mt-0.5">
              Get the latest performance upgrades.
            </p>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-2 mt-4">
          <button
            @click="handleUpdate"
            class="flex-1 px-4 py-2 bg-gradient-to-r from-accent to-neon-purple text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Update now
          </button>
          <button
            @click="handleDismiss"
            class="px-4 py-2 text-gray-400 text-sm font-medium hover:text-white transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, watch } from 'vue'
import { usePwa } from '~/composables/usePwa'

const route = useRoute()
const { needsRefresh, updateDismissed, updateServiceWorker, dismissUpdate } = usePwa()

// Routes where we should NOT show the update toast
const excludedRoutes = ['/account', '/checkout', '/dashboard']

const isExcludedRoute = computed(() => {
  return excludedRoutes.some(r => route.path.startsWith(r))
})

const showToast = computed(() => {
  return needsRefresh.value && !updateDismissed.value && !isExcludedRoute.value
})

const handleUpdate = () => {
  updateServiceWorker()
}

const handleDismiss = () => {
  dismissUpdate()
}
</script>
