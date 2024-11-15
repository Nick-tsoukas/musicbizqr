<template>
  <div class="flex flex-col items-center p-4 w-full">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <div ref="qrcodeWrapper">
    <qrcode-vue
      v-bind="qrProps"
      class="p-4 border border-gray-300 rounded-lg shadow-md"
    />
    </div>

    <div class="mt-4 flex flex-col space-y-4 w-full">
      <!-- QR Name -->
      <div class="bg-white rounded-md">
        <div class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
          <span class="mb-1 text-white text-xl font-semibold">Name of QR</span>
        </div>
        <div class="p-4">
          <label class="mdc-text-field mb-4">
            <input v-model="name" type="text" class="mdc-text-field__input" placeholder="Enter QR Name" />
            <span class="mdc-line-ripple"></span>
          </label>
        </div>
      </div>

      <!-- Choose QR Type -->
      <div class="bg-white rounded-md">
        <div class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
          <span class="mb-1 text-white text-xl font-semibold">Edit QR Type</span>
        </div>
        <div class="p-4">
          <div class="flex flex-wrap gap-4">
            <!-- Band -->
            <div
              @click="handleSelection('band')"
              :class="{ 'border-green': q_type == 'band', 'border-black': q_type !== 'band' }"
              class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
            >
              <span>Band</span>
            </div>
            <!-- Event -->
            <div
              @click="handleSelection('event')"
              :class="{ 'border-green': q_type == 'event', 'border-black': q_type !== 'event' }"
              class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
            >
              <span>Event</span>
            </div>
            <!-- Tour -->
            <div
              @click="handleSelection('tour')"
              :class="{ 'border-green': q_type == 'tour', 'border-black': q_type !== 'tour' }"
              class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
            >
              <span>Tour</span>
            </div>
            <!-- Album -->
            <div
              @click="handleSelection('album')"
              :class="{ 'border-green': q_type == 'album', 'border-black': q_type !== 'album' }"
              class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
            >
              <span>Album</span>
            </div>
            <!-- External Link -->
            <div
              @click="handleSelection('link')"
              :class="{ 'border-green': q_type == 'link', 'border-black': q_type !== 'link' }"
              class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
            >
              <span>Link URL</span>
            </div>
          </div>
        </div>
      </div>

      <!-- External Link Input (if applicable) -->
      <div v-if="q_type === 'link'" class="bg-white rounded-md p-4">
        <label class="mdc-text-field mb-4">
          <span class="mb-1 text-gray-700">External Link:</span>
          <input v-model="link" type="text" class="mdc-text-field__input" placeholder="Enter URL" />
          <span class="mdc-line-ripple"></span>
        </label>
      </div>

      <!-- QR Type Selection -->
      <div class="bg-white rounded-md">
        <div class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="font-semibold text-white text-xl">Select Associated Content</h2>
        </div>
        <div class="p-4">
          <!-- Band Selection -->
          <div v-if="q_type === 'band'">
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Select Band:</span>
              <select v-model="selectedBand" class="mdc-text-field__input">
                <option value="">Select a band</option>
                <option v-for="band in bands" :key="band.id" :value="band.id">{{ band.attributes.name }}</option>
                <option value="createNew">Create New Band</option>
              </select>
              <span class="mdc-line-ripple"></span>
            </label>
          </div>

          <!-- Album Selection -->
          <div v-if="q_type === 'album'">
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Select Album:</span>
              <select v-model="selectedAlbum" class="mdc-text-field__input">
                <option value="">Select an album</option>
                <option v-for="album in albums" :key="album.id" :value="album.id">{{ album.attributes.title }}</option>
                <option value="createNew">Create New Album</option>
              </select>
              <span class="mdc-line-ripple"></span>
            </label>
          </div>

          <!-- Tour Selection -->
          <div v-if="q_type === 'tour'">
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Select Tour:</span>
              <select v-model="selectedTour" class="mdc-text-field__input">
                <option value="">Select a tour</option>
                <option v-for="tour in tours" :key="tour.id" :value="tour.id">{{ tour.attributes.title }}</option>
                <option value="createNew">Create New Tour</option>
              </select>
              <span class="mdc-line-ripple"></span>
            </label>
          </div>

          <!-- Event Selection -->
          <div v-if="q_type === 'event'">
            <label class="mdc-text-field mb-4">
              <span class="mb-1 text-gray-700">Select Event:</span>
              <select v-model="selectedEvent" class="mdc-text-field__input">
                <option value="">Select an event</option>
                <option v-for="event in events" :key="event.id" :value="event.id">{{ event.attributes.title }}</option>
                <option value="createNew">Create New Event</option>
              </select>
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Background Options -->
      <div class="bg-white rounded-md">
        <div class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
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
        <div class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="font-semibold text-white text-xl">Foreground Options</h2>
        </div>
        <div class="p-4">
          <label class="color-picker-label mb-4">
            <span class="mb-1 text-gray-700">Foreground Color:</span>
            <div class="color-picker">
              <input v-model="fgColor" type="text" class="color-text-input" />
              <input v-model="fgColor" type="color" class="color-input" />
            </div>
          </label>
        </div>
      </div>

      <!-- Gradient Options -->
      <div class="bg-white rounded-md">
        <div class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
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
              <span class="mb-1 text-gray-700">Gradient Rotation (degrees):</span>
              <input v-model.number="gradientRotation" type="number" class="mdc-text-field__input" min="0" max="360" />
              <span class="mdc-line-ripple"></span>
            </label>
            <label class="color-picker-label mb-4">
              <span class="mb-1 text-gray-700">Gradient Start Color:</span>
              <div class="color-picker">
                <input v-model="gradientStartColor" type="text" class="color-text-input" />
                <input v-model="gradientStartColor" type="color" class="color-input" />
              </div>
            </label>
            <label class="color-picker-label mb-4">
              <span class="mb-1 text-gray-700">Gradient End Color:</span>
              <div class="color-picker">
                <input v-model="gradientEndColor" type="text" class="color-text-input" />
                <input v-model="gradientEndColor" type="color" class="color-input" />
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Image Options -->
      <div class="bg-white rounded-md">
        <div class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="font-semibold text-white text-xl">Image Options</h2>
        </div>
        <div class="p-4">
          <label class="mdc-text-field mb-4">
            <span class="mb-1 text-gray-700">Upload Logo:</span>
            <input type="file" @change="handleImageUpload" class="mdc-text-field__input" />
            <span class="mdc-line-ripple"></span>
          </label>
        </div>
      </div>

      <!-- Update Button -->
      <button @click="updateQrCodeSubmit" class="mdc-button w-full mt-10">
        Update QR Code
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import QrcodeVue from 'qrcode.vue';


