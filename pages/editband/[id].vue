<template>
  <div class="bg-[#000] w-[90vw] mx-auto">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <!-- <pre class="text-white">{{ band }}</pre> -->
    <div class="container-mdc bg-black max-w-5xl">
      <h1 class="title text-black">Edit Band</h1>
      <form @submit.prevent="submitEditBand" class="rounded-md p-4">
        <div class="form-group">
          <!-- Band Details -->
          <div
            class="flex flex-col p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="text-white text-xl font-semibold">Band Details</h2>
          </div>
          <div class="bg-white p-10">
            <!-- Band Name -->
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="edit-band-name"
                class="mdc-text-field__input"
                v-model="band.name"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="edit-band-name">Band Name</label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Genre -->
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="edit-band-genre"
                class="mdc-text-field__input"
                v-model="band.genre"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="edit-band-genre">Genre</label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Bio -->
            <div class="mdc-text-field">
              <textarea
                id="edit-band-bio"
                class="mdc-text-field__input"
                v-model="band.bio"
                placeholder=" "
                required
              ></textarea>
              <label class="mdc-floating-label" for="edit-band-bio">Bio</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>

          <!-- Band Image Upload -->
          <div
            class="flex flex-col p-6 mt-10 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6"
          >
            <h3 class="font-semibold text-white text-xl">Upload Image</h3>
          </div>
          <div class="bg-white p-4">
            <div v-if="band.imageUrl" class="mb-4">
              <img
                :src="band.imageUrl"
                alt="Band Image"
                class="w-full h-auto rounded-lg shadow-md mb-4"
              />
            </div>
            <input
              type="file"
              id="edit-band-image"
              class="styled-file-input"
              @change="handleBandImageUpload"
              accept="image/*"
            />
            <label for="edit-band-image" class="styled-file-label w-full text-center"
              >Choose Band Image</label
            >
          </div>

          <!-- Social Media Links -->
          <div
            class="flex flex-col p-6 mt-10 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6"
          >
            <h3 class="font-semibold text-white text-xl">Social Media Links</h3>
          </div>
          <div class="bg-white p-4">
            <!-- Facebook -->
            <div class="mdc-text-field my-4">
              <input
                type="url"
                id="edit-band-facebook"
                class="mdc-text-field__input"
                v-model="band.facebook"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-facebook"
                >Facebook</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Instagram -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-instagram"
                class="mdc-text-field__input"
                v-model="band.instagram"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-instagram"
                >Instagram</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Twitch -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-twitch"
                class="mdc-text-field__input"
                v-model="band.twitch"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-twitch">Twitch</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Twitter -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-twitter"
                class="mdc-text-field__input"
                v-model="band.twitter"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-twitter"
                >Twitter</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- WhatsApp -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-whatsapp"
                class="mdc-text-field__input"
                v-model="band.whatsapp"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-whatsapp"
                >WhatsApp</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- TikTok -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-tiktok"
                class="mdc-text-field__input"
                v-model="band.tiktok"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-tiktok"
                >TikTok</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Snapchat -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-snapchat"
                class="mdc-text-field__input"
                v-model="band.snapchat"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-snapchat"
                >Snapchat</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
          </div>

          <!-- Streaming Links -->
          <div
            class="flex flex-col mt-10 p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h3 class="font-semibold text-white text-xl">Streaming Links</h3>
          </div>
          <div class="bg-white p-4">
            <!-- Apple Music -->
            <div class="mdc-text-field my-4">
              <input
                type="url"
                id="edit-band-appleMusic"
                class="mdc-text-field__input"
                v-model="band.appleMusic"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-appleMusic"
                >Apple Music</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Spotify -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-spotify"
                class="mdc-text-field__input"
                v-model="band.spotify"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-spotify"
                >Spotify</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- SoundCloud -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-soundcloud"
                class="mdc-text-field__input"
                v-model="band.soundcloud"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-soundcloud"
                >SoundCloud</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- YouTube -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-youtube"
                class="mdc-text-field__input"
                v-model="band.youtube"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-youtube"
                >YouTube</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Deezer -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-deezer"
                class="mdc-text-field__input"
                v-model="band.deezer"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-deezer"
                >Deezer</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Bandcamp -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-band-bandcamp"
                class="mdc-text-field__input"
                v-model="band.bandcamp"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-band-bandcamp"
                >Bandcamp</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
          </div>

          <!-- Single Song Section -->
          <div
            class="flex flex-col mt-10 p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6"
          >
            <h3 class="font-semibold text-white text-xl">Single Song</h3>
          </div>
          <div class="bg-white p-4">
            <!-- Song Title -->
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="edit-singlesong-title"
                class="mdc-text-field__input"
                v-model="band.singlesong.title"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-singlesong-title"
                >Song Title</label
              >
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Radio Buttons for Embed vs. File Upload -->
            <div class="mb-4">
              <label class="text-black mr-4">
                <input
                  type="radio"
                  v-model="band.singlesong.isEmbeded"
                  :value="true"
                />
                Use Embed
              </label>
              <label class="text-black">
                <input
                  type="radio"
                  v-model="band.singlesong.isEmbeded"
                  :value="false"
                />
                Upload File
              </label>
            </div>

            <!-- If isEmbeded is true, show embed URL input -->
            <div v-if="band.singlesong.isEmbeded" class="mdc-text-field mb-4">
              <input
                type="text"
                id="edit-singlesong-embedUrl"
                class="mdc-text-field__input"
                v-model="band.singlesong.embedUrl"
                placeholder=" "
              />
              <label
                class="mdc-floating-label"
                for="edit-singlesong-embedUrl"
                >Embed URL</label
              >
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Otherwise show file input -->
            <div v-else>
              <input
                type="file"
                id="edit-singlesong-file"
                class="styled-file-input"
                @change="handleSingleSongUpload"
                accept="audio/*"
              />
              <label
                for="edit-singlesong-file"
                class="styled-file-label w-full text-center"
                >Choose Single Song File</label
              >

              <!-- Show existing single song info if available -->
              <div v-if="band.singlesong?.song && !isSingleSongFile" class="mt-4">
                <p>
                  Current Song:
                  {{
                    band.singlesong.song.data?.attributes.name ||
                    band.singlesong.song.data?.attributes.url
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Single Video Section -->
          <div
            class="flex flex-col mt-10 p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6"
          >
            <h3 class="font-semibold text-white text-xl">Single Video</h3>
          </div>
          <div class="bg-white p-4">
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="edit-singlevideo-youtube"
                class="mdc-text-field__input"
                v-model="band.singlevideo.youtubeid"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="edit-singlevideo-youtube"
                >YouTube URL</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
          </div>

          <!-- Save Button -->
          <button type="submit" class="mdc-button w-full mt-10">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { findOne } = useStrapi();
const user = useStrapiUser();
const client = useStrapiClient();

const loading = ref(false);

// Tracks the band data
const band = ref({
  name: "",
  genre: "",
  bio: "",
  bandImg: null,
  imageUrl: null,
  facebook: "",
  instagram: "",
  twitch: "",
  twitter: "",
  whatsapp: "",
  tiktok: "",
  snapchat: "",
  appleMusic: "",
  spotify: "",
  soundcloud: "",
  youtube: "",
  deezer: "",
  bandcamp: "",
  // The component ID must be here if we want to preserve the same component
  singlesong: {
    id: null,
    title: "",
    song: null, // This can be an object from Strapi or a File
    embedUrl: "",
    isEmbeded: false,
  },
  singlevideo: {
    youtubeid: "",
  },
});

// If user uploads a *new* single-song file
const isSingleSongFile = ref(false);

// ---------- UPLOAD HANDLERS ----------

// Band image
const handleBandImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    band.value.bandImg = file;
    band.value.imageUrl = URL.createObjectURL(file);
  }
};

