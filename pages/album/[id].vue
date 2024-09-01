<template>
  <div class="container mx-auto my-10 min-h-screen">
    
    <div v-if="albumData" >
      <div v-if="albumData.attributes.cover" class="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
        <img
          :src="albumData.attributes.cover.data.attributes.url"
          alt="album cover Hero Image"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-b-lg">
          <h1 class="text-4xl md:text-6xl text-white font-bold">{{ albumData.attributes.title }}</h1>
        </div>
      </div>
    </div>
       <section v-if="albumData" class="w-full my-20">
          <AudioPlayer :album="albumData" class="w-full mx-auto" />
    </section>
  </div>
</template>

<script  setup>
const route = useRoute();
const { findOne } = useStrapi();

const albumData = ref(null)
onMounted(async () => {

  try {
    const { data: album } = await findOne('albums', route.params.id, {
      populate: {
        songs: {
         populate : {
          file: true
         }
        },
        cover: {
          populate: {
            image: true
          }
        }
      }
    });
    albumData.value = album;
  } catch (error) {
    console.error(error);
  }
});
</script>

<style>

</style>