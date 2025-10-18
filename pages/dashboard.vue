<template>
  <div class="bg-[#000] pt-[var(--header-height)]">
    <div class="container bg-[#000] mx-auto p-4">
      <h1 class="text-2xl font-semibold mb-4 text-white">Dashboard</h1>

      <PastDueBanner
        :status="subscriptionStatus"
        :days-left="daysLeft"
        :has-payment-method="billingInfo?.hasPaymentMethod ?? null"
      />

      <TrialBanner
        v-if="
          !loadingTrial &&
          daysLeft !== null &&
          daysLeft > 0 &&
          billingInfo?.hasPaymentMethod === false
        "
        :days-left="daysLeft"
        :disabled="loadingPortal"
        @add-payment="goToBillingPortal"
      />

      <!-- <p v-if="trialError" class="text-red-500">⚠️ {{ trialError }}</p> -->

      <!-- QR Codes Section -->
      <div v-if="loading">
        <SkeletonLoader />
      </div>

      <div v-else class="mb-6 border-2 border-white rounded-lg">
        <div
          class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-pink-500 to-violet-500 py-8 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2
            class="text-2xl text-white font-extrabold self-start md:flex-grow"
          >
            QR Codes
          </h2>
          <NuxtLink
            v-if="canCreateMoreQrs"
            to="/createqr"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />
            Create QR
          </NuxtLink>

          <button
            v-else
            class="mdc-button flex justify-between w-full md:w-[300px] opacity-50 cursor-not-allowed"
            disabled
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />
            Only {{ maxQrAllowed }} QR{{ maxQrAllowed > 1 ? "s" : "" }} allowed
          </button>
        </div>

        <ul v-if="qrItems.length" class="px-6 py-6">
          <li
            v-for="qr in qrItems"
            :key="qr.id"
            class="flex flex-col gap-6 md:gap-0 justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg md:flex-row"
          >
            <!-- simple preview image -->
            <img
              :src="qr.imageUrl"
              alt=""
              class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4"
            />

            <div class="flex-grow">
              <span
                class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold"
              >
                {{ qr.title }}
              </span>
            </div>

            <div class="flex flex-col md:flex-row gap-2 mt-4">
              <!-- keep your existing simple viewer -->
              <!-- <button @click="viewQr(qr.imageUrl)" class="action-button">
                <img src="@/assets/view-icon.svg" class="h-5 w-5" />
                <span>View</span>
              </button> -->

              <!-- NEW: open the download modal (PNG/JPEG/SVG) -->
              <button @click="openDownloadForQr(qr.raw)" class="action-button">
                <img src="@/assets/view-icon.svg" class="h-5 w-5" />
                <span>Download</span>
              </button>

              <button @click="editItem(qr.id, 'editqr')" class="action-button">
                <img src="@/assets/edit-icon.svg" class="h-5 w-5" />
                <span>Edit</span>
              </button>

              <button
                @click="router.push(`/analyticsqr/${qr.id}`)"
                class="action-button text-green-400 hover:text-green-200"
              >
                <img src="@/assets/analytics-icon.svg" class="h-5 w-5" />
                <span>Analytics</span>
              </button>

              <button
                @click="deleteItem(qr.id, 'qr')"
                class="action-button text-red-400 hover:text-red-200"
              >
                <img src="@/assets/delete-icon.svg" class="h-5 w-5" />
                <span>Delete</span>
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
        <div
          class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-green-500 to-teal-500 py-8 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2
            class="text-2xl text-white font-extrabold self-start md:flex-grow"
          >
            Artist Smart Link Page
          </h2>
          <NuxtLink
            v-if="!hasBand || isSpecialUser"
            to="/createband"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />
            Create Artist Page
          </NuxtLink>
          <button
            v-else
            class="mdc-button flex justify-between w-full md:w-[300px] opacity-50 cursor-not-allowed"
            disabled
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />
            Only one artist allowed
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
              class="mx-auto h-full w-full md:h-[100px] md:w-[100px] object-cover rounded mr-4"
            />

            <div class="flex-grow">
              <span
                class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold"
              >
                {{ band.title }}
              </span>
            </div>

            <!-- ✅ Band Action Buttons -->
            <div class="flex flex-col md:flex-row flex-wrap gap-2 mt-4">
              <button
                @click="router.push(`/${band.slug}`)"
                class="action-button"
              >
                <img src="@/assets/view-icon.svg" class="h-5 w-5" />
                <span>View</span>
              </button>

              <button
                @click="router.push(`/editband/${band.id}`)"
                class="action-button"
              >
                <img src="@/assets/edit-icon.svg" class="h-5 w-5" />
                <span>Edit</span>
              </button>

              <button
                @click="router.push(`/analytics/${band.id}`)"
                class="action-button text-green-400 hover:text-green-200"
              >
                <img src="@/assets/analytics-icon.svg" class="h-5 w-5" />
                <span>Analytics</span>
              </button>

              <button
                @click="
                  copyToClipboard(`${config.public.baseUrl}/${band.slug}`)
                "
                class="action-button text-yellow-400 hover:text-yellow-200"
              >
                <img src="@/assets/share-icon.svg" class="h-5 w-5" />
                <span>Share</span>
              </button>

              <button
                @click="deleteItem(band.id, 'band')"
                class="action-button text-red-400 hover:text-red-200"
              >
                <img src="@/assets/delete-icon.svg" class="h-5 w-5" />
                <span>Delete</span>
              </button>
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
        <div
          class="flex flex-col px-6 border-b-2 bg-gradient-to-r from-blue-500 to-indigo-500 py-8 gap-2 items-center md:flex-row md:gap-0"
        >
          <h2
            class="text-2xl text-white font-extrabold self-start md:flex-grow"
          >
            Events
          </h2>
          <NuxtLink
            to="/newevent"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Create
            Event
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
              class="mx-auto h-full w-full md:h-[100px] md:w-[100px] object-cover rounded mr-4"
            />

            <div class="flex-grow">
              <span
                class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold"
              >
                {{ ev.title }}
              </span>
            </div>

            <!-- ✅ Event Action Buttons -->
            <div class="flex flex-col md:flex-row flex-wrap gap-2 mt-4">
              <button
                @click="router.push(`/${ev.bandSlug}/event/${ev.slug}`)"
                class="action-button"
              >
                <img src="@/assets/view-icon.svg" class="h-5 w-5" />
                <span>View</span>
              </button>

              <button
                @click="router.push(`/editevent/${ev.id}`)"
                class="action-button"
              >
                <img src="@/assets/edit-icon.svg" class="h-5 w-5" />
                <span>Edit</span>
              </button>

              <button
                @click="
                  copyToClipboard(
                    `${config.public.baseUrl}/${ev.bandSlug}/event/${ev.slug}`
                  )
                "
                class="action-button text-yellow-400 hover:text-yellow-200"
              >
                <img src="@/assets/share-icon.svg" class="h-5 w-5" />
                <span>Share</span>
              </button>

              <button
                @click="router.push(`/event-analytics/${ev.id}`)"
                class="action-button text-green-400 hover:text-green-200"
              >
                <img src="@/assets/analytics-icon.svg" class="h-5 w-5" />
                <span>Analytics</span>
              </button>

              <button
                @click="deleteItem(ev.id, 'event')"
                class="action-button text-red-400 hover:text-red-200"
              >
                <img src="@/assets/delete-icon.svg" class="h-5 w-5" />
                <span>Delete</span>
              </button>
            </div>
          </li>
        </ul>

        <div v-else class="px-6 py-6 text-center text-white">
          Create Your First Event
        </div>
      </div>
      <!-- Download modal (client-only component) -->

      <DownloadQr
        v-model="showDownload"
        :qr-options="activeQrOptions"
        :default-name="activeQrName"
        :key="showDownload ? activeQrName : 'closed'"
      />
      <!-- VIEW QR Popup -->
      <!-- <div
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

          <button
            @click="viewQr"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Close popup
          </button>
        </div>
      
      </div> -->
    </div>
    <transition name="fade-slide">
      <div
        v-if="showToast"
        class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm font-medium px-6 py-3 rounded shadow-lg z-50"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useNuxtApp } from "#app";
