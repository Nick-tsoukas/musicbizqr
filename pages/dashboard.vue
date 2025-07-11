<template>
  <div class="bg-[#000] pt-[var(--header-height)]">
    <div class="container bg-[#000] mx-auto p-4">
      <h1 class="text-2xl font-semibold mb-4 text-white">Dashboard</h1>

      <PastDueBanner />

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
            v-if="qrItems.length === 0"
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
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Only one
            QR allowed
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
              <span
                class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold"
                >{{ qr.title }}</span
              >
            </div>
            <div class="flex items-center gap-4">
              <!-- <p class="text-white">Scans: {{ qr.scans.data.length ? qr.scans.data.length : 0 }}</p> -->
              <button
                @click="viewQr(qr.imageUrl)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img
                  src="@/assets/view-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                @click="editItem(qr.id, 'editqr')"
                class="text-blue-600 hover:text-blue-900"
              >
                <img
                  src="@/assets/edit-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                @click="deleteItem(qr.id, 'qr')"
                class="text-red-600 hover:text-red-800"
              >
                <img
                  src="@/assets/delete-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div class="flex gap-4 p-2 ml-2 border-2 rounded-md border-solid">
              <button
                @click="router.push(`/analyticsqr/${qr.id}`)"
                class="text-green-600 flex gap-4 hover:text-green-900 w-full h-full"
              >
                <p class="text-white">Analytics</p>

                <img
                  src="@/assets/analytics-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
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
            Bands
          </h2>
          <NuxtLink
            v-if="!hasBand"
            to="/createband"
            class="mdc-button flex justify-between w-full md:w-[300px]"
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Create
            Artist Page
          </NuxtLink>
          <button
            v-else
            class="mdc-button flex justify-between w-full md:w-[300px] opacity-50 cursor-not-allowed"
            disabled
          >
            <img class="pr-2" src="@/assets/create-icon.svg" alt="" />Only one
            artist allowed
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
              <span
                class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold"
                >{{ band.title }}</span
              >
            </div>
            <div class="flex items-center gap-4">
              <button
                @click="router.push(`/${band.slug}`)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img
                  src="@/assets/view-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                @click="router.push(`/editband/${band.id}`)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img
                  src="@/assets/edit-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                @click="deleteItem(band.id, 'band')"
                class="text-red-600 hover:text-red-800"
              >
                <img
                  src="@/assets/delete-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div class="flex gap-4 p-2 ml-2 border-2 rounded-md border-solid">
              <button
                @click="router.push(`/analytics/${band.id}`)"
                class="text-green-600 flex gap-4 hover:text-green-900"
              >
                <p class="text-white">Analytics</p>

                <img
                  src="@/assets/analytics-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
            </div>

            <button
              @click="copyToClipboard(`${config.public.baseUrl}/${band.slug}`)"
              class="text-yellow-500 hover:text-yellow-700 flex gap-2"
            >
              <p class="text-white">Share</p>
              <img src="@/assets/share-icon.svg" class="h-6 w-6" />
            </button>
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
              class="mx-auto h-full w-[100%] md:h-[100px] md:w-[100px] object-cover rounded mr-4"
            />
            <div class="flex-grow">
              <span
                class="text-white break-words pt-4 md:pt-0 text-wrap font-semibold"
                >{{ ev.title }}</span
              >
            </div>
            <div class="flex items-center gap-4">
              <button
                @click="router.push(`/event/${ev.id}`)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img
                  src="@/assets/view-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                @click="router.push(`/editevent/${ev.id}`)"
                class="text-blue-600 hover:text-blue-900"
              >
                <img
                  src="@/assets/edit-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
              </button>
              <button
                @click="
                  copyToClipboard(`${config.public.baseUrl}/event/${ev.id}`)
                "
                class="text-yellow-500 hover:text-yellow-700"
              >
                <img src="@/assets/share-icon.svg" class="h-6 w-6" />
              </button>
              <button
                @click="deleteItem(ev.id, 'event')"
                class="text-red-600 hover:text-red-800"
              >
                <img
                  src="@/assets/delete-icon.svg"
                  class="h-6 w-6"
                  aria-hidden="true"
                />
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

          <button
            @click="viewQr"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Close popup
          </button>
        </div>
        <!-- <div class="absolute bottom-10 right-10">
          <h2 @click="viewQr" class="text-white cursor-pointer">Close</h2>
        </div> -->
      </div>
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


