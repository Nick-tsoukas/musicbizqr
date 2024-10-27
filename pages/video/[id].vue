<template>
  <div class="max-w-full mx-auto p-4">
    <!-- Hero Section -->
    <div
      v-if="videoItems.length"
      class="relative bg-black text-white rounded-lg overflow-hidden mb-8"
    >
      <img
        v-if="videoItems[0].bandimgUrl"
        :src="videoItems[0].bandimgUrl"
        alt="Band Image"
        class="w-full h-64 object-cover opacity-50"
      />
      <div class="absolute inset-0 flex flex-col justify-center items-center p-6">
        <h1 class="text-4xl md:text-6xl font-bold text-white drop-shadow-md text-center">
          {{ videoItems[0].title }}
        </h1>
        <p class="mt-2 text-lg md:text-xl text-white">
          Explore videos by {{ videoItems[0].title }}
        </p>
      </div>
    </div>

    <!-- Video Grid -->
    <div v-if="videoItems.length">
      <div
        v-for="video in videoItems"
        :key="video.id"
        class="bg-black p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <!-- Responsive Video Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(thumbnail, index) in video.youtubeThumbnails"
            :key="index"
            class="relative mb-4 rounded-lg overflow-hidden"
          >
            <div v-if="playingVideos[thumbnail.videoId]">
              <!-- Show YouTube iframe -->
              <div class="relative aspect-video">
                <YouTube
                  :src="`https://www.youtube.com/watch?v=${thumbnail.videoId}`"
                  :opts="playerOptions"
                   width="100%"
                   height="100%"
                  class="absolute top-0 left-0 w-full h-full rounded-md"
                />
              </div>
            </div>
            <div v-else>
              <!-- Show thumbnail image -->
              <div
                class="relative aspect-video cursor-pointer"
                @click="playVideo(thumbnail.videoId)"
              >
                <img
                  :src="thumbnail.thumbnailUrl"
                  alt="Video Thumbnail"
                  class="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                />
                <!-- Play button overlay -->
                <div class="absolute inset-0 flex items-center justify-center">
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
              <h4 class="text-white font-semibold mt-4"> {{ videoMetadata[thumbnail.videoId] || 'Loading...' }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="text-white text-center">
      <p>No videos found. Please check back later.</p>
    </div>
  </div>
</template>

<script setup>

import YouTube from 'vue3-youtube';

const loading = ref(true);
const videoItems = ref([]);
const playingVideos = ref({});
const videoMetadata = ref({}); // Store metadata for videos
const { findOne } = useStrapi();
const route = useRoute();

const playerOptions = {
  playerVars: {
    autoplay: 1,
    rel: 0,
    modestbranding: 1,
    // Add other player variables as needed
  },
};

const getYouTubeThumbnail = (youtubeVideo) => {
  const url = youtubeVideo.youtube;
  let videoId = '';

  const videoIdMatch = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  if (videoIdMatch && videoIdMatch[1]) {
    videoId = videoIdMatch[1];
  } else {
    videoId = url.split('/').pop();
  }

  return {
    videoId,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    title: youtubeVideo.title || 'No Title',
  };
};

const fetchVideoMetadata = async (videoId) => {
  try {
    const response = await $fetch(`/api/get-video-metadata?id=${videoId}`);
    if (response.title) {
      videoMetadata.value[videoId] = response.title;
    } else {
      console.error(`Error fetching metadata for video ID ${videoId}:`, response.error);
      videoMetadata.value[videoId] = 'Unknown Title';
    }
  } catch (error) {
    console.error(`Error fetching metadata for video ID ${videoId}:`, error);
    videoMetadata.value[videoId] = 'Unknown Title';
  }
};

const fetchVideos = async () => {
  try {
    const response = await findOne('videos', route.params.id, {
      populate: {
        youtubevideos: true,
        bandimg: true,
      },
    });

    const thumbnails =
      response.data.attributes.youtubevideos?.map((youtubeVideo) => {
        return getYouTubeThumbnail(youtubeVideo);
      }) || [];

    // Fetch metadata for each video
    await Promise.all(
      thumbnails.map(async (thumbnail) => {
        await fetchVideoMetadata(thumbnail.videoId);
      })
    );

    videoItems.value = [
      {
        id: response.id,
        title: response.data.attributes.bandname || 'No Band Name',
        bandlink: response.data.attributes.bandlink || '',
        bandimgUrl:
          response.data.attributes.bandimg?.data?.attributes?.formats?.large?.url ||
          response.data.attributes.bandimg?.data?.attributes?.url ||
          '',
        youtubeThumbnails: thumbnails,
      },
    ];
  } catch (error) {
    console.error('Error fetching videos:', error);
  } finally {
    loading.value = false;
  }
};

const playVideo = (videoId) => {
  playingVideos.value[videoId] = true;
};

onMounted(async () => {
  await fetchVideos();
});
</script>


<style scoped>
/* No additional styles needed */
</style>

