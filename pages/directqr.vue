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
    // Extract the UID from the query parameter "id"
    const uid = String(route.query.id);
    console.log('Extracted UID:', uid);

    if (!uid) {
      console.error('No UID provided in the URL.');
      router.push('/error');
      return;
    }

    // Fetch the QR record using a filter on slugId with bracket notation, using production URL
    const qrResponse = await $fetch('https://qrserver-production.up.railway.app/api/qrs', {
      method: 'GET',
      params: {
        'filters[slugId][$eq]': uid,
        populate: '*'
      }
    });
    console.log('QR Response:', qrResponse);

    const qrData = qrResponse.data;
    if (qrData && qrData.length > 0) {
      const qr = qrData[0];
      const qrId = qr.id;

      // Record the scan by creating a new scan record in Strapi on production
      await $fetch('https://qrserver-production.up.railway.app/api/scans', {
        method: 'POST',
        body: {
          data: {
            date: new Date().toISOString(),
            qr: qrId
          }
        }
      });
      console.log('Scan recorded for QR ID:', qrId);

      // Determine redirection based on QR type
      const qType = qr.attributes.q_type;
      const link = qr.attributes.link;

      if (qType === 'bandProfile' && qr.attributes.band?.data) {
        const bandSlug = qr.attributes.band.data.attributes.slug;
        router.push({ path: `/${bandSlug}` });
      } else if (qType === 'events' && qr.attributes.event?.data) {
        const eventSlug = qr.attributes.event.data.attributes.slug;
        router.push({ path: `/event/${eventSlug}` });
      } else if (qType === 'tours' && qr.attributes.tour?.data) {
        const tourSlug = qr.attributes.tour.data.attributes.slug;
        router.push({ path: `/tour/${tourSlug}` });
      } else if (qType === 'albums' && qr.attributes.album?.data) {
        const albumSlug = qr.attributes.album.data.attributes.slug;
        router.push({ path: `/album/${albumSlug}` });
      } else if (qType === 'stream' && qr.attributes.stream?.data) {
        const streamId = qr.attributes.stream.data.id;
        router.push({ path: `/stream/${streamId}` });
      } else if (qType === 'social') {
        router.push({ path: `/social/${qrId}` });
      } else if (qType === 'externalURL' && link) {
        window.location.href = link;
      } else {
        console.log('No matching QR type found. Redirecting to dashboard.');
        router.push('/dashboard');
      }
    } else {
      console.error('QR record not found for UID:', uid);
      router.push('/error');
    }
  } catch (error) {
    console.error('Error fetching QR code data:', error);
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