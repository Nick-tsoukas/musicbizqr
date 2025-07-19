<template>
  <div class="bg-[#000] overflow-x-hidden pt-[var(--header-height)]">
    <div class="relative min-h-screen">
      <NuxtParticles
        id="tsparticles"
        :options="options"
        class="fixed inset-0 -z-10 pointer-events-none"
      />
      <!-- Main content -->
      <main>
        <!-- Hero section -->

        <div class="relative isolate min-h-[100vh]">
          <div
            class="mx-auto w-[90vw] px-6 py-10 2xl:flex 2xl:gap-x-10 2xl:px-8"
          >
            <div
              class="mx-auto w-full 2xl:w-[45%] lg:mx-0 text-white lg:flex-auto"
            >
              <h1
                data-aos="fade-up"
                class="font-extrabold tracking-tight leading-none text-center lg:text-left"
              >
                <span
                  class="block text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
                >
                  MusicBizQR
                </span>
                <span
                  class="block mt-1 text-xl md:text-2xl font-semibold text-gray-200"
                >
                  Dynamic QR Codes &amp; Smart Link Pages for Musicians
                </span>
              </h1>

              <div
                class="flex justify-center mt-10 items-start mb-12 2xl:hidden"
              >
                <img
                  src="@/assets/qrcode.png"
                  alt="Example MusicBizQR dynamic QR code linking to an artist smart link page"
                  class="h-[225px] w-[225px]"
                  data-aos="fade-left"
                />
              </div>

              <ul class="space-y-3 text-lg lg:text-xl text-white mt-6">
                <li>
                  <strong
                    class="inline-block font-semibold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"
                    >Dynamic QR Codes for Artists & Bands</strong
                  >
                  – print once, update destinations anytime.
                </li>
                <li>
                  <strong
                    class="inline-block font-semibold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"
                    >Smart Link Splash Pages</strong
                  >
                  – pull in Spotify, Apple Music, YouTube & socials in one scan.
                </li>
                <li>
                  <strong
                    class="inline-block font-semibold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"
                    >Embed Music & Video</strong
                  >
                  – feature a track, playlist, or latest music video instantly.
                </li>
                <li>
                  <strong
                    class="inline-block font-semibold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"
                    >Sell Tickets & Merch</strong
                  >
                  – add tappable purchase links fans can use at the show.
                </li>
                <li>
                  <strong
                    class="inline-block font-semibold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"
                    >Real‑Time Scan Analytics</strong
                  >
                  – see where, when & how fans engage; route tours smarter.
                </li>
              </ul>

              <!-- <p
                class="mt-6 text-lg lg:text-xl text-white text-center lg:text-left max-w-4xl leading-snug"
              >
                <strong>Dynamic QR Codes</strong> •
                <strong>Smart Link Splash Pages</strong> •
                <strong>Music &amp; Video Embeds</strong> •
                <strong>Ticket &amp; Merch Links</strong> •
                <strong>Real‑Time Scan Analytics</strong>
                <span class="sr-only">for artists, bands, and musicians</span>
              </p> -->

              <div
                class="mt-16 justify-center mb-10 flex flex-col md:flex-row xl:justify-start items-center gap-x-6"
              >
                <NuxtLink
                  to="/signup"
                  class="mdc-button mb-4 w-full md:mb-0 md:w-auto"
                  >Create Account</NuxtLink
                >
                <NuxtLink to="/login" class="mdc-button w-full md:w-auto"
                  >Member Login
                </NuxtLink>
              </div>
            </div>

            <div
              class="hidden mt-16 sm:mt-24 2xl:flex md:justify-center md:items-start lg:mt-0 lg:flex-shrink-0 lg:flex-grow"
            >
              <img
                src="@/assets/qrcode.png"
                alt="Example MusicBizQR dynamic QR code linking to an artist smart link page"
                class="md:h-[425px] md:w-[425px]"
              />
            </div>
          </div>
        </div>

        <!-- grid of main features and branded qrs -->
        <!-- cta   -->
        <div
          ref="parallaxRef"
          class="relative w-screen min-h-screen bg-scroll md:bg-fixed bg-center bg-cover bg-[url('/assets/aisix.webp')] z-50"
        >
          <!-- Dark Overlay -->
          <div
            class="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div
              class="text-center h-full flex flex-col justify-center items-center md:text-left"
            >
              <!-- Animated Text -->
              <h2
                class="text-4xl md:text-6xl font-bold text-white animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
              >
                Create Your Profile
              </h2>
              <!-- Buttons Section -->
              <div
                class="flex w-full justify-center md:justify-start px-2 gap-6 mt-10 text-white"
              >
                <NuxtLink to="/signup" class="cta-button-no w-auto mx-auto">
                  Sign Up For A Free 30 day Trial
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col justify-center image_gradient">
          <h2
            class="text-4xl lg:text-4xl 2xl:text-5xl text-white font-bold mt-0 pt-16 text-center"
          >
            Artist Smart Link &amp; Splash Page Examples
          </h2>
          <p
            class="mt-4 max-w-3xl mx-auto text-center text-white/90 text-lg leading-relaxed"
          >
            When fans scan one of your
            <strong>MusicBizQR dynamic QR codes</strong>, they land on a
            mobile‑first <strong>artist splash page</strong> that pulls in your
            streaming platforms (Spotify, Apple Music, YouTube), socials,
            featured tracks or videos, and even
            <strong>merch &amp; ticket links</strong>—all in one tap‑friendly
            layout you can update anytime and track in real time.
          </p>
          <p
            class="mt-3 max-w-2xl mx-auto text-center text-gray-300 text-base leading-snug"
          >
            Browse the demos below, then
            <NuxtLink
              to="/signup"
              class="text-black hover:underline font-semibold"
            >
              build your own splash page
            </NuxtLink>
            in minutes.
          </p>

          <div class="w-full max-w-md md:max-w-5xl mx-auto">
            <!-- Swiper with Cards -->
            <!-- <Swiper
              :modules="[EffectCards]"
              effect="cards"
              grabCursor="true"
              class="main-gallery h-auto md:w-[60vw]"
            >
              <SwiperSlide
                v-for="(slide, index) in slides"
                :key="index"
                class="flex items-center justify-center mt-10 mb-6 px-2"
              >
                <img
                  :src="slide.image"
                  :srcset="slide.srcset"
                  alt="Main Image"
                  class="w-full md:w-[50vw] max-h-[50vh] object-contain rounded-lg shadow-lg"
                />
              </SwiperSlide>

              
              <NuxtLink
                to="/buringthunder"
                class="block font-bold cta-button-full my-16 mx-auto text-center text-white"
              >
                Preview Page
              </NuxtLink>
            </Swiper> -->
            <section
            class=" max-w-5xl mx-auto bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-2xl shadow-xl my-12 overflow-hidden"
          >
            <div class="grid md:grid-cols-2 gap-6 p-6 md:p-10 items-center">
              <!-- Text -->
              <div>
                <h2 class="text-3xl font-extrabold mb-4">
                  Built for Musicians. Powered by Smart Links.
                </h2>
                <p class="text-lg mb-4">
                  MusicBizQR gives you a powerful landing page with streaming
                  links, videos, social buttons, and real-time fan analytics —
                  all from a single QR code.
                </p>
                <ul class="space-y-2 mb-6">
                  <li>🎯 Unlimited link clicks & analytics</li>
                  <li>📈 Track Spotify streams, YouTube plays, and QR scans</li>
                  <li>📱 Mobile-optimized artist pages</li>
                  <li>🚀 Create your first Smart Link in seconds</li>
                </ul>
                <NuxtLink
                  to="/signup"
                  class="inline-block bg-white text-black font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-200 transition"
                >
                  Start Your Free Trial
                </NuxtLink>
              </div>

              <!-- Screenshot -->
              <div class="flex justify-center">
                <img
                  src="public\screenshotappnovideo.png"
                  alt="MusicBizQR dashboard"
                  class="rounded-xl w-full max-w-md shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
          </div>
        </div>

        <section class="py-24 px-6 text-white">
          <div class="max-w-6xl mx-auto text-center lg:text-left">
            <h2 class="text-4xl lg:text-5xl font-extrabold text-gradient mb-4">
              Why MusicBizQR?
            </h2>
            <p
              class="max-w-3xl mx-auto lg:mx-0 text-lg text-white/90 leading-relaxed"
            >
              MusicBizQR turns every poster, merch tag, and bio link into a
              <strong>trackable marketing channel</strong>. Create dynamic QR
              codes, launch mobile <strong>smart link splash pages</strong>,
              embed music &amp; video, sell tickets and merch, and measure fan
              engagement in real time—built specifically for independent
              artists, touring bands, and music marketers.
            </p>
          </div>

          <div
            class="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto text-center lg:text-left"
          >
            <article>
              <h3 class="font-semibold text-xl mb-2 text-pink-400">
                Dynamic QR Codes
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Print once, update anytime. Switch from a pre‑save to tour dates
                or merch without reprinting your codes.
              </p>
            </article>

            <article>
              <h3 class="font-semibold text-xl mb-2 text-pink-400">
                Smart Link Splash Pages
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Pull in Spotify, Apple Music, YouTube, TikTok &amp; socials—give
                fans everything in one tap‑friendly page.
              </p>
            </article>

            <article>
              <h3 class="font-semibold text-xl mb-2 text-pink-400">
                Music, Video &amp; Sales
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                Feature a track or video, collect emails, and add ticket &amp;
                merch purchase links fans can use at the show.
              </p>
            </article>

            <article>
              <h3 class="font-semibold text-xl mb-2 text-pink-400">
                Real‑Time Scan Analytics
              </h3>
              <p class="text-gray-300 text-base leading-relaxed">
                See scans by city, device &amp; time of day. Route tours
                smarter, measure promo impact, and grow what works.
              </p>
            </article>
          </div>

          <div
            class="mt-16 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start max-w-6xl mx-auto"
          >
            <NuxtLink
              to="/signup"
              class="cta-button-no w-full sm:w-auto text-center"
              aria-label="Start free 30 day MusicBizQR trial"
            >
              Start Free 30‑Day Trial
            </NuxtLink>
            <NuxtLink
              to="/article/qr-code-strategy"
              class="mdc-button w-full sm:w-auto text-center"
            >
              Learn QR Strategy
            </NuxtLink>
          </div>

          <!-- hidden keyword helpers for accessibility + SEO -->
          <span class="sr-only">
            QR code generator for musicians, smart link pages for bands, music
            marketing analytics
          </span>
        </section>

        <!-- Text Section -->
        <!-- <section
          class="flex flex-col items-center justify-between py-12 md:py-16 px-4"
        >
          
          <div class="max-w-4xl text-center md:text-center flex-grow">
            <h2
              class="text-white text-4xl lg:text-6xl font-bold mx-auto md:mx-0"
            >
              Add All Your Social Links
            </h2>
            <p class="text-white text-lg pb-10 mt-6 md:mt-8 mx-auto md:mx-0">
              Give your audience a single link to access all your socials
              instantly. Whether it’s Instagram, TikTok, Spotify, or YouTube,
              keep your fans connected with your latest updates, releases, and
              content.
            </p>
          </div>

        
          <div
            class="w-full flex items-center justify-center mt-auto pb-6 md:pb-12"
          >
            <InfiniteScrollIcons />
          </div>
        </section> -->

        <!-- embed section -->
        <section
          class="relative min-h-screen items-center justify-center pt-10 md:pt-24 image_gradient"
        >
          <div class="flex flex-col items-center mx-2 md:mx-20 md:flex-row">
            <!-- left Side: Music Player Mockup -->
            <div class="w-full md:w-3/5 flex flex-col justify-between px-6">
              <!-- Content Section -->
              <div class="flex-grow flex flex-col justify-start">
                <h2
                  class="text-white text-center md:text-left font-bold text-4xl mb-4 lg:text-6xl"
                >
                  Embed Music from your streaming platform
                </h2>
                <p
                  class="text-white text-lg text-center md:text-left pb-10 md:pb-0 leading-relaxed max-w-xl"
                >
                  Drop a live streaming player—<strong>Spotify</strong>,
                  <strong>Apple Music</strong>, <strong>YouTube</strong>,
                  whatever you use—directly into your MusicBizQR smart link
                  page. Fans scan at shows and tap to play, boosting streams,
                  followers &amp; pre‑saves on the spot.
                  <span class="sr-only"
                    >embed music players qr code music marketing for artists and
                    bands</span
                  >
                </p>
              </div>
            </div>

            <!-- right Side: Spotify Embed -->
            <div class="w-full mb-16 md:mb-0 md:w-2/5 flex justify-center">
              <iframe
                class="w-[90%] h-[400px] md:w-[80%] md:h-[450px] rounded-lg shadow-lg"
                src="https://open.spotify.com/embed/album/1ATL5GLyefJaxhQzSPVrLX?utm_source=generator"
                frameborder="0"
                allowtransparency="true"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              ></iframe>
            </div>
          </div>
          <!-- Full-Width Icons at Bottom -->
          <div class="left-0 w-auto">
            <div
              class="flex items-center px-6 md:px-0 pb-10 md:py-20 justify-around space-x-6"
            >
              <Icon
                v-for="icon in streamingIcons"
                :key="icon.name"
                :icon="icon.icon"
                class="w-10 h-10 text-white hover:text-green-500 transition"
              />
            </div>
          </div>
        </section>

        <!-- video section  -->
        <section
          class="min-h-screen flex flex-col items-center justify-center pt-10 md:py-24"
        >
          <!-- Text Section -->
          <div class="text-center px-6 max-w-4xl">
            <h2 class="text-white font-bold text-4xl mb-4 lg:text-6xl">
              Showcase Your Music Videos &amp; Live Clips
            </h2>
            <p class="text-white text-lg mb-10 leading-relaxed">
              Embed a new single, lyric video, rehearsal clip or full playlist
              in your MusicBizQR smart link. Fans scan a poster, merch tag or
              bio link, tap play, and share—no searching, no typing.
              <span class="sr-only"
                >music video embed qr smart link for artists bands
                musicians</span
              >
            </p>
          </div>

          <!-- Video Section -->
          <div class="w-full flex justify-center">
            <div class="relative w-[90vw] md:w-[80vw] max-w-4xl">
              <!-- Thumbnail (Click to Play) -->
              <div
                v-if="!isPlaying"
                class="relative cursor-pointer"
                @click="isPlaying = true"
              >
                <img
                  :src="thumbnail"
                  alt="Video Thumbnail"
                  class="rounded-lg shadow-lg w-full h-auto"
                />
                <!-- Play Button Overlay -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <Icon
                    icon="mdi:play-circle"
                    class="text-white w-20 h-20 opacity-80 hover:opacity-100 transition"
                  />
                </div>
              </div>

              <!-- YouTube Embed (Shown When Playing) -->
              <iframe
                v-if="isPlaying"
                class="w-full h-64 md:h-96 rounded-lg shadow-lg"
                :src="videoUrl"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <section
            class=" max-w-5xl mx-auto bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-2xl shadow-xl my-12 overflow-hidden"
          >
            <div class="grid md:grid-cols-2 gap-6 p-6 md:p-10 items-center">
              <!-- Text -->
              <div>
                <h2 class="text-3xl font-extrabold mb-4">
                  Built for Musicians. Powered by Smart Links.
                </h2>
                <p class="text-lg mb-4">
                  MusicBizQR gives you a powerful landing page with streaming
                  links, videos, social buttons, and real-time fan analytics —
                  all from a single QR code.
                </p>
                <ul class="space-y-2 mb-6">
                  <li>🎯 Unlimited link clicks & analytics</li>
                  <li>📈 Track Spotify streams, YouTube plays, and QR scans</li>
                  <li>📱 Mobile-optimized artist pages</li>
                  <li>🚀 Create your first Smart Link in seconds</li>
                </ul>
                <NuxtLink
                  to="/signup"
                  class="inline-block bg-white text-black font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-200 transition"
                >
                  Start Your Free Trial
                </NuxtLink>
              </div>

              <!-- Screenshot -->
              <div class="flex justify-center">
                <img
                  src="public\screenshotappnovideo.png"
                  alt="MusicBizQR dashboard"
                  class="rounded-xl w-full max-w-md shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        </section>

        <!-- end of image galler   -->
        <!-- Chart  -->
        <section class="w-[100vw] mx-auto">
          <section
            class="bg-gradient-to-r from-purple-600 to-indigo-600 py-10 md:py-20"
          >
            <div class="container mx-auto text-center px-4">
              <h2
                class="text-4xl md:text-4xl lg:text-6xl pb-10 text-center font-extrabold text-white"
              >
                QR Scan Analytics for Musicians
              </h2>
              <p
                class="text-white text-lg lg:text-2xl mb-14 text-center leading-relaxed max-w-3xl mx-auto"
              >
                See where, when &amp; how fans engage with your QR codes. Track
                scans by city, device &amp; time, spot your hottest markets, and
                double down on campaigns that drive streams, signups, tickets
                &amp; merch.
                <span class="sr-only"
                  >music marketing analytics for artists bands qr code
                  data</span
                >
              </p>

              <BarChart />
            </div>
          </section>
        </section>
        <!-- pricing  -->
        <section class="py-10 md:py-20 text-white">
          <div class="max-w-7xl mx-auto text-center"></div>

          <div
            class="grid gap-8 mt-12 max-w-5xl mx-auto grid-cols-1 md:grid-cols-1"
          >
            <!-- Starter Plan -->
            <div class="pricing-card text-center">
              <h2
                class="text-5xl font-extrabold pb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
              >
                Simple Pricing
              </h2>
              <p class="text-white"></p>
              <p class="text-4xl font-extrabold mt-6">
                $7<span class="text-lg">/mo</span>
              </p>
              <ul class="pricing-features">
                <li>
                  ✔ 1 <strong>Dynamic QR Code</strong> (edit destination
                  anytime)
                </li>
                <li>
                  ✔ All scans tracked in your
                  <strong>Analytics Dashboard</strong>
                </li>
                <li>✔ 1 <strong>Artist Smart Link / Splash Page</strong></li>
                <li>
                  ✔ Streaming Buttons: Spotify, Apple Music, YouTube &amp; more
                </li>
                <li>✔ Embed 1 Featured Track &amp; 1 Video</li>
                <li>✔ Merch &amp; Ticket Purchase Links</li>
                <li>✔ Print‑ready PNG / SVG QR downloads</li>
                <li>✔ Email Support • Cancel anytime</li>
              </ul>
              <button class="pricing-button">
                Sign Up for a 30 day free trial
              </button>
            </div>
          </div>
        </section>

        <!-- cta   -->
        <div
          ref="parallaxRef"
          class="relative w-screen min-h-screen bg-scroll md:bg-fixed bg-center bg-cover bg-[url('/assets/aisix.webp')] z-50"
        >
          <!-- Dark Overlay -->
          <div
            class="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div
              class="text-center h-full flex flex-col justify-center items-center md:text-left"
            >
              <!-- Animated Text -->
              <h2
                class="text-4xl md:text-6xl font-bold text-white animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
              >
                Create Your Profile
              </h2>
              <!-- Buttons Section -->
              <div
                class="flex w-full justify-center md:justify-start px-2 gap-6 mt-10 text-white"
              >
                <button class="cta-button-no w-auto mx-auto">
                  Sign Up For A Free 30 day Trial
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- articles  -->
        <section class="bg-black text-white px-4 py-16 max-w-5xl mx-auto">
          <h2 class="text-3xl font-extrabold mb-6 text-gradient">
            Featured Articles
          </h2>

          <div
            v-if="featuredRes?.data?.length"
            class="grid gap-8 md:grid-cols-1"
          >
            <div
              v-for="post in featuredRes.data"
              :key="post.id"
              class="bg-gray-900 p-6 rounded-lg shadow hover:bg-gray-800 transition"
            >
              <NuxtLink
                :to="`/article/${post.attributes.category}/${post.attributes.slug}`"
                class="block mb-2 text-xl font-bold text-pink-400 hover:underline"
              >
                {{ post.attributes.title }}
              </NuxtLink>
              <p class="text-sm text-gray-400">
                {{ post.attributes.metaDescription }}
              </p>
            </div>
          </div>
        </section>

        <div class="py-12 bg-black tezxt-white max-w-5xl mx-auto min-h-screen">
          <h2
            class="text-3xl font-bold text-center md:text-left text-white mb-8"
          >
            Frequently Asked Questions
          </h2>

          <FaqAccordion :faqs="faqItems" />
        </div>
      </main>
      <!-- <Footer /> -->
      <div class="h-40 flex flex-col justify-center items-center">
        <NuxtLink to="/"><img src="@/assets/musicbizlogo.png" class="h-12" /></NuxtLink>
       
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs } from "swiper/modules";
import { EffectCards } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper/types";
import { Icon } from "@iconify/vue";

