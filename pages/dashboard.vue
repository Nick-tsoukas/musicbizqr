<script setup>

const user = useStrapiUser();
const router = useRouter();
const client = useStrapiClient();
const {find} = useStrapi();

const loading = ref(true);
const qrs = ref([]);
const bands = ref([]);
const events = ref([]);
const tours = ref([]);
const albums = ref([]);
const streams = ref([])

const fetchData = async () => {
  if (user.value) {
    try {
      await fetchBands();
      await fetchQrs();
      await fetchEvents();
      await fetchTours();
      await fetchAlbums();
      await fetchStreams();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      loading.value = false;
    }
  }
};

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
    });
    bands.value = response.data;
  } catch (error) {
    console.error('Error fetching bands:', error);
  }
};

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
    });
    qrs.value = response.data;
  } catch (error) {
    console.error('Error fetching QR codes:', error);
  }
};

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
    });
    events.value = response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

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
    });
    tours.value = response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
  }
};

const fetchStreams = async () => {
  try {
    const response = await find('streams', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id
          }
        }
      },
      populate: '*'
    });
    console.log(response.data, ' this is the stream ')
    streams.value = response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
  }
};


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
    });
    albums.value = response.data;
  } catch (error) {
    console.error('Error fetching albums:', error);
  }
};
const imageURL = ref('')
const qrView = ref(false)

const viewQr = (img) => {
  imageURL.value = img
  qrView.value = !qrView.value

}

onMounted(() => {
  fetchData()
});



const downloadImage = () => {
  // Create an anchor element
  const link = document.createElement('a');
  // Set the download attribute with a filename
  link.download = 'downloaded-image.jpg';
  // Set the href to the image URL
  link.href = imageURL.value;
  // Append the anchor to the body (necessary for Firefox)
  document.body.appendChild(link);
  // Programmatically click the anchor to trigger the download
  link.click();
  // Remove the anchor from the document
  document.body.removeChild(link);
};


const editItem = (id, page) => {
  router.push({ path: `/${page}/${id}` });
};

const qrItems = computed(() => qrs.value.map(qr => ({
  id: qr.id,
  title: qr.attributes.name,
  imageUrl: qr.attributes.q_image?.data?.attributes?.url || '',
})));

const bandItems = computed(() => bands.value.map(band => ({
  id: band.id,
  title: band.attributes.name,
  imageUrl: band.attributes.bandImg?.data?.attributes?.url || '',
})));

const eventItems = computed(() => events.value.map(event => ({
  id: event.id,
  title: event.attributes.title,
  imageUrl: event.attributes.image?.data?.attributes?.url || '',
})));

const tourItems = computed(() => tours.value.map(tour => ({
  id: tour.id,
  title: tour.attributes.title,
  imageUrl: tour.attributes.image?.data?.attributes?.url || '',
})));

const albumItems = computed(() => albums.value.map(album => ({
  id: album.id,
  title: album.attributes.title,
  imageUrl: album.attributes.cover?.data?.attributes?.url || '',
})));

</script>

