// composables/useMetaTracking.js
export const useMetaTracking = () => {
  const nuxtApp = useNuxtApp()

  const getFbq = () => {
    try {
      return nuxtApp.$fbq
    } catch {
      return null
    }
  }

  const makeEventId = (prefix = 'evt') => {
    if (!process.client) return `${prefix}-server`
    return (
      window.crypto?.randomUUID?.() ||
      `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
    )
  }

  const setOnce = (key, value) => {
    if (!process.client) return
    if (!window.sessionStorage.getItem(key)) {
      window.sessionStorage.setItem(key, value)
    }
  }

  const get = (key) => {
    if (!process.client) return null
    return window.sessionStorage.getItem(key)
  }

  const clear = (key) => {
    if (!process.client) return
    window.sessionStorage.removeItem(key)
  }

  // Grab UTMs from URL once and store them (optional but huge later)
  const captureUtmOnce = () => {
    if (!process.client) return
    const url = new URL(window.location.href)
    const utm = {
      utm_source: url.searchParams.get('utm_source') || '',
      utm_medium: url.searchParams.get('utm_medium') || '',
      utm_campaign: url.searchParams.get('utm_campaign') || '',
      utm_content: url.searchParams.get('utm_content') || '',
      utm_term: url.searchParams.get('utm_term') || '',
    }
    // Store only if any is present
    const hasAny = Object.values(utm).some(Boolean)
    if (hasAny) {
      window.sessionStorage.setItem('mbq_utm', JSON.stringify(utm))
    }
  }

  const getUtm = () => {
    if (!process.client) return {}
    try {
      return JSON.parse(window.sessionStorage.getItem('mbq_utm') || '{}')
    } catch {
      return {}
    }
  }

  /**
   * Track a Meta event with a stable event_id and optional params.
   * - eventKey is your storage key suffix.
   * - standardName is a Meta standard event like 'Lead' or 'CompleteRegistration'.
   * - customName is your custom event name like 'SignupStarted'.
   */
  const trackWithStoredEventId = ({
    eventKey,
    standardName,
    customName,
    params = {},
    reuse = true, // reuse stored eventId if present
  }) => {
    const fbq = getFbq()
    if (!process.client || !fbq) return null

    const storageKey = `mbq_event_${eventKey}`
    let eventId = reuse ? get(storageKey) : null
    if (!eventId) {
      eventId = makeEventId(eventKey)
      setOnce(storageKey, eventId)
    }

    const payload = { ...params, ...getUtm(), event_id: eventId }

    if (standardName) fbq('track', standardName, payload)
    if (customName) fbq('trackCustom', customName, payload)

    return eventId
  }

  return {
    captureUtmOnce,
    getUtm,
    trackWithStoredEventId,
    get,
    clear,
    makeEventId,
  }
}