import { ref, onMounted, computed, inject, watch } from "vue";
import { differenceInCalendarDays } from "date-fns";
import { useRuntimeConfig } from "#imports";

// rebuild

// special user override
// with this:
const specialEmails = [
  "mjc773@gmail.com",
  "nick.tsoukas101@gmail.com",
  "partner@musicbizqr.com",
];
const isSpecialUser = computed(() => {
  const e = (user.value?.email || "").toLowerCase();
  return specialEmails.includes(e);
});

const maxQrAllowed = computed(() => (isSpecialUser.value ? 10 : 1));

const canCreateMoreQrs = computed(() => qrItems.value.length < maxQrAllowed.value);


const token = useStrapiToken();
const loadingPortal = ref(false);

console.log("My JWT is:", token.value); // undefined until you log in

const config = useRuntimeConfig();

const user = useStrapiUser();
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();
import { useStrapi } from "#imports";
const { find } = useStrapi();
const strapi = useStrapi();

const { setToken, fetchUser } = useStrapiAuth();

// reactive state
const daysLeft = ref(null);
const loadingTrial = ref(false);
const trialError = ref("");
const billingInfo = ref(null);
const subscriptionStatus = ref(null); // new

const nuxtApp = useNuxtApp();
const historyStack = nuxtApp.$historyStack; // ← grab the real one
const previousRoute = computed(() =>
  historyStack.value.length
    ? historyStack.value[historyStack.value.length - 1]
    : null
);

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

