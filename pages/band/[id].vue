<template>
  <div v-if="band && band.data" class="bg-[#000] w-screen mx-auto">
    <!-- <pre class="text-white" >{{ band }}</pre> -->
    <!-- Hero Section -->
    <!-- Image Container -->
    <div class="relative w-full h-[35vh] md:h-[60vh]">
      <img
        v-if="band.data.bandImg"
        class="absolute inset-0 w-auto m-auto h-[35vh] md:h-2/3 object-cover"
        :src="band.data.bandImg.url"
        alt="Band Image"
      />
      <!-- Optional overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-0"></div>
    </div>

    <!-- Band Name Below the Image -->
    <div
      v-if="band.data.isBandNameInLogo === false"
      class="text-center text-white text-4xl font-bold mt-4"
    >
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
          <!-- change text  -->
          <h3
            class="text-[16px] mx-auto max-w-3xl text-center text-white md:text-2xl leading-tight whitespace-pre-line mt-0"
          >
            {{ band.data.biotagline }}
          </h3>
        </div>
      </div>
    </div>

    <!-- Band Page Content -->

    <div class="w-full px-6 mt-4 md:max-w-[80vw] md:mx-auto">
      <div class="pt-0 sm:p-5">
        <!-- singlesong section -->
        <div v-if="band.data.singlesong">
          <h1 class="text-2xl mb-1 md:text-3xl font-bold text-white md:my-4">
            Featured Song  
          </h1>
       

          <!-- If the singlesong is marked as embedded and has an embedUrl, render the embed -->
          <div
            v-if="
              band.data.singlesong.isEmbeded &&
              band.data.singlesong.embedUrl
            "
          >
            <iframe
              :src="band.data.singlesong.embedUrl"
              frameborder="0"
              allowfullscreen
              class="w-full h-64 rounded-lg"
            ></iframe>
          </div>
          <!-- Otherwise, render the AudioPlayer component -->
          <div v-else>
            <AudioPlayer
              :album="formatSingleSong(band.data.singlesong)"
              :placeholderImage="'/placeholder-image.svg'"
            />
          </div>
        </div>

        <div v-if="band.data.singlevideo" class="my-16">
          <h1 class="text-2xl mb-1 md:text-3xl font-bold text-white md:my-4">
            Featured Video
          </h1>

          <div class="relative w-full max-w-[600px] mr-auto">
            <!-- Video Thumbnail & Play Button -->
            <div
              v-if="!isVideoPlaying"
              class="relative cursor-pointer"
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

            <!-- YouTube Player (Loads on Click) -->
            <div v-else class="relative w-full max-h-[300px] my-6">
              <YouTube
                :src="singleVideoId"
                :vars="playerOptions"
                class="w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>

        <!-- website link  -->
        <div v-if="band.data.websitelink" class="mt-4">
          <h1 class="text-2xl mb-1 md:text-3xl font-bold text-white md:mt-6">
            Website Link
          </h1>
          <a
            class="text-purple-500 text-xl"
            :href="band.data.websitelink"
          >
            <span :vif="band.data.websitelinktext">{{
              band.data.websitelinktext
            }}</span>
          </a>
        </div>

        <div>
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
                <!-- Custom Album Player Component -->
                <!-- Include your AudioPlayer component here -->
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

          <!-- Videos Section -->
          <div v-if="videoItems.length" class="my-16 mx-auto">
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
            <template
              v-for="platform in streamingPlatforms"
              :key="platform.name"
            >
              <span v-if="band.data[platform.name]">
                <!-- Added click handler to track outbound clicks -->
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
          </div>

          <!-- Social Media -->
          <div class="w-full md:w-[100%] md:mx-auto mt-10">
            <h1 class="text-2xl mb-4 font-bold text-white md:text-3xl">
              Social Media
            </h1>
            <template v-for="platform in socialPlatforms" :key="platform.name">
              <span v-if="band.data[platform.name]">
                <!-- Added click handler to track outbound clicks -->
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
          </div>

          <!-- Events Section -->
          <div v-if="events.length" class="w-full mt-10">
            <h1 class="text-2xl md:text-3xl font-bold text-white mb-1">
              Events and Tours
            </h1>


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
                    class="border-b border-purple-500 border-opacity-20"
                  >
                    <td class="px-2 py-1 whitespace-nowrap text-left">
                      {{
                        new Date(
                          event.attributes.date ?? new Date()
                        ).toLocaleDateString()
                      }}
                    </td>
                    <td class="px-2 py-1 whitespace-nowrap text-left">
                      {{ event.attributes.city ?? "City not specified" }},
                      {{ event.attributes.state }}
                    </td>
                    <td class="px-2 py-1 whitespace-nowrap text-left">
                      {{ event.attributes.venue ?? "Venue not specified" }}
                    </td>
                    <td class="px-2 py-1 whitespace-nowrap text-left">
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
          </div>

          <!-- Tours Section -->
          <div v-if="tours.length" class="mt-10 mx-auto mb-10">
            <h1
              class="text-2xl sm:text-2xl md:text-3xl font-bold text-white my-16"
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
                  class="w-full h-[200px] md:h-72 object-cover rounded-md"
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
        </div>
      </div>
    </div>
    <!-- <Footer /> -->
    <div class="h-40 flex justify-center items-center">
      <img src="@/assets/musicbizlogo.png" class="h-12" />
    </div>
  </div>
</template>

<script setup>
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
const toggleBio = () => {
  isExpanded.value = !isExpanded.value;
};
const formattedBio = computed(() => {
  return band?.data?.attributes?.bio
    ? band.data.bio.split(/\n+/)
    : [];
});
const isVideoPlaying = ref(false);
function extractYouTubeId(url) {
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return match ? match[1] : url;
}
const singleVideoId = computed(() => {
  const videoData = band.value?.data?.attributes?.singlevideo;
  return videoData?.youtubeid ? extractYouTubeId(videoData.youtubeid) : "";
});
const singleVideoThumbnail = computed(() => {
  return singleVideoId.value
    ? `https://img.youtube.com/vi/${singleVideoId.value}/hqdefault.jpg`
    : "";
});
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
const fetchVideos = async () => {
  try {
    const response = await find("videos", {
      filters: {
        bands: {
          id: { $eq: route.params.id },
        },
      },
      populate: {
        mediayoutube: true,
        bandImg: true,
      },
    });
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
const fetchBandData = async () => {
  try {
    const apiUrl = useRuntimeConfig().public.strapiUrl;
    const response = await fetch(
      `${apiUrl}/api/bands/${route.params.id}?` +
        "populate[events][populate]=image&" +
        "populate[tours][populate]=*&" +
        "populate[albums][populate]=cover,songs.file&" +
        "populate[singlesong][populate]=song&" + // ✅ Ensure this field is populated
        "populate[singlesong][populate]=cover&" +
        "populate[singlevideo]=*&" +
        "populate=bandImg"
    );

    const data = await response.json();
    console.log("Fetched band data:", data);

    if (data && data.data) {
      band.value = data; // Assign data to band
    } else {
      console.error("No band data found.");
    }
  } catch (error) {
    console.error("Error fetching band data:", error);
  }
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
</style>
