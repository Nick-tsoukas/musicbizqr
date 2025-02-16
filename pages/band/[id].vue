<template>
  <div v-if="band && band.data" class="bg-[#000] w-screen mx-auto">
    <!-- Hero Section -->
    <!-- Image Container -->
    <div class="relative w-full h-[35vh] md:h-[60vh]">
      <img
        class="absolute inset-0 w-auto m-auto h-[35vh] md:h-2/3 object-cover"
        :src="band.data.attributes.bandImg.data.attributes.url"
        alt="Band Image"
      />
      <!-- Optional overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-0"></div>
    </div>

    <!-- Band Name Below the Image -->
    <div class="text-center text-white text-4xl font-bold mt-4">
      {{ band.data.attributes.name }}
    </div>

    <!-- Bio & Tagline -->
    <div class="flex justify-center">
      <div class="flex flex-col">
        <h3
          v-if="band.data.attributes.bio"
          class="text-[16px] mx-auto mt-4 max-w-5xl text-center text-white md:text-2xl leading-tight whitespace-pre-line"
        >
          {{ band.data.attributes.bio }}
        </h3>
        <div v-if="band.data.attributes.biotagline">
          <h3
            class="text-[16px] mx-auto max-w-3xl text-center text-white md:text-2xl leading-tight whitespace-pre-line mt-0"
          >
            {{ band.data.attributes.biotagline }}
          </h3>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="w-full px-6 mt-4 md:max-w-[80vw] md:mx-auto">
      <div class="pt-0 sm:p-5">
        <!-- Featured Song Section -->
        <div v-if="band.data.attributes.singlesong">
          <h1 class="text-2xl mb-1 md:text-3xl font-bold text-white md:my-4">
            Featured Song
          </h1>
          <AudioPlayer
            :album="formatSingleSong(band.data.attributes.singlesong)"
            :placeholderImage="'/placeholder-image.svg'"
          />
        </div>

        <!-- Featured Video Section -->
        <div v-if="band.data.attributes.singlevideo" class="mt-10">
          <h1 class="text-2xl mb-1 md:text-3xl font-bold text-white md:my-4">
            Featured Video
          </h1>
          <div class="relative aspect-video">
            <YouTube
              :src="singleVideoId"
              :vars="playerOptions"
              class="absolute top-0 left-0 w-full h-full rounded-md"
            />
          </div>
        </div>

        <!-- Website Link -->
        <div v-if="band.data.attributes.websitelink" class="mt-10">
          <h1 class="text-2xl mb-1 md:text-3xl font-bold text-white md:mt-16">
            Website Link
          </h1>
          <a
            class="text-purple-500 text-xl"
            :href="band.data.attributes.websitelink"
          >
            <span v-if="band.data.attributes.websitelinktext">
              {{ band.data.attributes.websitelinktext }}
            </span>
          </a>
        </div>

        <!-- Albums Section -->
        <div v-if="albums.length > 0">
          <h1 class="text-2xl my-4 md:text-3xl font-bold text-white md:my-16">
            Albums
          </h1>
          <section class="flex gap-4 overflow-x-scroll no-scrollbar">
            <div
              v-for="album in albums"
              :key="album.id"
              class="bg-black shadow-lg rounded p-3 relative"
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
                <h3 class="text-white font-semibold text-xl">
                  {{ album.attributes.title }}
                </h3>
              </div>
            </div>
          </section>

          <!-- Album Player Section -->
          <section
            v-if="albumPlay"
            class="w-full flex flex-col xl:flex-row gap-4 my-20"
          >
            <!-- Conditional Rendering Based on Album Type -->
            <div
              v-if="albumPlay.attributes.type === 'custom'"
              class="w-full md:w-[70%] mx-0"
            >
              <AudioPlayer :album="albumPlay" />
            </div>

            <div
              v-else-if="albumPlay.attributes.type === 'streaming'"
              class="w-full md:w-[70%] mx-0"
            >
              <div class="text-white">Hello world</div>
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

        <!-- Additional Videos (Grid) -->
        <div v-if="videoItems.length" class="mt-10 mx-auto">
          <h1 class="text-2xl md:text-3xl font-bold text-white my-16">
            Videos
          </h1>
          <div
            class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="(video, videoIndex) in videoItems"
              :key="videoIndex"
              class="bg-black p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div class="grid grid-cols-1 gap-6">
                <div
                  v-for="(thumbnail, index) in video.youtubeThumbnails"
                  :key="index"
                  class="relative mb-4 rounded-lg overflow-hidden"
                >
                  <!-- Display YouTube player when video is playing -->
                  <div
                    v-if="playingVideos[thumbnail.videoId]"
                    class="relative aspect-video"
                  >
                    <YouTube
                      :src="thumbnail.videoId"
                      :width="640"
                      :height="360"
                      :vars="playerOptions"
                      class="absolute top-0 left-0 w-full h-full rounded-md"
                    />
                  </div>

                  <!-- Display thumbnail and play button when video is not playing -->
                  <div
                    v-else
                    class="relative aspect-video cursor-pointer"
                    @click="playVideo(thumbnail.videoId)"
                  >
                    <img
                      :src="thumbnail.thumbnailUrl"
                      alt="Video Thumbnail"
                      class="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                    />
                    <div
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <svg
                        class="w-16 h-16 text-white opacity-75"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 84 84"
                      >
                        <circle
                          cx="42"
                          cy="42"
                          r="42"
                          fill="rgba(0, 0, 0, 0.6)"
                        />
                        <polygon points="33,24 33,60 60,42" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Video Title -->
              <h4 class="text-white font-semibold mt-4">{{ video.title }}</h4>
            </div>
          </div>
        </div>

        <!-- Streaming Links -->
        <div class="w-full md:w-[100%] md:mx-auto mt-10">
          <h1 class="text-2xl mb-4 md:text-3xl font-bold text-white">
            Streaming Links
          </h1>
          <template v-for="platform in streamingPlatforms" :key="platform.name">
            <span v-if="band.data.attributes[platform.name]">
              <a :href="band.data.attributes[platform.name]">
                <button
                  class="w-full mb-6 custom-border text-white text-lg flex justify-center font-semibold px-4 py-4 items-center relative shadow-lg rounded-md md:text-xl"
                >
                  <img
                    :src="platform.img"
                    class="h-10 absolute left-2"
                    :alt="platform.label"
                  />
                  {{ platform.label }}
                </button>
              </a>
            </span>
          </template>
        </div>

        <!-- Social Media -->
        <div class="w-full md:w-[100%] md:mx-auto mt-10">
          <h1 class="text-2xl mb-4 font-bold text-white md:text-3xl">
            Social Media
          </h1>
          <template v-for="platform in socialPlatforms" :key="platform.name">
            <span v-if="band.data.attributes[platform.name]">
              <a :href="band.data.attributes[platform.name]">
                <button
                  class="w-full custom-border mb-6 text-white text-lg flex justify-center font-semibold px-4 py-4 items-center relative shadow-lg rounded-md md:text-xl"
                >
                  <img
                    :src="platform.img"
                    class="h-10 absolute left-2"
                    :alt="platform.label"
                  />
                  {{ platform.label }}
                </button>
              </a>
            </span>
          </template>

          <!-- Events & Tours (Optional) -->
          <div v-if="events.length" class="w-full mt-10">
            <h1 class="text-2xl md:text-3xl font-bold text-white mb-1">
              Events and Tours
            </h1>
            <!-- events table, etc. -->
          </div>

          <div v-if="tours.length" class="mt-10 mx-auto mb-10">
            <h1 class="text-2xl sm:text-2xl md:text-3xl font-bold text-white my-16">
              Tours
            </h1>
            <!-- tours grid, etc. -->
          </div>
        </div>
      </div>
    </div>

    <!-- Footer or other content -->
    <div class="h-40 flex justify-center items-center">
      <img src="@/assets/musicbizlogo.png" class="h-12" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import YouTube from "vue3-youtube";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs } from "swiper/modules";
