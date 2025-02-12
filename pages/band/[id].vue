<template>
  <div v-if="band && band.data" class="bg-[#000] w-screen mx-auto">
    <!-- Hero Section -->
    <div class="relative w-full h-[80vh]">
      <img
        class="absolute inset-0 w-auto m-auto h-2/3 object-cover"
        :src="band.data.attributes.bandImg.data.attributes.url"
        alt="Band Image"
      />
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute bg-black bottom-0 p-6 left-0 w-full text-center">
        <h1 class="text-white text-5xl md:text-6xl font-bold tracking-tight">
          {{ band.data.attributes.name }}
        </h1>
      </div>
    </div>

    <!-- Band Page Content -->
    <div class="w-full px-6 md:max-w-[80vw] md:mx-auto">
      <div class="pt-0 sm:p-5">
        <div>
          <!-- Bio Section -->
          <div v-if="band.data.attributes.bio">
            <h1 class="text-4xl my-4 md:text-4xl font-bold text-white md:mb-16 mt-8">
              Bio
            </h1>
            <p class="text-white text-lg whitespace-pre-wrap leading-relaxed">
              {{ isExpanded ? band.data.attributes.bio : truncatedBio }}
            </p>
            <button
              @click="toggleBio"
              class="text-purple-400 mt-4 font-semibold border-1 border-white"
            >
              {{ isExpanded ? "Read Less" : "Read More" }}
            </button>
          </div>

          <!-- singlesong section -->
          <div v-if="band.data.attributes.singlesong">
            <h1 class="text-lg my-4 md:text-4xl font-bold text-white md:my-16">
              Single
            </h1>
            <AudioPlayer
              :album="formatSingleSong(band.data.attributes.singlesong)"
              :placeholderImage="'/placeholder-image.svg'"
            />
          </div>

          <!-- Albums Section -->
          <div v-if="albums.length > 0">
            <h1 class="text-lg my-4 md:text-4xl font-bold text-white md:my-16">
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
            <!-- bio section -->

            <div v-if="band.data.attributes.bio">
              <h1
                class="text-lg my-4 md:text-4xl font-bold text-white md:my-16"
              >
                Bio
              </h1>
              <p class="text-white">{{ band.data.attributes.bio }}</p>
            </div>

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
                <!-- Custom Album Player Component -->
                <!-- Include your AudioPlayer component here -->
                <AudioPlayer :album="albumPlay" />
              </div>
              <div
                v-else-if="albumPlay.attributes.type === 'streaming'"
                class="w-full md:w-[70%] mx-0"
              >
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
            <h1
              class="text-4xl sm:text-5xl md:text-4xl font-bold text-white my-16"
            >
              Events
            </h1>
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
                  <h3 class="text-xl md:text-2xl text-white font-bold mb-2">
                    {{ event.attributes.title }}
                  </h3>
                  <p class="text-white text-sm">
                    {{
                      new Date(
                        event.attributes.date ?? new Date()
                      ).toLocaleDateString()
                    }}
                  </p>
                  <p class="text-white text-sm">
                    {{ event.attributes.venue ?? "Venue not specified" }}
                  </p>
                  <p class="text-white text-sm">
                    {{ event.attributes.city ?? "City not specified" }}
                  </p>
                  <button
                    @click="router.push(`/event/${event.id}`)"
                    class="mdc-button-green mt-2 w-full"
                  >
                    View Event
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tours Section -->
          <div v-if="tours.length" class="mt-10 mx-auto">
            <h1
              class="text-4xl sm:text-5xl md:text-4xl font-bold text-white my-16"
            >
              Tours
            </h1>
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
                  <button
                    @click="router.push(`/tour/${tour.id}`)"
                    class="mdc-button-green mt-2 w-full"
                  >
                    View Tour
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Videos Section -->
          <div v-if="videoItems.length" class="mt-10 mx-auto">
            <h1
              class="text-4xl sm:text-5xl md:text-4xl font-bold text-white my-16"
            >
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
          <div
            class="flex flex-col gap-6 justify-start md:px-4 w-full md:w-[100%] md:mx-auto mt-16"
          >
            <h2 class="text-4xl my-10 font-bold text-white">Streaming Links</h2>
            <template
              v-for="platform in streamingPlatforms"
              :key="platform.name"
            >
              <span v-if="band.data.attributes[platform.name]">
                <a
                  :href="band.data.attributes[platform.name]"
                  target="_blank"
                  rel="noopener"
                >
                  <button
                    class="w-full custom-border text-white text-xl flex justify-center font-semibold px-4 py-4 items-center relative shadow-lg rounded-md"
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
        </div>
        
        <div
        class="flex flex-col gap-6 justify-start md:px-4 w-full md:w-[100%] md:mx-auto mt-16"
      >
      <h2 class="text-4xl my-6 font-bold text-white">Social</h2>

        <div class=" flex items-center justify-between w-full bg-[#000] mb-10">
          <div class="flex flex-wrap items-center justify-between gap-5">
            <!-- Social Media Platforms -->
            <template v-for="platform in socialPlatforms" :key="platform.name">
              <a
                v-if="band.data.attributes[platform.name]"
                :href="band.data.attributes[platform.name]"
                :aria-label="`Find us on ${platform.label}`"
                target="_blank"
                rel="noopener"
              >
                <img
                  :src="platform.img"
                  :alt="platform.label"
                  class="h-10 w-10"
                />
              </a>
            </template>
          </div>
        </div>
      </div>
      </div>

      <!-- Social Media Links -->
     
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

