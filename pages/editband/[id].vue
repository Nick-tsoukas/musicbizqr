<template>
  <div class="bg-[#000] w-[90vw] mx-auto z-0">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <div class="container-mdc bg-black max-w-5xl">
      <h1 class="title text-white">Edit Band Profile</h1>
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
          <div v-if="bandImgUrl" class="mb-4">
            <img
              :src="bandImgUrl"
              alt="Band Image"
              class="w-full max-h-[300px] object-contain"
            />
          </div>
          <input
            type="file"
            id="band-img"
            class="styled-file-input"
            @change="handleImageUpload"
            accept="image/*"
          />
          <label for="band-img" class="styled-file-label w-full text-center"
            >Choose Band Image</label
          >
        </div>

        <!-- Band Members Section -->
        <!-- <div class="bg-white rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Band Members</h2>
          </div>
          <div class="p-4">
            <div v-for="(member, i) in members" :key="i" class="member-container">
              <div class="mdc-text-field mb-4">
                <input
                  type="text"
                  :id="'member-name-' + i"
                  class="mdc-text-field__input"
                  v-model="member.name"
                  placeholder=" "
                />
                <label class="mdc-floating-label" :for="'member-name-' + i">Member Name</label>
                <div class="mdc-line-ripple"></div>
              </div>
              <div class="mdc-text-field mb-4">
                <input
                  type="text"
                  :id="'instrument-' + i"
                  class="mdc-text-field__input"
                  v-model="member.instrument"
                  placeholder=" "
                />
                <label class="mdc-floating-label" :for="'instrument-' + i">Instrument</label>
                <div class="mdc-line-ripple"></div>
              </div>
              <div class="mb-4">
                <input
                  type="file"
                  :id="'member-img-' + i"
                  class="styled-file-input"
                  @change="e => handleMemberImageUpload(e, i)"
                  accept="image/*"
                />
                <label :for="'member-img-' + i" class="styled-file-label w-full text-center">Choose Member Image</label>
              </div>
              <div v-if="member.imageUrl" class="mb-4">
                <img
                  :src="member.imageUrl"
                  alt="Member Image"
                  class="w-full h-auto rounded-lg shadow-md object-contain"
                />
              </div>
              <button type="button" class="mdc-button mb-4 w-full" @click="removeMember(i)">Remove Member</button>
            </div>
            <button type="button" class="mdc-button mb-8 w-full" @click="addMember">+ Add Member</button>
          </div>
        </div> -->

        <!-- Social Media Links Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">
              Social Media Links
            </h2>
          </div>
          <div class="p-4 grid grid-cols-2 gap-4">
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
          <div class="p-4 grid grid-cols-2 gap-4">
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
              <label class="mdc-floating-label" :for="stream">{{
                stream
              }}</label>
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Featured Song Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Featured Song</h2>
          </div>
          <div class="p-4">
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
                Use Embed
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
                >Choose Song File</label
              >
            </div>
            <div v-else class="mdc-text-field mb-4">
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

        <!-- Featured Video Section -->
        <div class="bg-[#fff] rounded-md">
          <div
            class="flex mt-10 flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-2xl">Featured Video</h2>
          </div>
          <div class="p-4">
            <div class="mdc-text-field mb-4">
              <input
                type="url"
                id="singlevideo-youtube"
                class="mdc-text-field__input"
                v-model="singlevideoYoutubeUrl"
                placeholder=" "
              />
              <label class="mdc-floating-label" for="singlevideo-youtube"
                >YouTube Video URL</label
              >
              <div class="mdc-line-ripple"></div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <button type="submit" class="mdc-button w-full mt-10">
          Save Changes
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRuntimeConfig, useStrapiUser, useStrapiToken } from "#imports";

const config = useRuntimeConfig();
const router = useRouter();
const route  = useRoute();
const user   = useStrapiUser();
const token  = useStrapiToken();

const loading         = ref(false);

// Band basics
const bandName        = ref("");
const genre           = ref("");
const bio             = ref("");
const websitelink     = ref("");
const websitelinktext = ref("");

// Track existing vs new image
const bandImgFile     = ref(null);
const bandImgUrl      = ref("");
const bandImgId       = ref(null);

// Members (if you still need them)
const members         = ref([]);

// Social media links
const social = ref({
  facebook:  "",
  instagram: "",
  twitch:    "",
  twitter:   "",
  whatsapp:  "",
  tiktok:    "",
  snapchat:  ""
});

// Streaming links
const streaming = ref({
  appleMusic: "",
  spotify:    "",
  soundcloud: "",
  youtube:    "",
  deezer:     "",
  bandcamp:   ""
});

// Featured song/video
const singlesongType      = ref("upload");
const singlesongTitle     = ref("");
const singlesongFile      = ref(null);
const singlesongEmbedUrl  = ref("");
const singlevideoYoutubeUrl = ref("");

