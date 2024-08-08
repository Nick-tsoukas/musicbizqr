<template>
   <div>
      <Header/>
      <NuxtPage />
   </div> 
</template>
<script setup>
provideHeadlessUseId(() => useId())
</script>