import deezer from "@/assets/dezzer.svg";

const parallaxBg = ref(null);
const faqItems = ref([
  {
    question: "❓ What is a “dynamic QR code”?",
    answer:
      "A dynamic QR code points to a short redirect URL on our server. You can update its destination at any time without reprinting the QR. All scans are tracked, and you can edit or delete it from your dashboard.",
  },
  {
    question: "🔄 Can I create and delete QR codes as I like?",
    answer:
      "Yes. You can generate unlimited dynamic QR codes. At any point, delete any existing QR and create a fresh one. Old scans remain in analytics, but new scans use the new QR link.",
  },
  {
    question: "📈 How many scans can a dynamic QR code handle?",
    answer:
      "Unlimited. Every scan (regardless of volume) gets logged. You’ll see real-time counts of total scans, location data, and device types on your analytics page.",
  },
  {
    question: "📊 What analytics are provided?",
    answer:
      "Our analytics dashboard shows total scan count, top locations (city, country), scan timestamps, device type breakdown, and referrer sources. This helps you optimize distribution of your QR codes.",
  },
  {
    question: "🔒 Is my data private?",
    answer:
      "Absolutely. Only you (and team members you invite) can view your QR code analytics. We do not share your scan data with third parties, and all connections are encrypted.",
  },
  {
    question: "💳 How do I cancel my subscription?",
    answer:
      "You can cancel at any time by visiting your Account page > Subscription > Cancel. Once canceled, you retain dashboard access until the end of your billing cycle. No additional charges apply.",
  },
  {
    question: "🆓 Is there a free plan?",
    answer:
      "Yes! Our Free plan includes one active dynamic QR code with up to 500 scans/month and basic analytics. Upgrade anytime for unlimited QR codes and advanced insights.",
  },
  {
    question: "🔧 How do I update the destination URL of a QR code?",
    answer:
      "Go to Dashboard > My QR Codes, click “Edit” beside the QR you want to change, enter the new destination URL, and save. The code’s design stays the same—only the redirect target updates.",
  },
]);
const handleScroll = () => {
  const scrollPosition = window.scrollY;
  if (parallaxBg.value) {
    parallaxBg.value.style.transform = `translateY(${scrollPosition * 0.4}px)`;
  }
};

