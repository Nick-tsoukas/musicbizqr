<template>
  <div>
<!-- header -->
<!-- <pre>{{ band }}</pre> -->
  <!-- <div class="bg-[#F5F5F5] text-[#2C2C2C] shadow-lg">
    <div class="container mx-auto flex items-center justify-between px-4 py-4">
      <div class="text-xl font-bold">{{ band.data.attributes.name }}</div>
      <nav class="hidden md:flex space-x-4">
        <NuxtLink to="/" class="nav-link">Bio</NuxtLink>
        <NuxtLink to="/events" class="nav-link">Events</NuxtLink>
        <NuxtLink to="/albums" class="nav-link">Albums</NuxtLink>
        <NuxtLink to="/merch" class="nav-link">Merch</NuxtLink>
        <NuxtLink to="/tours" class="nav-link">Tours</NuxtLink>
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
      class="fixed z-50 top-[75px] left-0 w-full h-[100vh] bg-white text-black transform transition-transform md:hidden"
      :class="{ 'translate-x-0': isMenuOpen, 'translate-x-full': !isMenuOpen }"
    >
      <div class="flex flex-col items-center space-y-4 py-4">
        <NuxtLink to="/" @click="toggleMenu" class="mobile-nav-link">Bio</NuxtLink>
        <NuxtLink to="/events" @click="toggleMenu" class="mobile-nav-link">Events</NuxtLink>
        <NuxtLink to="/albums" @click="toggleMenu" class="mobile-nav-link">Albums</NuxtLink>
        <NuxtLink to="/merch" @click="toggleMenu" class="mobile-nav-link">Merch</NuxtLink>
        <NuxtLink to="/tours" @click="toggleMenu" class="mobile-nav-link">Tours</NuxtLink>
      </div>
    </nav>
  </div> -->

    <!-- hero content  -->
    <div  v-if="band" class="hero  ">
      <img :src="band.data.attributes.bandImg.data.attributes.url" alt="Band Image" class="hero__image" />
      <div class="hero__content">
        <div class="hero__social">
          <ul>
            <li v-if="band.data.attributes.instagram">
              <a :href="band.data.attributes.instagram" target="_blank">
                <img src="@/assets/facebook-icon.svg" alt="Facebook" class="social-icon" />              </a>
            </li>
            <li v-if="band.data.attributes.facebook">
              <a :href="band.data.attributes.facebook" target="_blank">
                <img src="@/assets/facebook-icon.svg" alt="Facebook" class="social-icon" />
              </a>
            </li>
            <li v-if="band.data.attributes.twitch">
              <a :href="band.data.attributes.twitch" target="_blank">
                <img src="@/assets/facebook-icon.svg" alt="Facebook" class="social-icon" />              </a>
            </li>
            <li v-if="band.data.attributes.appleMusic">
              <a :href="band.data.attributes.appleMusic" target="_blank">
                <img src="@/assets/facebook-icon.svg" alt="Facebook" class="social-icon" />              </a>
            </li>
            <li v-if="band.data.attributes.soundcloud">
              <a :href="band.data.attributes.soundcloud" target="_blank">
                <img src="@/assets/facebook-icon.svg" alt="Facebook" class="social-icon" />              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
 
<!-- album page content -->
<main class="grid place-items-center min-h-screen background__gradient p-5 animate-slideinview">
  <div>
    <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-200 mb-5">Albums</h1>
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- CARD 1 -->
      <div v-for="album in albums" :key="album.id" class="bg-gray-900 shadow-lg rounded p-3">
     
        <div class="group relative">
          <img class="w-full md:w-72 block rounded" src="https://upload.wikimedia.org/wikipedia/en/f/f1/Tycho_-_Epoch.jpg" alt="" />
          <div class="absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 transition justify-evenly">
            <button class="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
              </svg>
            </button>

            <button class="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
              </svg>
            </button>

            <button class="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-5">
          <h3 class="text-white text-lg">{{album.attributes.title}}</h3>
      
        </div>
      </div>
      <!-- END OF CARD 1 -->

    
    </section>
  </div>
</main>

  </div>
</template>

<script setup>


const route = useRoute();
const { data: band } = useFetch(`http://localhost:1337/api/bands/${route.params.id}?populate=*`);

const albums = ref([]);

onMounted(async () => {
  const albumIds = band.value.data.attributes.albums.data.map(album => album.id);
  console.log(albumIds)
  const albumFetches = albumIds.map(id => $fetch(`http://localhost:1337/api/albums/${id}?populate=*`));
  const albumResponses = await Promise.all(albumFetches);
  console.log(albumFetches)
  albums.value = albumResponses.map(response => response.data);

});

</script>

<style scoped>
.background__gradient {
  background: linear-gradient(to top, rgba(51, 51, 51, 1) 0%, rgba(51, 51, 51, 1) 15%, rgba(51, 51, 51, .95) 35%, rgba(51, 51, 51, .7) 100%);
}
.hero {
  position: fixed;
  width: 100%;
  height: calc(100vh - 75px);
  overflow: hidden;
  z-index: -999;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__content {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 0;
  text-align: center;
}

.hero__social ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  margin: 0;
}

.hero__social li {
  margin: 0 10px;
}

.social-icon {
  width: 30px;
  height: 30px;
}
</style>
