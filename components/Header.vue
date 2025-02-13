<template>
  <header class="bg-[#000] text-white shadow-lg">
    <div class=" p-5 mx-auto flex items-center justify-between px-4 py-4">
      <img src="@/assets/musicbizlogo.png" class="h-6" />
      <!-- <div class="text-xl font-bold">MusicBizQR</div> -->
      <nav class="hidden md:flex space-x-4">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink v-if="user" to="/dashboard" class="nav-link  ">Dashboard</NuxtLink>
        <NuxtLink v-if="user" to="/createqr" class="nav-link">+ Create QR</NuxtLink>
        <NuxtLink v-if="!user" to="/signup" class="nav-link">Signup</NuxtLink>
        <NuxtLink v-if="!user" to="/login" class="nav-link">Login</NuxtLink>
        <p v-if="user" @click="logoutUser" class="nav-link">Logout</p>
        <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
      </nav>
      <button @click="toggleMenu" class="animated__animate__slideInDown md:hidden focus:outline-none">
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
      :class="['fixed top-[75px] left-0 showfully w-screen h-[calc(100vh-75px)] justify-center bg-[#000] text-black transition-transform md:hidden z-50', isMenuOpen ? 'block' : 'hidden']"
    >
      <div class="flex flex-col h-full items-center space-y-4 py-4">
        <NuxtLink to="/" @click="toggleMenu" class="mobile-nav-link">Home</NuxtLink>
        <NuxtLink v-if="user" to="/dashboard" @click="toggleMenu" class="mobile-nav-link">Dashboard</NuxtLink>
        <NuxtLink v-if="user" to="/createqr" @click="toggleMenu" class="mobile-nav-link">+ Create QR</NuxtLink>
        <NuxtLink v-if="!user" to="/signup" @click="toggleMenu" class="mobile-nav-link">Signup</NuxtLink>
        <NuxtLink v-if="!user" to="/login" @click="toggleMenu" class="mobile-nav-link">Login</NuxtLink>
        <NuxtLink v-if="user" to="/" @click="logoutUserMobile" class="mobile-nav-link">Logout</NuxtLink>
        <NuxtLink to="/contact" @click="toggleMenu" class="mobile-nav-link">Contact</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup>


const user = useStrapiUser();
const { logout } = useStrapiAuth();
const router = useRouter();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  if (!isMenuOpen.value) {
  document.body.style.overflow = 'hidden'; // disable body scroll
} else {
  document.body.style.overflow = '';
}
isMenuOpen.value = !isMenuOpen.value;
};

const logoutUser = () => {
  logout();
  router.push('/');
};

const logoutUserMobile = () => {
  logout();
  toggleMenu();
  router.push('/');
};



</script>

<style scoped>
.nav-link {
  @apply text-white hover:bg-purple-700 rounded px-4 py-2 transition-colors;
}

.mobile-nav-link {
  @apply text-white text-xl hover:bg-purple-100 rounded px-4 py-2 transition-colors;
}

.showfully {
  z-index: 9999999999999;
}

.block {
  display: block;
}

body {
  overflow-x: hidden; /* Prevent horizontal scrolling */
}
</style>