// SingleSong file
const handleSingleSongUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    band.value.singlesong.song = file;
    isSingleSongFile.value = true;
  }
};

// ---------- FETCH & FILL FORM ----------
const fetchBand = async () => {
  const bandId = route.params.id;
  try {
    loading.value = true;
    const response = await findOne("bands", bandId, {
      populate: ["bandImg", "singlesong.song", "singlevideo"],
    });
    loading.value = false;
    console.log("this is the response ", response.data);
    if (response.data) {
      // The fields are at the top level (Strapi v4)
      const attributes = response.data;

      band.value = {
        id: response.data.id,
        name: attributes.name,
        genre: attributes.genre,
        bio: attributes.bio,
        biotagline: attributes.biotagline || "",
        websitelink: attributes.websitelink || "",
        websitelinktext: attributes.websitelinktext || "",
        facebook: attributes.facebook || "",
        instagram: attributes.instagram || "",
        twitch: attributes.twitch || "",
        twitter: attributes.twitter || "",
        whatsapp: attributes.whatsapp || "",
        tiktok: attributes.tiktok || "",
        snapchat: attributes.snapchat || "",
        appleMusic: attributes.appleMusic || "",
        spotify: attributes.spotify || "",
        soundcloud: attributes.soundcloud || "",
        youtube: attributes.youtube || "",
        deezer: attributes.deezer || "",
        bandcamp: attributes.bandcamp || "",
        reverbnation: attributes.reverbnation || "",

        // For bandImg, same structure
        bandImg: attributes.bandImg || null,
        imageUrl: attributes.bandImg ? attributes.bandImg.url : "",

        // For singlesong, include its id to preserve the component
        singlesong: attributes.singlesong
          ? {
              id: attributes.singlesong.id || null,
              title: attributes.singlesong.title || "",
              song: attributes.singlesong.song || null,
              embedUrl: attributes.singlesong.embedUrl || "",
              isEmbeded: attributes.singlesong.isEmbeded ?? false,
            }
          : {
              id: null,
              title: "",
              song: null,
              embedUrl: "",
              isEmbeded: false,
            },

        // singlevideo
        singlevideo: attributes.singlevideo
          ? { youtubeid: attributes.singlevideo.youtubeid || "" }
          : { youtubeid: "" },
      };
    }
  } catch (error) {
    loading.value = false;
    console.error("Error fetching band:", error);
  }
};

