<script setup>
const props = defineProps({
  heading: { type: String, default: '🎥 Video Tutorials' },
  id: { type: String, default: 'videos' },
  videos: {
    type: Array,
    default: () => [],
  },
  gridClass: {
    type: String,
    default: 'grid grid-cols-1 md:grid-cols-2 gap-8',
  },
})
</script>

<template>
  <section :id="id" class="bg-black py-16">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-extrabold text-white mb-10 text-center">
        {{ heading }}
      </h2>

      <div :class="gridClass">
        <VideoCard
          v-for="(v, i) in videos"
          :key="v.id + '-' + i"
          :video-id="v.id"
          :title="v.title"
          :thumb="v.thumb"
        />
      </div>
    </div>
  </section>
</template>
