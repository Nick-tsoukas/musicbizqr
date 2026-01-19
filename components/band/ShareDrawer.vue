<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        @click="close"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="slide-up">
      <div 
        v-if="isOpen" 
        class="fixed bottom-0 left-0 right-0 z-[101] bg-gray-950 border-t border-white/10 rounded-t-3xl max-h-[80vh] overflow-y-auto"
      >
        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-2">
          <div class="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <!-- Header -->
        <div class="px-5 pb-4 border-b border-white/10">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-white">Share {{ bandName }}</h3>
              <p class="text-white/50 text-sm mt-0.5">Spread the word</p>
            </div>
            <button 
              @click="close"
              class="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5 space-y-4">
          <!-- Quick Share Button -->
          <button
            @click="handleShare"
            :disabled="sharing"
            class="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-lg transition disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {{ sharing ? 'Sharing...' : 'Share Now' }}
          </button>

          <!-- Share Options Grid -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Copy Link -->
            <button
              @click="handleCopyLink"
              class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition"
            >
              <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div class="text-left">
                <div class="text-white font-medium">Copy Link</div>
                <div class="text-white/50 text-xs">Share the URL</div>
              </div>
            </button>

            <!-- Copy Caption -->
            <button
              @click="handleCopyCaption"
              class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition"
            >
              <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="text-left">
                <div class="text-white font-medium">Copy Caption</div>
                <div class="text-white/50 text-xs">Ready to paste</div>
              </div>
            </button>

            <!-- Download Image -->
            <button
              @click="handleDownloadImage"
              :disabled="downloadingImage"
              class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition disabled:opacity-50"
            >
              <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div class="text-left">
                <div class="text-white font-medium">Download Image</div>
                <div class="text-white/50 text-xs">Share graphic</div>
              </div>
            </button>

            <!-- Instagram Kit -->
            <button
              @click="handleInstagramKit"
              :disabled="preparingIG"
              class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/20 hover:from-pink-500/20 hover:to-purple-500/20 transition disabled:opacity-50"
            >
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div class="text-left">
                <div class="text-pink-300 font-medium">Instagram</div>
                <div class="text-white/50 text-xs">Image + caption</div>
              </div>
            </button>
          </div>

          <!-- Facebook Share -->
          <button
            @click="handleFacebookShare"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 hover:bg-[#1877F2]/20 transition"
          >
            <div class="w-10 h-10 rounded-lg bg-[#1877F2]/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div class="text-left flex-1">
              <div class="text-[#1877F2] font-medium">Share on Facebook</div>
              <div class="text-white/50 text-xs">Post to your timeline</div>
            </div>
            <svg class="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>

        <!-- Safe area padding for mobile -->
        <div class="h-6" />
      </div>
    </Transition>

    <!-- Toast notification -->
    <Transition name="fade">
      <div
        v-if="toastMessage"
        class="fixed bottom-28 left-1/2 -translate-x-1/2 z-[102] px-4 py-2 rounded-lg bg-black/90 border border-white/20 text-white text-sm shadow-lg"
      >
        {{ toastMessage }}
      </div>
    </Transition>
  </Teleport>

  <!-- Hidden canvas for image generation - outside Teleport so always available -->
  <canvas ref="canvasRef" class="hidden" width="1080" height="1080"></canvas>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useVisitorSession } from '@/composables/useVisitorSession'
import { useShareKit } from '@/composables/useShareKit'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
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
})

const emit = defineEmits(['close'])

const config = useRuntimeConfig()
const { getOrCreateVisitorId, getOrCreateSessionId } = useVisitorSession()
const {
  buildShareUrl,
  generateShareImage,
  webShare,
  copyToClipboard,
  downloadBlob,
  openFacebookSharer,
  getShareFilename,
  FAN_MOMENT_TYPES,
  getFanCaption,
  getFanHeadline,
  buildFanShareText,
  generateFanShareImage,
} = useShareKit()

// State
const sharing = ref(false)
const downloadingImage = ref(false)
const preparingIG = ref(false)
const canvasRef = ref(null)
const toastMessage = ref('')
const cachedImageBlob = ref(null)
const cacheKey = ref('')

function close() {
  emit('close')
}

// Computed values
function getShareUrl() {
  return buildShareUrl({ bandSlug: props.bandSlug })
}

function getCaption() {
  return getFanCaption(FAN_MOMENT_TYPES.DEFAULT, 'hype', {
    bandName: props.bandName,
  })
}

function getShareTextWithUrl() {
  const caption = getCaption()
  return buildFanShareText(caption, getShareUrl())
}

function getFilename() {
  return getShareFilename(props.bandSlug, 'share')
}

function getHeadline() {
  return getFanHeadline(FAN_MOMENT_TYPES.DEFAULT, {
    bandName: props.bandName,
  })
}

// Toast helper
function showToast(message, duration = 2000) {
  toastMessage.value = message
  setTimeout(() => { toastMessage.value = '' }, duration)
}

