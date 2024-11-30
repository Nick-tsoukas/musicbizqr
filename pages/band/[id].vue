<template>
  <div v-if="band && band.data" class="bg-[#000] w-screen mx-auto">
    <!-- Hero Content -->
    <div class="relative w-full h-[calc(100vh-400px)]">
      <img
        class="w-full h-full object-cover object-center"
        :src="band.data.attributes.bandImg.data.attributes.url"
        alt="Band Image"
      />
      <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 py-4">
        <h1 class="text-white text-xl md:text-7xl text-center font-bold px-4">
          {{ band.data.attributes.name }}
        </h1>
      </div>
    </div>

    <!-- Band Page Content -->
    <div class="w-full px-6 md:max-w-[80vw] md:mx-auto">
      <div class="pt-0 sm:p-5">
        <div>
          <!-- Albums Section -->
          <div v-if="albums.length > 0">
            <h1 class="text-lg my-4 md:text-7xl font-bold text-white md:my-16">Albums</h1>
            <section class="flex gap-4 overflow-x-scroll no-scrollbar">
              <div
                v-for="album in albums"
                :key="album.id"
                class="bg-black shadow-lg rounded p-3"
              >
                <div
                  class="transform transition-transform duration-300 hover:scale-105 w-[100px] h-[100px] md:w-[450px] md:h-[450px]"
                >
                  <img
                    class="w-full h-full block rounded mx-auto"
                    :src="album.attributes.cover.data.attributes.url"
                    alt="Album Cover"
                  />
                  <!-- Play Button Overlay -->
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    @click="setAlbum(album.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="60"
                      height="60"
                      fill="currentColor"
                      class="text-white"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="pt-5">
                  <h3 class="text-white font-semibold text-xl">{{ album.attributes.title }}</h3>
                </div>
              </div>
            </section>

            <!-- Album Player Section -->
            <section v-if="albumPlay" class="w-full flex flex-col xl:flex-row gap-4 my-20">
              <!-- Conditional Rendering Based on Album Type -->
              <div v-if="albumPlay.attributes.type === 'custom'" class="w-full md:w-[70%] mx-0">
                <AudioPlayer :album="albumPlay" />
              </div>
              <div v-else-if="albumPlay.attributes.type === 'streaming'" class="w-full md:w-[70%] mx-0">
                <div class="embed-container">
                  <iframe
                    :src="albumPlay.attributes.embedUrl"
                    width="100%"
                    height="380"
                    frameborder="0"
                    allowtransparency="true"
                    allow="encrypted-media"
                  ></iframe>
                </div>
              </div>
              <div v-else>
                <p class="text-white">Album type not recognized.</p>
              </div>
            </section>
          </div>

          <!-- Events Section -->
          <div v-if="events.length" class="mt-10 mx-auto">
            <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white my-16">Events</h1>
            <div class="flex overflow-x-scroll space-x-4 pb-4 no-scrollbar">
              <div
                v-for="event in events"
                :key="event.id"
                class="shadow-lg rounded-lg p-[15px] flex-none w-[285px] sm:w-[60vw] md:w-[500px] bg-black text-white"
              >
                <img
                  v-if="event.attributes.image"
                  class="w-full h-[200px] md:h-72 object-cover rounded-md"
                  :src="event.attributes.image.data.attributes.url"
                  alt="Event Image"
                />
                <div class="pt-5">
                  <h3 class="text-xl md:text-2xl text-white font-bold mb-2">{{ event.attributes.title }}</h3>
                  <p class="text-white text-sm">
                    {{ new Date(event.attributes.date ?? new Date()).toLocaleDateString() }}
                  </p>
                  <p class="text-white text-sm">
                    {{ event.attributes.venue ?? 'Venue not specified' }}
                  </p>
                  <p class="text-white text-sm">
                    {{ event.attributes.city ?? 'City not specified' }}
                  </p>
                  <button @click="router.push(`/event/${event.id}`)" class="mdc-button-green mt-2 w-full">
                    View Event
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tours Section -->
          <div v-if="tours.length" class="mt-10 mx-auto">
            <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white my-16">Tours</h1>
            <div class="flex overflow-x-scroll space-x-4 pb-4 no-scrollbar">
              <div
                v-for="tour in tours"
                :key="tour.id"
                class="shadow-lg rounded-lg p-[15px] flex-none w-[285px] sm:w-[60vw] md:w-[500px] bg-black text-white"
              >
                <img
                  v-if="tour.attributes.image"
                  class="w-full h-[200px] md:h-72 object-cover"
                  :src="tour.attributes.image.data.attributes.url"
                  alt="Tour Image"
                />
                <div class="pt-5">
                  <button @click="router.push(`/tour/${tour.id}`)" class="mdc-button-green mt-2 w-full">
                    View Tour
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Streaming Links -->
          <div class="flex flex-col gap-6 justify-start md:px-4 w-full md:w-[100%] md:mx-auto">
            <h2 class="text-4xl my-10 font-bold text-white">Streaming Links</h2>
            <template v-for="platform in streamingPlatforms" :key="platform.name">
              <span v-if="band.data.attributes[platform.name]">
                <a :href="band.data.attributes[platform.name]">
                  <button
                    class="w-full custom-border bg-[#fff] flex justify-center text-black font-semibold px-2 py-3 items-center relative shadow-lg rounded-md"
                  >
                    <img :src="platform.img" class="h-8 absolute left-2" :alt="platform.label" />
                    {{ platform.label }}
                  </button>
                </a>
              </span>
            </template>
          </div>
        </div>
      </div>

      <!-- Social Media Links -->
      <h2 class="text-3xl text-center text-white mt-16 font-bold">Social</h2>

      <div class="h-52 flex items-center justify-center bg-[#000]">
        <div class="flex items-center justify-center gap-x-5">
          <!-- Social Media Platforms -->
          <template v-for="platform in socialPlatforms" :key="platform.name">
            <a
              v-if="band.data.attributes[platform.name]"
              :href="band.data.attributes[platform.name]"
              :aria-label="`Find us on ${platform.label}`"
              target="_blank"
              rel="noopener"
            >
              <img :src="platform.img" :alt="platform.label" class="h-10 w-10" />
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';


