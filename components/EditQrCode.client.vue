<template>
  <div class="flex flex-col items-center p-4">
    <div ref="qrcode" class="p-4 border border-gray-300 rounded-lg shadow-md"></div>
    
      <div class="text-left w-full my-4" >
        <h2 class="font-bold mb-2">Qr type</h2>
        <p  v-if="data.attributes.q_type" >{{ data.attributes.q_type }}</p>

        <div>
          <!-- <pre>{{ data }}</pre> -->
          <p v-if="data.attributes.q_type === 'band'">{{data.attributes.band.data.attributes.name}}</p>
          <p v-if="data.attributes.q_type === 'event'">{{data.attributes.event.data.attributes.title}}</p>
          <p v-if="data.attributes.q_type === 'tour'">{{data.attributes.tour.data.attributes.title}}</p>
        <p v-if="data.attributes.q_type === 'album'">{{data.attributes.album.data.attributes.title}}</p>



        </div>
      </div>
    <div class="mt-4 flex flex-col space-y-4 w-full max-w-md">
      <label class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">Name of QR:</span>
        <input v-model="name" type="text" class="mdc-text-field__input" placeholder="Enter URL" />
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
      <!-- add dropdowns here -->
      <h2 class="font-bold">Edit Qr Type </h2>
      <label class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">External Link:</span>
        <input v-model="link" @change="handleSelection('link')" type="text" class="mdc-text-field__input" placeholder="Enter URL" />
        <span class="mdc-line-ripple"></span>
      </label>
      <label class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">Select Band:</span>
        <select v-model="selectedBand" @change="handleSelection('band')" class="mdc-text-field__input">
          <option value="">Select a band</option>
          <option v-for="band in bands" :key="band.id" :value="band.id">{{ band.attributes.name }}</option>
          <option value="createNew">Create New Band</option>
        </select>
        <span class="mdc-line-ripple"></span>
      </label>
      <label class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">Select Album:</span>
        <select v-model="selectedAlbum" @change="handleSelection('album')" class="mdc-text-field__input">
          <option value="">Select an album</option>
          <option v-for="album in albums" :key="album.id" :value="album.id">{{ album.attributes.title }}</option>
          <option value="createNew">Create New Album</option>
        </select>
        <span class="mdc-line-ripple"></span>
      </label>
      <label class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">Select Tour:</span>
        <select v-model="selectedTour" @change="handleSelection('tour')" class="mdc-text-field__input">
          <option value="">Select a tour</option>
          <option v-for="tour in tours" :key="tour.id" :value="tour.id">{{ tour.attributes.title }}</option>
          <option value="createNew">Create New Tour</option>
        </select>
        <span class="mdc-line-ripple"></span>
      </label>
      <label class="mdc-text-field mdc-text-field--filled mb-4">
        <span class="mb-1 text-gray-700">Select Event:</span>
        <select v-model="selectedEvent" @change="handleSelection('event')" class="mdc-text-field__input">
          <option value="">Select an event</option>
          <option v-for="event in events" :key="event.id" :value="event.id">{{ event.attributes.title }}</option>
          <option value="createNew">Create New Event</option>
        </select>
        <span class="mdc-line-ripple"></span>
      </label>
      <button @click="updateQrCodeSubmit" class="mdc-button mdc-button--raised w-full mt-4">
        Update QR
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

const { findOne, find } = useStrapi()
const user = useStrapiUser()
const router = useRouter()
const route = useRoute()
const client = useStrapiClient()
const uuid = uuidv4()

const url = `https://localhost:3000/directqr?id=${uuid}`

const { data } = await findOne('qrs', route.params.id, {
  populate: {
    event: {
      populate : "*"
    },
    tour: {
      populate : "*"
    },
    album: {
      populate : "*"
    },
    band: {
      populate : "*"
    }
  }
})

const qrcode = ref(null)
const q_type = ref(data.attributes.q_type || null)
const link = ref(data.attributes.link || null)
const color = ref('#ffffff')
const name = ref(data.attributes.name || 'add name')
const options = reactive(data.attributes.options)

