<template>
  <div>
     <div v-if="!showPage" class="loading-container">
    <div class="spinner"></div>
  </div>

    <div
      v-else
      class="bg-black w-screen h-[35vh] md:h-[60vh] mx-auto pt-[var(--header-height)] fade-in"
    >
      <!-- Hero Section -->
       <div class="relative w-full h-[35vh] md:h-[60vh]">
        <img
          v-if="band.data.bandImg"
          :src="band.data.bandImg.url"
          :alt="`${band.data.name} image`"
          class="absolute inset-0 w-auto m-auto h-[35vh] md:h-2/3 object-cover"
        />
     
      <div class="absolute inset-0 bg-black/0"></div>
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
              <div
                id="embedPlayerWrapper"
                class="absolute inset-0 w-full h-full"
                v-html="safeEmbedHtml"
              ></div>

              <div
                v-if="!embedClickCaptured"
                class="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
                @click="handleFirstClick"
              >
                <span class="text-white text-lg font-semibold">
                  ▶ Click to Play
                </span>
              </div>
            </div>
          </div>

          <!-- Raw Audio -->
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
        <section v-if="hasSocialLinks" class="mt-10">
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
import { ref, onMounted, computed, watch } from "vue";
import { useRuntimeConfig } from "#imports";
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



const embedClickCaptured = ref(false);
const hasTrackedEmbedClick = ref(false);
const nuxtApp = useNuxtApp();

const { trackClick, trackMediaPlay } = useBeacon();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

// replace: const loading = ref(true);
const loadingData = ref(true)
const heroReady   = ref(false)


const showPage = computed(() => {
  const url = band.value?.data?.bandImg?.url
  // show when data is fetched AND either no hero or hero preloaded
  return !loadingData.value && (!url || heroReady.value)
})
const band = ref(null);
const events = ref([]);

function preloadHero(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(true)        // nothing to wait on
    const img = new Image()
    // ask browser to prioritize this
    img.loading = 'eager'
    img.decoding = 'sync'
    // if you serve from a different origin and need it later on canvas, uncomment:
    // img.crossOrigin = 'anonymous'
    const done = () => resolve(true)
    img.onload = done
    img.onerror = done   // don’t hang the UI if it fails
    img.src = src
    if (img.complete) return resolve(true) // cached path
    // final guard so we never spin forever (network weirdness)
    setTimeout(done, 3000)
  })
}


const isVideoPlaying = ref(false);

/* ---------- helpers ---------- */
function extractYouTubeId(url) {
  const m = url?.match(/[?&]v=([^&]+)/) || url?.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : "";
}

