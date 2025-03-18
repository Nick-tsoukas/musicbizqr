<template>
  <div class="container  mx-auto my-10 px-4">
    <!-- Event Hero Section -->
    <div v-if="eventData" class="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden mb-8 shadow-lg">
      <img
        v-if="eventData.image && eventData.image.data"
        :src="eventData.image.data.attributes.url"
        alt="Event Hero Image"
        class="w-full h-full object-cover"
      />
      <!-- <div class="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4">
        <h1 class="text-4xl md:text-6xl text-white font-bold">{{ eventData.title }}</h1>
      </div> -->
    </div>
    <!-- Event Details Section -->
     <pre class="text-white" >{{ eventData }}</pre>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="md:col-span-2 bg-white shadow-lg rounded-lg p-6">
        <!-- Description -->
        <section v-if="eventData.description" class="mb-6">
          <h2 class="text-2xl font-semibold flex items-center mb-4">
            <i class="fas fa-info-circle gradient-icon mr-2"></i> Description
          </h2>
          <p class="text-lg leading-snug" v-html="formattedDescription"></p>
        </section>
        <!-- Date & Time -->
        <section v-if="eventData.date || eventData.time" class="mb-6">
          <h2 class="text-2xl font-semibold flex items-center mb-4">
            <i class="far fa-calendar-alt gradient-icon mr-2"></i> Date & Time
          </h2>
          <p v-if="eventData.date" class="text-lg">{{ formatDate(eventData.date) }}</p>
          <p v-if="eventData.time" class="text-lg">{{ formatTime(eventData.time) }}</p>
        </section>

        <!-- Description -->
        <!-- <section v-if="eventData.description" class="mb-6">
          <h2 class="text-2xl font-semibold flex items-center mb-4">
            <i class="fas fa-info-circle gradient-icon mr-2"></i> Description
          </h2>
          <p class="text-lg">{{ eventData.description }}</p>
        </section> -->

        <!-- Location -->
        <section v-if="eventData.venue || eventData.address || eventData.city || eventData.state" class="mb-6">
          <h2 class="text-2xl font-semibold flex items-center mb-4">
            <i class="fas fa-map-marker-alt gradient-icon mr-2"></i> Location
          </h2>
          <p v-if="eventData.venue" class="text-lg">{{ eventData.venue }}</p>
          <p v-if="eventData.address" class="text-lg">{{ eventData.address }}</p>
          <p v-if="eventData.city || eventData.state" class="text-lg">
            {{ eventData.city }}<span v-if="eventData.city && eventData.state">, </span>{{ eventData.state }}
          </p>
        </section>

        <!-- Ticket Link -->
        <div v-if="eventData.link" class="mt-8">
          <a :href="eventData.link" target="_blank" class="mdc-button inline-flex items-center">
            <i class="fas fa-ticket-alt gradient-icon mr-2"></i> Buy Tickets
          </a>
        </div>
      </div>

      <!-- Right Column -->
      <div class="bg-white shadow-lg rounded-lg p-6">
        <!-- Contact Information -->
        <section v-if="eventData.contactEmail || eventData.contactPhone" class="mb-6">
          <h2 class="text-2xl font-semibold flex items-center mb-4">
            <i class="fas fa-address-book gradient-icon mr-2"></i> Contact
          </h2>
          <p v-if="eventData.contactEmail" class="text-lg flex items-center">
            <i class="fas fa-envelope gradient-icon mr-2"></i> <a :href="`mailto:${eventData.contactEmail}`">{{ eventData.contactEmail }}</a>
          </p>
          <p v-if="eventData.contactPhone" class="text-lg flex items-center">
            <i class="fas fa-phone mr-2 gradient-icon"></i> <a :href="`tel:${eventData.contactPhone}`">{{ eventData.contactPhone }}</a>
          </p>
        </section>

        <!-- Age Restriction -->
        <section v-if="eventData.ageRestriction" class="mb-6">
          <h2 class="text-2xl font-semibold flex items-center mb-4">
            <i class="fas fa-user-lock gradient-icon mr-2"></i> Age Restriction
          </h2>
          <p class="text-lg">{{ eventData.ageRestriction }}</p>
        </section>

        <!-- Social Media Links -->
        <section v-if="hasSocialLinks" class="mb-6">
          <h2 class="text-2xl font-semibold flex items-center mb-4">
            <i class="fas fa-share-alt gradient-icon mr-2"></i> Follow Us
          </h2>
          <div class="flex space-x-4">
            <a v-if="eventData.facebook" :href="eventData.facebook" target="_blank">
              <i class="fab fa-facebook-square  text-2xl"></i>
            </a>
            <a v-if="eventData.twitter" :href="eventData.twitter" target="_blank">
              <i class="fab fa-twitter-square  text-2xl"></i>
            </a>
            <a v-if="eventData.instagram" :href="eventData.instagram" target="_blank">
              <i class="fab fa-instagram-square  text-2xl"></i>
            </a>
            <a v-if="eventData.youtube" :href="eventData.youtube" target="_blank">
              <i class="fab fa-youtube-square  text-2xl"></i>
            </a>
            <a v-if="eventData.tiktok" :href="eventData.tiktok" target="_blank">
              <i class="fab fa-tiktok  text-2xl"></i>
            </a>
            <a v-if="eventData.website" :href="eventData.website" target="_blank">
              <i class="fas fa-globe  text-2xl"></i>
            </a>
          </div>
        </section>

        <!-- Band Information -->
        <section v-if="eventData.band && eventData.band.data" class="mb-6">
          <h2 class="text-2xl font-semibold flex items-center mb-4">
            <i class="fas fa-music gradient-icon mr-2"></i> Band
          </h2>
          <p class="text-lg">{{ eventData.band.data.attributes.name }}</p>
        </section>
      </div>
    </div>
  </div>
