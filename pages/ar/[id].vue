<template>
  <div v-if="ready">
    <a-scene
      embedded
      arjs="sourceType: webcam; debugUIEnabled: true;"
      vr-mode-ui="enabled: false"
      style="position:fixed; top:0; left:0; width:100%; height:100%;"
    >
      <a-marker preset="hiro">
        <!-- dummy cube -->
        <a-box position="0 0.5 0" rotation="0 45 0" depth="0.6" height="0.6" width="0.6">
          <a-animation attribute="rotation" to="0 405 0" dur="8000" repeat="indefinite"/>
        </a-box>
      </a-marker>
      <a-entity camera/>
    </a-scene>
  </div>
  <div v-else class="loading-container">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const ready = ref(false);

onMounted(() => {
  console.debug('[AR PAGE] Mounted', {
    params: route.params,
    query: route.query
  });

  // sanity checks
  if (!route.params.id) {
    console.error('[AR PAGE] Missing route.params.id!');
  }
  if (!route.query.template) {
    console.error('[AR PAGE] Missing route.query.template!');
  }

  // delay so AR.js can bind
  setTimeout(() => {
    ready.value = true;
    console.debug('[AR PAGE] AR scene is now ready');
  }, 300);
});
</script>

<style scoped>
.loading-container { /* … same spinner CSS … */ }
.spinner { /* … */ }
</style>
