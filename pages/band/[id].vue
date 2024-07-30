<template>
  <div v-if="band" class="bg-[#000] w-screen ">
    <!-- hero content  -->
    <div v-if="band" class="band-image-container relative w-screen ">
      <img
        class="w-screen h-full lg:object-cover object-contain lg:object-center object-top"
        :src="band.data.attributes.bandImg.data.attributes.url"
        alt="Band Image"
      />
      <div class="band-name-bar">
        <h1 class="text-lg md:text-3xl font-bold">{{ band.data.attributes.name }}</h1>
      </div>
    </div>

    <!-- album page content -->
    <main class="p-5  w-[90vw] mx-auto">
      <div>
        <h1 class="text-3xl sm:text-3xl md:text-4xl font-bold text-white my-10">Albums</h1>
        <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="album in albums"
            :key="album.id"
            class="bg-black shadow-lg rounded p-3"
          >
            <div class="group relative">
              <img
                class="w-full block rounded mx-auto"
                :src="album.attributes.cover.data.attributes.url"
                alt=""
              />
              <div
                class="absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 transition justify-evenly"
              >
                <button
                  @click="setAlbum(album.id)"
                  class="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    class="bi bi-play-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-white text-lg">{{ album.attributes.title }}</h3>
            </div>
          </div>
        </section>

        <section v-if="albumPlay" class="w-full my-20">
          <AudioPlayer :album="albumPlay" class="w-full mx-auto" />
        </section>

        <!-- Enhanced Events Section -->
        <div v-if="events.length" class="mt-10 w-[90vw] mx-auto">
          <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white my-16">Events</h1>

          <!-- Events Slider -->
          <div  class="flex overflow-x-scroll space-x-4 pb-4 no-scrollbar">
            <div v-for="event in events" :key="event.id" class="shadow-lg rounded-lg flex-none w-[85vw] sm:w-[60vw] md:w-[33vw] bg-white">
              <img
                v-if="event.attributes.image"
                class="w-full h-72 object-cover"
                :src="event.attributes.image.data.attributes.url"
                alt="Event Image"
              />
              <div class="p-5">
                <h3 class="text-2xl text-black mb-2">{{ event.attributes.title }}</h3>
                <!-- <p class="text-black mb-4">{{ event.attributes.description ?? 'No description available' }}</p> -->
                <p class="text-black">{{ new Date(event.attributes.date ?? new Date()).toLocaleDateString() }}</p>
                <!-- <p class="text-black">{{ event.attributes.time ?? 'Time not specified' }}</p> -->
                <p class="text-black">{{ event.attributes.venue ?? 'Venue not specified' }}</p>
                <p class="text-black">{{ event.attributes.city ?? 'City not specified' }}</p>
                <!-- <p class="text-black">{{ event.attributes.address ?? 'Address not specified' }}</p> -->
                <!-- <p class="text-black">{{ event.attributes.link ?? 'No link available' }}</p> -->
                <button 
                  @click="router.push(`/event/${event.id}`)" 
                  class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  View Event
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="tours.length" class="mt-10 w-[90vw] mx-auto">
          <h1 class="text-3xl sm:text-3xl md:text-3xl font-bold text-white my-16">Tours</h1>

          <!-- Tours Slider -->
          <div ref="toursSlider" class="flex overflow-x-scroll space-x-4 pb-4 no-scrollbar">
            <div v-for="tour in tours" :key="tour.id" class="shadow-lg rounded-lg flex-none w-[85vw] sm:w-[60vw] md:w-[33vw] bg-white">
              <img
                v-if="tour.attributes.image"
                class="w-full h-72 object-cover"
                :src="tour.attributes.image.data.attributes.url"
                alt="Tour Image"
              />
              <div class="p-5">
                <h3 class="text-2xl text-black mb-2">{{ tour.attributes.title }}</h3>
                <!-- <p class="text-black mb-4">{{ tour.attributes.description ?? 'No description available' }}</p> -->
                <p class="text-black">{{ new Date(tour.attributes.startDate ?? new Date()).toLocaleDateString() }} - {{ new Date(tour.attributes.endDate ?? new Date()).toLocaleDateString() }}</p>
                <button 
                @click="router.push(`/tour/${tour.id}`)" 
                class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  View Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div class="h-52 flex items-center justify-center bg-[#000]">
      <div class="flex items-center justify-center gap-x-5">
        <a href="" aria-label="Find us on LinkedIn" target="_blank" rel="noopener">
          <svg class="h-10 w-10 text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M44.45 0H3.55A3.5 3.5 0 0 0 0 3.46v41.07A3.5 3.5 0 0 0 3.54 48h40.9A3.51 3.51 0 0 0 48 44.54V3.46A3.5 3.5 0 0 0 44.45 0Zm-30.2 40.9H7.11V18h7.12v22.9Zm-3.57-26.03a4.13 4.13 0 1 1-.02-8.26 4.13 4.13 0 0 1 .02 8.26ZM40.9 40.9H33.8V29.77c0-2.66-.05-6.08-3.7-6.08-3.7 0-4.27 2.9-4.27 5.89V40.9h-7.1V18h6.82v3.12h.1c.94-1.8 3.26-3.7 6.72-3.7 7.21 0 8.54 4.74 8.54 10.91V40.9Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
        <a href="" aria-label="Find us on Twitter" target="_blank" rel="noopener">
          <svg class="h-10 w-10 text-white" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.1 39.5c18.1 0 28.02-15 28.02-28.02 0-.42-.01-.85-.03-1.27A20 20 0 0 0 48 5.1c-1.8.8-3.7 1.32-5.65 1.55a9.9 9.9 0 0 0 4.33-5.45 19.8 19.8 0 0 1-6.25 2.4 9.86 9.86 0 0 0-16.8 8.97A27.97 27.97 0 0 1 3.36 2.3a9.86 9.86 0 0 0 3.04 13.14 9.86 9.86 0 0 1-4.46-1.23v.12A9.84 9.84 0 0 0 9.83 24c-1.45.4-2.97.45-4.44.17a9.87 9.87 0 0 0 9.2 6.84A19.75 19.75 0 0 1 0 35.08c4.5 2.89 9.75 4.42 15.1 4.42Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
        <a href="" aria-label="Find us on Facebook" target="_blank" rel="noopener">
          <svg class="h-10 w-10 text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M48 24a24 24 0 1 0-27.75 23.7V30.95h-6.1V24h6.1v-5.29c0-6.01 3.58-9.34 9.07-9.34 2.62 0 5.37.47 5.37.47v5.91h-3.03c-2.98 0-3.91 1.85-3.91 3.75V24h6.66l-1.07 6.94h-5.59V47.7A24 24 0 0 0 48 24Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
        <a href="" aria-label="Find us on Instagram" target="_blank" rel="noopener">
          <svg class="h-10 w-10 text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 4.32c6.41 0 7.17.03 9.7.14 2.34.1 3.6.5 4.45.83 1.11.43 1.92.95 2.75 1.79a7.38 7.38 0 0 1 1.8 2.75c.32.85.72 2.12.82 4.46.11 2.53.14 3.29.14 9.7 0 6.4-.03 7.16-.14 9.68-.1 2.35-.5 3.61-.83 4.46a7.42 7.42 0 0 1-1.79 2.75 7.38 7.38 0 0 1-2.75 1.8c-.85.32-2.12.72-4.46.82-2.53.11-3.29.14-9.69.14-6.41 0-7.17-.03-9.7-.14-2.34-.1-3.6-.5-4.45-.83a7.42 7.42 0 0 1-2.75-1.79 7.38 7.38 0 0 1-1.8-2.75 13.2 13.2 0 0 1-.82-4.46c-.11-2.53-.14-3.29-.14-9.69 0-6.41.03-7.17.14-9.7.1-2.34.5-3.6.83-4.45A7.42 7.42 0 0 1 7.1 7.08a7.38 7.38 0 0 1 2.75-1.8 13.2 13.2 0 0 1 4.46-.82c2.52-.11 3.28-.14 9.69-.14ZM24 0c-6.52 0-7.33.03-9.9.14-2.54.11-4.3.53-5.81 1.12a11.71 11.71 0 0 0-4.26 2.77 11.76 11.76 0 0 0-2.77 4.25C.66 9.8.26 11.55.14 14.1A176.6 176.6 0 0 0 0 24c0 6.52.03 7.33.14 9.9.11 2.54.53 4.3 1.12 5.81a11.71 11.71 0 0 0 2.77 4.26 11.73 11.73 0 0 0 4.25 2.76c1.53.6 3.27 1 5.82 1.12 2.56.11 3.38.14 9.9.14 6.5 0 7.32-.03 9.88-.14 2.55-.11 4.3-.52 5.82-1.12 1.58-.6 2.92-1.43 4.25-2.76a11.73 11.73 0 0 0 2.77-4.25c.59-1.53 1-3.27 1.11-5.82.11-2.56.14-3.38.14-9.9 0-6.5-.03-7.32-.14-9.88-.11-2.55-.52-4.3-1.11-5.82-.6-1.6-1.41-2.94-2.75-4.27a11.73 11.73 0 0 0-4.25-2.76C38.2.67 36.45.27 33.9.15 31.33.03 30.52 0 24 0Z"
                    fill="currentColor"></path>
                <path
                    d="M24 11.67a12.33 12.33 0 1 0 0 24.66 12.33 12.33 0 0 0 0-24.66ZM24 32a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM39.7 11.18a2.88 2.88 0 1 1-5.76 0 2.88 2.88 0 0 1 5.75 0Z"
                    fill="currentColor"></path>
            </svg>

        </a>
    </div>
