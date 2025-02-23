<template>
  <div>
    <div class="loading-container">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const { create, update } = useStrapi();
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();



onMounted(async () => {
  try {
    // Get the full URL including query parameters
    const fullUrl = window.location.href;
    console.log('Full URL:', fullUrl);

    // Fetch the QR data using the full URL
    const response = await client('/qrs', {
      method: 'GET',
      params: {
        filters: { url: fullUrl },
        populate: '*',
      },
    });
    const qrData = response.data;
    console.log('QR Data:', qrData);

    if (qrData && qrData.length > 0) {
      const qr = qrData[0];
      // console.log('QR Object:', qr);
      const qrId = qr.id;

      // Track the scan by creating a new scan record in Strapi
      // The 'date' field uses the current date/time and the relation 'qr' links to the QR record
      await client('/scans', {
        method: 'POST',
        data: {
          date: new Date().toISOString(),
          qr: qrId
        }
      });
      // console.log('Scan recorded for QR ID:', qrId);

      // Accessing attributes and relationships from the QR code
      const qType = qr.attributes.q_type;
      const link = qr.attributes.link;

      // Check the QR type and perform the appropriate redirection
      if (qType === 'bandProfile' && qr.attributes.band?.data) {
        const bandSlug = qr.attributes.band.data.attributes.slug;
        router.push({ path: `/${bandSlug}` });
      } else if (qType === 'events' && qr.attributes.event?.data) {
        const eventSlug = qr.attributes.event.data.attributes.slug;
        console.log('Redirecting to event:', eventSlug);
        router.push({ path: `/event/${eventSlug}` });
      } else if (qType === 'tours' && qr.attributes.tour?.data) {
        const tourSlug = qr.attributes.tour.data.attributes.slug;
        console.log('Redirecting to tour:', tourSlug);
        router.push({ path: `/tour/${tourSlug}` });
      } else if (qType === 'albums' && qr.attributes.album?.data) {
        const albumSlug = qr.attributes.album.data.attributes.slug;
        console.log('Redirecting to album:', albumSlug);
        router.push({ path: `/album/${albumSlug}` });
      } else if (qType === 'stream' && qr.attributes.stream?.data) {
        const streamId = qr.attributes.stream.data.id;
        console.log('Redirecting to stream link:', streamId);
        router.push({ path: `/stream/${streamId}` });
      } else if (qType === 'social') {
        console.log('Redirecting to social links page');
        router.push({ path: `/social/${qrId}` });
      } else if (qType === 'externalURL' && link) {
        console.log('Redirecting to external URL:', link);
        window.location.href = link;
      } else {
        console.log('No matching QR type found. Redirecting to dashboard.');
        router.push('/dashboard');
      }
    } else {
      console.error('QR code not found for URL:', fullUrl);
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
