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
const route = useRoute();

onMounted(async () => {
  try {
    // 1) Extract the UID from the query parameter "id"
    const uid = String(route.query.id);
    console.log('Extracted UID:', uid);

    if (!uid) {
      console.error('No UID provided in the URL.');
      router.push('/error');
      return;
    }

    // 2) Fetch the QR record by slugId (including arEnabled & template)
    const qrResponse = await $fetch(
      'https://qrserver-production.up.railway.app/api/qrs',
      {
        method: 'GET',
        params: {
          'filters[slugId][$eq]': uid,
          populate: '*'    // ensures arEnabled, template, band, etc. are returned
        }
      }
    );
    console.log('QR Response:', qrResponse);

    const qrData = qrResponse.data;
    if (!qrData?.length) {
      console.error('QR record not found for UID:', uid);
      router.push('/error');
      return;
    }

    const qr = qrData[0];
    const qrId = qr.id;
    const attrs = qr.attributes;
    console.log('QR Attributes:', attrs);

    // 3) AR redirect logic
    if (attrs.arEnabled) {
      const tmpl = attrs.template || 'test';
      console.log(`AR enabled for QR ${qrId}, redirecting to /ar/${qrId}?template=${tmpl}`);
      return router.replace({
        path: `/ar/${qrId}`,
        query: { template: tmpl }
      });
    }

    // 4) Record the scan
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
    console.log('Scan recorded for QR ID:', qrId);

    // 5) Regular redirects based on q_type
    const qType = attrs.q_type;
    const link  = attrs.link;
    console.log('QR type:', qType);

    if (qType === 'bandProfile' && attrs.band?.data) {
      const bandSlug = attrs.band.data.attributes.slug;
      console.log('Redirecting to band page:', `/${bandSlug}`);
      router.push({ path: `/${bandSlug}` });
    } else if (qType === 'events' && attrs.event?.data) {
      const eventSlug = attrs.event.data.attributes.slug;
      console.log('Redirecting to event page:', `/event/${eventSlug}`);
      router.push({ path: `/event/${eventSlug}` });
    } else if (qType === 'tours' && attrs.tour?.data) {
      const tourSlug = attrs.tour.data.attributes.slug;
      console.log('Redirecting to tour page:', `/tour/${tourSlug}`);
      router.push({ path: `/tour/${tourSlug}` });
    } else if (qType === 'albums' && attrs.album?.data) {
      const albumSlug = attrs.album.data.attributes.slug;
      console.log('Redirecting to album page:', `/album/${albumSlug}`);
      router.push({ path: `/album/${albumSlug}` });
    } else if (qType === 'stream' && attrs.stream?.data) {
      const streamId = attrs.stream.data.id;
      console.log('Redirecting to stream page:', `/stream/${streamId}`);
      router.push({ path: `/stream/${streamId}` });
    } else if (qType === 'social') {
      console.log('Redirecting to social page:', `/social/${qrId}`);
      router.push({ path: `/social/${qrId}` });
    } else if (qType === 'externalURL' && link) {
      console.log('Redirecting externally to:', link);
      window.location.href = link;
    } else {
      console.log('No matching QR type found. Redirecting to dashboard.');
      router.push('/dashboard');
    }

  } catch (error) {
    console.error('Error fetching or redirecting QR code data:', error);
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
