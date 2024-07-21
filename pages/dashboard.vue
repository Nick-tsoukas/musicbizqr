<script setup>

const { find } = useStrapi()
const user = useStrapiUser()

const qrs = ref([])
const bands = ref([])
const events = ref([])
const tours = ref([])
const albums = ref([])

const fetchData = async () => {
  if (user.value) {
    try {
      await fetchBands();
      await fetchQrs();
      await fetchEvents();
      await fetchTours();
      await fetchAlbums();
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
}

const fetchBands = async () => {
  try {
    const response = await find('bands', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id
          }
        }
      },
      populate: '*'
    })
    bands.value = response.data
  } catch (error) {
    console.error('Error fetching bands:', error)
  }
}

const fetchQrs = async () => {
  try {
    const response = await find('qrs', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id
          }
        }
      },
      populate: '*'
    })
    qrs.value = response.data
  } catch (error) {
    console.error('Error fetching QR codes:', error)
  }
}

const fetchEvents = async () => {
  try {
    const response = await find('events', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id
          }
        }
      },
      populate: '*'
    })
    events.value = response.data
  } catch (error) {
    console.error('Error fetching events:', error)
  }
}

const fetchTours = async () => {
  try {
    const response = await find('tours', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id
          }
        }
      },
      populate: '*'
    })
    tours.value = response.data
  } catch (error) {
    console.error('Error fetching tours:', error)
  }
}

const fetchAlbums = async () => {
  try {
    const response = await find('albums', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id
          }
        }
      },
      populate: '*'
    })
    albums.value = response.data
  } catch (error) {
    console.error('Error fetching albums:', error)
  }
}

onMounted(fetchData)

const editItem = (item) => {
  console.log('Edit item:', item)
  // Handle edit action, e.g., navigate to edit page
}

// Computed properties to transform the data for display
const qrItems = computed(() => qrs.value.map(qr => ({
  id: qr.id,
  title: qr.attributes.name,
  imageUrl: qr.attributes.q_image?.data?.attributes?.url || '',
})))

const bandItems = computed(() => bands.value.map(band => ({
  id: band.id,
  title: band.attributes.name,
  imageUrl: band.attributes.bandImg?.data?.attributes?.url || '',
})))

const eventItems = computed(() => events.value.map(event => ({
  id: event.id,
  title: event.attributes.title,
  imageUrl: event.attributes.image?.data?.attributes?.url || '',
})))

const tourItems = computed(() => tours.value.map(tour => ({
  id: tour.id,
  title: tour.attributes.title,
  imageUrl: tour.attributes.image?.data?.attributes?.url || '',
})))

const albumItems = computed(() => albums.value.map(album => ({
  id: album.id,
  title: album.attributes.title,
  imageUrl: album.attributes.cover?.data?.attributes?.url || '',
})))
</script>
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">Dashboard</h1>

    <div v-if="qrItems.length" class="mb-6 border-2 rounded-md">
      <div class="bg-black px-2 py-4">
        <h2 class="text-xl text-white font-semibold mb-2">QR Codes</h2>
      </div>
      <ul>
        <li v-for="qr in qrItems" :key="qr.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
            <img :src="qr.imageUrl" alt="" class="h-12 w-12 rounded mr-4">
            <span>{{ qr.title }}</span>
          </div>
          <button @click="editItem(qr)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-5 w-5" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </div>

    <div v-if="bandItems.length" class="mb-6 border-2 rounded-md">
      <div class="bg-black px-2 py-4">
        <h2 class="text-xl text-white font-semibold mb-2">Bands</h2>
      </div>
      <ul>
        <li v-for="band in bandItems" :key="band.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
            <img :src="band.imageUrl" alt="" class="h-12 w-12 rounded mr-4">
            <span>{{ band.title }}</span>
          </div>
          <button @click="editItem(band)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-5 w-5" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </div>

    <div v-if="eventItems.length" class="mb-6 border-2 rounded-md">
      <div class="bg-black px-2 py-4">
        <h2 class="text-xl text-white font-semibold mb-2">Events</h2>
      </div>
      <ul>
        <li v-for="event in eventItems" :key="event.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
            <img :src="event.imageUrl" alt="" class="h-12 w-12 rounded mr-4">
            <span>{{ event.title }}</span>
          </div>
          <button @click="editItem(event)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-5 w-5" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </div>

    <div v-if="tourItems.length" class="mb-6 border-2 rounded-md">
      <div class="bg-black px-2 py-4">
        <h2 class="text-xl text-white font-semibold mb-2">Tours</h2>
      </div>
      <ul>
        <li v-for="tour in tourItems" :key="tour.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
            <img :src="tour.imageUrl" alt="" class="h-12 w-12 rounded mr-4">
            <span>{{ tour.title }}</span>
          </div>
          <button @click="editItem(tour)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-5 w-5" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </div>

    <div v-if="albumItems.length" class="mb-6 border-2 rounded-md">
      <div class="bg-black px-2 py-4">
        <h2 class="text-xl text-white font-semibold mb-2">Albums</h2>
      </div>
      <ul>
        <li v-for="album in albumItems" :key="album.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
            <img :src="album.imageUrl" alt="" class="h-12 w-12 rounded mr-4">
            <span>{{ album.title }}</span>
          </div>
          <button @click="editItem(album)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-5 w-5" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </div>

    <div class="mb-6">
      <NuxtLink to="/newevent" class="btn">Create Event</NuxtLink>
    </div>
    <div>
      <NuxtLink to="/newtour" class="btn">Create Tour</NuxtLink>
    </div>
  </div>
</template>

