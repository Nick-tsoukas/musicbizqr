<template>
  <div class="bg-[#000] w-[90vw] mx-auto z-0">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <div class="container-mdc bg-black max-w-5xl">
      <h1 class="title text-white">Create Band Profile</h1>
      <form class="form-group" @submit.prevent="submitForm">
        <!-- Band Details Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Band Details</h2>
          </div>
          <div class="p-4">
            <!-- Band Name -->
            <div class="mdc-text-field">
              <input
                type="text"
                id="band-name"
                class="mdc-text-field__input"
                v-model="bandName"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="band-name"
                >Band Name</label
              >
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Genre -->
            <div class="mdc-text-field">
              <input
                type="text"
                id="genre"
                class="mdc-text-field__input"
                v-model="genre"
                placeholder=" "
                required
              />
              <label class="mdc-floating-label" for="genre">Genre</label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- Bio -->
            <div class="mdc-text-field">
              <textarea
                id="bio"
                class="mdc-text-field__input"
                v-model="bio"
                placeholder=" "
                required
              ></textarea>
              <label class="mdc-floating-label" for="bio">Bio</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Website Link and Text -->
        <div class="bg-[#fff] rounded-md my-10">
          <div
            class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">
              Website Link and Text
            </h2>
          </div>
          <div class="p-4">
            <!-- websitelink -->
            <div class="mdc-text-field">
              <input
                type="text"
                id="websitelink"
                class="mdc-text-field__input"
                v-model="websitelink"
                placeholder="https://yourbandsite.com"
              />
              <label class="mdc-floating-label" for="websitelink"
                >Website Link</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
          <div class="p-4">
            <div class="mdc-text-field">
              <input
                type="text"
                id="websitelinktext"
                class="mdc-text-field__input"
                v-model="websitelinktext"
                placeholder="YourBandSiteLinkText.com"
              />
              <label class="mdc-floating-label" for="websitelinktext"
                >Website Link Text To Show</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Band Image -->
        <div
          class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
        >
          <h3 class="font-semibold text-white text-2xl">Upload Image</h3>
        </div>
        <div class="mb-4 py-10 bg-white p-4">
          <input
            type="file"
            required
            id="band-img"
            class="styled-file-input"
            @change="handleImageUpload"
            accept="image/*"
          />
          <label for="band-img" class="styled-file-label w-full text-center">
            Choose Band Image
          </label>
          <div v-if="bandImgUrl" class="mb-4">
            <img
              :src="bandImgUrl"
              alt="Band Image"
              class="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        <!-- Band Members Section -->
        <div class="bg-white rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Band Members</h2>
          </div>
          <div class="p-4">
            <div
              v-for="(member, index) in members"
              :key="index"
              class="member-container"
            >
              <div class="mdc-text-field mb-4">
                <input
                  type="text"
                  :id="'member-name-' + index"
                  class="mdc-text-field__input"
                  v-model="member.name"
                  placeholder=" "
                />
                <label class="mdc-floating-label" :for="'member-name-' + index">
                  Member Name
                </label>
                <div class="mdc-line-ripple"></div>
              </div>
              <div class="mdc-text-field mb-4">
                <input
                  type="text"
                  :id="'instrument-' + index"
                  class="mdc-text-field__input"
                  v-model="member.instrument"
                  placeholder=" "
                />
                <label class="mdc-floating-label" :for="'instrument-' + index">
                  Instrument
                </label>
                <div class="mdc-line-ripple"></div>
              </div>
              <div class="mb-4">
                <input
                  type="file"
                  :id="'member-img-' + index"
                  class="styled-file-input"
                  @change="(event) => handleMemberImageUpload(event, index)"
                  accept="image/*"
                />
                <label
                  :for="'member-img-' + index"
                  class="styled-file-label w-full text-center"
                >
                  Choose Member Image
                </label>
              </div>
              <div v-if="member.imageUrl" class="mb-4">
                <img
                  :src="member.imageUrl"
                  alt="Member Image"
                  class="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <button
                type="button"
                class="mdc-button mb-4 w-full"
                @click="removeMember(index)"
              >
                Remove Member
              </button>
            </div>
            <button
              type="button"
              class="mdc-button mb-8 w-full"
              @click="addMember"
            >
              + Add Member
            </button>
          </div>
        </div>

        <!-- Social Media Links Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">
              Social Media Links
            </h2>
          </div>
          <div class="p-4">
            <!-- Facebook -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="facebook"
                class="mdc-text-field__input"
                v-model="facebook"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="facebook">Facebook</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Instagram -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="instagram"
                class="mdc-text-field__input"
                v-model="instagram"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="instagram"
                >Instagram</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Twitch -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="twitch"
                class="mdc-text-field__input"
                v-model="twitch"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="twitch">Twitch</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Twitter -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="twitter"
                class="mdc-text-field__input"
                v-model="twitter"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="twitter">Twitter</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- WhatsApp -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="whatsapp"
                class="mdc-text-field__input"
                v-model="whatsapp"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="whatsapp">WhatsApp</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- TikTok -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="tiktok"
                class="mdc-text-field__input"
                v-model="tiktok"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="tiktok">TikTok</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Snapchat -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="snapchat"
                class="mdc-text-field__input"
                v-model="snapchat"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="snapchat">Snapchat</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Streaming Links Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-2xl text-white">Streaming Links</h2>
          </div>
          <div class="p-4">
            <!-- Apple Music -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="appleMusic"
                class="mdc-text-field__input"
                v-model="appleMusic"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="appleMusic"
                >Apple Music</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Spotify -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="spotify"
                class="mdc-text-field__input"
                v-model="spotify"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="spotify">Spotify</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- SoundCloud -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="soundcloud"
                class="mdc-text-field__input"
                v-model="soundcloud"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="soundcloud"
                >SoundCloud</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- YouTube -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="youtube"
                class="mdc-text-field__input"
                v-model="youtube"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="youtube">YouTube</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Deezer -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="deezer"
                class="mdc-text-field__input"
                v-model="deezer"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="deezer">Deezer</label>
              <div class="mdc-line-ripple"></div>
            </div>
            <!-- Bandcamp -->
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="bandcamp"
                class="mdc-text-field__input"
                v-model="bandcamp"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="bandcamp">Bandcamp</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Single Song Section (Embed or Upload) -->
        <!-- Single Song Section (Embed or Upload) -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Single Song</h2>
          </div>
          <div class="p-4">
            <!-- Toggle: Upload File vs. Embed Content -->
            <div class="flex space-x-4 mb-4">
              <label class="text-black">
                <input
                  type="radio"
                  value="upload"
                  v-model="singlesongType"
                  class="mr-1"
                />
                Upload File
              </label>
              <label class="text-black">
                <input
                  type="radio"
                  value="embed"
                  v-model="singlesongType"
                  class="mr-1"
                />
                Embed Content
              </label>
            </div>
            <div class="mdc-text-field mb-4">
              <input
                type="text"
                id="singlesong-title"
                class="mdc-text-field__input"
                v-model="singlesongTitle"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="singlesong-title"
                >Song Title</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
            <div v-if="singlesongType === 'upload'">
              <input
                type="file"
                id="singlesong-file"
                class="styled-file-input"
                @change="handleSingleSongUpload"
                accept="audio/*"
              />
              <label
                for="singlesong-file"
                class="styled-file-label w-full text-center"
              >
                Choose Single Song File
              </label>
              <div v-if="singlesongFileName" class="mt-4 text-white">
                <p>
                  Selected Song: {{ singlesongTitle || singlesongFileName }}
                </p>
              </div>
            </div>
            <div v-else>
              <div class="mdc-text-field mb-4">
                <input
                  type="url"
                  id="singlesong-embed"
                  class="mdc-text-field__input"
                  v-model="singlesongEmbedUrl"
                  placeholder=" "
                />
                <label class="mdc-floating-label" for="singlesong-embed"
                  >Embed URL</label
                >
                <div class="mdc-line-ripple"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="mdc-button w-full mt-10">
          Create Profile
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();
const { update } = useStrapi();
const user = useStrapiUser();

