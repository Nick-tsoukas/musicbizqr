<template>
  <div class="space-y-6">
    <!-- Scene Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">Smart Links</h1>
      <p class="text-white/60 text-lg">One link. Every platform. Full analytics.</p>
    </div>

    <!-- Band Selector -->
    <div class="flex justify-center mb-6">
      <div class="inline-flex items-center gap-2 bg-black/40 border border-white/10 rounded-full p-1">
        <button
          v-for="band in demoBands"
          :key="band.id"
          type="button"
          :class="[
            'px-4 py-2 text-sm rounded-full transition',
            selectedBand.id === band.id
              ? 'bg-purple-500/30 text-purple-200'
              : 'text-white/60 hover:text-white hover:bg-white/5',
          ]"
          @click="selectBand(band.id)"
        >
          {{ band.name }}
        </button>
      </div>
    </div>

    <!-- Fan Action Strip -->
    <div class="bg-gradient-to-r from-purple-900/20 via-violet-900/20 to-purple-900/20 border border-purple-500/20 rounded-2xl p-4 mb-6">
      <div class="text-center text-white/60 text-sm mb-3">Fan Actions — Click to track</div>
      <div class="flex flex-wrap justify-center gap-3">
        <button
          v-for="action in fanActions"
          :key="action.key"
          type="button"
          class="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/20 bg-black/40 text-white hover:bg-purple-500/20 hover:border-purple-400/40 transition group"
          @click="handleAction(action.key)"
        >
          <span class="text-xl">{{ action.icon }}</span>
          <span class="font-medium">{{ action.label }}</span>
          <span class="text-xs text-white/40 group-hover:text-purple-300 transition">+1</span>
        </button>
      </div>
    </div>

    <!-- Band Page Panel -->
    <div class="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/40 overflow-hidden shadow-2xl">
      <!-- Hero Image -->
      <div class="relative h-48 md:h-64 bg-gradient-to-br from-purple-900/40 to-black overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div class="absolute bottom-4 left-4 right-4">
          <h2 class="text-2xl md:text-3xl font-bold text-white">{{ selectedBand.name }}</h2>
          <p class="text-white/70 mt-1">{{ selectedBand.genre }}</p>
        </div>
      </div>

      <!-- Bio -->
      <div class="p-6">
        <p class="text-white/90 text-lg">{{ selectedBand.bio }}</p>
        <p class="text-purple-300 mt-2">{{ selectedBand.biotagline }}</p>
      </div>

      <!-- Streaming Links -->
      <div class="px-6 pb-6">
        <h3 class="text-white font-semibold mb-3">Streaming</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            v-for="link in streamingLinks"
            :key="link.key"
            type="button"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white hover:bg-white/5 hover:border-white/20 transition"
            @click="handleAction(link.key)"
          >
            <span class="text-xl">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
          </button>
        </div>
      </div>

      <!-- Social Links -->
      <div class="px-6 pb-6">
        <h3 class="text-white font-semibold mb-3">Social</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            v-for="link in socialLinks"
            :key="link.key"
            type="button"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-white hover:bg-white/5 hover:border-white/20 transition"
            @click="handleAction(link.key)"
          >
            <span class="text-xl">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
          </button>
        </div>
      </div>

      <!-- Upcoming Events Preview -->
      <div class="px-6 pb-6">
        <h3 class="text-white font-semibold mb-3">Upcoming Shows</h3>
        <div class="space-y-2">
          <div
            v-for="event in selectedBand.upcomingEvents.slice(0, 3)"
            :key="event.venue"
            class="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-black/30"
          >
            <div>
              <div class="text-white font-medium">{{ event.city }}, {{ event.state }}</div>
              <div class="text-white/60 text-sm">{{ event.venue }}</div>
            </div>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg border border-purple-400/40 bg-purple-500/20 text-purple-200 text-sm hover:bg-purple-500/30 transition"
              @click="handleAction('tickets')"
            >
              Tickets
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Preview -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div class="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-white tabular-nums">{{ demoStats.profileVisits }}</div>
        <div class="text-white/60 text-sm">Profile Visits</div>
      </div>
      <div class="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-white tabular-nums">{{ demoStats.spotifyClicks }}</div>
        <div class="text-white/60 text-sm">Spotify Clicks</div>
      </div>
      <div class="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-white tabular-nums">{{ demoStats.follows }}</div>
        <div class="text-white/60 text-sm">Follows</div>
      </div>
      <div class="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-white tabular-nums">{{ demoStats.ticketClicks }}</div>
        <div class="text-white/60 text-sm">Ticket Clicks</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDemoShow } from '@/composables/useDemoShow'

const {
  selectedBand,
  demoStats,
  demoBands,
  selectBand,
  trackAction,
} = useDemoShow()

const fanActions = [
  { key: 'spotify', label: 'Play', icon: '▶️' },
  { key: 'follow', label: 'Follow', icon: '❤️' },
  { key: 'tickets', label: 'Tickets', icon: '🎟️' },
  { key: 'merch', label: 'Merch', icon: '👕' },
  { key: 'tip', label: 'Tip', icon: '💜' },
  { key: 'contact', label: 'Contact', icon: '✉️' },
]

const streamingLinks = [
  { key: 'spotify', label: 'Spotify', icon: '🎵' },
  { key: 'appleMusic', label: 'Apple Music', icon: '🍎' },
  { key: 'youtube', label: 'YouTube', icon: '📺' },
]

const socialLinks = [
  { key: 'instagram', label: 'Instagram', icon: '📷' },
  { key: 'tiktok', label: 'TikTok', icon: '🎬' },
  { key: 'twitter', label: 'Twitter', icon: '🐦' },
  { key: 'website', label: 'Website', icon: '🌐' },
]

function handleAction(key) {
  trackAction(key)
}
</script>
