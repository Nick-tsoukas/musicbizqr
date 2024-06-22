<template>
  <div>
   <div  class="flex flex-col items-center justify-center  md:hidden">
      <NuxtImg class="w-[80vw] pb-16 pt-8" src="https://qrcode101.s3.us-east-1.amazonaws.com/qrcode_5d252a0d38.png" />
      <h2 class="pb-8 text-4xl	font-bold">Get Your Sound Out</h2>
      <p class="text-center text-xl w-[80vw]">
        Amplify your music's reach with our dynamic QR codes, designed specifically for the music industry. 
      </p>
  </div>
 <div class="flex justify-around w-[80vw] mx-auto mt-8">
  <nuxt-link to="/signup" class="btn text-center w-[40%] grow-1">
      Sign Up
  </nuxt-link>
  <nuxt-link to="/login" class="btn text-center w-[40%] grow-1">
      Login In
  </nuxt-link>
 </div>
  </div>
</template>


