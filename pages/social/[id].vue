<template>
  <div v-if="socialPage" class="container max-w-5xl mx-auto">
    <!-- Image Section -->
    <div v-if="socialPage.attributes.img.data" class="relative h-64 md:h-96 rounded-lg overflow-hidden ">
      <img
        :src="socialPage.attributes.img.data.attributes.url"
        alt="Social Page Image"
        class="w-full h-full object-cover"
      />
     
    </div>
    <div class=" inset-0 flex items-end p-8 rounded-b-lg">
        <h1 class="text-4xl md:text-6xl text-white font-bold">{{ socialPage.attributes.title }}</h1>
      </div>
    <!-- Social Media Links Section -->
    <div class="px-10">
      <NuxtLink v-if="socialPage.attributes.facebook" class="flex gap-4 bg-gradient-to-r from-pink-500 to-violet-500 w-full mx-auto p-4 rounded-md shadow-lg mb-6">
        <img src="@/assets/facebook-icon-white.svg" class="h-6 w-6" alt="Facebook Logo">
        <p class="text-white">Facebook</p>
      </NuxtLink>

      <NuxtLink v-if="socialPage.attributes.snapchat" class="flex gap-4 bg-gradient-to-r from-pink-500 to-violet-500 w-full mx-auto p-4 rounded-md shadow-lg mb-6">
        <img src="@/assets/facebook-icon-white.svg" class="h-6 w-6" alt="Snapchat Logo">
        <p class="text-white">Snapchat</p>
      </NuxtLink>

      <NuxtLink v-if="socialPage.attributes.whatsapp" class="flex gap-4 bg-gradient-to-r from-pink-500 to-violet-500 w-full mx-auto p-4 rounded-md shadow-lg mb-6">
        <img src="@/assets/facebook-icon-white.svg" class="h-6 w-6" alt="WhatsApp Logo">
        <p class="text-white">WhatsApp</p>
      </NuxtLink>

      <NuxtLink v-if="socialPage.attributes.twitch" class="flex gap-4 bg-gradient-to-r from-pink-500 to-violet-500 w-full mx-auto p-4 rounded-md shadow-lg mb-6">
        <img src="@/assets/twitchlast.png" class="h-6 w-6" alt="Twitch Logo">
        <p class="text-white">Twitch</p>
      </NuxtLink>

      <NuxtLink v-if="socialPage.attributes.tictok" class="flex gap-4 bg-gradient-to-r from-pink-500 to-violet-500 w-full mx-auto p-4 rounded-md shadow-lg mb-6">
        <img src="@/assets/facebook-icon-white.svg" class="h-6 w-6" alt="TikTok Logo">
        <p class="text-white">TikTok</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { findOne } = useStrapi();
const route = useRoute();
const socialPage = ref(null);

const fetchSocialPage = async () => {
  const { data } = await findOne('socialpages', route.params.id, {
    populate: {
      img: true,
    },
  });
  socialPage.value = data;
  console.log(socialPage.value);
};

onMounted(() => {
  fetchSocialPage();
});
</script>

<style scoped>
.container {
  margin-top: 20px;
}

.bg-gradient-to-r {
  transition: all 0.3s ease;
}

.bg-gradient-to-r:hover {
  transform: translateY(-4px);
}
</style>
