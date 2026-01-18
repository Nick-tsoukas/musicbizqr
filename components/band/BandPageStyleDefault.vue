<template>
  <div class="band-style-default w-full">
    <!-- Hero Section with Style Toggle -->
    <div class="relative">
      <!-- Style Toggle Button -->
      <div class="absolute top-4 right-4 z-30">
        <div class="flex gap-2">
          <button
            @click="imageStyle = 'compact'"
            :class="imageStyle === 'compact' ? 'bg-purple-500 text-white' : 'bg-white/20 text-white/70'"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-white/20"
          >
            Compact
          </button>
          <button
            @click="imageStyle = 'bold'"
            :class="imageStyle === 'bold' ? 'bg-purple-500 text-white' : 'bg-white/20 text-white/70'"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-white/20"
          >
            Bold
          </button>
        </div>
      </div>

      <!-- Compact Style Hero -->
      <div v-if="imageStyle === 'compact'" class="relative w-full aspect-[16/10] max-h-[50vh] rounded-t-xl overflow-hidden">
        <img 
          :src="neonPoster" 
          alt="Neon Avenue" 
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <!-- Live Badge -->
        <div class="absolute top-4 left-4">
          <div class="flex items-center gap-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </span>
            Live Shows
          </div>
        </div>
        
        <!-- Artist Info Overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Neon Avenue
          </h1>
          <p class="text-white/80 text-sm md:text-base mt-2 line-clamp-2">
            Indie pop for night drives and neon signs. New single out now — tap play below.
          </p>
        </div>
        
        <!-- MomentBadges Overlay -->
        <div class="absolute top-8 left-6 z-30">
          <MomentBadges
            :is-on-tour="true"
            :has-new-release="true"
          />
        </div>
      </div>

      <!-- Bold Style Hero -->
      <div v-else-if="imageStyle === 'bold'" class="relative w-full h-screen max-h-[70vh] rounded-t-xl overflow-hidden">
        <!-- Background Image with Blur Layer -->
        <div class="absolute inset-0">
          <img
            :src="neonPoster"
            alt="Neon Avenue image"
            class="absolute inset-0 w-full h-full object-cover scale-110 blur-sm opacity-40"
          />
        </div>
        
        <!-- Main Image -->
        <img
          :src="neonPoster"
          alt="Neon Avenue image"
          class="absolute inset-0 w-full h-full object-contain"
        />
        
        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        <div class="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20" />
        
        <!-- Floating Genre Badge -->
        <div class="absolute top-6 left-6">
          <div class="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
            Indie Pop
          </div>
        </div>
        
        <!-- Artist Info -->
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Neon Avenue
          </h1>
          <p class="text-white/90 text-lg md:text-xl max-w-2xl">
            Indie pop for night drives and neon signs. New single out now — tap play below.
          </p>
        </div>
        
        <!-- MomentBadges Overlay -->
        <div class="absolute top-8 left-6 z-30">
          <MomentBadges
            :is-on-tour="true"
            :has-new-release="true"
          />
        </div>
      </div>

      <!-- Default Style Hero (Original) -->
      <div v-else class="relative aspect-[16/9] rounded-t-xl overflow-hidden">
        <img 
          :src="neonPoster" 
          alt="Neon Avenue" 
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <!-- MomentBadges Overlay -->
        <div class="absolute top-8 left-6 z-30">
          <MomentBadges
            :is-on-tour="true"
            :has-new-release="true"
          />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-black border-x border-b border-white/10 rounded-b-xl">
      <!-- ============================================ -->
      <!-- SMART LINK LIVE SURFACE COMPONENTS -->
      <!-- ============================================ -->

      <!-- V2: Show Day Header -->
      <div class="w-full px-6 mt-4 md:max-w-[80vw] md:mx-auto">
        <ShowDayHeader
          :event="nextEvent"
          :has-pay-entry="true"
          @tickets="handleTicketClick"
          @pay-entry="scrollToSupport"
        />
      </div>

      <!-- NOW Banner -->
      <div class="w-full px-6 mt-6 md:max-w-[80vw] md:mx-auto">
        <NowBanner
          state="ON_TOUR"
          :content="nowBannerContent"
          @cta-click="handleBannerCta"
          @scroll-to="handleScrollTo"
          @share="handleShare"
        />
      </div>

      <!-- Continue Chip -->
      <div class="w-full px-6 mt-4 md:max-w-[80vw] md:mx-auto">
        <ContinueChip
          band-slug="neon-avenue"
          @continue="handleContinueAction"
        />
      </div>

      <!-- Live Feed -->
      <div class="w-full px-6 mt-4 md:max-w-[80vw] md:mx-auto">
        <LiveFeed
          :feed-items="liveFeedItems"
          :primary-feed-item="primaryFeedItem"
          :has-feed-items="hasLiveFeedItems"
          display-mode="single"
        />
      </div>

      <!-- Main Content -->
      <div class="p-5 space-y-6">
        <!-- Band Name & Bio -->
        <div class="text-center">
          <h2 class="text-2xl font-bold text-white">Neon Avenue</h2>
          <p class="text-white/60 text-sm mt-2">Indie pop for night drives and neon signs.</p>
          <p class="text-purple-400 text-sm mt-1">New single out now — tap play below.</p>
        </div>

        <!-- Featured Song -->
        <div>
          <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Featured Song</h3>
          <div class="bg-white/5 border border-white/10 rounded-xl p-4">
            <div class="flex items-center gap-4">
              <div class="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <img :src="neonPoster" alt="Album art" class="w-full h-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-white font-semibold">Turns Me On</div>
                <div class="text-white/50 text-sm">New Single</div>
              </div>
              <button class="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 transition">
                <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Featured Video -->
        <div>
          <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Featured Video</h3>
          <div class="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
            <img :src="neonPoster" alt="Video thumbnail" class="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div class="absolute bottom-3 left-3">
              <div class="text-white font-semibold text-sm">Live at The Echo</div>
              <div class="text-white/60 text-xs">2:14 highlight</div>
            </div>
          </div>
        </div>

        <!-- Streaming Links -->
        <div>
          <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Streaming</h3>
          <div class="space-y-2">
            <button class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
              <img :src="spotifyIcon" alt="Spotify" class="w-6 h-6" />
              <span class="text-white font-medium">Spotify</span>
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
              <img :src="appleMusicIcon" alt="Apple Music" class="w-6 h-6" />
              <span class="text-white font-medium">Apple Music</span>
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
              <img :src="youtubeIcon" alt="YouTube" class="w-6 h-6" />
              <span class="text-white font-medium">YouTube</span>
            </button>
          </div>
        </div>

        <!-- Social Links -->
        <div>
          <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Social</h3>
          <div class="space-y-2">
            <button class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
              <img :src="instagramIcon" alt="Instagram" class="w-6 h-6" />
              <span class="text-white font-medium">Instagram</span>
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
              <img :src="tiktokIcon" alt="TikTok" class="w-6 h-6" />
              <span class="text-white font-medium">TikTok</span>
            </button>
          </div>
        </div>

        <!-- Upcoming Shows -->
        <div ref="eventsSection">
          <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Upcoming Shows</h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <div class="text-white font-medium">Los Angeles, CA</div>
                <div class="text-white/50 text-sm">The Troubadour • Feb 21</div>
              </div>
              <button class="px-3 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-200 text-sm font-medium">
                Tickets
              </button>
            </div>
            <div class="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <div class="text-white font-medium">San Francisco, CA</div>
                <div class="text-white/50 text-sm">The Fillmore • Mar 8</div>
              </div>
              <button class="px-3 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-200 text-sm font-medium">
                Tickets
              </button>
            </div>
          </div>
        </div>

        <!-- Support Module -->
        <div ref="supportSection">
          <SupportModule 
            :band-name="'Neon Avenue'"
            :show-quick-tips="true"
            :quick-tip-amounts="[5, 10, 20]"
            :page-mode="'QUIET'"
            :payment-buttons="[]"
            @quick-tip="handleSupport"
          />
        </div>
      </div>
    </div>

    <!-- Fan Toasts -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in activeToasts"
          :key="toast.id"
          class="bg-black/80 backdrop-blur text-white px-4 py-3 rounded-lg border border-white/20 shadow-lg"
        >
          <div class="flex items-center gap-3">
            <span class="text-lg">{{ toast.icon }}</span>
            <span class="text-sm font-medium">{{ toast.message }}</span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import neonPoster from '@/assets/neonposter.png'
