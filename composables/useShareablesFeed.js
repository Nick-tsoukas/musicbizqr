import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import { useShareKit } from './useShareKit'

/**
 * Composable for fetching and normalizing shareable items from multiple sources
 * into a unified feed format.
 */
export function useShareablesFeed(bandData) {
  const config = useRuntimeConfig()
  const { buildShareUrl } = useShareKit()

  // State
  const loading = ref(true)
  const refreshing = ref(false)
  const items = ref([])
  const error = ref(null)

  // Band data refs
  const bandId = computed(() => bandData.value?.id || bandData.id)
  const bandSlug = computed(() => bandData.value?.slug || bandData.slug || '')
  const bandName = computed(() => bandData.value?.name || bandData.name || 'This Artist')
  const bandImageUrl = computed(() => bandData.value?.imageUrl || bandData.imageUrl || null)
  const isBandNameInLogo = computed(() => bandData.value?.isBandNameInLogo || bandData.isBandNameInLogo || false)

  // Get origin for URLs
  function getOrigin() {
    return typeof window !== 'undefined' ? window.location.origin : 'https://musicbizqr.com'
  }

  // Normalize recap data into ShareableItem
  function normalizeRecap(recap, kind) {
    const isReal = kind === 'real'
    const origin = getOrigin()
    const slug = bandSlug.value

    // CRITICAL: mini recaps must NOT use "show" or "last night" language
    let title, windowLabel
    if (isReal) {
      title = recap.shareTitle || 'After-Show Recap'
      windowLabel = 'After show'
    } else {
      title = '24-Hour Recap'
      windowLabel = 'Last 24h'
    }

    // Build stats
    const totalInteractions = recap.context?.totalInteractions || 0
    const topCity = recap.context?.topCity?.name || recap.context?.topCity || null
    const primaryStat = totalInteractions > 0 ? `${totalInteractions} interactions` : 'Activity recap'
    const secondaryStat = topCity ? `Top city: ${topCity}` : (recap.context?.topMedia?.title ? `Top play: ${recap.context.topMedia.title}` : '')

    // Build captions based on kind
    let captions
    if (isReal) {
      const venue = recap.context?.venueName || ''
      captions = {
        hype: venue
          ? `${venue} was on fire last night 🔥 ${bandName.value} brought the energy!`
          : `Last night was incredible 🔥 ${bandName.value} brought the energy!`,
        grateful: venue
          ? `Thank you ${venue} for an amazing night 🙏 We felt every moment.`
          : `Thank you for showing up 🙏 We felt every moment with you.`,
        tease: venue
          ? `${venue}… that was just the beginning 👀`
          : `That was just the beginning… stay close 👀`,
      }
    } else {
      captions = {
        hype: `${bandName.value} is building momentum 🔥 Check out what's happening!`,
        grateful: `Thank you for the love today 🙏 Every listen matters.`,
        tease: `Something's brewing… stay tuned 👀`,
      }
    }

    return {
      id: `recap:${recap.id || 'current'}`,
      source: 'recap',
      kind: isReal ? 'AFTER_SHOW_RECAP' : 'DAILY_RECAP_24H',
      windowLabel,
      title,
      primaryStat,
      secondaryStat,
      microCaption: isReal ? 'The crowd brought the energy' : 'Momentum is building',
      band: {
        id: bandId.value,
        slug,
        name: bandName.value,
        imageUrl: bandImageUrl.value,
        isBandNameInLogo: isBandNameInLogo.value,
      },
      share: {
        shareUrl: buildShareUrl({ bandSlug: slug }),
        ogUrl: recap.id ? `${origin}/share/moment/${recap.id}` : `${origin}/share/band/${slug}`,
        captions,
        defaultCaptionStyle: 'hype',
      },
      context: recap.context || {},
      _priority: isReal ? 100 : 80,
    }
  }

  // Normalize prompt card into ShareableItem
  function normalizePrompt(card, index) {
    const origin = getOrigin()
    const slug = bandSlug.value

    // Determine share URL
    let shareUrl = buildShareUrl({ bandSlug: slug })
    if (card.type === 'HOT_LINK' && card.payload?.url) {
      shareUrl = card.payload.url
    }

    // Map card type to kind
    const kindMap = {
      'CITY_HEATING_UP': 'CITY_HEATING_UP',
      'HOT_LINK': 'HOT_LINK',
      'TOP_MEDIA': 'TOP_MEDIA',
      'STREAK': 'STREAK',
    }

    return {
      id: `prompt:${card.type}:${index}`,
      source: 'prompt',
      kind: kindMap[card.type] || card.type || 'MOMENTUM_PROMPT',
      windowLabel: 'Last 24h',
      title: card.title,
      primaryStat: card.stat || '',
      secondaryStat: card.why || '',
      microCaption: null,
      band: {
        id: bandId.value,
        slug,
        name: bandName.value,
        imageUrl: bandImageUrl.value,
        isBandNameInLogo: isBandNameInLogo.value,
      },
      share: {
        shareUrl,
        ogUrl: `${origin}/share/band/${slug}`,
        captions: card.captions || {
          hype: `${bandName.value} is heating up 🔥`,
          grateful: `Thank you for being part of this 🙏`,
          tease: `Something's happening… 👀`,
        },
        defaultCaptionStyle: 'hype',
      },
      context: card.payload || {},
      _priority: 40 + (card.priority || 0),
    }
  }

  // Normalize spike/pulse moment into ShareableItem
  function normalizeSpike(moment) {
    const origin = getOrigin()
    const slug = bandSlug.value

    const cityName = moment.context?.cityName || ''
    const velocity = moment.context?.velocity || ''

    const captions = {
      hype: cityName
        ? `${cityName} is going off right now 🔥 ${bandName.value} is heating up!`
        : velocity
          ? `${velocity}x the normal energy 🔥 ${bandName.value} is surging!`
          : `Something's happening with ${bandName.value} 🔥`,
      grateful: cityName
        ? `${cityName}, we see you 🙏 Thank you for the love.`
        : `Thank you for being part of this moment 🙏`,
      tease: cityName
        ? `${cityName}… we might need to come see you 👀`
        : `Something's building… stay close 👀`,
    }

    return {
      id: `spike:${moment.id}`,
      source: 'spike',
      kind: 'MOMENTUM_SPIKE',
      windowLabel: 'Live',
      title: moment.shareTitle || 'Fan energy is surging',
      primaryStat: velocity ? `${velocity}x baseline` : 'Energy spike',
      secondaryStat: cityName ? `Hot in ${cityName}` : '',
      microCaption: 'Fans are tuning in',
      band: {
        id: bandId.value,
        slug,
        name: bandName.value,
        imageUrl: bandImageUrl.value,
        isBandNameInLogo: isBandNameInLogo.value,
      },
      share: {
        shareUrl: buildShareUrl({ bandSlug: slug }),
        ogUrl: moment.id ? `${origin}/share/moment/${moment.id}` : `${origin}/share/band/${slug}`,
        captions,
        defaultCaptionStyle: 'hype',
      },
      context: moment.context || {},
      _priority: 60,
    }
  }

  // Fetch all data and normalize
  async function fetchItems() {
    const strapiUrl = config.public.strapiUrl
    const id = bandId.value
    if (!id) return

    const normalized = []

    try {
      const [recapRes, promptsRes, spikesRes] = await Promise.all([
        fetch(`${strapiUrl}/api/fan-moments/recap-active?bandId=${id}&allowMini=true`)
          .then(r => r.json())
          .catch(() => ({ ok: false })),

        fetch(`${strapiUrl}/api/pulse/whats-hot?bandId=${id}`)
          .then(r => r.json())
          .catch(() => ({ ok: false })),

        fetch(`${strapiUrl}/api/fan-moments/auto-active?bandId=${id}`)
          .then(r => r.json())
          .catch(() => ({ ok: false })),
      ])

      // Process recap
      if (recapRes.ok && recapRes.recap) {
        normalized.push(normalizeRecap(recapRes.recap, recapRes.kind || 'real'))
      }

      // Process prompts
      if (promptsRes.ok && promptsRes.hot?.cards?.length > 0) {
        promptsRes.hot.cards.forEach((card, index) => {
          normalized.push(normalizePrompt(card, index))
        })
      }

      // Process spikes
      if (spikesRes.ok && spikesRes.moment) {
        normalized.push(normalizeSpike(spikesRes.moment))
      }

      items.value = normalized
      error.value = null
    } catch (err) {
      console.error('[useShareablesFeed] Failed to fetch:', err)
      error.value = err
      items.value = []
    }
  }

  // Filtered lists by source
  const recaps = computed(() => items.value.filter(i => i.source === 'recap'))
  const spikes = computed(() => items.value.filter(i => i.source === 'spike'))
  const prompts = computed(() => items.value.filter(i => i.source === 'prompt'))

  // Recommended: sorted by priority (highest first)
  const recommended = computed(() => {
    return [...items.value].sort((a, b) => (b._priority || 0) - (a._priority || 0))
  })

  // Get items for a specific tab
  function getItemsForTab(tab) {
    switch (tab) {
      case 'recaps':
        return recaps.value
      case 'spikes':
        return spikes.value
      case 'prompts':
        return prompts.value
      case 'recommended':
      default:
        return recommended.value
    }
  }

  // Initial fetch
  async function init() {
    loading.value = true
    await fetchItems()
    loading.value = false
  }

  // Refresh
  async function refresh() {
    refreshing.value = true
    await fetchItems()
    refreshing.value = false
  }

  return {
    loading,
    refreshing,
    items,
    error,
    recaps,
    spikes,
    prompts,
    recommended,
    getItemsForTab,
    init,
    refresh,
  }
}
