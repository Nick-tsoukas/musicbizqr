<template>
  <div class="w-full">
    <!-- Subtle Demo Overlay -->
    <div class="flex items-center justify-between mb-4 px-2">
      <span class="text-white/40 text-xs font-medium uppercase tracking-wide">Demo: Shareables</span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-3 py-1.5 text-xs text-white/60 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition flex items-center gap-1.5"
          @click="spawnCard"
        >
          <span class="text-[10px]">+1</span>
          Spawn card
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs bg-purple-600/20 text-purple-300 border border-purple-400/30 rounded-lg hover:bg-purple-600/30 transition flex items-center gap-1.5"
          @click="nextScene"
        >
          Next
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Shareables Gallery -->
    <div class="max-w-5xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">Shareable Moments</h2>
        <p class="text-white/60">Real-time analytics become share-ready content</p>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
        <div
          v-for="card in visibleCards"
          :key="card._instanceId || card.id"
          class="transform transition-all duration-300 hover:scale-[1.02] h-[420px] md:h-[440px] lg:h-[460px]"
        >
          <ShareableCard
            :item="card"
            size="compact"
            class="h-full"
            @select="() => {}"
            @share="() => {}"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="visibleCards.length === 0" class="text-center py-16 text-white/40">
        <div class="text-5xl mb-4">✨</div>
        <div class="text-lg">Click "Spawn card" to generate shareable moments</div>
      </div>

      <!-- Stats Row -->
      <div class="mt-8 grid grid-cols-4 gap-3">
        <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-white tabular-nums">{{ visibleCards.length }}</div>
          <div class="text-white/50 text-xs">Cards Ready</div>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-white tabular-nums">{{ totalDeckSize }}</div>
          <div class="text-white/50 text-xs">Card Types</div>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-purple-400 tabular-nums">∞</div>
          <div class="text-white/50 text-xs">Auto-Generated</div>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-emerald-400 tabular-nums">1-tap</div>
          <div class="text-white/50 text-xs">Share Ready</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDemoShow } from '@/composables/useDemoShow'
import { getBandDemoCards } from '~/utils/shareables/demoDeck'
import ShareableCard from '@/components/shareables/ShareableCard.vue'

const { goToScene } = useDemoShow()

// Demo deck
const bandDeck = ref([])
let deckIdx = 0
let instanceCounter = 0

// Visible cards (max 6 for grid)
const visibleCards = ref([])
const totalDeckSize = ref(0)

// Normalize card for ShareableCard component
function normalizeCard(raw) {
  return {
    id: raw.id,
    _instanceId: ++instanceCounter,
    type: raw.type,
    accent: raw.accent,
    windowLabel: raw.windowLabel,
    title: raw.headline,
    primaryStat: raw.hero,
    secondaryStat: raw.proof,
    band: raw.band,
  }
}

// Initialize deck
function initDeck() {
  const rawCards = getBandDemoCards()
  bandDeck.value = rawCards
  totalDeckSize.value = rawCards.length
  deckIdx = 0
}

// Get next card from deck
function nextCard() {
  if (bandDeck.value.length === 0) initDeck()
  const raw = bandDeck.value[deckIdx % bandDeck.value.length]
  deckIdx++
  return normalizeCard(raw)
}

// Spawn a new card
function spawnCard() {
  const card = nextCard()
  visibleCards.value.unshift(card)
  // Keep max 6 visible
  if (visibleCards.value.length > 6) {
    visibleCards.value.pop()
  }
}

// Go to next scene
function nextScene() {
  goToScene(2)
}

// Initialize with 3 cards
onMounted(() => {
  initDeck()
  for (let i = 0; i < 3; i++) {
    spawnCard()
  }
})
</script>
