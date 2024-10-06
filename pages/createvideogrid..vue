<template>
  <div class="bg-[#000] w-[90vw] mx-auto">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div class="container-mdc bg-black max-w-5xl">
      <h1 class="title text-white">Create Video Grid</h1>

      <form class="form-group" @submit.prevent="submitForm">
        <!-- Video Title -->
        <div class="bg-[#fff] rounded-md">
          <div class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
            <h2 class="font-semibold text-2xl text-white">Video Title</h2>
          </div>
          <div class="p-4">
            <div class="mdc-text-field mb-4">
              <input type="text" id="videoTitle" class="mdc-text-field__input" v-model="videoTitle" placeholder=" " />
              <label class="mdc-floating-label" for="videoTitle">Video Title</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Video Embed Links Section -->
        <div class="bg-[#fff] rounded-md mt-4">
          <div class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
            <h2 class="font-semibold text-2xl text-white">Embed Video Links</h2>
          </div>
          <div class="p-4">
            <!-- YouTube -->
            <div class="mdc-text-field mb-4">
              <input type="url" id="youtube" class="mdc-text-field__input" v-model="youtube" placeholder=" " />
              <label class="mdc-floating-label" for="youtube">YouTube Link</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Vimeo -->
            <div class="mdc-text-field mb-4">
              <input type="url" id="vimeo" class="mdc-text-field__input" v-model="vimeo" placeholder=" " />
              <label class="mdc-floating-label" for="vimeo">Vimeo Link</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Twitch -->
            <div class="mdc-text-field mb-4">
              <input type="url" id="twitch" class="mdc-text-field__input" v-model="twitch" placeholder=" " />
              <label class="mdc-floating-label" for="twitch">Twitch Link</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Facebook -->
            <div class="mdc-text-field mb-4">
              <input type="url" id="facebook" class="mdc-text-field__input" v-model="facebook" placeholder=" " />
              <label class="mdc-floating-label" for="facebook">Facebook Video Link</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

    

        <button type="submit" class="mdc-button w-full mt-10">Create Video Grid</button>
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
const youtube = ref('');
const vimeo = ref('');
const twitch = ref('');
const facebook = ref('');
const img = ref(null);
const imgUrl = ref(null);
const loading = ref(false);

// Image upload handler
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  img.value = file;
  imgUrl.value = URL.createObjectURL(file);
};

// Form submission handler
const submitForm = async () => {
  try {
    loading.value = true;

    // Create the form object for video data
    const form = {
      title: videoTitle.value || null,
      youtube: youtube.value || null,
      vimeo: vimeo.value || null,
      twitch: twitch.value || null,
      facebook: facebook.value || null,
      users_permissions_user: user.value.id, // Add the current user's ID
    };

    // Remove null or empty values from the form object
    for (const key in form) {
      if (!form[key]) {
        delete form[key];
      }
    }

    // Initialize FormData
    const formData = new FormData();
    formData.append('data', JSON.stringify(form));

    // Append the image if available
    if (img.value) {
      formData.append('files.thumbnail', img.value);
    }

    // Submit the form using Strapi client
    const { data: videoData } = await client('/videos', {
      method: 'POST',
      body: formData,
    });

    console.log('Video created successfully:', videoData);
    router.push('/dashboard'); // Redirect to dashboard or another page
  } catch (error) {
    loading.value = false;
    console.error('Error creating video:', error);
  }
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.container-mdc {
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #fff;
}

.mdc-text-field {
  position: relative;
  margin-bottom: 1.5rem;
  display: inline-block;
  width: 100%;
}

.mdc-text-field__input {
  font-size: 1rem;
  padding: 0.75rem 0.5rem;
  border: 1px solid #000;
  border-radius: 10px;
  outline: none;
  width: 100%;
}

.mdc-floating-label {
  position: absolute;
  z-index: 99999;
  top: 0.75rem;
  left: 0.5rem;
  padding-left: 0.2em;
  padding-right: 0.2em;
  font-size: 1rem;
  background: white;
  line-height: 1;
  color: #aaa;
  pointer-events: none;
  transition: transform 0.2s, color 0.2s;
}

.mdc-text-field__input:focus + .mdc-floating-label,
.mdc-text-field__input:not(:placeholder-shown) + .mdc-floating-label {
  transform: translateY(-1.5rem);
  color: #6200ee;
}

.mdc-line-ripple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #6200ee;
  transform: scaleX(0);
  transition: transform 0.2s;
}

.mdc-text-field__input:focus ~ .mdc-line-ripple {
  transform: scaleX(1);
}

.mdc-button {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #fff;
  background-color: #2c2c2c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mdc-button:hover {
  background-color: #3700b3;
}

.styled-file-input {
  display: none;
}

.styled-file-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #fff;
  background-color: #2c2c2c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
}

.styled-file-label:hover {
  background-color: #3700b3;
}
</style>