function sanitizeEmbed(html) {
  if (!html) return "";
  // must contain an iframe; strip scripts
  if (!/<iframe[\s\S]*<\/iframe>/i.test(html)) return "";
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

/* ---------- embed & featured song ---------- */
const rawEmbedHtml = computed(
  () => band.value?.data?.singlesong?.embedHtml || ""
);
const safeEmbedHtml = computed(() => sanitizeEmbed(rawEmbedHtml.value));

const hasFeaturedSong = computed(() => {
  const s = band.value?.data?.singlesong;
  if (!s) return false;

  if (s.isEmbed) {
    // Only render if we truly have a valid iframe after sanitization
    return !!safeEmbedHtml.value;
  }

  // Raw audio mode: require a real file URL
  const nestedUrl = s?.song?.data?.attributes?.url;
  const directUrl = s?.song?.url;
  return !!(nestedUrl || directUrl);
});

function handleFirstClick() {
  // Hide overlay so the iframe can be interacted with
  embedClickCaptured.value = true;

  // Optional: track the first interaction
  if (!hasTrackedEmbedClick.value) {
    try {
      const bandId = band.value?.data?.id;
      const title = band.value?.data?.singlesong?.title || "song-embed";
      trackMediaPlay(bandId, "song-embed", title);
    } catch (e) {
      console.error("trackMediaPlay (embed) error:", e);
    } finally {
      hasTrackedEmbedClick.value = true;
    }
  }
}

/* ---------- streaming & social sections ---------- */
const hasStreamingLinks = computed(() =>
  streamingPlatforms.some((p) => !!band.value?.data?.[p.name])
);
const hasSocialLinks = computed(() =>
  socialPlatforms.some((p) => !!band.value?.data?.[p.name])
);

/* ---------- video ---------- */
const singleVideoThumbnail = computed(() => {
  const id = extractYouTubeId(band.value?.data?.singlevideo?.youtubeid || "");
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
});
const singleVideoEmbedUrl = computed(() => {
  const id = extractYouTubeId(band.value?.data?.singlevideo?.youtubeid || "");
  return id ? `https://www.youtube.com/embed/${id}` : "";
});

/* ---------- formatting ---------- */
function formatDate(dateStr) {
  // Always English (US)
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSingleSong(single) {
  if (!single) return null;
  const nestedUrl = single?.song?.data?.attributes?.url;
  const directUrl = single?.song?.url;
  const fileUrl = nestedUrl || directUrl || null;

  return {
    id: single?.id,
    attributes: {
      title: single?.title || "Untitled",
      song: { data: { attributes: { url: fileUrl } } },
      duration: single?.duration || 0,
      cover: single?.cover || null,
      artist: band.value?.data?.name || "Artist",
    },
  };
}

/* ---------- tracking ---------- */
async function onSongPlay() {
  if (!band.value?.data?.singlesong) return;
  const bandId = band.value.data.id;
  const title = band.value.data.singlesong.title || "song";
  try {
    await trackMediaPlay(bandId, "song", title);
  } catch (err) {
    console.error("❌ trackMediaPlay error:", err);
  }
}

async function playVideo() {
  isVideoPlaying.value = true;
  const bandId = band.value?.data?.id;
  const title =
    band.value?.data?.singlevideo?.title ||
    band.value?.data?.singlesong?.title ||
    "video";
  try {
    await trackMediaPlay(bandId, "video", title);
  } catch (err) {
    console.error("❌ video track error:", err);
  }
}

function handleClick(bandId, platform, url) {
  trackClick(bandId, platform, url);
}

/* ---------- data fetch ---------- */
async function fetchBandData() {
  const slug = route.params.bandSlug?.toLowerCase() || "";
  const api = config.public.strapiUrl;

  // Ask ONLY for fields used on the page
  const url =
    `${api}/api/bands/slug/${slug}` +
    `?fields[0]=name&fields[1]=isBandNameInLogo&fields[2]=bio&fields[3]=biotagline` +
    `&fields[4]=websitelink&fields[5]=websitelinktext` +
    `&fields[6]=youtube&fields[7]=youtubeMusic&fields[8]=spotify&fields[9]=appleMusic` + // streaming
    `&fields[10]=reverbnation&fields[11]=soundcloud&fields[12]=bandcamp&fields[13]=twitch&fields[14]=deezer` +
    `&fields[15]=facebook&fields[16]=instagram&fields[17]=twitter&fields[18]=tiktok` + // social
    `&populate[bandImg][fields][0]=url` +
    `&populate[singlevideo][fields][0]=youtubeid&populate[singlevideo][fields][1]=title` +
    `&populate[singlesong][fields][0]=title&populate[singlesong][fields][1]=isEmbed&populate[singlesong][fields][2]=embedHtml` +
    `&populate[singlesong][populate][song][fields][0]=url&populate[singlesong][populate][cover][fields][0]=url` +
    `&populate[events][fields][0]=date&populate[events][fields][1]=slug&populate[events][fields][2]=city&populate[events][fields][3]=state&populate[events][fields][4]=venue`;

  try {
    const res = await fetch(url, { cache: "no-store" })
    const data = await res.json()
    band.value = data

    // build the exact URL you’ll render for the hero
    const raw = band.value?.data?.bandImg?.url || null

    // If you want to be 100% identical to <NuxtImg>, generate the same URL:
    // const img = useImage()            // import { useImage } from '#imports'
    // const heroUrl = raw ? img(raw, { format:'webp', modifiers:{ fit:'cover', quality:60 } }) : null
    // await preloadHero(heroUrl)

    await preloadHero(raw)              // (works fine — the transformed NuxtImg URL will use the cache)

    heroReady.value = true
  } catch (e) {
    console.error('Fetch band error:', e)
    heroReady.value = true              // don’t hang the page on errors
  } finally {
    loadingData.value = false
  }

}

/* ---------- events ---------- */
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

// in the band page <script setup>
onMounted(() => {
  try {
    const body = {
      bandId: band.value?.data?.id,
      path: location.pathname,
      title: document.title
    }
    const blob = new Blob([JSON.stringify(body)], { type:'application/json' })
    navigator.sendBeacon?.('/api/track/band-view', blob)
    if (!navigator.sendBeacon) {
      fetch('/api/track/band-view', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    }
  } catch {}
})


onMounted(fetchBandData);

watch([loadingData, band], ([loadingData, bandVal]) => {
  if (loadingData) return
  const id = bandVal?.data?.id
  if (!id) return
  try {
    const payload = {
      bandId: id,
      path: location.pathname,
      title: document.title
    }
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track/band-view', blob)
    } else {
      fetch('/api/track/band-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }
  } catch {}
}, { immediate: true })
</script>

<style scoped>
.embed-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
}

.fade-in {
  animation: fadeIn .25s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
.embed-container iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
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
/* testing */
</style>