const loading = ref(false);
const bandName = ref("");
const genre = ref("");
const bio = ref("");
const bandImg = ref(null);
const bandImgUrl = ref(null);
const websitelink = ref("");
const websitelinktext = ref("");

// Band Members
const members = ref([
  { name: "", instrument: "", image: null, imageUrl: null },
]);
const addMember = () => {
  members.value.push({ name: "", instrument: "", image: null, imageUrl: null });
};
const removeMember = (index) => {
  members.value.splice(index, 1);
};
const handleMemberImageUpload = (event, index) => {
  const file = event.target.files[0];
  members.value[index].image = file;
  members.value[index].imageUrl = URL.createObjectURL(file);
};

// Social media
const facebook = ref("");
const instagram = ref("");
const twitch = ref("");
const twitter = ref("");
const whatsapp = ref("");
const tiktok = ref(""); // fixed spelling
const snapchat = ref("");

// Streaming
const appleMusic = ref("");
const spotify = ref("");
const soundcloud = ref("");
const deezer = ref(""); // fixed spelling
const youtube = ref("");
const bandcamp = ref("");

// Single Song
const singlesongType = ref("upload"); // "upload" or "embed"
const singlesongTitle = ref("");
const singlesongFile = ref(null);
const singlesongFileName = ref("");
const singlesongEmbedUrl = ref("");

// Single Video
const singlevideoYoutubeUrl = ref("");

// Handle band cover image
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  bandImg.value = file;
  bandImgUrl.value = URL.createObjectURL(file);
};

// Handle single song file upload
const handleSingleSongUpload = (event) => {
  const file = event.target.files[0];
  singlesongFile.value = file;
  singlesongFileName.value = singlesongTitle.value || file.name;
};

