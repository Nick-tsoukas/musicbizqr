<template>
   <NuxtLayout>
     <NuxtPage />
   </NuxtLayout>
 </template>

<script setup>
useHead({
  link: [
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'android-chrome', sizes: '512x512', href: '/android-chrome-512x512.png' },
    { rel: 'android-chrome', sizes: '192x192', href: '/android-chrome-192x192.png' }


    
  ]
})
</script>

