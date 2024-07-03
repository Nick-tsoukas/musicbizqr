<template>
  <div class="max-w-sm rounded-lg overflow-hidden shadow-lg m-4 border border-gray-200">
    <img class="w-full h-48 object-cover" :src="q_image" alt="Card Image">
    <div class="p-4">
      <h2 class="font-bold text-xl mb-2">{{name}}</h2>
      <p class="text-gray-700 text-base">{{ url }}</p>
    </div>
    <div class="px-4 py-2 flex w-full justify-start space-x-2">
      <button class="bg-blue-500 text-white font-bold py-2 px-4 mr-auto rounded hover:bg-blue-700">Download QR</button>
   
      <img src="@/assets/edit-icon.svg" alt="Edit Icon" class="icon ml-auto" />
      <img src="@/assets/delete-icon.svg" alt="Delete Icon" class="icon" />
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  name: {
    type: String,
    default: 'Default Title'
  },
  url: {
    type: String,
    default: ''
  },
  q_image: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  scanTime: {
    type: Array,
    default: () => []
  },
  link: {
    type: String,
    default: null
  }
})

</script>

<style scoped>
/* Additional custom styles if needed */
</style>
