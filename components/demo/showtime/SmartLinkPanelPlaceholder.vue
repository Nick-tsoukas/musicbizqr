<template>
  <div class="smart-link-panel w-full max-w-sm mx-auto">
    <!-- Hero Image Placeholder -->
    <div class="relative aspect-[4/3] rounded-t-2xl overflow-hidden bg-gradient-to-br from-purple-900/40 to-black">
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div class="absolute bottom-4 left-4">
        <h2 class="text-2xl font-bold text-white">Neon Avenue</h2>
        <p class="text-white/60 text-sm">Indie Pop</p>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-black/80 border border-white/10 rounded-b-2xl p-4 space-y-4">
      <!-- Bio -->
      <div>
        <p class="text-white/80 text-sm">Indie pop for night drives and neon signs.</p>
        <p class="text-purple-400 text-xs mt-1">New single out now — tap play below.</p>
      </div>

      <!-- Streaming -->
      <div>
        <h3 class="text-white/60 text-xs font-medium mb-2">Streaming</h3>
        <div class="flex gap-2">
          <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
            <span class="text-lg">🎵</span>
            <span class="text-white text-sm">Spotify</span>
          </div>
          <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
            <span class="text-lg">🍎</span>
            <span class="text-white text-sm">Apple</span>
          </div>
        </div>
      </div>

      <!-- Social -->
      <div>
        <h3 class="text-white/60 text-xs font-medium mb-2">Social</h3>
        <div class="flex gap-2">
          <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
            <span class="text-lg">📸</span>
            <span class="text-white text-sm">IG</span>
          </div>
          <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
            <span class="text-lg">🎵</span>
            <span class="text-white text-sm">TikTok</span>
          </div>
          <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
            <span class="text-lg">🐦</span>
            <span class="text-white text-sm">X</span>
          </div>
        </div>
      </div>

      <!-- Shows -->
      <div>
        <h3 class="text-white/60 text-xs font-medium mb-2">Upcoming Shows</h3>
        <div class="space-y-1.5">
          <div class="flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
            <div>
              <div class="text-white text-sm font-medium">Los Angeles, CA</div>
              <div class="text-white/50 text-xs">The Troubadour</div>
            </div>
            <span class="text-xs text-purple-400 px-2 py-1 bg-purple-500/20 rounded">Tickets</span>
          </div>
          <div class="flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
            <div>
              <div class="text-white text-sm font-medium">San Francisco, CA</div>
              <div class="text-white/50 text-xs">The Fillmore</div>
            </div>
            <span class="text-xs text-purple-400 px-2 py-1 bg-purple-500/20 rounded">Tickets</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Placeholder - will be swapped with real SmartLinkDemo component
</script>

<style scoped>
.smart-link-panel {
  box-shadow: 
    0 0 60px rgba(139, 92, 246, 0.1),
    0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