onMounted(fetchBand);

// ---------- SUBMIT FORM ----------
import { toRaw } from "vue";

const submitEditBand = async () => {
  const bandId = route.params.id;
  try {
    loading.value = true;

    // 1. Build JSON payload for non-media fields
    const bandData = {
      name: band.value.name,
      genre: band.value.genre,
      bio: band.value.bio,
      facebook: band.value.facebook,
      instagram: band.value.instagram,
      twitch: band.value.twitch,
      twitter: band.value.twitter,
      whatsapp: band.value.whatsapp,
      tiktok: band.value.tiktok,
      snapchat: band.value.snapchat,
      appleMusic: band.value.appleMusic,
      spotify: band.value.spotify,
      soundcloud: band.value.soundcloud,
      youtube: band.value.youtube,
      deezer: band.value.deezer,
      bandcamp: band.value.bandcamp,
      users_permissions_user: user.value.id,

      // Preserve the singlesong component
      singlesong: {
        id: band.value.singlesong.id, // Include the ID so Strapi knows it's the same component
        title: band.value.singlesong.title,
        embedUrl: band.value.singlesong.embedUrl,
        isEmbeded: band.value.singlesong.isEmbeded,
      },

      // Singlevideo
      singlevideo: {
        youtubeid: band.value.singlevideo.youtubeid,
      },
    };

    // If no new single-song file was uploaded, preserve the existing media ID
    if (!isSingleSongFile.value && band.value.singlesong.song) {
      if (band.value.singlesong.song.data?.id) {
        bandData.singlesong.song = band.value.singlesong.song.data.id;
      }
    }

    console.log("Payload to send:", bandData);

    // Check if new files need to be uploaded
    const hasNewFiles =
      band.value.bandImg instanceof File ||
      (isSingleSongFile.value && band.value.singlesong.song instanceof File);

    if (!hasNewFiles) {
      // Send JSON if no new files
      await client(`/bands/${bandId}`, {
        method: "PUT",
        body: { data: bandData },
      });
    } else {
      // Create FormData for multipart
      const bandForm = new FormData();
      bandForm.append("data", JSON.stringify(bandData));

      // Append new band image file if it exists
      if (band.value.bandImg instanceof File) {
        bandForm.append("files.bandImg", band.value.bandImg);
      }

      // Append new single-song file if uploaded
      if (isSingleSongFile.value && band.value.singlesong.song instanceof File) {
        bandForm.append(
          "files.singlesong.song",
          band.value.singlesong.song,
          band.value.singlesong.song.name
        );
      }

      // Use the /api/bands/:id endpoint for multipart
      await client(`/api/bands/${bandId}`, {
        method: "PUT",
        body: bandForm,
      });
    }

    loading.value = false;
    router.push("/dashboard");
  } catch (error) {
    loading.value = false;
    console.error("Error updating band:", error);
  }
};
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Container */
.container-mdc {
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Title */
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

/* Text Fields */
.mdc-text-field {
  position: relative;
  margin-bottom: 1.5rem;
  display: inline-block;
  width: 100%;
}

.mdc-text-field__input::placeholder {
  color: transparent;
}

.mdc-text-field__input:focus::placeholder {
  color: #aaa;
}

.mdc-text-field__input {
  font-size: 1rem;
  line-height: 1.5;
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

/* Button */
.mdc-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.0892857143em;
  color: #fff;
  background-color: #2c2c2c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.mdc-button:hover {
  background-color: #3700b3;
}

/* File Input */
.styled-file-input {
  display: none;
}

.styled-file-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.0892857143em;
  color: #fff;
  background-color: #2c2c2c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.styled-file-label:hover {
  background-color: #3700b3;
}

.styled-file-label.w-full {
  display: block;
  width: 100%;
  text-align: center;
}

.w-full {
  width: 100%;
}

.h-auto {
  height: auto;
}

.rounded-lg {
  border-radius: 8px;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
