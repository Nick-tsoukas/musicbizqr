<template>
  <div class="band-style-default w-full">
    <!-- Hero Image -->
    <div class="relative aspect-[16/9] rounded-t-xl overflow-hidden">
      <img 
        :src="neonPoster" 
        alt="Neon Avenue" 
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
    </div>

    <!-- Content -->
    <div class="bg-black border-x border-b border-white/10 rounded-b-xl p-5 space-y-6">
      <!-- Band Name & Bio -->
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white">Neon Avenue</h2>
        <p class="text-white/60 text-sm mt-2">Indie pop for night drives and neon signs.</p>
        <p class="text-purple-400 text-sm mt-1">New single out now — tap play below.</p>
      </div>

      <!-- Featured Song -->
      <div>
        <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Featured Song</h3>
        <div class="bg-white/5 border border-white/10 rounded-xl p-4">
          <div class="flex items-center gap-4">
            <div class="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <img :src="neonPoster" alt="Album art" class="w-full h-full object-cover" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-white font-semibold">Turns Me On</div>
              <div class="text-white/50 text-sm">New Single</div>
            </div>
            <button class="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 transition">
              <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Featured Video -->
      <div>
        <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Featured Video</h3>
        <div class="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
          <img :src="neonPoster" alt="Video thumbnail" class="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div class="absolute bottom-3 left-3">
            <div class="text-white font-semibold text-sm">Live at The Echo</div>
            <div class="text-white/60 text-xs">2:14 highlight</div>
          </div>
        </div>
      </div>

      <!-- Streaming Links -->
      <div>
        <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Streaming</h3>
        <div class="space-y-2">
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
            <img :src="spotifyIcon" alt="Spotify" class="w-6 h-6" />
            <span class="text-white font-medium">Spotify</span>
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
            <img :src="appleMusicIcon" alt="Apple Music" class="w-6 h-6" />
            <span class="text-white font-medium">Apple Music</span>
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
            <img :src="youtubeIcon" alt="YouTube" class="w-6 h-6" />
            <span class="text-white font-medium">YouTube</span>
          </button>
        </div>
      </div>

      <!-- Social Links -->
      <div>
        <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Social</h3>
        <div class="space-y-2">
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
            <img :src="instagramIcon" alt="Instagram" class="w-6 h-6" />
            <span class="text-white font-medium">Instagram</span>
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
            <img :src="tiktokIcon" alt="TikTok" class="w-6 h-6" />
            <span class="text-white font-medium">TikTok</span>
          </button>
        </div>
      </div>

      <!-- Upcoming Shows -->
      <div>
        <h3 class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Upcoming Shows</h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <div class="text-white font-medium">Los Angeles, CA</div>
              <div class="text-white/50 text-sm">The Troubadour • Feb 21</div>
            </div>
            <button class="px-3 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-200 text-sm font-medium">
              Tickets
            </button>
          </div>
          <div class="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <div class="text-white font-medium">San Francisco, CA</div>
              <div class="text-white/50 text-sm">The Fillmore • Mar 8</div>
            </div>
            <button class="px-3 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-200 text-sm font-medium">
              Tickets
            </button>
          </div>
        </div>
      </div>

      <!-- Tip Section -->
      <div class="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-violet-900/30 border border-purple-400/20 rounded-2xl p-5 relative overflow-hidden">
        <!-- Subtle glow effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/10 to-violet-500/5 pointer-events-none" />
        
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="text-white font-bold text-lg flex items-center gap-2">
                <span class="text-xl">💜</span>
                Tip the Band
              </div>
              <div class="text-white/50 text-sm mt-0.5">Support the tour • One-tap secure checkout</div>
            </div>
          </div>
          
          <!-- Tip Buttons Row -->
          <div class="grid grid-cols-3 gap-3">
            <button class="group relative px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10">
              <span class="text-lg">$5</span>
            </button>
            <button class="group relative px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10">
              <span class="text-lg">$10</span>
            </button>
            <button class="group relative px-4 py-3 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-400 hover:to-violet-400 border border-pink-400/30 rounded-xl text-white font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30">
              <span class="text-lg">$20</span>
              <span class="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full uppercase tracking-wide">Popular</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import neonPoster from '@/assets/neonposter.png'
import spotifyIcon from '@/assets/spotify.svg'
import appleMusicIcon from '@/assets/apple.svg'
import youtubeIcon from '@/assets/youtube-icon.svg'
import instagramIcon from '@/assets/instagramfree.png'
import tiktokIcon from '@/assets/tiktok.png'
</script>

<style scoped>
.band-style-default {
  box-shadow: 
    0 0 60px rgba(139, 92, 246, 0.1),
    0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
