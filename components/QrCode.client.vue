<template>
  <div class="flex flex-col items-center p-4">
    <div ref="qrcode" class="p-4 border border-gray-300 rounded-lg shadow-md"></div>
    <div class="mt-4 flex flex-col space-y-4 w-full max-w-md">
      <label  class="flex flex-col">
        <span class="mb-1 text-gray-700">Name of QR:</span>
        <input v-model="name" type="text" class="input-field" placeholder="Enter URL" />
      </label>
      <label v-if="type === 'externalURL'" class="flex flex-col">
        <span class="mb-1 text-gray-700">Data URL:</span>
        <input v-model="link" type="text" class="input-field" placeholder="Enter URL" />
      </label>
      <label class="flex flex-col">
        <span class="mb-1 text-gray-700">Background Color:</span>
        <input v-model="options.backgroundOptions.color" type="color" class="input-field-color" />
      </label>
      <label class="flex flex-col">
        <span class="mb-1 text-gray-700">Dot Color:</span>
        <input type="color" id="color" v-model="options.dotsOptions.color" class="input-field-color" />
      </label>
      <label class="flex flex-col">
        <span class="mb-1 text-gray-700">Dot Type:</span>
        <select v-model="options.dotsOptions.type" class="input-field">
          <option value="rounded">Rounded</option>
          <option value="dots">Dots</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
          <option value="square">Square</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </label>
      <label class="flex flex-col">
        <span class="mb-1 text-gray-700">Corner Square Color:</span>
        <input v-model="options.cornersSquareOptions.color" type="color" class="input-field-color" />
      </label>
      <label class="flex flex-col">
        <span class="mb-1 text-gray-700">Corner Square Type:</span>
        <select v-model="options.cornersSquareOptions.type" class="input-field">
          <option value="dot">Dot</option>
          <option value="square">Square</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </label>
      <label class="flex flex-col">
        <span class="mb-1 text-gray-700">Corner Dot Color:</span>
        <input v-model="options.cornersDotOptions.color" type="color" class="input-field-color" />
      </label>
      <label class="flex flex-col">
        <span class="mb-1 text-gray-700">Upload Logo:</span>
        <input type="file" @change="handleImageUpload" class="input-field" />
      </label>
      <button @click="saveQrCode" class="btn-primary mt-4">
        Save QR Code
      </button>

    </div>
  </div>
</template>



<script setup>
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
  try {
    const form = {
      url: options.data,
      users_permissions_user: { id: user.value.id },
      q_type : route.query.type,
      link: link.value,
      name: name.value,
      scanTime: [{date: 'some date one '}, {date: 'some date two'}]
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
  } catch (error) {
    console.error(error);
  }
};

watch(() => options, updateQrCode, { deep: true })
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.input-field-color {
  width: 100%;
  height: 40px;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #6200ea;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #3700b3;
}

label span {
  font-weight: 500;
  color: #333;
}

label {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
</style>


