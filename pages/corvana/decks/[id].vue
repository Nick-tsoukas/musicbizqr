<template>
  <div class="corvana-deck-viewer" style="background: linear-gradient(135deg, #000 0%, #1a1a2e 50%, #0f0f1e 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <!-- Debug: Show current slide info -->
    <div style="position: fixed; top: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; z-index: 9999; font-size: 12px; border-radius: 6px;">
      Slide {{ currentSlideIndex + 1 }} / {{ totalSlides }}
    </div>

    <!-- Narrative Slide -->
    <div v-if="currentSlide?.type === 'narrative'" style="width: 100%; max-width: 800px; padding: 2rem; text-align: center;">
      <h1 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 1.5rem; background: linear-gradient(to right, #ec4899, #8b5cf6, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">{{ currentSlide.content.headline }}</h1>
      <h2 style="font-size: clamp(1.2rem, 3vw, 1.8rem); font-weight: 500; color: #a0a0a0; margin-bottom: 2rem;">{{ currentSlide.content.subhead }}</h2>
      <p style="font-size: clamp(1rem, 2vw, 1.2rem); color: #808080; line-height: 1.6;">{{ currentSlide.content.body }}</p>
    </div>

    <!-- Mobile View Slide -->
    <div v-else-if="currentSlide?.type === 'mobile_view'" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; min-height: 100vh; padding: 2rem; padding-top: 6rem; gap: 1.5rem;">
      
      <!-- Template Switcher (only on Slide 2 - SmartLinkSurface) -->
      <div v-if="currentSlide?.content?.componentKey === 'SmartLinkSurface'" style="position: fixed; top: 1rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.5rem; background: rgba(0,0,0,0.9); padding: 0.75rem; border-radius: 0.75rem; border: 1px solid rgba(255,255,255,0.2); z-index: 10000; backdrop-filter: blur(10px);">
        <button
          v-for="opt in templateOptions"
          :key="opt.key"
          @click="selectedTemplate = opt.key"
          :style="{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s',
            background: selectedTemplate === opt.key ? 'linear-gradient(to right, #8b5cf6, #10b981)' : 'rgba(255,255,255,0.1)',
            color: selectedTemplate === opt.key ? '#fff' : 'rgba(255,255,255,0.7)'
          }"
        >
          {{ opt.label }}
        </button>
      </div>

      <MobileViewport>
        <!-- Use template component for SmartLinkSurface slide -->
        <component 
          v-if="currentSlide?.content?.componentKey === 'SmartLinkSurface'"
          :is="templateComponent"
          @share="handleNativeShare"
          @follow="handleFollow"
          @quick-tip="handleQuickTip"
          @link-click="handleLinkClick"
        />
        <!-- Use registry component for other slides -->
        <component 
          v-else
          :is="resolvedComponent"
          v-bind="componentProps"
          @share="handleNativeShare"
          @follow="handleFollow"
          @quick-tip="handleQuickTip"
          @link-click="handleLinkClick"
        />
      </MobileViewport>
    </div>

    <!-- Dashboard View Slide -->
    <div v-else-if="currentSlide?.type === 'dashboard_view'" style="display: flex; align-items: center; justify-content: center; width: 100%; min-height: 100vh; padding: 2rem;">
      <div style="width: 100%; max-width: 1200px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; padding: 2rem;">
        <component 
          :is="resolvedComponent"
          v-bind="componentProps"
        />
      </div>
    </div>

    <!-- Fallback -->
    <div v-else style="color: white; padding: 50px; font-size: 24px;">
      No slide data or unknown type
    </div>

    <!-- Navigation Controls -->
    <div class="deck-controls">
      <!-- Previous Button -->
      <button 
        @click="previousSlide"
        :disabled="isFirstSlide"
        class="nav-button prev"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Progress Indicator -->
      <div class="progress-indicator">
        <span class="progress-text">{{ currentSlideIndex + 1 }} / {{ totalSlides }}</span>
        <div class="progress-dots">
          <button
            v-for="(slide, index) in deck.slides"
            :key="slide.id"
            @click="goToSlide(index)"
            :class="['progress-dot', { active: index === currentSlideIndex }]"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>

      <!-- Next Button -->
      <button 
        @click="nextSlide"
        :disabled="isLastSlide"
        class="nav-button next"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Top Controls -->
    <div class="top-controls">
      <!-- Present Button -->
      <button 
        @click="togglePresentMode"
        class="present-button"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ isPresentMode ? 'Exit Present' : 'Present' }}
      </button>

      <!-- Speaker Notes Toggle -->
      <button 
        @click="toggleSpeakerNotes"
        class="notes-button"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Notes
      </button>

      <!-- Exit Button -->
      <button 
        @click="exitDeck"
        class="exit-button"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Exit
      </button>
    </div>

    <!-- Speaker Notes Panel -->
    <Transition name="slide-panel">
      <div v-if="showSpeakerNotes" class="speaker-notes-panel">
        <div class="notes-header">
          <h3 class="notes-title">Speaker Notes</h3>
          <button @click="toggleSpeakerNotes" class="notes-close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="notes-content">
          <p v-if="currentSlideContent?.speakerNotes" class="notes-text">
            {{ currentSlideContent.speakerNotes }}
          </p>
          <p v-else class="notes-empty">No notes for this slide</p>
        </div>
      </div>
    </Transition>

    <!-- Share Preview Overlay -->
    <SharePreviewOverlay
      :open="shareOverlayOpen"
      :item="selectedShareable"
      :caption-suggestions="shareCaptionSuggestions"
      @close="closeShareOverlay"
      @share="handleShare"
    />

    <!-- Share Drawer -->
    <ShareDrawer
      :is-open="shareDrawerOpen"
      :band-id="1"
      band-slug="neon-avenue"
      band-name="Neon Avenue"
      :band-image-url="bandImageDataUrl || 'https://picsum.photos/seed/neonavenue/1080/1080.jpg'"
      @close="shareDrawerOpen = false"
    />

    <!-- Fullscreen Present Mode - just adds class, content is already visible -->
    <div v-if="isPresentMode" class="present-mode-active" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { flagshipDeck_v1 } from '~/corvana/decks/flagshipDeck_v1.js'