const bands = ref([])
const events = ref([])
const tours = ref([])
const albums = ref([])


const selectedEvent = ref(data.attributes.event?.data?.id ?? null)
const selectedTour = ref(data.attributes.tour.data?.id ?? null)
const selectedAlbum = ref( data.attributes.album?.data?.id ?? null)
const selectedBand = ref( data.attributes.band?.data?.id ?? null)


const fetchUserRelatedData = async () => {
  try {
    const bandsResponse = await find('bands', { filters: { users_permissions_user: { id: user.value.id } } })
    bands.value = bandsResponse.data

    const eventsResponse = await find('events', { filters: { users_permissions_user: { id: user.value.id } } })
    events.value = eventsResponse.data

    const toursResponse = await find('tours', { filters: { users_permissions_user: { id: user.value.id } } })
    tours.value = toursResponse.data

    const albumsResponse = await find('albums', { filters: { users_permissions_user: { id: user.value.id } } })
    albums.value = albumsResponse.data
  } catch (error) {
    console.error('Error fetching user-related data:', error)
  }
}

fetchUserRelatedData()

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
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      options.image = e.target.result
      updateQrCode()
    }
    reader.readAsDataURL(file)
  }
}

const handleSelection = (type) => {
  if (type === 'link') {
    selectedBand.value = null
    selectedAlbum.value = null
    selectedTour.value = null
    selectedEvent.value = null
    q_type.value = 'link'
  } else {
    link.value = null
    if (type === 'band') {
      selectedAlbum.value = null
      selectedTour.value = null
      selectedEvent.value = null
      q_type.value = 'band'
    } else if (type === 'album') {
      selectedBand.value = null
      selectedTour.value = null
      selectedEvent.value = null
      q_type.value = 'album'
        } else if (type === 'tour') {
      selectedBand.value = null
      selectedAlbum.value = null
      selectedEvent.value = null
      q_type.value = 'tour'
     
    } else if (type === 'event') {
      selectedBand.value = null
      selectedAlbum.value = null
      selectedTour.value = null
      q_type.value = 'event'
    
    }
  }
}

onMounted(() => {
  initializeQrCode()
})

const updateQrCodeSubmit = async () => {
  const qrId = route.params.id
  try {
    const formData = new FormData()
    const form = {
      url: options.data,
      users_permissions_user: { id: user.value.id },
      q_type: q_type.value,
      link: link.value,
      name: name.value,
      options: options,
      band: selectedBand.value !== 'createNew' ? selectedBand.value : null,
      album: selectedAlbum.value !== 'createNew' ? selectedAlbum.value : null,
      event: selectedEvent.value !== 'createNew' ? selectedEvent.value : null,
      tour: selectedTour.value !== 'createNew' ? selectedTour.value : null
    }

    const blob = await qrCodeStyling.getRawData('image/png')
    const file = new File([blob], 'qrcode.png')

    formData.append('files.q_image', file, 'qrcode.png')
    formData.append('data', JSON.stringify(form))

    await client(`/qrs/${qrId}`, {
      method: 'PUT',
      body: formData,
    })

    // Routing after successful update based on selected values
    if (selectedBand.value === 'createNew') {
      q_type.value = 'band'
      router.push({ path: '/createband', query: { createnew: 'createNew', qrId: qrId } })
    } else if (selectedAlbum.value === 'createNew') {
      q_type.value = 'album'
      router.push({ path: '/newalbum', query: { createnew: 'createNew', qrId: qrId } })
    } else if (selectedTour.value === 'createNew') {
      q_type.value = 'tour'
      router.push({ path: '/newtour', query: { createnew: 'createNew', qrId: qrId } })
    } else if (selectedEvent.value === 'createNew') {
      q_type.value = 'event'
      router.push({ path: '/newevent', query: { createnew: 'createNew', qrId: qrId } })
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Error updating QR code:', error)
  }
}


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
