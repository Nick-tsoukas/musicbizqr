<template>
  <div class="bg-[#000] w-[90vw] mx-auto">
    <!-- Video Creation Form -->
    <div class="mx-auto bg-black max-w-5xl">
      <h1 class="text-3xl mb-6 font-bold text-white">Create Video</h1>

      <form class="form-group" @submit.prevent="submitForm">
        <!-- Video Title -->
        <div class="bg-[#fff] rounded-md">
          <div class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
            <h2 class="font-semibold text-2xl text-white">Video Title</h2>
          </div>
          <div class="p-4">
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="videoTitle"
                class="mdc-text-field__input"
                v-model="videoTitle"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="videoTitle">Video Title</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Embed YouTube Videos Section -->
        <div class="bg-[#fff] rounded-md mt-4">
          <div class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
            <h2 class="font-semibold text-2xl text-white">Embed YouTube Video Links</h2>
          </div>
          <div class="p-4">
            <div v-for="(youtubeVideo, index) in youtubevideos" :key="index" class="mb-4 p-4 rounded-md">
              <div class="mdc-text-field mb-4">
                <input
                  type="url"
                  class="mdc-text-field__input"
                  v-model="youtubeVideo.youtube" 
                  placeholder="Paste YouTube Video URL"
                  required
                />
                <label class="mdc-floating-label">YouTube Video URL</label>
                <div class="mdc-line-ripple"></div>
              </div>

              <!-- Display YouTube Thumbnail -->
              <div v-if="getYouTubeVideoId(youtubeVideo.youtube)">
                <img
                  :src="`https://img.youtube.com/vi/${getYouTubeVideoId(youtubeVideo.youtube)}/hqdefault.jpg`"
                  alt="YouTube Thumbnail"
                  class="w-full h-auto mb-4"
                />
              </div>

              <button type="button" class="mdc-button bg-red-600" @click="removeYouTubeVideo(index)">Remove</button>
            </div>
            <button type="button" class="mdc-button bg-blue-600" @click="addYouTubeVideo">Add New YouTube Video</button>
          </div>
        </div>

        <!-- Band Image Section -->
        <div class="bg-[#fff] rounded-md mt-4">
          <div class="p-4">
            <input type="file" @change="handleImageUpload" class="styled-file-input" id="fileUpload" />
            <label for="fileUpload" class="styled-file-label">Upload Band Image</label>
            <div v-if="imgUrl" class="mt-4">
              <img :src="imgUrl" alt="Preview" class="w-48 h-48 object-cover rounded-lg" />
            </div>
          </div>
        </div>

        <!-- Band Information Section -->
        <div class="bg-[#fff] rounded-md mt-4">
          <div class="p-4">
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="bandname"
                class="mdc-text-field__input"
                v-model="bandname"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="bandname">Band Name</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="bandlink"
                class="mdc-text-field__input"
                v-model="bandlink"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="bandlink">Band Link</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <button type="submit" class="mdc-button w-full mt-10">Create Video</button>
      </form>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const client = useStrapiClient();
const user = useStrapiUser();

// Form variables
const videoTitle = ref('');
const bandname = ref('');
const bandlink = ref('');
const youtubevideos = ref([{ youtube: '' }]); // Initialize with one empty embed
const img = ref(null);
const imgUrl = ref(null);
const loading = ref(false);

// Add a new YouTube video field
const addYouTubeVideo = () => {
  youtubevideos.value.push({ youtube: '' });
};

// Remove a YouTube video field
const removeYouTubeVideo = (index) => {
  youtubevideos.value.splice(index, 1);
};

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|youtube\.com\/v\/|youtube\.com\/embed\/|youtube\.com\/watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Image upload handler
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  img.value = file;
  imgUrl.value = URL.createObjectURL(file);
};

// Submit form and send data to Strapi
const submitForm = async () => {
  try {
    loading.value = true;

    // Prepare the form object for video data
    const form = {
      title: videoTitle.value || null,
      bandname: bandname.value || null,
      bandlink: bandlink.value || null,
      youtube: youtubevideos.value
        .filter(video => video.youtube.trim() !== '')
        .map(video => ({
          video: video.youtube.trim() // Directly use the full URL
        })),
      users_permissions_user: user.value.id,
    };

    // Initialize FormData for files (band image)
    const formData = new FormData();
    formData.append('data', JSON.stringify(form));

    if (img.value) {
      formData.append('files.bandImg', img.value); // Use the correct field name for the image
    }

    // Submit the form
    const { data: videoData } = await client('/videos', {
      method: 'POST',
      body: formData,
    });

    console.log('Video created successfully:', videoData);
    router.push('/dashboard'); // Redirect after successful submission
  } catch (error) {
    loading.value = false;
    console.error('Error creating video:', error);
  }
};

</script>
