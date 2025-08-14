<template>
  <div class="container mx-auto pb-14">
    <div class="flex flex-col items-center p-4 max-w-5xl mx-auto">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
      </div>
      <!-- QR Code Wrapper -->
      <transition name="fade">
        <div
          ref="qrcodeWrapper"
          class="p-4 border sticky top-0 z-50 border-gray-300 rounded-lg shadow-md"
        >
          <!-- QR code will be rendered here by qr-code-styling -->
        </div>
      </transition>
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
                  'border-green border-4': q_type == 'bandProfile',
                  'border-black': q_type !== 'bandProfile',
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Artist Link Tree Page</span>
              </div>
              <!-- Event -->
              <!-- <div
                @click="selectType('events')"
                :class="{
                  'border-green': q_type == 'events',
                  'border-black': q_type !== 'events'
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Event</span>
              </div> -->
              <!-- Tour -->
              <!-- <div
                @click="selectType('tours')"
                :class="{
                  'border-green': q_type == 'tours',
                  'border-black': q_type !== 'tours'
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Tour</span>
              </div> -->
              <!-- Album -->
              <!-- <div
                @click="selectType('albums')"
                :class="{
                  'border-green': q_type == 'albums',
                  'border-black': q_type !== 'albums'
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Album</span>
              </div> -->
              <!-- Social Links -->
              <!-- <div
                @click="selectType('social')"
                :class="{
                  'border-green': q_type == 'social',
                  'border-black': q_type !== 'social'
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Social Links</span>
              </div> -->
              <!-- Stream -->
              <!-- <div
                @click="selectType('stream')"
                :class="{
                  'border-green': q_type == 'stream',
                  'border-black': q_type !== 'stream'
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Stream</span>
              </div> -->
              <!-- External URL -->
              <div
                @click="selectType('externalURL')"
                :class="{
                  'border-green border-4': q_type == 'externalURL',
                  'border-black ': q_type !== 'externalURL',
                }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>External Link URL</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Band Selection (Only show if q_type === 'bandProfile') -->
        <div v-if="q_type === 'bandProfile'" class="bg-white rounded-md p-4">
          <label class="mdc-text-field mb-4">
            <span class="mb-1 text-gray-700">Select Band:</span>
            <select v-model="selectedBand" class="mdc-text-field__input">
              <option disabled value="">Select a band</option>
              <!-- "None" option if they don't want to associate this QR with a band -->
              <option :value="null">None</option>
              <!-- Render each band from bands.value -->
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
        <div v-if="q_type === 'externalURL'" class="bg-white rounded-md p-4">
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

        <!-- Background Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">Background Options</h2>
          </div>
          <div class="p-4">
            <label class="color-picker-label mb-4">
              <span class="mb-1 text-gray-700">Background Color:</span>
              <div class="color-picker">
                <input v-model="bgColor" type="text" class="color-text-input" />
                <input v-model="bgColor" type="color" class="color-input" />
              </div>
            </label>
          </div>
        </div>

        <!-- Foreground Options -->
        <div v-if="!gradient" class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">Foreground Options</h2>
          </div>
          <div class="p-4">
            <label class="color-picker-label mb-4">
              <span class="mb-1 text-gray-700">Foreground Color:</span>
              <div class="color-picker">
                <input
                  v-model="dotsColor"
                  type="text"
                  class="color-text-input"
                />
                <input v-model="dotsColor" type="color" class="color-input" />
              </div>
            </label>
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
              <label class="color-picker-label mb-4">
                <span class="mb-1 text-gray-700">Gradient Start Color:</span>
                <div class="color-picker">
                  <input
                    v-model="gradientStartColor"
                    type="text"
                    class="color-text-input"
                  />
                  <input
                    v-model="gradientStartColor"
                    type="color"
                    class="color-input"
                  />
                </div>
              </label>
              <label class="color-picker-label mb-4">
                <span class="mb-1 text-gray-700">Gradient End Color:</span>
                <div class="color-picker">
                  <input
                    v-model="gradientEndColor"
                    type="text"
                    class="color-text-input"
                  />
                  <input
                    v-model="gradientEndColor"
                    type="color"
                    class="color-input"
                  />
                </div>
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

        <!-- QR Encoding Options -->
        <div class="bg-white rounded-md">
          <div
            class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0"
          >
            <h2 class="font-semibold text-white text-xl">
              QR Encoding Options
            </h2>
          </div>
          <div class="p-4 grid gap-4 md:grid-cols-3">
            <!-- Type Number -->
            <label class="mdc-text-field">
              <span class="mb-1 text-gray-700 block">Type Number (0–40)</span>
              <input
                v-model.number="qrTypeNumber"
                type="number"
                min="0"
                max="40"
                class="mdc-text-field__input"
                placeholder="0 (auto)"
              />
              <span class="mdc-line-ripple"></span>
              <small class="text-gray-500 block mt-1">
                0 = auto. Higher = more modules (denser dots).
              </small>
            </label>

            <!-- Error Correction -->
            <label class="mdc-text-field">
              <span class="mb-1 text-gray-700 block">Error Correction</span>
              <select v-model="qrEcLevel" class="mdc-text-field__input">
                <option value="L">L (Low)</option>
                <option value="M">M (Medium)</option>
                <option value="Q">Q (Quartile)</option>
                <option value="H">H (High)</option>
              </select>
              <span class="mdc-line-ripple"></span>
              <small class="text-gray-500 block mt-1">
                Higher = more redundancy (slightly denser).
              </small>
            </label>

            <!-- Quiet Zone / Margin -->
            <label class="mdc-text-field">
              <span class="mb-1 text-gray-700 block">Quiet Zone (margin)</span>
              <input
                v-model.number="qrMargin"
                type="number"
                min="0"
                class="mdc-text-field__input"
                placeholder="4"
              />
              <span class="mdc-line-ripple"></span>
              <small class="text-gray-500 block mt-1">
                White border (modules) around the code.
              </small>
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
                <option value="extra-rounded">Extra Rounded</option>
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

        <!-- Update Button -->
        <button @click="updateQrCodeSubmit" class="mdc-button w-full mt-4">
          Update QR Code
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();
const { findOne, find } = useStrapi();
const user = useStrapiUser();
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();

