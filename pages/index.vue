<template>
  <div class="bg-[#000] overflow-x-hidden">
    <NuxtParticles
          id="tsparticles"
          :options="options"
        />
    <!-- Main content -->
    <main>
      <!-- Hero section -->
      <!-- <NuxtParticles
          id="tsparticles"
          :options="options"
        /> -->
      <div class="relative isolate min-h-[50vh] ">
       
       <!-- mobile  -->
       <!-- <h1 class="mb-16  text-8xl text-white font-extrabold tracking-tight  text-center  md:text-left ">Get your sound out</h1> -->
     
        <div class=" mx-auto  w-[90vw]  px-6 py-10 2xl:flex   2xl:gap-x-10 2xl:px-8 ">
          <div class="mx-auto w-full 2xl:w-[45%]   lg:mx-0 text-white lg:flex-auto ">
            <h1 class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-16 text-center font-extrabold tracking-tight text-7xl md:text-8xl lg:text-left">
  Music Biz Qr
</h1>            <div class="flex justify-center mb-12 2xl:hidden" >
              <img src="@/assets/qrcode.png" alt="" class="h-[275px] w-[275px]" >
            </div>
            <p class=" text-2xl text-center  leading-10 2xl:text-left ">Amplify your brand with custom QR codes, personalized splash pages, and seamless social media connections. </p>
            <ul class="list-disc list-inside space-y-2 text-lg lg:text-xl text-white mt-6">
              <li>Create QR codes</li>
              <li>Feature Music pages</li>
              <li>Add audio players</li>
              <li>Artist pages</li>
              <li>Connnect social media links, streaming, websites</li>
            </ul>
            <div class="mt-16 justify-center  mb-10 flex flex-col md:flex-row xl:justify-start items-center  gap-x-6">
              <NuxtLink to="/signup" class="mdc-button mb-4 w-full md:mb-0 md:w-auto">Create Account</NuxtLink>
              <NuxtLink to="/login" class="mdc-button w-full md:w-auto">Member Login </NuxtLink>
            </div>
          </div>
          <div class="hidden mt-16 sm:mt-24 2xl:flex md:justify-center md:items-center lg:mt-0 lg:flex-shrink-0 lg:flex-grow ">
            <img src="@/assets/qrcode.png" alt="" class=" md:h-[450px] md:w-[450px]" >
          </div>
          
        </div>
        
      </div>

      <!-- grid of main features and branded qrs -->
      <section class="text-center 2xl:text-left mb-2 mx-auto  px-2 w-full  lg:w-[90vw] lg:px-6 mt-0 lg:mb-20" >
        <h2 class=" text-4xl lg:text-4xl 2xl:text-5xl text-white font-bold  mt-0 "> <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Example Splash Pages</span>   <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 italic "></span></h2>
      </section>
      
      <section class="mx-auto px-1 pt-6 2xl:pt-0  w-[90vw] 2xl:px-6" >
         <div class="flex flex-col 2xl:flex-row" >
          <div class="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 ">
            <svg viewBox="0 0 366 729" role="img" class="mx-auto w-[15rem] 2xl:w-[22.875rem] max-w-full drop-shadow-xl animate__animated animate__slideInLeft">
              <title>App screenshot</title>
              <defs>
                <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                  <rect width="316" height="684" rx="36" />
                </clipPath>
              </defs>
              <path fill="#4B5563" d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z" />
              <path fill="#343E4E" d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z" />
              <foreignObject class="bg-black" width="316" height="684" transform="translate(24 24)" clip-path="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)">
                <img :src="imageToRender" alt="" />
              </foreignObject>
            </svg>
          </div>
          <!-- grid of screens  -->
          <div class="flex element_scroll flex-row overflow-scroll lg:justify-center  2xl:overflow-hidden 2xl:flex-wrap w-full pt-24 xl:p-4 gap-2  ">
           <div v-for="(page, index) in splashPages" :key="index" :class="{'border-green' : selectedPage == index}" @click="selectPage(index, page)" class="min-w-[50vw] h-52 2xl:h-20 2xl:w-[30%]  p-0 text-white flex justify-center items-center border-2 text-2xl font-semibold relative"  > <img class="absolute top-4 left-4  h-6 lg:h-[50px]" :src="splashImages[index]" alt=""><span class="text-xl">{{ page }}</span>  </div>
              
        </div>

         </div>
      </section>

      <!-- image gallery  -->

      <div class="flex justify-center py-10  md:py-32 image_gradient my-8 md:my-16">
        <div class="w-full max-w-md md:max-w-5xl mx-auto">
          <!-- heading  -->
          <div class="mb-24">
            <h2 class="text-3xl  text-center md:text-5xl text-white font-bold mb-4">Example Desktop Splash Pages</h2>
          </div>
          <!-- swiper with cards  -->
          <Swiper
      :modules="[EffectCards]"
      effect="cards"
      grabCursor="true"
      class="main-gallery pt-10  mt-4 h-auto "
    >
      <SwiperSlide
        v-for="(slide, index) in slides"
        :key="index"
        class="flex items-center justify-center"
      >
        <img
          :src="slide.image"
          :srcset="slide.srcset"
          alt="Main Image"
          class="w-[90vw] md:w-full h-auto object-cover rounded-lg shadow-lg"

        />
      </SwiperSlide>
    </Swiper>
    <!-- smart link section  -->
     
     <!-- Smart Links and Shares Section -->


      <!-- Thumbnail Swiper -->
      <!-- <Swiper
        :modules="[Thumbs]"
        :onSwiper="setThumbsSwiper"
        :slides-per-view="4"
        space-between="10"
        class="thumbs-gallery"
      >
        <SwiperSlide v-for="(slide, index) in slides" :key="index">
          <img :src="slide.thumbnail" alt="Thumbnail" class="w-full h-auto object-cover" />
        </SwiperSlide>
      </Swiper> -->
     
      <!-- Main Swiper with Effect -->
      <!-- <Swiper
        :modules="[Thumbs, EffectCards]"
        :thumbs="{ swiper: thumbsSwiper }"
        :effect="swiperEffect"
        class="main-gallery mt-4 h-80 md:h-96"
          :breakpoints="{
         768: { // For screens >= 768px
          slidesPerView: 1,
         spaceBetween: 30,
          effect: 'slide',
        },
        0: { // For screens < 768px
         slidesPerView: 1,
      spaceBetween: 10,
         effect: 'cards',
         },
        }"
