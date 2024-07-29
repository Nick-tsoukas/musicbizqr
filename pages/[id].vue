<template>
  <div>
    <!-- hero content  -->
    <div v-if="band" class="band-image-container relative w-full bg-red-500">
      <img
        class="w-full h-full lg:object-cover object-contain lg:object-center object-top"
        :src="band.data.attributes.bandImg.data.attributes.url"
        alt="Band Image"
      />
      <div class="band-name-bar">
        <h1 class="text-3xl font-bold">{{ band.data.attributes.name }}</h1>
      </div>
    </div>

    <!-- album page content -->
    <main class="p-5 animate__animated animate__fadeInUp animate__delay-2sp">
      <div>
        <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-200 mb-5">Albums</h1>
        <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div v-for="album in albums" :key="album.id" class="bg-gray-900 shadow-lg rounded p-3">
            <div class="group relative">
              <img
                class="w-full md:w-72 block rounded mx-auto"
                :src="album.attributes.cover.data.attributes.url"
                alt=""
              />
              <div
                class="absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 transition justify-evenly"
              >
                <button
                  class="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    class="bi bi-play-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"
                    /> 
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-5">
              <h3 class="text-white text-lg">{{ album.attributes.title }}</h3>
            </div>
          </div>
        </section>

        <section v-if="albums[0]" class="w-screen" >
          <AudioPlayer :album="albums[0]" class="w-[100vw]" />
        </section>

         <!-- Enhanced Events Section -->
         <div v-if="events.length" class="mt-10">
          <h2 class="text-3xl font-bold text-gray-200 mb-5">Events new</h2>
          <ul class="space-y-4">
            <li v-for="event in events" :key="event.id" class=" shadow-lg rounded-lg overflow-hidden">
      
              <img
                v-if="event.attributes.image"
                class="w-full h-48 object-cover"
                :src="event.attributes.image.data.attributes.url"
                alt="Event Image"
              />
              <div class="p-5">
                <h3 class="text-2xl text-white mb-2">{{ event.attributes.title }}</h3>
                <p class="text-gray-400 mb-4">{{ event.attributes.description }}</p>
                <p class="text-gray-400">{{ new Date(event.attributes.date).toLocaleDateString() }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div v-if="tours.length" class="mt-10">
          <h2 class="text-3xl font-bold text-gray-200 mb-5">Tours</h2>
          <ul>
            <li v-for="tour in tours" :key="tour.id" class="bg-gray-900 shadow-lg rounded p-3 mb-4">
              <h3 class="text-xl text-white">{{ tour.attributes.title }}</h3>
              <p class="text-gray-400">{{ tour.attributes.description }}</p>
              <p class="text-gray-400">{{ new Date(tour.attributes.startDate).toLocaleDateString() }} - {{ new Date(tour.attributes.endDate).toLocaleDateString() }}</p>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>

const {find, findOne} = useStrapi();


const route = useRoute()
const band = ref(null)
const albums = ref([])
const events = ref([])
const tours = ref([])

onMounted(async () => {
  const bandResponse = await findOne('bands', route.params.id, {
    populate: {
      events: {
        populate: {
          
        }
      }
    }
  })
  const bandData = await bandResponse.json()
  band.value = bandData

  // Fetching albums data
  if (band.value?.data?.attributes?.albums?.data?.length) {
    const albumIds = band.value.data.attributes.albums.data.map(album => album.id)
    const albumFetches = albumIds.map(id => fetch(`http://localhost:1337/api/albums/${id}?populate=cover,songs.file`))
    const albumResponses = await Promise.all(albumFetches)
    const albumData = await Promise.all(albumResponses.map(response => response.json()))
    albums.value = albumData.map(response => response.data)
  }

  // Fetching events data
  if (band.value?.data?.attributes?.events?.data?.length) {
    events.value = band.value.data.attributes.events.data
  }

  // Fetching tours data
  if (band.value?.data?.attributes?.tours?.data?.length) {
    tours.value = band.value.data.attributes.tours.data
  }
})
</script>

<style scoped>
.band-image-container {
  height: calc(100vh - 90px);
  width: 100vw;
}

.band-name-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 3rem 0;
}

@media (max-width: 640px) {
  .band-image-container {
    height: auto; /* Let the image take its natural height on smaller screens */
  }

  .band-image-container img {
    height: auto; /* Ensure the image height is auto on smaller screens */
    max-height: calc(100vh - 90px); /* Ensure the image doesn't exceed the viewport height minus 90px */
  }
}

.background__gradient {
  background: linear-gradient(to top, rgba(51, 51, 51, 1) 0%, rgba(51, 51, 51, 1) 15%, rgba(51, 51, 51, 0.95) 35%, rgba(51, 51, 51, 0.7) 100%);
}
</style>