const loading = ref(false);
const qrcodeWrapper = ref(null);
const qrCode = ref(null);
const qrData = ref(null);

const qrValue = ref("");
const qrSize = ref(300);

const bgColor = ref("#FFFFFF");
const gradient = ref(false);
const gradientType = ref("linear");
const gradientRotation = ref(0);
const gradientStartColor = ref("#e6289d");
const gradientEndColor = ref("#40353c");

const name = ref("name");
const link = ref("");
const q_type = ref(null);

// qrOptions controls
const qrTypeNumber = ref(0)   // 0 = auto, 1–40 fixed
const qrEcLevel = ref("Q")    // L, M, Q, H
const qrMargin = ref(4)       // quiet zone (modules)

const imageSettings = reactive({
  src: "",
  imageSize: 0.4,
  margin: 0,
  crossOrigin: "anonymous",
});

const dotsColor = ref("#000000");
const dotsType = ref("square");

const cornersSquareColor = ref("#000000");
const cornersSquareType = ref("square");

const cornersDotColor = ref("#000000");
const cornersDotType = ref("square");

const bands = ref([]);
const events = ref([]);
const tours = ref([]);
const albums = ref([]);

const selectedEvent = ref(null);
const selectedTour = ref(null);
const selectedAlbum = ref(null);
const selectedBand = ref(null);

function normalizeLink(val) {
  if (!val) return "";
  if (/^https?:\/\//i.test(val)) return val.trim();
  if (/^www\./i.test(val)) return `https://${val.trim()}`;
  return `https://www.${val.trim()}`;
}

// Live sync for externalURL type
watch(link, (val) => {
  if (q_type.value === "externalURL") {
    qrValue.value = normalizeLink(val || "");
    updateQRCodeDebounced();
  }
});

// Debounced QR update
const updateQRCodeDebounced = useDebounceFn(() => {
  if (qrCode.value) {
    qrCode.value.update(getQRCodeOptions());
  }
}, 150);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await findOne("qrs", route.params.id, {
      populate: {
        event: { populate: "*" },
        tour: { populate: "*" },
        album: { populate: "*" },
        band: { populate: "*" },
        q_image: { populate: "*" },
      },
    });
    qrData.value = response.data;
    initializeVariables();

    if (process.client) {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      qrCode.value = new QRCodeStyling(getQRCodeOptions());
      qrCode.value.append(qrcodeWrapper.value);
      updateQRCodeDebounced();
      initializeWatcher();
    }
  } catch (err) {
    console.error("Error fetching QR code data:", err);
  } finally {
    loading.value = false;
  }
});

