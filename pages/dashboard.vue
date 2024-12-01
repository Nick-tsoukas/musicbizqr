<template>
  <div class="bg-[#000]">
    <div class="container bg-[#000] mx-auto p-4">
      <h1 class="text-2xl font-semibold mb-4">Dashboard</h1>

      <!-- Scans Chart Section -->
      <div v-if="!loading" class="mb-6 border-2 border-white rounded-lg">
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-8">
          <h2 class="text-2xl text-white font-extrabold">Scans Over Time</h2>
        </div>
        <div class="px-6 py-6">
          <ScansChart :labels="scansPerMonth.labels" :data="scansPerMonth.data" />
        </div>
      </div>

      <!-- QR Codes Section -->
      <div v-if="loading">
        <SkeletonLoader />
      </div>
      <div v-else-if="qrItems.length" class="mb-6 border-2 border-white rounded-lg">
        <!-- QR Codes List -->
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">QR Codes</h2>
          <NuxtLink to="/createqr" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create QR
          </NuxtLink>
        </div>
        <ul class="px-6 py-6">
          <li v-for="qr in qrItems" :key="qr.id" class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row">
            <img :src="qr.imageUrl" alt="" class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4">
            <div class="flex-grow">
              <span class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold">{{ qr.title }}</span>
            </div>
            <div class="flex items-center gap-4">
              <p class="text-white">scans: {{ qr.scans ? qr.scans : 0 }}</p>
              <button @click="viewQr(qr.imageUrl)" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="editItem(qr.id, 'editqr')" class="text-blue-600 hover:text-blue-900">
                <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button @click="deleteItem(qr.id, 'qr')" class="text-red-600 hover:text-red-800">
                <img src="@/assets/delete-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
        <!-- No QR Codes -->
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">QR Codes</h2>
          <NuxtLink to="/createqr" class="mdc-button flex justify-between w-full md:w-[300px]">
            <img class="pr-2" src="@/assets/create-icon.svg" alt="">Create QR
          </NuxtLink>
        </div>
        <div>
          <h2 class="text-center my-4 p-16 text-xl text-white">Create Your First QR Code</h2>
        </div>
      </div>

      <!-- Repeat the same pattern for Bands, Events, Tours, Albums, Streams, Social Links -->

      <!-- Include other sections here... -->

      <!-- VIEW QR Popup -->
      <div
        v-if="qrView"
        class="h-screen w-screen bg-black z-50 fixed overflow-hidden top-0 right-0 flex justify-center items-center"
      >
        <div class="flex flex-col gap-4">
          <img :src="imageURL" class="max-h-[67vh]" alt="" />
          <button @click="downloadImage" class="px-4 py-2 bg-blue-500 text-white rounded">
            Download Image
          </button>
        </div>
        <div class="absolute bottom-10 right-10">
          <h2 @click="viewQr" class="text-white cursor-pointer">Close</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

import ScansChart from '@/components/ScansChart.vue'; // Import the chart component

const user = useStrapiUser();
const router = useRouter();
const client = useStrapiClient();
const { find } = useStrapi();

const loading = ref(true);
const qrs = ref([]);
const scans = ref([]);
const bands = ref([]);
const events = ref([]);
const tours = ref([]);
const albums = ref([]);
const streams = ref([]);
const socials = ref([]);
const videos = ref([]);

// Fetch data on mounted
onMounted(() => {
  fetchData();
});