>
  <SwiperSlide v-for="(slide, index) in slides" :key="index">
    <img :src="slide.image" alt="Main Image" class="w-full h-full object-cover" />
  </SwiperSlide>
</Swiper> -->
    </div>
  </div>

  <!-- heading of band image  -->
 
  <!-- main band image  -->
   <div class="w-screen mx-auto" >
    <h2 class="bg-clip-text text-transparent bg-gradient-to-r pb-10 from-pink-500 to-violet-500  text-center font-extrabold tracking-tight text-5xl md:text-8xl lg:text-center">
  Build Your Band Page
    </h2> 
    <img class="mx-auto" :src="bandDeskPage" alt="">
   </div>
  <!-- end of image galler   -->
      <!-- Chart  -->
      <section class="w-[70vw] mx-auto mt-10 2xl:mt-28 ">
        <h2 class=" text-4xl  md:text-4xl lg:text-6xl mb-14 text-center font-extrabold  bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Advanced Analytics</h2>
        <p class="text-white text-lg lg:text-2xl mb-14 text-center ">Enhance your campaign ROI with our comprehensive analytics, turning QR code scans into actionable insights. Leverage state-of-the-art data visualization and tracking technologies to boost user engagement and elevate your marketing strategies.</p>
        <BarChart class="mx-auto"/>
      </section>

          <!-- Pricing section -->
          <div class="isolate ">
        <div class="flow-root bg-[#000] py-16 sm:pt-32 lg:pb-0">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="relative z-10">
              <h1 class="mx-auto max-w-4xl text-center text-2xl lg:text-5xl font-bold tracking-tight text-white">Simple pricing, cancel anytime </h1>
              <p class="mx-auto mt-4 max-w-2xl text-center text-lg leading-8 text-white/60"></p>
              <div class="mt-16 flex justify-center">
                <fieldset aria-label="Payment frequency">
                  <RadioGroup v-model="frequency" class="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white">
                    <RadioGroupOption as="template" v-for="option in pricing.frequencies" :key="option.value" :value="option" v-slot="{ checked }">
                      <div :class="[checked ? 'bg-indigo-500' : '', 'cursor-pointer rounded-full px-2.5 py-1']">{{ option.label }}</div>
                    </RadioGroupOption>
                  </RadioGroup>
                </fieldset>
              </div>
            </div>
            <div class="flex flex-col lg:flex lg:flex-row justify-center items-center gap-20">
              <!-- <svg viewBox="0 0 1208 1024" aria-hidden="true" class="absolute -bottom-48 left-1/2 h-[64rem] -translate-x-1/2 translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] lg:-top-48 lg:bottom-auto lg:translate-y-0">
                <ellipse cx="604" cy="512" fill="url(#d25c25d4-6d43-4bf9-b9ac-1842a30a4867)" rx="604" ry="512" />
                <defs>
                  <radialGradient id="d25c25d4-6d43-4bf9-b9ac-1842a30a4867">
                    <stop stop-color="#7775D6" />
                    <stop offset="1" stop-color="#E935C1" />
                  </radialGradient>
                </defs>
              </svg> -->
              <!-- <div class="" aria-hidden="true" /> -->

              <div v-for="tier in pricing.tiers" :key="tier.id" :class="[tier.featured ? 'z-10 bg-white shadow-xl ring-1 ring-gray-900/10' : 'bg-gray-800/80 ring-1 ring-white/10 lg:bg-transparent lg:pb-14 lg:ring-0', 'relative rounded-2xl']">
                <div class="p-8 lg:pt-12 xl:p-10 xl:pt-14">
                  <h2 :id="tier.id" :class="[tier.featured ? 'text-gray-900' : 'text-white', 'text-sm font-semibold leading-6']">{{ tier.name }}</h2>
                  <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                    <div class="mt-2 flex items-center gap-x-4">
                      <p :class="[tier.featured ? 'text-gray-900' : 'text-white', 'text-4xl font-bold tracking-tight']">{{ tier.price[frequency.value] }}</p>
                      <div class="text-sm leading-5">
                        <p :class="tier.featured ? 'text-gray-900' : 'text-white'">USD</p>
                        <p :class="tier.featured ? 'text-gray-500' : 'text-gray-400'">{{ `Billed ${frequency.value}` }}</p>
                      </div>
                    </div>
                    <a :href="tier.href" :aria-describedby="tier.id" :class="[tier.featured ? 'bg-indigo-600 shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600' : 'bg-white/10 hover:bg-white/20 focus-visible:outline-white', 'rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2']">Buy this plan</a>
                  </div>
                  <div class="mt-8 flow-root sm:mt-10">
                    <ul role="list" :class="[tier.featured ? 'divide-gray-900/5 border-gray-900/5 text-gray-600' : 'divide-white/5 border-white/5 text-white', '-my-2 divide-y border-t text-sm leading-6 lg:border-t-0']">
                      <li v-for="mainFeature in tier.mainFeatures" :key="mainFeature" class="flex gap-x-3 py-2">
                        <CheckIcon :class="[tier.featured ? 'text-indigo-600' : 'text-gray-500', 'h-6 w-5 flex-none']" aria-hidden="true" />
                        {{ mainFeature }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Thumbs } from 'swiper/modules';
