<template>
  <div>
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <div v-if="band && band.data" class="bg-[#000] w-screen mx-auto">
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

      <div v-if="band.data.isBandNameInLogo === false" class="text-center text-white text-4xl font-bold mt-4">
        {{ band.data.name }}
      </div>

      <div class="flex justify-center">
        <div class="flex flex-col">
          <h3
            v-if="band.data.bio"
            class="text-[16px] mx-auto mt-4 max-w-5xl text-center text-white md:text-2xl leading-tight whitespace-pre-line"
          >
            {{ band.data.bio }}
          </h3>
          <div v-if="band.data.biotagline">
            <h3 class="text-[16px] mx-auto max-w-3xl text-center text-white md:text-2xl leading-tight whitespace-pre-line mt-0">
              {{ band.data.biotagline }}
            </h3>
          </div>
        </div>
      </div>

      <div class="w-full px-6 mt-4 md:max-w-[80vw] md:mx-auto">
        <div class="pt-0 sm:p-5">

          <!-- Featured Song Section -->
          <div v-if="band.data.singlesong && (band.data.singlesong.embedUrl || band.data.singlesong.song)">
            <h1 class="text-2xl mb-1 md:text-3xl font-bold text-white md:my-4">Featured Song</h1>
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
                :placeholderImage="'/placeholder-image.svg'"
              />
            </div>
          </div>

          <!-- Featured Video Section -->
          <div v-if="band.data.singlevideo && band.data.singlevideo.youtubeid" class="relative w-full max-w-[600px] mr-auto">
            <h1 class="text-2xl my-10 md:text-3xl font-bold text-white md:my-10">Featured Video</h1>
            <div v-if="!isVideoPlaying" class="relative cursor-pointer mb-10" @click="playVideo">
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

        </div>
      </div>

      <div class="h-40 flex justify-center items-center">
        <img src="@/assets/musicbizlogo.png" class="h-12" />
      </div>
    </div>
  </div>
</template>


<script setup>
console.log("slug page triggered");

import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRuntimeConfig } from "#imports";
import { useBeacon } from "@/composables/useBeacon"; // <-- Added import for beacon tracking
import YouTube from "vue3-youtube";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs } from "swiper/modules";
import { EffectCards } from "swiper/modules";
import scrollDownVideo from "@/assets/scrolldown.webm";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/effect-cards";

const loading = ref(true);

// const extractYouTubeId = (url) => {
//   // Check if URL is an embed URL (https://www.youtube.com/embed/...)
//   const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
//   if (embedMatch) {
//     return embedMatch[1];
//   }

//   // Check if URL is a watch URL (https://www.youtube.com/watch?v=...)
//   const watchMatch = url.match(/[?&]v=([^&]+)/);
//   if (watchMatch) {
//     return watchMatch[1];
//   }

//   return null; // Return null if the URL is not valid
// };

const generateThumbnailUrl = (videoId) => {
  console.log(
    "get video idfdssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
    videoId
  );
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return "";
};

const generateEmbedUrl = (videoId) => {
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return "";
};

const handleVideoUrl = (inputUrl) => {
  const videoId = extractYouTubeId(inputUrl);
  console.log("fsdfasdsadfsadfsadfsadfsadfsadfsadfkjsadkjfhasdlkfjhsad");
  if (!videoId) {
    console.error("Invalid YouTube URL");
    return; // Handle invalid URL case (e.g., show an error message)
  }

  const thumbnailUrl = generateThumbnailUrl(videoId);
  const embedUrl = generateEmbedUrl(videoId);

  console.log("Video ID:", videoId);
  console.log("Thumbnail URL:", thumbnailUrl);
  console.log("Embed URL:", embedUrl);

  return { thumbnailUrl, embedUrl };
};

const { trackClick } = useBeacon(); // <-- Extract trackClick from composable
const handleClick = (bandId, platform, destinationUrl) => {
  trackClick(bandId, platform, destinationUrl);
};

const { find } = useStrapi();
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

const videoUrl = ref("");
const thumbnailUrl = ref("");
const embedUrl = ref("");

const processVideoUrl = () => {
  const { thumbnailUrl: tUrl, embedUrl: eUrl } = handleVideoUrl(videoUrl.value);
  thumbnailUrl.value = tUrl;
  embedUrl.value = eUrl;
};
const toggleBio = () => {
  isExpanded.value = !isExpanded.value;
};
const formattedBio = computed(() => {
  return band?.data?.attributes?.bio ? band.data.bio.split(/\n+/) : [];
});
const isVideoPlaying = ref(false);
function extractYouTubeId(url) {
  console.log("this is the url  ", url);
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  console.log(
    match ? match[1] : url,
    "fdsfsddskljlkjsfadlkjhasdflkjhasdfkljhsdaflkhjhlfsadhkljsadfhkljsdfahkasdf"
  );
  return match ? match[1] : url;
}

const singleVideoId = computed(() => {
  const videoData = band.value?.data?.singlevideo;
  return videoData?.youtubeid ? extractYouTubeId(videoData.youtubeid) : "";
});
const singleVideoThumbnail = computed(() => {
  return singleVideoId.value
    ? `https://img.youtube.com/vi/${singleVideoId.value}/hqdefault.jpg`
    : "";
});