// Submit form
const submitForm = async () => {
  try {
    loading.value = true;
    if (!bandName.value || !genre.value || !bio.value) {
      alert("Please fill in the required fields: name, genre, bio.");
      loading.value = false;
      return;
    }

    const normalizedSingleSongEmbedUrl = normalizeStreamingUrl(
      singlesongEmbedUrl.value
    );
    const normalizedSingleVideoUrl = normalizeStreamingUrl(
      singlevideoYoutubeUrl.value
    );
    const form = {
      name: bandName.value,
      genre: genre.value,
      bio: bio.value,
      facebook: facebook.value || null,
      instagram: instagram.value || null,
      twitch: twitch.value || null,
      twitter: twitter.value || null,
      whatsapp: whatsapp.value || null,
      tiktok: tiktok.value || null,
      snapchat: snapchat.value || null,
      appleMusic: appleMusic.value || null,
      spotify: spotify.value || null,
      soundcloud: soundcloud.value || null,
      deezer: deezer.value || null,
      youtube: youtube.value || null,
      bandcamp: bandcamp.value || null,
      websitelink: websitelink.value || null,
      websitelinktext: websitelinktext.value || null,
      users_permissions_user: user.value.id,
      members: members.value.map((member) => ({
        name: member.name || "",
        instrument: member.instrument || "",
      })),
      // Updated: conditionally include file upload or embed URL
      singlesong: {
        title: singlesongTitle.value || "",
        ...(singlesongType.value === "upload"
          ? { song: singlesongFile.value }
          : { embedUrl: singlesongEmbedUrl.value }),
      },
      singlevideo: {
        // title: singlesongTitle.value || "",
        youtubeid: singlevideoYoutubeUrl.value || "",
      },
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(form));

    // Band Image
    if (bandImg.value) {
      formData.append("files[bandImg]", bandImg.value);
    }

    // Member Images
    members.value.forEach((member, index) => {
      if (member.image) {
        formData.append(`files[members][${index}][image]`, member.image);
      }
    });

    // Single Song File if type is upload
    if (singlesongType.value === "upload" && singlesongFile.value) {
      formData.append("files[singlesong][song]", singlesongFile.value);
    }

    console.log("FormData:", Array.from(formData.entries()));

    const { data: bandData } = await client("/bands", {
      method: "POST",
      body: formData,
    });

    if (route.query.qrId) {
      await update("qrs", route.query.qrId, {
        band: bandData.id,
      });
    }

    console.log("Band profile created successfully:", bandData);
    router.push("/dashboard");
  } catch (error) {
    loading.value = false;
    console.error("Error creating band profile:", error);
  }
};

const normalizeStreamingUrl = (url) => {
  if (!url) return null;

  // Spotify URL check
  if (url.includes("spotify.com")) {
    const match = url.match(/(?:spotify\.com\/(track|album|playlist)\/)([^?]+)/);
    if (match) {
      const [_, type, id] = match;
      return `https://open.spotify.com/embed/${type}/${id}`;
    }
  }

  // Apple Music URL check
  if (url.includes("music.apple.com")) {
    const match = url.match(/(?:music\.apple\.com\/[a-z]{2}\/album\/)([^?]+)/);
    if (match) {
      const id = match[1];
      return `https://embed.music.apple.com/us/album/${id}`;
    }
  }

  // YouTube URL check
  if (url.includes("youtube.com")) {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    if (match) {
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // SoundCloud URL check
  if (url.includes("soundcloud.com")) {
    const match = url.match(/(?:soundcloud\.com\/)([^?\/]+\/[^?\/]+)/);
    if (match) {
      const trackPath = match[1];
      return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackPath}`;
    }
  }

  // Deezer URL check
  if (url.includes("deezer.com")) {
    const match = url.match(/(?:deezer\.com\/[^?]+\/track\/)(\d+)/);
    if (match) {
      const trackId = match[1];
      return `https://www.deezer.com/widgets/player?trackid=${trackId}`;
    }
  }

  // Return null if the URL is invalid or unsupported
  return null;
};

// Fetch bands associated with the user
onMounted(async () => {
  try {
    const response = await client("/bands", {
      params: {
        filters: {
          users_permissions_user: {
            id: user.value.id,
          },
        },
        populate: ["users_permissions_user"],
      },
    });
    bands.value = response.data;
  } catch (error) {
    console.error("Error fetching bands associated with the user:", error);
  }
});
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.btn {
  @apply bg-neon-green hover:bg-neon-purple text-black font-bold py-2 px-4 rounded shadow-lg;
}

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
}

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
}

.mdc-button:hover {
  background-color: #3700b3;
}

.mdc-button:focus {
  outline: none;
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

.member-container {
  margin: 0;
}

.mdc-text-field.mb-4 {
  margin-bottom: 1rem;
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
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
