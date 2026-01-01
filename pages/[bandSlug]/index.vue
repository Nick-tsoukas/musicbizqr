<template>
  <div>
    <div v-if="loadingData" class="loading-container">
      <div class="spinner"></div>
    </div>

    <div
      v-else-if="notFound"
      class="bg-black w-screen min-h-[60vh] mx-auto pt-[var(--header-height)] fade-in"
    >
      <div class="max-w-5xl mx-auto px-6 py-10">
        <div class="text-white text-2xl font-bold">Band not found</div>
        <div class="text-white/70 mt-2">
          Check the link and try again.
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-black w-screen h-[35vh] md:h-[60vh] mx-auto pt-[var(--header-height)] fade-in"
    >
      <div
        v-if="paymentBannerVisible"
        class="w-full px-4 md:px-8 py-3 bg-purple-900/60 text-white border-b border-purple-500/40"
      >
        <div class="max-w-5xl mx-auto flex items-start justify-between gap-4">
          <div class="text-sm md:text-base">
            <div class="font-semibold">
              {{ paymentBannerTitle }}
            </div>
            <div v-if="paymentBannerDetail" class="text-white/90 mt-1">
              {{ paymentBannerDetail }}
            </div>
          </div>
          <button
            type="button"
            class="text-white/80 hover:text-white text-lg leading-none"
            @click="dismissPaymentBanner"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Hero Section -->
      <div class="relative w-full h-[35vh] md:h-[60vh]">
        <img
          v-if="band.data.bandImg"
          :src="band.data.bandImg.url"
          :alt="`${band.data.name} image`"
          class="absolute inset-0 w-auto m-auto h-[35vh] md:h-2/3 object-cover"
        />

        <div class="absolute inset-0 bg-black/0"></div>
      </div>

      <!-- Band Name -->
      <div
        v-if="!band.data.isBandNameInLogo"
        class="text-center text-white text-4xl font-bold mt-4"
      >
        {{ band.data.name }}
      </div>

      <!-- Bio & Tagline -->
      <div class="flex justify-center mt-4">
        <div class="text-center text-white max-w-5xl">
          <p
            v-if="band.data.bio"
            class="md:text-2xl leading-tight whitespace-pre-line"
          >
            {{ band.data.bio }}
          </p>
          <p
            v-if="band.data.biotagline"
            class="md:text-2xl leading-tight whitespace-pre-line mt-2"
          >
            {{ band.data.biotagline }}
          </p>
        </div>
      </div>

      <client-only>
        <div v-if="band?.data" class="flex justify-center mt-4">
          <div class="w-full max-w-5xl px-6 flex justify-end">
            <button
              type="button"
              class="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
              @click="onToggleSaveBand"
            >
              {{ isCurrentBandSaved ? "✓ Saved" : "⭐ Save this band" }}
            </button>
          </div>
        </div>
        <div v-if="showSavedConfirmation" class="flex justify-center mt-2">
          <div class="w-full max-w-5xl px-6 text-white/70 text-sm">
            Saved — find it anytime in the menu
          </div>
        </div>
      </client-only>

      <!-- Main Content -->
      <div class="w-full px-6 mt-4 md:max-w-[80vw] md:mx-auto">
        <!-- Featured Song -->
        <section v-if="hasFeaturedSong" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Featured Song
          </h2>

          <!-- Embedded Track -->
          <div
            v-if="band.data.singlesong.isEmbed && safeEmbedHtml"
            class="w-full"
          >
            <div class="relative w-full h-64 rounded-lg overflow-hidden">
              <div
                id="embedPlayerWrapper"
                ref="embedPlayerWrapperEl"
                class="absolute inset-0 w-full h-full"
                v-html="safeEmbedHtml"
              ></div>
            </div>
          </div>

          <!-- Raw Audio -->
          <div v-else class="w-full">
            <AudioPlayer
              :album="formatSingleSong(band.data.singlesong)"
              :placeholderImage="'/placeholder-image.svg'"
              @play="onSongPlay"
              class="rounded-lg"
            />
          </div>
        </section>

        <!-- Featured Video -->
        <section v-if="band.data.singlevideo?.youtubeid" class="w-full mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Featured Video
          </h2>

          <div
            v-if="!isVideoPlaying"
            @click="playVideo"
            class="relative w-full overflow-hidden bg-black cursor-pointer rounded-lg embed-container"
          >
            <img
              :src="singleVideoThumbnail"
              :alt="`${band.data.name} video thumbnail`"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
            ></div>
          </div>

          <div v-else class="embed-container rounded-lg overflow-hidden">
            <iframe
              :src="singleVideoEmbedUrl + '?autoplay=1'"
              allow="autoplay; encrypted-media; fullscreen"
              allowfullscreen
            ></iframe>
          </div>
        </section>

        <!-- Website Link -->
        <section v-if="band.data.websitelink" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
            Website Link
          </h2>
          <a
            :href="band.data.websitelink"
            class="text-purple-500 text-xl"
            target="_blank"
            rel="noopener"
          >
            {{ band.data.websitelinktext || band.data.websitelink }}
          </a>
        </section>

        <!-- Streaming Links -->
        <section v-if="hasStreamingLinks" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Streaming Links
          </h2>
          <template v-for="platform in streamingPlatforms" :key="platform.name">
            <span v-if="band.data[platform.name] && !isLinkHidden(platform.name)">
              <a
                :href="band.data[platform.name]"
                @click.prevent="
                  handleClick(
                    band.data.id,
                    platform.name,
                    band.data[platform.name]
                  )
                "
              >
                <button
                  class="w-full mb-6 custom-border text-white text-lg flex justify-center font-semibold px-4 py-4 items-center relative shadow-lg rounded-md md:text-xl"
                >
                  <img
                    :src="platform.img"
                    class="h-10 absolute left-2"
                    :alt="platform.label"
                  />
                  {{ platform.label }}
                </button>
              </a>
            </span>
          </template>
        </section>

        <!-- Social Media -->
        <section v-if="hasSocialLinks" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Social Media
          </h2>
          <template v-for="platform in socialPlatforms" :key="platform.name">
            <span v-if="band.data[platform.name] && !isLinkHidden(platform.name)">
              <a
                :href="band.data[platform.name]"
                @click.prevent="
                  handleClick(
                    band.data.id,
                    platform.name,
                    band.data[platform.name]
                  )
                "
              >
                <button
                  class="w-full custom-border mb-6 text-white text-lg flex justify-center font-semibold px-4 py-4 items-center relative shadow-lg rounded-md md:text-xl"
                >
                  <img
                    :src="platform.img"
                    class="h-10 absolute left-2"
                    :alt="platform.label"
                  />
                  {{ platform.label }}
                </button>
              </a>
            </span>
          </template>
        </section>

        <!-- Upcoming Events -->
        <section
          v-if="upcomingEvents.length"
          id="upcoming-events"
          class="mt-10"
        >
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Upcoming Events
          </h2>
          <div
            class="overflow-x-scroll md:overflow-hidden relative no-scrollbar"
          >
            <table
              class="w-full table-auto bg-black text-white rounded-md shadow-lg"
            >
              <thead>
                <tr class="border-b border-purple-500 border-opacity-30">
                  <th class="px-2 py-2 text-left">Date</th>
                  <th class="px-2 py-2 text-left">City</th>
                  <th class="px-2 py-2 text-left">Venue</th>
                  <th class="px-2 py-2 text-left">Tickets</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="event in upcomingEvents"
                  :key="event.id"
                  class="border-b border-purple-500 border-opacity-20 hover:bg-purple-900 cursor-pointer"
                  @click.stop="
                    router.push(`/${route.params.bandSlug}/event/${event.slug}`)
                  "
                >
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ formatDate(event.date) }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ event.city || "N/A" }}, {{ event.state }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ event.venue || "N/A" }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    <button
                      @click.stop="
                        router.push(
                          `/${route.params.bandSlug}/event/${event.slug}`
                        )
                      "
                      class="text-purple-400"
                    >
                      View Event
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Past Events -->
        <section v-if="pastEvents.length" class="mt-10">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Past Events
          </h2>
          <div
            class="overflow-x-scroll md:overflow-hidden relative no-scrollbar"
          >
            <table
              class="w-full table-auto bg-black text-white rounded-md shadow-lg"
            >
              <thead>
                <tr class="border-b border-purple-500 border-opacity-30">
                  <th class="px-2 py-2 text-left">Date</th>
                  <th class="px-2 py-2 text-left">City</th>
                  <th class="px-2 py-2 text-left">Venue</th>
                  <th class="px-2 py-2 text-left">Tickets</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="event in pastEvents"
                  :key="event.id"
                  class="border-b border-purple-500 border-opacity-20 hover:bg-purple-900 cursor-pointer"
                  @click.stop="
                    router.push(`/${route.params.bandSlug}/event/${event.slug}`)
                  "
                >
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ formatDate(event.date) }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ event.city || "N/A" }}, {{ event.state }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    {{ event.venue || "N/A" }}
                  </td>
                  <td class="px-2 py-1 whitespace-nowrap text-purple-400">
                    <button
                      @click.stop="
                        router.push(
                          `/${route.params.bandSlug}/event/${event.slug}`
                        )
                      "
                      class="text-purple-400"
                    >
                      View Event
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-if="canShowPayments" class="mt-10">
          

          <div v-if="paymentError" class="text-red-400 mb-3">
            {{ paymentError }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div
              v-for="btn in enabledPaymentButtons"
              :key="btn.key"
              class="border border-white/20 rounded-lg p-4 bg-black/40"
            >
              <div class="text-white font-semibold text-lg">
                {{ btn.title }}
              </div>
              <div v-if="btn.description" class="text-white/80 mt-1">
                {{ btn.description }}
              </div>

              <div class="mt-3">
                <div v-if="btn.pricingMode === 'min'">
                  <div class="text-white/70 text-sm mb-2">Enter an amount</div>
                  <div class="flex items-center gap-2">
                    <span class="text-white/80">$</span>
                    <input
                      v-model.number="paymentAmountByKey[btn.key]"
                      type="number"
                      step="1"
                      min="0"
                      class="w-32 px-3 py-2 rounded-md bg-black border border-white/20 text-white"
                    />
                    <span v-if="btn.minAmount" class="text-white/60">
                      Minimum ${{ btn.minAmount }}
                    </span>
                  </div>
                </div>

                <div v-else-if="btn.pricingMode === 'presets'">
                  <div class="text-white/70 text-sm mb-2">Select an amount</div>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="amt in (btn.presetAmounts || [])"
                      :key="amt"
                      type="button"
                      class="px-3 py-2 rounded-md border border-white/20 text-white hover:bg-purple-900/40"
                      :class="{
                        'bg-purple-900/60': Number(paymentAmountByKey[btn.key]) === Number(amt),
                      }"
                      @click="paymentAmountByKey[btn.key] = Number(amt)"
                    >
                      ${{ amt }}
                    </button>
                  </div>
                </div>

                <div v-else-if="btn.pricingMode === 'fixed'">
                  <div class="text-white/70 text-sm mb-1">Fixed price</div>
                  <div class="text-white text-xl font-semibold">
                    ${{ btn.fixedAmount }}
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="w-full mt-4 custom-border text-white text-lg flex justify-center font-semibold px-4 py-3 items-center relative shadow-lg rounded-md md:text-xl disabled:opacity-60"
                :disabled="paymentLoadingKey === btn.key"
                @click="startCheckout(btn)"
              >
                <span v-if="paymentLoadingKey === btn.key">Loading…</span>
                <span v-else>Continue to Payment</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer class="h-40 flex justify-center items-center">
        <img src="@/assets/musicbizlogo.png" alt="MusicBiz Logo" class="h-12" />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount } from "vue";
