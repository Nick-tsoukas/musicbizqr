<template>
  <div>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div
      v-else
      class="bg-black w-screen h-[35vh] md:h-[60vh] mx-auto pt-[var(--header-height)]"
    >
      <!-- Hero Section -->
      <div class="relative w-full h-[35vh] md:h-[60vh]">
        <img
          v-if="band.data.bandImg"
          :src="band.data.bandImg.url"
          :alt="`${band.data.name} image`"
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
        <section v-if="hasFeaturedSong" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Featured Song
          </h2>

          <!-- Embedded Track -->
          <div
            v-if="band.data.singlesong.isEmbed && safeEmbedHtml"
            class="w-full"
          >
            <div class="relative w-full h-64 rounded-lg overflow-hidden">
              <!-- Iframe container -->
              <div
                id="embedPlayerWrapper"
                class="absolute inset-0 w-full h-full"
                v-html="safeEmbedHtml"
              ></div>

              <!-- Overlay that animates on first click -->
              <div
                v-if="!embedClickCaptured"
                :class="[
                  'absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10',
                  { 'animate-wobble': showWobble },
                ]"
                @click="handleFirstClick"
              >
                <span class="text-white text-lg font-semibold"
                  >▶ Click to Play</span
                >
              </div>
            </div>
          </div>

          <!-- Raw Audio: custom player fallback -->
          <div v-else class="w-full">
            <AudioPlayer
              :album="formatSingleSong(band.data.singlesong)"
              :placeholderImage="'/placeholder-image.svg'"
              @play="onSongPlay"
              class="rounded-lg"
            />
          </div>
        </section>

        <!-- Featured Video -->
        <section v-if="band.data.singlevideo?.youtubeid" class="w-full mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Featured Video
          </h2>

          <!-- thumbnail + play overlay -->
          <div
            v-if="!isVideoPlaying"
            @click="playVideo"
            class="relative w-full overflow-hidden bg-black cursor-pointer rounded-lg embed-container"
          >
            <img
              :src="singleVideoThumbnail"
              :alt="`${band.data.name} video thumbnail`"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
            ></div>
          </div>

          <!-- actual YouTube iframe -->
          <div v-else class="embed-container rounded-lg overflow-hidden">
            <iframe
              :src="singleVideoEmbedUrl + '?autoplay=1'"
              allow="autoplay; encrypted-media; fullscreen"
              allowfullscreen
            ></iframe>
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
        <section v-if="hasStreamingLinks" class="mt-10">
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

        <!-- Upcoming Events -->
        <section
          v-if="upcomingEvents.length"
          id="upcoming-events"
          class="mt-10"
        >
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Upcoming Events
          </h2>
          <div
            class="overflow-x-scroll md:overflow-hidden relative no-scrollbar"
          >
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
                  v-for="event in upcomingEvents"
                  :key="event.id"
                  class="border-b border-purple-500 border-opacity-20 hover:bg-purple-900 cursor-pointer"
                  @click.stop="
                    router.push(`/${route.params.bandSlug}/event/${event.slug}`)
                  "
                >
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ formatDate(event.date) }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ event.city || "N/A" }}, {{ event.state }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ event.venue || "N/A" }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    <button
                      @click.stop="
                        router.push(
                          `/${route.params.bandSlug}/event/${event.slug}`
                        )
                      "
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

        <!-- Past Events -->
        <section v-if="pastEvents.length" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Past Events
          </h2>
          <div
            class="overflow-x-scroll md:overflow-hidden relative no-scrollbar"
          >
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
                  v-for="event in pastEvents"
                  :key="event.id"
                  class="border-b border-purple-500 border-opacity-20 hover:bg-purple-900 cursor-pointer"
                  @click.stop="
                    router.push(`/${route.params.bandSlug}/event/${event.slug}`)
                  "
                >
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ formatDate(event.date) }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ event.city || "N/A" }}, {{ event.state }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ event.venue || "N/A" }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    <button
                      @click.stop="
                        router.push(
                          `/${route.params.bandSlug}/event/${event.slug}`
                        )
                      "
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
        <img src="@/assets/musicbizlogo.png" alt="MusicBiz Logo" class="h-12" />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { useRuntimeConfig, useHead } from "#imports";