const isPlaying = ref(false);
const videoUrl = "https://www.youtube.com/embed/NU9JoFKlaZ0?autoplay=1";
const thumbnail = "https://img.youtube.com/vi/NU9JoFKlaZ0/maxresdefault.jpg"; // Replace with your thumbnail image

//  mockups
import videoMobilePage from "@/assets/mainbainwithvideo.webp";
import streamLinksPage from "@/assets/demoband.png";
import albumDeskPage from "@/assets/mainbainwithvideo.webp";
import socialDeskPage from "@/assets/mainbainwithvideo.webp";
import bandDeskPage from "@/assets/dannydemo.png";
// import evnetsDesk from "@/assets/mainbainwithvideo.webp";
import evnetsDesk from "@/assets/mainbainwithvideo.webp";

// import videoDesk from "@/assets/desktopvideogrid.png";

import videoDesk from "@/assets/mainbandtwo.webp";

// social icon

// Import Swiper styles
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/effect-cards";

// Define your slides data for the swiper desktop splash page demo
const slides = [
  { image: videoDesk, thumbnail: streamLinksPage },
  { image: evnetsDesk, thumbnail: streamLinksPage },
  { image: streamLinksPage, thumbnail: streamLinksPage },
  // { image: albumDeskPage, thumbnail: streamLinksPage },
  // { image: socialDeskPage, thumbnail: streamLinksPage },

  // Add more slides as needed
];