import { useRuntimeConfig } from "#imports";
import { useBeacon } from "@/composables/useBeacon";
import { useSavedBands } from "@/composables/useSavedBands";
import { useRoute, useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import AudioPlayer from "@/components/AudioPlayer.vue";

import facebookIcon from "@/assets/facebookfree.png";
import instagramIcon from "@/assets/instagramfree.png";
import twitchIcon from "@/assets/twitchfree.png";
import appleMusicIcon from "@/assets/apple.svg";
import soundcloudIcon from "@/assets/soundcloudlast.png";
import deezerIcon from "@/assets/dezzer.svg";
import youtubeIcon from "@/assets/youtube-icon.svg";
import bandcampIcon from "@/assets/bandcamp.svg";
import reverbnationIcon from "@/assets/reverbnation.png";
import spotifyIcon from "@/assets/spotify.svg";
import youtubeMusicIcon from "@/assets/youtube-icon.svg";
import tiktokIcon from "@/assets/tiktok.png";
import twitterIcon from "@/assets/twitter.png";

const hasTrackedEmbedClick = ref(false);
const embedPlayerWrapperEl = ref(null);
const embedIframeEl = ref(null);
let onEmbedIframeFocus = null;
let onEmbedIframePointerDown = null;
let onEmbedIframeTouchStart = null;
let onEmbedIframeMouseEnter = null;
let onEmbedIframeMouseLeave = null;
let onWindowBlur = null;
let onDocumentVisibilityChange = null;
let embedActivePollInterval = null;
let embedActivePollTimeout = null;
let embedHovering = false;
let lastEmbedHoverAt = 0;
const nuxtApp = useNuxtApp();

const { trackClick, trackMediaPlay } = useBeacon();
const { isSaved, toggleSaveBand } = useSavedBands();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const showSavedConfirmation = ref(false);
let savedConfirmationTimeout = null;

const paymentBannerVisible = ref(false);
const paymentBannerTitle = ref("");
const paymentBannerDetail = ref("");

const paymentError = ref("");
const paymentLoadingKey = ref(null);
const paymentAmountByKey = ref({});

const enabledPaymentButtons = computed(() => {
  const btns = band.value?.data?.paymentButtons;
  if (!Array.isArray(btns)) return [];
  return btns.filter((b) => b && b.enabled === true);
});

const canShowPayments = computed(() => {
  // Payments are only meaningful if the band has connect enabled.
  // If these fields are absent from the public response, we still show the buttons.
  const enabled = band.value?.data?.paymentsEnabled;
  const onboarded = band.value?.data?.stripeOnboardingComplete;
  if (enabled === false || onboarded === false) return false;
  return enabledPaymentButtons.value.length > 0;
});

function initPaymentDefaults() {
  const next = { ...(paymentAmountByKey.value || {}) };
  for (const btn of enabledPaymentButtons.value) {
    if (next[btn.key] != null) continue;
    if (btn.pricingMode === "min") {
      next[btn.key] = Number(btn.minAmount || 5);
    } else if (btn.pricingMode === "presets") {
      const first = Array.isArray(btn.presetAmounts) ? btn.presetAmounts[0] : null;
      next[btn.key] = first != null ? Number(first) : 5;
    } else if (btn.pricingMode === "fixed") {
      next[btn.key] = Number(btn.fixedAmount || 0);
    }
  }
  paymentAmountByKey.value = next;
}

async function startCheckout(btn) {
  paymentError.value = "";
  paymentLoadingKey.value = btn.key;

  try {
    const api = config.public.strapiUrl;
    const bandId = band.value?.data?.id;
    if (!bandId) throw new Error("Band not loaded yet");

    const body = { buttonKey: btn.key };

    if (btn.pricingMode === "min") {
      const a = Number(paymentAmountByKey.value?.[btn.key]);
      if (!a || a <= 0) throw new Error("Enter an amount");
      if (btn.minAmount && a < Number(btn.minAmount)) {
        throw new Error(`Minimum is $${btn.minAmount}`);
      }
      body.amount = a;
    }

    if (btn.pricingMode === "presets") {
      const a = Number(paymentAmountByKey.value?.[btn.key]);
      if (!a || a <= 0) throw new Error("Select an amount");
      body.amount = a;
    }

    const res = await fetch(`${api}/api/bands/${bandId}/payments/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    const url = json?.url || json?.data?.url;
    if (!res.ok) {
      const msg = json?.error?.message || "Unable to start checkout";
      throw new Error(msg);
    }

    if (!url) throw new Error("Checkout URL missing");

    window.location.href = url;
  } catch (e) {
    paymentError.value = e?.message || String(e);
  } finally {
    paymentLoadingKey.value = null;
  }
}

async function handlePaymentQuery() {
  const paid = String(route.query?.paid || "");
  const canceled = String(route.query?.canceled || "");
  const sm = route.query?.sm ? String(route.query.sm) : null;

  if (paid === "1") {
    paymentBannerVisible.value = true;
    paymentBannerTitle.value = "Payment successful";
    paymentBannerDetail.value = sm ? `Support moment #${sm}` : "";

    if (sm) {
      try {
        const api = config.public.strapiUrl;
        const url =
          `${api}/api/support-moments/${encodeURIComponent(sm)}/summary`;

        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const attrs = data?.data || null;
          const amount = attrs?.amount;
          const currency = (attrs?.currency || "usd").toUpperCase();
          const label = attrs?.supportLabel;

          if (amount != null && label) {
            paymentBannerDetail.value = `${label} — ${currency} ${amount}`;
          } else if (amount != null) {
            paymentBannerDetail.value = `${currency} ${amount}`;
          }
        }
      } catch (e) {
        // ignore
      }
    }
  } else if (canceled === "1") {
    paymentBannerVisible.value = true;
    paymentBannerTitle.value = "Payment canceled";
    paymentBannerDetail.value = "You can try again anytime.";
  }
}

function dismissPaymentBanner() {
  paymentBannerVisible.value = false;
  const nextQuery = { ...(route.query || {}) };
  delete nextQuery.paid;
  delete nextQuery.canceled;
  delete nextQuery.sm;
  router.replace({ query: nextQuery });
}

// replace: const loading = ref(true);
const loadingData = ref(true);
const heroReady = ref(false);
const notFound = ref(false);

const showPage = computed(() => {
  const url = band.value?.data?.bandImg?.url;
  // show when data is fetched AND either no hero or hero preloaded
  return !loadingData.value && (!url || heroReady.value);
});
const band = ref(null);
const events = ref([]);

const currentBandSlug = computed(() => {
  return (
    band.value?.data?.slug ||
    String(route.params.bandSlug || "").toLowerCase() ||
    ""
  );
});

const isCurrentBandSaved = computed(() => {
  const slug = currentBandSlug.value;
  if (!slug) return false;
  return isSaved(slug);
});

function onToggleSaveBand() {
  const slug = currentBandSlug.value;
  if (!slug) return;

  const payload = {
    bandSlug: slug,
    bandName: band.value?.data?.name || slug,
    bandImageUrl: band.value?.data?.bandImg?.url || null,
  };

  const didSave = toggleSaveBand(payload);
  if (didSave) {
    showSavedConfirmation.value = true;
    if (savedConfirmationTimeout) clearTimeout(savedConfirmationTimeout);
    savedConfirmationTimeout = setTimeout(() => {
      showSavedConfirmation.value = false;
      savedConfirmationTimeout = null;
    }, 2500);
  } else {
    showSavedConfirmation.value = false;
    if (savedConfirmationTimeout) {
      clearTimeout(savedConfirmationTimeout);
      savedConfirmationTimeout = null;
    }
  }
}

// ⬇️ add this small helper near the top of <script setup>
function readQrStampFromCookie() {
  if (typeof document === 'undefined') return null
  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith('mbq_qr_src='))
  if (!raw) return null
  try {
    const json = decodeURIComponent(raw.split('=')[1] || '')
    return JSON.parse(json)
  } catch {
    return null
  }
}

function clearQrStampCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `mbq_qr_src=; path=/; max-age=0; sameSite=lax`
}


function preloadHero(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(true); // nothing to wait on
    const img = new Image();
    // ask browser to prioritize this
    img.loading = "eager";
    img.decoding = "sync";
    // if you serve from a different origin and need it later on canvas, uncomment:
    // img.crossOrigin = 'anonymous'
    const done = () => resolve(true);
    img.onload = done;
    img.onerror = done; // don’t hang the UI if it fails
    img.src = src;
    if (img.complete) return resolve(true); // cached path
    // final guard so we never spin forever (network weirdness)
    setTimeout(done, 3000);
  });
}

const isVideoPlaying = ref(false);

/* ---------- helpers ---------- */
function extractYouTubeId(url) {
  const m = url?.match(/[?&]v=([^&]+)/) || url?.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : "";
}

function sanitizeEmbed(html) {
  if (!html) return "";
  // must contain an iframe; strip scripts
  if (!/<iframe[\s\S]*<\/iframe>/i.test(html)) return "";
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

/* ---------- embed & featured song ---------- */
const rawEmbedHtml = computed(
  () => band.value?.data?.singlesong?.embedHtml || ""
);
const safeEmbedHtml = computed(() => sanitizeEmbed(rawEmbedHtml.value));

const hasFeaturedSong = computed(() => {
  const s = band.value?.data?.singlesong;
  if (!s) return false;

  if (s.isEmbed) {
    // Only render if we truly have a valid iframe after sanitization
    return !!safeEmbedHtml.value;
  }

  // Raw audio mode: require a real file URL
  const nestedUrl = s?.song?.data?.attributes?.url;
  const directUrl = s?.song?.url;
  return !!(nestedUrl || directUrl);
});

function handleFirstClick() {
  // Track the first interaction with the embed without blocking it
  if (!hasTrackedEmbedClick.value) {
    try {
      const bandId = band.value?.data?.id;
      const title = band.value?.data?.singlesong?.title || "song";
      trackMediaPlay(bandId, "song", title);
    } catch (e) {
      console.error("trackMediaPlay (embed) error:", e);
    } finally {
      hasTrackedEmbedClick.value = true;
      // Once we have recorded the first engagement, remove listeners to keep it lightweight.
      detachEmbedIframeListeners();
    }
  }
}

function detachEmbedIframeListeners() {
  if (embedIframeEl.value && onEmbedIframeFocus) {
    embedIframeEl.value.removeEventListener("focus", onEmbedIframeFocus, true);
  }
  if (embedIframeEl.value && onEmbedIframePointerDown) {
    embedIframeEl.value.removeEventListener(
      "pointerdown",
      onEmbedIframePointerDown,
      true
    );
  }
  if (embedIframeEl.value && onEmbedIframeTouchStart) {
    embedIframeEl.value.removeEventListener(
      "touchstart",
      onEmbedIframeTouchStart,
      true
    );
  }
  if (embedIframeEl.value && onEmbedIframeMouseEnter) {
    embedIframeEl.value.removeEventListener(
      "mouseenter",
      onEmbedIframeMouseEnter,
      true
    );
  }
  if (embedIframeEl.value && onEmbedIframeMouseLeave) {
    embedIframeEl.value.removeEventListener(
      "mouseleave",
      onEmbedIframeMouseLeave,
      true
    );
  }

  if (typeof window !== "undefined" && onWindowBlur) {
    window.removeEventListener("blur", onWindowBlur, true);
  }

  if (typeof document !== "undefined" && onDocumentVisibilityChange) {
    document.removeEventListener(
      "visibilitychange",
      onDocumentVisibilityChange,
      true
    );
  }

  if (embedActivePollInterval) {
    clearInterval(embedActivePollInterval);
    embedActivePollInterval = null;
  }
  if (embedActivePollTimeout) {
    clearTimeout(embedActivePollTimeout);
    embedActivePollTimeout = null;
  }
  embedIframeEl.value = null;
  onEmbedIframeFocus = null;
  onEmbedIframePointerDown = null;
  onEmbedIframeTouchStart = null;
  onEmbedIframeMouseEnter = null;
  onEmbedIframeMouseLeave = null;
  onWindowBlur = null;
  onDocumentVisibilityChange = null;
  embedHovering = false;
  lastEmbedHoverAt = 0;
}

async function attachEmbedIframeListeners() {
  if (typeof window === "undefined") return;

  await nextTick();

  const wrapper = embedPlayerWrapperEl.value;
  if (!wrapper) return;

  const iframe = wrapper.querySelector("iframe");
  if (!iframe) return;

  // avoid double-binding if Nuxt re-renders
  if (embedIframeEl.value === iframe && onEmbedIframeFocus) return;

  detachEmbedIframeListeners();

  embedIframeEl.value = iframe;
  // Some providers/UA combos won't focus the iframe unless it is explicitly focusable.
  try {
    iframe.setAttribute("tabindex", "0");
  } catch {
    // ignore
  }

  onEmbedIframeFocus = () => handleFirstClick();
  onEmbedIframePointerDown = () => handleFirstClick();
  onEmbedIframeTouchStart = () => handleFirstClick();
  onEmbedIframeMouseEnter = () => {
    embedHovering = true;
    lastEmbedHoverAt = Date.now();
  };
  onEmbedIframeMouseLeave = () => {
    embedHovering = false;
  };

  // Hacky-but-good-UX: when a user clicks into a cross-origin iframe,
  // some browsers won't fire parent click/pointer events, but they often:
  // - focus the iframe element, or
  // - cause the top window to blur while the mouse is hovering over the iframe.
  onWindowBlur = () => {
    if (hasTrackedEmbedClick.value) return;
    if (!embedHovering) return;
    if (Date.now() - lastEmbedHoverAt > 2000) return;
    handleFirstClick();
  };

  // On some mobile browsers, a tap into an iframe can sometimes trigger visibility transitions.
  // This is a weak signal, so we only treat it as engagement if the iframe is currently focused.
  onDocumentVisibilityChange = () => {
    if (hasTrackedEmbedClick.value) return;
    if (document.visibilityState !== "hidden") return;
    if (document.activeElement === iframe) {
      handleFirstClick();
    }
  };

  // When the user clicks/taps inside the embed, the iframe element becomes focused.
  iframe.addEventListener("focus", onEmbedIframeFocus, true);
  iframe.addEventListener("pointerdown", onEmbedIframePointerDown, true);
  iframe.addEventListener("touchstart", onEmbedIframeTouchStart, true);
  iframe.addEventListener("mouseenter", onEmbedIframeMouseEnter, true);
  iframe.addEventListener("mouseleave", onEmbedIframeMouseLeave, true);
  window.addEventListener("blur", onWindowBlur, true);
  document.addEventListener("visibilitychange", onDocumentVisibilityChange, true);

  // Poll fallback: if the provider focuses the iframe without firing focus listeners reliably,
  // we still detect it (lightweight, short lived).
  embedActivePollInterval = setInterval(() => {
    if (hasTrackedEmbedClick.value) return;
    if (!embedIframeEl.value) return;
    if (document.activeElement === embedIframeEl.value) {
      handleFirstClick();
    }
  }, 500);

  // Don't poll forever; if the user never interacts, stop after a short window.
  embedActivePollTimeout = setTimeout(() => {
    if (embedActivePollInterval) {
      clearInterval(embedActivePollInterval);
      embedActivePollInterval = null;
    }
    if (embedActivePollTimeout) {
      clearTimeout(embedActivePollTimeout);
      embedActivePollTimeout = null;
    }
  }, 120000);
}

watch(
  () => safeEmbedHtml.value,
  async () => {
    await attachEmbedIframeListeners();
  }
);

onMounted(async () => {
  await attachEmbedIframeListeners();
});

onBeforeUnmount(() => {
  detachEmbedIframeListeners();
  if (savedConfirmationTimeout) {
    clearTimeout(savedConfirmationTimeout);
    savedConfirmationTimeout = null;
  }
});

/* ---------- streaming & social sections ---------- */
const hiddenLinkKeys = computed(() => {
  const v = band.value?.data?.hiddenLinks;
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (v && typeof v === 'object') return Object.keys(v).filter((k) => v[k]);
  return [];
});

function isLinkHidden(key) {
  return hiddenLinkKeys.value.includes(key);
}

const hasStreamingLinks = computed(() =>
  streamingPlatforms.some((p) => !!band.value?.data?.[p.name] && !isLinkHidden(p.name))
);
const hasSocialLinks = computed(() =>
  socialPlatforms.some((p) => !!band.value?.data?.[p.name] && !isLinkHidden(p.name))
);

/* ---------- video ---------- */
const singleVideoThumbnail = computed(() => {
  const id = extractYouTubeId(band.value?.data?.singlevideo?.youtubeid || "");
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
});
const singleVideoEmbedUrl = computed(() => {
  const id = extractYouTubeId(band.value?.data?.singlevideo?.youtubeid || "");
  return id ? `https://www.youtube.com/embed/${id}` : "";
});

/* ---------- formatting ---------- */
function formatDate(dateStr) {
  // Always English (US)
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSingleSong(single) {
  if (!single) return null;
  const nestedUrl = single?.song?.data?.attributes?.url;
  const directUrl = single?.song?.url;
  const fileUrl = nestedUrl || directUrl || null;

  return {
    id: single?.id,
    attributes: {
      title: single?.title || "Untitled",
      song: { data: { attributes: { url: fileUrl } } },
      duration: single?.duration || 0,
      cover: single?.cover || null,
      artist: band.value?.data?.name || "Artist",
    },
  };
}

/* ---------- tracking ---------- */
async function onSongPlay() {
  if (!band.value?.data?.singlesong) return;
  const bandId = band.value.data.id;
  const title = band.value.data.singlesong.title || "song";
  try {
    await trackMediaPlay(bandId, "song", title);
  } catch (err) {
    console.error("❌ trackMediaPlay error:", err);
  }
}

async function playVideo() {
  isVideoPlaying.value = true;
  const bandId = band.value?.data?.id;
  const title =
    band.value?.data?.singlevideo?.title ||
    band.value?.data?.singlesong?.title ||
    "video";
  try {
    await trackMediaPlay(bandId, "video", title);
  } catch (err) {
    console.error("❌ video track error:", err);
  }
}

function handleClick(bandId, platform, url) {
  trackClick(bandId, platform, url);
}

/* ---------- data fetch ---------- */
async function fetchBandData() {
  notFound.value = false;
  loadingData.value = true;

  const incomingSlug = String(route.params.bandSlug || "").toLowerCase();
  const canonicalSlug = incomingSlug
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "");
  const slug = incomingSlug;
  const api = config.public.strapiUrl;

  // Ask ONLY for fields used on the page
  const buildUrl = (s) =>
    `${api}/api/bands/slug/${encodeURIComponent(s)}` +
    `?fields[0]=slug&fields[1]=name&fields[2]=isBandNameInLogo&fields[3]=bio&fields[4]=biotagline` +
    `&fields[5]=websitelink&fields[6]=websitelinktext` +
    `&fields[7]=youtube&fields[8]=youtubeMusic&fields[9]=spotify&fields[10]=appleMusic` + // streaming
    `&fields[11]=reverbnation&fields[12]=soundcloud&fields[13]=bandcamp&fields[14]=twitch&fields[15]=deezer` +
    `&fields[16]=facebook&fields[17]=instagram&fields[18]=twitter&fields[19]=tiktok` + // social
    `&fields[20]=paymentsEnabled&fields[21]=stripeOnboardingComplete&fields[22]=paymentButtons&fields[23]=hiddenLinks` +
    `&populate[bandImg][fields][0]=url` +
    `&populate[singlevideo][fields][0]=youtubeid&populate[singlevideo][fields][1]=title` +
    `&populate[singlesong][fields][0]=title&populate[singlesong][fields][1]=isEmbed&populate[singlesong][fields][2]=embedHtml` +
    `&populate[singlesong][populate][song][fields][0]=url&populate[singlesong][populate][cover][fields][0]=url` +
    `&populate[events][fields][0]=date&populate[events][fields][1]=slug&populate[events][fields][2]=city&populate[events][fields][3]=state&populate[events][fields][4]=venue`;

  try {
    let res = await fetch(buildUrl(slug), { cache: "no-store" });

    // If someone hits an old hyphenated URL, retry with canonical no-hyphen slug.
    if (res.status === 404 && canonicalSlug && canonicalSlug !== slug) {
      res = await fetch(buildUrl(canonicalSlug), { cache: "no-store" });
      if (res.ok) {
        // Redirect to canonical, no-hyphen URL.
        router.replace({ path: `/${canonicalSlug}`, query: route.query });
      }
    }

    if (res.status === 404) {
      band.value = null;
      notFound.value = true;
      heroReady.value = true;
      return;
    }

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const data = await res.json();
    band.value = data;

    // Peek at shape so we know how to unwrap
console.log('[BAND PAYLOAD]', band.value);


// Support BOTH shapes (flattened via custom slug route, or Strapi default)
let evts = [];
const maybeFlat = band.value?.data?.events;                // e.g. [{ id, date, city, ... }]
const maybeStrapi = band.value?.data?.events?.data;        // e.g. [{ id, attributes: {...}}]

if (Array.isArray(maybeFlat)) {
  evts = maybeFlat.filter(Boolean);
} else if (Array.isArray(maybeStrapi)) {
  evts = maybeStrapi
    .filter(Boolean)
    .map(({ id, attributes }) => ({ id, ...(attributes || {}) }));
} else {
  evts = [];
}

// Normalize minimal fields the template expects
events.value = evts.map(e => ({
  id: e.id,
  date: e.date || e.eventDate || e.startDate || null,
  city: e.city ?? null,
  state: e.state ?? null,
  venue: e.venue ?? null,
  slug: e.slug ?? null,
})).filter(e => !!e.date);

    initPaymentDefaults();


    // build the exact URL you’ll render for the hero
    const raw = band.value?.data?.bandImg?.url || null;

    // If you want to be 100% identical to <NuxtImg>, generate the same URL:
    // const img = useImage()            // import { useImage } from '#imports'
    // const heroUrl = raw ? img(raw, { format:'webp', modifiers:{ fit:'cover', quality:60 } }) : null
    // await preloadHero(heroUrl)

    await preloadHero(raw); // (works fine — the transformed NuxtImg URL will use the cache)

    heroReady.value = true;
    // ✅ Fire exactly once when the page is actually ready
    await sendPageView();
  } catch (e) {
    console.error("Fetch band error:", e);
    heroReady.value = true; // don’t hang the page on errors
    band.value = null;
    notFound.value = true;
  } finally {
    console.log(events.value, band.value , 'bandpayload')
    loadingData.value = false;
  }
}

/* ---------- events ---------- */
const today = new Date();

const upcomingEvents = computed(() =>
  events.value
    .filter((e) => new Date(e.date + "T00:00:00") >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
);

const pastEvents = computed(() =>
  events.value
    .filter((e) => new Date(e.date + "T00:00:00") < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
);

const streamingPlatforms = [
  { name: "youtube", img: youtubeIcon, label: "YouTube" },
  { name: "youtubeMusic", img: youtubeMusicIcon, label: "YouTube Music" },
  { name: "spotify", img: spotifyIcon, label: "Spotify" },
  { name: "appleMusic", img: appleMusicIcon, label: "Apple Music" },
  { name: "reverbnation", img: reverbnationIcon, label: "Reverbnation" },
  { name: "soundcloud", img: soundcloudIcon, label: "SoundCloud" },
  { name: "bandcamp", img: bandcampIcon, label: "Bandcamp" },
  { name: "twitch", img: twitchIcon, label: "Twitch" },
  { name: "deezer", img: deezerIcon, label: "Deezer" },
];

const socialPlatforms = [
  { name: "facebook", img: facebookIcon, label: "Facebook" },
  { name: "instagram", img: instagramIcon, label: "Instagram" },
  { name: "twitter", img: twitterIcon, label: "Twitter" },
  { name: "tiktok", img: tiktokIcon, label: "Tiktok" },
];

// in the band page <script setup>
// onMounted(() => {
//   try {
//     const body = {
//       bandId: band.value?.data?.id,
//       path: location.pathname,
//       title: document.title
//     }
//     const blob = new Blob([JSON.stringify(body)], { type:'application/json' })
//     navigator.sendBeacon?.('/api/track/band-view', blob)
//     if (!navigator.sendBeacon) {
//       fetch('/api/track/band-view', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
//     }
//   } catch {}
// })
async function sendPageView() {
  // Don’t run on server
  if (typeof window === 'undefined') return;

  const id = band.value?.data?.id;
  if (!id) {
    console.warn("[page-view] no band id yet");
    return;
  }

  const payload = {
    bandId: id,
    path: location.pathname,
    title: document?.title || "",
    url: window.location.href, // ← NEW: full landing URL (UTMs included)
  };

  console.log("[page-view] → POST /api/track/band-view", payload);

  try {
    const res = await fetch("/api/track/band-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Note: the browser will send the Referer header automatically
    });
    const json = await res.json();
    console.log("[page-view] ←", res.status, json);
  } catch (err) {
    console.error("[page-view] ERROR", err);
  }
}


const beaconSent = ref(false);

// watch(() => band.value?.data?.id, async (id) => {
//   if (!id || beaconSent.value) return
//   beaconSent.value = true

//   const payload = { bandId: id, path: location.pathname, title: document.title }
//   const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })

//   try {
//     if (navigator.sendBeacon) {
//       navigator.sendBeacon('/api/track/band-view', blob)
//     } else {
//       await fetch('/api/track/band-view', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       })
//     }
//   } catch (err) {
//     console.error('band-view beacon error:', err)
//   }
// })

onMounted(() => {
  fetchBandData();
  handlePaymentQuery();
});

// watch([loadingData, band], ([loadingData, bandVal]) => {
//   if (loadingData) return
//   const id = bandVal?.data?.id
//   if (!id) return
//   try {
//     const payload = {
//       bandId: id,
//       path: location.pathname,
//       title: document.title
//     }
//     const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
//     if (navigator.sendBeacon) {
//       navigator.sendBeacon('/api/track/band-view', blob)
//     } else {
//       fetch('/api/track/band-view', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       })
//     }
//   } catch {}
// }, { immediate: true })
</script>

<style scoped>
.embed-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
}

.fade-in {
  animation: fadeIn 0.25s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.embed-container iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.custom-border {
  border: 0.1px solid white;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #6200ee;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin-top: 2rem;
}
@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* testing */
#embedPlayerWrapper :deep(iframe) {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
