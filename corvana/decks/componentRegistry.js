// Component registry for Corvana deck renderer
import { defineAsyncComponent } from 'vue'
import { getDemoData } from '~/corvana/demo/demoData.js'

// Lazy-loaded components
const SmartLinkSurface = defineAsyncComponent(() => 
  import('~/components/band/BandPageCompact.vue')
)

// Band page style variants
const BandPageStyleDefault = defineAsyncComponent(() => 
  import('~/components/band/BandPageStyleDefault.vue')
)

const BandPageStyleCompact = defineAsyncComponent(() => 
  import('~/components/band/BandPageStyleCompact.vue')
)

const BandPageStyleBold = defineAsyncComponent(() => 
  import('~/components/band/BandPageStyleBold.vue')
)

const ShareablesGrid = defineAsyncComponent(() => 
  import('~/components/shareables/ShareablesFeed.vue')
)

// New components for Step 2
const LiveSurfaceFeed = defineAsyncComponent(() => 
  import('~/components/smartlink/LiveFeed.vue')
)

const BandAnalyticsOverview = defineAsyncComponent(() => 
  import('~/components/demo/AnalyticsDemoInline.vue')
)

const SupportMomentsButtons = defineAsyncComponent(() => 
  import('~/components/smartlink/SupportModule.vue')
)

const AgencyRosterSignals = defineAsyncComponent(() => 
  import('~/corvana/decks/AgencyDeckPanel.vue')
)

// Component registry
export const componentRegistry = {
  'SmartLinkSurface': {
    component: SmartLinkSurface,
    buildProps: (demoDataKey) => {
      const data = getDemoData(demoDataKey)
      const band = data.band
      
      return {
        band: {
          name: band.name,
          bio: band.tagline,
          genre: band.genre,
          bandImg: { url: band.imageUrl },
          isBandNameInLogo: false,
          slug: 'neon-avenue',
          // Streaming links
          spotify: 'https://open.spotify.com/artist/neon-avenue',
          appleMusic: 'https://music.apple.com/artist/neon-avenue',
          youtube: 'https://youtube.com/@neonavenue',
          soundcloud: 'https://soundcloud.com/neonavenue',
          // Social links
          instagram: 'https://instagram.com/neonavenue',
          tiktok: 'https://tiktok.com/@neonavenue',
          twitter: 'https://twitter.com/neonavenue',
          // Featured song
          singlesong: {
            title: 'Neon Lights',
            isEmbed: false,
            song: { url: '/demo/neon-lights.mp3' }
          },
          // Featured video
          singlevideo: {
            youtubeid: 'dQw4w9WgXcQ'
          }
        },
        bandSlug: 'neon-avenue',
        upcomingEvents: [
          {
            id: 1,
            city: 'Chicago',
            state: 'IL',
            venue: 'Metro',
            date: '2026-02-15',
            ticketLink: 'https://tickets.example.com'
          },
          {
            id: 2,
            city: 'Detroit',
            state: 'MI',
            venue: 'The Fillmore',
            date: '2026-02-18',
            ticketLink: 'https://tickets.example.com'
          }
        ],
        hiddenLinks: [],
        enabledPaymentButtons: ['quickTip'],
        followablePlatforms: ['spotify', 'instagram']
      }
    }
  },
  
  'ShareablesGrid': {
    component: ShareablesGrid,
    buildProps: (demoDataKey) => {
      const data = getDemoData(demoDataKey)
      
      return {
        bandId: 'demo-band',
        bandName: 'Neon Avenue',
        bandSlug: 'neon-avenue',
        bandImageUrl: '/demo/neonposter.png',
        isBandNameInLogo: false
      }
    }
  },

  // New Step 2 components
  'LiveSurfaceFeed': {
    component: LiveSurfaceFeed,
    buildProps: (demoDataKey) => {
      const data = getDemoData(demoDataKey)
      const rawFeed = data.liveSurface?.recentActivityFeed || []
      
      // Transform demo data to match LiveFeed component expectations
      const feedItems = rawFeed.map(item => ({
        id: item.id,
        icon: item.icon || '🎵',
        copy: item.headline || item.detail,
        timestamp: Date.now() - (parseInt(item.time) || 5) * 60000,
        type: item.type
      }))
      
      return {
        feedItems: feedItems,
        primaryFeedItem: feedItems[0] || null,
        hasFeedItems: feedItems.length > 0,
        displayMode: 'multi',
        maxItems: 5
      }
    }
  },

  'BandAnalyticsOverview': {
    component: BandAnalyticsOverview,
    buildProps: () => {
      // AnalyticsDemoInline is self-contained, no props needed
      return {}
    }
  },

  'SupportMomentsButtons': {
    component: SupportMomentsButtons,
    buildProps: (demoDataKey) => {
      const data = getDemoData(demoDataKey)
      
      return {
        bandName: 'Neon Avenue',
        showQuickTips: true,
        quickTipAmounts: data.quickTipAmounts || [5, 10, 20],
        pageMode: 'QUIET',
        paymentButtons: []
      }
    }
  },

  'AgencyRosterSignals': {
    component: AgencyRosterSignals,
    buildProps: (demoDataKey) => {
      const data = getDemoData(demoDataKey)
      
      return {
        agencyData: data
      }
    }
  }
}

// Helper to resolve component
export function resolveComponent(componentKey) {
  const registry = componentRegistry[componentKey]
  if (!registry) {
    throw new Error(`Component "${componentKey}" not found in registry`)
  }
  return registry
}
