<template>
  <div class="shareables-section">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-white flex items-center gap-2">
          <span class="text-xl">✨</span>
          Shareables
        </h3>
        <p class="text-white/50 text-xs mt-0.5">
          Ready-to-post ideas based on your momentum
          <span class="inline-block ml-1 text-white/30" title="Nothing posts without you">ℹ️</span>
        </p>
      </div>
      <button
        v-if="!loading && cards.length > 0"
        @click="refresh"
        :disabled="refreshing"
        class="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white disabled:opacity-50"
        title="Refresh"
      >
        <svg 
          class="w-4 h-4" 
          :class="{ 'animate-spin': refreshing }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Tabs -->
      <div class="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          v-for="tab in tabsWithCounts"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
            activeTab === tab.key
              ? 'bg-purple-600 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          ]"
        >
          {{ tab.label }}
          <span 
            v-if="tab.count > 0" 
            class="ml-1 px-1.5 py-0.5 rounded-full text-[10px]"
            :class="activeTab === tab.key ? 'bg-white/20' : 'bg-white/10'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Cards carousel -->
      <div v-if="filteredCards.length > 0">
        <div class="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
          <ShareableCard
            v-for="card in filteredCards"
            :key="card.id"
            :item="card"
            :size="filteredCards.length > 2 ? 'compact' : 'normal'"
            @click="openCustomize"
            @share="openCustomize"
          />
        </div>
        
        <!-- Why this tooltip (for recommended) -->
        <p v-if="activeTab === 'recommended' && filteredCards.length > 0" class="text-white/30 text-xs mt-2">
          💡 Sorted by relevance score. Tap any card to customize & share.
        </p>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-10">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
          <span class="text-2xl">✨</span>
        </div>
        <h4 class="text-white font-medium mb-2">
          {{ activeTab === 'recommended' ? 'No shareables yet' : `No ${activeTab} available` }}
        </h4>
        <p class="text-white/50 text-sm mb-5 max-w-xs mx-auto">
          Share your band link to spark activity — we'll generate recaps and post ideas automatically.
        </p>
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <button
            @click="handleQuickShare"
            class="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
          >
            Share Band
          </button>
          <button
            @click="handleCopyLink"
            class="px-5 py-2.5 rounded-lg border border-white/20 text-white/70 text-sm hover:bg-white/5 transition-colors"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>

    <!-- Customize Share Drawer -->
    <ShareCustomizeDrawer
      v-model="drawerOpen"
      :item="activeItem"
    />

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toastMessage"
          class="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-black/90 border border-white/20 text-white text-sm shadow-xl backdrop-blur-sm"
        >
          {{ toastMessage }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useShareKit } from '~/composables/useShareKit'
import { 
  SHAREABLE_TABS, 
  normalizeShareCard, 
  filterCardsByTab 
} from '~/composables/useShareableTypes'
import ShareableCard from '~/components/dashboard/shareables/ShareableCard.vue'
import ShareCustomizeDrawer from '~/components/shareables/ShareCustomizeDrawer.vue'

const props = defineProps({
  bandId: {
    type: [Number, String],
    required: true,
  },
  bandName: {
    type: String,
    required: true,
  },
  bandSlug: {
    type: String,
    required: true,
  },
  bandImageUrl: {
    type: String,
    default: null,
  },
  isBandNameInLogo: {
    type: Boolean,
    default: false,
  },
})

const config = useRuntimeConfig()
const { copyToClipboard, webShare } = useShareKit()

// State
const loading = ref(true)
const refreshing = ref(false)
const activeTab = ref('recommended')
const cards = ref([])
const recommended = ref([])
const drawerOpen = ref(false)
const activeItem = ref(null)
const toastMessage = ref('')

// Band context for normalization
const bandContext = computed(() => ({
  id: props.bandId,
  slug: props.bandSlug,
  name: props.bandName,
  imageUrl: props.bandImageUrl,
  isBandNameInLogo: props.isBandNameInLogo,
}))

// Tabs with counts
const tabsWithCounts = computed(() => {
  return SHAREABLE_TABS.map(tab => ({
    ...tab,
    count: filterCardsByTab(cards.value, tab.key).length,
  }))
})

// Filtered cards for current tab
const filteredCards = computed(() => {
  if (activeTab.value === 'recommended') {
    // Use API recommended if available, otherwise sort all by score
    return recommended.value.length > 0 
      ? recommended.value 
      : [...cards.value].sort((a, b) => (b.score || 0) - (a.score || 0))
  }
  return filterCardsByTab(cards.value, activeTab.value)
})

// Toast helper
function showToast(message, duration = 2500) {
  toastMessage.value = message
  setTimeout(() => { toastMessage.value = '' }, duration)
}

// Get band URL
function getBandUrl() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://musicbizqr.com'
  return `${origin}/${props.bandSlug}`
}

// Open customize drawer
function openCustomize(card) {
  // Transform to drawer format
  activeItem.value = {
    id: card.id,
    kind: card.type,
    source: card.category,
    accent: card.accent,
    windowLabel: card.windowLabel,
    title: card.headline,
    primaryStat: card.hero,
    secondaryStat: card.proof,
    share: {
      shareUrl: card.share?.shareUrl || getBandUrl(),
      ogUrl: card.share?.ogUrl || `${getBandUrl()}/share/band/${props.bandSlug}`,
      captions: card.microCaption,
      defaultCaptionStyle: card.selectedCaptionStyle || 'hype',
    },
    band: card.band,
  }
  drawerOpen.value = true
}

// Quick share actions
async function handleQuickShare() {
  const result = await webShare({
    title: props.bandName,
    url: getBandUrl(),
  })
  if (!result.ok) {
    handleCopyLink()
  }
}

async function handleCopyLink() {
  await copyToClipboard(getBandUrl())
  showToast('Band link copied!')
}

// Fetch data from new API
async function fetchData() {
  const strapiUrl = config.public.strapiUrl
  
  try {
    const response = await fetch(
      `${strapiUrl}/api/pulse/shareables?bandId=${props.bandId}`
    )
    const data = await response.json()
    
    if (data.ok) {
      // Normalize cards
      const allCards = (data.cards || []).map(card => 
        normalizeShareCard(card, bandContext.value)
      )
      cards.value = allCards
      
      // Normalize recommended
      recommended.value = (data.recommended || []).map(card =>
        normalizeShareCard(card, bandContext.value)
      )
    } else {
      console.warn('[ShareablesSection] API returned ok=false:', data)
      cards.value = []
      recommended.value = []
    }
  } catch (err) {
    console.error('[ShareablesSection] Failed to fetch cards:', err)
    cards.value = []
    recommended.value = []
  }
}

async function refresh() {
  refreshing.value = true
  await fetchData()
  refreshing.value = false
  showToast('Refreshed!')
}

onMounted(async () => {
  loading.value = true
  await fetchData()
  loading.value = false
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