import YouTube from "vue3-youtube";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs } from "swiper/modules";
import { EffectCards } from "swiper/modules";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/effect-cards";

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

const toggleBio = () => {
  isExpanded.value = !isExpanded.value;
};

const playerOptions = {
  autoplay: 1,
  mute: 1,
  rel: 0,
  modestbranding: 1,
};

// Function to play video
const playVideo = (videoId) => {
  playingVideos.value[videoId] = true;
};

// Function to extract YouTube video ID and create a thumbnail URL
const getYouTubeThumbnail = (youtubeVideo) => {
  const url = youtubeVideo.videoid; // Assuming 'videoid' is the attribute name
  const videoIdMatch =
    url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : url; // Use the URL directly if no match
  return {
    videoId,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
};

// Fetch videos associated with the band
const fetchVideos = async () => {
  try {
    const response = await find("videos", {
      filters: {
        bands: {
          id: {
            $eq: route.params.id,
          },
        },
      },
      populate: {
        mediayoutube: true,
        bandImg: true,
      },
    });

    // Map video data for displaying
    videoItems.value = response.data.map((videoData) => {
      const thumbnails = videoData.attributes.mediayoutube.map(
        (youtubeVideo) => {
          const thumbnailData = getYouTubeThumbnail(youtubeVideo);
          console.log("Extracted Video ID:", thumbnailData.videoId);
          return thumbnailData;
        }
      );

      return {
        id: videoData.id,
        title: videoData.attributes.bandname || "No Band Name",
        bandlink: videoData.attributes.bandlink || "",
        bandimgUrl: videoData.attributes.bandImg?.data?.attributes?.url || "",
        youtubeThumbnails: thumbnails,
      };
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
};

// Function to fetch band data
const fetchBandData = async () => {
  const apiUrl = useRuntimeConfig().public.strapiUrl;

  const response = await fetch(
    `${apiUrl}/api/bands/${route.params.id}?` +
      "populate[events][populate]=image&" +
      "populate[tours][populate]=*&" +
      "populate[albums][populate]=cover,songs.file&" +
      "populate[singlesong][populate][song]=*&" +
      "populate[singlesong][populate][cover]=*&" +
      "populate=bandImg"
  );

  const data = await response.json();
  console.log("Fetched band data:", data);
  band.value = data;

  // Debug log
  console.log("Single song data:", band.value?.data?.attributes?.singlesong);

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
};

// Function to set the current album
const setAlbum = (id) => {
  const album = albums.value.find((album) => album.id === id);
  if (album) {
    albumPlay.value = album;
  }
};

// Import social media icons
import facebookIcon from "@/assets/fbwhite.svg";
import instagramIcon from "@/assets/whiteinstagram.svg";
import twitchIcon from "@/assets/whitetwitch.svg";
import appleMusicIcon from "@/assets/apple.svg";
import soundcloudIcon from "@/assets/whitesoundcloud.svg";
import deezerIcon from "@/assets/whitedeezer.svg";
import youtubeIcon from "@/assets/whiteyoutube.svg";
import bandcampIcon from "@/assets/whitebandcamp.svg";
import twitterIcon from "@/assets/whitetwitter.svg";

// Import streaming platform icons
import spotifyIcon from "@/assets/spotify.svg";
import youtubeMusicIcon from "@/assets/youtube-icon.svg";
import deezerIcon2 from "@/assets/dezzer.svg";
import soundcloudIcon2 from "@/assets/soundcloudlast.png";
import bandcampIcon2 from "@/assets/bandcamp.svg";

// Define social media platforms
const socialPlatforms = [
  { name: "facebook", img: facebookIcon, label: "Facebook" },
  { name: "instagram", img: instagramIcon, label: "Instagram" },
  { name: "twitch", img: twitchIcon, label: "Twitch" },
  { name: "youtube", img: youtubeIcon, label: "YouTube" },
  { name: "twitter", img: twitterIcon, label: "Twitter" },
];

// Define streaming platforms
const streamingPlatforms = [
  { name: "spotify", img: spotifyIcon, label: "Spotify" },
  { name: "youtube", img: youtubeMusicIcon, label: "YouTube Music" },
  { name: "deezer", img: deezerIcon2, label: "Deezer" },
  { name: "appleMusic", img: appleMusicIcon, label: "Apple Music" },
  { name: "soundcloud", img: soundcloudIcon2, label: "SoundCloud" },
  { name: "bandcamp", img: bandcampIcon2, label: "Bandcamp" },
];

// Add this function to format single song data
const formatSingleSong = (song) => {
  console.log("Formatting song data:", song); // Debug log

  if (!song) return null;

  return {
    id: song.id,
    attributes: {
      title: song.title,
      // The file is now under song.data.attributes
      file: {
        data: {
          attributes: {
            url: song.song?.data?.attributes?.url,
          },
        },
      },
      duration: song.duration || 0,
      cover: song.cover?.data || null,
      artist: band.value?.data?.attributes?.name || "Unknown Artist",
    },
  };
};

onMounted(async () => {
  document.body.classList.add("custom-page-body");
  await fetchBandData();
  await fetchVideos();
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