const showToast = ref(false);
const toastMessage = ref("");
let toastTimeout = null;
const showDownload = ref(false);
const activeQrOptions = ref(null);
const activeQrName = ref("qr-code");

console.log(qrs.value, "this is the qrs");

function openDownloadForQr(raw) {
  const built = buildQrOptionsFromStrapi(raw);
  activeQrOptions.value = built;
  activeQrName.value = raw?.attributes?.name || `qr-${raw?.id || ""}`;
  showDownload.value = true;
}
function buildQrOptionsFromStrapi(raw) {
  const a = raw?.attributes || {};
  const saved = a.options || {};

  // ✅ pull the encoded URL from the saved options first
  const dataValue =
    saved.data ||                 // ← the one you saved on create/update
    a.url ||                      // optional extra field on the model
    a.qrValue ||                  // historical fallback names
    a.link ||
    a.data ||
    "";

  const logo =
    saved.image ||
    saved.imageOptions?.src ||
    a.logo?.url ||
    null;

  const dotColor =
    saved.dotsOptions?.color ||
    a.qrColor ||
    a.colorDark ||
    saved.colorDark ||
    "#000000";

  const cornersSqColor =
    saved.cornersSquareOptions?.color || a.cornersSquareColor || dotColor;

  const cornersDotColor =
    saved.cornersDotOptions?.color || a.cornersDotColor || dotColor;

  const bg = saved.backgroundOptions?.color || a.backgroundColor || "#FFFFFF";

  const opts = {
    data: (dataValue || "").trim() || "https://musicbizqr.com", // final safety
    width: Number(saved.size || saved.width || 300),
    height: Number(saved.size || saved.height || 300),
    backgroundOptions: { color: bg },
    dotsOptions: {
      type: saved.dotsOptions?.type || "square",
      color: dotColor,
      gradient: saved.dotsOptions?.gradient ?? null,
    },
    cornersSquareOptions: {
      color: cornersSqColor,
      type: saved.cornersSquareOptions?.type || "square",
    },
    cornersDotOptions: {
      color: cornersDotColor,
      type: saved.cornersDotOptions?.type || "square",
    },
    imageOptions: {
      src: logo || "",
      imageSize: saved.imageOptions?.imageSize ?? 0.4,
      margin: saved.imageOptions?.margin ?? 0,
      crossOrigin:
        logo && !String(logo).startsWith("data:")
          ? "anonymous"
          : "anonymous",
    },
  };

  if (logo) opts.image = logo;

  // 🔎 debug exactly what will be passed to the Download modal
  console.log("[buildQrOptionsFromStrapi] opts.data =", opts.data);

  return opts;
}


