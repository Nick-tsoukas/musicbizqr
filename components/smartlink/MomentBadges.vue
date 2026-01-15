<template>
  <div v-if="visibleBadges.length > 0" class="moment-badges flex flex-wrap gap-2">
    <span
      v-for="badge in visibleBadges"
      :key="badge.key"
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      :class="badge.classes"
    >
      <span>{{ badge.icon }}</span>
      <span>{{ badge.label }}</span>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hasShowTonight: Boolean,
  isOnTour: Boolean,
  hasNewRelease: Boolean,
  hasMerchDrop: Boolean,
  hasNewVideo: Boolean,
  customBadges: {
    type: Array,
    default: () => []
  }
})

const visibleBadges = computed(() => {
  const badges = []

  if (props.hasShowTonight) {
    badges.push({
      key: 'show-tonight',
      icon: '🎤',
      label: 'New tonight',
      classes: 'bg-orange-500/20 text-orange-300 border border-orange-400/30',
    })
  }

  if (props.isOnTour) {
    badges.push({
      key: 'tour-week',
      icon: '🚐',
      label: 'Tour week',
      classes: 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
    })
  }

  if (props.hasNewRelease) {
    badges.push({
      key: 'new-release',
      icon: '🔥',
      label: 'Fresh release',
      classes: 'bg-pink-500/20 text-pink-300 border border-pink-400/30',
    })
  }

  if (props.hasNewVideo) {
    badges.push({
      key: 'new-video',
      icon: '🎬',
      label: 'Fresh video',
      classes: 'bg-purple-500/20 text-purple-300 border border-purple-400/30',
    })
  }

  if (props.hasMerchDrop) {
    badges.push({
      key: 'merch-drop',
      icon: '👕',
      label: 'Merch drop',
      classes: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
    })
  }

  // Add any custom badges
  props.customBadges.forEach(badge => {
    badges.push({
      key: badge.key || `custom-${badges.length}`,
      icon: badge.icon || '✨',
      label: badge.label,
      classes: badge.classes || 'bg-white/10 text-white/80 border border-white/20',
    })
  })

  // Limit to 3 badges max
  return badges.slice(0, 3)
})
</script>
