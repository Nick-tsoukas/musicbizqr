<template>
  <div >
    <div class="w-screen flex justify-center mt-8">
      <div class="flex justify-center relative w-[300px]"> 
      <NuxtParticles
      class="mt-20"
      id="tsparticles"
      :options="options"
      />
      <svg
        id="animated-svg"
        height="300"
        width="300"
        viewBox="0 0 31 31"
        xmlns="http://www.w3.org/2000/svg"

      >
        <path class="animated-path" d="M1 1h7v7h-7zM10 1h3v1h-3zM14 1h1v1h1v-1h1v2h-2v1h-1v-1h-1v-1h1zM18 1h1v1h-1zM20 1h1v1h-1zM23 1h7v7h-7zM2 2v5h5v-5zM19 2h1v1h-1zM21 2h1v3h-1v-1h-1v-1h1zM24 2v5h5v-5zM3 3h3v3h-3zM9 3h4v1h1v1h-3v-1h-1v2h2v2h1v-2h1v4h-4v-1h-1zM25 3h3v3h-3zM15 4h5v1h1v1h-3v-1h-3zM16 6h1v1h-1zM21 6h1v4h-1v-1h-1v-1h1zM10 7v1h1v-1zM15 7h1v1h1v1h-2zM17 7h1v1h-1zM19 7h1v1h-1zM1 9h1v1h1v2h1v-2h-1v-1h5v1h-1v1h-1v-1h-1v1h1v1h-1v1h1v1h1v1h-1v1h-1v-1h-2v-2h-1v-1h-1zM17 9h3v1h-3zM23 9h5v1h-2v1h-1v-1h-1v1h-1zM8 10h1v1h2v1h1v-1h1v2h-3v-1h-3v-1h1zM14 10h2v1h2v2h4v-1h1v2h1v2h-1v-1h-1v-1h-1v1h-1v-1h-5v-1h1v-1h-1v1h-1zM20 10h1v1h-1zM29 10h1v1h-1zM19 11h1v1h-1zM24 11h1v1h2v1h-2v1h-1zM27 11h2v3h-2v-1h1v-1h-1zM6 12h1v1h-1zM1 13h1v2h-1zM7 13h1v1h-1zM13 13h1v4h-2v-1h1v-1h-1v1h-1v-1h-1v1h-3v-1h1v-1h5zM25 14h2v3h-2v-1h1v-1h-1zM29 14h1v1h-1zM2 15h1v1h1v1h2v1h-1v2h2v1h1v-1h1v-1h1v-1h-1v-1h3v1h1v1h-2v1h-1v1h1v-1h1v2h-2v1h-1v-1h-3v-1h-2v-2h-1v-2h-1v5h-1v-6h1zM16 15h2v1h-2zM19 15h1v1h-1zM21 15h1v2h-1zM28 15h1v2h1v2h-1v-1h-2v-1h1zM6 16h1v1h-1zM15 16h1v1h-1zM7 17h1v1h-1zM16 17h3v1h-3zM20 17h1v2h-1v1h1v1h-1v1h-2v-1h1v-1h-1v-1h1v-1h1zM22 17h1v1h-1zM14 18h2v1h1v1h1v1h-1v1h-2v-1h1v-1h-1v1h-1v4h-1v-2h-1v-1h1v-2h1zM23 18h3v1h-1v1h-1v-1h-1zM7 19h1v1h-1zM21 19h1v1h-1zM26 19h1v2h-1v1h1v1h-1v2h2v1h-3v1h-1v-1h-1v1h-2v-3h-1v-2h1v-1h1v-1h1v1h2v-1h1zM28 19h1v1h1v1h-2zM27 21h1v1h-1zM17 22h1v1h-1zM22 22v3h3v-3zM29 22h1v1h-1zM1 23h7v7h-7zM10 23h1v1h-1zM16 23h1v2h-2v-1h1zM18 23h1v1h-1zM23 23h1v1h-1zM28 23h1v2h-1zM2 24v5h5v-5zM9 24h1v1h2v1h2v1h-1v1h2v-2h1v1h1v2h-1v1h-3v-1h-2v-2h-1v1h-1zM3 25h3v3h-3zM17 25h3v1h-3zM28 26h2v1h-1v2h-1v-1h-2v1h-1v1h-3v-1h-1v-1h2v1h1v-1h1v-1h3zM19 27h1v1h-1zM23 27h1v1h-1zM9 29h1v1h-1zM17 29h4v1h-4zM27 29h1v1h-1z"/>
      </svg>
    </div>
    </div>
   

    <div class="flex flex-col items-center justify-center mx-2  mb-6">
      <h2 class="pb-8 text-3xl font-bold text-center mt-4  text-black">Get Your Sound Out</h2>
      <p class="text-center text w-[80vw]">
        Amplify your music's reach with our dynamic QR codes, designed specifically for the music industry.
      </p>
    </div>
    <!-- band page  -->
    <section class="mx-4 mt-10">
      <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Create Powerful Landing Pages for Artists
      </h2>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Band Page
      </h3>
      <PhoneMockup img="https://images.unsplash.com/photo-1568495732369-3a3f5b5290dd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Phone Screen" />
      <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
  <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Features of Our Band Landing Page</h2>
  <ul class="space-y-6">
    <li class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Exclusive Content</h3>
      <p class="text-gray-700 dark:text-gray-300">
        Offer behind-the-scenes videos, early access to new music, or special discounts to create a sense of exclusivity and reward loyal fans.
      </p>
    </li>
    <li class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Fan Engagement</h3>
      <p class="text-gray-700 dark:text-gray-300">
        Use sign-up forms, surveys, or contests to gather fan information and increase engagement.
      </p>
    </li>
    <li class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Album Launches</h3>
      <p class="text-gray-700 dark:text-gray-300">
        Create dedicated pages for new album releases, featuring music previews, artist insights, and options to purchase or stream the album.
      </p>
    </li>
    <li class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Event Information</h3>
      <p class="text-gray-700 dark:text-gray-300">
        Provide comprehensive details about upcoming events, including dates, venues, and ticket purchasing links to drive attendance.
      </p>
    </li>
    <li class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Analytics Integration</h3>
      <p class="text-gray-700 dark:text-gray-300">
        Use analytics tools to track visitor behavior, measure engagement, and understand conversion rates to optimize your campaigns.
      </p>
    </li>
  </ul>
</div>

    </section>
    <!-- features   -->

    <div class="flex justify-around w-[80vw] mx-auto mt-8">
      <nuxt-link to="/signup" class="btn text-center w-[40%] grow-1">Sign Up</nuxt-link>
      <nuxt-link to="/login" class="btn text-center w-[40%] grow-1">Log In</nuxt-link>
    </div>
  
  </div>
</template>

<script setup lang="ts">
import { ref, useRuntimeConfig } from '#imports'
import { loadFull } from 'tsparticles'
import { tsParticles } from '@tsparticles/engine'

const { mode } = useRuntimeConfig().public.particles

const show = ref(false)

if (import.meta.client && mode === 'custom') {
  await loadFull(tsParticles)
}

const options = {
  // fullScreen: {
  //   enable: true,
  //   zIndex: -1
  // },
  style: {
    position: 'absolute',
    height: '290px',
    padding: '1rem'
  },
  particles: {
    color: {
      value: "#fgfgfg"
    },
    links: {
      color: "#000",
      enable: true
    },
    move: {
      enable: true
    },
    number: {
      value: 30
    }
  }
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
</script>

<style scoped>
.btn {
  @apply bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:bg-purple-700;
}
.animated-path {
  transition: fill 1s ease;
}


</style>
