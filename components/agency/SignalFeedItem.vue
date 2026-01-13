<template>
  <div 
    class="bg-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all"
    :class="{ 'opacity-50': isHandled }"
  >
    <div class="flex items-start gap-3">
      <!-- Band Avatar -->
      <div 
        class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        :class="avatarClass"
      >
        <span class="font-bold text-sm">{{ band?.name?.charAt(0) || '?' }}</span>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-white font-medium text-sm">{{ band?.name || 'Unknown' }}</span>
          <span class="text-xs px-2 py-0.5 rounded-full" :class="typeClass">
            {{ formatType(signal.type) }}
          </span>
          <span v-if="isHandled" class="text-xs text-emerald-400">✓ Handled</span>
        </div>

        <div class="mt-2">
          <div class="text-xs font-bold tracking-wide" :class="accentClass">
            {{ signal.headline }}
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xl font-bold" :class="accentClass">{{ signal.hero }}</span>
            <span class="text-gray-500 text-xs">{{ signal.windowLabel }}</span>
          </div>
          <p class="text-gray-400 text-xs mt-1">{{ signal.proof }}</p>
        </div>

        <!-- Meta -->
        <div class="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span v-if="signal.context?.city" class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {{ signal.context.city }}
          </span>
          <span>{{ timeAgo }}</span>
          <span>Score: {{ signal.score }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-2 flex-shrink-0">
        <button 
          @click="$emit('open', signal.bandId)"
          class="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          title="Open Artist"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
        <button 
          v-if="!isHandled"
          @click="$emit('handle', signal.id)"
          class="p-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg transition-colors"
          title="Mark Handled"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <button 
          @click="$emit('task', signal)"
          class="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          title="Create Task"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAgencyPortalStore } from '~/stores/agencyPortal'

const props = defineProps({
  signal: {
    type: Object,
    required: true
  }
})

defineEmits(['open', 'handle', 'task'])

const store = useAgencyPortalStore()

const band = computed(() => store.getBandById(props.signal.bandId))
const isHandled = computed(() => store.isSignalHandled(props.signal.id))

const accentClass = computed(() => {
  const classes = {
    violet: 'text-violet-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
  }
  return classes[props.signal.accent] || classes.violet
})

const avatarClass = computed(() => {
  const classes = {
    violet: 'bg-violet-600/20 text-violet-400',
    blue: 'bg-blue-600/20 text-blue-400',
    emerald: 'bg-emerald-600/20 text-emerald-400',
    amber: 'bg-amber-600/20 text-amber-400',
    rose: 'bg-rose-600/20 text-rose-400'
  }
  return classes[props.signal.accent] || classes.violet
})

const typeClass = computed(() => {
  const classes = {
    violet: 'bg-violet-500/20 text-violet-400',
    blue: 'bg-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    rose: 'bg-rose-500/20 text-rose-400'
  }
  return classes[props.signal.accent] || classes.violet
})

const timeAgo = computed(() => {
  const date = new Date(props.signal.createdAt)
  const now = new Date()
  const diffMs = now - date
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return '1d ago'
  return `${diffDays}d ago`
})

function formatType(type) {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}
</script>