const streamingIcons = [
  { name: "Spotify", icon: "mdi:spotify" },
  { name: "Apple Music", icon: "mdi:apple" },
  { name: "YouTube Music", icon: "mdi:youtube" },
  { name: "SoundCloud", icon: "mdi:soundcloud" },
];

// Define your reactive variables with types
const thumbsSwiper = ref<SwiperInstance | null>(null);

// Define your functions with typed parameters
const setThumbsSwiper = (swiper: SwiperInstance) => {
  thumbsSwiper.value = swiper;
};

import musicSvg from "@/assets/music.svg";
import microphoneSvg from "@/assets/microphone.svg";
import recordSvg from "@/assets/record.svg";
import streamingSvg from "@/assets/streaming.svg";
import facebookSvg from "@/assets/facebook-icon-white.svg";
import websiteSvg from "@/assets/website.svg";
import videoSvg from "@/assets/video.svg";

import bandScreen from "@/assets/newbandhome.jpg";
import albumScreen from "@/assets/albumnewpage.jpg";
import streamScreen from "@/assets/laststreampage.jpg";
import socialScreen from "@/assets/socialnewpage.jpg";
import externalScreen from "@/assets/newbandhome.jpg";
import videoScreen from "@/assets/vidgrid.jpg";
import aisix from "@/assets/aisix.webp";

