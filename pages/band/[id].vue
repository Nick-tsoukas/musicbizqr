<template>
  <div>
    <div v-if="band" class="hero">
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
  <!--
  Welcome to Tailwind Play, the official Tailwind CSS playground!

  Everything here works just like it does when you're running Tailwind locally
  with a real build pipeline. You can customize your config file, use features
  like `@apply`, or even add third-party plugins.

  Feel free to play with this example if you're just learning, or trash it and
  start from scratch if you know enough to be dangerous. Have fun!
-->

<!-- album grid -->
<!-- <div class="relative flex  flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
  <div class="max-w-screen-md mx-auto">
    <div class="grid grid-cols-3 gap-6">

      <div v-for="album in albums" :key="album.id" class="group pb-24 relative overflow-hidden">
        <img :src="album.attributes.cover.data.attributes.url"  alt="">
      </div>
   </div>
  </div>
  </div> -->

  <!-- audio player -->
<!-- component -->
<main class="grid place-items-center min-h-screen bg-gradient-to-t from-blue-200 to-indigo-900 p-5">
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
          <h3 class="text-white text-lg">Epoch</h3>
          <p class="text-gray-400">Tycho</p>
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
.hero {
  position: relative;
  width: 100%;
  height: calc(100vh - 75px);
  overflow: hidden;
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
