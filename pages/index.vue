<template>
  <div class="bg-[#000] overflow-x-hidden">
    <NuxtParticles id="tsparticles" :options="options" />
    <!-- Main content -->
    <main>
      <!-- Hero section -->

      <div class="relative isolate min-h-[50vh]">
        <div class="mx-auto w-[90vw] px-6 py-10 2xl:flex 2xl:gap-x-10 2xl:px-8">
          <div
            class="mx-auto w-full 2xl:w-[45%] lg:mx-0 text-white lg:flex-auto"
          >
            <h1
              data-aos="fade-up"
              class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-16 text-center font-extrabold tracking-tight text-7xl md:text-8xl lg:text-left"
            >
              Music Biz Qr
            </h1>
            <div class="flex justify-center mb-12 2xl:hidden">
              <img
                src="@/assets/qrcode.png"
                alt=""
                class="h-[225px] w-[225px]"
                data-aos="fade-left"
              />
            </div>

            <ul
              class="list-disc list-inside space-y-2 text-lg lg:text-xl text-white mt-6"
            >
              <li>Create QR codes</li>
              <li>Generate splash pages</li>
              <li>Add audio players</li>
              <li>Feature your content links</li>
              <li>
                Connnect social media links, streaming services, and websites
              </li>
              <li>Analytic tracking</li>
            </ul>
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
            class="hidden mt-16 sm:mt-24 2xl:flex md:justify-center md:items-center lg:mt-0 lg:flex-shrink-0 lg:flex-grow"
          >
            <img
              src="@/assets/qrcode.png"
              alt=""
              class="md:h-[425px] md:w-[425px]"
            />
          </div>
        </div>
      </div>

      <!-- grid of main features and branded qrs -->
      <section
        class="text-center 2xl:text-left mb-10 mx-auto px-2 w-full lg:w-[90vw] lg:px-6 mt-0 lg:mb-10"
      >
        <h2 class="text-4xl lg:text-4xl 2xl:text-5xl text-white font-bold mt-0">
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
            >Example Splash Pages</span
          >
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 italic"
          ></span>
        </h2>
      </section>

      <div class="flex justify-center image_gradient">
        <div class="w-full max-w-md md:max-w-5xl mx-auto">
          <!-- swiper with cards  -->
          <Swiper
            :modules="[EffectCards]"
            effect="cards"
            grabCursor="true"
            class="main-gallery h-auto"
          >
            <SwiperSlide
              v-for="(slide, index) in slides"
              :key="index"
              class="flex items-center justify-center mt-16 mb-6 px-2"
            >
              <img
                :src="slide.image"
                :srcset="slide.srcset"
                alt="Main Image"
                class="w-full md:w-[55vw] h-auto object-cover rounded-lg shadow-lg"
              />
            </SwiperSlide>
            <NuxtLink
              to="/"
              class="block font-bold cta-button-full mb-6 mx-auto md:mx-0 cursor-pointer text-center text-white"
            >
              Preview Page
            </NuxtLink>
          </Swiper>
        </div>
      </div>
      <section
        class="min-h-screen flex flex-col items-center justify-center my-28"
      >
        <h2 class="text-white text-left mt-20 text-5xl font-bold mx-2 md:mx-20">
          Add All Your Social Links
        </h2>
        <p class="text-white text-left text-lg nx-2 md:mx-20">
          Engage you followers
        </p>

        <div class="min-h-[300px] mb-10 flex items-center justify-center">
          <InfiniteScrollIcons />
        </div>
      </section>
      <!-- embed section -->
      <section
        class="relative min-h-screen items-center justify-center pt-24 image_gradient"
      >
        <div class="flex flex-col items-center md:flex-row">
          <!-- Left Side: Spotify Embed -->
          <div class="w-full mb-16 md:mb-0 md:w-1/2 flex justify-center">
            <iframe
              class="w-[90%] h-[400px] md:w-[80%] md:h-[450px] rounded-lg shadow-lg"
              src="https://open.spotify.com/embed/album/1ATL5GLyefJaxhQzSPVrLX?utm_source=generator"
              frameborder="0"
              allowtransparency="true"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            ></iframe>
          </div>

          <!-- Right Side: Music Player Mockup -->
          <div class="w-full md:w-1/2 flex flex-col justify-between px-6">
            <!-- Content Section -->
            <div class="flex-grow flex flex-col justify-start">
              <h2 class="text-white font-bold text-5xl mb-4">
                Embed Music from your streaming platform
              </h2>
              <p class="text-white text-lg">Get More Listeners</p>
            </div>
          </div>
        </div>
        <!-- Full-Width Icons at Bottom -->
        <div class="left-0 w-auto">
          <div
            class="flex items-center px-6 md:px-0 py-20 justify-around space-x-6"
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
      <section class="min-h-screen flex items-center justify-center pt-24">
        <div class="flex flex-col md:flex-row">
          <!-- Left Side: Text & Icons -->
          <div class="w-full md:w-1/2 flex flex-col justify-between px-6">
            <!-- Content Section -->
            <div class="flex-grow flex flex-col justify-start">
              <h2 class="text-white font-bold text-5xl mb-4">
                Watch Our Latest Music Video
              </h2>
              <p class="text-white text-lg mb-10 md:mb-0">
                Experience the visuals of our latest release
              </p>
            </div>

            <!-- Icons Absolutely Positioned at the Bottom -->
            <!-- <div
            class="flex items-center justify-around space-x-6 p-4 rounded-lg"
          >
            <Icon
              v-for="icon in streamingIcons"
              :key="icon.name"
              :icon="icon.icon"
              class="w-10 h-10 text-white hover:text-red-500 transition"
            />
          </div> -->
          </div>

          <!-- Right Side: YouTube Video with Thumbnail -->
          <div class="w-full md:w-1/2 flex justify-center items-center">
            <div class="relative w-[90%] mb-16 md:mb-0 md:w-[80%] max-w-xl">
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
        </div>
      </section>

      <!-- end of image galler   -->
      <!-- Chart  -->
      <section class="w-[70vw] mx-auto mb-44">
        <h2
          class="text-4xl md:text-4xl lg:text-6xl mb-14 text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
        >
          Advanced Analytics
        </h2>
        <p class="text-white text-lg lg:text-2xl mb-14 text-center">
          Enhance your campaign ROI with our comprehensive analytics, turning QR
          code scans into actionable insights. Leverage state-of-the-art data
          visualization and tracking technologies to boost user engagement and
          elevate your marketing strategies.
        </p>
      </section>
      <BarChart class="mb-24" />

      <!-- pricing  -->
      <section class="py-20 bg-black text-white">
        <div class="max-w-7xl mx-auto text-center">
          <h2
            class="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
          >
            Choose Your Plan
          </h2>
          <p class="text-lg text-gray-400 mt-4">Simple, transparent pricing.</p>
        </div>

        <div
          class="grid gap-8 mt-12 max-w-6xl mx-auto grid-cols-1 md:grid-cols-3"
        >
          <!-- Starter Plan -->
          <div class="pricing-card">
            <h3 class="text-2xl font-bold">Starter</h3>
            <p class="text-gray-300">For individuals</p>
            <p class="text-4xl font-extrabold mt-6">
              $9<span class="text-lg">/mo</span>
            </p>
            <ul class="pricing-features">
              <li>✔ Basic analytics</li>
              <li>✔ 10 QR Codes</li>
              <li>✔ Custom Branding</li>
            </ul>
            <button class="pricing-button">Get Started</button>
          </div>

          <!-- Pro Plan -->
          <div class="pricing-card premium">
            <h3 class="text-2xl font-bold">Pro</h3>
            <p class="text-gray-300">For small teams</p>
            <p class="text-4xl font-extrabold mt-6">
              $29<span class="text-lg">/mo</span>
            </p>
            <ul class="pricing-features">
              <li>✔ Advanced analytics</li>
              <li>✔ Unlimited QR Codes</li>
              <li>✔ Custom Branding & Themes</li>
              <li>✔ API Access</li>
            </ul>
            <button class="pricing-button">Upgrade</button>
          </div>

          <!-- Premium Plan -->
          <div class="pricing-card">
            <h3 class="text-2xl font-bold">Premium</h3>
            <p class="text-gray-300">For enterprises</p>
            <p class="text-4xl font-extrabold mt-6">
              $59<span class="text-lg">/mo</span>
            </p>
            <ul class="pricing-features">
              <li>✔ All Pro Features</li>
              <li>✔ Custom Integrations</li>
              <li>✔ Dedicated Support</li>
              <li>✔ White Labeling</li>
            </ul>
            <button class="pricing-button">Get Premium</button>
          </div>
        </div>
      </section>
      <!-- cta   -->
      <div
        class="relative w-screen min-h-screen bg-scroll md:bg-fixed bg-center bg-cover bg-[url('/assets/aisix.webp')] z-50"
      >
        <!-- Dark Overlay -->
        <div
          class="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div class="text-center md:text-left">
            <!-- Animated Text -->
            <h1
              class="text-4xl md:text-6xl font-bold text-white animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
            >
              Create Your Profile
            </h1>
            <!-- Buttons Section -->
            <div
              class="flex w-full justify-center md:justify-start px-2 gap-6 mt-10 text-white"
            >
              <button class="cta-button-no w-auto mx-auto">
                Sign Up For A Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing section -->
      <!-- <div class="isolate">
        <div class="flow-root bg-[#000] py-16 sm:pt-32 lg:pb-0">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="relative z-10">
              <h1
                class="mx-auto max-w-4xl text-center text-2xl lg:text-5xl font-bold tracking-tight text-white"
              >
                Simple pricing, cancel anytime
              </h1>
              <p
                class="mx-auto mt-4 max-w-2xl text-center text-lg leading-8 text-white/60"
              ></p>
              <div class="mt-16 flex justify-center">
                <fieldset aria-label="Payment frequency">
                  <RadioGroup
                    v-model="frequency"
                    class="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white"
                  >
                    <RadioGroupOption
                      as="template"
                      v-for="option in pricing.frequencies"
                      :key="option.value"
                      :value="option"
                      v-slot="{ checked }"
                    >
                      <div
                        :class="[
                          checked ? 'bg-indigo-500' : '',
                          'cursor-pointer rounded-full px-2.5 py-1',
                        ]"
                      >
                        {{ option.label }}
                      </div>
                    </RadioGroupOption>
                  </RadioGroup>
                </fieldset>
              </div>
            </div>
            <div
              class="flex flex-col lg:flex lg:flex-row justify-center items-center gap-20"
            >
          

              <div
                v-for="tier in pricing.tiers"
                :key="tier.id"
                :class="[
                  tier.featured
                    ? 'z-10 bg-white shadow-xl ring-1 ring-gray-900/10'
                    : 'bg-gray-800/80 ring-1 ring-white/10 lg:bg-transparent lg:pb-14 lg:ring-0',
                  'relative rounded-2xl',
                ]"
              >
                <div class="p-8 lg:pt-12 xl:p-10 xl:pt-14">
                  <h2
                    :id="tier.id"
                    :class="[
                      tier.featured ? 'text-gray-900' : 'text-white',
                      'text-sm font-semibold leading-6',
                    ]"
                  >
                    {{ tier.name }}
                  </h2>
                  <div
                    class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch"
                  >
                    <div class="mt-2 flex items-center gap-x-4">
                      <p
                        :class="[
                          tier.featured ? 'text-gray-900' : 'text-white',
                          'text-4xl font-bold tracking-tight',
                        ]"
                      >
                        {{ tier.price[frequency.value] }}
                      </p>
                      <div class="text-sm leading-5">
                        <p
                          :class="
                            tier.featured ? 'text-gray-900' : 'text-white'
                          "
                        >
                          USD
                        </p>
                        <p
                          :class="
                            tier.featured ? 'text-gray-500' : 'text-gray-400'
                          "
                        >
                          {{ `Billed ${frequency.value}` }}
                        </p>
                      </div>
                    </div>
                    <a
                      :href="tier.href"
                      :aria-describedby="tier.id"
                      :class="[
                        tier.featured
                          ? 'bg-indigo-600 shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600'
                          : 'bg-white/10 hover:bg-white/20 focus-visible:outline-white',
                        'rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                      ]"
                      >Buy this plan</a
                    >
                  </div>
                  <div class="mt-8 flow-root sm:mt-10">
                    <ul
                      role="list"
                      :class="[
                        tier.featured
                          ? 'divide-gray-900/5 border-gray-900/5 text-gray-600'
                          : 'divide-white/5 border-white/5 text-white',
                        '-my-2 divide-y border-t text-sm leading-6 lg:border-t-0',
                      ]"
                    >
                      <li
                        v-for="mainFeature in tier.mainFeatures"
                        :key="mainFeature"
                        class="flex gap-x-3 py-2"
                      >
                        <CheckIcon
                          :class="[
                            tier.featured ? 'text-indigo-600' : 'text-gray-500',
                            'h-6 w-5 flex-none',
                          ]"
                          aria-hidden="true"
                        />
                        {{ mainFeature }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </main>
    <!-- <Footer /> -->
    <div class="h-40 flex justify-center items-center">
      <img src="@/assets/musicbizlogo.png" class="h-12" />
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
import streamLinksPage from "@/assets/mainbainwithvideo.webp";
import albumDeskPage from "@/assets/mainbainwithvideo.webp";
import socialDeskPage from "@/assets/mainbainwithvideo.webp";
import bandDeskPage from "@/assets/dannydemo.png";
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
  { name: "Amazon Music", icon: "mdi:amazon" },
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
  style: {
    position: "absolute",
    padding: "1rem",
  },
  particles: {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    color: {
      value: "#fff",
    },
    links: {
      color: "#fff",
      enable: true,
    },
    move: {
      enable: true,
    },
    number: {
      value: 100,
    },
  },
  responsive: [
    {
      breakpoint: 768, // Mobile breakpoint (width ≤ 768px)
      options: {
        particles: {
          number: {
            value: 30, // Reduced number of particles on mobile
          },
        },
      },
    },
  ],
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
  @apply bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50;
}

/* Premium Plan Highlight */
.premium {
  @apply bg-gradient-to-br from-indigo-700 to-purple-700 border-purple-500 shadow-lg shadow-purple-500/50;
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