function initializeVariables() {
  const data = qrData.value.attributes;

   // qrOptions (with safe defaults)
   qrTypeNumber.value = data.options?.qrOptions?.typeNumber ?? 0
  qrEcLevel.value    = data.options?.qrOptions?.errorCorrectionLevel ?? "Q"
  qrMargin.value     = data.options?.qrOptions?.margin ?? 4
  q_type.value = data.q_type || null;
  link.value = data.link || "";
  name.value = data.name || "add name";
  qrValue.value = data.url || "";
  qrSize.value = data.options?.size || 300;

  bgColor.value = data.options?.backgroundOptions?.color || "#FFFFFF";

  gradient.value = !!data.options?.dotsOptions?.gradient;
  gradientType.value = data.options?.dotsOptions?.gradient?.type || "linear";
  gradientRotation.value = data.options?.dotsOptions?.gradient?.rotation
    ? (data.options.dotsOptions.gradient.rotation * 180) / Math.PI
    : 0;
  gradientStartColor.value =
    data.options?.dotsOptions?.gradient?.colorStops?.[0]?.color || "#e6289d";
  gradientEndColor.value =
    data.options?.dotsOptions?.gradient?.colorStops?.[1]?.color || "#40353c";

  imageSettings.src =
    data.options?.imageOptions?.src || data.options?.image || "";
  imageSettings.imageSize = data.options?.imageOptions?.imageSize || 0.7;
  imageSettings.margin = data.options?.imageOptions?.margin || 0;
  imageSettings.crossOrigin = "anonymous";

  dotsColor.value = data.options?.dotsOptions?.color || "#000000";
  dotsType.value = data.options?.dotsOptions?.type || "square";

  cornersSquareColor.value =
    data.options?.cornersSquareOptions?.color || "#000000";
  cornersSquareType.value =
    data.options?.cornersSquareOptions?.type || "square";

  cornersDotColor.value = data.options?.cornersDotOptions?.color || "#000000";
  cornersDotType.value = data.options?.cornersDotOptions?.type || "square";

  selectedEvent.value = data.event?.data?.id ?? null;
  selectedTour.value = data.tour?.data?.id ?? null;
  selectedAlbum.value = data.album?.data?.id ?? null;
  selectedBand.value = data.band?.data?.id ?? null;

  fetchUserRelatedData();
}

async function rebuildQr() {
  if (!process.client) return
  // Lazy import to avoid SSR hiccups
  const { default: QRCodeStyling } = await import("qr-code-styling")

  // Clear old node (this effectively "destroys" the instance)
  if (qrcodeWrapper.value) {
    qrcodeWrapper.value.innerHTML = ""
  }

  // Recreate with current options (including qrOptions.typeNumber / EC level)
  qrCode.value = new QRCodeStyling(getQRCodeOptions())
  qrCode.value.append(qrcodeWrapper.value)
}


