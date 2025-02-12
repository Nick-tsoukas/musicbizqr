<template>
  <div v-if="band && band.data" class="bg-black w-screen mx-auto">
    <!-- Navigation (Absolute Positioning) -->
    <!-- <nav class="absolute top-0 left-0 w-full z-10 bg-transparent p-4">
      <div class="flex justify-between items-center px-6">
        <h1 class="text-white text-2xl font-bold">Band Name</h1>
        <div>
          <a href="#" class="text-white px-4">Home</a>
          <a href="#" class="text-white px-4">About</a>
          <a href="#" class="text-white px-4">Music</a>
        </div>
      </div>
    </nav> -->

    <!-- Hero Section -->
    <div class="relative w-full h-[80vh]">
      <!-- Background Image -->
      <img
        class="absolute inset-0 w-auto m-auto h-2/3 object-cover"
        :src="band.data.attributes.bandImg.data.attributes.url"
        alt="Band Image"
      />

      <!-- Dark Overlay for Contrast -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>

      <!-- Hero Content -->
      <div class="absolute bg-black bottom-0 p-6 left-0 w-full text-center">
        <h1 class="text-white text-5xl md:text-7xl font-bold tracking-tight text-center">
          {{ band.data.attributes.name }}
        </h1>
        <!-- <img src="@/assets/downarrow.svg" alt="Down Arrow" class="w-12 h-12 mx-auto" /> -->

      </div>
    </div>

    <!-- Band Page Content -->
    <div class="w-full px-6 md:max-w-[80vw] md:mx-auto">
      <div class="pt-0 sm:p-5">
        <div>
          <!-- Bio Section -->
          <div v-if="band.data.attributes.bio">
            <h1 class="text-4xl my-4 md:text-5xl font-bold text-white md:my-16">Bio</h1>
            <p class="text-white text-lg whitespace-pre-wrap leading-relaxed">
              {{ band.data.attributes.bio }}
            </p>
          </div>

          <!-- Albums Section -->
          <div v-if="albums.length > 0">
            <h1 class="text-lg my-4 md:text-7xl font-bold text-white md:my-16">Albums</h1>
            <section class="flex gap-4 overflow-x-scroll no-scrollbar">
              <div
                v-for="album in albums"
                :key="album.id"
                class="bg-black shadow-lg rounded p-3 relative"
              >
                <div class="transform transition-transform duration-300 hover:scale-105 w-[100px] h-[100px] md:w-[450px] md:h-[450px]">
                  <img class="w-full h-full block rounded mx-auto" :src="album.attributes.cover.data.attributes.url" alt="Album Cover" />
                </div>
                <div class="pt-5">
                  <h3 class="text-white font-semibold text-xl">{{ album.attributes.title }}</h3>
                </div>
              </div>
            </section>
          </div>

          <!-- Events Section -->
          <div v-if="events.length" class="mt-10 mx-auto">
            <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white my-16">Events</h1>
            <div class="flex overflow-x-scroll space-x-4 pb-4 no-scrollbar">
              <div v-for="event in events" :key="event.id" class="shadow-lg rounded-lg p-[15px] flex-none w-[285px] md:w-[500px] bg-black text-white">
                <img v-if="event.attributes.image" class="w-full h-[200px] md:h-72 object-cover rounded-md" :src="event.attributes.image.data.attributes.url" alt="Event Image" />
                <div class="pt-5">
                  <h3 class="text-xl md:text-2xl text-white font-bold mb-2">{{ event.attributes.title }}</h3>
                  <p class="text-white text-sm">{{ new Date(event.attributes.date ?? new Date()).toLocaleDateString() }}</p>
                  <button @click="router.push(`/event/${event.id}`)" class="mdc-button-green mt-2 w-full">View Event</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Streaming Links -->
          <div class="flex flex-col gap-6 justify-start md:px-4 w-full md:w-[100%] md:mx-auto mt-16">
            <h2 class="text-5xl my-10 font-bold text-white">Streaming Links</h2>
            <template v-for="platform in streamingPlatforms" :key="platform.name">
              <span v-if="band.data.attributes[platform.name]">
                <a :href="band.data.attributes[platform.name]" target="_blank" rel="noopener">
                  <button class="w-full custom-border bg-white flex justify-center text-black font-semibold px-2 py-3 items-center relative shadow-lg rounded-md">
                    <img :src="platform.img" class="h-8 absolute left-2" :alt="platform.label" />
                    {{ platform.label }}
                  </button>
                </a>
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";



const { find } = useStrapi();
const route = useRoute();
const router = useRouter();

const band = ref(null);
const albums = ref([]);
const events = ref([]);

const fetchBandData = async () => {
  const apiUrl = useRuntimeConfig().public.strapiUrl;
  const response = await fetch(`${apiUrl}/api/bands/${route.params.id}?populate=bandImg,albums,events`);
  band.value = await response.json();
};

onMounted(() => {
  // Add class to body for page-specific styling
  document.body.classList.add("band-page");

  // Fetch band data
  fetchBandData();
});

onBeforeUnmount(() => {
  // Remove the class when leaving the page
  document.body.classList.remove("band-page");
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.custom-border {
  border: 0.1px solid white;
}
.mdc-button-green {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}
.mdc-button-green:hover {
  background-color: #45a049;
}
</style>
