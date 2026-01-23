<template>
  <div class="band-page-cybered bg-black min-h-screen">
    <!-- Cybered Hero Section - Rounded with gradient overlay -->
    <div class="relative mx-auto max-w-4xl px-4">
      <div class="relative w-full aspect-[16/10] max-h-[50vh] rounded-2xl overflow-hidden mt-4">
        <img
          v-if="band.bandImg?.url"
          :src="band.bandImg.url"
          :alt="`${band.name} image`"
          class="absolute inset-0 w-full h-full object-cover"
          style="object-position: center 25%;"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <!-- Badges Row -->
        <div class="absolute top-4 left-4 right-4 flex items-center gap-2 flex-wrap z-30">
          <!-- Live Badge -->
          <div v-if="hasUpcomingEvents" class="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </span>
            Live
          </div>
          
          <!-- On Tour Badge -->
          <div v-if="hasUpcomingEvents" class="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-purple-300">
            <span>🚐</span>
            <span>On tour</span>
          </div>
          
          <!-- Genre Badge -->
          <div v-if="band.genre" class="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-white">
            {{ band.genre }}
          </div>
        </div>
      </div>
    </div>

    <!-- Content Card -->
    <div class="mx-auto max-w-4xl px-4">
      <div class="bg-black -mt-8 relative z-10">
        <!-- Band Name & Bio -->
        <div class="text-center p-6 pb-4">
          <h1 v-if="!band.isBandNameInLogo" class="text-3xl md:text-4xl font-bold text-white">
            {{ band.name }}
          </h1>
          <p v-if="band.bio" class="text-white/60 text-sm mt-2 max-w-xl mx-auto">
            {{ band.bio }}
          </p>
          <p v-if="band.biotagline" class="text-purple-400 text-sm mt-1">
            {{ band.biotagline }}
          </p>
        </div>

        <!-- Live Surface Components -->
        <div class="px-6">
          <!-- Show Day Header -->
          <div v-if="hasUpcomingEvents" class="mb-4">
            <ShowDayHeader
              :event="nextEvent"
              :has-pay-entry="enabledPaymentButtons.length > 0"
              @tickets="$emit('view-event', nextEvent)"
              @pay-entry="scrollToSupport"
            />
          </div>

          <!-- NOW Banner -->
          <div class="mb-4">
            <NowBanner
              :state="nowBannerState"
              :content="nowBannerContent"
              @cta-click="handleBannerCta"
              @scroll-to="handleScrollTo"
              @share="$emit('share')"
            />
          </div>

          <!-- Continue Chip -->
          <div class="mb-4">
            <ContinueChip
              :band-slug="band.slug"
              @continue="handleContinueAction"
            />
          </div>

          <!-- Live Feed -->
          <div v-if="hasLiveFeedItems" class="mb-4">
            <LiveFeed
              :feed-items="liveFeedItems"
              :primary-feed-item="primaryFeedItem"
              :has-feed-items="hasLiveFeedItems"
              display-mode="single"
            />
          </div>
        </div>

        <!-- Main Content Sections -->
        <div class="p-6 space-y-6">
          <!-- Featured Song - Card Style with inline audio player -->
          <section v-if="hasFeaturedSong">
            <!-- Only show heading for direct audio files, not embeds -->
            <h3 v-if="!isEmbedSong" class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Featured Song</h3>
            
            <!-- Embedded player (Spotify, SoundCloud, etc.) - no extra heading/title -->
            <div v-if="isEmbedSong && embedHtml" class="rounded-xl overflow-hidden">
              <div class="w-full" v-html="embedHtml" />
            </div>
            
            <!-- Direct audio file player -->
            <div v-else class="bg-white/5 border border-white/10 rounded-xl p-4">
              <div class="flex items-center gap-4">
                <div class="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <img 
                    v-if="songCoverUrl" 
                    :src="songCoverUrl" 
                    alt="Album art" 
                    class="w-full h-full object-cover" 
                  />
                  <div v-else class="w-full h-full bg-purple-500/20 flex items-center justify-center">
                    <svg class="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-white font-semibold">{{ songTitle }}</div>
                  <div class="text-white/50 text-sm">{{ band.name }}</div>
                </div>
                <button 
                  v-if="songUrl"
                  @click="toggleAudio"
                  class="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 transition shrink-0"
                >
                  <svg v-if="!isPlaying" class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                </button>
                <div v-else class="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300/50 shrink-0">
                  <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <!-- Hidden audio element -->
              <audio 
                v-if="songUrl"
                ref="audioPlayer" 
                :src="songUrl"
                @play="onAudioPlay"
                @pause="onAudioPause"
                @ended="onAudioEnded"
              />
            </div>
          </section>

          <!-- Featured Video - Card Style (matches preview) -->
          <section v-if="hasVideo">
            <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Featured Video</h3>
            
            <!-- Video Thumbnail (before playing) -->
            <div 
              v-if="!isVideoPlaying"
              class="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer"
              @click="playVideo"
            >
              <img 
                v-if="videoThumbnail" 
                :src="videoThumbnail" 
                :alt="`${band.name} video thumbnail`" 
                class="absolute inset-0 w-full h-full object-cover opacity-60" 
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 hover:bg-white/20 transition">
                  <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div class="absolute bottom-3 left-3">
                <div class="text-white font-semibold text-sm">{{ videoTitle }}</div>
                <div class="text-white/60 text-xs">{{ band.name }}</div>
              </div>
            </div>
            
            <!-- Video Player (after clicking play) -->
            <div 
              v-else
              class="relative aspect-video rounded-xl overflow-hidden bg-black"
            >
              <iframe
                :src="videoEmbedUrl"
                class="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowfullscreen
              />
            </div>
          </section>

          <!-- Website Link -->
          <section v-if="band.websitelink">
            <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Website</h3>
            <a
              :href="band.websitelink"
              target="_blank"
              rel="noopener"
              class="text-purple-400 hover:text-purple-300 transition"
            >
              {{ band.websitelinktext || band.websitelink }}
            </a>
          </section>

          <!-- Streaming Links - Modern Cards -->
          <section v-if="hasStreamingLinks">
            <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Streaming</h3>
            <div class="space-y-2">
              <template v-for="platform in streamingPlatforms" :key="platform.name">
                <a
                  v-if="band[platform.name] && !isLinkHidden(platform.name)"
                  :href="band[platform.name]"
                  @click.prevent="$emit('link-click', { name: platform.name, url: band[platform.name] })"
                  class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
                >
                  <img :src="platform.img" :alt="platform.label" class="w-6 h-6 shrink-0" />
                  <span class="text-white font-medium">{{ platform.label }}</span>
                </a>
              </template>
            </div>
          </section>

          <!-- Social Links - Modern Cards -->
          <section v-if="hasSocialLinks">
            <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Social</h3>
            <div class="space-y-2">
              <template v-for="platform in socialPlatforms" :key="platform.name">
                <a
                  v-if="band[platform.name] && !isLinkHidden(platform.name)"
                  :href="band[platform.name]"
                  @click.prevent="$emit('link-click', { name: platform.name, url: band[platform.name] })"
                  class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
                >
                  <img :src="platform.img" :alt="platform.label" class="w-6 h-6 shrink-0" />
                  <span class="text-white font-medium">{{ platform.label }}</span>
                </a>
              </template>
            </div>
          </section>

          <!-- Upcoming Events - Modern Cards -->
          <section v-if="hasUpcomingEvents" ref="eventsSection">
            <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Upcoming Shows</h3>
            <div class="space-y-2">
              <div 
                v-for="event in upcomingEvents.slice(0, 3)" 
                :key="event.id"
                class="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
              >
                <div>
                  <div class="text-white font-medium">{{ event.city }}<span v-if="event.state">, {{ event.state }}</span></div>
                  <div class="text-white/50 text-sm">{{ event.venue }} • {{ formatEventDate(event.date) }}</div>
                </div>
                <button 
                  @click="$emit('view-event', event)"
                  class="px-3 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-200 text-sm font-medium hover:bg-purple-500/30 transition"
                >
                  {{ event.ticketLink ? 'Tickets' : 'Details' }}
                </button>
              </div>
            </div>
          </section>

          <!-- Support Module -->
          <section v-if="enabledPaymentButtons.length > 0" ref="supportSection">
            <SupportModule 
              :band-name="band.name"
              :show-quick-tips="true"
              :quick-tip-amounts="[5, 10, 20]"
              :page-mode="'QUIET'"
              :payment-buttons="enabledPaymentButtons"
              @quick-tip="$emit('quick-tip', $event)"
            />
          </section>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-3 gap-3 p-6 pt-0">
          <button 
            @click="$emit('follow')"
            class="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-gradient-to-b from-purple-600/20 to-purple-600/5 border border-purple-500/30 hover:from-purple-600/30 transition"
          >
            <svg class="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span class="text-xs font-semibold text-white">Follow</span>
          </button>
          <button 
            @click="$emit('save')"
            class="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <span class="text-xs font-semibold text-white">Save</span>
          </button>
          <button 
            @click="$emit('share')"
            class="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span class="text-xs font-semibold text-white">Share</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getDemoFlag } from '@/composables/useDemoFlags'

