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
  try {
    console.debug('[QR PAGE] Mounted, route params:', route.params, 'query:', route.query);

    // 1) Extract the UID from the path param
    const uid = String(route.params.id);
    console.debug('[QR PAGE] Extracted UID:', uid);
    if (!uid) {
      console.error('[QR PAGE] No UID provided in the URL.');
      return router.push('/error');
    }

    // 2) Fetch the QR record by slugId
    console.debug('[QR PAGE] Fetching QR record for slugId=', uid);
    const qrResponse = await $fetch(
      'https://qrserver-production.up.railway.app/api/qrs',
      {
        method: 'GET',
        params: {
          'filters[slugId][$eq]': uid,
          populate: '*'  // make sure arEnabled, template, band, etc. are populated
        }
      }
    );
    console.debug('[QR PAGE] Raw QR response:', qrResponse);

    const qrData = qrResponse.data;
    console.debug('[QR PAGE] qrData array length:', qrData?.length);
    if (!qrData?.length) {
      console.error('[QR PAGE] QR record not found for UID:', uid);
      return router.push('/error');
    }

    const qr    = qrData[0];
    const qrId  = qr.id;
    const attrs = qr.attributes;
    console.debug('[QR PAGE] QR attributes:', attrs);

    // ─── AR REDIRECT ───
    console.debug('[QR PAGE] arEnabled flag is', attrs.arEnabled);
    if (attrs.arEnabled) {
      const tmpl = attrs.template || 'test';
      console.debug(`[QR PAGE] Redirecting to AR page /ar/${qrId}?template=${tmpl}`);
      return router.replace({
        path: `/ar/${qrId}`,
        query: { template: tmpl }
      });
    }
    // ──────────────────

    // 3) Record the scan
    console.debug('[QR PAGE] Recording scan for QR ID:', qrId);
    await $fetch(
      'https://qrserver-production.up.railway.app/api/scans',
      {
        method: 'POST',
        body: {
          data: {
            date: new Date().toISOString(),
            qr: qrId
          }
        }
      }
    );

    // 4) Redirect based on q_type
    const qType = attrs.q_type;
    console.debug('[QR PAGE] q_type is', qType);
    const link  = attrs.link;

    if (qType === 'bandProfile' && attrs.band?.data) {
      const slug = attrs.band.data.attributes.slug;
      console.debug('[QR PAGE] Redirecting to band catch-all at /' + slug);
      return router.push(`/${slug}`);
    }
    if (qType === 'events' && attrs.event?.data) {
      const slug = attrs.event.data.attributes.slug;
      console.debug('[QR PAGE] Redirecting to /event/' + slug);
      return router.push(`/event/${slug}`);
    }
    if (qType === 'tours' && attrs.tour?.data) {
      const slug = attrs.tour.data.attributes.slug;
      console.debug('[QR PAGE] Redirecting to /tour/' + slug);
      return router.push(`/tour/${slug}`);
    }
    if (qType === 'albums' && attrs.album?.data) {
      const slug = attrs.album.data.attributes.slug;
      console.debug('[QR PAGE] Redirecting to /album/' + slug);
      return router.push(`/album/${slug}`);
    }
    if (qType === 'stream' && attrs.stream?.data) {
      console.debug('[QR PAGE] Redirecting to /stream/' + attrs.stream.data.id);
      return router.push(`/stream/${attrs.stream.data.id}`);
    }
    if (qType === 'social') {
      console.debug('[QR PAGE] Redirecting to /social/' + qrId);
      return router.push(`/social/${qrId}`);
    }
    if (qType === 'externalURL' && link) {
      console.debug('[QR PAGE] Redirecting externally to', link);
      window.location.href = link;
      return;
    }

    // fallback
    console.warn('[QR PAGE] No matching QR type—sending to /dashboard');
    router.push('/dashboard');

  } catch (error) {
    console.error('[QR PAGE] Error in QR redirect flow:', error);
    router.push('/error');
  }
});
</script>

<style scoped>
.loading-container {
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}
.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #555;
  border-radius: 50%;
  width: 60px; height: 60px;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