import { defineComponent, h } from "vue";
import {
  Dialog,
  DialogPanel,
  RadioGroup,
  RadioGroupOption,
} from "@headlessui/vue";
import {
  Bars3Icon,
  XMarkIcon as XMarkIconOutline,
} from "@heroicons/vue/24/outline";
import { CheckIcon, XMarkIcon as XMarkIconMini } from "@heroicons/vue/20/solid";
import {
  ChevronRightIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/vue/20/solid";

import { ref, useRuntimeConfig } from "#imports";
import { loadFull } from "tsparticles";
import { tsParticles } from "@tsparticles/engine";

const { mode } = useRuntimeConfig().public.particles;
const imageToRender = ref(bandScreen);

const config = useRuntimeConfig();

const { data: featuredRes, error: featuredError } = await useAsyncData(
  "featured-articles",
  () =>
    $fetch(`${config.public.strapiUrl}/api/seo-pages`, {
      params: {
        populate: "*",
        sort: ["publishedAt:desc"],
        "filters[featured][$eq]": true,
      },
    })
);

console.log("this is article ", featuredRes);

if (featuredError.value) {
  console.error("❌ Failed to load featured articles:", featuredError.value);
}

const ldJson = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MusicBizQR",
  url: "https://musicbizqr.com",
  description:
    "Create dynamic QR codes, artist splash pages, and embed music and video with advanced analytics.",
  publisher: {
    "@type": "Organization",
    name: "MusicBizQR",
    url: "https://musicbizqr.com",
  },
};

