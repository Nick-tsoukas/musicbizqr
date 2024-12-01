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
    // Get the full URL including the query parameters
    const fullUrl = window.location.href;

    console.log('Full URL:', fullUrl); // For debugging

    // Fetch the QR data using the full URL
    const response = await client('/qrs', {
      method: 'GET',
      params: {
        filters: {
          url: fullUrl, // Use the full URL for filtering
        },
        populate: '*', // To fetch related data like band, event, tour, etc.
      },
    });

    const qrData = response.data;

    console.log('QR Data:', qrData); // For debugging

    if (qrData && qrData.length > 0) {
      const qr = qrData[0];
      console.log('QR Object:', qr);

      const qrId = qr.id;

      // **Increment the scan count**
      const currentScanCount = qr.attributes.scans || 0;
      const newScanCount = currentScanCount + 1;

      // Update the scan count in the QR code
      await update('qrs', qrId, {
        scans: newScanCount,
      });

      console.log(`Scan count updated to ${newScanCount}`);

      // Create a new scan entry in 'scans' collection
      await create('scans', {
        data: {
          date: new Date().toISOString(),
          qr: qrId,
        },
      });
      console.log('Scan entry created');

      // Accessing attributes and relationships from the QR code
      const qType = qr.attributes.q_type;
      const link = qr.attributes.link;

      // Check the QR type and perform the appropriate redirection
      if (qType === 'bandProfile' && qr.attributes.band.data) {
        const bandId = qr.attributes.band.data.id;
        console.log('Redirecting to band:', bandId);
        router.push({ path: `/band/${bandId}` });
      } else if (qType === 'events' && qr.attributes.event.data) {
        const eventId = qr.attributes.event.data.id;
        console.log('Redirecting to event:', eventId);
        router.push({ path: `/event/${eventId}` });
      } else if (qType === 'tours' && qr.attributes.tour.data) {
        const tourId = qr.attributes.tour.data.id;
        console.log('Redirecting to tour:', tourId);
        router.push({ path: `/tour/${tourId}` });
      } else if (qType === 'albums' && qr.attributes.album.data) {
        const albumId = qr.attributes.album.data.id;
        console.log('Redirecting to album:', albumId);
        router.push({ path: `/album/${albumId}` });
      } else if (qType === 'stream' && qr.attributes.stream?.data) {
        const streamId = qr.attributes.stream.data.id;
        console.log('Redirecting to stream link:', streamId);
        router.push({ path: `/stream/${streamId}` });
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
  background-color: rgba(255, 255, 255, 0.8);
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
