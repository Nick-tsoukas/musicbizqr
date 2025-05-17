<template>
  <div>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <div v-else-if="band && band.data" class="bg-[#000] w-screen mx-auto">
      <!-- Hero Section -->
      <div class="relative w-full h-[35vh] md:h-[60vh]">
        <img
          v-if="band.data.bandImg"
          class="absolute inset-0 w-auto m-auto h-[35vh] md:h-2/3 object-cover"
          :src="band.data.bandImg.url"
          alt="Band Image"
        />
        <div class="absolute inset-0 bg-black bg-opacity-0"></div>
      </div>

      <!-- Band Name -->
      <div
        v-if="band.data.isBandNameInLogo === false"
        class="text-center text-white text-4xl font-bold mt-4"
      >
        {{ band.data.name }}
      </div>

      <!-- Bio & Tagline -->
      <div class="flex justify-center">
        <div class="flex flex-col">
          <h3
            v-if="band.data.bio"
            class="text-[16px] mx-auto mt-4 max-w-5xl text-center text-white md:text-2xl leading-tight whitespace-pre-line"
          >
            {{ band.data.bio }}
          </h3>
          <div v-if="band.data.biotagline">
            <h3
              class="text-[16px] mx-auto max-w-3xl text-center text-white md:text-2xl leading-tight mt-0 whitespace-pre-line"
            >
              {{ band.data.biotagline }}
            </h3>
          </div>
        </div>
      </div>

      <div class="w-full px-6 mt-4 md:max-w-[80vw] md:mx-auto">
        <div class="pt-0 sm:p-5">
          <!-- Featured Song -->
          <div
            v-if="band.data.singlesong && (band.data.singlesong.embedUrl || band.data.singlesong.song)"
          >
            <h1 class="text-2xl mb-1 md:text-3xl font-bold text-white md:my-4">
              Featured Song
            </h1>

            <div v-if="band.data.singlesong.isEmbeded && band.data.singlesong.embedUrl">
              <iframe
                :src="band.data.singlesong.embedUrl"
                frameborder="0"
                allowfullscreen
                class="w-full h-64 rounded-lg"
              ></iframe>
            </div>
            <div v-else>
              <AudioPlayer
                :album="formatSingleSong(band.data.singlesong)"
                placeholderImage="/placeholder-image.svg"
              />
            </div>
          </div>

          <!-- Featured Video -->
          <div
            v-if="band.data.singlevideo && band.data.singlevideo.youtubeid"
            class="relative w-full max-w-[600px] mr-auto"
          >
            <h1 class="text-2xl my-10 md:text-3xl font-bold text-white">
              Featured Video
            </h1>

            <div
              v-if="!isVideoPlaying"
              class="relative cursor-pointer mb-10"
              @click="playVideo"
            >
              <img
                :src="singleVideoThumbnail"
                alt="Video Thumbnail"
                class="w-full max-h-[300px] object-cover rounded-lg"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <svg
                  class="w-16 h-16 text-white opacity-75"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 84 84"
                >
                  <circle cx="42" cy="42" r="42" fill="rgba(0, 0, 0, 0.6)" />
                  <polygon points="33,24 33,60 60,42" fill="white" />
                </svg>
              </div>
            </div>

            <div v-else class="relative pb-[56.25%] w-full">
              <YouTube
                :src="singleVideoEmbedUrl"
                :vars="playerOptions"
                class="w-full h-full rounded-lg"
              />
            </div>
          </div>

          <!-- Social Links -->
          <div v-if="socialPlatforms.some(p => band.data[p.name])" class="mt-10">
            <h2 class="text-2xl font-bold text-white md:my-4">Follow Us</h2>
            <div class="flex space-x-4">
              <a
                v-for="platform in socialPlatforms"
                :key="platform.name"
                v-if="band.data[platform.name]"
                :href="band.data[platform.name]"
                target="_blank"
                rel="noopener"
                @click.prevent="handleClick(band.data.id, platform.name, band.data[platform.name])"
              >
                <img
                  :src="platform.img"
                  :alt="platform.label"
                  class="w-8 h-8 filter brightness-0 invert"
                />
              </a>
            </div>
          </div>

          <!-- Streaming Links -->
          <div
            v-if="streamingPlatforms.some(p => band.data[p.name])"
            class="mt-10"
          >
            <h2 class="text-2xl font-bold text-white md:my-4">
              Listen On
            </h2>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              <a
                v-for="platform in streamingPlatforms"
                :key="platform.name + platform.label"
                v-if="band.data[platform.name]"
                :href="band.data[platform.name]"
                target="_blank"
                rel="noopener"
                @click.prevent="handleClick(band.data.id, platform.name, band.data[platform.name])"
              >
                <img
                  :src="platform.img"
                  :alt="platform.label"
                  class="w-10 h-10 filter brightness-0 invert"
                />
              </a>
            </div>
          </div>

          <!-- Upcoming Events -->
          <div v-if="events.length" class="mt-10 px-6 md:max-w-[80vw] md:mx-auto">
            <h2 class="text-2xl font-bold text-white mb-4">Upcoming Events</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="ev in events"
                :key="ev.id"
                class="bg-white rounded-lg p-4"
              >
                <h3 class="text-lg font-semibold mb-2">
                  {{ formatDate(ev.attributes.date) }} – {{ ev.attributes.title }}
                </h3>
                <p class="text-sm text-gray-700 mb-1">
                  {{ ev.attributes.venue }}, {{ ev.attributes.city }}, {{ ev.attributes.state }}
                </p>
                <p class="text-sm text-gray-600 mb-2">
                  {{ truncate(ev.attributes.description, 100) }}
                </p>
                <a
                  v-if="ev.attributes.link"
                  :href="ev.attributes.link"
                  target="_blank"
                  class="text-blue-500 hover:underline"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Logo -->
      <div class="h-40 flex justify-center items-center">
        <img src="@/assets/musicbizlogo.png" class="h-12" alt="MusicBiz Logo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRuntimeConfig, useRoute, useRouter } from "#imports";