/* ---------------------------------------------
 * Schema.org Structured Data
 * ---------------------------------------------
 * We create three linked graph nodes:
 * - WebSite  (#website)
 * - Organization  (#organization)
 * - SoftwareApplication  (#software)
 * Search engines read all three; linking via @id helps disambiguate.
 * ------------------------------------------- */

// If you have real social profiles, put them in runtimeConfig.public.social* or hardcode below.
const socialLinks = [
  // config.public.twitterUrl,
  // config.public.instagramUrl,
  // config.public.youtubeUrl
].filter(Boolean);

// Reusable IDs
const orgId = "https://musicbizqr.com/#organization";
const appId = "https://musicbizqr.com/#software";
const siteId = "https://musicbizqr.com/#website";

// WebSite node (updated from previous ldJson)
const webSiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": siteId,
  url: "https://musicbizqr.com",
  name: "MusicBizQR",
  description:
    "Create dynamic QR codes, artist splash pages, and embed music and video with advanced analytics.",
  // tie to Organization node
  publisher: { "@id": orgId },
  // optional site search action (update path if you add search)
  potentialAction: {
    "@type": "SearchAction",
    target: "https://musicbizqr.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// Organization node
const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": orgId,
  name: "MusicBizQR",
  url: "https://musicbizqr.com",
  logo: "https://musicbizqr.com/musicbizlogo.png",
  ...(socialLinks.length ? { sameAs: socialLinks } : {}),
};

// SoftwareApplication node
const appLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": appId,
  name: "MusicBizQR",
  url: "https://musicbizqr.com",
  applicationCategory: "MarketingApplication", // broad category; acceptable
  applicationSubCategory: "MusicMarketing", // free‑text helpful hint
  operatingSystem: "Web", // SaaS
  image: "https://musicbizqr.com/og-image.jpg", // 1200x630 recommended
  description:
    "Dynamic QR code & smart link platform for musicians. Create trackable QR campaigns, embed streaming & video, sell merch & tickets, and view scan analytics.",
  publisher: { "@id": orgId },
  offers: {
    "@type": "Offer",
    url: "https://musicbizqr.com/signup",
    price: "7.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    category: "subscription",
    // 30‑day free trial note (informational)
    eligibleDuration: "P30D",
  },
  // mark that a free plan exists (adjust if you restrict)
  isAccessibleForFree: false,
};

// Remove leading emoji/punctuation characters so Google sees clean Q text
const cleanFaqText = (q: string) => q.replace(/^[^A-Za-z0-9]+/, "").trim();

const faqLd = computed(() => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.value.map((f) => ({
    "@type": "Question",
    name: cleanFaqText(f.question),
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
}));

useHead({
  title: "MusicBizQR | Smart QR Codes & Link-in-Bio Tools for Artists",
  meta: [
    {
      name: "description",
      content:
        "Create dynamic QR codes, artist splash pages, and embed music and video with advanced analytics. Start your 30-day free trial today.",
    },
    {
      name: "keywords",
      content:
        "QR code for musicians, artist smart link, dynamic QR code, music QR, MusicBizQR, band splash page, music link tree, streaming links, music marketing tool",
    },
    { name: "robots", content: "index, follow" },
    {
      property: "og:title",
      content: "MusicBizQR | QR Codes + Smart Links for Artists",
    },
    {
      property: "og:description",
      content:
        "Build a powerful music profile with embedded songs, videos, and trackable QR codes. Perfect for touring artists and music promoters.",
    },
    {
      property: "og:image",
      content: "https://musicbizqr.com/musicbizlogo.png",
    },
    { property: "og:url", content: "https://musicbizqr.com" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "MusicBizQR | QR Codes + Smart Links for Artists",
    },
    {
      name: "twitter:description",
      content:
        "All-in-one music promo QR code tool for bands and musicians. Embed content and track engagement.",
    },
    { name: "twitter:image", content: "https://musicbizqr.com/og-image.jpg" },
  ],
  link: [
    { rel: "canonical", href: "https://musicbizqr.com" },
    // Perf: preconnect fonts (optional but recommended)
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(webSiteLd),
      key: "ld-website",
    },
    {
      type: "application/ld+json",
      children: JSON.stringify(faqLd.value),
      key: "ld-faq",
    },
    {
      type: "application/ld+json",
      children: JSON.stringify(orgLd),
      key: "ld-org",
    },
    {
      type: "application/ld+json",
      children: JSON.stringify(appLd),
      key: "ld-app",
    },
  ],
  __dangerouslyDisableSanitizersByTagID: {
    "ld-website": ["children"],
    "ld-org": ["children"],
    "ld-app": ["children"],
    "ld-faq": ["children"],
  },
});

