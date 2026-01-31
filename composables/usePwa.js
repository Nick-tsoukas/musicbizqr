import { ref, onMounted, onUnmounted } from 'vue'

const needsRefresh = ref(false)
const offlineReady = ref(false)
const isOnline = ref(true)
const updateDismissed = ref(false)
const installPromptEvent = ref(null)
const canInstall = ref(false)
const isDownloading = ref(false)
const downloadComplete = ref(false)

let registration = null

export function usePwa() {
  const updateServiceWorker = async () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      needsRefresh.value = false
      window.location.reload()
    }
  }

  const dismissUpdate = () => {
    updateDismissed.value = true
    needsRefresh.value = false
  }

  const promptInstall = async () => {
    if (!installPromptEvent.value) return false
    
    installPromptEvent.value.prompt()
    const { outcome } = await installPromptEvent.value.userChoice
    
    if (outcome === 'accepted') {
      canInstall.value = false
      installPromptEvent.value = null
    }
    
    return outcome === 'accepted'
  }

  const initPwa = () => {
    if (typeof window === 'undefined') return

    // Online/offline detection
    isOnline.value = navigator.onLine
    
    const handleOnline = () => {
      isOnline.value = true
    }
    
    const handleOffline = () => {
      isOnline.value = false
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Install prompt capture
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      installPromptEvent.value = e
      canInstall.value = true
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Service worker update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        registration = reg
        offlineReady.value = true
        downloadComplete.value = true
        isDownloading.value = false
        
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                if (!updateDismissed.value) {
                  needsRefresh.value = true
                }
              }
            })
          }
        })
      })
      
      // Track initial SW installation/caching
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          const sw = reg.installing || reg.waiting || reg.active
          if (sw && sw.state !== 'activated') {
            isDownloading.value = true
            sw.addEventListener('statechange', () => {
              if (sw.state === 'activated') {
                isDownloading.value = false
                downloadComplete.value = true
              }
            })
          } else if (sw && sw.state === 'activated') {
            downloadComplete.value = true
          }
        }
      })

      // Listen for controller change to reload
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }

  return {
    needsRefresh,
    offlineReady,
    isOnline,
    updateDismissed,
    canInstall,
    isDownloading,
    downloadComplete,
    updateServiceWorker,
    dismissUpdate,
    promptInstall,
    initPwa
  }
}