// Fetch & populate form
async function fetchBand() {
  loading.value = true;
  const id = route.params.id;
  console.log("🔍 fetchBand start, id=", id);

  try {
    const res = await fetch(
      `${config.public.strapiUrl}/api/bands/${id}` +
      `?populate=bandImg,members.image,singlesong.song,singlevideo`
    );
    const j = await res.json();
    console.log("📥 fetchBand response", j);

    const attrs = j.data.attributes;
    bandName.value        = attrs.name  || "";
    genre.value           = attrs.genre || "";
    bio.value             = attrs.bio   || "";
    websitelink.value     = attrs.websitelink     || "";
    websitelinktext.value = attrs.websitelinktext || "";

    // remember existing image
    const imgData = attrs.bandImg?.data;
    bandImgId.value  = imgData?.id || null;
    bandImgUrl.value = imgData?.attributes?.url || "";

    // members
    members.value = (attrs.members?.data || []).map(m => ({
      name:       m.attributes.name       || "",
      instrument: m.attributes.instrument || "",
      image:      null,
      imageUrl:   m.attributes.image?.data?.attributes?.url || null
    }));
    console.log("👥 members populated:", members.value);

    // social links
    Object.keys(social.value).forEach(key => {
      social.value[key] = attrs[key] || "";
    });

    // streaming links
    Object.keys(streaming.value).forEach(key => {
      streaming.value[key] = attrs[key] || "";
    });

    // featured song
    if (attrs.singlesong?.data) {
      const ss = attrs.singlesong.data.attributes;
      singlesongTitle.value   = ss.title || "";
      if (ss.embedUrl) {
        singlesongType.value     = "embed";
        singlesongEmbedUrl.value = ss.embedUrl;
      }
    }

    // featured video
    singlevideoYoutubeUrl.value =
      attrs.singlevideo?.data?.attributes?.youtubeid || "";

  } catch(err) {
    console.error("❌ fetchBand failed:", err);
  } finally {
    loading.value = false;
  }
}
onMounted(fetchBand);

// Handlers
function handleImageUpload(e) {
  bandImgFile.value = e.target.files[0];
  bandImgUrl.value  = URL.createObjectURL(bandImgFile.value);
}
function handleSingleSongUpload(e) {
  singlesongFile.value = e.target.files[0];
}

// Submit: first JSON PUT, then separate upload if needed
async function submitForm() {
  loading.value = true;
  const id = route.params.id;
  let newImageId = null;

  try {
    // 1) If user selected a new image, upload it & link it to this Band
    if (bandImgFile.value) {
      console.log("📤 uploading new bandImg file first…");
      const fm = new FormData();
      fm.append("files", bandImgFile.value, bandImgFile.value.name);
      fm.append("ref",     "api::band.band");
      fm.append("refId",   id);
      fm.append("field",   "bandImg");

      const upRes = await fetch(
        `${config.public.strapiUrl}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`
          },
          body: fm
        }
      );
      const upJson = await upRes.json();
      console.log("📥 image upload response:", upJson);
      if (!upRes.ok) throw upJson;
      newImageId = upJson[0]?.id;
    }

    // 2) Build the full payload, injecting newImageId if present,
    //    or preserving the old one if not
    const payload = {
      name:      bandName.value,
      genre:     genre.value,
      bio:       bio.value,
      websitelink:     websitelink.value     || null,
      websitelinktext: websitelinktext.value || null,
      users_permissions_user: user.value.id,

      // pick up whichever image relation we have
      ...( newImageId
          ? { bandImg: newImageId }
          : !bandImgFile.value && bandImgId.value
            ? { bandImg: bandImgId.value }
            : {}
      ),

      members: members.value.map(m => ({
        name:       m.name,
        instrument: m.instrument
      })),
      ...social.value,
      ...streaming.value,
      singlesong: {
        title:    singlesongTitle.value || "",
        embedUrl: singlesongType.value === "embed"
                    ? singlesongEmbedUrl.value
                    : ""
      },
      singlevideo: {
        youtubeid: singlevideoYoutubeUrl.value || ""
      }
    };

    console.log("⏳ submitForm attributes payload:", payload);

    // 3) Now update everything in one JSON PUT
    console.log("📤 JSON update with image relation…");
    const putRes = await fetch(
      `${config.public.strapiUrl}/api/bands/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:   `Bearer ${token.value}`
        },
        body: JSON.stringify({ data: payload })
      }
    );
    const putJson = await putRes.json();
    console.log("📥 JSON update response:", putJson);
    if (!putRes.ok) throw putJson;

    // 4) Redirect on success
    router.push("/dashboard");

  } catch(err) {
    console.error("❌ submitForm error:", err);
    alert(err.error?.message || "Update failed—check console for details");
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
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
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
}
@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

.mdc-text-field {
  position: relative;
  margin-bottom: 1.5rem;
  width: 100%;
}
.mdc-text-field__input {
  width: 100%;
  padding: 0.75rem 0.5rem;
  border: 1px solid #000;
  border-radius: 10px;
  outline: none;
}
.mdc-floating-label {
  position: absolute;
  top: 0.75rem;
  left: 0.5rem;
  background: white;
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
  background: #2c2c2c;
  color: #fff;
}
.styled-file-label:hover {
  background: #3700b3;
}
.styled-file-label.w-full {
  width: 100%;
  text-align: center;
}
</style>
