<template>
  <Teleport to="body">
    <!-- Full Screen Overlay -->
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100] overflow-hidden"
      >
        <!-- Animated Background -->
        <div class="absolute inset-0 bg-black">
          <!-- Gradient orbs -->
          <div class="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-float"></div>
          <div class="absolute bottom-1/4 right-0 w-80 h-80 bg-neon-purple/20 rounded-full blur-[100px] animate-float-delayed"></div>
          <div class="absolute top-1/2 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] animate-float"></div>
        </div>

        <!-- Content Container -->
        <div class="relative h-full flex flex-col items-center justify-between px-6 py-8 safe-area-all">
          <!-- Header -->
          <div class="w-full flex items-center justify-between">
            <div class="w-10"></div>
            <p class="text-white/60 text-sm font-medium tracking-[0.2em] uppercase">Scan to Connect</p>
            <button 
              @click="$emit('close')"
              class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Main Content - Centered -->
          <div class="flex-1 flex flex-col items-center justify-center -mt-8">
            <!-- Artist Profile Image - Large -->
            <div class="relative mb-6">
              <!-- Glow ring -->
              <div class="absolute -inset-2 bg-gradient-to-r from-accent via-neon-purple to-accent rounded-full opacity-60 blur-lg animate-pulse-slow"></div>
              <!-- Image container -->
              <div class="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/20">
                <img 
                  v-if="showImage"
                  :src="profileImage" 
                  :alt="bandName"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div 
                  v-else 
                  class="w-full h-full bg-gradient-to-br from-accent to-neon-purple flex items-center justify-center"
                >
                  <span class="text-white text-3xl font-bold">{{ bandInitials }}</span>
                </div>
              </div>
            </div>

            <!-- Artist Name -->
            <h1 class="text-white text-3xl font-bold text-center mb-1">{{ bandName }}</h1>
            <p class="text-white/50 text-base mb-8">@{{ bandSlug }}</p>

            <!-- QR Code Card -->
            <div class="relative">
              <!-- Outer glow -->
              <div class="absolute -inset-4 bg-gradient-to-r from-accent/30 via-neon-purple/30 to-accent/30 rounded-[2.5rem] blur-xl animate-pulse-slow"></div>
              
              <!-- QR Card -->
              <div class="relative bg-white rounded-[2rem] p-8 shadow-2xl">
                <QrcodeVue 
                  :value="shareUrl"
                  :size="qrSize"
                  level="M"
                  :margin="0"
                  render-as="svg"
                  class="mx-auto"
                  foreground="#000000"
                  background="#ffffff"
                />
                <!-- Center overlay with artist image or MBQ -->
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-lg ring-4 ring-white">
                    <img 
                      v-if="showImage"
                      :src="profileImage" 
                      :alt="bandName"
                      class="w-full h-full object-cover"
                    />
                    <div 
                      v-else
                      class="w-full h-full bg-gradient-to-br from-accent to-neon-purple flex items-center justify-center"
                    >
                      <span class="text-sm font-black text-white">MBQ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- URL Display -->
            <div class="mt-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <p class="text-white/70 text-sm font-mono">musicbizqr.com/<span class="text-white">{{ bandSlug }}</span></p>
            </div>
          </div>

          <!-- Action Buttons - Bottom -->
          <div class="w-full max-w-sm space-y-3 pb-safe">
            <!-- Share Button -->
            <button
              @click="handleShare"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-accent to-neon-purple text-white font-semibold text-lg shadow-lg shadow-accent/30 transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Link
            </button>

            <!-- Copy Link Button -->
            <button
              @click="handleCopyLink"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium text-lg transition hover:bg-white/15 active:scale-[0.98]"
            >
              <svg v-if="!copied" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ copied ? 'Copied!' : 'Copy Link' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  bandName: {
    type: String,
    required: true
  },
  bandSlug: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: null
  }
})

defineEmits(['close'])

const copied = ref(false)
const imageError = ref(false)

const shareUrl = computed(() => `https://musicbizqr.com/${props.bandSlug}`)

const qrSize = computed(() => {
  if (typeof window !== 'undefined' && window.innerWidth < 380) {
    return 180
  }
  return 220
})

const bandInitials = computed(() => {
  if (!props.bandName) return 'MBQ'
  return props.bandName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const showImage = computed(() => props.profileImage && !imageError.value)

function handleImageError() {
  imageError.value = true
}

async function handleShare() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.bandName,
        text: `Check out ${props.bandName} on MusicBizQR`,
        url: shareUrl.value
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err)
      }
    }
  } else {
    handleCopyLink()
  }
}

async function handleCopyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.4s ease;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.safe-area-all {
  padding-top: env(safe-area-inset-top, 20px);
  padding-bottom: env(safe-area-inset-bottom, 20px);
  padding-left: env(safe-area-inset-left, 0);
  padding-right: env(safe-area-inset-right, 0);
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-10px);
  }
  75% {
    transform: translateY(-25px) translateX(5px);
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 10s ease-in-out infinite;
  animation-delay: -3s;
}

.pb-safe {
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
}
</style>
