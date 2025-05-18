<template>
  <div v-if="ready">
    <a-scene
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false;"
      renderer="logarithmicDepthBuffer: true;"
      vr-mode-ui="enabled: false;"
      style="position: fixed; top:0; left:0; width:100%; height:100%;"
    >
      <!-- Use the default Hiro marker -->
      <a-marker preset="hiro">
        <!-- rotating cube -->
        <a-box
          position="0 0.5 0"
          depth="0.6"
          height="0.6"
          width="0.6"
          rotation="0 45 0"
        >
          <a-animation
            attribute="rotation"
            to="0 405 0"
            dur="8000"
            repeat="indefinite"
          ></a-animation>
        </a-box>
      </a-marker>

      <!-- camera fallback -->
      <a-entity camera></a-entity>
    </a-scene>
  </div>
  <div v-else class="p-4 text-center text-white bg-black">
    Loading AR…
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const ready = ref(false)
onMounted(() => {
  // small timeout so AR.js can hook into the DOM
  setTimeout(() => { ready.value = true }, 200)
})
</script>

<style scoped>
/* make sure background isn't white while you wait */
div { background: #000; color: #fff; height: 100vh; }
</style>