import { resolveComponent as getRegistryComponent } from '~/corvana/decks/componentRegistry.js'
import MobileViewport from '~/corvana/decks/MobileViewport.vue'
import SharePreviewOverlay from '~/corvana/decks/SharePreviewOverlay.vue'
import ShareDrawer from '~/components/band/ShareDrawer.vue'
import BandPageStyleDefault from '~/components/band/BandPageStyleDefault.vue'
import BandPageStyleCompact from '~/components/band/BandPageStyleCompact.vue'
import BandPageStyleBold from '~/components/band/BandPageStyleBold.vue'

const route = useRoute()

// State
const currentSlideIndex = ref(0)
const showSpeakerNotes = ref(false)
const isPresentMode = ref(false)
const shareOverlayOpen = ref(false)
const selectedShareable = ref(null)
const shareCaptionSuggestions = ref([])
const shareDrawerOpen = ref(false)
const bandImageDataUrl = ref(null)
const selectedTemplate = ref('compact') // 'default', 'compact', 'bold'

// Template options
const templateOptions = [
  { key: 'default', label: 'Default' },
  { key: 'compact', label: 'Compact' },
  { key: 'bold', label: 'Bold' }
]

// Get the selected template component
const templateComponent = computed(() => {
  switch (selectedTemplate.value) {
    case 'default': return BandPageStyleDefault
    case 'bold': return BandPageStyleBold
    case 'compact':
    default: return BandPageStyleCompact
  }
})

// Get deck data
const deck = computed(() => {
  const deckId = route.params.id
  if (deckId === 'mbq-flagship-v1') {
    return flagshipDeck_v1
  }
  throw new Error(`Deck "${deckId}" not found`)
})

// Current slide
const currentSlide = computed(() => {
  return deck.value.slides[currentSlideIndex.value]
})

// Resolve component for mobile_view and dashboard_view slides
const resolvedComponent = computed(() => {
  if (currentSlide.value?.type === 'mobile_view' || currentSlide.value?.type === 'dashboard_view') {
    try {
      const registry = getRegistryComponent(currentSlide.value.content.componentKey)
      return registry.component
    } catch (e) {
      console.error('Error resolving component:', e)
      return null
    }
  }
  return null
})

// Build props for component
const componentProps = computed(() => {
  if (currentSlide.value?.type === 'mobile_view' || currentSlide.value?.type === 'dashboard_view') {
    try {
      const registry = getRegistryComponent(currentSlide.value.content.componentKey)
      const demoDataKey = currentSlide.value.content.demoDataKey
      return demoDataKey ? registry.buildProps(demoDataKey) : registry.buildProps()
    } catch (e) {
      console.error('Error building props:', e)
      return {}
    }
  }
  return {}
})

const currentSlideContent = computed(() => currentSlide.value?.content)