</div>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue';
import { routerKey, useRoute } from 'vue-router';
const { find, findOne } = useStrapi();

const route = useRoute();
const router = useRouter();
const band = ref(null);
const albums = ref([]);
const events = ref([]);
const tours = ref([]);
const albumPlay = ref(null)

const setAlbum = (id) => {
  console.log(id, 'this is album id');
  const album = albums.value.find((album) => album.id === id);
  if (album) {
    albumPlay.value = album;
  } else {
    console.warn(`Album with id ${id} not found`);
  }
};

const scrollSliderIntoView = (sliderRef) => {
  if (window.innerWidth <= 640) {
    sliderRef.value.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(async () => {
  const bandResponse = await fetch(
    `http://localhost:1337/api/bands/${route.params.id}?populate[events][populate]=image&populate[tours][populate]=*&populate[albums][populate]=cover,songs.file&populate=bandImg`
  );
  const bandData = await bandResponse.json();
  band.value = bandData;

  // Fetching albums data
  if (band.value?.data?.attributes?.albums?.data?.length) {
    const albumIds = band.value.data.attributes.albums.data.map((album) => album.id);
    const albumFetches = albumIds.map((id) => fetch(`http://localhost:1337/api/albums/${id}?populate=cover,songs.file`));
    const albumResponses = await Promise.all(albumFetches);
    const albumData = await Promise.all(albumResponses.map((response) => response.json()));
    albums.value = albumData.map((response) => response.data);
    albumPlay.value = albums.value[0]; // Set the first album to play by default
  }

  // Fetching events data
  if (band.value?.data?.attributes?.events?.data?.length) {
    events.value = band.value.data.attributes.events.data;
  }

  // Fetching tours data
  if (band.value?.data?.attributes?.tours?.data?.length) {
    tours.value = band.value.data.attributes.tours.data;
  }

  // Start scrolling the sliders into view on mobile
  const eventsSlider = ref('eventsSlider');
  const toursSlider = ref('toursSlider');
  scrollSliderIntoView(eventsSlider);
  scrollSliderIntoView(toursSlider);
});
</script>



<style scoped>
.band-image-container {
  height: calc(100vh - 90px);
  width: 100vw;
}

.band-name-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 3rem 0;
}

@media (max-width: 640px) {
  .band-image-container {
    height: auto; /* Let the image take its natural height on smaller screens */
    
  }

  .band-name-bar {
    padding: 1rem 0;
  }

  .band-image-container img {
    height: auto; /* Ensure the image height is auto on smaller screens */
    max-height: calc(100vh - 90px); /* Ensure the image doesn't exceed the viewport height minus 90px */
  }
}

@media (max-width: 440px) {

  .band-name-bar {
    padding: 1rem 0;
  }


}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.background__gradient {
  background: linear-gradient(to top, rgba(51, 51, 51, 1) 0%, rgba(51, 51, 51, 1) 15%, rgba(51, 51, 51, 0.95) 35%, rgba(51, 51, 51, 0.7) 100%);
}
</style>
