<template>
  <div>
    <div v-if="eventData" class="container mx-auto my-10">
      <div v-if="eventData.image" class="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
        <img
          :src="eventData.image.data.attributes.url"
          alt="Event Hero Image"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-b-lg">
          <h1 class="text-4xl md:text-6xl text-white font-bold">{{ eventData.title }}</h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 md:px-0">
      <div class="bg-white shadow-lg rounded-lg p-6 md:p-10 mb-10">
        <section v-if="eventData.date" >
          <h2 class="text-2xl md:text-4xl font-semibold mb-2">Date & Time</h2>
          <p class="text-lg md:text-2xl">{{ formatDate(eventData.date) }}</p>
          <p class="text-lg md:text-2xl">{{ formatTime(eventData.time) }}</p>
        </section>

        <section class="mt-8">
          <h2 class="text-2xl md:text-4xl font-semibold mb-2">Description</h2>
          <p class="text-lg md:text-2xl">{{ eventData.description }}</p>
        </section>

        <section class="mt-8">
          <h2 class="text-2xl md:text-4xl font-semibold mb-2">Location</h2>
          <p class="text-lg md:text-2xl">{{ eventData.venue }}</p>
          <p class="text-lg md:text-2xl">{{ eventData.address }}</p>
          <p class="text-lg md:text-2xl">{{ eventData.city }}, {{ eventData.state }}</p>
        </section>

        <div class="mt-8">
          <a :href="eventData.link" target="_blank" class="mdc-button ">
            Ticket Link
          </a>
        </div>
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
    const { data: event } = await findOne('events', route.params.id, {
      populate: {
        image: true
      }
    });
    eventData.value = event.attributes;
  } catch (error) {
    console.error(error);
  }
});

const formatDate = (dateStr) => {
  console.log('Time String:', dateStr);

  return format(parseISO(dateStr), 'MMMM d, yyyy');
};

const formatTime = (timeStr) => {
  console.log('Time String:', timeStr);

  const parsedTime = parse(timeStr, 'HH:mm:ss.SSS', new Date());
  return format(parsedTime, 'hh:mm a');
};

</script>

<style scoped>
.mdc-button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>
