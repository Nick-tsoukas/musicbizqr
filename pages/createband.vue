<template>
  <div class="bg-[#000] w-[90vw] mx-auto z-0 pt-[var(--header-height)]">
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

            <!-- New: Band name is in logo -->
            <div class="flex items-center mb-4">
              <input
                id="isBandNameInLogo"
                type="checkbox"
                v-model="isBandNameInLogo"
                class="mr-2 h-4 w-4 text-purple-600 border-gray-300 rounded"
              />
              <label for="isBandNameInLogo" class="text-black select-none">
                Show artist name in page or is it in the logo
              </label>
            </div>

            <!-- Genre -->
            <div class="mdc-text-field">
              <input
                type="text"
                id="genre"
                class="mdc-text-field__input"
                v-model="genre"
                placeholder=" "
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
                maxlength="247"
                required
              ></textarea>
              <label class="mdc-floating-label" for="bio">Bio</label>
              <div class="mdc-line-ripple"></div>
            </div>

            <div
              class="mdc-text-field-helper"
              :class="{ 'mdc-text-field-helper--error': bio.length > max }"
            >
              {{ bio.length }} / {{ max }} characters
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
          <div
            v-if="bandImgUrl"
            class="flex justify-center items-center max-h-[400px] p-4 rounded-lg"
          >
            <img
              :src="bandImgUrl"
              alt="Band Image"
              class="max-h-[400px] w-auto h-auto object-contain rounded-lg shadow-md"
            />
          </div>
          <input
            type="file"
            id="band-img"
            class="styled-file-input"
            @change="handleImageUpload"
            accept="image/*"
          />
          <label
            for="band-img"
            class="styled-file-label w-full text-center my-10"
          >
            Choose Band Image
          </label>
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
          <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="net in Object.keys(social)"
              :key="net"
              class="mdc-text-field"
            >
              <input
                :id="net"
                type="url"
                class="mdc-text-field__input"
                v-model="social[net]"
                placeholder=" "
              />
              <label class="mdc-floating-label" :for="net">{{
                net.charAt(0).toUpperCase() + net.slice(1)
              }}</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Streaming Links Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Streaming Links</h2>
          </div>
          <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="stream in Object.keys(streaming)"
              :key="stream"
              class="mdc-text-field"
            >
              <input
                :id="stream"
                type="url"
                class="mdc-text-field__input"
                v-model="streaming[stream]"
                placeholder=" "
              />
              <label class="mdc-floating-label" :for="stream">
                {{ stream.charAt(0).toUpperCase() + stream.slice(1) }}
              </label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Single Song Section (Embed or Upload) -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Single Song</h2>
          </div>
          <div class="p-4">
            <!-- Toggle: Upload vs Embed -->
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

            <!-- Song Title -->
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

            <!-- Upload Mode -->
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
              <div v-if="singlesongFile" class="mt-4 text-black">
                Selected Song: {{  singlesongFile.name }}
              </div>
            </div>

            <!-- Embed Mode -->
            <div v-else>
              <div class="mdc-text-field mb-4">
                <select
                  id="singlesong-platform"
                  v-model="singlesongPlatform"
                  class="mdc-text-field__input"
                >
                  <option disabled value="">Select Platform</option>
                  <option value="spotify">Spotify</option>
                  <option value="appleMusic">Apple Music</option>
                </select>
                <label class="mdc-floating-label" for="singlesong-platform"
                  >Platform</label
                >
                <div class="mdc-line-ripple"></div>
              </div>
              <div class="mdc-text-field mb-4">
                <input
                  type="text"
                  id="singlesong-trackid"
                  class="mdc-text-field__input"
                  v-model="singlesongTrackId"
                  placeholder=" "
                />
                <label class="mdc-floating-label" for="singlesong-trackid"
                  >Track ID</label
                >
                <div class="mdc-line-ripple"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Single Video Section -->
        <!-- Featured Video -->
        <div class="bg-white rounded-md my-10">
          <div
            class="flex bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500"
          >
            <h2 class="text-white text-2xl font-semibold">Featured Video</h2>
          </div>
          <div class="p-4 space-y-4">
            <!-- Video Title -->
            <div class="mdc-text-field">
              <input
                id="singlevideo-title"
                v-model="singlevideoTitle"
                type="text"
                class="mdc-text-field__input"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="singlevideo-title">
                Video Title
              </label>
              <div class="mdc-line-ripple"></div>
            </div>

            <!-- YouTube ID -->
            <div class="mdc-text-field">
              <input
                id="singlevideo-youtube"
                v-model="singlevideoYoutubeUrl"
                type="text"
                class="mdc-text-field__input"
                placeholder="e.g. dQw4w9WgXcQ"
              />
              <label class="mdc-floating-label" for="singlevideo-youtube">
                YouTube ID
              </label>
              <div class="mdc-line-ripple"></div>
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
import { useRouter, useRoute } from "vue-router";
import {
  useStrapiClient,
  useStrapiUser,
  useStrapiToken,
  useStrapi,
} from "#imports";

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();
const user = useStrapiUser();
const token = useStrapiToken();

const loading = ref(false);
const isBandNameInLogo = ref(false);

// Band basics

const bandName = ref("");
const genre = ref("");
const bio = ref("");
const bandImg = ref(null);
const bandImgUrl = ref(null);
const websitelink = ref("");
const websitelinktext = ref("");
const max = 247;

