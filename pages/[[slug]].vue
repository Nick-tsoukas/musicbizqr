<template>
  <div>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div v-else class="bg-black w-screen mx-auto">
      <!-- Hero Section -->
      <div class="relative w-full h-[35vh] md:h-[60vh]">
        <img
          v-if="band.data.bandImg"
          :src="band.data.bandImg.url"
          alt="Band Image"
          class="absolute inset-0 w-auto m-auto h-[35vh] md:h-2/3 object-cover"
        />
        <div class="absolute inset-0 bg-black bg-opacity-0"></div>
      </div>

      <!-- Band Name -->
      <div
        v-if="!band.data.isBandNameInLogo"
        class="text-center text-white text-4xl font-bold mt-4"
      >
        {{ band.data.name }}
      </div>

      <!-- Bio & Tagline -->
      <div class="flex justify-center mt-4">
        <div class="text-center text-white max-w-5xl">
          <p
            v-if="band.data.bio"
            class="md:text-2xl leading-tight whitespace-pre-line"
          >
            {{ band.data.bio }}
          </p>
          <p
            v-if="band.data.biotagline"
            class="md:text-2xl leading-tight whitespace-pre-line mt-2"
          >
            {{ band.data.biotagline }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="w-full px-6 mt-4 md:max-w-[80vw] md:mx-auto">
        <!-- Featured Song -->
        <section v-if="band.data.singlesong" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Featured Song
          </h2>

          <!-- 1) Embedded Track (same as before) -->
          <div
            v-if="band.data.singlesong.isEmbed && embedUrl"
            class="w-full"
          >
            <div
              class="relative w-full h-[360px] rounded-lg overflow-hidden bg-black"
            >
              <div
                v-if="!isEmbeddedPlaying"
                @click="startEmbedded()"
                class="absolute inset-0 bg-black bg-opacity-75 cursor-pointer"
              >
                <div class="absolute top-2 left-2">
                  <p class="text-white font-bold">
                    {{ band.data.singlesong.title }}
                  </p>
                  <p class="text-gray-300 text-sm">{{ band.data.name }}</p>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-16 h-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 84 84"
                  >
                    <circle cx="42" cy="42" r="42" fill="rgba(0,0,0,0.6)" />
                    <polygon points="34,28 34,56 58,42" fill="white" />
                  </svg>
                </div>
              </div>
              <iframe
                v-else
                :src="embedUrl + '?autoplay=1'"
                frameborder="0"
                allow="autoplay; encrypted-media; fullscreen; clipboard-write"
                allowfullscreen
                class="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          <!-- 2) Raw Audio: ALWAYS show <AudioPlayer> -->
          <div v-else class="w-full">
            <AudioPlayer
              :album="formatSingleSong(band.data.singlesong)"
              :placeholderImage="'/placeholder-image.svg'"
              @play="onSongPlay"
              class="rounded-lg"
            />
          </div>
        </section>

        <!-- Featured Video (unchanged) -->
        <section
          v-if="band.data.singlevideo?.youtubeid"
          class="relative w-full max-w-[600px] mr-auto mt-10"
        >
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Featured Video
          </h2>
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
            <div
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
            >
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
          <div v-else class="relative h-[360px] w-full">
            <YouTube
              :src="singleVideoEmbedUrl"
              :vars="playerOptions"
              class="absolute inset-0 w-full h-full rounded-lg"
            />
          </div>
        </section>

        <!-- Website Link -->
        <section v-if="band.data.websitelink" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
            Website Link
          </h2>
          <a
            :href="band.data.websitelink"
            class="text-purple-500 text-xl"
            target="_blank"
            rel="noopener"
          >
            {{ band.data.websitelinktext || band.data.websitelink }}
          </a>
        </section>

        <!-- Streaming Links -->
        <section class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Streaming Links
          </h2>
          <template v-for="platform in streamingPlatforms" :key="platform.name">
            <span v-if="band.data[platform.name]">
              <a
                :href="band.data[platform.name]"
                @click.prevent="
                  handleClick(
                    band.data.id,
                    platform.name,
                    band.data[platform.name]
                  )
                "
              >
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
        </section>

        <!-- Social Media -->
        <section class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Social Media
          </h2>
          <template v-for="platform in socialPlatforms" :key="platform.name">
            <span v-if="band.data[platform.name]">
              <a
                :href="band.data[platform.name]"
                @click.prevent="
                  handleClick(
                    band.data.id,
                    platform.name,
                    band.data[platform.name]
                  )
                "
              >
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
        </section>

        <!-- Events & Tours -->
        <section v-if="events.length" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-1">
            Events and Tours
          </h2>
          <div class="overflow-x-scroll md:overflow-hidden relative">
            <table
              class="w-full table-auto bg-black text-white rounded-md shadow-lg"
            >
              <thead>
                <tr class="border-b border-purple-500 border-opacity-30">
                  <th class="px-2 py-2 text-left">Date</th>
                  <th class="px-2 py-2 text-left">City</th>
                  <th class="px-2 py-2 text-left">Venue</th>
                  <th class="px-2 py-2 text-left">Tickets</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="event in events"
                  :key="event.id"
                  class="border-b border-purple-500 border-opacity-20 hover:bg-purple-900 cursor-pointer"
                  @click="router.push(`/event/${event.id}`)"
                >
                  <td class="px-2 py-1 whitespace-nowrap">
                    {{ formatDate(event.date) }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap">
                    {{ event.city || "N/A" }}, {{ event.state }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap">
                    {{ event.venue || "N/A" }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap">
                    <button
                      @click="router.push(`/event/${event.id}`)"
                      class="text-purple-400"
                    >
                      View Event
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <footer class="h-40 flex justify-center items-center">
        <img
          src="@/assets/musicbizlogo.png"
          alt="MusicBiz Logo"
          class="h-12"
        />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRuntimeConfig } from "#imports";
import { useBeacon } from "@/composables/useBeacon";
import YouTube from "vue3-youtube";
import { useRoute, useRouter } from "vue-router";
import AudioPlayer from "@/components/AudioPlayer.vue";

import facebookIcon from "@/assets/facebookfree.png";
import instagramIcon from "@/assets/instagramfree.png";
import twitchIcon from "@/assets/twitchfree.png";
import appleMusicIcon from "@/assets/apple.svg";
import soundcloudIcon from "@/assets/soundcloudlast.png";
import deezerIcon from "@/assets/dezzer.svg";
import youtubeIcon from "@/assets/youtube-icon.svg";
import bandcampIcon from "@/assets/bandcamp.svg";
import reverbnationIcon from "@/assets/reverbnation.png";
import spotifyIcon from "@/assets/spotify.svg";
import youtubeMusicIcon from "@/assets/youtube-icon.svg";
import tiktokIcon from "@/assets/tiktok.png";
import twitterIcon from "@/assets/twitter.png";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/effect-cards";

const { trackClick, trackMediaPlay } = useBeacon();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const loading = ref(true);
const band = ref(null);
const events = ref([]);

const isEmbeddedPlaying = ref(false);

// Streaming + social platform definitions:
const streamingPlatforms = [
  { name: "youtube", img: youtubeIcon, label: "YouTube" },
  { name: "youtubeMusic", img: youtubeMusicIcon, label: "YouTube Music" },
  { name: "spotify", img: spotifyIcon, label: "Spotify" },
  { name: "appleMusic", img: appleMusicIcon, label: "Apple Music" },
  { name: "reverbnation", img: reverbnationIcon, label: "Reverbnation" },
  { name: "soundcloud", img: soundcloudIcon, label: "SoundCloud" },
  { name: "bandcamp", img: bandcampIcon, label: "Bandcamp" },
  { name: "twitch", img: twitchIcon, label: "Twitch" },
  { name: "deezer", img: deezerIcon, label: "Deezer" },
];

const socialPlatforms = [
  { name: "facebook", img: facebookIcon, label: "Facebook" },
  { name: "instagram", img: instagramIcon, label: "Instagram" },
  { name: "twitter", img: twitterIcon, label: "Twitter" },
  { name: "tiktok", img: tiktokIcon, label: "Tiktok" },
];

// ─── Compute embed URL for an embedded track (Spotify / Apple Music) ───────────────────────────────────────────────────────────────────
function extractYouTubeId(url) {
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : "";
}

const embedUrl = computed(() => {
  const s = band.value?.data?.singlesong;
  if (!s?.isEmbed || !s.trackId || !s.platform) return "";
  return s.platform === "spotify"
    ? `https://open.spotify.com/embed/track/${s.trackId}`
    : `https://embed.music.apple.com/us/song/${s.trackId}`;
});

// ─── Compute YouTube thumbnail and embed for video ─────────────────────────────────────────────────────────────────────────────
const singleVideoThumbnail = computed(() => {
  const id = extractYouTubeId(band.value?.data?.singlevideo?.youtubeid || "");
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
});
const singleVideoEmbedUrl = computed(() => {
  const id = extractYouTubeId(band.value?.data?.singlevideo?.youtubeid || "");
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : "";
});
const playerOptions = { autoplay: 1, rel: 0, modestbranding: 1 };

// ─── Helpers ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US");
}

// Build a “single-song” object that matches AudioPlayer.vue’s expected shape
function formatSingleSong(single) {
  return {
    id: single.id,
    attributes: {
      title: single.title,
      // AudioPlayer.vue expects props.album.attributes.song.data.attributes.url
      song: { data: { attributes: { url: single.song.url } } },
      duration: single.duration || 0,
      cover: single.cover || null, // shape: { data: { attributes: { url } } }
      artist: band.value.data.name,
    },
  };
}

// ─── Analytics for “play” ───────────────────────────────────────────────────────────────────────────────────────────────────────
async function onSongPlay() {
  // Only fire once we have a valid band & singlesong
  if (!band.value?.data?.singlesong) return;

  const bandId = band.value.data.id;
  const title = band.value.data.singlesong.title;
  try {
    await trackMediaPlay(bandId, "song", title);
  } catch (err) {
    console.error("❌ trackMediaPlay error:", err);
  }
}

// Embedded track “play” overlay → flip to true & track analytics
async function startEmbedded() {
  isEmbeddedPlaying.value = true;
  const bandId = band.value.data.id;
  const title = band.value.data.singlesong.title;
  try {
    await trackMediaPlay(bandId, "song", title);
  } catch (err) {
    console.error("❌ trackMediaPlay (embedded) error:", err);
  }
}

// ─── Video analytics ────────────────────────────────────────────────────────────────────────────────────────────────────────
const isVideoPlaying = ref(false);
async function playVideo() {
  isVideoPlaying.value = true;
  const bandId = band.value.data.id;
  const title =
    band.value.data.singlevideo.title || band.value.data.singlesong.title;
  try {
    await trackMediaPlay(bandId, "video", title);
  } catch (err) {
    console.error("❌ video track error:", err);
  }
}

// ─── Outbound link click tracking ─────────────────────────────────────────────────────────────────────────────────────────────
function handleClick(bandId, platform, url) {
  trackClick(bandId, platform, url);
}

// ─── Fetch band by slug ───────────────────────────────────────────────────────────────────────────────────────────────────────
async function fetchBandData() {
  const apiUrl = config.public.strapiUrl;
  const res = await fetch(
    `${apiUrl}/api/bands/slug/${route.params.slug?.toLowerCase() || ""}?populate=bandImg,events,tours,albums,singlesong,singlevideo`
  );
  const data = await res.json();
  band.value = data;
  events.value = data.data.events || [];
  loading.value = false;
}

onMounted(fetchBandData);
</script>

<style scoped>
.embed-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
}
.embed-container iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.custom-border {
  border: 0.1px solid white;
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
  margin-top: 2rem;
}
</style>
