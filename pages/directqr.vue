<template>
  <div>
    <div class="loading-container">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';


const router = useRouter();
const route = useRoute();

onMounted(async () => {
  try {
    // 1) extract the slugId from ?id=…
    const uid = String(route.query.id);
    if (!uid) {
      console.error('No UID provided in the URL.');
      return router.push('/error');
    }

    // 2) fetch the QR record by slugId
    const qrResponse = await $fetch(
      'https://qrserver-production.up.railway.app/api/qrs',
      {
        method: 'GET',
        params: {
          'filters[slugId][$eq]': uid,
          populate: '*'        // ← make sure arEnabled & template are included here
        }
      }
    );
    const qrData = qrResponse.data;
    if (!qrData?.length) {
      console.error('QR record not found for UID:', uid);
      return router.push('/error');
    }
    const qr = qrData[0];
    const qrId = qr.id;
    const attrs = qr.attributes;

    // ──────── AR REDIRECT ────────
    // 3) if arEnabled, send into your AR page
    if (attrs.arEnabled) {
      const tmpl = attrs.template || 'test';
      return router.replace({
        path: `/ar/${qrId}`,
        query: { template: tmpl }
      });
    }
    // ─────────────────────────────

    // 4) record the scan
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

    // 5) now do your regular redirects
    const qType = attrs.q_type;
    const link  = attrs.link;

    if (qType === 'bandProfile' && attrs.band?.data) {
      const slug = attrs.band.data.attributes.slug;
      return router.push({ path: `/${slug}` });
    }
    if (qType === 'events' && attrs.event?.data) {
      const slug = attrs.event.data.attributes.slug;
      return router.push({ path: `/event/${slug}` });
    }
    if (qType === 'tours' && attrs.tour?.data) {
      const slug = attrs.tour.data.attributes.slug;
      return router.push({ path: `/tour/${slug}` });
    }
    if (qType === 'albums' && attrs.album?.data) {
      const slug = attrs.album.data.attributes.slug;
      return router.push({ path: `/album/${slug}` });
    }
    if (qType === 'stream' && attrs.stream?.data) {
      return router.push({ path: `/stream/${attrs.stream.data.id}` });
    }
    if (qType === 'social') {
      return router.push({ path: `/social/${qrId}` });
    }
    if (qType === 'externalURL' && link) {
      return window.location.href = link;
    }

    // fallback
    console.log('No matching QR type—sending to dashboard');
    router.push('/dashboard');

  } catch (error) {
    console.error('Error in QR redirect flow:', error);
    router.push('/error');
  }
});
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #555;
  border-radius: 50%;
  width: 60px; height: 60px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
