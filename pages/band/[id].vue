<template>
  <div v-if="band && band.data " class="bg-[#000] w-screen  mx-auto">
    <!-- hero content  -->
 
    <div v-if="band" class="relative  w-full h-[calc(100vh-400px)]">
  <!-- Full-screen Image -->
  <img
    class="w-full h-full object-cover object-center"
    :src="band.data.attributes.bandImg.data.attributes.url"
    alt="Band Image"
  />

  <!-- Bottom bar overlay on the image -->
  <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 py-4">
    <h1 class="text-white text-xl md:text-7xl text-center font-bold px-4">
      {{ band.data.attributes.name }}
    </h1>
  </div>
</div>
<!-- <pre class="text-white">{{ band.data.attributes.albums}} fsdfsd</pre> -->
<!-- streaming links if no albums  -->

    <!-- album page content -->
 <div  class="w-full px-6 md:max-w-[80vw]  md:mx-auto" >
  <div class="pt-0 sm:p-5 ">
      <div >
        <div v-if="albums.length > 0" >
        <h1 class="text-lg my-4 md:text-7xl font-bold text-white md:my-16">Albums</h1>
        <section class="flex gap-4  overflow-x-scroll no-scrollbar">
          <div
            v-for="album in albums"
            :key="album.id"
            class="bg-black shadow-lg rounded p-3 "
          >
            <div class="group relative transform transition-transform duration-300 hover:scale-105 in-w-[100%] h-[300px] md:w-[450px] md:h-[450px]">
              <img
                class="w-full block rounded mx-auto"
                :src="album.attributes.cover.data.attributes.url"
                alt=""
              />
              <!-- <div
                class="hidden md:absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 md:flex items-center group-hover:opacity-100 transition justify-evenly"
              >
                <button
                  @click="setAlbum(album.id)"
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
              </div> -->
            </div>
            <div class="pt-5">
              <h3 class="text-white font-semibold text-xl">{{ album.attributes.title }}</h3>
            </div>
          </div>
        </section>

        <section v-if="albumPlay" class="w-full flex flex-col xl:flex-row gap-4 my-20">
         
          <AudioPlayer :album="albumPlay" class="w-full md:w-[70%]  mx-0" />
          <div class="flex flex-col gap-6 justify-start md:px-4 w-full md:w-[30%] " >
            <h2 class="text-xl font-bold text-white" >Streaming Links</h2>
           <span v-if="band.data.attributes.spotify">
            <a :href="band.data.attributes.spotify">
            <button class="w-full custom-border bg-[#fff] flex justify-center text-black font-semibold px-2 py-3 items-center relative shadow-lg rounded-md" > <img src="@/assets/spotify.svg" class="h-8 absolute left-2" alt=""> Spotify</button>
            </a>
           </span>
           <span v-if="band.data.attributes.youtube" >
            <a :href="band.data.attributes.youtube">
            <button class="w-full custom-border bg-[#fff] flex justify-center text-black px-2 py-3 items-center relative rounded-md" > <img src="@/assets/youtube-icon.svg" class="h-8 absolute left-2" alt=""> YouTube Music</button>
           </a>
           </span>
           <span v-if="band.data.attributes.dezzer" >
            <a :href="band.data.attributes.dezzer">
            <button class="w-full custom-border bg-[#fff] flex justify-center text-black px-2 py-3 items-center relative rounded-md font-semibold" > <img src="@/assets/dezzer.svg" class="h-8 absolute left-2" alt=""> Dezzer</button>
           </a>
           </span>
          <span v-if="band.data.attributes.soundcloud" >
            <a :href="band.data.attributes.soundcloud">
            <button class="w-full custom-border bg-[#fff] flex justify-center text-black px-2 py-3 items-center relative rounded-md font-semibold" > <img src="@/assets/soundcloud.svg" class="h-8 absolute left-2" alt=""> SoundCloud</button>
           </a>
          </span>
          <span v-if="band.data.attributes.bandcamp">
            <a :href="band.data.attributes.bandcamp">
            <button class="w-full custom-border bg-[#fff] flex justify-center text-black px-2 py-3 items-center relative rounded-md font-semibold" > <img src="@/assets/bandcamp.svg" class="h-8 absolute left-2" alt=""> Bandcamp</button>
           </a>

          </span>
          </div>
        </section>

        </div>

      

        <!-- Enhanced Events Section -->
        <div v-if="events.length" class="mt-10  mx-auto">
          <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white my-16">Events</h1>

          <!-- Events Slider -->
          <div  class="flex overflow-x-scroll space-x-4 pb-4 no-scrollbar">
            <div v-for="event in events" :key="event.id" class="shadow-lg rounded-lg p-[15px] flex-none w-[285px] sm:w-[60vw] md:w-[500px] bg-black text-white">
              <img
                v-if="event.attributes.image"
                class="w-full h-[200px] md:h-72 object-cover rounded-md"
                :src="event.attributes.image.data.attributes.url"
                alt="Event Image"
              />
              <div class="pt-5">
                <h3 class="text-xl md:text-2xl text-white font-bold mb-2">{{ event.attributes.title }}</h3>
                <!-- <p class="text-black mb-4">{{ event.attributes.description ?? 'No description available' }}</p> -->
                <p class="text-white text-sm">{{ new Date(event.attributes.date ?? new Date()).toLocaleDateString() }}</p>
                <!-- <p class="text-black">{{ event.attributes.time ?? 'Time not specified' }}</p> -->
                <p class="text-white text-sm">{{ event.attributes.venue ?? 'Venue not specified' }}</p>
                <p class="text-white text-sm">{{ event.attributes.city ?? 'City not specified' }}</p>
                <!-- <p class="text-black">{{ event.attributes.address ?? 'Address not specified' }}</p> -->
                <!-- <p class="text-black">{{ event.attributes.link ?? 'No link available' }}</p> -->
                <button 
                  @click="router.push(`/event/${event.id}`)" 
                  class="mdc-button-green mt-2 w-full"
                >
                  View Event
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="tours.length" class="mt-10  mx-auto">
          <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white my-16">Tours</h1>

          <!-- Tours Slider -->
          <div  class="flex overflow-x-scroll space-x-4 pb-4 no-scrollbar">
            <div v-for="tour in tours" :key="tour.id" class="shadow-lg rounded-lg p-[15px] flex-none w-[285px] sm:w-[60vw] md:w-[500px] bg-black text-white">
              <img
                v-if="tour.attributes.image"
                class="w-full h-[200px] md:h-72 object-cover"
                :src="tour.attributes.image.data.attributes.url"
                alt="Tour Image"
              />
              <div class="pt-5">
                <!-- <p class="text-black mb-4">{{ tour.attributes.description ?? 'No description available' }}</p> -->
                <!-- <p class="text-white text-sm">{{ new Date(tour.attributes.startDate ?? new Date()).toLocaleDateString() }} - {{ new Date(tour.attributes.endDate ?? new Date()).toLocaleDateString() }}</p> -->
                <button 
                @click="router.push(`/tour/${tour.id}`)" 
                class="mdc-button-green mt-2 w-full"
                >
                  View Tour
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- streaming if no albums  -->
        <div class="flex flex-col gap-6 justify-start  md:px-4 w-full md:w-[100%] md:mx-auto " >
            <h2 class="text-4xl my-10 font-bold text-white" >   Streaming Links</h2>
           <span v-if="band.data.attributes.spotify">
            <a :href="band.data.attributes.spotify">
            <button class="w-full custom-border bg-[#fff] flex justify-center text-black font-semibold px-2 py-3 items-center relative shadow-lg rounded-md" > <img src="@/assets/spotify.svg" class="h-8 absolute left-2" alt=""> Spotify</button>
            </a>
           </span>
           <span v-if="band.data.attributes.youtube" >
            <a :href="band.data.attributes.youtube">
            <button class="w-full custom-border bg-[#fff] flex justify-center text-black px-2 py-3 items-center relative rounded-md" > <img src="@/assets/youtube-icon.svg" class="h-8 absolute left-2" alt=""> YouTube Music</button>
           </a>
           </span>
           <span v-if="band.data.attributes.dezzer" >
            <a :href="band.data.attributes.dezzer">
            <button class="w-full custom-border bg-[#fff] flex justify-center text-black px-2 py-3 items-center relative rounded-md font-semibold" > <img src="@/assets/dezzer.svg" class="h-8 absolute left-2" alt=""> Dezzer</button>
           </a>
           </span>
          <span v-if="band.data.attributes.soundcloud" >
            <a :href="band.data.attributes.soundcloud">
            <button class="w-full custom-border bg-[#fff] flex justify-center text-black px-2 py-3 items-center relative rounded-md font-semibold" > <img src="@/assets/soundcloud.svg" class="h-8 absolute left-2" alt=""> SoundCloud</button>
           </a>
          </span>
          <span v-if="band.data.attributes.bandcamp">
            <a :href="band.data.attributes.bandcamp">
            <button class="w-full custom-border bg-[#fff] flex justify-center text-black px-2 py-3 items-center relative rounded-md font-semibold" > <img src="@/assets/bandcamp.svg" class="h-8 absolute left-2" alt=""> Bandcamp</button>
           </a>

          </span>
          </div>
      </div>
    </div>

    <!-- social media links -->
    
    <div class="h-52 flex items-center justify-center bg-[#000]">
      <div class="flex items-center justify-center gap-x-5">
        <a v-if="band.data.attributes.instagram" :href="band.data.attributes.instagram" aria-label="Find us on LinkedIn" target="_blank" rel="noopener">
          <svg class="h-10 w-10 text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M44.45 0H3.55A3.5 3.5 0 0 0 0 3.46v41.07A3.5 3.5 0 0 0 3.54 48h40.9A3.51 3.51 0 0 0 48 44.54V3.46A3.5 3.5 0 0 0 44.45 0Zm-30.2 40.9H7.11V18h7.12v22.9Zm-3.57-26.03a4.13 4.13 0 1 1-.02-8.26 4.13 4.13 0 0 1 .02 8.26ZM40.9 40.9H33.8V29.77c0-2.66-.05-6.08-3.7-6.08-3.7 0-4.27 2.9-4.27 5.89V40.9h-7.1V18h6.82v3.12h.1c.94-1.8 3.26-3.7 6.72-3.7 7.21 0 8.54 4.74 8.54 10.91V40.9Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
        <a v-if="band.data.attributes.twitch" :href="band.data.attributes.twitch" aria-label="Find us on Twitter" target="_blank" rel="noopener">
          <svg class="h-10 w-10"viewBox="0 0 512 512"><path fill="#ffffff" d="M391.2 103.5H352.5v109.7h38.6zM285 103H246.4V212.8H285zM120.8 0 24.3 91.4V420.6H140.1V512l96.5-91.4h77.3L487.7 256V0zM449.1 237.8l-77.2 73.1H294.6l-67.6 64v-64H140.1V36.6H449.1z"/>
          </svg>
        </a>
        <a v-if="band.data.attributes.facebook" :href="band.data.attributes.facebook" aria-label="Find us on Facebook" target="_blank" rel="noopener">
          <svg class="h-10 w-10 text-white" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M48 24a24 24 0 1 0-27.75 23.7V30.95h-6.1V24h6.1v-5.29c0-6.01 3.58-9.34 9.07-9.34 2.62 0 5.37.47 5.37.47v5.91h-3.03c-2.98 0-3.91 1.85-3.91 3.75V24h6.66l-1.07 6.94h-5.59V47.7A24 24 0 0 0 48 24Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
    </div>
    </div>
 </div>
 
  </div>
