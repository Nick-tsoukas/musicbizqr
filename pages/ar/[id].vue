<template>
  <div>
    <!-- Spinner until ready -->
    <div v-if="!ready" class="loading-container">
      <div class="spinner"></div>
    </div>

    <!-- AR Scene -->
    <div v-else>
      <!-- Hidden iframe for video template -->
      <div style="display: none;">
        <iframe
          id="youtubeFrame"
          :src="`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1`"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      </div>

      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: true;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true;"
        style="position: fixed; top:0; left:0; width:100%; height:100%;"
      >
        <a-marker preset="hiro" @markerFound="onMarkerFound" @markerLost="onMarkerLost">
          <!-- DEBUG: show which template is active -->
          <a-entity
            position="0 1 0"
            :text="`value: Template = ${template}; align: center; color: #FFF; width: 4`"
          />

          <!-- VIDEO -->
          <template v-if="template === 'video'">
            <a-entity
              html-shader="target: #youtubeFrame"
              geometry="primitive: plane; width: 1.6; height: 0.9"
              position="0 0.5 0"
              rotation="-90 0 0"
            />
          </template>

          <!-- SONG -->
          <template v-else-if="template === 'song'">
            <a-box
              position="0 0.5 0"
              rotation="0 45 0"
              depth="0.6"
              height="0.6"
              width="0.6"
              animation="property: rotation; to: 0 405 0; dur: 8000; loop: true"
            />
            <a-entity
              :sound="`src: url(${songUrl}); autoplay: true; loop: true; positional: true`"
            />
          </template>

          <!-- EVENT -->
          <template v-else-if="template === 'event'">
            <a-plane
              :src="eventPosterUrl"
              geometry="primitive: plane; width: 1; height: 1.4"
              position="0 0.7 0"
              rotation="-90 0 0"
            />
          </template>

          <!-- TEST fallback -->
          <template v-else-if="template === 'test'">
            <a-box
              position="0 0.5 0"
              rotation="0 45 0"
              material="color: #4CC3D9;"
              animation="property: rotation; to: 0 405 0; dur: 8000; loop: true"
            />
          </template>

          <!-- Visit Band Page -->
          <a-entity
            text="value: Visit Band Page; align: center; color: #FFF; width: 2"
            position="0 -0.3 0"
            rotation="-90 0 0"
            scale="1.5 1.5 1"
            @click="goToBand"
          />
        </a-marker>
        <a-entity camera />
      </a-scene>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route        = useRoute();
// match your filename [qrid].vue — read from params.qrid
const qrid         = String(route.params.qrid);
const template     = String(route.query.template || 'test');
const ready        = ref(false);

const videoId       = ref('dQw4w9WgXcQ');
const songUrl       = ref('');
const eventPosterUrl = ref('');
const bandSlug      = ref('');

// Marker events
function onMarkerFound() { console.debug('[AR PAGE] Marker found'); }
function onMarkerLost()  { console.warn('[AR PAGE] Marker lost'); }

// Navigate back to band page
function goToBand() {
  const url = `/${bandSlug.value}`;
  console.debug('[AR PAGE] goToBand →', url);
  window.location.href = url;
}

onMounted(async () => {
  console.debug('[AR PAGE] Mounted', { qrid, template });

  try {
    const resp: any = await $fetch(
      `https://qrserver-production.up.railway.app/api/qrs/${qrid}`,
      { method: 'GET', params: { populate: ['band'] } }
    );
    const attrs = resp.data.attributes;
    bandSlug.value = attrs.band?.data?.attributes?.slug || '';
    console.debug('[AR PAGE] bandSlug =', bandSlug.value);

    if (template === 'video') {
      videoId.value = attrs.videoId || videoId.value;
      console.debug('[AR PAGE] videoId =', videoId.value);
    } else if (template === 'song') {
      songUrl.value = attrs.songUrl || '';
      console.debug('[AR PAGE] songUrl =', songUrl.value);
    } else if (template === 'event') {
      eventPosterUrl.value = attrs.eventPosterUrl || '';
      console.debug('[AR PAGE] eventPosterUrl =', eventPosterUrl.value);
    }
  } catch (e) {
    console.error('[AR PAGE] Fetch error:', e);
  }

  setTimeout(() => {
    ready.value = true;
    console.debug('[AR PAGE] AR scene ready');
  }, 300);
});
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: #000; z-index: 9999;
}
.spinner {
  border: 8px solid #444;
  border-top: 8px solid #0f0;
  border-radius: 50%;
  width: 60px; height: 60px;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
