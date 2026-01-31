<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="slide-up">
      <div 
        v-if="isOpen" 
        class="fixed bottom-0 left-0 right-0 z-[101] bg-gradient-to-b from-gray-900 to-black border-t border-white/10 rounded-t-[2rem] max-h-[90vh] overflow-hidden"
      >
        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-2">
          <div class="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        <!-- Close button -->
        <button 
          @click="$emit('close')"
          class="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition z-10"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Content -->
        <div class="px-6 pb-8 pt-2 flex flex-col items-center">
          <!-- Title -->
          <p class="text-white/50 text-sm font-medium tracking-wide uppercase mb-6">Scan to follow</p>
          
          <!-- QR Card -->
          <div class="qr-card relative">
            <!-- Animated gradient border -->
            <div class="absolute -inset-1 bg-gradient-to-r from-accent via-neon-purple to-accent rounded-[2rem] opacity-75 blur-sm animate-pulse-slow"></div>
            
            <!-- Card inner -->
            <div class="relative bg-white rounded-[1.75rem] p-6 shadow-2xl">
              <!-- Artist Profile -->
              <div class="flex flex-col items-center mb-4">
                <!-- Profile Image with ring -->
                <div class="relative mb-3">
                  <div class="absolute -inset-1 bg-gradient-to-r from-accent to-neon-purple rounded-full opacity-75 blur-sm"></div>
                  <div class="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-white">
                    <img 
                      v-if="profileImage"
                      :src="profileImage" 
                      :alt="bandName"
                      class="w-full h-full object-cover"
                    />
                    <div 
                      v-else 
                      class="w-full h-full bg-gradient-to-br from-accent to-neon-purple flex items-center justify-center"
                    >
                      <span class="text-white text-2xl font-bold">{{ bandInitials }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Artist Name -->
                <h2 class="text-gray-900 font-bold text-xl text-center">{{ bandName }}</h2>
                <p class="text-gray-500 text-sm">@{{ bandSlug }}</p>
              </div>

              <!-- QR Code -->
              <div class="relative">
                <QrcodeVue 
                  :value="shareUrl"
                  :size="200"
                  level="M"
                  :margin="0"
                  render-as="svg"
                  class="mx-auto"
                  foreground="#000000"
                  background="#ffffff"
                />
                <!-- Center logo overlay -->
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span class="text-lg font-black bg-gradient-to-r from-accent to-neon-purple bg-clip-text text-transparent">MBQ</span>
                  </div>
                </div>
              </div>

              <!-- URL hint -->
              <p class="text-gray-400 text-xs text-center mt-4 font-mono">musicbizqr.com/{{ bandSlug }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="w-full max-w-xs mt-8 space-y-3">
            <!-- Share Button -->
            <button
              @click="handleShare"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-accent to-neon-purple text-white font-semibold text-lg shadow-lg shadow-accent/25 transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>

            <!-- Copy Link Button -->
            <button
              @click="handleCopyLink"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white font-medium text-lg transition hover:bg-white/15 active:scale-[0.98]"
            >
              <svg v-if="!copied" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <svg v-else class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ copied ? 'Copied!' : 'Copy Link' }}
            </button>
          </div>

          <!-- Safe area spacer -->
          <div class="h-safe-area-bottom"></div>
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

const shareUrl = computed(() => `https://musicbizqr.com/${props.bandSlug}`)

const bandInitials = computed(() => {
  return props.bandName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.7, 0, 0.84, 0);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.h-safe-area-bottom {
  height: env(safe-area-inset-bottom, 0);
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.qr-card {
  width: 280px;
}
</style>
