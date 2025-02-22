<template>
  <div>
    <h1 class="text-white" >This is the ar page </h1>
    <!-- AR Scene using A-Frame and AR.js -->
    <a-scene embedded arjs="sourceType: webcam;">
      <!-- A marker (you can use the default 'hiro' marker) -->
      <a-marker type="pattern" url="/markers/pattern-marker.patt">
        <!-- The plane that will display the YouTube video using aframe-html-shader -->
        <a-entity
          position="0 0 0"
          geometry="primitive: plane; width: 4; height: 2"
          material="shader: html; target: #youtubeContent"
          animation="property: position; to: 0 1 -5; dur: 2000; easing: easeOutQuad">
        </a-entity>
      </a-marker>
      <!-- A basic camera -->
      <a-entity camera></a-entity>
    </a-scene>

    <!-- Hidden HTML element with the YouTube embed.
         This content will be rendered on the plane via the html shader -->
    <div id="youtubeContent" style="display: none;">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/L2IJzVAOvaU?autoplay=1"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
// No special script needed unless you plan to make this dynamic.
</script>

<style>
/* Optional styling */
a-scene {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