import spotifyIcon from '@/assets/spotify.svg'
import appleMusicIcon from '@/assets/apple.svg'
import youtubeIcon from '@/assets/youtube-icon.svg'
import instagramIcon from '@/assets/instagramfree.png'
import tiktokIcon from '@/assets/tiktok.png'

// Live Surface Components
import MomentBadges from '~/components/smartlink/MomentBadges.vue'
import ShowDayHeader from '~/components/smartlink/ShowDayHeader.vue'
import NowBanner from '~/components/smartlink/NowBanner.vue'
import ContinueChip from '~/components/smartlink/ContinueChip.vue'
import LiveFeed from '~/components/smartlink/LiveFeed.vue'
import SupportModule from '~/components/smartlink/SupportModule.vue'
import FanToast from '~/components/smartlink/FanToast.vue'

// Image Style State
const imageStyle = ref('default')

// Data
const eventsSection = ref(null)
const supportSection = ref(null)
const activeToasts = ref([])
const liveFeedItems = ref([])

const events = [
  { id: 1, date: 'Fri · Feb 21', venue: 'The Echo', city: 'Los Angeles', state: 'CA' },
  { id: 2, date: 'Sat · Mar 08', venue: 'Brick & Mortar', city: 'San Francisco', state: 'CA' },
  { id: 3, date: 'Thu · Apr 10', venue: 'Mohawk', city: 'Austin', state: 'TX' },
]

