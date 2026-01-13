<template>
  <DemoShell>
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
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDemoShow } from '@/composables/useDemoShow'

definePageMeta({
  layout: false,
})

const route = useRoute()
const { initFromQuery } = useDemoShow()

onMounted(() => {
  initFromQuery(route.query)
})
</script>
