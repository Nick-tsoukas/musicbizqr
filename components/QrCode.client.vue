<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center p-4 max-w-5xl mx-auto">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
      </div>
      <!-- QR Code Wrapper -->
      <div
        ref="qrcodeWrapper"
        class="p-4 sticky top-0 rounded-lg shadow-md"
        style="z-index : 999999 !important"
      >
        <!-- QR code will be rendered here by qr-code-styling -->
      </div>
      <div></div>
      <div class="mt-4 flex flex-col space-y-4 w-full">
        <!-- Name Input -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <span class="mb-1 text-white text-xl font-semibold">Name</span>
          </div>
          <div class="p-4">
            <label class="mdc-text-field mb-4">
              <input
                v-model="name"
                type="text"
                class="mdc-text-field__input"
                placeholder="Enter Name"
              />
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>

        <!-- Choose QR Type -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <span class="mb-1 text-white text-xl font-semibold"
              >Choose QR Type</span
            >
          </div>
          <div class="p-4">
            <div class="flex flex-wrap gap-4">
              <!-- Band -->
              <div
                @click="selectType('bandProfile')"
                :class="{
                  'border-green border-4': route.query.type == 'bandProfile',
                  'border-black': route.query.type !== 'bandProfile',
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Artist Page</span>
              </div>
              <!-- Event -->
              <!-- <div
                @click="selectType('events')"
                :class="{
                  'border-green': route.query.type == 'events',
                  'border-black': route.query.type !== 'events'
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Event</span>
              </div> -->
              <!-- Tour -->
              <!-- <div
                @click="selectType('tours')"
                :class="{
                  'border-green': route.query.type == 'tours',
                  'border-black': route.query.type !== 'tours'
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Tour</span>
              </div> -->
              <!-- Album -->
              <!-- <div
                @click="selectType('albums')"
                :class="{
                  'border-green': route.query.type == 'albums',
                  'border-black': route.query.type !== 'albums'
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Album</span>
              </div> -->
              <!-- Social Links -->
              <!-- <div
                @click="selectType('social')"
                :class="{
                  'border-green': route.query.type == 'social',
                  'border-black': route.query.type !== 'social'
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Social Links</span>
             </div> -->
              <!-- Stream -->
              <!-- <div
                @click="selectType('stream')"
                :class="{
                  'border-green': route.query.type == 'stream',
                  'border-black': route.query.type !== 'stream'
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Stream</span>
              </div> -->
              <!-- External URL -->
              <div
                @click="selectType('externalURL')"
                :class="{
                  'border-green border-4': route.query.type == 'externalURL',
                  'border-black': route.query.type !== 'externalURL',
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Link URL</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Band Selection (Only show if route.query.type === 'bandProfile') -->
        <div
          v-if="route.query.type === 'bandProfile'"
          class="bg-white rounded-md p-4"
        >
          <label class="mdc-text-field mb-4">
            <span class="mb-1 text-gray-700">Select Band:</span>
            <select v-model="selectedBand" class="mdc-text-field__input">
              <option disabled value="">Select a band</option>
              <!-- "None" option if they don't want to associate this QR with a band -->
              <option :value="null">None</option>
              <!-- Render each band from bands array -->
              <option v-for="band in bands" :key="band.id" :value="band.id">
                {{ band.name }}
              </option>
              <!-- Create new band option -->
              <option value="createNew">Create New Band</option>
            </select>
            <span class="mdc-line-ripple"></span>
          </label>
        </div>

        <!-- External Link Input (if applicable) -->
        <div
          v-if="route.query.type === 'externalURL'"
          class="bg-white rounded-md p-4"
        >
          <label class="mdc-text-field mb-4">
            <span class="mb-1 text-gray-700">External Link:</span>
            <input
              v-model="link"
              type="text"
              class="mdc-text-field__input"
              placeholder="Enter URL"
            />
            <span class="mdc-line-ripple"></span>
          </label>
        </div>

        <!-- Background & Foreground Colors -->
        <div class="bg-white rounded-md">
          <!-- unified header -->
          <div
            class="flex bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 items-center"
          >
            <h2 class="font-semibold text-white text-xl">
              Background & Foreground Colors
            </h2>
          </div>
          <!-- two-column pickers -->
          <div class="p-4 flex flex-col gap-6 sm:flex-row md:grid-cols-2">
            <!-- Background -->
            <div>
              <label class="flex items-center">
                <span class="mr-2 text-gray-700">Background:</span>
                <div class="color-picker">
                  <!-- <ColorSwatchPicker v-model="bgColor" /> -->
                  <input v-model="bgColor" type="text" class="color-text-input" />
                  <input v-model="bgColor" type="color" class="color-input" />
                </div>
              </label>
            </div>
            <!-- Foreground -->
            <div>
              <label class="flex items-center">
                <span class="mr-2 text-gray-700">Foreground:</span>
                <div class="color-picker">
                <!-- <ColorSwatchPicker v-model="dotsColor" /> -->
                  <input v-model="dotsColor" type="text" class="color-text-input" />
                <input v-model="dotsColor" type="color" class="color-input" />
              </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Gradient Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">Gradient Options</h2>
          </div>
          <div class="p-4">
            <label class="mb-4 flex items-center">
              <input type="checkbox" v-model="gradient" class="mr-2" />
              <span class="text-gray-700">Enable Gradient</span>
            </label>
            <div v-if="gradient">
              <label class="mdc-text-field mb-4">
                <span class="mb-1 text-gray-700">Gradient Type:</span>
                <select v-model="gradientType" class="mdc-text-field__input">
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
                <span class="mdc-line-ripple"></span>
              </label>
              <label class="mdc-text-field mb-4">
                <span class="mb-1 text-gray-700"
                  >Gradient Rotation (degrees):</span
                >
                <input
                  v-model.number="gradientRotation"
                  type="number"
                  class="mdc-text-field__input"
                  min="0"
                  max="360"
                />
                <span class="mdc-line-ripple"></span>
              </label>
              <label class="color-picker-label mb-4 flex items-center">
                <span class="mb-1 text-gray-700 mr-2"
                  >Gradient Start Color:</span
                >
                <ColorSwatchPicker v-model="gradientStartColor" />
              </label>

              <label class="color-picker-label mb-4 flex items-center">
                <span class="mb-1 text-gray-700 mr-2">Gradient End Color:</span>
                <ColorSwatchPicker v-model="gradientEndColor" />
              </label>
            </div>
          </div>
        </div>

        <!-- Image Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">Image Options</h2>
          </div>
          <div class="p-4">
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Upload Logo:</span>
              <input
                type="file"
                @change="handleImageUpload"
                class="mdc-text-field__input"
              />
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>

        <!-- Dots Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">Dots Options</h2>
          </div>
          <div class="p-4">
            <!-- Dots Type -->
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Dots Type:</span>
              <select v-model="dotsType" class="mdc-text-field__input">
                <option value="rounded">Rounded</option>
                <option value="dots">Dots</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
                <option value="square">Square</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>

        <!-- Corners Square Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">
              Corners Square Options
            </h2>
          </div>
          <div class="p-4">
            <!-- Corners Square Color -->
            <label class="color-picker-label mb-4">
              <span class="mb-1 text-gray-700">Corners Square Color:</span>
              <div class="color-picker">
                <input
                  v-model="cornersSquareColor"
                  type="text"
                  class="color-text-input"
                />
                <input
                  v-model="cornersSquareColor"
                  type="color"
                  class="color-input"
                />
              </div>
            </label>
            <!-- Corners Square Type -->
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Corners Square Type:</span>
              <select v-model="cornersSquareType" class="mdc-text-field__input">
                <option value="square">Square</option>
                <option value="dot">Dot</option>
                <option value="extraRounded">Extra Rounded</option>
              </select>
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>

        <!-- Corners Dot Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">
              Corners Dot Options
            </h2>
          </div>
          <div class="p-4">
            <!-- Corners Dot Color -->
            <label class="color-picker-label mb-4">
              <span class="mb-1 text-gray-700">Corners Dot Color:</span>
              <div class="color-picker">
                <input
                  v-model="cornersDotColor"
                  type="text"
                  class="color-text-input"
                />
                <input
                  v-model="cornersDotColor"
                  type="color"
                  class="color-input"
                />
              </div>
            </label>
            <!-- Corners Dot Type -->
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Corners Dot Type:</span>
              <select v-model="cornersDotType" class="mdc-text-field__input">
                <option value="square">Square</option>
                <option value="dot">Dot</option>
              </select>
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>

        <!-- Save Button -->
        <button @click="saveQrCode" class="mdc-button w-full mt-4">
          Save QR Code
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { useAsyncData } from "#app";
import { v4 as uuidv4 } from "uuid";