// Live Surface Components
import ShowDayHeader from '@/components/smartlink/ShowDayHeader.vue'
import NowBanner from '@/components/smartlink/NowBanner.vue'
import ContinueChip from '@/components/smartlink/ContinueChip.vue'
import LiveFeed from '@/components/smartlink/LiveFeed.vue'
import SupportModule from '@/components/smartlink/SupportModule.vue'

// Platform icons
import spotifyIcon from '@/assets/spotify.svg'
import appleMusicIcon from '@/assets/apple.svg'
import youtubeIcon from '@/assets/youtube-icon.svg'
import youtubeMusicIcon from '@/assets/youtube-icon.svg'
import soundcloudIcon from '@/assets/soundcloudlast.png'
import bandcampIcon from '@/assets/bandcamp.svg'
import deezerIcon from '@/assets/dezzer.svg'
import twitchIcon from '@/assets/twitchfree.png'
import reverbnationIcon from '@/assets/reverbnation.png'
import facebookIcon from '@/assets/facebookfree.png'
import instagramIcon from '@/assets/instagramfree.png'
import twitterIcon from '@/assets/twitter.png'
import tiktokIcon from '@/assets/tiktok.png'

const props = defineProps({
  band: { type: Object, required: true },
  upcomingEvents: { type: Array, default: () => [] },
  hiddenLinks: { type: Array, default: () => [] },
  enabledPaymentButtons: { type: Array, default: () => [] },
  followablePlatforms: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'play-song',
  'play-video',
  'link-click',
  'view-event',
  'quick-tip',
  'follow',
  'save',
  'share',
  'scroll-to-support',
])

