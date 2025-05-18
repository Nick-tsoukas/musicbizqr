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
  console.debug('[QR PAGE] Mounted', { params: route.params, query: route.query });

  try {
    // 1) Extract UID from query
    const uid = String(route.query.id);
    console.debug('[QR PAGE] uid =', uid);
    if (!uid) {
      console.error('[QR PAGE] No UID in query');
      return router.push('/error');
    }

    // 2) Fetch QR record (arEnabled, template, etc.)
    console.debug('[QR PAGE] Fetching QR record for slugId=', uid);
    const qrResponse = await $fetch(
      'https://qrserver-production.up.railway.app/api/qrs',
      {
        method: 'GET',
        params: { 'filters[slugId][$eq]': uid, populate: '*' }
      }
    );
    console.debug('[QR PAGE] qrResponse:', qrResponse);

    const qrData = qrResponse.data;
    console.debug('[QR PAGE] qrData.length =', qrData?.length);
    if (!qrData?.length) {
      console.error('[QR PAGE] No QR record found');
      return router.push('/error');
    }

    const qr    = qrData[0];
    const qrId  = qr.id;
    const attrs = qr.attributes;
    console.debug('[QR PAGE] QR attrs:', attrs);

    // 3) AR redirect
    console.debug('[QR PAGE] arEnabled =', attrs.arEnabled);
    if (attrs.arEnabled) {
      const tmpl = attrs.template || 'test';
      console.debug(`[QR PAGE] Redirecting to AR → /ar/${qrId}?template=${tmpl}`);
      return router.replace({ path: `/ar/${qrId}`, query: { template: tmpl } });
    }

    // 4) Record scan
    console.debug('[QR PAGE] Recording scan for', qrId);
    await $fetch('https://qrserver-production.up.railway.app/api/scans', {
      method: 'POST',
      body: { data: { date: new Date().toISOString(), qr: qrId } }
    });

    // 5) Non-AR routing
    const { q_type, link, band, event, tour, album, stream } = attrs;
    console.debug('[QR PAGE] q_type=', q_type);

    if (q_type === 'bandProfile' && band?.data) {
      const slug = band.data.attributes.slug;
      console.debug('[QR PAGE] Routing to band /' + slug);
      return router.push(`/${slug}`);
    }
    if (q_type === 'events' && event?.data) {
      const slug = event.data.attributes.slug;
      console.debug('[QR PAGE] Routing to /event/' + slug);
      return router.push(`/event/${slug}`);
    }
    // …and so on for tours, albums, etc…

    console.warn('[QR PAGE] No matching type, routing to /dashboard');
    router.push('/dashboard');

  } catch (err) {
    console.error('[QR PAGE] Caught error:', err);
    router.push('/error');
  }
});
</script>



<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #555;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