const show = ref(false);

const splashPages = ref([
  "Artist Page",
  "Music Player",
  "Streaming Links",
  "Social Media Links",
  "Website Url",
  "Video Grid",
]);

const splashImages = ref([
  musicSvg,
  recordSvg,
  streamingSvg,
  facebookSvg,
  websiteSvg,
  videoSvg,
]);
const selectedPage = ref(0);

const pricing = {
  frequencies: [
    { value: "monthly", label: "Monthly" },
    { value: "annually", label: "Annually" },
  ],
  tiers: [
    {
      name: "Starter",
      id: "tier-starter",
      href: "#",
      featured: false,
      description: "write a descripton .",
      price: { monthly: "$15", annually: "$100" },
      mainFeatures: ["feature one", "feature one", "feature one"],
    },
    {
      name: "Pro",
      id: "tier-starter",
      href: "#",
      featured: false,
      description: "write a descripton .",
      price: { monthly: "$30", annually: "$250" },
      mainFeatures: ["feature one", "feature one", "feature one"],
    },
    // {
    //   name: 'Growth',
    //   id: 'tier-growth',
    //   href: '#',
    //   featured: false,
    //   description: 'write a description ',
    //   price: { monthly: 'Call for quote', annually: 'Clall for quote' },
    //   mainFeatures: [
    //    'feature one',
    //    'feature one',
    //    'feature one'

    //   ],
    // },
  ],
  sections: [
    {
      name: "Catered for business",
      features: [
        {
          name: "Tax Savings",
          tiers: { Starter: true, Scale: true, Growth: true },
        },
        {
          name: "Easy to use accounting",
          tiers: { Starter: true, Scale: true, Growth: true },
        },
        {
          name: "Multi-accounts",
          tiers: {
            Starter: "3 accounts",
            Scale: "Unlimited accounts",
            Growth: "7 accounts",
          },
        },
        {
          name: "Invoicing",
          tiers: {
            Starter: "3 invoices",
            Scale: "Unlimited invoices",
            Growth: "10 invoices",
          },
        },
        {
          name: "Exclusive offers",
          tiers: { Starter: false, Scale: true, Growth: true },
        },
        {
          name: "6 months free advisor",
          tiers: { Starter: false, Scale: true, Growth: true },
        },
        {
          name: "Mobile and web access",
          tiers: { Starter: false, Scale: true, Growth: false },
        },
      ],
    },
    {
      name: "Other perks",
      features: [
        {
          name: "24/7 customer support",
          tiers: { Starter: true, Scale: true, Growth: true },
        },
        {
          name: "Instant notifications",
          tiers: { Starter: true, Scale: true, Growth: true },
        },
        {
          name: "Budgeting tools",
          tiers: { Starter: true, Scale: true, Growth: true },
        },
        {
          name: "Digital receipts",
          tiers: { Starter: true, Scale: true, Growth: true },
        },
        {
          name: "Pots to separate money",
          tiers: { Starter: false, Scale: true, Growth: true },
        },
        {
          name: "Free bank transfers",
          tiers: { Starter: false, Scale: true, Growth: false },
        },
        {
          name: "Business debit card",
          tiers: { Starter: false, Scale: true, Growth: false },
        },
      ],
    },
  ],
};

const frequency = ref(pricing.frequencies[0]);

const options = {
  // Disable built-in full-screen so it doesn't hijack scroll
  fullScreen: { enable: false },

  // Style the canvas container to be a full-page background
  style: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: -1,
    // Prevent the canvas from blocking scroll/touch
    pointerEvents: "none",
  },

  particles: {
    // Everything else you had stays the same
    color: { value: "#fff" },
    links: { color: "#fff", enable: true },
    move: { enable: true },
    number: { value: 50 },
  },
  // etc.
};

// function selectPage(i, page) {
//   if (page == "Artist Page") {
//     // somevaluie is set to bandmobilescreen.png
//     imageToRender.value = bandScreen;
//   }
//   if (page == "Music Player") {
//     // change image to Music Player screenshot and get url
//     imageToRender.value = albumScreen;
//   }
//   if (page == "Streaming Links") {
//     // change image to Streaming screenshot and get url
//     imageToRender.value = streamScreen;
//   }
//   if (page == "Social Media Links") {
//     imageToRender.value = socialScreen;
//   }
//   if (page == "Website Url") {
//     imageToRender.value = bandScreen;
//   }
//   if (page == "Video Grid") {
//     imageToRender.value = videoScreen;
//   }
//   selectedPage.value = i;
// }

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function changeColors() {
  const paths = document.querySelectorAll(".animated-path");
  paths.forEach((path) => {
    path.style.fill = getRandomColor();
  });
}

