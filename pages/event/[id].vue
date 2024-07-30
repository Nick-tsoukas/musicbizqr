<template>
  <div>
   <div class="container mx-auto">
    <div v-if="eventData" class="">
      <img :src="eventData.image.data.attributes.url" class="object-fit  animate__animated animate__fadeIn " alt="">
    </div>
   </div>

   
 <div class="container mx-auto px-2 md:px-0" >
  <h2 class="text-3xl sm:text-3xl md:text-7xl font-bold text-black  my-6">{{ eventData.title }}</h2>
     
     <div class="container mr-auto pb-10"  >
      <p class="mt-0 mb-4 text-xl font-semibold md:text-4xl">Date & Time</p>
      <p class="text-lg md:text-2xl" >{{ eventData.date }}</p>
      <p class="text-lg mb-2 md:text-2xl" >{{ eventData.time }}</p>
       <p class="mt-0 mb-4 text-xl font-semibold  md:text-4xl ">Desciption</p>
       <p class="text-lg md:text-2xl">{{ eventData.description }}</p>
       <p class=" mb-4 text-xl font-semibold mt-4  md:text-4xl">Location</p>
       <p class="text-lg mt-4 md:text-2xl">{{eventData.venue}}</p>
       <p class="text-lg md:text-2xl">{{ eventData.address }}</p>
       <p class="text-lg md:text-2xl"> {{ eventData.city }}, {{ eventData.state }}</p>
       <button type="button" class="mdc-button my-4 w-full">Ticket Link</button>

     </div>
 </div>
  
     
  
  </div> 
</template>

<script  setup>
const route = useRoute();
const { findOne } = useStrapi();

const eventData = ref({})

try {
  const { data: event } = await findOne('events', route.params.id, {
    populate : {
      image: true
    }
  })
   eventData.value = event.attributes

} catch (error) {
  console.log(error)
}
 </script>

<style>
.img-height {
  height: calc(100vh - 90px);
  width: 100vw;
}

.detail-box {
  margin-top : -250px
}
</style>