import { EffectCards } from "swiper/modules";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/effect-cards";

const { findOne } = useStrapi();
import { useRoute, useRouter } from "#imports";

import AudioPlayer from "@/components/AudioPlayer.vue"; // or wherever your audio player is
// ... import your icons, etc. ...

const route = useRoute();
const router = useRouter();

const band = ref(null);
const albums = ref([]);
const events = ref([]);
const tours = ref([]);
const albumPlay = ref(null);
const videos = ref([]);
const videoItems = ref([]);
const playingVideos = ref({});
const loadingVideos = ref(true);

const isExpanded = ref(false);
const maxBioLength = 300;

const truncatedBio = computed(() => {
  const bio = band.value?.data?.attributes?.bio || "";
  return bio.length > maxBioLength ? bio.slice(0, maxBioLength) + "..." : bio;
});

function toggleBio() {
  isExpanded.value = !isExpanded.value;
}

function formatSingleSong(song) {
  if (!song) return null;
  return {
    id: song.id,
    attributes: {
      title: song.title,
      file: {
        data: {
          attributes: {
            url: song.song?.data?.attributes?.url || "",
          },
        },
      },
      duration: song.duration || 0,
      cover: song.cover?.data || null,
      artist: band.value?.data?.attributes?.name || "Unknown Artist",
    },
  };
}

// *** Single Video Logic ***
// 1) Extract YouTube ID from singlevideo.youtubeid
function extractYouTubeId(url) {
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return match ? match[1] : url;
}

// 2) Computed property for singlevideo
const singleVideoId = computed(() => {
  const singlevid = band.value?.data?.attributes?.singlevideo;
  if (singlevid?.youtubeid) {
    return extractYouTubeId(singlevid.youtubeid);
  }
  return "";
});

// Player options for YouTube
const playerOptions = {
  autoplay: 1,
  mute: 1,
  rel: 0,
  modestbranding: 1,
};

// "Play" a video from the grid
function playVideo(videoId) {
  playingVideos.value[videoId] = true;
}

// fetchBandData, fetchVideos, etc.
async function fetchBandData() {
  // your logic to fetch band
  // Example:
  const apiUrl = useRuntimeConfig().public.strapiUrl;
  const response = await fetch(
    `${apiUrl}/api/bands/${route.params.id}?populate[albums][populate]=cover,songs.file&populate[singlesong][populate][song]=*&populate[singlevideo]=*&populate=bandImg`
  );
  const data = await response.json();
  band.value = data;

  // set albums, events, tours if you have them
  if (band.value?.data?.attributes?.albums?.data?.length) {
    albums.value = band.value.data.attributes.albums.data;
  }
}

function setAlbum(id) {
  const album = albums.value.find((a) => a.id === id);
  if (album) albumPlay.value = album;
}

// Example fetchVideos (like your separate videos collection)
async function fetchVideos() {
  try {
    const response = await find("videos", {
      filters: {
        bands: { id: { $eq: route.params.id } },
      },
      populate: { mediayoutube: true },
    });
    videoItems.value = response.data.map(/* map logic */);
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
}

onMounted(async () => {
  // custom-page-body class, etc.
  await fetchBandData();
  await fetchVideos();
});

onBeforeUnmount(() => {
  // remove classes, etc.
});
</script>

<style scoped>
/* your styles */
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
  padding-top: 56.25%; /* 16:9 ratio */
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
