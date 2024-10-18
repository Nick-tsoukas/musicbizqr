<template>
  <div class="max-w-full mx-auto p-4">
    <!-- Hero Section -->
    <div v-if="videoItems.length" class="relative bg-black text-white rounded-lg overflow-hidden mb-8">
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
        <p class="mt-2 text-lg md:text-xl text-white">Explore videos by {{ videoItems[0].title }}</p>
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
        <div class="'flex justify-center items-center'  lg:grid lg:grid-cols-3 gap-6'">
          <div v-for="(thumbnail, index) in video.youtubeThumbnails" :key="index" class="relative mb-4 rounded-lg overflow-hidden">
            <!-- Responsive YouTube iframe with correct aspect ratio for mobile and larger screens -->
            <div class="relative w-full h-auto pb-56.25 sm:w-96 sm:pb-56.25 lg:pb-56.25">
              <YouTube  
                :src="thumbnail.videoId"
                class="absolute top-0 left-0 w-10 h-auto rounded-md"
                :autoplay="false"
              />
            </div>
            <h4 class="text-white font-semibold mt-4">{{ video.title }}</h4>
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
const { findOne } = useStrapi();
const route = useRoute();

const apiReady = ref(false);

// Function to dynamically load the YouTube API
const loadYouTubeAPI = () => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      // YT is already defined
      resolve();
    } else {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(scriptTag);
      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };
    }
  });
};

// Helper function to extract YouTube ID
const getYouTubeThumbnail = (url) => {
  const videoId = url.split('?v=')[1] || url.split('/').pop(); 
  return {
    videoId,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
};

const fetchVideos = async () => {
  try {
    const response = await findOne('videos', route.params.id, {
      populate: {
        youtubevideos: true, 
        bandimg: true, 
      },
    });

    videoItems.value = [
      {
        id: response.id,
        title: response.data.attributes.bandname || 'No Band Name',
        bandlink: response.data.attributes.bandlink || '',
        bandimgUrl:
          response.data.attributes.bandimg?.data?.attributes?.formats?.large?.url ||
          response.data.attributes.bandimg?.data?.attributes?.url || '',
        youtubeThumbnails: response.data.attributes.youtubevideos?.map((youtubeVideo) => {
          return getYouTubeThumbnail(youtubeVideo.youtube);
        }) || [],
      },
    ];
  } catch (error) {
    console.error('Error fetching videos:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchVideos();
  await loadYouTubeAPI();
  apiReady.value = true;
  
});
</script>
<style scoped>
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  width: 100%;
}

.video-container iframe,
.video-container object,
.video-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Adjustments for mobile screens */
@media (max-width: 640px) {
  .video-container {
    padding-bottom: 56.25%; /* Keep 16:9 on mobile as well */
    height: 0;
  }

  .grid {
    grid-template-columns: 1fr !important; /* Ensure single column on mobile */
  }
}
</style>





