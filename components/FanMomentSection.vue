<template>
  <!-- Toast notification -->
  <Transition name="fade">
    <div
      v-if="toastMessage"
      class="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-black/90 border border-white/20 text-white text-sm shadow-lg"
    >
      {{ toastMessage }}
    </div>
  </Transition>

  <!-- Show full moment UI when moment exists -->
  <section
    v-if="moment"
    class="mt-10 px-4 pb-10"
  >
    <div class="max-w-md mx-auto">
      <div class="text-center text-white/50 text-xs uppercase tracking-wider mb-3">
        Your Moment
      </div>
      
      <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/30 via-black/40 to-emerald-900/20 p-5">
        <!-- Headline -->
        <div class="text-center">
          <div class="text-2xl font-bold text-white mb-1">
            {{ momentHeadline }}
          </div>
          <div class="text-white/70 text-sm">
            {{ momentSubtext }}
          </div>
        </div>
        
        <!-- Context -->
        <div class="mt-4 text-center">
          <div class="text-lg font-semibold text-purple-300">
            {{ moment.context.bandName }}
          </div>
          <div v-if="fanPositionText" class="text-emerald-400/80 text-sm mt-1 font-medium">
            {{ fanPositionText }}
          </div>
          <div v-if="locationText" class="text-white/60 text-sm mt-1">
            {{ locationText }}
          </div>
          <div v-if="moment.context.eventName" class="text-white/50 text-xs mt-1">
            {{ moment.context.eventName }}
          </div>
          <div v-if="moment.context.velocity" class="text-orange-400/70 text-xs mt-1">
            {{ moment.context.velocity }}x activity right now
          </div>
        </div>
        
        <!-- Caption Style Toggle -->
        <div class="mt-4 mb-4">
          <div class="text-white/40 text-xs uppercase tracking-wider mb-2">Caption Style</div>
          <div class="flex gap-2 justify-center">
            <button
              v-for="variant in captionVariants"
              :key="variant.key"
              @click="captionStyle = variant.key"
              :class="[
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                captionStyle === variant.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              ]"
            >
              {{ variant.label }}
            </button>
          </div>
          <div class="mt-2 p-2 bg-black/30 rounded-lg text-white/80 text-sm italic text-center">
            "{{ selectedCaption }}"
          </div>
        </div>
        
        <!-- Share Buttons -->
        <div class="mt-4 space-y-3">
          <button
            @click="handleShare"
            :disabled="sharing"
            class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 text-white font-semibold text-sm hover:from-purple-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg v-if="!sharing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span v-if="sharing">Sharing...</span>
            <span v-else>Share this moment</span>
          </button>
          
          <!-- Social Share Kit row -->
          <div class="flex items-center justify-center gap-2 flex-wrap">
            <!-- Copy Link -->
            <button
              @click="handleCopyLink"
              class="px-3 py-1.5 rounded-lg border border-white/15 text-white/70 text-xs hover:bg-white/5 transition-colors flex items-center gap-1.5"
              title="Copy link"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Link</span>
            </button>
            
            <!-- Copy Caption -->
            <button
              @click="handleCopyCaption"
              class="px-3 py-1.5 rounded-lg border border-white/15 text-white/70 text-xs hover:bg-white/5 transition-colors flex items-center gap-1.5"
              title="Copy caption"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Caption</span>
            </button>
            
            <!-- Download Image -->
            <button
              @click="handleDownloadImage"
              :disabled="downloadingImage"
              class="px-3 py-1.5 rounded-lg border border-white/15 text-white/70 text-xs hover:bg-white/5 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Download image"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Image</span>
            </button>
            
            <!-- Instagram helper -->
            <button
              @click="handleInstagramKit"
              :disabled="preparingIG"
              class="px-3 py-1.5 rounded-lg border border-pink-500/30 text-pink-400/80 text-xs hover:bg-pink-500/10 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Prepare for Instagram"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>{{ preparingIG ? '...' : 'IG' }}</span>
            </button>
            
            <!-- Facebook helper -->
            <button
              @click="handleFacebookShare"
              class="px-3 py-1.5 rounded-lg border border-blue-500/30 text-blue-400/80 text-xs hover:bg-blue-500/10 transition-colors flex items-center gap-1.5"
              title="Share on Facebook"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>FB</span>
            </button>
          </div>
        </div>
        
        <!-- Decorative elements -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      </div>
    </div>
    
    <!-- Hidden canvas for image generation -->
    <canvas ref="canvasRef" class="hidden" width="1080" height="1080"></canvas>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useVisitorSession } from '@/composables/useVisitorSession'