// References for the QR code wrapper
const qrcodeWrapper = ref(null);

// Access runtime config if needed
const config = useRuntimeConfig();
const apiUrl = config.public.strapiUrl;

// Strapi composables & routing
const props = defineProps({ type: String });
const { create, findOne, update, find } = useStrapi();
const user = useStrapiUser();
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();

// We generate a unique URL that the QR code will point to
const uuid = uuidv4();
const qrValue = ref(`https://musicbizqr.com/directqr?id=${uuid}`);
const qrSize = ref(300);

// Colors & Gradient
const bgColor = ref("#FFFFFF");
const fgColor = ref("#000000");
const gradient = ref(false);
const gradientType = ref("linear");
const gradientRotation = ref(0);
const gradientStartColor = ref("#e6289d");
const gradientEndColor = ref("#40353c");

// Basic form info
const name = ref("name");
const link = ref(null);
const loading = ref(false);

// QR code brand image options
const imageSettings = reactive({
  src: "",
  imageSize: 0.4,
  margin: 0,
  crossOrigin: "anonymous",
});

// QR code styling
const dotsColor = ref("#000000");
const dotsType = ref("square");
const cornersSquareColor = ref("#000000");
const cornersSquareType = ref("square");
const cornersDotColor = ref("#000000");
const cornersDotType = ref("square");

