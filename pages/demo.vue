<template>
  <!-- Showtime Mode -->
  <div v-if="demoMode === 'showtime'" class="min-h-screen bg-black">
    <!-- Showtime Header -->
    <header class="sticky top-0 z-50 h-14 border-b border-white/10 bg-black/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6">
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="text-purple-400 hover:text-purple-300 transition">
          <span class="font-semibold">MusicBizQR</span>
        </NuxtLink>
        <span class="text-white/60 text-sm">Showtime Demo</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="demoMode = 'story'"
          class="px-3 py-1.5 text-xs text-white/60 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition"
        >
          Exit Showtime
        </button>
      </div>
    </header>

    <!-- Showtime Stage -->
    <main class="p-4 lg:p-8">
      <DemoShowtimeStage :autoplay="autoplay" />
    </main>
  </div>

  <!-- Story/Explore Mode -->
  <DemoShell v-else>
    <template #header-extra>
      <button
        @click="demoMode = 'showtime'"
        class="px-3 py-1.5 text-xs bg-purple-600/20 text-purple-300 border border-purple-400/30 rounded-lg hover:bg-purple-600/30 transition flex items-center gap-1.5"
      >
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        Showtime
      </button>
    </template>
    <template #default="{ sceneKey }">
      <DemoScenesSceneSmartLinks v-if="sceneKey === 'smartlinks'" />
      <DemoScenesSceneMoments v-else-if="sceneKey === 'moments'" />
      <DemoScenesSceneProof v-else-if="sceneKey === 'proof'" />
      <DemoScenesSceneAgency v-else-if="sceneKey === 'agency'" />
      <DemoScenesSceneCTA v-else-if="sceneKey === 'cta'" />
    </template>
  </DemoShell>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDemoShow } from '@/composables/useDemoShow'

definePageMeta({
  layout: false,
})

const route = useRoute()
const { initFromQuery } = useDemoShow()

// Demo mode: 'story' | 'explore' | 'showtime' - initialize from query
const demoMode = ref(route.query.mode === 'showtime' ? 'showtime' : 'story')
const autoplay = computed(() => route.query.autoplay === '1' || route.query.autoplay === 'true')

// Watch for route changes
watch(() => route.query.mode, (newMode) => {
  if (newMode === 'showtime') {
    demoMode.value = 'showtime'
  }
})

onMounted(() => {
  if (route.query.mode !== 'showtime') {
    initFromQuery(route.query)
  }
})
</script>