const nextEvent = computed(() => events.length ? events[0] : null)

const nowBannerContent = {
  icon: '',
  headline: 'On Tour',
  subtext: '3 upcoming shows across the west coast',
  accent: 'purple',
  cta: 'See Dates',
  ctaAction: 'scroll-to-events'
}

const hasLiveFeedItems = computed(() => liveFeedItems.value.length > 0)
const primaryFeedItem = computed(() => liveFeedItems.value[0] || null)

// Generate initial feed items
onMounted(() => {
  const feedItems = [
    { id: 1, icon: '📍', copy: 'Los Angeles tuning in', type: 'city', timestamp: Date.now() - 5000 },
    { id: 2, icon: '🎵', copy: 'Turns Me On played', type: 'song_play', timestamp: Date.now() - 15000 },
    { id: 3, icon: '👤', copy: 'New follower', type: 'new_follower', timestamp: Date.now() - 30000 },
  ]
  liveFeedItems.value = feedItems
})

// Event Handlers
function handleTicketClick() {
  showToast({ icon: '🎫', message: 'Opening ticket page...' })
}

function handleBannerCta(action) {
  if (action.action === 'scroll-to-events') {
    eventsSection.value?.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleScrollTo(section) {
  if (section === 'events') {
    eventsSection.value?.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleShare() {
  showToast({ icon: '📤', message: 'Share options opened...' })
}

function handleContinueAction(action) {
  showToast({ icon: '▶️', message: 'Continuing on YouTube...' })
}

function handleSupport(amount) {
  showToast({ icon: '💜', message: `Thank you for supporting!` })
}

function showToast(toast) {
  const toastWithId = { ...toast, id: Date.now() }
  activeToasts.value.push(toastWithId)
  
  setTimeout(() => {
    const index = activeToasts.value.findIndex(t => t.id === toastWithId.id)
    if (index > -1) {
      activeToasts.value.splice(index, 1)
    }
  }, 3000)
}
</script>

<style scoped>
.band-style-default {
  box-shadow: 
    0 0 60px rgba(139, 92, 246, 0.1),
    0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