const qrCode = ref(null);

// For band selection
// const bands = ref([]);
const bands = computed(() => bandsData.value || []);

const selectedBand = ref(null);

// Fetch the user's bands (and other data if desired) so they can choose one
onMounted(async () => {
  // Load and mount the QR code
  if (process.client) {
    const { default: QRCodeStyling } = await import("qr-code-styling");
    qrCode.value = new QRCodeStyling(getQRCodeOptions());
    qrCode.value.append(qrcodeWrapper.value);
    initializeWatcher();
  }

  // Load all user-related resources
  // await fetchUserRelatedData();
});

// useAsyncData will automatically refetch when its watch source (userId) changes
const {
  data: bandsData,
  pending: bandsLoading,
  error: bandsError,
} = useAsyncData(
  // 💥 must be a string
  "user-bands",
  async () => {
    if (!user.value?.id) {
      return [];
    }
    const res = await find("bands", {
      filters: { users_permissions_user: { id: user.value.id } },
    });
    // normalize the shape
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    return [];
  },
  {
    // re-run whenever user.value.id changes
    watch: () => user.value?.id,
    immediate: true,
  }
);

// expose a clean `bands` array to your template

// async function fetchUserRelatedData() {
//   try {

//     // Only fetch if user is logged in
//     if (!user.value || !user.value.id) return;

//     const bandsResponse = await find('bands', {
//       filters: { users_permissions_user: { id: user.value.id } },
//     });
//     bands.value = bandsResponse.data;
//     console.log(bandsResponse , ' this is the bands array ')
//   } catch (error) {
//     console.log(bandsResponse , ' this is the bands array ')

//     console.error('Error fetching user-related data:', error);
//   }
// }

/**
 * Build the configuration object for our QR code library
 */
function getQRCodeOptions() {
  const options = {
    width: qrSize.value,
    height: qrSize.value,
    data: qrValue.value,
    errorCorrectionLevel: "H",
    dotsOptions: {
      type: dotsType.value,
    },
    cornersSquareOptions: {
      color: cornersSquareColor.value,
      type: cornersSquareType.value,
    },
    cornersDotOptions: {
      color: cornersDotColor.value,
      type: cornersDotType.value,
    },
    backgroundOptions: {
      color: bgColor.value,
      transparent: false,
    },
    imageOptions: {
      crossOrigin: imageSettings.crossOrigin,
      margin: imageSettings.margin,
      imageSize: imageSettings.imageSize,
    },
  };

  // If a logo/image is uploaded
  if (imageSettings.src) {
    options.image = imageSettings.src;
  }

  // If gradient is checked, apply the gradient to the dots
  if (gradient.value) {
    options.dotsOptions.gradient = {
      type: gradientType.value,
      rotation: (gradientRotation.value * Math.PI) / 180,
      colorStops: [
        { offset: 0, color: gradientStartColor.value },
        { offset: 1, color: gradientEndColor.value },
      ],
    };
    delete options.dotsOptions.color; // Remove solid color if gradient is used
  } else {
    options.dotsOptions.color = dotsColor.value;
    delete options.dotsOptions.gradient; // Remove gradient if using solid color
  }

  return options;
}

/**
 * Watch for style changes to dynamically update the QR code
 */
function initializeWatcher() {
  watch(
    [
      qrValue,
      qrSize,
      bgColor,
      dotsColor,
      dotsType,
      cornersSquareColor,
      cornersSquareType,
      cornersDotColor,
      cornersDotType,
      gradient,
      gradientType,
      gradientRotation,
      gradientStartColor,
      gradientEndColor,
      () => imageSettings.src,
    ],
    () => {
      if (qrCode.value) {
        qrCode.value.update(getQRCodeOptions());
      }
    },
    { deep: true }
  );
}

