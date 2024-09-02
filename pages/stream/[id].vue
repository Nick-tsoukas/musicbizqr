<template>
  <div v-if="stream" >
    <div  class="container mx-auto my-10">
      <div v-if="stream.attributes.img.data" class="relative w-full h-64 md:h-96  rounded-lg overflow-hidden mb-8">
        <img
          :src="stream.attributes.img.data.attributes.url"
          alt="Event Hero Image"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-b-lg">
          <h1 class="text-4xl md:text-6xl text-white font-bold">{{ stream.title }}</h1>
        </div>
      </div>
    </div>
    <div >
      <NuxtLink v-if="stream.attributes.applemusic" class="flex gap-4 bg-gradient-to-r from-pink-500 to-violet-500 w-[80vw] mx-auto p-4 rounded-md shadow-lg justify-center mb-6"  >
        <img src="@/assets/apple.svg" class="h-6 w-6" alt="">
         <p class="text-white " >Apple Music</p>
        <!-- <p class="text-white" >{{ stream.attributes.applemusic }}</p> -->
      </NuxtLink>
      <NuxtLink v-if="stream.attributes.applemusic" class="flex gap-4 bg-gradient-to-r from-pink-500 to-violet-500 w-[80vw] mx-auto p-4 rounded-md shadow-lg justify-center mb-6"  >
        <img src="@/assets/spot.svg" class="h-6 w-6" alt="">
        <p class="text-white">{{ stream.attributes.spotify }}</p>
      </NuxtLink>
      <NuxtLink v-if="stream.attributes.applemusic" class="flex gap-4 bg-gradient-to-r from-pink-500 to-violet-500 w-[80vw] mx-auto p-4 rounded-md shadow-lg justify-center mb-6"  >
        <img src="@/assets/ymusic.svg" class="h-6 w-6" alt="">
        <p class="text-white">{{ stream.attributes.youtubemusic }}</p>
      </NuxtLink>
      <div></div>
    </div>
  </div>
</template>

<script setup>
const { findOne } = useStrapi()
const route = useRoute();
const stream = ref(null)

const fetchData = async () => {
  const {data} = await findOne('streams', route.params.id, {
    populate: {
      img: true
    }
  })
   stream.value = await data
   console.log(stream.value)

}

onMounted(() => {
  fetchData()
});
</script>

<style>

</style>