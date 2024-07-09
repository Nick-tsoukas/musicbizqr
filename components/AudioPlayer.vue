<template>
  <div class="list-container">
    <!-- album img and band title  -->
    <div class="min-h-36 bg-black w-full flex p-6 gap-5" >
      <div class="h-24 w-24 rounded-lg bg-slate-500"></div>
      <div>
        <p class="text-white font-semibild text-xl">Album Name</p>
        <p class="text-white text-lg">By Band Name</p>
      </div>
    </div>
    <!-- play bar -->
    <div class="flex bg-black items-center justify-end w-full min-h-10 px-6 gap-5 pb-4">
      
      <img src="@/assets/back-icon.svg" alt="">
      <img src="@/assets/skip-icon.svg" alt="">
      <img v-if="!playing" src="@/assets/play-icon.svg" alt="">
      <img v-if="playing" src="@/assets/pause-icon.svg" alt="">
    </div>
    <!-- list of songs -->
    <ul class="list w-full">
      <li v-for="song in songs" :key="song.id" class="flex w-full py-6 px-6 gap-2 ">
      <div>
        <img v-if="!playing" src="@/assets/play-black.svg" alt="">
        <img v-if="playing " src="@/assets/pause-black.svg" alt="">
  
      </div>
      <div class="grow">song name</div>
      <div>5:00</div>
      </li>
    </ul>
   
  </div>
</template>

<script setup>
// define props passes to audio player album with cover and song list 
 const props = defineProps({
 
})


const playing = ref(false)
</script>

<style scoped>
.list-container {
  @apply w-full max-w-md mx-auto my-4 bg-white shadow-md rounded-lg;
}

.list {
  @apply divide-y divide-gray-200;
}


</style>
