<template>
  <div class="bg-[#000]">
    <div class="container bg-[#000] mx-auto p-4">
      <h1 class="text-2xl font-semibold mb-4 text-white">Dashboard</h1>
      <PastDueBanner />

      <!-- QR Codes Section -->
      <div v-if="loading">
        <SkeletonLoader />
      </div>
      
      <div v-else class="mb-6 border-2 border-white rounded-lg">
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">QR Codes</h2>
          <NuxtLink
            v-if="!hasQr"
            to="/createqr"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Create QR
          </NuxtLink>
          <button
            v-else
            class="mdc-button flex justify-between w-full md:w-[300px] opacity-50 cursor-not-allowed"
            disabled
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Only one QR allowed
          </button>
        </div>

        <ul v-if="qrItems.length" class="px-6 py-6">
          <li
            v-for="qr in qrItems"
            :key="qr.id"
            class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row"
          >
            <img
              :src="qr.imageUrl"
              alt=""
              class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4"
            />
            <div class="flex-grow">
              <span class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold">{{ qr.title }}</span>
            </div>
            <div class="flex items-center gap-4">
              <p class="text-white">Scans: {{ qr.scans.data.length ? qr.scans.data.length : 0 }}</p>
              <button
                @click="viewQr(qr.imageUrl)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                @click="editItem(qr.id, 'editqr')"
                class="text-blue-600 hover:text-blue-900"
              >
                <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                @click="deleteItem(qr.id, 'qr')"
                class="text-red-600 hover:text-red-800"
              >
                <img src="@/assets/delete-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>

        <div v-else class="px-6 py-6 text-center text-white">
          Create Your First QR Code
        </div>
      </div>

      <!-- Bands Section -->
      <div v-if="loading" class="mt-6">
        <SkeletonLoader />
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-green-500 to-teal-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Bands</h2>
          <NuxtLink
            v-if="!hasBand"
            to="/createband"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Create Artist Page
          </NuxtLink>
          <button
            v-else
            class="mdc-button flex justify-between w-full md:w-[300px] opacity-50 cursor-not-allowed"
            disabled
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Only one artist allowed
          </button>
        </div>

        <ul v-if="bandItems.length" class="px-6 py-6">
          <li
            v-for="band in bandItems"
            :key="band.id"
            class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row"
          >
            <img
              :src="band.imageUrl"
              alt=""
              class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4"
            />
            <div class="flex-grow">
              <span class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold">{{ band.title }}</span>
            </div>
            <div class="flex items-center gap-4">
              <button
                @click="router.push(`/${band.slug}`)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                @click="router.push(`/editband/${band.id}`)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                @click="deleteItem(band.id, 'band')"
                class="text-red-600 hover:text-red-800"
              >
                <img src="@/assets/delete-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <div class="flex gap-4 p-2 border-2 rounded-md border-solid">
                <p class="text-white">Analytics</p>
                <button
                  @click="router.push(`/analytics/${band.id}`)"
                  class="text-green-600 hover:text-green-900"
                >
                  <img src="@/assets/analytics-icon.svg" class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div v-else class="px-6 py-6 text-center text-white">
          Create Artist Page
        </div>
      </div>

      <!-- Events Section -->
      <div v-if="loading" class="mt-6">
        <SkeletonLoader />
      </div>
      <div v-else class="mb-6 border-2 border-white rounded-lg">
        <div class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-blue-500 to-indigo-500 py-8 gap-2 items-center md:flex-row md:gap-0">
          <h2 class="text-2xl text-white font-extrabold self-start md:flex-grow">Events</h2>
          <NuxtLink
            to="/newevent"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Create Event
          </NuxtLink>
        </div>

        <ul v-if="eventItems.length" class="px-6 py-6">
          <li
            v-for="ev in eventItems"
            :key="ev.id"
            class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row"
          >
            <img
              :src="ev.imageUrl"
              alt=""
              class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4"
            />
            <div class="flex-grow">
              <span class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold">{{ ev.title }}</span>
            </div>
            <div class="flex items-center gap-4">
              <button
                @click="router.push(`/event/${ev.id}`)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img src="@/assets/view-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                @click="router.push(`/editevent/${ev.id}`)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img src="@/assets/edit-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                @click="deleteItem(ev.id, 'event')"
                class="text-red-600 hover:text-red-800"
              >
                <img src="@/assets/delete-icon.svg" class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </li>
        </ul>

        <div v-else class="px-6 py-6 text-center text-white">
          Create Your First Event
        </div>
      </div>

      <!-- VIEW QR Popup -->
      <div
        v-if="qrView"
        class="h-screen w-screen bg-black z-50 fixed overflow-hidden top-0 right-0 flex justify-center items-center"
      >
        <div class="flex flex-col gap-4">
          <img :src="imageURL" class="max-h-[67vh]" alt="" />
          <button
            @click="downloadImage"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
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
const user = useStrapiUser();
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();
const { find } = useStrapi();
const { setToken, fetchUser } = useStrapiAuth();

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

