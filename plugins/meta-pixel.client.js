// plugins/meta-pixel.client.js
export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = true
    t.src = 'https://connect.facebook.net/en_US/fbevents.js'
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script')

  // Init pixel
  window.fbq('init', '2397193350740405')
  window.fbq('track', 'PageView')

  // ✅ B.2 — CAPTURE UTMs ONCE (ADD THIS BLOCK RIGHT HERE)
  try {
    const url = new URL(window.location.href)
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    const hasUtm = keys.some((k) => url.searchParams.get(k))

    // Only write if we actually have UTMs
    if (hasUtm) {
      const utm = {
        utm_source: url.searchParams.get('utm_source') || '',
        utm_medium: url.searchParams.get('utm_medium') || '',
        utm_campaign: url.searchParams.get('utm_campaign') || '',
        utm_content: url.searchParams.get('utm_content') || '',
        utm_term: url.searchParams.get('utm_term') || '',
      }
      sessionStorage.setItem('mbq_utm', JSON.stringify(utm))
    }
  } catch (e) {
    // ignore
  }

  // Track Nuxt route changes
  nuxtApp.hook('page:finish', () => {
    window.fbq('track', 'PageView')
  })

  console.log('Meta Pixel plugin loaded')

  return {
    provide: {
      fbq: (...args) => window.fbq(...args),
    },
  }
})