// Members
const members = ref([
  { name: "", instrument: "", image: null, imageUrl: null },
]);
function addMember() {
  members.value.push({ name: "", instrument: "", image: null, imageUrl: null });
}
function removeMember(idx) {
  members.value.splice(idx, 1);
}
function handleMemberImageUpload(e, idx) {
  const f = e.target.files[0];
  members.value[idx].image = f;
  members.value[idx].imageUrl = URL.createObjectURL(f);
}

// Social + Streaming
const social = ref({
  facebook: "",
  instagram: "",
  twitch: "",
  twitter: "",
  whatsapp: "",
  tiktok: "",
  snapchat: "",
  reverbnation: "",
});
const streaming = ref({
  appleMusic: "",
  spotify: "",
  soundcloud: "",
  youtube: "",
  deezer: "",
  bandcamp: "",
});

// Featured song/video
const singlesongType = ref("upload");
const singlesongTitle = ref("");
const singlesongPlatform = ref("");
const singlesongTrackId = ref("");
const singlesongFile = ref(null);
const singlesongFileName = ref("");
const singlevideoYoutubeUrl = ref("");
const singlevideoTitle = ref("");

function handleImageUpload(e) {
  bandImg.value = e.target.files[0];
  bandImgUrl.value = URL.createObjectURL(bandImg.value);
}
function handleSingleSongUpload(e) {
  const f = e.target.files[0];
  singlesongFile.value = f;
  console.log(f.name, 'this is the file ')
  singlesongFileName.value =  f.name;
}

// Fetch existing bands for user (optional)
onMounted(async () => {
  try {
    const r = await client("/bands", {
      params: {
        filters: { users_permissions_user: { id: user.value.id } },
        populate: ["users_permissions_user"],
      },
    });
  } catch (e) {
    console.error(e);
  }
});

async function submitForm() {
  loading.value = true;
  try {
    // 1) Build plain‐JS payload
    const payload = {
      name: bandName.value,
      isBandNameInLogo: isBandNameInLogo.value,
      genre: genre.value,
      bio: bio.value,
      websitelink: websitelink.value || null,
      websitelinktext: websitelinktext.value || null,
      users_permissions_user: user.value.id,

      // members
      members: members.value.map((m) => ({
        name: m.name,
        instrument: m.instrument,
      })),

      // social
      ...social.value,

      // streaming
      ...streaming.value,

      // featured song
      singlesong: {
        title: singlesongTitle.value,
        isEmbed: singlesongType.value === "embed",
        platform:
          singlesongType.value === "embed" ? singlesongPlatform.value : null,
        trackId:
          singlesongType.value === "embed" ? singlesongTrackId.value : null,
      },

      // featured video
      singlevideo: {
        youtubeid: singlevideoYoutubeUrl.value || "",
        title: singlevideoTitle.value,
      },
    };

    // 2) Wrap in FormData...
    const fd = new FormData();
    fd.append("data", JSON.stringify(payload));
    if (bandImg.value) {
      fd.append("files.bandImg", bandImg.value);
    }
    members.value.forEach((m, i) => {
      if (m.image) {
        fd.append(`files.members.${i}.image`, m.image);
      }
    });
    if (singlesongType.value === "upload" && singlesongFile.value) {
      fd.append("files.singlesong.song", singlesongFile.value);
    }

    // 3) POST...
    const res = await fetch(`${config.public.strapiUrl}/api/bands`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
      body: fd,
    });
    const json = await res.json();
    if (!res.ok) throw json;

    // 4) Redirect
    const slug = json.data?.attributes?.slug;
    await router.push(slug ? { name: "slug", params: { slug } } : "/dashboard");
  } catch (err) {
    console.error("❌ createBand error:", err);
    alert(err.error?.message || "Creation failed");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.container-mdc {
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mdc-text-field-helper {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
  line-height: 1;
}
.mdc-text-field-helper--error {
  color: #b00020;   /* a red for over-limit */
}
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.mdc-text-field {
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
}
.mdc-text-field__input {
  width: 100%;
  padding: 0.75rem 0.5rem;
  border: 1px solid #000;
  border-radius: 10px;
  outline: none;
}

/* hide all placeholders by default */
.mdc-text-field__input::placeholder {
  color: transparent;
  transition: color 0.2s;
}

/* reveal placeholder only when the input is focused */
.mdc-text-field__input:focus::placeholder {
  color: #888;  /* or whatever light gray matches your theme */
}

.mdc-floating-label {
  position: absolute;
  top: 0.75rem;
  left: 0.5rem;
  background: #fff;
  padding: 0 0.2em;
  transition:
    transform 0.2s,
    color 0.2s;
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
  background: #6200ee;
  transform: scaleX(0);
  transition: transform 0.2s;
}
.mdc-text-field__input:focus ~ .mdc-line-ripple {
  transform: scaleX(1);
}

.mdc-button,
.styled-file-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.mdc-button {
  background: #2c2c2c;
  color: #fff;
  border: none;
  margin-top: 1rem;
}
.mdc-button:hover {
  background: #3700b3;
}
.styled-file-input {
  display: none;
}
.styled-file-label {
  background: #7c3aed;
  color: #fff;
}
.styled-file-label:hover {
  background: #3700b3;
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
  to {
    transform: rotate(360deg);
  }
}
</style>
