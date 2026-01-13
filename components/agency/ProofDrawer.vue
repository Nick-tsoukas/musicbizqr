<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60" @click="$emit('close')" />
        
        <!-- Drawer -->
        <div class="absolute right-0 top-0 bottom-0 w-full max-w-md bg-gray-900 border-l border-gray-800 flex flex-col">
          <!-- Header -->
          <div class="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 class="text-white font-semibold">Share Proof</h2>
            <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4">
            <!-- Proof Card Preview -->
            <div 
              ref="proofCard"
              class="rounded-2xl p-6 border"
              :class="cardClasses"
            >
              <!-- Band Info -->
              <div v-if="band" class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <span class="font-bold text-white">{{ band.name.charAt(0) }}</span>
                </div>
                <div>
                  <div class="text-white font-medium text-sm">{{ band.name }}</div>
                  <div class="text-white/60 text-xs">{{ band.genre }}</div>
                </div>
              </div>

              <!-- Signal Content -->
              <div v-if="signal" class="space-y-3">
                <div class="text-xs font-bold tracking-wider text-white/80 uppercase">
                  {{ signal.headline }}
                </div>
                <div class="text-4xl font-bold text-white">
                  {{ signal.hero }}
                </div>
                <p class="text-white/70 text-sm">
                  {{ signal.proof }}
                </p>
                <div class="flex items-center gap-2 text-xs text-white/50">
                  <span>{{ signal.windowLabel }}</span>
                  <span>•</span>
                  <span>MusicBizQR</span>
                </div>
              </div>
            </div>

            <!-- Copy Summary -->
            <div class="mt-6">
              <label class="block text-sm text-gray-400 mb-2">Shareable Summary</label>
              <div class="bg-gray-800 rounded-xl p-4 text-sm text-gray-300 font-mono">
                {{ summaryText }}
              </div>
              <button 
                @click="copySummary"
                class="w-full mt-3 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {{ copied ? 'Copied!' : 'Copy Summary' }}
              </button>
            </div>

            <!-- Image Placeholder -->
            <div class="mt-6">
              <label class="block text-sm text-gray-400 mb-2">Proof Image</label>
              <div class="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-8 text-center">
                <svg class="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-gray-500 text-sm">Image export coming soon</p>
                <p class="text-gray-600 text-xs mt-1">Use screenshot for now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAgencyPortalStore } from '~/stores/agencyPortal'

const props = defineProps({
  isOpen: Boolean,
  signal: Object
})

defineEmits(['close'])

const store = useAgencyPortalStore()
const copied = ref(false)
const proofCard = ref(null)

const band = computed(() => {
  if (!props.signal?.bandId) return null
  return store.getBandById(props.signal.bandId)
})

const cardClasses = computed(() => {
  const accent = props.signal?.accent || 'violet'
  const classes = {
    violet: 'bg-gradient-to-br from-violet-600/30 to-purple-600/30 border-violet-500/30',
    blue: 'bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border-blue-500/30',
    emerald: 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border-emerald-500/30',
    amber: 'bg-gradient-to-br from-amber-600/30 to-orange-600/30 border-amber-500/30',
    rose: 'bg-gradient-to-br from-rose-600/30 to-pink-600/30 border-rose-500/30'
  }
  return classes[accent] || classes.violet
})

const summaryText = computed(() => {
  if (!props.signal || !band.value) return ''
  return `🎵 ${band.value.name}\n📊 ${props.signal.headline}\n💥 ${props.signal.hero}\n📍 ${props.signal.proof}\n⏱️ ${props.signal.windowLabel}\n\n— via MusicBizQR`
})

async function copySummary() {
  try {
    await navigator.clipboard.writeText(summaryText.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
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