const hasQr = computed(() => qrItems.value.length > 0);
const hasBand = computed(() => bandItems.value.length > 0);

const fetchData = async () => {
  if (!user.value) return;
  try {
    await fetchQrs();
    await fetchScans();
    await Promise.all([
      fetchBands(),
      fetchEvents(),
    ]);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const fetchQrs = async () => {
  const resp = await find("qrs", {
    filters: { users_permissions_user: { id: { $eq: user.value.id } } },
    populate: "*",
  });
  qrs.value = resp.data;
};

const fetchScans = async () => {
  const qrIds = qrs.value.map(q => q.id);
  if (!qrIds.length) { scans.value = []; return; }
  const resp = await find("scans", {
    filters: { qr: { id: { $in: qrIds } } },
    pagination: { pageSize: 1000 },
    populate: "*",
  });
  scans.value = resp.data;
};

const fetchBands = async () => {
  const resp = await find("bands", {
    filters: { users_permissions_user: { id: { $eq: user.value.id } } },
    populate: "*",
  });
  bands.value = Array.isArray(resp.data) ? resp.data : [];
};

const fetchEvents = async () => {
  const resp = await find("events", {
    filters: { users_permissions_user: { id: { $eq: user.value.id } } },
    populate: "*",
  });
  events.value = resp.data || [];
};

const deleteItem = async (id, type) => {
  if (!confirm(`Delete this ${type}?`)) return;
  loading.value = true;
  try {
    await client(`/${type}s/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${useStrapiToken().value}` },
    });
    await fetchData();
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted.`);
  } catch (e) {
    console.error(e);
    alert(`Failed to delete ${type}.`);
  } finally {
    loading.value = false;
  }
};

const qrItems = computed(() =>
  qrs.value.map(qr => ({
    id: qr.id,
    title: qr.attributes.name,
    imageUrl: qr.attributes.q_image?.data?.attributes?.url || "",
    scans: qr.attributes.scans
  }))
);

const bandItems = computed(() =>
  Array.isArray(bands.value)
    ? bands.value.map(b => ({
        id: b.id,
        title: b.name,
        slug: b.slug,
        imageUrl: b.bandImg?.formats?.medium?.url || b.bandImg?.url || "",
      }))
    : []
);

const eventItems = computed(() =>
  events.value.map(ev => ({
    id: ev.id,
    title: ev.attributes.title,
    imageUrl: ev.attributes.image?.data?.attributes?.url || "",
  }))
);

const viewQr = img => {
  imageURL.value = img;
  qrView.value = true;
};

const downloadImage = () => {
  const link = document.createElement("a");
  link.href = imageURL.value;
  link.download = "qr.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const imageURL = ref("");
const qrView = ref(false);

onMounted(async () => {
  const tok = route.query.token;
  if (typeof tok === "string") {
    setToken(tok);
    router.replace({ query: {} });
    await fetchUser();
  }
  await fetchData();
});

const editItem = (id, page) => {
  router.push(`/${page}/${id}`);
};
</script>

<style scoped lang="css">
.mdc-button {
  border: 1px solid white;
  background: transparent;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}
.mdc-button img { height: 20px; }
.mdc-button:hover { background: rgba(255,255,255,0.1); }
img { object-fit: cover; }
.text-white { color: #fff; }
.border-white { border-color: #fff; }
.bg-[#000] { background-color: #000; }
.container { max-width: 1200px; }
</style>
