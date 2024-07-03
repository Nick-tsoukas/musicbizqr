<template>
  <div class="max-w-sm rounded-lg overflow-hidden shadow-lg m-4 border border-gray-200">
    <img class="w-full h-48 object-cover" src="https://via.placeholder.com/300" alt="Card Image">
    <div class="p-4">
      <h2 class="font-bold text-xl mb-2">Card Title</h2>
      <p class="text-gray-700 text-base">This is supporting text. It provides additional information about the content of the card.</p>
    </div>
    <div class="px-4 py-2 flex justify-start space-x-2">
      <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Action 1</button>
      <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Action 2</button>
      <img src="edit-icon.svg" alt="">
      <img src="delete-icon.svg" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaterialCard'
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