import YouTube from "vue3-youtube";
import { useBeacon } from "@/composables/useBeacon";
import AudioPlayer from "@/components/AudioPlayer.vue";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/effect-cards";

import facebookIcon from "@/assets/facebookfree.png";
import instagramIcon from "@/assets/instagramfree.png";
import twitterIcon from "@/assets/twitter.png";
import tiktokIcon from "@/assets/tiktok.png";
import youtubeIcon from "@/assets/youtube-icon.svg";
import youtubeMusicIcon from "@/assets/youtube-icon.svg";
import spotifyIcon from "@/assets/spotify.svg";
import appleMusicIcon from "@/assets/apple.svg";
import reverbnationIcon from "@/assets/reverbnation.png";
import soundcloudIcon from "@/assets/soundcloudlast.png";
import bandcampIcon from "@/assets/bandcamp.svg";
import twitchIcon from "@/assets/twitchfree.png";
import deezerIcon from "@/assets/dezzer.svg";

const loading = ref(true);
const band = ref(null);
const events = ref([]);

const socialPlatforms = [
  { name: "facebook", img: facebookIcon, label: "Facebook" },
  { name: "instagram", img: instagramIcon, label: "Instagram" },
  { name: "twitter", img: twitterIcon, label: "Twitter" },
  { name: "tiktok", img: tiktokIcon, label: "TikTok" },
];

const streamingPlatforms = [
  { name: "youtube", img: youtubeIcon, label: "YouTube" },
  { name: "youtubeMusic", img: youtubeMusicIcon, label: "YouTube Music" },
  { name: "spotify", img: spotifyIcon, label: "Spotify" },
  { name: "appleMusic", img: appleMusicIcon, label: "Apple Music" },
  { name: "reverbnation", img: reverbnationIcon, label: "ReverbNation" },
  { name: "soundcloud", img: soundcloudIcon, label: "SoundCloud" },
  { name: "bandcamp", img: bandcampIcon, label: "Bandcamp" },
  { name: "twitch", img: twitchIcon, label: "Twitch" },
  { name: "deezer", img: deezerIcon, label: "Deezer" },
];

const { trackClick } = useBeacon();
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const isVideoPlaying = ref(false);
const playerOptions = { autoplay: 1, rel: 0, modestbranding: 1 };

const singleVideoId = computed(() => {
  const url = band.value?.data?.singlevideo?.youtubeid || "";
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return match ? match[1] : "";
});

const singleVideoThumbnail = computed(() =>
  singleVideoId.value
    ? `https://img.youtube.com/vi/${singleVideoId.value}/hqdefault.jpg`
    : ""
);

const singleVideoEmbedUrl = computed(() => {
  return singleVideoId.value
    ? `https://www.youtube.com/embed/${singleVideoId.value}?autoplay=1`
    : "";
});

const playVideo = () => {
  isVideoPlaying.value = true;
};

const formatSingleSong = (song) => {
  if (!song) return null;
  return {
    id: song.id,
    attributes: {
      isEmbeded: song.isEmbeded,
      title:     song.title,
      embedUrl:  song.embedUrl,
      file: {
        data: { attributes: { url: song.song?.url || null } },
      },
      artist: band.value?.data?.name || "",
    },
  };
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

function truncate(text, length) {
  return text?.length > length ? text.slice(0, length) + "…" : text;
}

async function fetchBandData() {
  loading.value = true;
  const slug = (route.params.slug || "").toLowerCase();
  const url =
    `${config.public.strapiUrl}/api/bands/slug/${slug}?` +
    "populate[bandImg]=*&" +
    "populate[singlesong][populate]=song&" +
    "populate[singlevideo]=*&" +
    "populate[events][populate]=*&" +
    socialPlatforms.map(p => `populate[${p.name}]=true`).join("&") + "&" +
    streamingPlatforms.map(p => `populate[${p.name}]=true`).join("&");

  const res = await fetch(url);
  const json = await res.json();
  band.value = json;
  events.value = json.data.events || [];
  loading.value = false;
}

onMounted(() => {
  document.body.classList.add("custom-page-body");
  fetchBandData();
});

onBeforeUnmount(() => {
  document.body.classList.remove("custom-page-body");
});
</script>

<style scoped>
.custom-page-body {
  background-color: #000;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #6200ee;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.filter {
  filter: brightness(0) invert(1);
}
img {
  max-width: 100%;
  display: block;
}
</style>