import { EffectCards } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper/types';

import streamLinksPage from '@/assets/socialpagedesktopnew.png';
import albumDeskPage from'@/assets/newalbumpagedesktop.png'; // Replace with your actual image file
import socialDeskPage from '@/assets/socialpagedesktopnew.png'; // Thumbnail images
import bandDeskPage from '@/assets/newbandpageimage.png';
import evnetsDesk from '@/assets/eventsdesk.png'; // Thumbnail images


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/effect-cards';

// Define your slides data
const slides = [
{ image: evnetsDesk, thumbnail: streamLinksPage },
  { image: streamLinksPage, thumbnail: streamLinksPage },
  { image: albumDeskPage, thumbnail: streamLinksPage },
  { image: socialDeskPage, thumbnail: streamLinksPage },
  // Add more slides as needed
];

// Define your reactive variables with types
const thumbsSwiper = ref<SwiperInstance | null>(null);

// Define your functions with typed parameters
const setThumbsSwiper = (swiper: SwiperInstance) => {
  thumbsSwiper.value = swiper;
};

import musicSvg from '@/assets/music.svg';
import microphoneSvg from '@/assets/microphone.svg';
import recordSvg from '@/assets/record.svg';
import streamingSvg from '@/assets/streaming.svg'
import facebookSvg from '@/assets/facebook-icon-white.svg'
import websiteSvg from '@/assets/website.svg'
import videoSvg from '@/assets/video.svg'