const eventsSection = ref(null)
const supportSection = ref(null)
const audioPlayer = ref(null)
const isPlaying = ref(false)
const isVideoPlaying = ref(false)

// Computed
const hasUpcomingEvents = computed(() => props.upcomingEvents.length > 0)
const nextEvent = computed(() => props.upcomingEvents[0] || null)
const hasFeaturedSong = computed(() => !!props.band.singlesong)
const hasVideo = computed(() => !!props.band.singlevideo?.youtubeid)
const videoTitle = computed(() => props.band.singlevideo?.title || 'Featured Video')
const videoThumbnail = computed(() => {
  const youtubeId = props.band.singlevideo?.youtubeid
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
  }
  return props.band.bandImg?.url || null
})
const videoEmbedUrl = computed(() => {
  const youtubeId = props.band.singlevideo?.youtubeid
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`
  }
  return null
})

const songTitle = computed(() => props.band.singlesong?.title || 'Featured Track')
const songCoverUrl = computed(() => props.band.singlesong?.cover?.url || props.band.bandImg?.url || null)
const isEmbedSong = computed(() => !!props.band.singlesong?.isEmbed)
const embedHtml = computed(() => props.band.singlesong?.embedHtml || null)
const songUrl = computed(() => {
  // Get the song file URL for playback (matches formatSingleSong logic)
  const song = props.band.singlesong
  if (!song) return null
  const nestedUrl = song?.song?.data?.attributes?.url
  const directUrl = song?.song?.url
  return nestedUrl || directUrl || null
})

const hasStreamingLinks = computed(() => 
  streamingPlatforms.some(p => !!props.band[p.name] && !isLinkHidden(p.name))
)
const hasSocialLinks = computed(() => 
  socialPlatforms.some(p => !!props.band[p.name] && !isLinkHidden(p.name))
)

// Live Feed Data
const liveFeedItems = ref([])
const hasLiveFeedItems = computed(() => liveFeedItems.value.length > 0)
const primaryFeedItem = computed(() => liveFeedItems.value[0] || null)

// NOW Banner
const nowBannerState = computed(() => {
  if (hasUpcomingEvents.value) return 'ON_TOUR'
  return 'QUIET_DEFAULT'
})

const nowBannerContent = computed(() => ({
  icon: '',
  headline: hasUpcomingEvents.value ? 'On Tour' : 'Discover',
  subtext: hasUpcomingEvents.value 
    ? `${props.upcomingEvents.length} upcoming show${props.upcomingEvents.length > 1 ? 's' : ''}`
    : 'Check out the latest music',
  accent: 'purple',
  cta: hasUpcomingEvents.value ? 'See Dates' : 'Listen Now',
  ctaAction: hasUpcomingEvents.value ? 'scroll-to-events' : 'scroll-to-streaming'
}))

// Platform definitions
const streamingPlatforms = [
  { name: 'youtube', img: youtubeIcon, label: 'YouTube' },
  { name: 'youtubeMusic', img: youtubeMusicIcon, label: 'YouTube Music' },
  { name: 'spotify', img: spotifyIcon, label: 'Spotify' },
  { name: 'appleMusic', img: appleMusicIcon, label: 'Apple Music' },
  { name: 'reverbnation', img: reverbnationIcon, label: 'Reverbnation' },
  { name: 'soundcloud', img: soundcloudIcon, label: 'SoundCloud' },
  { name: 'bandcamp', img: bandcampIcon, label: 'Bandcamp' },
  { name: 'twitch', img: twitchIcon, label: 'Twitch' },
  { name: 'deezer', img: deezerIcon, label: 'Deezer' },
]

const socialPlatforms = [
  { name: 'facebook', img: facebookIcon, label: 'Facebook' },
  { name: 'instagram', img: instagramIcon, label: 'Instagram' },
  { name: 'twitter', img: twitterIcon, label: 'Twitter' },
  { name: 'tiktok', img: tiktokIcon, label: 'TikTok' },
]

// Methods
function isLinkHidden(linkName) {
  return props.hiddenLinks.includes(linkName)
}

function formatEventDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function scrollToSupport() {
  supportSection.value?.scrollIntoView({ behavior: 'smooth' })
}

function handleBannerCta(action) {
  if (action.action === 'scroll-to-events' && nextEvent.value) {
    // Navigate to event page instead of scrolling
    emit('view-event', nextEvent.value)
  }
}

function handleScrollTo(section) {
  if (section === 'events' && nextEvent.value) {
    // Navigate to event page instead of scrolling
    emit('view-event', nextEvent.value)
  }
}

function handleContinueAction(action) {
  // Handle continue chip action
}

// Audio player methods
async function toggleAudio() {
  if (!audioPlayer.value) return
  
  if (isPlaying.value) {
    audioPlayer.value.pause()
  } else {
    try {
      await audioPlayer.value.play()
      emit('play-song')
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }
}

function onAudioPlay() {
  isPlaying.value = true
}

function onAudioPause() {
  isPlaying.value = false
}

function onAudioEnded() {
  isPlaying.value = false
}

// Video player methods
function playVideo() {
  isVideoPlaying.value = true
  emit('play-video')
}
</script>

<style scoped>
.band-page-cybered {
  background: linear-gradient(to bottom, #000 0%, #0a0a0a 100%);
}
</style>
