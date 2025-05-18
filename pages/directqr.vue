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
  const base   = 'https://qrserver-production.up.railway.app';
  const slugId = String(route.query.id);
  console.debug('[QR PAGE] Mounted', { query: route.query });
  console.debug('[QR PAGE] slugId =', slugId);

  if (!slugId) {
    console.error('[QR PAGE] No slugId provided');
    return router.push('/error');
  }

  // 1) Try filtering on slugId
  let url = `${base}/api/qrs?filters[slugId][$eq]=${encodeURIComponent(slugId)}&populate=*`;
  console.debug('[QR PAGE] Trying slugId filter →', url);
  let qrResponse: any = await $fetch(url, { method: 'GET' });
  console.debug('[QR PAGE] qrResponse (slugId):', qrResponse);

  // 2) If empty, fallback to filtering on url contains "?id=slugId"
  if (!Array.isArray(qrResponse.data) || qrResponse.data.length === 0) {
    const containsParam = encodeURIComponent(`?id=${slugId}`);
    url = `${base}/api/qrs?filters[url][$contains]=${containsParam}&populate=*`;
    console.debug('[QR PAGE] Falling back to URL filter →', url);
    qrResponse = await $fetch(url, { method: 'GET' });
    console.debug('[QR PAGE] qrResponse (url):', qrResponse);
  }

  // 3) Inspect returned records
  if (Array.isArray(qrResponse.data)) {
    qrResponse.data.forEach((r: any, i: number) => {
      console.debug(`[QR PAGE] record[${i}] slugId="${r.attributes.slugId}" url="${r.attributes.url}"`);
    });
  }

  const qrData = qrResponse.data;
  if (!Array.isArray(qrData) || qrData.length === 0) {
    console.error('[QR PAGE] No QR record found after both filters');
    return router.push('/error');
  }

  // 4) Use the first matching QR
  const qr    = qrData[0];
  const qrId  = qr.id;
  const attrs = qr.attributes;
  console.debug('[QR PAGE] Using QR ID =', qrId, 'attrs =', attrs);

  // 5) AR redirect
  console.debug('[QR PAGE] arEnabled =', attrs.arEnabled);
  if (attrs.arEnabled) {
    const tmpl = attrs.template || 'test';
    console.debug(`[QR PAGE] AR enabled → redirect to /ar/${qrId}?template=${tmpl}`);
    return router.replace({ path: `/ar/${qrId}`, query: { template: tmpl } });
  }

  // 6) Record the scan
  console.debug('[QR PAGE] Recording scan for QR ID:', qrId);
  await $fetch(`${base}/api/scans`, {
    method: 'POST',
    body: { data: { date: new Date().toISOString(), qr: qrId } }
  });

  // 7) Non-AR routing logic
  const { q_type, link, band, event, tour, album, stream } = attrs;
  console.debug('[QR PAGE] q_type =', q_type);

  if (q_type === 'bandProfile' && band?.data) {
    const slug = band.data.attributes.slug;
    console.debug('[QR PAGE] Redirecting to band catch-all /' + slug);
    return router.push(`/${slug}`);
  } else if (q_type === 'events' && event?.data) {
    const slug = event.data.attributes.slug;
    console.debug('[QR PAGE] Redirecting to /event/' + slug);
    return router.push(`/event/${slug}`);
  } else if (q_type === 'tours' && tour?.data) {
    const slug = tour.data.attributes.slug;
    console.debug('[QR PAGE] Redirecting to /tour/' + slug);
    return router.push(`/tour/${slug}`);
  } else if (q_type === 'albums' && album?.data) {
    const slug = album.data.attributes.slug;
    console.debug('[QR PAGE] Redirecting to /album/' + slug);
    return router.push(`/album/${slug}`);
  } else if (q_type === 'stream' && stream?.data) {
    const streamId = stream.data.id;
    console.debug('[QR PAGE] Redirecting to /stream/' + streamId);
    return router.push(`/stream/${streamId}`);
  } else if (q_type === 'social') {
    console.debug('[QR PAGE] Redirecting to /social/' + qrId);
    return router.push(`/social/${qrId}`);
  } else if (q_type === 'externalURL' && link) {
    console.debug('[QR PAGE] Redirecting externally to:', link);
    window.location.href = link;
    return;
  } else {
    console.warn('[QR PAGE] No matching QR type—sending to /dashboard');
    return router.push('/dashboard');
  }
});
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
