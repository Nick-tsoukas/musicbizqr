<template>
  <div class="container mx-auto px-4 py-8">
    <div class="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
      <img
        :src="tourImage"
        alt="Tour Hero Image"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-end mb-4 justify-center ">
        <h1 class="text-4xl md:text-6xl text-white font-bold">{{ tourTitle }}</h1>
      </div>
    </div>

    <h2 class="text-3xl font-bold text-center mb-8">Upcoming Tour Events</h2>
    <div class="space-y-8">
      <div
        v-for="(event, index) in events"
        :key="index"
        class="bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div class="relative h-56 overflow-hidden">
          <img
            :src="event.attributes.image.data.attributes.url"
            alt="Event image"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-6">
          <h2 class="text-2xl font-semibold mb-2">{{ event.attributes.title }}</h2>
          <p class="text-gray-600">{{ formatDate(event.attributes.date) }}</p>
          <p class="text-gray-600 " >{{ event.attributes.venue }}</p>
          <p class="text-gray-600">{{ event.attributes.city }}, {{ event.attributes.state }}</p>
          <p class="text-gray-600 mt-4 truncate" v-html="truncate(event.attributes.description, 150)"></p>
          <div class="mt-4">
            <NuxtLink
             :to="`/event/${event.id}`"
              target="_blank"
              class="mdc-button"
            >
              Learn More
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { format } from 'date-fns';

const route = useRoute();
const { findOne } = useStrapi();
const tour = ref(null);
const tourTitle = ref('');
const tourImage = ref('');
const events = ref([]);

onMounted(async () => {
  try {
    const response = await findOne('tours', 4, {
      populate: {
        events: {
          populate: 'image'
        }
      }
    });
    tour.value = response.data;
    tourTitle.value = tour.value.attributes.title;
    tourImage.value = tour.value.attributes.events.data[0]?.attributes.image.data.attributes.url;
    events.value = tour.value.attributes.events.data;
  } catch (error) {
    console.error(error);
  }
});

const truncate = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'MMMM d, yyyy');
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