</template>


<script setup>

import { format, parseISO, parse } from 'date-fns';

const route = useRoute();
const { findOne } = useStrapi();

const eventData = ref({});

onMounted(async () => {
  try {
    const { data } = await findOne('events', route.params.id, {
      populate: ['image', 'band'],
    });
    eventData.value = data.attributes;
    // Include the band relation with attributes
    if (data.attributes.band && data.attributes.band.data) {
      eventData.value.band = data.attributes.band;
    }
  } catch (error) {
    console.error('Error fetching event data:', error);
  }
});

const formattedDescription = computed(() => {
  return eventData.value?.description ? eventData.value.description.replace(/\n/g, '<br>') : '';
});
const formatDate = (dateStr) => {
  if (!dateStr) {
    return '';
  }
  try {
    return format(parseISO(dateStr), 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error parsing date:', error);
    return dateStr;
  }
};

const formatTime = (timeStr) => {
  if (!timeStr) {
    console.log('there is no time string .........')
    return '';
  }
  console.log(timeStr)
  try {
    const parsedTime = parse(timeStr, 'HH:mm:ss.SSS', new Date());
    console.log(parsedTime)
    console.log('Parsed time:', parsedTime); // Log the parsed time for debugging
    return format(parsedTime, 'hh:mm a'); // 12-hour format with AM/PM
  } catch (error) {
    console.error('Error parsing time:', error);
    return timeStr;
  }
};

const hasSocialLinks = computed(() => {
  return (
    eventData.value.facebook ||
    eventData.value.twitter ||
    eventData.value.instagram ||
    eventData.value.youtube ||
    eventData.value.tiktok ||
    eventData.value.website
  );
});
</script>



<style scoped>
.container {
  max-width: 1200px;
}

.gradient-icon {
  /* Set the icon size */
  font-size: 1rem;
  
  /* Gradient background */
  background: linear-gradient(to right, #ec4899, #8b5cf6);

  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
}
.mdc-button {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: #6200ee;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.mdc-button:hover {
  background-color: #3700b3;
}

.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.space-x-4 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 1rem;
}

/* Additional styling for icons and layout */
</style>

