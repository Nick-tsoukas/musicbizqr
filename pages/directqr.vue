<template>
  <div>
    <p>Redirecting...</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter();
const route = useRoute();
const uuid = route.query.id; // Get the UUID from query params
const client = useStrapiClient(); // Assuming Strapi is set up

onMounted(async () => {
  try {
    // Fetch the QR data using the UUID
    const { data: qrData } = await client(`/qrs`, {
      method: 'GET',
      params: {
        filters: {
          url: route.params.id, // Assuming 'url' is where you store the UUID
        },
        populate: '*', // To fetch related data like band, event, tour, etc.
      },
    });

    if (qrData && qrData.length > 0) {
      const qr = qrData[0]; // Assuming you get one QR code per UUID
console.log(qrData , 'this is qr data')
      // Check the QR type and perform the appropriate redirection
      if (qr.q_type === 'bandProfile' && qr.band) {
        // Redirect to the band profile page
        // router.push({ name: 'band', params: { id: qr.band.id } });
      } else if (qr.q_type === 'events' && qr.event) {
        // Redirect to the event page
        // router.push({ name: 'event', params: { id: qr.event.id } });
      } else if (qr.q_type === 'tours' && qr.tour) {
        // Redirect to the tour page
        // router.push({ name: 'tour', params: { id: qr.tour.id } });
      } else if (qr.q_type === 'albums' && qr.album) {
        // Redirect to the album page
        // router.push({ name: 'album', params: { id: qr.album.id } });
      } else if (qr.q_type === 'stream' && qr.link) {
        // Redirect to an external streaming link
        // window.location.href = qr.link;
      } else if (qr.q_type === 'externalURL' && qr.link) {
        console.log('link')
        // Redirect to an external URL
        // window.location.href = qr.link;
      } else {
        // Default fallback, redirect to dashboard or error page
        // router.push('/dashboard');
      }
    } else {
      console.error('QR code not found for UUID:', uuid);
      router.push('/error'); // Handle error page
    }
  } catch (error) {
    console.error('Error fetching QR code data:', error);
    router.push('/error'); // Redirect to an error page if something goes wrong
  }
});
</script>

<style scoped>
p {
  font-size: 1.25rem;
  text-align: center;
  margin-top: 20px;
}
</style>