import { useShareKit } from '@/composables/useShareKit'

const props = defineProps({
  bandId: {
    type: Number,
    required: true,
  },
  bandSlug: {
    type: String,
    required: true,
  },
  bandName: {
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
  pulseData: {
    type: Object,
    default: null,
  },
})

const config = useRuntimeConfig()
const { getOrCreateVisitorId, getOrCreateSessionId } = useVisitorSession()
const {
  buildShareUrl,
  buildCaption,
  buildShareText,
  generateShareImage,
  webShare,
  copyToClipboard,
  downloadBlob,
  openFacebookSharer,
  getShareFilename,
} = useShareKit()

const moment = ref(null)
const sharing = ref(false)
const downloadingImage = ref(false)
const preparingIG = ref(false)
const canvasRef = ref(null)
const hasEarnedThisSession = ref(false)
const toastMessage = ref('')
const cachedImageBlob = ref(null)
const captionStyle = ref('hype')

// Caption variants
const captionVariants = [
  { key: 'hype', label: '🔥 Hype' },
  { key: 'grateful', label: '🙏 Grateful' },
  { key: 'tease', label: '👀 Tease' },
]

// Generate caption based on style
const selectedCaption = computed(() => {
  if (!moment.value) return ''
  const bandName = props.bandName || 'the band'
  const baseText = moment.value.share?.text || moment.value.shareText || ''
  const actionType = moment.value.actionType || ''
  
  switch (captionStyle.value) {
    case 'hype':
      if (actionType === 'qr_scan') return `I was there for ${bandName} 🔥 Live show energy!`
      if (actionType === 'link_click') return `Just discovered ${bandName} 🔥 You need to check them out!`
      if (actionType === 'follow') return `Just followed ${bandName} 🔥 Join the fanbase!`
      if (actionType === 'payment') return `I backed ${bandName} 🔥 Real fans support real music!`
      return `I was part of the moment for ${bandName} 🔥`
    case 'grateful':
      if (actionType === 'qr_scan') return `Thanks for the show ${bandName} 🙏 Incredible night.`
      if (actionType === 'payment') return `Proud to support ${bandName} 🙏 Every bit helps.`
      return `Grateful to be part of ${bandName}'s journey 🙏`
    case 'tease':
      if (actionType === 'qr_scan') return `${bandName}… that was just the beginning 👀`
      return `Something's happening with ${bandName}… stay close 👀`
    default:
      return baseText
  }
})

// Computed - use rich share content from API
const momentHeadline = computed(() => {
  if (!moment.value) return ''
  // Use the rich share title from API, fallback to legacy logic
  if (moment.value.share?.title) {
    return moment.value.share.title
  }
  return moment.value.momentType === 'FUELED_MOMENTUM'
    ? 'You fueled the moment'
    : 'You were part of this moment'
})

const momentSubtext = computed(() => {
  if (!moment.value) return ''
  // Use the rich share subtitle from API, fallback to legacy logic
  if (moment.value.share?.subtitle) {
    return moment.value.share.subtitle
  }
  // Use triggerReason as fallback
  if (moment.value.triggerReason) {
    return moment.value.triggerReason
  }
  return moment.value.momentType === 'FUELED_MOMENTUM'
    ? 'Your action helped tonight\'s momentum.'
    : 'Thanks for showing up.'
})

const momentEmoji = computed(() => {
  if (!moment.value) return '✨'
  return moment.value.share?.emoji || '✨'
})

const momentCallToAction = computed(() => {
  if (!moment.value) return 'Check them out'
  return moment.value.share?.callToAction || 'Check them out'
})

const fanPositionText = computed(() => {
  if (!moment.value?.fanPosition) return ''
  const pos = moment.value.fanPosition
  if (pos <= 10) return `Fan #${pos} today`
  if (pos <= 50) return `One of the first ${pos} fans today`
  if (pos <= 100) return `Top 100 fans today`
  return ''
})

const locationText = computed(() => {
  if (!moment.value?.context) return ''
  const { city, state, cityName } = moment.value.context
  // cityName is used for CITY_HEAT moments
  if (cityName) return cityName
  if (city && state) return `${city}, ${state}`
  if (city) return city
  if (state) return state
  return ''
})

// Check local cooldown (24h per band)
function checkLocalCooldown() {
  if (typeof window === 'undefined') return false
  const key = `fan_moment_${props.bandId}`
  const lastAt = localStorage.getItem(key)
  if (!lastAt) return false
  const lastTime = new Date(lastAt).getTime()
  const now = Date.now()
  return (now - lastTime) < 24 * 60 * 60 * 1000
}

function setLocalCooldown() {
  if (typeof window === 'undefined') return
  const key = `fan_moment_${props.bandId}`
  localStorage.setItem(key, new Date().toISOString())
}

// Check for existing active moment
async function checkActiveMoment() {
  const visitorId = getOrCreateVisitorId()
  if (!visitorId || !props.bandId) return

  try {
    const res = await fetch(
      `${config.public.strapiUrl}/api/fan-moments/active?bandId=${props.bandId}&visitorId=${visitorId}`
    )
    const data = await res.json()
    if (data.ok && data.moment) {
      moment.value = data.moment
    }
  } catch (err) {
    console.error('[FanMomentSection] Failed to check active moment:', err)
  }
}

// Earn a new moment
async function earnMoment(actionType, context = {}) {
  // Prevent multiple earns per session
  if (hasEarnedThisSession.value) return
  if (moment.value) return
  
  // Check local cooldown
  if (checkLocalCooldown()) return

  const visitorId = getOrCreateVisitorId()
  const sessionId = getOrCreateSessionId()
  if (!visitorId || !props.bandId) return

  hasEarnedThisSession.value = true

  try {
    const res = await fetch(`${config.public.strapiUrl}/api/fan-moments/earn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bandId: props.bandId,
        actionType,
        visitorId,
        sessionId,
        context: {
          bandName: props.bandName,
          ...context,
        },
        pulse: props.pulseData || null,
      }),
    })

    const data = await res.json()
    if (data.ok && data.moment) {
      moment.value = data.moment
      setLocalCooldown()
      
      // Track moment earned
      trackEvent('fan_moment_earned', {
        bandId: props.bandId,
        momentType: data.moment.momentType,
        actionType,
      })
    }
  } catch (err) {
    console.error('[FanMomentSection] Failed to earn moment:', err)
    hasEarnedThisSession.value = false
  }
}

// Track event (privacy-safe)
function trackEvent(eventName, payload) {
  try {
    const apiUrl = `${config.public.strapiUrl}/api/band-ui-events/track`
    const data = {
      bandId: payload.bandId,
      bandSlug: null,
      eventName,
      payload,
    }
    
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      navigator.sendBeacon(apiUrl, blob)
    } else {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {})
    }
  } catch (err) {
    // Silent fail
  }
}

// Toast helper
function showToast(message, duration = 2000) {
  toastMessage.value = message
  setTimeout(() => { toastMessage.value = '' }, duration)
}

// Get share URL
function getShareUrl() {
  return buildShareUrl({ bandSlug: props.bandSlug })
}

// Get moment-specific caption (uses selected caption style)
function getMomentCaption() {
  if (!moment.value) return ''
  // Use the selected caption from caption style toggle
  return selectedCaption.value || buildCaption({
    bandName: moment.value.context.bandName || props.bandName,
    momentType: moment.value.momentType,
  })
}

// Get share text with URL
function getShareTextWithUrl() {
  if (!moment.value) return ''
  return buildShareText({
    bandName: moment.value.context.bandName || props.bandName,
    shareUrl: getShareUrl(),
    momentType: moment.value.momentType,
  })
}

// Get filename for download
function getFilename() {
  return getShareFilename(props.bandSlug, 'moment')
}

// Generate or get cached image
async function getOrGenerateImage() {
  if (!moment.value) return null
  if (cachedImageBlob.value) return cachedImageBlob.value
  
  const blob = await generateShareImage({
    canvasEl: canvasRef.value,
    bandName: moment.value.context.bandName || props.bandName,
    bandImageUrl: props.bandImageUrl,
    momentTitle: momentHeadline.value,
    subtitle: locationText.value,
    isBandNameInLogo: props.isBandNameInLogo,
  })
  
  if (blob) {
    cachedImageBlob.value = blob
    // Clear cache after 30 seconds
    setTimeout(() => { cachedImageBlob.value = null }, 30000)
  }
  
  return blob
}

// Main share handler (Web Share API)
async function handleShare() {
  if (!moment.value) return
  sharing.value = true
  
  try {
    const shareUrl = getShareUrl()
    const shareText = getShareTextWithUrl()
    const imageBlob = await getOrGenerateImage()
    
    const result = await webShare({
      title: moment.value.share?.title || props.bandName,
      text: shareText,
      url: shareUrl,
      imageBlob,
      filename: getFilename(),
    })
    
    if (result.ok) {
      recordShare('WEB_SHARE')
      return
    }
    
    // Fallback: copy link + download image
    await copyToClipboard(shareUrl)
    showToast('Link copied!')
    
    if (imageBlob) {
      downloadBlob(imageBlob, getFilename())
    }
    recordShare('COPY_LINK')
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('[FanMomentSection] Share failed:', err)
    }
  } finally {
    sharing.value = false
  }
}

// Copy Link only
async function handleCopyLink() {
  const shareUrl = getShareUrl()
  const success = await copyToClipboard(shareUrl)
  if (success) {
    showToast('Link copied!')
    recordShare('COPY_LINK')
  }
}

// Copy Caption only
async function handleCopyCaption() {
  const caption = getMomentCaption()
  const success = await copyToClipboard(caption)
  if (success) {
    showToast('Caption copied!')
    recordShare('COPY_CAPTION')
  }
}

// Download Image only
async function handleDownloadImage() {
  downloadingImage.value = true
  try {
    const imageBlob = await getOrGenerateImage()
    if (imageBlob) {
      downloadBlob(imageBlob, getFilename())
      showToast('Image downloaded!')
      recordShare('DOWNLOAD_IMAGE')
    }
  } finally {
    downloadingImage.value = false
  }
}

// Instagram helper: download image + copy caption
async function handleInstagramKit() {
  preparingIG.value = true
  try {
    const imageBlob = await getOrGenerateImage()
    const caption = getMomentCaption()
    
    if (imageBlob) {
      downloadBlob(imageBlob, getFilename())
    }
    await copyToClipboard(caption)
    
    showToast('Ready for Instagram: image downloaded + caption copied', 3000)
    recordShare('INSTAGRAM_KIT')
  } finally {
    preparingIG.value = false
  }
}

// Facebook helper: open sharer with OG-enabled moment URL + copy caption
async function handleFacebookShare() {
  // Use share landing page URL for proper OG tags with moment-specific image
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://musicbizqr.com'
  const momentId = moment.value?.id
  const fbShareUrl = momentId 
    ? `${origin}/share/moment/${momentId}`
    : `${origin}/share/band/${props.bandSlug}`
  const caption = getMomentCaption()
  
  openFacebookSharer(fbShareUrl)
  await copyToClipboard(caption)
  
  showToast('Facebook opened + caption copied', 2500)
  recordShare('FACEBOOK_SHARE')
}

// Record share event
async function recordShare(channel) {
  if (!moment.value) return
  
  try {
    await fetch(`${config.public.strapiUrl}/api/fan-moments/shared`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        momentId: moment.value.id,
        bandId: props.bandId,
        visitorId: getOrCreateVisitorId(),
        sessionId: getOrCreateSessionId(),
        channel,
      }),
    })
    
    trackEvent('fan_moment_shared', {
      bandId: props.bandId,
      momentType: moment.value.momentType,
      channel,
    })
  } catch (err) {
    // Silent fail
  }
}

// Expose earnMoment for parent to call
defineExpose({
  earnMoment,
  checkActiveMoment,
})

// On mount, check for existing moment and QR entry
onMounted(async () => {
  await checkActiveMoment()
  
  // Check for QR entry
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const isQrEntry = urlParams.has('qr') || urlParams.has('scan') || sessionStorage.getItem('qr_entry') === 'true'
    
    if (isQrEntry && !moment.value) {
      // Mark QR entry for future reference
      sessionStorage.setItem('qr_entry', 'true')
      // Earn moment for QR scan
      await earnMoment('qr_scan', {
        landingPath: window.location.pathname,
        sourceCategory: 'qr',
      })
    }
  }
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