import { useBeacon } from "@/composables/useBeacon";
import { useRoute, useRouter } from "vue-router";
import { useNuxtApp } from "#app";
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

const embedClickCaptured = ref(false);
const hasTrackedEmbedClick = ref(false); // ← add this

const nuxtApp = useNuxtApp();
const historyStack = nuxtApp.$historyStack;
const { trackClick, trackMediaPlay } = useBeacon();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const loading = ref(true);
const band = ref(null);
const events = ref([]);

const isEmbeddedPlaying = ref(false);
const isVideoPlaying = ref(false);

function extractYouTubeId(url) {
  const m = url?.match(/[?&]v=([^&]+)/) || url?.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : "";
}

function sanitizeEmbed(html) {
  if (!html) return "";
  if (!/<iframe[\s\S]*<\/iframe>/i.test(html)) return "";
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

const rawEmbedHtml = computed(
  () => band.value?.data?.singlesong?.embedHtml || ""
);
const safeEmbedHtml = computed(() => sanitizeEmbed(rawEmbedHtml.value));

const showWobble = ref(false);

async function handleFirstClick() {
  if (embedClickCaptured.value) return;

  // optional wobble
  // showWobble.value = true;

  // Track exactly once with plain title
  if (!hasTrackedEmbedClick.value) {
    try {
      const bandId = band.value?.data?.id;
      const title  = band.value?.data?.singlesong?.title || "Unknown";
      if (bandId) await trackMediaPlay(bandId, "song", title);
      hasTrackedEmbedClick.value = true;
    } catch (e) {
      console.error("trackMediaPlay failed:", e);
    }
  }

  // Hide overlay immediately (or after wobble duration)
  embedClickCaptured.value = true;

  // if using wobble:
  // setTimeout(() => { embedClickCaptured.value = true; showWobble.value = false; }, 600);
}


// async function onEmbedClick() {
//   try {
//     const bandId = band.value?.data?.id;
//     const title = band.value?.data?.singlesong?.title || "Unknown";
//     await trackMediaPlay(bandId, "song", `${title} (embed click)`);
//   } catch (_) {}
//   embedClickCaptured.value = true;

//   // add autoplay=1 once user interacts
//   requestAnimationFrame(() => {
//     const wrapper = document.getElementById("embedPlayerWrapper");
//     const iframe = wrapper?.querySelector("iframe");
//     if (iframe && iframe.src) {
//       const hasQuery = iframe.src.includes("?");
//       const sep = hasQuery ? "&" : "?";
//       if (!/autoplay=1/.test(iframe.src))
//         iframe.src = iframe.src + sep + "autoplay=1";
//     }
//   });
// }



watch(
  () => rawEmbedHtml.value,
  );

const hasStreamingLinks = computed(() =>
  streamingPlatforms.some((p) => !!band.value?.data?.[p.name])
);

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

const previousRoute = computed(() => {
  const arr = historyStack.value;
  return arr.length ? arr[arr.length - 1] : null;
});

const singleVideoThumbnail = computed(() => {
  const id = extractYouTubeId(band.value?.data?.singlevideo?.youtubeid || "");
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
});
const singleVideoEmbedUrl = computed(() => {
  const id = extractYouTubeId(band.value?.data?.singlevideo?.youtubeid || "");
  return id ? `https://www.youtube.com/embed/${id}` : "";
});

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US");
}

function formatSingleSong(single) {
  const nestedUrl = single?.song?.data?.attributes?.url;
  const directUrl = single?.song?.url;
  const fileUrl = nestedUrl || directUrl || null;

  return {
    id: single?.id,
    attributes: {
      title: single?.title,
      song: { data: { attributes: { url: fileUrl } } },
      duration: single?.duration || 0,
      cover: single?.cover || null,
      artist: band.value?.data?.name,
    },
  };
}

