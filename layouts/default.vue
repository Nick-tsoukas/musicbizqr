<template>
    <div class="bg-black">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      </Head>
      <Header />
      <slot />
    </div>
  </template>
  
  <script setup>
  provideHeadlessUseId(() => useId());
  </script>