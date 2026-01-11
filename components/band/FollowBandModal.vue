<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[1000] flex items-center justify-center"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/80 backdrop-blur-sm"
          @click="close"
          aria-hidden="true"
        ></div>

        <!-- Modal -->
        <div
          ref="modalEl"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="labelId"
          class="relative z-10 w-11/12 max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900 to-black p-6 shadow-2xl"
          tabindex="-1"
        >
          <!-- Close button -->
          <button
            type="button"
            class="absolute top-4 right-4 rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close"
            @click="close"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="pr-8">
            <h2 :id="labelId" class="text-xl font-bold text-white">
              Stay connected with {{ bandName }}
            </h2>
            <p class="mt-1 text-sm text-white/70">
              Choose where you want to follow.
            </p>
          </div>

          <!-- Platform groups -->
          <div class="mt-6 space-y-5 max-h-[50vh] overflow-y-auto">
            <!-- Streaming -->
            <div v-if="streamingPlatforms.length">
              <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
                Streaming
              </h3>
              <div class="space-y-2">
                <button
                  v-for="p in streamingPlatforms"
                  :key="p.id"
                  type="button"
                  class="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  :class="
                    selected.has(p.id)
                      ? 'border-purple-500/60 bg-purple-900/30'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  "
                  @click="toggle(p.id)"
                >
                  <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"
                  >
                    <img
                      v-if="p.icon"
                      :src="p.icon"
                      :alt="p.name"
                      class="h-6 w-6 object-contain"
                    />
                    <span v-else class="text-lg">🎵</span>
                  </span>
                  <span class="flex-1 font-medium text-white">{{ p.name }}</span>
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full border transition"
                    :class="
                      selected.has(p.id)
                        ? 'border-purple-400 bg-purple-500 text-white'
                        : 'border-white/20 bg-transparent'
                    "
                  >
                    <svg
                      v-if="selected.has(p.id)"
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <!-- Social -->
            <div v-if="socialPlatforms.length">
              <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
                Social
              </h3>
              <div class="space-y-2">
                <button
                  v-for="p in socialPlatforms"
                  :key="p.id"
                  type="button"
                  class="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  :class="
                    selected.has(p.id)
                      ? 'border-purple-500/60 bg-purple-900/30'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  "
                  @click="toggle(p.id)"
                >
                  <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"
                  >
                    <img
                      v-if="p.icon"
                      :src="p.icon"
                      :alt="p.name"
                      class="h-6 w-6 object-contain"
                    />
                    <span v-else class="text-lg">📱</span>
                  </span>
                  <span class="flex-1 font-medium text-white">{{ p.name }}</span>
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full border transition"
                    :class="
                      selected.has(p.id)
                        ? 'border-purple-400 bg-purple-500 text-white'
                        : 'border-white/20 bg-transparent'
                    "
                  >
                    <svg
                      v-if="selected.has(p.id)"
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Select all (only if 3+ platforms) -->
          <div v-if="allPlatforms.length >= 3" class="mt-4 flex items-center gap-2">
            <button
              type="button"
              class="text-sm text-purple-400 hover:text-purple-300 focus:outline-none focus:underline"
              @click="selectAll"
            >
              {{ allSelected ? 'Deselect all' : 'Select all' }}
            </button>
          </div>

          <!-- Tip -->
          <p class="mt-4 text-xs text-white/50">
            Tip: pick the ones you actually use.
          </p>

          <!-- Actions -->
          <div class="mt-6 flex items-center gap-3">
            <button
              type="button"
              class="flex-1 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="selected.size === 0"
              @click="confirmFollow"
            >
              Follow Selected
            </button>
            <button
              type="button"
              class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white/80 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              @click="close"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  bandName: { type: String, default: '' },
  bandId: { type: [Number, String], default: null },
  bandSlug: { type: String, default: '' },
  platforms: {
    type: Array,
    default: () => [],
    // Each item: { id, name, url, category: 'streaming'|'social', icon? }
  },
})

const emit = defineEmits(['close', 'confirm', 'track'])

const labelId = `follow-modal-label-${Math.random().toString(36).slice(2, 9)}`
const modalEl = ref(null)
const selected = ref(new Set())

const streamingPlatforms = computed(() =>
  props.platforms.filter((p) => p.category === 'streaming')
)
const socialPlatforms = computed(() =>
  props.platforms.filter((p) => p.category === 'social')
)
const allPlatforms = computed(() => props.platforms)

const allSelected = computed(
  () => allPlatforms.value.length > 0 && selected.value.size === allPlatforms.value.length
)

function toggle(id) {
  const next = new Set(selected.value)
  if (next.has(id)) {
    next.delete(id)
    emitTrack('follow_platform_toggle', { platformId: id, action: 'deselect' })
  } else {
    next.add(id)
    emitTrack('follow_platform_toggle', { platformId: id, action: 'select' })
  }
  selected.value = next
}

function selectAll() {
  if (allSelected.value) {
    selected.value = new Set()
  } else {
    selected.value = new Set(allPlatforms.value.map((p) => p.id))
  }
}

function close() {
  emit('close')
}

function confirmFollow() {
  const ids = Array.from(selected.value)
  emitTrack('follow_confirm', { platformIds: ids })
  emit('confirm', ids)
}

function emitTrack(eventName, payload = {}) {
  emit('track', {
    event: eventName,
    bandId: props.bandId,
    bandSlug: props.bandSlug,
    ...payload,
    timestamp: new Date().toISOString(),
  })
}

// Focus trap + ESC handling
let previousActiveElement = null

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      previousActiveElement = document.activeElement
      selected.value = new Set()
      emitTrack('follow_modal_open', {})
      await nextTick()
      modalEl.value?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus()
      }
    }
  }
)

function handleKeydown(e) {
  if (!props.isOpen) return
  if (e.key === 'Escape') {
    close()
  }
  // Basic focus trap
  if (e.key === 'Tab' && modalEl.value) {
    const focusable = modalEl.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
