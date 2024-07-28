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
        <h1 class="text-xl font-bold">{{ band.data.attributes.name }}</h1>
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
                class="w-full md:w-72 block rounded"
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

        <section v-if="albums[0]">
          <AudioPlayer :album="albums[0]" class="grid place-items-center" />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { data: band } = useFetch(`http://localhost:1337/api/bands/${route.params.id}?populate[events]=*&populate[tours]=*&populate[albums][populate]=cover,songs.file&populate=bandImg`)

const albums = ref([])

onMounted(async () => {

  if (band.value?.data?.attributes?.albums?.data?.length) {
    const albumIds = band.value.data.attributes.albums.data.map(album => album.id)
    const albumFetches = albumIds.map(id => fetch(`http://localhost:1337/api/albums/${id}?populate=cover,songs.file`))
    const albumResponses = await Promise.all(albumFetches)
    const albumData = await Promise.all(albumResponses.map(response => response.json()))
    albums.value = albumData.map(response => response.data)
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
  padding: 1rem 0;
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