</template>





<script setup>



const { find, findOne } = useStrapi();
const config = useRuntimeConfig(); // Access runtime configuration
const apiUrl = config.public.strapiUrl; // Get the API base URL




const route = useRoute();
const router = useRouter();
const band = ref([]);
const albums = ref([]);
const events = ref([]);
const tours = ref([]);
const albumPlay = ref(null)

const setAlbum = (id) => {
  console.log(id, 'this is album id');
  const album = albums.value.find((album) => album.id === id);
  if (album) {
    albumPlay.value = album;
  } else {
    console.warn(`Album with id ${id} not found`);
  }
};

// const scrollSliderIntoView = (sliderRef) => {
//   if (window.innerWidth <= 640) {
//     sliderRef.value.scrollIntoView({ behavior: 'smooth' });
//   }
// };

onMounted(async () => {
  document.body.classList.add('custom-page-body')

  const bandResponse = await fetch(
    `${apiUrl}/api/bands/${route.params.id}?populate[events][populate]=image&populate[tours][populate]=*&populate[albums][populate]=cover,songs.file&populate=bandImg`
  );
  const bandData = await bandResponse.json();
  band.value = bandData;

  console.log(bandData)

  // Fetching albums data
  if (band.value?.data?.attributes?.albums?.data?.length) {
    const albumIds = band.value.data.attributes.albums.data.map((album) => album.id);
    const albumFetches = albumIds.map((id) => fetch(`${apiUrl}/api/albums/${id}?populate=cover,songs.file`));
    const albumResponses = await Promise.all(albumFetches);
    const albumData = await Promise.all(albumResponses.map((response) => response.json()));
    albums.value = albumData.map((response) => response.data);
    albumPlay.value = albums.value[0]; // Set the first album to play by default
  }

  // Fetching events data
  if (band.value?.data?.attributes?.events?.data?.length) {
    events.value = band.value.data.attributes.events.data;
  }

  // Fetching tours data
  if (band.value?.data?.attributes?.tours?.data?.length) {
    tours.value = band.value.data.attributes.tours.data;
  }

  // Start scrolling the sliders into view on mobile
  // const eventsSlider = ref('eventsSlider');
  // const toursSlider = ref('toursSlider');
  // scrollSliderIntoView(eventsSlider);
  // scrollSliderIntoView(toursSlider);
});
onBeforeUnmount(() => {
  document.body.classList.remove('custom-page-body')
})
</script>



<style scoped>
.band-image-container {
  height: calc(100vh - 90px);
  width: 100vw;
}

.custom-page-body {
  background-color: #000;

}

.custom-border {
  border: .1px solid white;
}

.band-name-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 2rem 0;
}

@media (max-width: 640px) {
  .band-image-container {
    height: auto; /* Let the image take its natural height on smaller screens */
    
  }

  .band-name-bar {
    padding: 1rem 0;
  }

  .band-image-container img {
    height: auto; /* Ensure the image height is auto on smaller screens */
    max-height: calc(100vh - 90px); /* Ensure the image doesn't exceed the viewport height minus 90px */
  }
}

@media (max-width: 440px) {

  .band-name-bar {
    padding: 1rem 0;
  }


}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.background__gradient {
  background: linear-gradient(to top, rgba(51, 51, 51, 1) 0%, rgba(51, 51, 51, 1) 15%, rgba(51, 51, 51, 0.95) 35%, rgba(51, 51, 51, 0.7) 100%);
}
</style>