// Fetch data functions
const fetchData = async () => {
  if (user.value) {
    try {
      await fetchQrs(); // Fetch QR codes first
      await fetchScans(); // Fetch scans after QR codes

      // Fetch other data in parallel
      await Promise.all([
        fetchBands(),
        fetchEvents(),
        fetchTours(),
        fetchAlbums(),
        fetchStreams(),
        fetchSocials(),
        fetchVideos(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      loading.value = false;
    }
  }
};

const fetchQrs = async () => {
  try {
    const response = await find('qrs', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: '*',
    });
    qrs.value = response.data;
  } catch (error) {
    console.error('Error fetching QR codes:', error);
  }
};

const fetchScans = async () => {
  try {
    // Get the IDs of the user's QR codes
    const qrIds = qrs.value.map((qr) => qr.id);

    if (qrIds.length === 0) {
      scans.value = [];
      return;
    }

    // Fetch scans where qr.id is in qrIds
    const response = await find('scans', {
      filters: {
        qr: {
          id: {
            $in: qrIds,
          },
        },
      },
      pagination: {
        pageSize: 1000, // Adjust as needed
      },
      populate: '*',
    });
    scans.value = response.data;
  } catch (error) {
    console.error('Error fetching scans:', error);
  }
};

// Process scans to get counts per month
const scansPerMonth = computed(() => {
  const counts = {};

  scans.value.forEach((scan) => {
    const dateStr = scan.attributes.date;
    const date = new Date(dateStr);

    if (isNaN(date)) {
      console.error('Invalid date:', dateStr);
      return;
    }

    const month = date.getMonth(); // 0-11
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    counts[key] = (counts[key] || 0) + 1;
  });

  const sortedKeys = Object.keys(counts).sort();
  const labels = [];
  const data = [];

  sortedKeys.forEach((key) => {
    const [year, month] = key.split('-');
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
    labels.push(`${monthName} ${year}`);
    data.push(counts[key]);
  });

  return { labels, data };
});

// Other fetch functions (fetchBands, fetchEvents, etc.) remain unchanged
const fetchBands = async () => {
  try {
    const response = await find('bands', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: '*',
    });
    bands.value = response.data;
  } catch (error) {
    console.error('Error fetching bands:', error);
  }
};

const fetchEvents = async () => {
  try {
    const response = await find('events', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: '*',
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
            $eq: user.value.id,
          },
        },
      },
      populate: '*',
    });
    tours.value = response.data;
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
            $eq: user.value.id,
          },
        },
      },
      populate: '*',
    });
    albums.value = response.data;
  } catch (error) {
    console.error('Error fetching albums:', error);
  }
};

const fetchStreams = async () => {
  try {
    const response = await find('streams', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: '*',
    });
    streams.value = response.data;
  } catch (error) {
    console.error('Error fetching streams:', error);
  }
};

const fetchSocials = async () => {
  try {
    const response = await find('socialpages', {
      filters: {
        users_permissions_user: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: '*',
    });
    socials.value = response.data;
  } catch (error) {
    console.error('Error fetching social pages:', error);
  }
};

const fetchVideos = async () => {
  try {
    const response = await find('videos', {
      filters: {
        users_permissions_users: {
          id: {
            $eq: user.value.id,
          },
        },
      },
      populate: {
        mediayoutube: true,
        bandImg: true,
        users_permissions_users: true,
      },
    });

    videos.value = response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

// Other functions (deleteItem, viewQr, etc.) remain unchanged
const deleteItem = async (id, type) => {
  try {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    loading.value = true;

    await client(`/${type}s/${id}`, {
      method: 'DELETE',
    });

    await fetchData();

    loading.value = false;

    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
  } catch (error) {
    loading.value = false;
    console.error(`Error deleting ${type}:`, error);
    alert(`Failed to delete ${type}. Please try again.`);
  }
};

const imageURL = ref('');
const qrView = ref(false);

const viewQr = (img) => {
  imageURL.value = img;
  qrView.value = !qrView.value;
};

const downloadImage = () => {
  const link = document.createElement('a');
  link.download = 'downloaded-image.jpg';
  link.href = imageURL.value;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const editItem = (id, page) => {
  router.push({ path: `/${page}/${id}` });
};

// Computed properties remain unchanged
const qrItems = computed(() =>
  qrs.value.map((qr) => ({
    id: qr.id,
    title: qr.attributes.name,
    imageUrl: qr.attributes.q_image?.data?.attributes?.url || '',
    type: qr.attributes.q_type,
    scans: qr.attributes.scans,
  }))
);

// Other computed properties for bands, events, etc.

</script>

<style scoped lang="css">
.mdc-button {
  border: 1px solid white;
  background: transparent;
}

img {
  object-fit: cover;
}
</style>
