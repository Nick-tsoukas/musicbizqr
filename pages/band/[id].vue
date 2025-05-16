<template>
  <div v-if="band?.data" class="bg-[#000] w-screen mx-auto">
    <!-- Hero Image -->
    <div class="relative w-full h-[35vh] md:h-[60vh]">
      <img
        v-if="band.data.bandImg"
        class="absolute inset-0 m-auto h-[35vh] md:h-2/3 object-cover"
        :src="band.data.bandImg.url"
        alt="Band Image"
      />
      <div class="absolute inset-0 bg-black bg-opacity-0"></div>
    </div>

    <!-- Band Name (if not in logo) -->
    <div
      v-if="band.data.isBandNameInLogo === false"
      class="text-center text-white text-4xl font-bold mt-4"
    >
      {{ band.data.name }}
    </div>

    <!-- Bio & Tagline -->
    <div class="flex justify-center mt-4">
      <div class="text-center text-white max-w-5xl">
        <p v-if="band.data.bio" class="md:text-2xl leading-tight whitespace-pre-line">
          {{ band.data.bio }}
        </p>
        <p v-if="band.data.biotagline" class="md:text-2xl leading-tight whitespace-pre-line mt-2">
          {{ band.data.biotagline }}
        </p>
      </div>
    </div>

    <div class="w-full px-6 mt-8 md:max-w-[80vw] md:mx-auto">
      <!-- Featured Song -->
      <div v-if="hasSingleSong">
        <h2 class="text-3xl font-bold text-white mb-4">Featured Song </h2>
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
      <div v-if="hasSingleVideo" class="mt-16">
        <h2 class="text-3xl font-bold text-white mb-4">Featured Video </h2>
        <div class="relative w-full max-w-[600px]">
          <div v-if="!isVideoPlaying" class="cursor-pointer" @click="playVideo">
            <img
              :src="singleVideoThumbnail"
              alt="Video Thumbnail"
              class="w-full h-64 object-cover rounded-lg"
            />
            <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-white opacity-75" viewBox="0 0 84 84">
                <circle cx="42" cy="42" r="42" fill="rgba(0,0,0,0.6)" />
                <polygon points="33,24 33,60 60,42" fill="white" />
              </svg>
            </div>
          </div>
          <div v-else class="mt-4">
            <YouTube :src="singleVideoId" :vars="playerOptions" class="w-full h-64 rounded-lg" />
          </div>
        </div>
      </div>

      <!-- Website Link -->
      <div v-if="band.data.websitelink" class="mt-16">
        <h2 class="text-3xl font-bold text-white mb-2">Website Link</h2>
        <a :href="band.data.websitelink" class="text-purple-500 text-xl">
          {{ band.data.websitelinktext || band.data.websitelink }}
        </a>
      </div>
    </div>

    <!-- Footer Logo -->
    <div class="h-40 flex justify-center items-center">
      <img src="@/assets/musicbizlogo.png" class="h-12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import YouTube from 'vue3-youtube';
import AudioPlayer from '@/components/AudioPlayer.vue';
import { useRuntimeConfig } from '#imports';
import { useStrapi } from '@nuxtjs/strapi';

const band = ref<any>(null);
const isVideoPlaying = ref(false);

// Extract YouTube ID
function extractYouTubeId(url: string) {
  const m = url?.match(/[?&]v=([^&]+)/) || url?.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : '';
}

// Computed values
const singleVideoId = computed(() => {
  const vid = band.value?.data?.singlevideo?.youtubeid;
  return vid ? extractYouTubeId(vid) : '';
});

const singleVideoThumbnail = computed(() =>
  singleVideoId.value
    ? `https://img.youtube.com/vi/${singleVideoId.value}/hqdefault.jpg`
    : ''
);

// Guards
const hasSingleSong = computed(() => {
  const s = band.value?.data?.singlesong;
  if (!s) return false;
  return s.isEmbeded
    ? typeof s.embedUrl === 'string' && s.embedUrl.trim() !== ''
    : Boolean(s.song?.data?.attributes?.url && s.song.data.attributes.url.trim() !== '');
});

const hasSingleVideo = computed(() => {
  const id = singleVideoId.value;
  return typeof id === 'string' && id.trim() !== '';
});

// Format for AudioPlayer
const formatSingleSong = (song: any) => ({
  id: song.id,
  attributes: {
    isEmbeded: song.isEmbeded,
    title: song.title,
    embedUrl: song.embedUrl,
    file: {
      data: {
        attributes: {
          url: song.song?.data?.attributes?.url
        }
      }
    },
    cover: song.cover?.data,
    artist: band.value?.data?.name
  }
});

// Player control
const playerOptions = { autoplay: 1, rel: 0, modestbranding: 1 };
const playVideo = () => { isVideoPlaying.value = true; };

// Fetch band data
const { find } = useStrapi();
const route = useRoute();

const fetchBandData = async () => {
  const apiUrl = useRuntimeConfig().public.strapiUrl;
  const res = await fetch(
    `${apiUrl}/api/bands/${route.params.id}` +
      '?populate[singlesong][populate]=song,cover' +
      '&populate[singlevideo]=*' +
      '&populate=bandImg'
  );
  const json = await res.json();
  band.value = json;
};

onMounted(async () => {
  document.body.classList.add('custom-page-body');
  await fetchBandData();
});

onBeforeUnmount(() => {
  document.body.classList.remove('custom-page-body');
});
</script>

<style scoped>
.custom-page-body {
  background: #000;
}
</style>