// Reactive variables
const route = useRoute();
const router = useRouter();
const band = ref(null);
const albums = ref([]);
const events = ref([]);
const tours = ref([]);
const albumPlay = ref(null);

// Import social media icons
import facebookIcon from '@/assets/facebookfree.png';
import instagramIcon from '@/assets/instagramfree.png';
import twitchIcon from '@/assets/twitchfree.png';
import appleMusicIcon from '@/assets/apple.svg';
import soundcloudIcon from '@/assets/soundcloudlast.png';
import deezerIcon from '@/assets/dezzer.svg';
import youtubeIcon from '@/assets/youtube-icon.svg';
import bandcampIcon from '@/assets/bandcamp.svg';

// Import streaming platform icons
import spotifyIcon from '@/assets/spotify.svg';
import youtubeMusicIcon from '@/assets/youtube-icon.svg';
import deezerIcon2 from '@/assets/dezzer.svg';
import soundcloudIcon2 from '@/assets/soundcloudlast.png';
import bandcampIcon2 from '@/assets/bandcamp.svg';

// Define social media platforms
const socialPlatforms = [
  { name: 'facebook', img: facebookIcon, label: 'Facebook' },
  { name: 'instagram', img: instagramIcon, label: 'Instagram' },
  { name: 'twitch', img: twitchIcon, label: 'Twitch' },
  { name: 'appleMusic', img: appleMusicIcon, label: 'Apple Music' },
  { name: 'soundcloud', img: soundcloudIcon, label: 'SoundCloud' },
  { name: 'dezzer', img: deezerIcon, label: 'Deezer' },
  { name: 'youtube', img: youtubeIcon, label: 'YouTube' },
  { name: 'bandcamp', img: bandcampIcon, label: 'Bandcamp' },
];

// Define streaming platforms
const streamingPlatforms = [
  { name: 'spotify', img: spotifyIcon, label: 'Spotify' },
  { name: 'youtube', img: youtubeMusicIcon, label: 'YouTube Music' },
  { name: 'dezzer', img: deezerIcon2, label: 'Deezer' },
  { name: 'soundcloud', img: soundcloudIcon2, label: 'SoundCloud' },
  { name: 'bandcamp', img: bandcampIcon2, label: 'Bandcamp' },
];

// Function to set the current album
const setAlbum = (id) => {
  const album = albums.value.find((album) => album.id === id);
  if (album) {
    albumPlay.value = album;
  }
};

onMounted(async () => {
  document.body.classList.add('custom-page-body');
  const apiUrl = useRuntimeConfig().public.strapiUrl;

  // Fetch band data
  const response = await fetch(
    `${apiUrl}/api/bands/${route.params.id}?` +
      'populate[events][populate]=image&' +
      'populate[tours][populate]=*&' +
      'populate[albums][populate]=cover,songs.file&' +
      'populate=bandImg'
  );
  const data = await response.json();
  band.value = data;

  // Set albums
  if (band.value?.data?.attributes?.albums?.data?.length) {
    albums.value = band.value.data.attributes.albums.data;
    setAlbum(albums.value[0].id);
  }

  // Set events
  if (band.value?.data?.attributes?.events?.data?.length) {
    events.value = band.value.data.attributes.events.data;
  }

  // Set tours
  if (band.value?.data?.attributes?.tours?.data?.length) {
    tours.value = band.value.data.attributes.tours.data;
  }
});

onBeforeUnmount(() => {
  document.body.classList.remove('custom-page-body');
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
.embed-container {
  position: relative;
  overflow: hidden;
  padding-top: 56.25%; /* Aspect ratio for 16:9 */
}
.embed-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.custom-page-body {
  background-color: #000;
}
.custom-border {
  border: 0.1px solid white;
}
</style>
