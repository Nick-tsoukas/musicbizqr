<template>
  <div class="flex flex-col items-center p-4">
    <div ref="qrcode" class="p-4 border border-gray-300 rounded-lg shadow-md"></div>
    <div class="mt-4 flex flex-col space-y-2">
      <label v-if="type === 'externalURL'" class="flex items-center">
        <span class="mr-2">Data URL:</span>
        <input v-model="externalURL" type="text" class="border rounded p-2" placeholder="Enter URL" />
      </label>
      <div>
    </div>
      <label class="flex items-center">
        <span class="mr-2">Dot Color:</span>
        <input type="color" id="color" v-model="options.dotsOptions.color" />
      </label>
      <!-- <label class="flex items-center">
        <span class="mr-2">Dot Gradient Start:</span>
        <input v-model="options.dotsOptions.gradient.colorStops[0].color" type="color" class="border rounded p-2" />
      </label>
      <label class="flex items-center">
        <span class="mr-2">Dot Gradient End:</span>
        <input v-model="options.dotsOptions.gradient.colorStops[1].color" type="color" class="border rounded p-2" />
      </label> -->
      <label class="flex items-center">
        <span class="mr-2">Background Color:</span>
        <input v-model="options.backgroundOptions.color" type="color"  />
      </label>
      <!-- <label class="flex items-center">
        <span class="mr-2">Background Gradient Start:</span>
        <input v-model="options.backgroundOptions.gradient.colorStops[0].color" type="color" class="border rounded p-2" />
      </label>
      <label class="flex items-center">
        <span class="mr-2">Background Gradient End:</span>
        <input v-model="options.backgroundOptions.gradient.colorStops[1].color" type="color" class="border rounded p-2" />
      </label> -->
      <label class="flex items-center">
        <span class="mr-2">Dot Type:</span>
        <select v-model="options.dotsOptions.type" >
          <option value="rounded">Rounded</option>
          <option value="dots">Dots</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
          <option value="square">Square</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </label>
      <label class="flex items-center">
        <span class="mr-2">Corner Square Color:</span>
        <input v-model="options.cornersSquareOptions.color" type="color"  />
     
      </label>
      <!-- <label class="flex items-center">
        <span class="mr-2">Corner Square Gradient Start:</span>
        <input v-model="options.cornersSquareOptions.gradient.colorStops[0].color" type="color" class="border rounded p-2" />
      </label>
      <label class="flex items-center">
        <span class="mr-2">Corner Square Gradient End:</span>
        <input v-model="options.cornersSquareOptions.gradient.colorStops[1].color" type="color" class="border rounded p-2" />
      </label> -->
      <label class="flex items-center">
        <span class="mr-2">Corner Square Type:</span>
        <select v-model="options.cornersSquareOptions.type" >
          <option value="dot">Dot</option>
          <option value="square">Square</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </label>
      <label class="flex items-center">
        <span class="mr-2">Corner Dot Color:</span>
        <input v-model="options.cornersDotOptions.color" type="color"  />
      </label>
      <!-- <label class="flex items-center">
        <span class="mr-2">Corner Dot Gradient Start:</span>
        <input v-model="options.cornersDotOptions.gradient.colorStops[0].color" type="color" class="border rounded p-2" />
      </label>
      <label class="flex items-center">
        <span class="mr-2">Corner Dot Gradient End:</span>
        <input v-model="options.cornersDotOptions.gradient.colorStops[1].color" type="color" class="border rounded p-2" />
      </label> -->
      <button @click="saveQrCode" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Save QR Code
      </button>
      <button @click="textAPi" class="btn">Test api</button>
      <!-- <button @click="downloadQRCode" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Download QR Code
      </button> -->
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

const color = ref('#ffffff')
const form = reactive ({
  color: '#fdfdfff'
})
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

const  gradient = {
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

onMounted(() => {
  initializeQrCode()
})

const saveQrCode = async () => {
  try {
    const form = {
      url: options.data,
      users_permissions_user: { id: user.value.id },
      q_type : route.query.type
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

    console.log(data, 'this is data function')
    // router.push('/dashboard')

  } catch (error) {
    console.error(error);
  }
};

watch(() => options, updateQrCode, { deep: true })

</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