// Navigation
const totalSlides = computed(() => deck.value.slides.length)
const isFirstSlide = computed(() => currentSlideIndex.value === 0)
const isLastSlide = computed(() => currentSlideIndex.value === totalSlides.value - 1)

function nextSlide() {
  if (!isLastSlide.value) {
    currentSlideIndex.value++
  }
}

function previousSlide() {
  if (!isFirstSlide.value) {
    currentSlideIndex.value--
  }
}

function goToSlide(index) {
  currentSlideIndex.value = index
}

// Controls
function togglePresentMode() {
  isPresentMode.value = !isPresentMode.value
  if (isPresentMode.value) {
    enterFullscreen()
  } else {
    exitFullscreen()
  }
}

function toggleSpeakerNotes() {
  showSpeakerNotes.value = !showSpeakerNotes.value
}

function exitDeck() {
  console.log('exitDeck called')
  window.location.href = '/corvana/decks'
}

// Fullscreen
function enterFullscreen() {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

// Shareable handling
function handleShareableSelect(item) {
  selectedShareable.value = item
  // Get caption suggestions from demo data
  shareCaptionSuggestions.value = ['🔥 Chicago is feeling the heat!', '🎵 Indie pop scene is alive', '💜 Supporting independent music matters', '📍 Chicago loves Neon Avenue']
  shareOverlayOpen.value = true
}

function closeShareOverlay() {
  shareOverlayOpen.value = false
  selectedShareable.value = null
  shareCaptionSuggestions.value = []
}

function handleShare(item) {
  console.log('Share item:', item)
  // Implement share functionality
  closeShareOverlay()
}

// Helper to convert image URL to data URL
async function convertImageToDataUrl(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    console.warn('[convertImageToDataUrl] Failed:', err.message)
    return null
  }
}

// Helper to convert relative image URLs to full URLs
function getFullImageUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `https://musicbizqr.com${url}`
}

// Preload band image as data URL
onMounted(async () => {
  const imageUrl = getFullImageUrl('/neonposter.png')
  if (imageUrl) {
    const dataUrl = await convertImageToDataUrl(imageUrl)
    if (dataUrl) {
      bandImageDataUrl.value = dataUrl
    }
  }
})

// Native share handler for band page share button
function handleNativeShare() {
  shareDrawerOpen.value = true
}

// Follow handler
function handleFollow() {
  console.log('Follow clicked')
  alert('Following Neon Avenue!')
}

// Quick tip handler
function handleQuickTip(amount) {
  console.log('Quick tip:', amount)
  alert(`Thank you for your $${amount} tip!`)
}

// Link click handler
function handleLinkClick(link) {
  console.log('Link clicked:', link)
  if (link.url) {
    window.open(link.url, '_blank')
  }
}

// Keyboard navigation
function handleKeydown(event) {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      previousSlide()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextSlide()
      break
    case 'Escape':
      if (isPresentMode.value) {
        togglePresentMode()
      }
      break
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.corvana-deck-viewer {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.deck-controls {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1rem 2rem;
  z-index: 100;
}

.nav-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.progress-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.progress-text {
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
}

.progress-dots {
  display: flex;
  gap: 0.5rem;
}

.progress-dot {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  color: #fff;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.progress-dot:hover {
  background: rgba(255, 255, 255, 0.3);
}

.progress-dot.active {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-color: rgba(139, 92, 246, 0.5);
}

.top-controls {
  position: fixed;
  top: 3.5rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 9998;
}

.present-button,
.notes-button,
.exit-button {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.present-button:hover,
.notes-button:hover,
.exit-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.present-button {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-color: rgba(139, 92, 246, 0.3);
}

.present-button:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
}

.speaker-notes-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 400px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 200;
  display: flex;
  flex-direction: column;
}

.notes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notes-title {
  color: #fff;
  font-size: 1.125rem;
  font-weight: 600;
}

.notes-close {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: #fff;
  cursor: pointer;
}

.notes-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.notes-text {
  color: #e0e0e0;
  line-height: 1.6;
  white-space: pre-wrap;
}

.notes-empty {
  color: #666;
  font-style: italic;
}

.present-mode-active {
  /* This is just a marker class, doesn't block content */
  display: none;
}

/* Transitions */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 768px) {
  .deck-controls {
    bottom: 1rem;
    padding: 0.75rem 1rem;
    gap: 1rem;
  }

  .top-controls {
    top: 1rem;
    right: 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .speaker-notes-panel {
    width: 100%;
  }

  .nav-button {
    padding: 0.5rem;
  }

  .progress-dot {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.625rem;
  }
}
</style>