import bandScreen from '@/assets/newbandhome.jpg'
import albumScreen from '@/assets/albumnewpage.jpg'
import streamScreen from '@/assets/socialnewpage.jpg'
import socialScreen from '@/assets/socialnewpage.jpg'
import externalScreen from '@/assets/newbandhome.jpg'





import { defineComponent, h,  } from 'vue'
import { Dialog, DialogPanel, RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon as XMarkIconOutline } from '@heroicons/vue/24/outline'
import { CheckIcon, XMarkIcon as XMarkIconMini } from '@heroicons/vue/20/solid'
import { ChevronRightIcon, CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/vue/20/solid'




import { ref, useRuntimeConfig } from '#imports'
import { loadFull } from 'tsparticles'
import { tsParticles } from '@tsparticles/engine'

const { mode } = useRuntimeConfig().public.particles
const imageToRender = ref(bandScreen)

const show = ref(false)


const splashPages = ref(['Band Page', 'Music Player', "Streaming Links", "Social links", "Website Url", "Video Grid"])

const splashImages = ref([
  musicSvg, recordSvg, streamingSvg, facebookSvg, websiteSvg, videoSvg,
  
]);
const selectedPage = ref(0)


const pricing = {
  frequencies: [
    { value: 'monthly', label: 'Monthly' },
    { value: 'annually', label: 'Annually' },
  ],
  tiers: [
    {
      name: 'Starter',
      id: 'tier-starter',
      href: '#',
      featured: false,
      description: 'write a descripton .',
      price: { monthly: '$15', annually: '$100' },
      mainFeatures: [
       'feature one',
       'feature one',
       'feature one'
       
      ],
    },
    {
      name: 'Pro',
      id: 'tier-starter',
      href: '#',
      featured: false,
      description: 'write a descripton .',
      price: { monthly: '$30', annually: '$250' },
      mainFeatures: [
       'feature one',
       'feature one',
       'feature one'
       
      ],
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
      name: 'Catered for business',
      features: [
        { name: 'Tax Savings', tiers: { Starter: true, Scale: true, Growth: true } },
        { name: 'Easy to use accounting', tiers: { Starter: true, Scale: true, Growth: true } },
        { name: 'Multi-accounts', tiers: { Starter: '3 accounts', Scale: 'Unlimited accounts', Growth: '7 accounts' } },
        { name: 'Invoicing', tiers: { Starter: '3 invoices', Scale: 'Unlimited invoices', Growth: '10 invoices' } },
        { name: 'Exclusive offers', tiers: { Starter: false, Scale: true, Growth: true } },
        { name: '6 months free advisor', tiers: { Starter: false, Scale: true, Growth: true } },
        { name: 'Mobile and web access', tiers: { Starter: false, Scale: true, Growth: false } },
      ],
    },
    {
      name: 'Other perks',
      features: [
        { name: '24/7 customer support', tiers: { Starter: true, Scale: true, Growth: true } },
        { name: 'Instant notifications', tiers: { Starter: true, Scale: true, Growth: true } },
        { name: 'Budgeting tools', tiers: { Starter: true, Scale: true, Growth: true } },
        { name: 'Digital receipts', tiers: { Starter: true, Scale: true, Growth: true } },
        { name: 'Pots to separate money', tiers: { Starter: false, Scale: true, Growth: true } },
        { name: 'Free bank transfers', tiers: { Starter: false, Scale: true, Growth: false } },
        { name: 'Business debit card', tiers: { Starter: false, Scale: true, Growth: false } },
      ],
    },
  ],
}



const frequency = ref(pricing.frequencies[0])


const options = {
  style: {
    position: 'absolute',
    padding: '1rem'
  },
  particles: {
    fullScreen: {
      enable: true,
      zIndex: -1
    },
    color: {
      value: "#fff"
    },
    links: {
      color: "#fff",
      enable: true
    },
    move: {
      enable: true
    },
    number: {
      value: 100
    }
  },
  responsive: [
    {
      breakpoint: 768, // Mobile breakpoint (width ≤ 768px)
      options: {
        particles: {
          number: {
            value: 30 // Reduced number of particles on mobile
          },
        }
      }
    }
  ]
}

function selectPage(i, page) {
 if(page == 'Band Page'){
   // somevaluie is set to bandmobilescreen.png
   imageToRender.value = bandScreen
 }
 if(page == 'Music Player'){
  // change image to Music Player screenshot and get url 
  imageToRender.value = albumScreen

 }
 if(page == 'Streaming Links'){
  // change image to Streaming screenshot and get url 
  imageToRender.value = streamScreen

 }
 if(page == 'Social Links'){
  imageToRender.value = socialScreen
 }
 if(page == 'Website Url'){
   imageToRender.value = bandScreen
 }
 if(page == 'Video Grid'){
  imageToRender.value = bandScreen
 }
  selectedPage.value  = i
  
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function changeColors() {
  const paths = document.querySelectorAll('.animated-path');
  paths.forEach(path => {
    path.style.fill = getRandomColor();
  });
}

function animateColors() {
  setInterval(changeColors, 2000);
}

onMounted(() => {
  animateColors();
});

const primaryFeatures = [
  {
    name: 'Push to deploy.',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockClosedIcon,
  },
  {
    name: 'Database backups.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.',
    icon: ServerIcon,
  },
]



const secondaryFeatures = [
  {
    name: 'Push to deploy',
    description:
      'Commodo nec sagittis tortor mauris sed. Turpis tortor quis scelerisque diam id accumsan nullam tempus. Pulvinar etiam lacus volutpat eu. Phasellus praesent ligula sit faucibus.',
    href: '#',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates',
    description:
      'Pellentesque enim a commodo malesuada turpis eleifend risus. Facilisis donec placerat sapien consequat tempor fermentum nibh.',
    href: '#',
    icon: LockClosedIcon,
  },
  {
    name: 'Simple queues',
    description:
      'Pellentesque sit elit congue ante nec amet. Dolor aenean curabitur viverra suspendisse iaculis eget. Nec mollis placerat ultricies euismod ut condimentum.',
    href: '#',
    icon: ServerIcon,
  },
]

const featuredTestimonial = {
  body: 'Integer id nunc sit semper purus. Bibendum at lacus ut arcu blandit montes vitae auctor libero. Hac condimentum dignissim nibh vulputate ut nunc. Amet nibh orci mi venenatis blandit vel et proin. Non hendrerit in vel ac diam.',
  author: {
    name: 'Brenna Goyette',
    handle: 'brennagoyette',
    imageUrl:
      'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80',
    logoUrl: 'https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg',
  },
}

const testimonials = [
  [
    [
      {
        body: 'Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.',
        author: {
          name: 'Leslie Alexander',
          handle: 'lesliealexander',
          imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      },
      // More testimonials...
    ],
    [
      {
        body: 'Aut reprehenderit voluptatem eum asperiores beatae id. Iure molestiae ipsam ut officia rem nulla blanditiis.',
        author: {
          name: 'Lindsay Walton',
          handle: 'lindsaywalton',
          imageUrl:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      },
      // More testimonials...
    ],
  ],
  [
    [
      {
        body: 'Voluptas quos itaque ipsam in voluptatem est. Iste eos blanditiis repudiandae. Earum deserunt enim molestiae ipsum perferendis recusandae saepe corrupti.',
        author: {
          name: 'Tom Cook',
          handle: 'tomcook',
          imageUrl:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      },
      // More testimonials...
    ],
    [
      {
        body: 'Molestias ea earum quos nostrum doloremque sed. Quaerat quasi aut velit incidunt excepturi rerum voluptatem minus harum.',
        author: {
          name: 'Leonard Krasner',
          handle: 'leonardkrasner',
          imageUrl:
            'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      },
      // More testimonials...
    ],
  ],
]
</script>

<style scoped>
.custom-gradient {
    background: #a8ff78; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #78ffd6, #a8ff78); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #78ffd6, #a8ff78); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

.btn {
  @apply bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:bg-purple-700;
}


.element_scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
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
    background-color: #4CAF50;
    height: 20%; /* Initial height */
    animation: grow-bar 2s ease-in-out infinite;
}

/* Animation keyframes */
@keyframes grow-bar {
    0%, 100% {
        height: 20%;
    }
    50% {
        height: var(--bar-height);
    }
}



  
</style>