function getQRCodeOptions() {
  const opts = {
    qrOptions: {
      typeNumber: qrTypeNumber.value,           // 0–40
      errorCorrectionLevel: qrEcLevel.value,    // L,M,Q,H
      margin: qrMargin.value,                   // quiet zone
      // mode: "Byte" // (optional) you can add this if you want to force Byte mode
    },
    width: qrSize.value,
    height: qrSize.value,
    data: qrValue.value || "https://musicbizqr.com",
    dotsOptions: { type: dotsType.value },
    cornersSquareOptions: {
      color: cornersSquareColor.value,
      type: cornersSquareType.value,
    },
    cornersDotOptions: {
      color: cornersDotColor.value,
      type: cornersDotType.value,
    },
    backgroundOptions: { color: bgColor.value },
    imageOptions: {
      crossOrigin: imageSettings.crossOrigin,
      margin: imageSettings.margin,
      imageSize: imageSettings.imageSize,
      src: imageSettings.src,
    },
  };

  if (imageSettings.src) {
    opts.image = imageSettings.src;
  }

  if (gradient.value) {
    opts.dotsOptions.gradient = {
      type: gradientType.value,
      rotation: (gradientRotation.value * Math.PI) / 180,
      colorStops: [
        { offset: 0, color: gradientStartColor.value },
        { offset: 1, color: gradientEndColor.value },
      ],
    };
  } else {
    opts.dotsOptions.color = dotsColor.value;
  }

  return opts;
}

function initializeWatcher() {
  watch(
    [qrTypeNumber, qrEcLevel, qrValue],
    async () => {
      await rebuildQr()
    }
  )
  
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
    updateQRCodeDebounced,
    { deep: true }
  );
}

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    imageSettings.src = e.target.result;
    if (qrCode.value) {
      qrCode.value.update({ image: imageSettings.src });
    }
  };
  reader.readAsDataURL(file);
};

const fetchUserRelatedData = async () => {
  try {
    bands.value = (
      await find("bands", {
        filters: { users_permissions_user: { id: user.value.id } },
      })
    ).data;
    events.value = (
      await find("events", {
        filters: { users_permissions_user: { id: user.value.id } },
      })
    ).data;
    tours.value = (
      await find("tours", {
        filters: { users_permissions_user: { id: user.value.id } },
      })
    ).data;
    albums.value = (
      await find("albums", {
        filters: { users_permissions_user: { id: user.value.id } },
      })
    ).data;
  } catch (err) {
    console.error("Error fetching user-related data:", err);
  }
};

const selectType = (type) => {
  q_type.value = type;
  selectedBand.value = null;
  selectedAlbum.value = null;
  selectedTour.value = null;
  selectedEvent.value = null;

  if (type === "externalURL") {
    qrValue.value = normalizeLink(link.value || "");
  }
  updateQRCodeDebounced();
};

const updateQrCodeSubmit = async () => {
  const qrId = route.params.id;
  try {
    loading.value = true;
    const formData = new FormData();

    if (q_type.value === "externalURL" && link.value) {
      qrValue.value = normalizeLink(link.value);
    }

    const form = {
      url: qrValue.value,
      users_permissions_user: { id: user.value.id },
      q_type: q_type.value,
      link: link.value,
      name: name.value,
      options: {
        size: qrSize.value,
        backgroundOptions: { color: bgColor.value },
        image: imageSettings.src,
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
      band: selectedBand.value !== "createNew" ? selectedBand.value : null,
      album: selectedAlbum.value !== "createNew" ? selectedAlbum.value : null,
      event: selectedEvent.value !== "createNew" ? selectedEvent.value : null,
      tour: selectedTour.value !== "createNew" ? selectedTour.value : null,
    };

    const blob = await qrCode.value.getRawData("png");
    const file = new File([blob], "qrcode.png");
    formData.append("files.q_image", file, "qrcode.png");
    formData.append("data", JSON.stringify(form));

    await client(`/qrs/${qrId}`, { method: "PUT", body: formData });

    if (selectedBand.value === "createNew") {
      router.push({
        path: "/createband",
        query: { createnew: "createNew", qrId },
      });
    } else if (selectedAlbum.value === "createNew") {
      router.push({
        path: "/newalbum",
        query: { createnew: "createNew", qrId },
      });
    } else if (selectedTour.value === "createNew") {
      router.push({
        path: "/newtour",
        query: { createnew: "createNew", qrId },
      });
    } else if (selectedEvent.value === "createNew") {
      router.push({
        path: "/newevent",
        query: { createnew: "createNew", qrId },
      });
    } else {
      router.push("/dashboard");
    }
  } catch (err) {
    console.error("Error updating QR code:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Container Styling */
.container {
  margin-top: 2rem;
}

/* Fade transition for the QR container */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