const qrcodeWrapper = ref(null);

const props = defineProps({
  type: String,
});

const { findOne, find } = useStrapi();
const user = useStrapiUser();
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();

const loading = ref(false);

const { data } = await findOne('qrs', route.params.id, {
  populate: {
    event: { populate: '*' },
    tour: { populate: '*' },
    album: { populate: '*' },
    band: { populate: '*' },
  },
});

const qrcodeRef = ref(null);
const q_type = ref(data.attributes.q_type || null);
const link = ref(data.attributes.link || null);
const name = ref(data.attributes.name || 'add name');

const qrValue = ref(data.attributes.url || '');
const qrSize = ref(data.attributes.options?.size || 300);
const qrLevel = ref(data.attributes.options?.level || 'L');
const bgColor = ref(data.attributes.options?.background || '#FFFFFF');
const fgColor = ref(data.attributes.options?.foreground || '#000000');

const gradient = ref(data.attributes.options?.gradient || false);
const gradientType = ref(data.attributes.options?.gradientType || 'linear');
const gradientRotation = ref(data.attributes.options?.gradientRotation || 0);
const gradientStartColor = ref(data.attributes.options?.gradientStartColor || '#e6289d');
const gradientEndColor = ref(data.attributes.options?.gradientEndColor || '#40353c');

const imageSettings = reactive({
  src: data.attributes.options?.imageSettings?.src || '',
  height: data.attributes.options?.imageSettings?.height || 60,
  width: data.attributes.options?.imageSettings?.width || 60,
  excavate: data.attributes.options?.imageSettings?.excavate || true,
});

const qrProps = reactive({
  value: qrValue.value,
  size: qrSize.value,
  level: qrLevel.value,
  background: bgColor.value,
  foreground: fgColor.value,
  imageSettings: { ...imageSettings },
});

