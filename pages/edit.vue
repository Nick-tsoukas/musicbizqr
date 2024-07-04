<template>
  <div>
    <pre>{{ route.query }}</pre>
  </div>
</template>

<script setup>
const route = useRoute()
console.log(route.query)
</script>

<style>

</style>