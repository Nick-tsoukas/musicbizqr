<template>
  <div class="bg-[#000]">
    <!-- Main content with particle animation and SVG -->
    <!-- <div class="relative w-screen flex justify-center mt-8">
      <div class="flex justify-center relative w-[300px]">
        <NuxtParticles
          class="mt-20"
          id="tsparticles"
          :options="options"
        />
      </div>
    </div> -->

    <!-- Main content -->
    <main>
      <!-- Hero section -->
      <NuxtParticles
          id="tsparticles"
          :options="options"
        />
      <div class="relative isolate h-[50vh] ">
       
     
        <div class="mx-auto w-[90vw]  px-6 py-4 lg:flex  lg:gap-x-10 lg:px-8 ">
          <div class="mx-auto max-w-2xl lg:mx-0 text-white lg:flex-auto">
            <h1 class="mt-10 max-w-lg text-4xl text-white font-bold tracking-tight  text-center sm:text-6xl md:text-left">Get your sound out</h1>
            <p class="mt-6 text-lg leading-8 ">Effortlessly create branded QR codes and generate personalized splash pages with custom audio players and more. Showcase band pages, tour dates, and seamlessly connect all your social media links and streaming services. </p>
            <div class="mt-10 flex flex-col md:flex-row items-center gap-x-6">
              <NuxtLink to="/signup" class="mdc-button mb-4 w-full md:mb-0 md:w-auto">Get started</NuxtLink>
              <NuxtLink to="/login" class="mdc-button w-full md:w-auto">Login </NuxtLink>
            </div>
          </div>
          <div class="mt-16 sm:mt-24 md:flex md:justify-center md:items-center lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <img src="@/assets/qrimagehome.png" alt="">
          </div>
          <!-- <div>
            <img src="@/assets/albumcover.jpg" alt="">
          </div> -->

          <!-- <div class="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <svg viewBox="0 0 366 729" role="img" class="mx-auto w-[22.875rem] max-w-full drop-shadow-xl">
              <title>App screenshot</title>
              <defs>
                <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                  <rect width="316" height="684" rx="36" />
                </clipPath>
              </defs>
              <path fill="#4B5563" d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z" />
              <path fill="#343E4E" d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z" />
              <foreignObject width="316" height="684" transform="translate(24 24)" clip-path="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)">
                <img src="@/assets/dash.png" alt="" />
              </foreignObject>
            </svg>
          </div> -->
          
        </div>
        
      </div>

      <!-- grid of main features and branded qrs -->
      <section class="mx-auto  w-[90vw] px-6 mt-0 mb-20" >
        <h2 class="text-5xl text-white font-bold  mt-0 "> <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Splash Pages</span> for your branded  <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 italic ">QRS</span></h2>
      </section>
      <section class="mx-auto  w-[90vw] px-6" >
         <div class="flex" >
          <div class="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 ">
            <svg viewBox="0 0 366 729" role="img" class="mx-auto w-[22.875rem] max-w-full drop-shadow-xl animate__animated animate__slideInLeft">
              <title>App screenshot</title>
              <defs>
                <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                  <rect width="316" height="684" rx="36" />
                </clipPath>
              </defs>
              <path fill="#4B5563" d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z" />
              <path fill="#343E4E" d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z" />
              <foreignObject width="316" height="684" transform="translate(24 24)" clip-path="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)">
                <img src="@/assets/bandmobilescreen.png" alt="" />
              </foreignObject>
            </svg>
          </div>
          <div class="flex flex-wrap w-full p-4 gap-2  ">
           <div v-for="(page, index) in splashPages" :key="index" :class="{'border-green' : selectedPage == index}" @click="selectPage(index)" class="w-[30%] p-0 text-white flex justify-center items-center border-2 text-2xl font-semibold relative"  > <img class="absolute top-4 left-4" src="@/assets/microphone.svg" alt="">{{ page }}</div>

        </div>

         </div>
      </section>
      <!-- Chart  -->
      <section class="w-[70vw] mx-auto mt-28 ">
        <h2 class=" text-6xl mb-14 text-center font-extrabold  bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Advanced Analytics</h2>
        <p class="text-white text-2xl mb-14 text-center ">Enhance your campaign ROI with our comprehensive analytics, turning QR code scans into actionable insights. Leverage state-of-the-art data visualization and tracking technologies to boost user engagement and elevate your marketing strategies.</p>
        <BarChart class="mx-auto"/>
      </section>
    
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, useRuntimeConfig } from '#imports'
import { loadFull } from 'tsparticles'
import { tsParticles } from '@tsparticles/engine'

const { mode } = useRuntimeConfig().public.particles

const show = ref(false)

const splashPages = ref(['Band Page', 'Album Player', "Streaming Links", "Social links", "Website Url", "Video Grid"])
const splashImages = ref(['@/assets/bandmobilescreen.png', '@/assets/bandmobilescreen.png', '@/assets/bandmobilescreen.png', '@/assets/bandmobilescreen.png', '@/assets/bandmobilescreen.png', '@/assets/bandmobilescreen.png'])

const selectedPage = ref(0)

import { ChevronRightIcon, CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/vue/20/solid'

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
  }
}

function selectPage(i) {
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