function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toastMessage.value = "✅ Link copied to clipboard!";
      showToast.value = true;

      // Clear any previous timeout
      if (toastTimeout) clearTimeout(toastTimeout);

      // Auto-hide after 3 seconds
      toastTimeout = setTimeout(() => {
        showToast.value = false;
      }, 3000);
    })
    .catch(() => {
      toastMessage.value = "❌ Failed to copy link.";
      showToast.value = true;
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        showToast.value = false;
      }, 3000);
    });
}

async function fetchBillingInfo() {
  try {
    const result = await client("/stripe/billing", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    billingInfo.value = result;
    console.debug("[Dashboard] billingInfo =", billingInfo.value);
  } catch (err) {
    console.warn("[Dashboard] Failed to fetch billing info:", err);
  }
}

async function fetchTrialInfo() {
  loadingTrial.value = true;
  try {
    const subscription = await client("/stripe/subscription-status", {
      method: "GET",
      headers: { Authorization: `Bearer ${useStrapiToken().value}` },
    });
    console.debug("[Dashboard] subscription-status response:", subscription);

    subscriptionStatus.value =
      subscription && subscription.status ? subscription.status : null;

    const rawEnds = subscription.trialEndsAt;
    if (rawEnds) {
      const endDate =
        typeof rawEnds === "number"
          ? new Date(rawEnds * 1000)
          : new Date(rawEnds);
      const diff = differenceInCalendarDays(endDate, new Date());
      daysLeft.value = diff > 0 ? diff : 0;
    } else {
      daysLeft.value = null;
    }
  } catch (err) {
    console.error("[Dashboard] fetchTrialInfo error:", err);
    trialError.value = err.message || "Unknown error fetching trial info";
  } finally {
    loadingTrial.value = false;
  }
}

// refresh everything after billing portal return
watch(
  () => route.query.portal,
  async (flag) => {
    if (flag === "returned") {
      await Promise.all([fetchTrialInfo(), fetchBillingInfo(), fetchUser()]);
      router.replace({ path: route.path, query: {} });
    }
  }
);

const fetchData = async () => {
  if (!user.value) return;
  loading.value = true;

  try {
    // Stage 1: run independent queries in parallel
    const [qrsArr, bandsArr, eventsArr] = await Promise.all([
      fetchQrsLite(),
      fetchBandsLite(),
      fetchEventsLite(),
    ]);

    // Set state in one go (minimize reactive churn)
    qrs.value    = qrsArr;
    bands.value  = bandsArr;
    events.value = eventsArr;

    // Stage 2: scans depend on QR IDs
    const qrIds = qrsArr.map(q => q.id);
    // const scansArr = await fetchScansForQrIds(qrIds);
    // scans.value = scansArr;

  } catch (e) {
    console.error("[Dashboard] fetchData error:", e);
  } finally {
    loading.value = false;
  }
};


// Return-only helpers (no state mutation)
async function fetchQrsLite() {
  const resp = await find("qrs", {
    filters: { users_permissions_user: { id: { $eq: user.value.id } } },
    fields: ["name","id", "options"],
    populate: { q_image: { fields: ["url"] } },
    sort: ["updatedAt:desc"],
    pagination: { pageSize: 50 },
  });
  return Array.isArray(resp.data) ? resp.data : [];
}



async function fetchBandsLite() {
  const resp = await find("bands", {
    filters: { users_permissions_user: { id: { $eq: user.value.id } } },
    fields: ["name", "slug"],
    populate: { bandImg: { fields: ["url", "formats"] } },
    sort: ["updatedAt:desc"],
    pagination: { pageSize: 50 },
  });
  return Array.isArray(resp.data) ? resp.data : [];
}

async function fetchEventsLite() {
  const resp = await find("events", {
    filters: { users_permissions_user: { id: { $eq: user.value.id } } },
    fields: ["title", "slug"],
    populate: {
      image: { fields: ["url", "formats"] },
      band:  { fields: ["slug"] },
    },
    sort: ["updatedAt:desc"],
    pagination: { pageSize: 50 },
  });
  return Array.isArray(resp.data) ? resp.data : [];
}

// Keep your existing scans fetch (ideally replace with a /scans/count route)
async function fetchScansForQrIds(qrIds) {
  if (!qrIds.length) return [];
  const resp = await find("scans", {
    filters: { qr: { id: { $in: qrIds } } },
    pagination: { pageSize: 250 }, // reduce from 1000 for now
    populate: [],                  // no deep populate
  });
  return Array.isArray(resp.data) ? resp.data : [];
}


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
  qrs.value.map((qr) => ({
    id: qr.id,
    title: qr.attributes.name,
    imageUrl: qr.attributes.q_image?.data?.attributes?.url || "",
    // scans: qr.attributes.scans,
    raw: qr, // ← keep the full Strapi row so we can build QR options later
  }))
);

