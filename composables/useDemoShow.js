import { ref, computed, watch } from 'vue'
import { demoBands, defaultDemoBand } from '@/data/demoBands'
import { demoCities, getRandomCity } from '@/data/demoCities'
import { seededMoments, generateMomentId, getMomentType, getVibe } from '@/data/demoMomentTemplates'

const SCENES = [
  { key: 'smartlinks', label: 'Smart Links', caption: 'One link. Every platform. Full analytics.' },
  { key: 'moments', label: 'Moments', caption: 'Sharing becomes distribution.' },
  { key: 'proof', label: 'Proof', caption: 'See exactly what\'s working.' },
  { key: 'agency', label: 'Agency', caption: 'Manage your entire roster from one dashboard.' },
  { key: 'cta', label: 'Get Started', caption: 'Ready to grow your audience?' },
]

const MOMENTUM_THRESHOLDS = {
  cooling: { min: 0, max: 10 },
  watching: { min: 11, max: 30 },
  heating: { min: 31, max: 60 },
  breakout: { min: 61, max: Infinity },
}

// Shared state (singleton pattern for the demo)
const mode = ref('story') // 'story' | 'explore'
const sceneIndex = ref(0)
const autoplay = ref(false)
const autoplayInterval = ref(null)
const selectedBandId = ref(defaultDemoBand.id)

// Demo stats
const demoStats = ref({
  scans: 127,
  profileVisits: 342,
  spotifyClicks: 89,
  appleMusicClicks: 45,
  youtubePlays: 67,
  follows: 23,
  ticketClicks: 34,
  merchClicks: 12,
  momentsCreated: seededMoments.length,
  momentsShared: seededMoments.filter(m => m.shared).length,
})

// Moments feed
const moments = ref([...seededMoments])

// Top cities with counts
const topCities = ref([
  { name: 'Los Angeles', count: 45 },
  { name: 'New York', count: 38 },
  { name: 'Chicago', count: 29 },
  { name: 'Austin', count: 24 },
  { name: 'Nashville', count: 18 },
])

// Toast notifications
const toasts = ref([])