function animateColors() {
  setInterval(changeColors, 2000);
}

onMounted(() => {
  animateColors();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const primaryFeatures = [
  {
    name: "Push to deploy.",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "SSL certificates.",
    description:
      "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
    icon: LockClosedIcon,
  },
  {
    name: "Database backups.",
    description:
      "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.",
    icon: ServerIcon,
  },
];

const secondaryFeatures = [
  {
    name: "Push to deploy",
    description:
      "Commodo nec sagittis tortor mauris sed. Turpis tortor quis scelerisque diam id accumsan nullam tempus. Pulvinar etiam lacus volutpat eu. Phasellus praesent ligula sit faucibus.",
    href: "#",
    icon: CloudArrowUpIcon,
  },
  {
    name: "SSL certificates",
    description:
      "Pellentesque enim a commodo malesuada turpis eleifend risus. Facilisis donec placerat sapien consequat tempor fermentum nibh.",
    href: "#",
    icon: LockClosedIcon,
  },
  {
    name: "Simple queues",
    description:
      "Pellentesque sit elit congue ante nec amet. Dolor aenean curabitur viverra suspendisse iaculis eget. Nec mollis placerat ultricies euismod ut condimentum.",
    href: "#",
    icon: ServerIcon,
  },
];

const featuredTestimonial = {
  body: "Integer id nunc sit semper purus. Bibendum at lacus ut arcu blandit montes vitae auctor libero. Hac condimentum dignissim nibh vulputate ut nunc. Amet nibh orci mi venenatis blandit vel et proin. Non hendrerit in vel ac diam.",
  author: {
    name: "Brenna Goyette",
    handle: "brennagoyette",
    imageUrl:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80",
    logoUrl: "https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg",
  },
};

const testimonials = [
  [
    [
      {
        body: "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
        author: {
          name: "Leslie Alexander",
          handle: "lesliealexander",
          imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
      // More testimonials...
    ],
    [
      {
        body: "Aut reprehenderit voluptatem eum asperiores beatae id. Iure molestiae ipsam ut officia rem nulla blanditiis.",
        author: {
          name: "Lindsay Walton",
          handle: "lindsaywalton",
          imageUrl:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
      // More testimonials...
    ],
  ],
  [
    [
      {
        body: "Voluptas quos itaque ipsam in voluptatem est. Iste eos blanditiis repudiandae. Earum deserunt enim molestiae ipsum perferendis recusandae saepe corrupti.",
        author: {
          name: "Tom Cook",
          handle: "tomcook",
          imageUrl:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
      // More testimonials...
    ],
    [
      {
        body: "Molestias ea earum quos nostrum doloremque sed. Quaerat quasi aut velit incidunt excepturi rerum voluptatem minus harum.",
        author: {
          name: "Leonard Krasner",
          handle: "leonardkrasner",
          imageUrl:
            "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      },
      // More testimonials...
    ],
  ],
];
</script>

<style scoped>
#tsparticles {
  z-index: -1;
}
/* ✅ Prevent elements from blocking the background */
.relative {
  position: relative;
  z-index: 2;
}

/* General Pricing Card Style */
.pricing-card {
  @apply bg-black border py-24  rounded-lg p-8  transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50;
}

/* Premium Plan Highlight */
.premium {
  @apply bg-gradient-to-br from-indigo-700 to-purple-700 border-purple-500  shadow-purple-500/50;
}

/* Pricing Features List */
.pricing-features {
  @apply mt-6 space-y-2 text-gray-300;
}

/* CTA Button */
.pricing-button {
  @apply mt-6 w-full py-3 px-6 text-lg font-semibold rounded-lg bg-indigo-600 hover:bg-purple-600 transition-all duration-300;
}
@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
/* button s  */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
}

/* Button Styles */
.cta-button {
  @apply py-3 px-6 w-full md:w-[25%] text-center font-semibold rounded-lg shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-in-out hover:from-pink-600 hover:to-purple-600 hover:scale-105 hover:shadow-purple-500/50;
}

.cta-button-full {
  @apply py-3 px-6 w-full md:w-[100%] text-center font-semibold rounded-lg shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-in-out hover:from-pink-600 hover:to-purple-600 hover:scale-105 hover:shadow-purple-500/50;
}

.cta-button-no {
  @apply py-3 px-6 text-center font-semibold rounded-lg shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-in-out hover:from-pink-600 hover:to-purple-600 hover:scale-105 hover:shadow-purple-500/50;
}

.animate-scroll {
  display: flex;
  white-space: nowrap;
  animation: scroll 15s linear infinite;
}
.custom-gradient {
  background: #a8ff78; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #78ffd6,
    #a8ff78
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #78ffd6,
    #a8ff78
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.btn {
  @apply bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:bg-purple-700;
}

.element_scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.element_scroll::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
}
.animated-path {
  transition: fill 1s ease;
}

/* General body styling */

/* Bar chart container */
.bar-chart {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}
/* image background grad */

.image_gradient {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
}
/* Individual bar styling */
.bar {
  width: 40px;
  background-color: #4caf50;
  height: 20%; /* Initial height */
  animation: grow-bar 2s ease-in-out infinite;
}

/* Animation keyframes */
@keyframes grow-bar {
  0%,
  100% {
    height: 20%;
  }
  50% {
    height: var(--bar-height);
  }
}
</style>
