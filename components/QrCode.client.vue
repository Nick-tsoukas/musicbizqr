<template>
  <div class="flex flex-col items-center p-4">
    <div ref="qrcode" class="p-4 border border-gray-300 rounded-lg shadow-md"></div>
    <div class="mt-4 flex flex-col space-y-2">
      <label v-if="type === 'externalURL'" class="flex items-center">
        <span class="mr-2">Data URL:</span>
        <input v-model="externalURL" type="text" class="border rounded p-2" placeholder="Enter URL" />
      </label>
      <label class="flex items-center">
        <span class="mr-2">Dot Color:</span>
        <input v-model="options.dotsOptions.color" type="color" class="border rounded p-2" />
      </label>
      <label class="flex items-center">
        <span class="mr-2">Background Color:</span>
        <input v-model="options.backgroundOptions.color" type="color" class="border rounded p-2" />
      </label>
      <label class="flex items-center">
        <span class="mr-2">Dot Type:</span>
        <select v-model="options.dotsOptions.type" class="border rounded p-2">
          <option value="rounded">Rounded</option>
          <option value="dots">Dots</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
          <option value="square">Square</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </label>
      <button @click="saveQrCode" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Sace QR Code
      </button>
      <!-- <button @click="downloadQRCode" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Download QR Code
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid';
const { create } = useStrapi()
const user = useStrapiUser()
const router = useRouter()

const client =  useStrapiClient()
const uuid = uuidv4();
const url = `https://localhost:3000/directqr?id=${uuid}`;

console.log('user', user.value.id)


import QRCodeStyling from 'qr-code-styling'

const props = defineProps({
  type: String,
})

const qrcode = ref(null)
const options = reactive({
  width: 300,
  height: 300,
  data: `https://localhost:3000/directqr?id=${uuid}`,
  dotsOptions: {
    color: '#4267b2',
    type: 'rounded'
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 20,
  }
})

let qrCodeStyling

const initializeQrCode = async () => {
 try {
  qrCodeStyling = await new QRCodeStyling({ ...options })
  console.log('initiziling qr code does qr have value  ', qrcode.value)
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
  // need to add a unique qr id to the url 
  try {
   console.log(user)

    const blob = await qrCodeStyling.getRawData('image/png')
    const file  = new File([blob], 'qrcode.png')
    const formData = new FormData();
    const form = { url: options.data,  users_permissions_user: user.value.id, }
    formData.append('files.q_image', file, 'qrcode.png');
    formData.append('data', JSON.stringify(form))

    consolelog(form)
    const { data } = await client(`/qrs`, {
      method: 'POST',
      body: formData
    })
    console.log(data)
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
