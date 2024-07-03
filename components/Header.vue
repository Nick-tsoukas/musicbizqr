<template>
  <header class="bg-purple-600 text-white shadow-lg">
    <div class="container mx-auto flex items-center justify-between px-4 py-4">
      <div class="text-xl font-bold">MusicBizQR</div>
      <nav class="hidden md:flex space-x-4">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink to="/signup" class="nav-link">Signup</NuxtLink>
        <NuxtLink to="/login" class="nav-link">Login</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
      </nav>
      <button @click="toggleMenu" class="md:hidden focus:outline-none">
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
      class="fixed top-20 left-0 w-full bg-white text-purple-600 transform transition-transform md:hidden"
      :class="{ 'translate-x-0': isMenuOpen, 'translate-x-full': !isMenuOpen }"
    >
      <div class="flex flex-col items-center space-y-4 py-4">
        <NuxtLink to="/" @click="toggleMenu" class="mobile-nav-link">Home</NuxtLink>
        <NuxtLink to="/signup" @click="toggleMenu" class="mobile-nav-link">Signup</NuxtLink>
        <NuxtLink to="/login" @click="toggleMenu" class="mobile-nav-link">Login</NuxtLink>
        <NuxtLink to="/contact" @click="toggleMenu" class="mobile-nav-link">Contact</NuxtLink>
      </div>
    </nav>
  </header>
</template>



<script  setup>
  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    console.log('this is toggle')
    isMenuOpen.value = !isMenuOpen.value;
  }
</script>
<style scoped>
.nav-link {
  @apply text-white hover:bg-purple-700 rounded px-4 py-2 transition-colors;
}

.mobile-nav-link {
  @apply text-purple-600 text-xl hover:bg-purple-100 rounded px-4 py-2 transition-colors;
}

.translate-x-0 {
  transform: translateX(0);
}

.translate-x-full {
  transform: translateX(100%);
}
</style>

