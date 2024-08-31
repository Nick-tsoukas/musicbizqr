<template>
   <div class="bg-black"  >
      <Header/>
      <NuxtPage  />
   </div> 
</template>
<script setup>
provideHeadlessUseId(() => useId())
</script>