const singleVideoEmbedUrl = computed(() => {
  const watchUrl = band.value?.data?.singlevideo?.youtubeid;
  if (watchUrl) {
    const match = watchUrl.match(/[?&]v=([^&]+)/);
    console.log(match);
    if (match) {
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  }
  return ""; // Return an empty string if no valid URL is found
});

function convertToEmbedUrl(watchUrl) {
  const match = watchUrl.match(/[?&]v=([^&]+)/);
  if (match) {
    const videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null; // If the URL is not valid or doesn't match the YouTube format
}

console.log(
  singleVideoThumbnail,
  " fdsfdslkfj;lakjfsadl;kjf;lasdkjfl;askj  ;lkjasdf;lkjasdf ;lkjsadfl;kj l;asdkjfdsa;lkj"
);
const playerOptions = {
  autoplay: 1,
  rel: 0,
  modestbranding: 1,
};
const playVideo = () => {
  isVideoPlaying.value = true;
};
// const playVideo = (videoId) => {
//   playingVideos.value[videoId] = true;
// };
const getYouTubeThumbnail = (youtubeVideo) => {
  const url = youtubeVideo.videoid;
  const videoIdMatch =
    url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : url;
  return {
    videoId,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
};

const slug = computed(() => route.params.slug?.toLowerCase() ?? ""); // Debug

const fetchBandData = async () => {
  const apiUrl = useRuntimeConfig().public.strapiUrl;
  const response = await fetch(
    `${apiUrl}/api/bands/slug/${route.params.slug?.toLowerCase() ?? ""}?` + // ✅ Correct endpoint
      "populate[events][populate]=image&" +
      "populate[tours][populate]=*&" +
      "populate[albums][populate]=cover,songs.file&" +
      "populate[singlesong][populate][song]=*&" +
      "populate[singlesong][populate][cover]=*&" +
      "populate[singlevideo]=*&" +
      "populate=bandImg"
  );

  const data = await response.json();

  if (response.status === 404) {
    console.error("Band not found for slug:", route.params.slug);
    band.value = null;
    return;
  }

  console.log("Fetched band data by slug:", data);

  // ✅ Update data parsing to match the API response
  if (data?.data) {
    band.value = data;
    albums.value = band.value?.data?.albums || [];
    events.value = band.value?.data?.events || [];
    tours.value = band.value?.data?.tours || [];

    if (albums.value.length > 0) {
      setAlbum(albums.value[0].id);
    }
  }
  loading.value = false;
};

const setAlbum = (id) => {
  const album = albums.value.find((album) => album.id === id);
  if (album) {
    albumPlay.value = album;
  }
};
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
import deezerIcon2 from "@/assets/dezzer.svg";
import soundcloudIcon2 from "@/assets/soundcloudlast.png";
import bandcampIcon2 from "@/assets/bandcamp.svg";
import tiktokIcon from "@/assets/tiktok.png";
import twitterIcon from "@/assets/twitter.png";
const socialPlatforms = [
  { name: "facebook", img: facebookIcon, label: "Facebook" },
  { name: "instagram", img: instagramIcon, label: "Instagram" },
  { name: "twitter", img: twitterIcon, label: "Twitter" },
  { name: "tiktok", img: tiktokIcon, label: "Tiktok" },
];
const streamingPlatforms = [
  { name: "youtube", img: youtubeIcon, label: "YouTube" },
  { name: "youtube", img: youtubeMusicIcon, label: "YouTube Music" },
  { name: "spotify", img: spotifyIcon, label: "Spotify" },
  { name: "appleMusic", img: appleMusicIcon, label: "Apple Music" },
  { name: "reverbnation", img: reverbnationIcon, label: "Reverbnation" },
  { name: "soundcloud", img: soundcloudIcon2, label: "SoundCloud" },
  { name: "bandcamp", img: bandcampIcon2, label: "Bandcamp" },
  { name: "twitch", img: twitchIcon, label: "Twitch" },
  { name: "deezer", img: deezerIcon2, label: "Deezer" },
];
const formatSingleSong = (song) => {
  console.log("Formatting song data:", song);
  if (!song) return null;

  return {
    id: song.id || null,
    attributes: {
      isEmbeded: song.isEmbeded || false,
      title: song.title || "Unknown Title",
      embedUrl: song.embedUrl || "",
      file: {
        data: {
          attributes: {
            url: song.song?.url || null, // ✅ Fix here: Access the correct file URL
          },
        },
      },
      duration: song.duration || 0,
      cover: song.cover?.data || null,
      artist: band.value?.data?.name || "Unknown Artist", // ✅ Fix: `name` is at the root level, not in `attributes`
    },
  };
};

onMounted(async () => {
  document.body.classList.add("custom-page-body");
  await fetchBandData();
  // await fetchVideos();
});
onBeforeUnmount(() => {
  document.body.classList.remove("custom-page-body");
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
  padding-top: 56.25%;
  /* Aspect ratio for 16:9 */
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
