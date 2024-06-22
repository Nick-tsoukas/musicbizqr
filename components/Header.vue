<template>
  <div class="flex  w-screen h-[80px] ">
    <div class="w-full px-4 flex flex-grow items-center">MusicBizQR</div>
    <div class="w-full px-4 flex flex-grow  items-center justify-end">
      <div class="hidden md:flex">
        <NuxtLink to="/" class="hover:text-gray-400">Home</NuxtLink>
        <NuxtLink to="/signup" class="hover:text-gray-400">Signup</NuxtLink>
        <NuxtLink to="/login" class="hover:text-gray-400">Login</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-gray-400">Contact</NuxtLink>
      </div>
      <div class="md:hidden">
      <button @click="toggleMenu" class="focus:outline-none">
        <svg
          class="w-6 h-6 transition-transform transform"
          :class="{ 'rotate-45': isMenuOpen, 'rotate-0': !isMenuOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            v-if="!isMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
    <nav
      class="hidden md:flex space-x-4"
    >
      <NuxtLink to="/" class="hover:text-gray-400">Home</NuxtLink>
      <NuxtLink to="/signup" class="hover:text-gray-400">Signup</NuxtLink>
      <NuxtLink to="/login" class="hover:text-gray-400">Login</NuxtLink>
      <NuxtLink to="/contact" class="hover:text-gray-400">Contact</NuxtLink>
    </nav>
    <div
      class="fixed top-[80px]  h-[calc(100vh - 80px)] inset-0 bg-white  flex flex-col items-center justify-center transition-transform transform md:hidden"
      :class="{ 'translate-x-0': isMenuOpen, 'translate-x-full': !isMenuOpen }"
    >
      <NuxtLink to="/" @click="toggleMenu" class="hover:text-gray-400 text-2xl py-2">Home</NuxtLink>
      <NuxtLink to="/signup" @click="toggleMenu" class="hover:text-gray-400 text-2xl py-2">Signup</NuxtLink>
      <NuxtLink to="/login" @click="toggleMenu" class="hover:text-gray-400 text-2xl py-2">Login</NuxtLink>
      <NuxtLink to="/contact" @click="toggleMenu" class="hover:text-gray-400 text-2xl py-2">Contact</NuxtLink>
    </div>
    </div>
   
  </div>
</template>

<script  setup>
  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    console.log('this is toggle')
    isMenuOpen.value = !isMenuOpen.value;
  }
</script>

<style>

</style>