export function useDemoShow() {
  // Computed
  const currentScene = computed(() => SCENES[sceneIndex.value])
  const currentSceneKey = computed(() => currentScene.value?.key)
  const selectedBand = computed(() => demoBands.find(b => b.id === selectedBandId.value) || defaultDemoBand)
  const isFirstScene = computed(() => sceneIndex.value === 0)
  const isLastScene = computed(() => sceneIndex.value === SCENES.length - 1)
  
  const momentumState = computed(() => {
    const activity = demoStats.value.momentsShared + Math.floor(demoStats.value.profileVisits / 10)
    if (activity >= MOMENTUM_THRESHOLDS.breakout.min) return 'breakout'
    if (activity >= MOMENTUM_THRESHOLDS.heating.min) return 'heating'
    if (activity >= MOMENTUM_THRESHOLDS.watching.min) return 'watching'
    return 'cooling'
  })

  const momentumLabel = computed(() => {
    const labels = {
      cooling: 'Cooling — activity is low',
      watching: 'Watching — building momentum',
      heating: 'Heating — engagement rising',
      breakout: 'Breakout — viral potential',
    }
    return labels[momentumState.value]
  })

  const momentumColor = computed(() => {
    const colors = {
      cooling: 'text-blue-400',
      watching: 'text-yellow-400',
      heating: 'text-orange-400',
      breakout: 'text-red-400',
    }
    return colors[momentumState.value]
  })

  // Actions
  function nextScene() {
    if (sceneIndex.value < SCENES.length - 1) {
      sceneIndex.value++
    }
  }

  function prevScene() {
    if (sceneIndex.value > 0) {
      sceneIndex.value--
    }
  }

  function goToScene(key) {
    const idx = SCENES.findIndex(s => s.key === key)
    if (idx !== -1) {
      sceneIndex.value = idx
    }
  }

  function restart() {
    sceneIndex.value = 0
    // Reset stats to baseline
    demoStats.value = {
      scans: 127,
      profileVisits: 342,
      spotifyClicks: 89,
      appleMusicClicks: 45,
      youtubePlays: 67,
      follows: 23,
      ticketClicks: 34,
      merchClicks: 12,
      momentsCreated: seededMoments.length,
      momentsShared: seededMoments.filter(m => m.shared).length,
    }
    moments.value = [...seededMoments]
    topCities.value = [
      { name: 'Los Angeles', count: 45 },
      { name: 'New York', count: 38 },
      { name: 'Chicago', count: 29 },
      { name: 'Austin', count: 24 },
      { name: 'Nashville', count: 18 },
    ]
  }

  function setMode(newMode) {
    mode.value = newMode
    if (newMode === 'story') {
      stopAutoplay()
    }
  }

  function selectBand(bandId) {
    selectedBandId.value = bandId
  }

  function trackAction(actionType, increment = 1) {
    switch (actionType) {
      case 'spotify':
        demoStats.value.spotifyClicks += increment
        demoStats.value.profileVisits += increment
        break
      case 'appleMusic':
        demoStats.value.appleMusicClicks += increment
        demoStats.value.profileVisits += increment
        break
      case 'youtube':
        demoStats.value.youtubePlays += increment
        demoStats.value.profileVisits += increment
        break
      case 'follow':
        demoStats.value.follows += increment
        demoStats.value.profileVisits += increment
        break
      case 'tickets':
        demoStats.value.ticketClicks += increment
        demoStats.value.profileVisits += increment
        break
      case 'merch':
        demoStats.value.merchClicks += increment
        demoStats.value.profileVisits += increment
        break
      case 'scan':
        demoStats.value.scans += increment
        demoStats.value.profileVisits += increment
        break
      default:
        demoStats.value.profileVisits += increment
    }
    
    // Update a random city
    const cityIdx = Math.floor(Math.random() * topCities.value.length)
    topCities.value[cityIdx].count += increment
    
    showToast(`Tracked: ${actionType}`)
  }

  function createMoment(momentType, cityName, vibeId) {
    const city = cityName || getRandomCity().name
    const newMoment = {
      id: generateMomentId(),
      momentType,
      city,
      vibe: vibeId,
      bandName: selectedBand.value.name,
      date: new Date().toISOString().split('T')[0],
      shared: false,
      caption: '',
    }
    
    moments.value.unshift(newMoment)
    demoStats.value.momentsCreated++
    demoStats.value.profileVisits += 2
    
    // Update city counts
    const cityEntry = topCities.value.find(c => c.name === city)
    if (cityEntry) {
      cityEntry.count += 3
    } else {
      topCities.value.push({ name: city, count: 3 })
      topCities.value.sort((a, b) => b.count - a.count)
      if (topCities.value.length > 8) topCities.value.pop()
    }
    
    showToast('Moment created!')
    return newMoment
  }

  function shareMoment(momentId) {
    const moment = moments.value.find(m => m.id === momentId)
    if (moment && !moment.shared) {
      moment.shared = true
      demoStats.value.momentsShared++
      demoStats.value.profileVisits += 5
      demoStats.value.spotifyClicks += 2
      demoStats.value.youtubePlays += 1
      
      // Boost the city
      const cityEntry = topCities.value.find(c => c.name === moment.city)
      if (cityEntry) {
        cityEntry.count += 8
      }
      
      showToast('Moment shared! +5 profile visits')
    }
  }

  function simulateFanBurst(count = 50) {
    demoStats.value.scans += count
    demoStats.value.profileVisits += count * 2
    demoStats.value.spotifyClicks += Math.floor(count * 0.4)
    demoStats.value.youtubePlays += Math.floor(count * 0.2)
    demoStats.value.follows += Math.floor(count * 0.1)
    
    // Distribute across cities
    for (let i = 0; i < Math.min(count / 10, 5); i++) {
      const cityIdx = Math.floor(Math.random() * topCities.value.length)
      topCities.value[cityIdx].count += Math.floor(count / 5)
    }
    
    showToast(`${count} fans hit the link!`)
  }

  function simulateShares(count = 10) {
    for (let i = 0; i < count; i++) {
      const unshared = moments.value.find(m => !m.shared)
      if (unshared) {
        shareMoment(unshared.id)
      } else {
        // Create and share new moments
        const types = ['i-was-there', 'support-the-band', 'new-fan', 'favorite-song']
        const newMoment = createMoment(types[i % types.length], getRandomCity().name, 'chills')
        shareMoment(newMoment.id)
      }
    }
  }

  // Autoplay
  function startAutoplay(intervalMs = 15000) {
    stopAutoplay()
    autoplay.value = true
    autoplayInterval.value = setInterval(() => {
      if (sceneIndex.value < SCENES.length - 1) {
        nextScene()
      } else {
        stopAutoplay()
      }
    }, intervalMs)
  }

  function stopAutoplay() {
    autoplay.value = false
    if (autoplayInterval.value) {
      clearInterval(autoplayInterval.value)
      autoplayInterval.value = null
    }
  }

  function toggleAutoplay() {
    if (autoplay.value) {
      stopAutoplay()
    } else {
      startAutoplay()
    }
  }

  // Toasts
  function showToast(message, duration = 2500) {
    const id = Date.now()
    toasts.value.push({ id, message })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  function dismissToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // URL helpers
  function getDemoUrl() {
    const params = new URLSearchParams()
    params.set('mode', mode.value)
    params.set('scene', currentSceneKey.value)
    if (autoplay.value) params.set('autoplay', '1')
    return `${window.location.origin}/demo?${params.toString()}`
  }

  function copyDemoLink() {
    const url = getDemoUrl()
    navigator.clipboard.writeText(url).then(() => {
      showToast('Demo link copied!')
    }).catch(() => {
      showToast('Failed to copy link')
    })
  }

  // Initialize from URL params
  function initFromQuery(query) {
    if (query.mode === 'explore' || query.mode === 'story') {
      mode.value = query.mode
    }
    if (query.scene) {
      goToScene(query.scene)
    }
    if (query.autoplay === '1') {
      startAutoplay()
    }
  }

  return {
    // State
    mode,
    sceneIndex,
    autoplay,
    selectedBandId,
    demoStats,
    moments,
    topCities,
    toasts,
    
    // Computed
    currentScene,
    currentSceneKey,
    selectedBand,
    isFirstScene,
    isLastScene,
    momentumState,
    momentumLabel,
    momentumColor,
    
    // Constants
    SCENES,
    demoBands,
    demoCities,
    
    // Actions
    nextScene,
    prevScene,
    goToScene,
    restart,
    setMode,
    selectBand,
    trackAction,
    createMoment,
    shareMoment,
    simulateFanBurst,
    simulateShares,
    startAutoplay,
    stopAutoplay,
    toggleAutoplay,
    showToast,
    dismissToast,
    getDemoUrl,
    copyDemoLink,
    initFromQuery,
  }
}