async function onSongPlay() {
  if (!band.value?.data?.singlesong) return;
  const bandId = band.value.data.id;
  const title = band.value.data.singlesong.title;
  try {
    await trackMediaPlay(bandId, "song", title);
  } catch (err) {
    console.error("❌ trackMediaPlay error:", err);
  }
}

async function playVideo() {
  isVideoPlaying.value = true;
  const bandId = band.value.data.id;
  const title =
    band.value.data.singlevideo?.title || band.value.data.singlesong?.title;
  try {
    await trackMediaPlay(bandId, "video", title);
  } catch (err) {
    console.error("❌ video track error:", err);
  }
}

function handleClick(bandId, platform, url) {
  trackClick(bandId, platform, url);
}

async function fetchBandData() {
  const slug = route.params.bandSlug?.toLowerCase() || "";
  const apiUrl = config.public.strapiUrl;
  const res = await fetch(
    `${apiUrl}/api/bands/slug/${slug}?populate=bandImg,events,tours,albums,singlesong,singlevideo`
  );
  const data = await res.json();
  band.value = data;
  events.value = data.data.events || [];
  loading.value = false;

  // attach tracking after initial render of the embed
  attachEmbedTracking();
}

const today = new Date();

const upcomingEvents = computed(() =>
  events.value
    .filter((e) => new Date(e.date + "T00:00:00") >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
);

const pastEvents = computed(() =>
  events.value
    .filter((e) => new Date(e.date + "T00:00:00") < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
);

const bandName = computed(() => band.value?.data?.name || "");
const bandBio = computed(() =>
  band.value?.data?.bio ? band.value.data.bio.slice(0, 155) : ""
);
const bandImage = computed(
  () => band.value?.data?.bandImg?.url || "/default-og-image.png"
);
const bandUrl = computed(() =>
  band.value
    ? `https://yourdomain.com/band/${route.params.slug?.toLowerCase()}`
    : ""
);

const hasFeaturedSong = computed(() => {
  const s = band.value?.data?.singlesong;
  if (!s) return false;

  if (s.isEmbed) return Boolean(safeEmbedHtml.value);

  const url = s.song?.data?.attributes?.url || s.song?.url;
  return Boolean(url);
});

useHead({
  title: bandName,
  meta: [
    {
      hid: "description",
      name: "description",
      content:
        bandBio.value ||
        "Discover this artist on musicbizqr—dynamic QR link tree with analytics.",
    },
    { hid: "og:title", property: "og:title", content: bandName },
    { hid: "og:description", property: "og:description", content: bandBio },
    { hid: "og:image", property: "og:image", content: bandImage },
    { hid: "og:url", property: "og:url", content: bandUrl },
    {
      hid: "twitter:card",
      name: "twitter:card",
      content: "summary_large_image",
    },
  ],
});

async function scrollToUpcoming() {
  await nextTick();
  await nextTick();
  const el = document.getElementById("upcoming-events");
  if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
}

onMounted(async () => {
  await fetchBandData();

  const cfg = useRuntimeConfig();
  const bandId = band.value?.data?.id || band.value?.id;
  if (!bandId) {
    console.warn("⚠️ No bandId found for page view tracking");
  } else {
    try {
      await $fetch(`${cfg.public.strapiUrl}/api/band-page-views`, {
        method: "POST",
        body: {
          data: {
            band: bandId,
            timestamp: new Date().toISOString(),
            ipAddress: null,
            userAgent: navigator.userAgent,
          },
        },
      });
    } catch (err) {
      console.error("❌ Failed to track band page view:", err);
    }
  }

  if (previousRoute.value?.fullPath.includes("/event/")) {
    scrollToUpcoming();
  }
});
</script>

<style scoped>
/* @keyframes wobble {
  0% { transform: rotate(0deg); }
  15% { transform: rotate(-3deg); }
  30% { transform: rotate(3deg); }
  45% { transform: rotate(-2deg); }
  60% { transform: rotate(2deg); }
  75% { transform: rotate(-1deg); }
  100% { transform: rotate(0deg); }
}

.animate-wobble { animation: wobble 0.6s ease-in-out; } */

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

/* Ensure pasted iframe fills the wrapper */
:deep(#embedPlayerWrapper iframe) {
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
@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