const showToast = ref(false)
const toastMessage = ref('')
let toastTimeout = null

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    toastMessage.value = '✅ Link copied to clipboard!'
    showToast.value = true

    // Clear any previous timeout
    if (toastTimeout) clearTimeout(toastTimeout)

    // Auto-hide after 3 seconds
    toastTimeout = setTimeout(() => {
      showToast.value = false
    }, 3000)
  }).catch(() => {
    toastMessage.value = '❌ Failed to copy link.'
    showToast.value = true
    if (toastTimeout) clearTimeout(toastTimeout)
    toastTimeout = setTimeout(() => {
      showToast.value = false
    }, 3000)
  })
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
  console.debug("[Dashboard] fetchTrialInfo: starting…");

  try {
    console.debug(
      "[Dashboard] fetchTrialInfo: GET /stripe/subscription-status via Strapi client"
    );
    // returns the raw body { status, plan, trialEndsAt, gracePeriodStart }
    const subscription = await client("/stripe/subscription-status", {
      method: "GET",
      headers: { Authorization: `Bearer ${useStrapiToken().value}` },
    });
    console.debug("[Dashboard] subscription-status response:", subscription);

    // if your controller returned an error, subscription may have an `error` key
    if (subscription.error) {
      throw new Error(subscription.error.message || "Stripe error");
    }

    // now subscription.trialEndsAt is what your controller sent
    const rawEnds = subscription.trialEndsAt;
    console.debug("[Dashboard] raw trialEndsAt:", rawEnds);

    if (rawEnds) {
      const endDate =
        typeof rawEnds === "number"
          ? new Date(rawEnds * 1000)
          : new Date(rawEnds);
      const diff = differenceInCalendarDays(endDate, new Date());
      daysLeft.value = diff > 0 ? diff : 0;
      console.debug("[Dashboard] daysLeft =", daysLeft.value);
    } else {
      daysLeft.value = null;
      console.debug(
        "[Dashboard] no trialEndsAt; user is on paid plan or inactive"
      );
    }
  } catch (err) {
    console.error("[Dashboard] fetchTrialInfo error:", err);
    trialError.value = err.message || "Unknown error fetching trial info";
  } finally {
    loadingTrial.value = false;
    console.debug(
      "[Dashboard] fetchTrialInfo: loadingTrial =",
      loadingTrial.value
    );
  }
}

const fetchData = async () => {
  if (!user.value) return;
  try {
    await fetchQrs();
    await fetchScans();
    await Promise.all([fetchBands(), fetchEvents()]);
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
  const qrIds = qrs.value.map((q) => q.id);
  if (!qrIds.length) {
    scans.value = [];
    return;
  }
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
  qrs.value.map((qr) => ({
    id: qr.id,
    title: qr.attributes.name,
    imageUrl: qr.attributes.q_image?.data?.attributes?.url || "",
    scans: qr.attributes.scans,
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
  const tok = route.query.token;
  if (typeof tok === "string") {
    console.debug("[Dashboard] found token in URL:", tok);
    setToken(tok); // save into Nuxt-Strapi
    await fetchUser(); // populate strapiUser.value
    console.debug("[Dashboard] fetched user after confirm:", user);
    // clean URL so token isn’t visible
    router.replace({ path: route.path, query: {} });
  }

  await fetchBillingInfo();

  await fetchTrialInfo();
  console.log("Full history stack:", historyStack.value);
  console.log("Previous route:", previousRoute.value);

  if (previousRoute.value?.path === "/createband") {
    // do the full reload
    window.location.reload();
    return;
  }

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
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
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
