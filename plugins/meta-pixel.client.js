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

  // Track Nuxt route changes
  nuxtApp.hook('page:finish', () => {
    window.fbq('track', 'PageView')
  })
console.log("Meta Pixel plugin loaded")

  return {
    
    provide: {
      fbq: (...args) => window.fbq(...args),
    },
  }
})