<template>
<div class="bg-[#000]" >
  <div class="container bg-[#000] mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">Dashboard</h1>

    <!-- QR Codes Section -->
    <div v-if="loading">
      <SkeletonLoader />
    </div>
    <div v-else-if="qrItems.length" class="mb-6 border-2 border-white rounded-lg">
      <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  py-8 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-2xl text-center grow w-full text-white font-extrabold md:text-left">QR Codes</h2>
        <NuxtLink to="/createqr" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create QR
        </NuxtLink>
      </div>
      <ul class="px-6 py-6" >
        <li v-for="qr in qrItems" :key="qr.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
            <img :src="qr.imageUrl" alt="" class="h-[150px] w-[150px] rounded mr-4">
            <span class="text-white text-xl" >{{ qr.title }}</span>
          </div>
         <div class="flex items-center gap-4">
          <button @click="viewQr(qr.imageUrl)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
          <button @click="editItem(qr.id, 'editqr')" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
         </div>
        
        </li>
      </ul>
    </div>
    <div v-else class="mb-6 border-2  px-6 py-4 rounded-md">
      <div class="flex flex-col bg-[#000]  py-6 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-2xl text-center grow w-full text-white font-semibold md:text-left">Qrs</h2>
        <NuxtLink to="/createqr" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Qr
        </NuxtLink>
      </div>
      <div>
        <h2 class="text-center my-4">No Qrs found</h2>
      </div>
    </div>

    <!-- Bands Section -->
    <div v-if="loading">
      <SkeletonLoader />
    </div>
    <div v-else-if="bandItems.length" class="mb-6   border-2 rounded-md">
      <div class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  py-6 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-2xl text-center grow w-full text-white font-extrabold md:text-left">Bands</h2>
        <NuxtLink to="/createband" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Band
        </NuxtLink>
      </div>
      <ul class="px-6 py-6" >
        <li v-for="band in bandItems" :key="band.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
            <img :src="band.imageUrl" alt="" class="h-[150px] w-[150px] object-cover rounded mr-4">
            <span class="text-white text-xl">{{ band.title }}</span>
          </div>
          <div class="flex items-center gap-4">
            <button @click="router.push(`/band/${band.id}`)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
            <button @click="router.push(`/editband/${band.id}`)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
         
         
         </div>
        </li>
      </ul>
    </div>
    <div v-else class="mb-6 border-2 rounded-md">
      <div class="flex flex-col bg-[#00} p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-2xl text-center grow w-full text-white font-extrabold md:text-left">Bands</h2>
        <NuxtLink to="/createband" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Band
        </NuxtLink>
      </div>
      <div>
        <h2 class="text-center my-4">No Bands found</h2>
      </div>
    </div>

    <!-- stream section -->
    <div v-if="loading">
      <SkeletonLoader />
    </div>
    <div v-else-if="streams.length" class="mb-6   border-2 rounded-md">
      <div class="flex flex-col bg-[#000] p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  py-6 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-2xl text-center grow w-full text-white font-extrabold md:text-left">Streams</h2>
        <NuxtLink to="/createstreamlinks" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Stream Page
        </NuxtLink>
      </div>
      <ul class="px-6 py-6" >
        <li v-for="stream in streams" :key="stream.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
           <span v-if="stream.attributes.img" > <img :src="stream.attributes.img.data.attributes.url" alt="" class="h-[150px] w-[150px] object-cover rounded mr-4"></span>
            <span class="text-white text-xl">something here</span>
          </div>
          <div class="flex items-center gap-4">
            <button @click="router.push(`/stream/${stream.id}`)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
            <button @click="router.push(`/editstream/${stream.id}`)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
         
         
         </div>
        </li>
      </ul>
    </div>
    <div v-else class="mb-6 border-2 rounded-md">
      <div class="flex flex-col bg-[#00} p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-2xl text-center grow w-full text-white font-extrabold md:text-left">Bands</h2>
        <NuxtLink to="/createband" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Band
        </NuxtLink>
      </div>
      <div>
        <h2 class="text-center my-4">No Bands found</h2>
      </div>
    </div>


    <!-- Events Section -->
    <div v-if="loading">
      <SkeletonLoader />
    </div>
    <div v-else-if="eventItems.length" class="mb-6 border-2 rounded-md">
      <div class="flex flex-col p-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-2xl text-center grow w-full text-white font-extrabold md:text-left">Events</h2>
        <NuxtLink to="/newevent" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Event
        </NuxtLink>
      </div>
      <ul class="p-6" >
        <li v-for="event in eventItems" :key="event.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
            <img :src="event.imageUrl" alt="" class="h-[150px] w-[150px] object-cover rounded mr-4">
            <span class="text-white text-xl" >{{ event.title }}</span>
          </div>
          <div class="flex items-center gap-4">
          <button @click="router.push(`/event/${event.id}`)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
          <button @click="editItem(event.id, 'editevent')" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
         </div>
        </li>
      </ul>
    </div>
    <div v-else class="mb-6 border-2 rounded-md">
      <div class="flex flex-col bg-[#00} px-2 py-4 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-xl text-center grow w-full text-white font-semibold md:text-left">Events</h2>
        <NuxtLink to="/newevent" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Event
        </NuxtLink>
      </div>
      <div>
        <h2 class="text-center my-4">No Events found</h2>
      </div>
    </div>

    <!-- Tours Section -->
    <div v-if="loading">
      <SkeletonLoader />
    </div>
    <div v-else-if="tourItems.length" class="mb-6 border-2 rounded-md">
      <div class="flex flex-col border-b-2 p-6 bg-gradient-to-r from-pink-500 to-violet-500 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-2xl text-center grow w-full text-white font-extrabold md:text-left">Tours</h2>
        <NuxtLink to="/newtour" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Tour
        </NuxtLink>
      </div>
      <ul class="p-6" >
        <li v-for="tour in tourItems" :key="tour.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
            <img :src="tour.imageUrl" alt="" class="h-[150px] w-[150px] object-cover rounded mr-4">
            <span class="text-white text-xl">{{ tour.title }}</span>
          </div>
          <div class="flex items-center gap-4">
          <button @click="router.push(`/tour/${tour.id}`)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
          <button @click="editItem(tour.id, 'edittour')" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
         </div>
        </li>
      </ul>
    </div>
    <div v-else class="mb-6 border-2 rounded-md">
      <div class="flex flex-col border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 p-6 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-xl text-center grow w-full text-white font-semibold md:text-left">Tours</h2>
        <NuxtLink to="/newtour" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2 h-6" src="@/assets/create-icon.svg" alt="">Create Tour
        </NuxtLink>
      </div>
      <div>
        <h2 class="text-center text-white text-2xl my-4">No Tours found</h2>
      </div>
    </div>

    <!-- Albums Section -->
    <div v-if="loading">
      <SkeletonLoader />
    </div>
    <div v-else-if="albumItems.length" class="mb-6  border-2 rounded-md">
      <div class="flex flex-col border-b-2 bg-gradient-to-r from-pink-500 to-violet-500  p-6 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-2xl text-center grow w-full text-white font-extrabold md:text-left">Albums</h2>
        <NuxtLink to="/newalbum" class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2 h-6" src="@/assets/create-icon.svg" alt="">Create Album
        </NuxtLink>
      </div>
      <ul class="p-6">
        <li v-for="album in albumItems" :key="album.id" class="flex justify-between items-center mb-4 p-2">
          <div class="flex items-center">
            <img :src="album.imageUrl" alt="" class="h-[150px] w-[150px] object-cover rounded mr-4">
            <span class="text-white text-xl" >{{ album.title }}</span>
          </div>
          <div class="flex items-center gap-4">
          <button @click="router.push(`/album/${album.id}`)" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
          <button @click="editItem(album.id, 'editalbum')" class="text-blue-600 hover:text-blue-900">
            <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
          </button>
         </div>
        </li>
      </ul>
    </div>
    <div v-else class="mb-6 border-2 rounded-md">
      <div class="flex flex-col bg-[#00} px-2 py-4 gap-2 items-center md:flex-row md:gap-0">
        <h2 class="text-2xl text-center grow w-full text-white font-extrabold md:text-left">Albums</h2>
        <NuxtLink to="/newalbum"  class="mdc-button flex justify-between w-full md:w-[300px]">
          <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create Albums
        </NuxtLink>
      </div>
      <div>
        <h2 class="text-center text-white text-2xl font-semibold my-4">No Albums found</h2>
      </div>
    </div>
  </div>
  <!-- VIEW QR popup -->
  <div v-if="qrView" class="h-screen w-screen bg-black z-50 fixed overflow-hidden top-0 right-0 flex justify-center items-center" style="z-index: 99990999999999" >
    
   <div class="flex flex-col gap-4">
    <img :src="imageURL" class="max-h-[67vh]" alt="">
    <button @click="downloadImage" class="px-4 py-2 bg-blue-500 text-white rounded">Download Image</button>
   </div>

     <div class="absolute bottom-10 right-10" >
      <h2 @click="viewQr" class="text-white cursor-pointer">Close</h2>
     </div>
  </div>
</div>
</template>

<style scoped>
.mdc-button {
  border: 1px solid white;
  background: transparent
};

</style>


