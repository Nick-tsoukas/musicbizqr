<template>
  <div>
    <div class="loading-container">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route  = useRoute();

onMounted(async () => {
  const base = 'https://qrserver-production.up.railway.app'

  // NEW: Build both full and canonical URLs
  const origin  = window.location.origin
  const fullUrl = origin + route.fullPath
  const u = new URL(window.location.href)
  u.hash = ''
  u.search = '' // strip UTM/fbclid/etc.
  const host = u.host.replace(/^www\./i, '')
  const canonicalUrl = `${u.protocol}//${host}${u.pathname}`.replace(/\/+$/,'')
  console.debug('[QR PAGE] fullUrl =', fullUrl, 'canonicalUrl =', canonicalUrl)

  try {
    // NEW: Try canonical first, then full URL (fallback) in one query
    const fetchUrl =
      `${base}/api/qrs?populate=*&filters[$or][0][url][$eq]=${encodeURIComponent(canonicalUrl)}` +
      `&filters[$or][1][url][$eq]=${encodeURIComponent(fullUrl)}`
    console.debug('[QR PAGE] Fetching QR →', fetchUrl)

    const qrResponse: any = await $fetch(fetchUrl, { method: 'GET' })
    const qrData = qrResponse?.data
    if (!Array.isArray(qrData) || qrData.length === 0) {
      console.error('[QR PAGE] No QR record found for', { canonicalUrl, fullUrl })
      return router.push('/error')
    }

    // Use the first matching QR entry
    const qr    = qrData[0]
    const qrId  = qr.id
    const attrs = qr.attributes
    console.debug('[QR PAGE] Using QR ID =', qrId, 'attrs =', attrs)

    // Record the scan (your original payload is correct)
    console.debug('[QR PAGE] Recording scan for QR ID:', qrId)
    await $fetch(`${base}/api/scans`, {
      method: 'POST',
      body: { data: { date: new Date().toISOString(), qr: qrId } },
    })

    // Route as before
    const { q_type, link, band, event, tour, album, stream } = attrs
    if (q_type === 'bandProfile' && band?.data) {
      const slug = band.data.attributes.slug
      return router.push(`/${slug}`)
    } else if (q_type === 'events' && event?.data) {
      const slug = event.data.attributes.slug
      return router.push(`/event/${slug}`)
    } else if (q_type === 'tours' && tour?.data) {
      const slug = tour.data.attributes.slug
      return router.push(`/tour/${slug}`)
    } else if (q_type === 'albums' && album?.data) {
      const slug = album.data.attributes.slug
      return router.push(`/album/${slug}`)
    } else if (q_type === 'stream' && stream?.data) {
      const sid = stream.data.id
      return router.push(`/stream/${sid}`)
    } else if (q_type === 'social') {
      return router.push(`/social/${qrId}`)
    } else if (q_type === 'externalURL' && link) {
      const raw = String(link).trim()
      const target = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
      window.location.href = target
      return
    } else {
      console.warn('[QR PAGE] No matching QR type—sending to /dashboard')
      return router.push('/dashboard')
    }
  } catch (error) {
    console.error('[QR PAGE] Error in QR flow:', error)
    router.push('/error')
  }
})

</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: #000; z-index: 9999;
}
.spinner {
  border: 8px solid #444;
  border-top: 8px solid #0f0;
  border-radius: 50%;
  width: 60px; height: 60px;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
