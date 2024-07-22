<template>
  <!-- <header class="bg-[#2C2C2C] text-[#F5F5F5] shadow-lg"> -->
    <header class="bg-[#F5F5F5] text-[#2C2C2C] shadow-lg">

    <div class="container mx-auto flex items-center justify-between px-4 py-4">
      <div class="text-xl font-bold">MusicBizQR</div>
      <nav class="hidden md:flex space-x-4">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink v-if="user" to="/dashboard" class="nav-link">Dashbord</NuxtLink>
        <NuxtLink v-if="user" to="/qrtype" class="nav-link"> + Create QR</NuxtLink>
        <NuxtLink v-if="!user" to="/signup" class="nav-link">Signup</NuxtLink>
        <NuxtLink v-if="!user" to="/login" class="nav-link">Login</NuxtLink>
        <p v-if="user" @click="logoutUser" class="nav-link">logout</p>
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
      class="fixed overAll top-[75px] left-0 w-screen h-[100vh] justify-center bg-white text-black transform transition-transform md:hidden"
      :class="{ 'translate-x-0': isMenuOpen, 'translate-x-full': !isMenuOpen }"
    >
      <div class="flex  flex-col h-[calc(100vh -75px)] items-center space-y-4 py-4">
        <NuxtLink to="/" @click="toggleMenu" class="mobile-nav-link">Home</NuxtLink>
        <NuxtLink v-if="user" to="/dashboard" @click="toggleMenu" class="mobile-nav-link">Dashboard</NuxtLink>
        <NuxtLink v-if="user" to="/qrtype" @click="toggleMenu" class="mobile-nav-link">+ Create QR</NuxtLink>
        <NuxtLink v-if="!user" to="/signup" @click="toggleMenu" class="mobile-nav-link">Signup</NuxtLink>
        <NuxtLink v-if="!user" to="/login" @click="toggleMenu" class="mobile-nav-link">Login</NuxtLink>
        <NuxtLink v-if="user"to="/" @click="logoutUserMobile" class="mobile-nav-link">Logout</NuxtLink>
        <NuxtLink to="/contact" @click="toggleMenu" class="mobile-nav-link">Contact</NuxtLink>
      </div>
    </nav>
  </header>
</template>



<script  setup>
const user = useStrapiUser()
const { logout } = useStrapiAuth()
const router = useRouter()


const logoutUser =  () => {
   logout();
 
   router.push('/')
}

const logoutUserMobile = () => {
  logout()
  toggleMenu()
  router.push('/')
}
  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    console.log('this is toggle')
    isMenuOpen.value = !isMenuOpen.value;
  }
</script>
<style scoped>
.overAll {
  z-index: 999999999999
}

.m-header-height {
  height: calc(100vh-75px)
}
.nav-link {
  @apply text-[#2C2C2C] hover:bg-purple-700 rounded px-4 py-2 transition-colors;
}

.mobile-nav-link {
  @apply text-black text-xl hover:bg-purple-100 rounded px-4 py-2 transition-colors;
}

.translate-x-0 {
  transform: translateX(0);
}

.translate-x-full {
  transform: translateX(100%);
}
</style>

