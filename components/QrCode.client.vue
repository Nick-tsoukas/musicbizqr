<script setup>
import { ref, reactive, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import QrcodeVue from 'qrcode.vue';

const config = useRuntimeConfig(); // Access runtime configuration
const apiUrl = config.public.strapiUrl; // Get the API base URL

const props = defineProps({
  type: String,
});

const { create, findOne, update } = useStrapi();
const user = useStrapiUser();
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();
const uuid = uuidv4();

const qrValue = ref(`https://musicbizqr.com/?id=${uuid}`);
const qrSize = ref(300);
const qrLevel = ref('L');

const bgColor = ref('#FFFFFF');
const fgColor = ref('#000000');

const gradient = ref(false); // Toggle for enabling gradient
const gradientType = ref('linear'); // 'linear' or 'radial'
const gradientRotation = ref(0); // For linear gradient rotation
const gradientStartColor = ref('#e6289d');
const gradientEndColor = ref('#40353c');

const name = ref('name');
const link = ref(null);
const loading = ref(false);

const imageSettings = reactive({
  src: '', // Will be set when image is uploaded
  height: 60,
  width: 60,
  excavate: true,
});

const qrcodeRef = ref(null);

// Reactive QR code properties
const qrProps = reactive({
  value: qrValue.value,
  size: qrSize.value,
  level: qrLevel.value,
  background: bgColor.value,
  foreground: fgColor.value,
  imageSettings: { ...imageSettings },
});

// Watch for changes and update qrProps accordingly
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
      qrProps.foreground = null; // Reset foreground color when using gradient
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

const selectType = (selected) => {
  router.push({
    query: {
      ...route.query, // Preserve other query params if any
      type: selected,
    },
  });
};

const saveQrCode = async () => {
  try {
    loading.value = true;

    const form = {
      url: qrValue.value,
      users_permissions_user: { id: user.value.id },
      q_type: route.query.type,
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
    };

    const canvas = qrcodeRef.value.$el.querySelector('canvas');
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

    const file = new File([blob], 'qrcode.png');
    const formData = new FormData();
    formData.append('files.q_image', file, 'qrcode.png');
    formData.append('data', JSON.stringify(form));

    // Saving the QR code
    const { data } = await client(`/qrs`, {
      method: 'POST',
      body: formData,
    });

    console.log('QR code saved successfully:', data);

    // Redirect based on QR type
    if (data && data.id) {
      if (route.query.type === 'externalURL') {
        router.push('/dashboard');
      } else if (route.query.type === 'bandProfile') {
        router.push({ name: 'createband', query: { qrId: data.id } });
      } else if (route.query.type === 'events') {
        router.push({ name: 'newevent', query: { qrId: data.id } });
      } else if (route.query.type === 'tours') {
        router.push({ name: 'newtour', query: { qrId: data.id } });
      } else if (route.query.type === 'albums') {
        router.push({ name: 'newalbum', query: { qrId: data.id } });
      } else if (route.query.type === 'stream') {
        router.push({ name: 'createnewstreamlinks', query: { qrId: data.id } });
      } else if (route.query.type === 'social') {
        router.push({ name: 'socialpage', query: { qrId: data.id } });
      } else {
        router.push('/dashboard');
      }
    } else {
      loading.value = false;
      console.error('QR code was not saved, no ID found.');
    }
  } catch (error) {
    loading.value = false;
    console.error('Error during QR code save:', error.response ? error.response.data : error);
  }
};
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center p-4 max-w-5xl mx-auto">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
      </div>
      <qrcode-vue
        ref="qrcodeRef"
        v-bind="qrProps"
        class="p-4 border border-gray-300 rounded-lg shadow-md"
      />
      <div class="mt-4 flex flex-col space-y-4 w-full">
        <!-- Name Input -->
        <div class="bg-white rounded-md">
          <div class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
            <span class="mb-1 text-white text-xl font-semibold">Name</span>
          </div>
          <div class="p-4">
            <label class="mdc-text-field mb-4">
              <input v-model="name" type="text" class="mdc-text-field__input" placeholder="Enter Name" />
              <span class="mdc-line-ripple"></span>
            </label>
          </div>
        </div>
        <!-- Choose QR Type -->
        <div class="bg-white rounded-md">
          <div class="flex flex-col bg-black p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-6 gap-2 items-center md:flex-row md:gap-0">
            <span class="mb-1 text-white text-xl font-semibold">Choose QR Type</span>
          </div>
          <div class="p-4">
            <div class="flex flex-wrap gap-4">
              <!-- Band -->
              <div
                @click="selectType('bandProfile')"
                :class="{ 'border-green': route.query.type == 'bandProfile', 'border-black': route.query.type !== 'bandProfile' }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Band</span>
              </div>
              <!-- Event -->
              <div
                @click="selectType('events')"
                :class="{ 'border-green': route.query.type == 'events', 'border-black': route.query.type !== 'events' }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Event</span>
              </div>
              <!-- Tour -->
              <div
                @click="selectType('tours')"
                :class="{ 'border-green': route.query.type == 'tours', 'border-black': route.query.type !== 'tours' }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Tour</span>
              </div>
              <!-- Album -->
              <div
                @click="selectType('albums')"
                :class="{ 'border-green': route.query.type == 'albums', 'border-black': route.query.type !== 'albums' }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Album</span>
              </div>
              <!-- Social Links -->
              <div
                @click="selectType('social')"
                :class="{ 'border-green': route.query.type == 'social', 'border-black': route.query.type !== 'social' }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Social Links</span>
              </div>
              <!-- Stream -->
              <div
                @click="selectType('stream')"
                :class="{ 'border-green': route.query.type == 'stream', 'border-black': route.query.type !== 'stream' }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Stream</span>
              </div>
              <!-- External URL -->
              <div
                @click="selectType('externalURL')"
                :class="{ 'border-green': route.query.type == 'externalURL', 'border-black': route.query.type !== 'externalURL' }"
                class="cursor-pointer border-2 flex justify-center items-center px-6 py-2 rounded-sm shadow-lg"
              >
                <span>Link URL</span>
              </div>
            </div>
          </div>
        </div>
        <!-- External Link Input (if applicable) -->
        <div v-if="route.query.type === 'externalURL'" class="bg-white rounded-md p-4">
          <label class="mdc-text-field mb-4">
            <span class="mb-1 text-gray-700">External Link:</span>
            <input v-model="link" type="text" class="mdc-text-field__input" placeholder="Enter URL" />
            <span class="mdc-line-ripple"></span>
          </label>
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
        <!-- Save Button -->
        <button @click="saveQrCode" class="mdc-button w-full mt-4">
          Save QR Code
        </button>
      </div>
    </div>
  </div>
</template>

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
