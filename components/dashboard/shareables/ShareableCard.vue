<template>
  <button
    @click="$emit('click', item)"
    class="shareable-card flex-shrink-0 snap-start text-left transition-all group"
    :class="cardSizeClass"
  >
    <div 
      class="relative h-full rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
      :style="cardBorderStyle"
    >
      <!-- Background gradient matching export -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      <!-- Accent orb top-right -->
      <div 
        class="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-30"
        :style="{ backgroundColor: accentColor }"
      ></div>
      
      <!-- Accent orb bottom-left (subtle) -->
      <div 
        class="absolute -bottom-8 -left-8 w-20 h-20 rounded-full blur-2xl opacity-15"
        style="background-color: #10B981;"
      ></div>

      <!-- Content -->
      <div class="relative z-10 h-full flex flex-col p-4">
        <!-- Window label badge -->
        <div class="mb-2">
          <span 
            class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            :style="badgeStyle"
          >
            {{ item.windowLabel }}
          </span>
        </div>

        <!-- Headline -->
        <h4 class="text-white text-xs font-bold mb-2 line-clamp-2 leading-tight">
          {{ item.headline }}
        </h4>

        <!-- Hero stat -->
        <div class="flex-1 flex items-center justify-center py-2">
          <span 
            class="text-2xl font-black text-center"
            :style="heroStyle"
          >
            {{ item.hero }}
          </span>
        </div>

        <!-- Proof line -->
        <p class="text-white/55 text-[9px] uppercase tracking-wide text-center mb-2">
          {{ item.proof }}
        </p>

        <!-- Micro caption -->
        <p 
          v-if="displayCaption"
          class="text-white/65 text-[10px] italic text-center mb-2 line-clamp-2"
        >
          "{{ displayCaption }}"
        </p>

        <!-- Band name (if not in logo) -->
        <p 
          v-if="!item.band?.isBandNameInLogo" 
          class="text-white text-[11px] font-semibold text-center truncate"
        >
          {{ item.band?.name }}
        </p>

        <!-- Share CTA -->
        <button
          @click.stop="$emit('share', item)"
          class="mt-3 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold hover:from-purple-500 hover:to-blue-500 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Now
        </button>
      </div>
    </div>
  </button>
</template>

<script setup>
/**
 * ShareableCard — Unified card component for V1 Shareables
 * 
 * QA GATES handled by this component:
 * - QA-2: Headlines wrap to max 2 lines (line-clamp-2)
 * - QA-3: Hero text uses flex centering (never clips)
 * - QA-4: Missing microCaption falls back to empty string
 * - QA-6: Unknown accent uses safe default (violet)
 */

import { computed } from 'vue'
import { ACCENT_COLORS, TYPE_TO_ACCENT, getAccentConfig } from '~/utils/shareables/mappings'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  size: {
    type: String,
    default: 'normal', // 'normal' | 'compact'
  },
})

defineEmits(['click', 'share'])

// QA-6: Get accent color with safe fallback
const accent = computed(() => {
  return getAccentConfig(props.item.accent, props.item.type)
})

const accentColor = computed(() => accent.value.primary)

// Card size classes
const cardSizeClass = computed(() => {
  return props.size === 'compact' 
    ? 'w-[200px] min-h-[280px]' 
    : 'w-[280px] min-h-[340px] md:w-[320px] md:min-h-[380px]'
})

// Dynamic styles
const cardBorderStyle = computed(() => ({
  borderColor: `${accentColor.value}22`,
}))

const badgeStyle = computed(() => ({
  backgroundColor: `${accentColor.value}20`,
  color: accentColor.value,
  border: `1px solid ${accentColor.value}40`,
}))

const heroStyle = computed(() => ({
  background: `linear-gradient(135deg, #F472B6, ${accentColor.value}, #60A5FA, #34D399)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}))

// QA-4: Display caption with safe fallback for missing microCaption
const displayCaption = computed(() => {
  const style = props.item.selectedCaptionStyle || 'hype'
  // Handle null/undefined microCaption gracefully
  if (!props.item.microCaption) return ''
  return props.item.microCaption[style] || props.item.microCaption.hype || ''
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