watch(
  [
    qrValue,
    qrSize,
    qrLevel,
    bgColor,
    fgColor,
    gradient,
    gradientType,
    gradientRotation,
    gradientStartColor,
    gradientEndColor,
    () => imageSettings.src,
  ],
  () => {
    qrProps.value = qrValue.value;
    qrProps.size = qrSize.value;
    qrProps.level = qrLevel.value;
    qrProps.background = bgColor.value;
    qrProps.imageSettings = { ...imageSettings };

    if (gradient.value) {
      qrProps.gradient = true;
      qrProps.gradientType = gradientType.value;
      qrProps.gradientRotation = gradientRotation.value;
      qrProps.gradientStartColor = gradientStartColor.value;
      qrProps.gradientEndColor = gradientEndColor.value;
      qrProps.foreground = null;
    } else {
      qrProps.gradient = false;
      qrProps.foreground = fgColor.value;
    }
  },
  { deep: true }
);

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

const bands = ref([]);
const events = ref([]);
const tours = ref([]);
const albums = ref([]);

const selectedEvent = ref(data.attributes.event?.data?.id ?? null);
const selectedTour = ref(data.attributes.tour?.data?.id ?? null);
const selectedAlbum = ref(data.attributes.album?.data?.id ?? null);
const selectedBand = ref(data.attributes.band?.data?.id ?? null);

const fetchUserRelatedData = async () => {
  try {
    const bandsResponse = await find('bands', { filters: { users_permissions_user: { id: user.value.id } } });
    bands.value = bandsResponse.data;

    const eventsResponse = await find('events', { filters: { users_permissions_user: { id: user.value.id } } });
    events.value = eventsResponse.data;

    const toursResponse = await find('tours', { filters: { users_permissions_user: { id: user.value.id } } });
    tours.value = toursResponse.data;

    const albumsResponse = await find('albums', { filters: { users_permissions_user: { id: user.value.id } } });
    albums.value = albumsResponse.data;
  } catch (error) {
    console.error('Error fetching user-related data:', error);
  }
};

fetchUserRelatedData();

const handleSelection = (type) => {
  q_type.value = type;
  link.value = null;
  selectedBand.value = null;
  selectedAlbum.value = null;
  selectedTour.value = null;
  selectedEvent.value = null;

  if (type === 'link') {
    qrValue.value = link.value || '';
  }
};

const updateQrCodeSubmit = async () => {
  const qrId = route.params.id;
  try {
    loading.value = true;
    const formData = new FormData();
    const form = {
      url: qrValue.value,
      users_permissions_user: { id: user.value.id },
      q_type: q_type.value,
      link: link.value,
      name: name.value,
      options: {
        size: qrSize.value,
        level: qrLevel.value,
        background: bgColor.value,
        foreground: fgColor.value,
        gradient: gradient.value,
        gradientType: gradientType.value,
        gradientRotation: gradientRotation.value,
        gradientStartColor: gradientStartColor.value,
        gradientEndColor: gradientEndColor.value,
        imageSettings: { ...imageSettings },
      },
      band: selectedBand.value !== 'createNew' ? selectedBand.value : null,
      album: selectedAlbum.value !== 'createNew' ? selectedAlbum.value : null,
      event: selectedEvent.value !== 'createNew' ? selectedEvent.value : null,
      tour: selectedTour.value !== 'createNew' ? selectedTour.value : null,
    };

    // const canvas = qrcodeRef.value.$el.querySelector('canvas');
    const canvas = qrcodeWrapper.value.querySelector('canvas');

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'qrcode.png');

    formData.append('files.q_image', file, 'qrcode.png');
    formData.append('data', JSON.stringify(form));

    await client(`/qrs/${qrId}`, {
      method: 'PUT',
      body: formData,
    });

    // Routing after successful update based on selected values
    if (selectedBand.value === 'createNew') {
      router.push({ path: '/createband', query: { createnew: 'createNew', qrId: qrId } });
    } else if (selectedAlbum.value === 'createNew') {
      router.push({ path: '/newalbum', query: { createnew: 'createNew', qrId: qrId } });
    } else if (selectedTour.value === 'createNew') {
      router.push({ path: '/newtour', query: { createnew: 'createNew', qrId: qrId } });
    } else if (selectedEvent.value === 'createNew') {
      router.push({ path: '/newevent', query: { createnew: 'createNew', qrId: qrId } });
    } else {
      router.push('/dashboard');
    }
  } catch (error) {
    loading.value = false;
    console.error('Error updating QR code:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
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
  background-color: #2C2C2C;
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