/**
 * Handle local image file upload
 */
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSettings.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

/**
 * When the user clicks on a particular QR type,
 * we update the query param so the UI toggles the correct sections.
 */
const selectType = (selected) => {
  router.push({
    query: {
      ...route.query,
      type: selected,
    },
  });
};

/**
 * Save the new QR code and then route the user based on the chosen type.
 */
const saveQrCode = async () => {
  try {
    loading.value = true;

    // Build form data
    const form = {
      url: qrValue.value,
      users_permissions_user: { id: user.value.id },
      q_type: route.query.type,
      link: link.value,
      name: name.value,
      options: {
        size: qrSize.value,
        backgroundOptions: {
          color: bgColor.value,
        },
        imageOptions: { ...imageSettings },
        dotsOptions: {
          type: dotsType.value,
          color: !gradient.value ? dotsColor.value : undefined,
          gradient: gradient.value
            ? {
                type: gradientType.value,
                rotation: (gradientRotation.value * Math.PI) / 180,
                colorStops: [
                  { offset: 0, color: gradientStartColor.value },
                  { offset: 1, color: gradientEndColor.value },
                ],
              }
            : undefined,
        },
        cornersSquareOptions: {
          color: cornersSquareColor.value,
          type: cornersSquareType.value,
        },
        cornersDotOptions: {
          color: cornersDotColor.value,
          type: cornersDotType.value,
        },
      },
    };

    // If they picked 'bandProfile', assign the band ID (unless they chose "Create New")
    if (route.query.type === "bandProfile") {
      form.band =
        selectedBand.value !== "createNew" ? selectedBand.value : null;
    }

    // Get the QR code as a PNG blob
    const blob = await qrCode.value.getRawData("png");
    const file = new File([blob], "qrcode.png");
    const formData = new FormData();
    formData.append("files.q_image", file, "qrcode.png");
    formData.append("data", JSON.stringify(form));

    // POST to /qrs
    const { data } = await client(`/qrs`, {
      method: "POST",
      body: formData,
    });

    if (!data || !data.id) {
      loading.value = false;
      console.error("QR code was not saved (no ID returned).");
      return;
    }

    console.log("QR code saved successfully with ID:", data.id);

    // If they selected "Create New Band"
    if (
      route.query.type === "bandProfile" &&
      selectedBand.value === "createNew"
    ) {
      router.push({ name: "createband", query: { qrId: data.id } });
      return;
    }

    // Otherwise, route based on the chosen type
    switch (route.query.type) {
      case "externalURL":
        router.push("/dashboard");
        break;
      case "bandProfile":
        // If they chose an existing band, just go to dashboard or wherever you want:
        router.push("/dashboard");
        break;
      case "events":
        router.push({ name: "newevent", query: { qrId: data.id } });
        break;
      case "tours":
        router.push({ name: "newtour", query: { qrId: data.id } });
        break;
      case "albums":
        router.push({ name: "newalbum", query: { qrId: data.id } });
        break;
      case "stream":
        router.push({ name: "createnewstreamlinks", query: { qrId: data.id } });
        break;
      case "social":
        router.push({ name: "socialpage", query: { qrId: data.id } });
        break;
      default:
        router.push("/dashboard");
        break;
    }
  } catch (error) {
    loading.value = false;
    console.error(
      "Error during QR code save:",
      error.response ? error.response.data : error
    );
  }
};
</script>

<style scoped>
/* Container Styling */
.container {
  margin-top: 2rem;
}

/* Spinner Styling */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #555;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Material Design Text Field Styling */
.mdc-text-field {
  position: relative;
  margin-bottom: 1.5rem;
  display: inline-block;
  width: 100%;
}

.mdc-text-field__input {
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.75rem 0.5rem;
  border: 1px solid #000;
  border-radius: 10px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
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

/* Button Styling */
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

/* Color Picker Styling */
.color-picker {
  position: relative;
  overflow: visible;    /* allow the popup to show outside the box */
  z-index: 99999 !important;        /* ensure it’s above other siblings */
}

.color-input {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  width: 36px;
  height: 36px;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
}

.color-text-input {
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.75rem 2.5rem 0.75rem 0.5rem;
  border: 1px solid #000;
  border-radius: 10px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  padding-right: 36px;
}

.font-bold {
  font-weight: 700;
}

/* Custom Classes */
.border-green {
  border-color: green;
}

.border-black {
  border-color: black;
}
</style>
