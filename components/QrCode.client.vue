<template>
  <div class="flex flex-col items-center p-4">
    <div ref="qrcode" class="p-4 border border-gray-300 rounded-lg shadow-md"></div>
    <div class="mt-4 flex flex-col space-y-4 w-full max-w-md">
      <label class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">Name of QR:</span>
        <input v-model="name" type="text" class="mdc-text-field__input" placeholder="Enter URL" />
        <span class="mdc-line-ripple"></span>
      </label>
      <label v-if="type === 'externalURL'" class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">Data URL:</span>
        <input v-model="link" type="text" class="mdc-text-field__input" placeholder="Enter URL" />
        <span class="mdc-line-ripple"></span>
      </label>
      <h2 class="font-bold">Background Options</h2>
      <label class="color-picker-label mb-4">
        <span class="mb-1 text-gray-700">Background Color:</span>
        <div class="color-picker">
          <input v-model="options.backgroundOptions.color" type="text" class="color-text-input" />
          <input v-model="options.backgroundOptions.color" type="color" class="color-input" />
        </div>
      </label>
      <h2 class="font-bold">Dot Options</h2>
      <label class="color-picker-label mb-4">
        <span class="mb-1 text-gray-700">Dot Color:</span>
        <div class="color-picker">
          <input v-model="options.dotsOptions.color" type="text" class="color-text-input" />
          <input type="color" id="color" v-model="options.dotsOptions.color" class="color-input" />
        </div>
      </label>
      <label class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">Dot Type:</span>
        <select v-model="options.dotsOptions.type" class="mdc-text-field__input">
          <option value="rounded">Rounded</option>
          <option value="dots">Dots</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
          <option value="square">Square</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
        <span class="mdc-line-ripple"></span>
      </label>
      <h2 class="font-bold">Corner Options</h2>
      <label class="color-picker-label mb-4">
        <span class="mb-1 text-gray-700">Corner Square Color:</span>
        <div class="color-picker">
          <input v-model="options.cornersSquareOptions.color" type="text" class="color-text-input" />
          <input v-model="options.cornersSquareOptions.color" type="color" class="color-input" />
        </div>
      </label>
      <label class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">Corner Square Type:</span>
        <select v-model="options.cornersSquareOptions.type" class="mdc-text-field__input">
          <option value="dot">Dot</option>
          <option value="square">Square</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
        <span class="mdc-line-ripple"></span>
      </label>
      <label class="color-picker-label mb-4">
        <span class="mb-1 text-gray-700">Corner Dot Color:</span>
        <div class="color-picker">
          <input v-model="options.cornersDotOptions.color" type="text" class="color-text-input" />
          <input v-model="options.cornersDotOptions.color" type="color" class="color-input" />
        </div>
      </label>
      <h2 class="font-bold">Image Options</h2>
      <label class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">Upload Logo:</span>
        <input type="file" @change="handleImageUpload" class="mdc-text-field__input" />
        <span class="mdc-line-ripple"></span>
      </label>
      <button @click="saveQrCode" class="mdc-button mdc-button--raised w-full mt-4">
        Save QR Code
      </button>
    </div>
  </div>
</template>




<script setup>
// https://codepen.io/JamieCurnow/pen/KKPjraK
import { ref, reactive, onMounted, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import QRCodeStyling from 'qr-code-styling'

const props = defineProps({
  type: String,
})

const { create, findOne, update } = useStrapi()
const user = useStrapiUser()
const router = useRouter()
const route = useRoute()
const client = useStrapiClient()
const uuid = uuidv4();

const url = `https://localhost:3000/directqr?id=${uuid}`;

const qrcode = ref(null)
const link = ref(null)
const color = ref('#ffffff')
const name = ref('name')

const options = reactive({
  width: 300,
  height: 300,
  data: `https://localhost:3000/directqr?id=${uuid}`,
  dotsOptions: {
    color: '#000000',
    type: 'rounded',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 20,
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'square',
  },
  cornersDotOptions: {
    color: '#000000',
  }
})

console.log({...options})

const gradient = {
  type: 'linear',
  rotation: 0,
  colorStops: [
    { offset: 0, color: '#000000' },
    { offset: 1, color: '#ffffff' }
  ]
}

let qrCodeStyling

const initializeQrCode = async () => {
  try {
    qrCodeStyling = await new QRCodeStyling({ ...options })
    if (qrcode.value) {
      qrCodeStyling.append(qrcode.value)
    }
  } catch (error) {
    console.log(error)
  }
}

const updateQrCode = () => {
  if (qrCodeStyling) {
    qrCodeStyling.update(options)
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      options.image = e.target.result;
      updateQrCode();
    };
    reader.readAsDataURL(file);
  }
};

onMounted(() => {
  initializeQrCode()
})

const saveQrCode = async () => {
  console.log(options.value, 'this is the options ')
  try {
    const form = {
      url: options.data,
      users_permissions_user: { id: user.value.id },
      q_type : route.query.type,
      link: link.value,
      name: name.value,
      options:{ ...options }
      // scanTime: [{date: 'some date one '}, {date: 'some date two'}]
    }

    const blob = await qrCodeStyling.getRawData('image/png')
    const file = new File([blob], 'qrcode.png')
    const formData = new FormData();
    formData.append('files.q_image', file, 'qrcode.png');
    formData.append('data', JSON.stringify(form))

    const { data } = await client(`/qrs`, {
      method: 'POST',
      body: formData
    })

    console.log(props.type , 'test target', )
    if(props.type === 'externalURL') {
      router.push('/dashboard')
    }
    if(props.type === 'bandProfile') {
      router.push({ name: 'createband', query: { qrId: data.id } });
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error(error);
  }
};

watch(() => options, updateQrCode, { deep: true })
</script>


<style scoped>
/* Basic Container Styling */
.container-mdc {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Title Styling */
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
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
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
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
  background-color: #6200ee;
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

.cancel-icon {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  cursor: pointer;
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
   border-radius: 50%; /* Makes the input rounded */
}

.color-text-input {
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.75rem 2.5rem 0.75rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  padding-right: 36px; /* Adjust padding to accommodate the color input */
}
</style>