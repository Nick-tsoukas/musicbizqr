<template>
  <div 
    v-if="event"
    class="show-day-header w-full px-4 py-3 md:max-w-[80vw] md:mx-auto"
  >
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Live indicator -->
        <span class="relative flex h-2.5 w-2.5 shrink-0">
          <span class="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping"></span>
          <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-400"></span>
        </span>
        
        <!-- Event info -->
        <div class="min-w-0">
          <div class="text-white font-semibold text-sm truncate">
            Tonight in {{ event.city || 'your city' }}
          </div>
          <div class="text-white/60 text-xs truncate">
            {{ event.venue || 'Show' }}
            <span v-if="doorsTime"> • Doors {{ doorsTime }}</span>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <button
        @click="handleCta"
        class="shrink-0 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-white text-sm font-semibold transition"
      >
        {{ ctaLabel }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    default: null
  },
  hasPayEntry: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['tickets', 'pay-entry'])

const doorsTime = computed(() => {
  // TODO: Backend field needed - event.doorsTime
  // For now, return null or use a default
  return props.event?.doorsTime || null
})

const ctaLabel = computed(() => {
  if (props.event?.ticketLink) return 'Tickets'
  if (props.hasPayEntry) return 'Pay Entry'
  return 'Details'
})

function handleCta() {
  if (props.event?.ticketLink) {
    window.open(props.event.ticketLink, '_blank')
    emit('tickets', props.event)
  } else if (props.hasPayEntry) {
    emit('pay-entry')
  }
}
</script>