// Image loader helper
async function loadImageDirect(url, timeoutMs = 15000) {
  if (!url) throw new Error('No URL provided')

  // Handle data URLs directly - no CORS issues
  if (url.startsWith('data:')) {
    console.log('[ShareDrawer] Loading data URL image')
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        console.log('[ShareDrawer] Data URL image loaded:', img.width, 'x', img.height)
        resolve(img)
      }
      img.onerror = (err) => {
        console.error('[ShareDrawer] Data URL image load failed')
        reject(err || new Error('Image load error'))
      }
      img.src = url
    })
  }

  // Try direct loading first for same-origin images
  if (url.includes('musicbizqr.com')) {
    try {
      console.log('[ShareDrawer] Trying direct load for same-origin image:', url)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
      
      const response = await fetch(url, { 
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      })
      clearTimeout(timeoutId)
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          console.log('[ShareDrawer] Direct load succeeded')
          resolve(img)
        }
        img.onerror = (err) => {
          URL.revokeObjectURL(objectUrl)
          reject(err || new Error('Image load error'))
        }
        img.src = objectUrl
      })
    } catch (err) {
      console.warn('[ShareDrawer] Direct load failed, trying proxy:', err)
    }
  }

  // Try proxy for external images (S3, Cloudinary, etc.)
  try {
    const proxyUrl = `${config.public.strapiUrl}/api/image-proxy?url=${encodeURIComponent(url)}`
    console.log('[ShareDrawer] Trying proxy URL:', proxyUrl)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    
    const response = await fetch(proxyUrl, { signal: controller.signal })
    clearTimeout(timeoutId)
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl)
        reject(err || new Error('Image load error'))
      }
      img.src = objectUrl
    })
  } catch (err) {
    console.error('[ShareDrawer] Proxy load failed:', err)
    throw err
  }
}

// Image generation with caching
async function getOrGenerateImage() {
  const key = `${props.bandSlug}-${props.bandName}`
  if (cachedImageBlob.value && cacheKey.value === key) {
    return cachedImageBlob.value
  }
  
  if (!canvasRef.value) return null
  
  const blob = await generateFanShareImage({
    canvasEl: canvasRef.value,
    headline: getHeadline(),
    bandName: props.bandName,
    bandImageUrl: props.bandImageUrl,
    isBandNameInLogo: props.isBandNameInLogo,
    momentType: FAN_MOMENT_TYPES.DEFAULT,
    loadImage: loadImageDirect,
  })
  
  if (blob) {
    cachedImageBlob.value = blob
    cacheKey.value = key
    setTimeout(() => {
      if (cacheKey.value === key) {
        cachedImageBlob.value = null
        cacheKey.value = ''
      }
    }, 30000)
  }
  
  return blob
}

// Clear cache when props change
watch(() => [props.bandSlug, props.bandName], () => {
  cachedImageBlob.value = null
  cacheKey.value = ''
})

// Record share event
async function recordShare(channel) {
  try {
    const visitorId = getOrCreateVisitorId()
    const sessionId = getOrCreateSessionId()
    if (!visitorId || !sessionId) return
    
    await fetch(`${config.public.strapiUrl}/api/band-shares/record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bandId: props.bandId,
        visitorId,
        sessionId,
        shareChannel: channel,
        placement: 'SHARE_DRAWER',
        context: { bandSlug: props.bandSlug },
      }),
    })
  } catch (err) {}
}

// Share handlers
async function handleShare() {
  sharing.value = true
  try {
    const shareUrl = getShareUrl()
    const shareText = getShareTextWithUrl()
    const imageBlob = await getOrGenerateImage()
    
    const result = await webShare({
      title: props.bandName,
      text: shareText,
      url: shareUrl,
      imageBlob,
      filename: getFilename(),
    })
    
    if (result.ok) {
      recordShare('WEB_SHARE')
      close()
      return
    }
    
    await copyToClipboard(shareUrl)
    showToast('Link copied!')
    if (imageBlob) downloadBlob(imageBlob, getFilename())
    recordShare('COPY_LINK')
  } catch (err) {
    if (err.name !== 'AbortError') console.error('[ShareDrawer] Share failed:', err)
  } finally {
    sharing.value = false
  }
}

async function handleCopyLink() {
  const success = await copyToClipboard(getShareUrl())
  if (success) {
    showToast('Link copied!')
    recordShare('COPY_LINK')
  }
}

async function handleCopyCaption() {
  const success = await copyToClipboard(getCaption())
  if (success) {
    showToast('Caption copied!')
    recordShare('COPY_CAPTION')
  }
}

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

async function handleInstagramKit() {
  preparingIG.value = true
  try {
    const imageBlob = await getOrGenerateImage()
    if (imageBlob) downloadBlob(imageBlob, getFilename())
    await copyToClipboard(getCaption())
    showToast('Ready for Instagram!', 3000)
    recordShare('INSTAGRAM_KIT')
  } finally {
    preparingIG.value = false
  }
}

async function handleFacebookShare() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://musicbizqr.com'
  const fbShareUrl = `${origin}/share/band/${props.bandSlug}`
  openFacebookSharer(fbShareUrl)
  await copyToClipboard(getCaption())
  showToast('Facebook opened + caption copied', 2500)
  recordShare('FACEBOOK_SHARE')
}
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
