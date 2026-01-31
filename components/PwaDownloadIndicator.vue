<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="showIndicator"
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-80 z-50"
    >
      <div class="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 p-4">
        <div class="flex items-center gap-3">
          <!-- Spinner or Check -->
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent to-neon-purple flex items-center justify-center">
            <svg v-if="isDownloading" class="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-white font-semibold text-sm">
              {{ isDownloading ? 'Downloading app...' : 'Ready to use offline!' }}
            </p>
            <p class="text-gray-400 text-xs mt-0.5">
              {{ isDownloading ? 'Caching for offline use' : 'MBQ is now installed' }}
            </p>
          </div>
        </div>
        
        <!-- Progress bar (animated) -->
        <div v-if="isDownloading" class="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-accent to-neon-purple rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { usePwa } from '~/composables/usePwa'

const { isDownloading, downloadComplete } = usePwa()

const showIndicator = ref(false)
const justCompleted = ref(false)
let hideTimeout = null

// Show when downloading starts
watch(isDownloading, (downloading) => {
  if (downloading) {
    showIndicator.value = true
  }
}, { immediate: true })

// Show completion briefly then hide
watch(downloadComplete, (complete) => {
  if (complete && showIndicator.value) {
    justCompleted.value = true
    hideTimeout = setTimeout(() => {
      showIndicator.value = false
      justCompleted.value = false
    }, 3000)
  }
})

// Cleanup
onUnmounted(() => {
  if (hideTimeout) clearTimeout(hideTimeout)
})
</script>

<style scoped>
@keyframes progress {
  0% {
    width: 0%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 95%;
  }
}

.animate-progress {
  animation: progress 8s ease-out forwards;
}
</style>