const bandItems = computed(() =>
  Array.isArray(bands.value)
    ? bands.value.map((b) => ({
        id: b.id,
        title: b.name,
        slug: b.slug,
        imageUrl: b.bandImg?.formats?.medium?.url || b.bandImg?.url || "",
      }))
    : []
);

const eventItems = computed(() =>
  events.value.map((ev) => ({
    id: ev.id,
    title: ev.attributes.title,
    slug: ev.attributes.slug, // ← event slug
    bandSlug: ev.attributes.band?.data?.attributes?.slug || null, // ← band slug
    imageUrl: ev.attributes.image?.data?.attributes?.url || "",
  }))
);

const viewQr = (img) => {
  imageURL.value = img;
  qrView.value = !qrView.value;
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
  // ——— 1) Handle email-confirm token in URL
   // Handle confirm token as you do now...
  const tok = route.query.token;
  if (typeof tok === "string") {
    setToken(tok);
    await fetchUser();
    router.replace({ path: route.path, query: {} });
  }

  // Parallelize independent calls
  await Promise.all([
    fetchBillingInfo(),
    fetchTrialInfo(),
  ]);

  // Then dashboard data
  await fetchData();
});

const editItem = (id, page) => {
  router.push(`/${page}/${id}`);
};

async function goToBillingPortal() {
  if (!token.value) {
    return alert("You must be logged in.");
  }
  loadingPortal.value = true;
  try {
    const { url } = await client("/stripe/create-billing-portal-session", {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
    });
    window.location.href = url;
  } catch (err) {
    console.error("[Dashboard] billing-portal error", err);
    alert("Could not open billing portal. Please try again.");
  } finally {
    loadingPortal.value = false;
  }
}

watch(
  () => route.query.portal,
  async (flag) => {
    if (flag === "returned") {
      // they just came back from Stripe’s portal
      await fetchTrialInfo(); // re-fetch daysLeft
      router.replace({ path: route.path, query: {} });
    }
  }
);
</script>

<style scoped lang="css">
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.action-button {
  @apply flex items-center gap-2 px-4 py-2 border rounded-md text-white text-sm hover:bg-white/10 transition;
}
.mdc-button {
  border: 1px solid white;
  background: transparent;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}
.mdc-button img {
  height: 20px;
}
.mdc-button:hover {
  background: rgba(255, 255, 255, 0.1);
}
img {
  object-fit: cover;
}
.text-white {
  color: #fff;
}
.border-white {
  border-color: #fff;
}
.bg-[#000] {
  background-color: #000;
}
.container {
  max-width: 1200px;
}
</style>
