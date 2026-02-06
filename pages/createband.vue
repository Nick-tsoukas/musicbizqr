<template>
  <div class="min-h-screen bg-black pt-[var(--header-height)]">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-4 text-center px-6">
        <div class="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <div>
          <p class="text-white font-semibold text-lg">{{ loadingMessage }}</p>
          <p class="text-white/50 text-sm mt-1">Please wait while we set everything up...</p>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="mb-10">
        <NuxtLink to="/dashboard" class="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm mb-4 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </NuxtLink>
        <h1 class="text-3xl md:text-4xl font-bold text-white">Create Band Profile</h1>
        <p class="text-white/60 mt-2">Set up your band's presence and start connecting with fans</p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Page Style Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-indigo-500 to-purple-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Page Style</h2>
              <p class="form-section-subtitle">Choose how your band page looks to fans</p>
            </div>
          </div>

          <div class="form-section-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Classic Style -->
              <div 
                class="relative p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="pageStyle === 'default' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'"
                @click="pageStyle = 'default'"
              >
                <div class="flex items-start gap-3">
                  <div 
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                    :class="pageStyle === 'default' ? 'border-purple-500 bg-purple-500' : 'border-white/30'"
                  >
                    <svg v-if="pageStyle === 'default'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-white font-semibold">Classic</div>
                    <p class="text-white/50 text-sm mt-1">Full-width sections with detailed layouts for streaming, social, and events.</p>
                  </div>
                </div>
                <button 
                  type="button"
                  @click.stop="openStylePreview('default')"
                  class="mt-3 w-full py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
              </div>

              <!-- Cybered Style -->
              <div 
                class="relative p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="pageStyle === 'smartlink' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'"
                @click="pageStyle = 'smartlink'"
              >
                <div class="flex items-start gap-3">
                  <div 
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                    :class="pageStyle === 'smartlink' ? 'border-purple-500 bg-purple-500' : 'border-white/30'"
                  >
                    <svg v-if="pageStyle === 'smartlink'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-white font-semibold flex items-center gap-2">
                      Cybered
                      <span class="px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-[10px] font-bold uppercase">New</span>
                    </div>
                    <p class="text-white/50 text-sm mt-1">Smart Link style with Live Surface features, responsive hero, and integrated band content.</p>
                  </div>
                </div>
                <button 
                  type="button"
                  @click.stop="openStylePreview('smartlink')"
                  class="mt-3 w-full py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
              </div>

            </div>
          </div>
        </section>

        <!-- Band Details Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-purple-500 to-violet-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Band Details</h2>
              <p class="form-section-subtitle">Basic information about your band</p>
            </div>
          </div>

          <div class="form-section-content">
            <!-- Band Name -->
            <div class="form-field">
              <label for="band-name" class="form-label">Band Name <span class="text-red-400">*</span></label>
              <input
                type="text"
                id="band-name"
                v-model="bandName"
                class="form-input"
                placeholder="Enter your band name"
                required
              />
            </div>

            <!-- Band name in logo toggle -->
            <label for="isBandNameInLogo" class="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/[0.07] transition group">
              <div class="relative">
                <input
                  id="isBandNameInLogo"
                  type="checkbox"
                  v-model="isBandNameInLogo"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-purple-600 peer-focus:ring-2 peer-focus:ring-purple-500/50 transition-colors"></div>
                <div class="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
              </div>
              <div>
                <div class="text-white font-medium">Band name is in logo</div>
                <div class="text-white/50 text-sm">Hide the text name if your logo already includes it</div>
              </div>
            </label>

            <!-- Genre -->
            <div class="form-field">
              <label for="genre" class="form-label">Genre</label>
              <input
                type="text"
                id="genre"
                v-model="genre"
                class="form-input"
                placeholder="e.g. Rock, Jazz, Electronic"
              />
            </div>

            <!-- Bio -->
            <div class="form-field">
              <label for="bio" class="form-label">Bio / Description <span class="text-red-400">*</span></label>
              <textarea
                id="bio"
                v-model="bio"
                class="form-input form-textarea"
                placeholder="Tell fans about your band..."
                maxlength="247"
                rows="4"
                required
              ></textarea>
              <div class="flex justify-end mt-2">
                <span 
                  class="text-sm"
                  :class="bio.length > max ? 'text-red-400' : 'text-white/40'"
                >
                  {{ bio.length }} / {{ max }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Band Image Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-pink-500 to-rose-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Band Image</h2>
              <p class="form-section-subtitle">Upload your band photo or logo</p>
            </div>
          </div>

          <div class="form-section-content">
            <div v-if="bandImgUrl" class="mb-6">
              <div class="relative inline-block">
                <img
                  :src="bandImgUrl"
                  alt="Band Image"
                  class="max-h-64 w-auto rounded-xl border border-white/10 shadow-lg"
                />
                <button
                  type="button"
                  @click="removeBandImage"
                  class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <label
              for="band-img"
              class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition group"
            >
              <svg class="w-10 h-10 text-white/30 group-hover:text-purple-400 transition mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span class="text-white/50 group-hover:text-white/70 transition">Click to upload image</span>
              <span class="text-white/30 text-sm mt-1">PNG, JPG up to 10MB</span>
              <input
                type="file"
                id="band-img"
                class="hidden"
                @change="handleImageUpload"
                accept="image/*"
              />
            </label>
          </div>
        </section>

        <!-- Featured Song Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-orange-500 to-amber-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Featured Song</h2>
              <p class="form-section-subtitle">Showcase a track on your profile</p>
            </div>
          </div>

          <div class="form-section-content">
            <!-- Toggle: Upload vs Embed -->
            <div class="flex gap-4 mb-6">
              <button 
                type="button"
                @click="singlesongType = 'upload'"
                class="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition"
                :class="singlesongType === 'upload' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/[0.07]'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span class="font-medium">Upload File</span>
              </button>
              <button 
                type="button"
                @click="singlesongType = 'embed'"
                class="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition"
                :class="singlesongType === 'embed' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/[0.07]'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span class="font-medium">Embed Code</span>
              </button>
            </div>

            <!-- Song Title (only for upload mode - embeds have title built in) -->
            <div v-if="singlesongType === 'upload'" class="form-field">
              <label for="singlesong-title" class="form-label">Song Title</label>
              <input
                type="text"
                id="singlesong-title"
                v-model="singlesongTitle"
                class="form-input"
                placeholder="Enter song title"
              />
            </div>

            <!-- Upload Mode -->
            <div v-if="singlesongType === 'upload'" class="space-y-4">
              <div v-if="singlesongFile" class="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <span class="text-white truncate">{{ singlesongFile.name }}</span>
                </div>
                <button
                  type="button"
                  @click="removeSingleSong"
                  class="text-red-400 hover:text-red-300 transition"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <label
                v-else
                for="singlesong-file"
                class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition group"
              >
                <svg class="w-8 h-8 text-white/30 group-hover:text-purple-400 transition mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span class="text-white/50 group-hover:text-white/70 transition">Click to upload audio file</span>
                <span class="text-white/30 text-sm mt-1">MP3, WAV, OGG supported</span>
                <input
                  type="file"
                  id="singlesong-file"
                  class="hidden"
                  @change="handleSingleSongUpload"
                  accept="audio/*"
                  :key="songInputKey"
                />
              </label>
            </div>

            <!-- Embed Mode -->
            <div v-if="singlesongType === 'embed'" class="space-y-4">
              <!-- Platform Selector -->
              <div class="form-field">
                <label for="singlesong-platform" class="form-label">Platform</label>
                <div class="relative">
                  <select
                    id="singlesong-platform"
                    v-model="singlesongPlatform"
                    class="w-full px-4 py-3 pr-10 rounded-xl bg-[#1a1a2e] border border-white/10 text-white appearance-none cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition duration-200"
                  >
                    <option value="" class="bg-[#1a1a2e] text-white/50">Select platform...</option>
                    <option value="spotify" class="bg-[#1a1a2e] text-white">🎵 Spotify</option>
                    <option value="appleMusic" class="bg-[#1a1a2e] text-white">🍎 Apple Music</option>
                    <option value="youtube" class="bg-[#1a1a2e] text-white">▶️ YouTube</option>
                    <option value="soundcloud" class="bg-[#1a1a2e] text-white">☁️ SoundCloud</option>
                    <option value="bandcamp" class="bg-[#1a1a2e] text-white">🎸 Bandcamp</option>
                    <option value="deezer" class="bg-[#1a1a2e] text-white">🎧 Deezer</option>
                    <option value="mixcloud" class="bg-[#1a1a2e] text-white">🎚️ Mixcloud</option>
                    <option value="audiomack" class="bg-[#1a1a2e] text-white">🔊 Audiomack</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Spotify Elite Flow -->
              <div v-if="singlesongPlatform === 'spotify'" class="space-y-4">
                <div class="form-field">
                  <label for="spotify-url" class="form-label">Spotify Link</label>
                  <p class="text-white/50 text-xs mb-2">Paste a track, album, playlist, or artist URL</p>
                  <div class="relative">
                    <input
                      id="spotify-url"
                      type="text"
                      v-model="spotifyUrlInput"
                      class="form-input w-full pr-10"
                      placeholder="https://open.spotify.com/track/..."
                    />
                    <div v-if="spotifyOembedLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
                      <div class="w-5 h-5 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>

                <!-- Spotify oEmbed Error -->
                <div v-if="spotifyOembedError" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {{ spotifyOembedError }}
                </div>

                <!-- Spotify Preview -->
                <div v-if="spotifyOembedData" class="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <div class="p-4 border-b border-white/10">
                    <div class="flex items-center gap-2 text-green-400 text-xs font-medium mb-2">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      <span class="uppercase tracking-wider">{{ spotifyOembedData.type }}</span>
                    </div>
                    <h4 class="text-white font-semibold">{{ spotifyOembedData.title }}</h4>
                  </div>
                  <div class="flex">
                    <img
                      v-if="spotifyOembedData.thumbnailUrl"
                      :src="spotifyOembedData.thumbnailUrl"
                      :alt="spotifyOembedData.title"
                      class="w-24 h-24 object-cover"
                    />
                    <div class="flex-1 p-4 flex items-center">
                      <span class="text-green-400 text-sm">✓ Ready to save</span>
                    </div>
                  </div>
                </div>

                <!-- Clear Spotify -->
                <button
                  v-if="spotifyOembedData || spotifyUrlInput"
                  type="button"
                  @click="clearSpotifyEmbed"
                  class="text-red-400 hover:text-red-300 text-sm transition"
                >
                  Clear Spotify embed
                </button>
              </div>

              <!-- Non-Spotify: Legacy iframe paste -->
              <div v-else-if="singlesongPlatform && singlesongPlatform !== 'spotify'" class="space-y-4">
                <div class="form-field">
                  <label for="singlesong-embedhtml" class="form-label">Embed Code</label>
                  <p class="text-white/50 text-xs mb-2">Paste the iframe embed code from {{ singlesongPlatform }}</p>
                  <textarea
                    id="singlesong-embedhtml"
                    v-model="singlesongEmbedHtml"
                    class="form-input form-textarea font-mono text-sm"
                    rows="5"
                    placeholder="Paste your iframe embed code here..."
                  ></textarea>
                </div>
                <button
                  v-if="singlesongEmbedHtml"
                  type="button"
                  @click="removeEmbedSong"
                  class="text-red-400 hover:text-red-300 text-sm transition"
                >
                  Clear embed code
                </button>
              </div>

              <!-- No platform selected hint -->
              <div v-else class="p-4 rounded-xl border border-white/10 bg-white/5 text-white/50 text-sm text-center">
                Select a platform above to add an embedded player
              </div>
            </div>
          </div>
        </section>

        <!-- Featured Video Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-red-500 to-rose-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Featured Video</h2>
              <p class="form-section-subtitle">Add a YouTube video to your profile</p>
            </div>
          </div>

          <div class="form-section-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-field">
                <label for="singlevideo-title" class="form-label">Video Title</label>
                <input
                  id="singlevideo-title"
                  v-model="singlevideoTitle"
                  type="text"
                  class="form-input"
                  placeholder="Enter video title"
                />
              </div>
              <div class="form-field">
                <label for="singlevideo-youtube" class="form-label">YouTube Video ID</label>
                <input
                  id="singlevideo-youtube"
                  v-model="singlevideoYoutubeUrl"
                  type="text"
                  class="form-input"
                  placeholder="e.g. dQw4w9WgXcQ"
                />
              </div>
            </div>
            <button
              v-if="singlevideoTitle || singlevideoYoutubeUrl"
              type="button"
              @click="clearSingleVideo"
              class="text-red-400 hover:text-red-300 text-sm transition mt-4"
            >
              Remove video
            </button>
          </div>
        </section>

        <!-- Streaming Links Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-green-500 to-emerald-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Streaming Links</h2>
              <p class="form-section-subtitle">Where fans can stream your music</p>
            </div>
          </div>

          <div class="form-section-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="stream in Object.keys(streaming)" :key="stream" class="form-field">
                <label :for="stream" class="form-label capitalize">{{ stream }}</label>
                <input
                  :id="stream"
                  type="text"
                  v-model="streaming[stream]"
                  class="form-input"
                  placeholder="Paste your link here"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Social Media Links Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-pink-500 to-purple-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Social Media</h2>
              <p class="form-section-subtitle">Connect your social profiles</p>
            </div>
          </div>

          <div class="form-section-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="net in Object.keys(social)" :key="net" class="form-field">
                <label :for="net" class="form-label capitalize">{{ net }}</label>
                <input
                  :id="net"
                  type="text"
                  v-model="social[net]"
                  class="form-input"
                  :placeholder="`https://${net}.com/...`"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Event Hubs Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-orange-500 to-red-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Event Hubs</h2>
              <p class="form-section-subtitle">Connect your concert discovery profiles</p>
            </div>
          </div>

          <div class="form-section-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="hub in Object.keys(eventHubs)" :key="hub" class="form-field">
                <label :for="hub" class="form-label capitalize">{{ hub }}</label>
                <input
                  :id="hub"
                  type="text"
                  v-model="eventHubs[hub]"
                  class="form-input"
                  :placeholder="`https://${hub}.com/...`"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Contact / Booking Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-amber-500 to-yellow-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Contact / Booking</h2>
              <p class="form-section-subtitle">How industry & fans can reach you</p>
            </div>
          </div>

          <div class="form-section-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-field">
                <label for="bookingEmail" class="form-label">Booking Email</label>
                <input
                  id="bookingEmail"
                  type="email"
                  v-model="contacts.bookingEmail"
                  class="form-input"
                  placeholder="booking@yourband.com"
                />
              </div>
              <div class="form-field">
                <label for="managementEmail" class="form-label">Management Email</label>
                <input
                  id="managementEmail"
                  type="email"
                  v-model="contacts.managementEmail"
                  class="form-input"
                  placeholder="management@yourband.com"
                />
              </div>
              <div class="form-field">
                <label for="pressEmail" class="form-label">Press / Media Email</label>
                <input
                  id="pressEmail"
                  type="email"
                  v-model="contacts.pressEmail"
                  class="form-input"
                  placeholder="press@yourband.com"
                />
              </div>
              <div class="form-field">
                <label for="bookingAgent" class="form-label">Booking Agent / Agency</label>
                <input
                  id="bookingAgent"
                  type="text"
                  v-model="contacts.bookingAgent"
                  class="form-input"
                  placeholder="Agent name or agency"
                />
              </div>
              <div class="form-field">
                <label for="labelName" class="form-label">Record Label Name</label>
                <input
                  id="labelName"
                  type="text"
                  v-model="contacts.labelName"
                  class="form-input"
                  placeholder="e.g. Atlantic Records"
                />
              </div>
              <div class="form-field">
                <label for="labelUrl" class="form-label">Record Label Website</label>
                <input
                  id="labelUrl"
                  type="url"
                  v-model="contacts.labelUrl"
                  class="form-input"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Website Link Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-blue-500 to-cyan-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Website</h2>
              <p class="form-section-subtitle">Link to your official website</p>
            </div>
          </div>

          <div class="form-section-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-field">
                <label for="websitelink" class="form-label">Website URL</label>
                <input
                  type="text"
                  id="websitelink"
                  v-model="websitelink"
                  class="form-input"
                  placeholder="https://yourbandsite.com"
                />
              </div>
              <div class="form-field">
                <label for="websitelinktext" class="form-label">Display Text</label>
                <input
                  type="text"
                  id="websitelinktext"
                  v-model="websitelinktext"
                  class="form-input"
                  placeholder="Visit our website"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Support Buttons Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-emerald-500 to-teal-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Support Buttons</h2>
              <p class="form-section-subtitle">Let fans support you financially</p>
            </div>
          </div>

          <div class="form-section-content">
            <div class="space-y-3">
              <div
                v-for="btn in paymentButtons"
                :key="btn.key"
                class="p-4 rounded-xl border transition"
                :class="btn.enabled ? 'border-purple-500/40 bg-purple-500/10' : 'border-white/10 bg-white/5'"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <div class="text-white font-medium">{{ btn.title }}</div>
                    <div v-if="btn.description" class="text-white/50 text-sm mt-1">
                      {{ btn.description }}
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      :id="`paybtn-${btn.key}`"
                      type="checkbox"
                      v-model="btn.enabled"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-purple-600 transition-colors"></div>
                    <div class="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>

                <div v-if="btn.enabled" class="mt-4 flex items-center gap-3">
                  <span class="text-white/60">Min $</span>
                  <input
                    v-model.number="btn.minAmount"
                    type="number"
                    step="1"
                    min="0"
                    class="w-24 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Submit Button -->
        <div class="pt-6 pb-10">
          <button 
            type="submit" 
            class="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-lg shadow-lg shadow-purple-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
            <span v-else>Create Band Profile</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Style Preview Modal -->
    <BandPageStylePreview 
      :is-open="showStylePreview" 
      :preview-style="previewingStyle" 
      @close="closeStylePreview" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BandPageStylePreview from '@/components/band/BandPageStylePreview.vue';
import { useRouter, useRoute } from "vue-router";
import {
  useStrapiClient,
  useStrapiUser,
  useStrapiToken,
  useRuntimeConfig,
} from "#imports";

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const client = useStrapiClient();
const user = useStrapiUser();
const token = useStrapiToken();

const loading = ref(false);
const loadingMessage = ref('Creating your band...');
const isBandNameInLogo = ref(false);

// Page style
const pageStyle = ref('default'); // 'default' | 'compact'
const showStylePreview = ref(false);
const previewingStyle = ref('default');

function openStylePreview(style) {
  previewingStyle.value = style;
  showStylePreview.value = true;
}

function closeStylePreview() {
  showStylePreview.value = false;
}

// Band basics
const bandName = ref("");
const genre = ref("");
const bio = ref("");
const bandImg = ref(null);
const bandImgUrl = ref(null);
const websitelink = ref("");
const websitelinktext = ref("");
const max = 247;

const bandImgInput = ref(null);
const singleSongInput = ref(null);

// KEY to reset the file input
const songInputKey = ref(0);

// Remove band image
function removeBandImage() {
  bandImg.value = null;
  bandImgUrl.value = null;
}

// Remove uploaded song
function removeSingleSong() {

  singlesongFileName.value = "";
  singlesongTitle.value = "";
  singlesongEmbedHtml.value = "";
  singlesongFile.value = null;
  songInputKey.value++; // reset <input type="file">
}

// Remove embed song
function removeEmbedSong() {
  singlesongEmbedHtml.value = "";
  singlesongTitle.value = "";
}


function clearBandImage() {
  bandImg.value = null;
  bandImgUrl.value = null;
  if (bandImgInput.value) {
    bandImgInput.value.value = "";
  }
}

function clearSingleSong() {
  singlesongTitle.value = "";
  singlesongType.value = "upload";
  singlesongFile.value = null;
  singlesongFileName.value = "";
  singlesongEmbedHtml.value = "";
  if (singleSongInput.value) {
    singleSongInput.value.value = "";
  }
}

function clearSingleVideo() {
  singlevideoTitle.value = "";
  singlevideoYoutubeUrl.value = "";
}

// Members
const members = ref([
  { name: "", instrument: "", image: null, imageUrl: null },
]);
function addMember() {
  members.value.push({ name: "", instrument: "", image: null, imageUrl: null });
}
function removeMember(idx) {
  members.value.splice(idx, 1);
}
function handleMemberImageUpload(e, idx) {
  const f = e.target.files[0];
  members.value[idx].image = f;
  members.value[idx].imageUrl = URL.createObjectURL(f);
}

// Social + Streaming + Event Hubs
const social = ref({
  facebook: "",
  instagram: "",
  twitter: "",
  tiktok: "",
  threads: "",
  discord: "",
  telegram: "",
  reddit: "",
  pinterest: "",
  linkedin: "",
  whatsapp: "",
  snapchat: "",
  patreon: "",
});
const streaming = ref({
  youtube: "",
  youtubeMusic: "",
  spotify: "",
  appleMusic: "",
  amazonMusic: "",
  tidal: "",
  pandora: "",
  soundcloud: "",
  audiomack: "",
  bandcamp: "",
  deezer: "",
  mixcloud: "",
  beatport: "",
  napster: "",
  twitch: "",
  vimeo: "",
  kick: "",
  reverbnation: "",
});
const eventHubs = ref({
  bandsintown: "",
  songkick: "",
  jambase: "",
  relix: "",
});

// Contact / Booking
const contacts = ref({
  bookingEmail: "",
  managementEmail: "",
  pressEmail: "",
  bookingAgent: "",
  labelUrl: "",
  labelName: "",
});

// Featured song/video
const singlesongType = ref("upload"); // 'upload' | 'embed'
const singlesongTitle = ref("");
const singlesongFile = ref(null);
const singlesongFileName = ref("");
const singlesongEmbedHtml = ref(""); // raw iframe paste
const singlesongPlatform = ref(""); // platform selector

// Spotify oEmbed state
const spotifyUrlInput = ref("");
const spotifyOembedLoading = ref(false);
const spotifyOembedError = ref("");
const spotifyOembedData = ref(null); // { spotifyUrl, type, title, thumbnailUrl, html }

// Auto-fetch debounce timer
let spotifyFetchTimeout = null;

// Check if URL looks like a valid Spotify URL
function isValidSpotifyUrl(url) {
  if (!url) return false;
  return url.startsWith('https://open.spotify.com/') && 
    (url.includes('/track/') || url.includes('/album/') || url.includes('/playlist/') || url.includes('/artist/'));
}

// Watch for Spotify URL changes and auto-fetch
watch(spotifyUrlInput, (newUrl) => {
  // Clear any pending fetch
  if (spotifyFetchTimeout) {
    clearTimeout(spotifyFetchTimeout);
    spotifyFetchTimeout = null;
  }
  
  // Clear previous data/error when URL changes
  spotifyOembedError.value = "";
  
  // If URL is valid, auto-fetch after a short delay
  if (isValidSpotifyUrl(newUrl)) {
    spotifyFetchTimeout = setTimeout(() => {
      fetchSpotifyOembed();
    }, 500); // 500ms debounce
  }
});

async function fetchSpotifyOembed() {
  if (!spotifyUrlInput.value) return;
  if (!isValidSpotifyUrl(spotifyUrlInput.value)) {
    spotifyOembedError.value = "Please enter a valid Spotify URL";
    return;
  }
  
  spotifyOembedLoading.value = true;
  spotifyOembedError.value = "";
  spotifyOembedData.value = null;
  
  try {
    const res = await $fetch(`/api/spotify/oembed`, {
      query: { url: spotifyUrlInput.value }
    });
    
    if (res.ok) {
      spotifyOembedData.value = res;
      // Auto-fill title if empty
      if (!singlesongTitle.value && res.title) {
        singlesongTitle.value = res.title;
      }
    } else {
      spotifyOembedError.value = "Failed to fetch Spotify data";
    }
  } catch (err) {
    spotifyOembedError.value = err.data?.message || err.message || "Failed to fetch Spotify data";
  } finally {
    spotifyOembedLoading.value = false;
  }
}

function clearSpotifyEmbed() {
  spotifyUrlInput.value = "";
  spotifyOembedData.value = null;
  spotifyOembedError.value = "";
}

const singlevideoYoutubeUrl = ref("");
const singlevideoTitle = ref("");

const paymentButtons = ref([
  {
    key: "pay_entry",
    title: "Pay Entry",
    description: "Door entry for tonight’s show",
    enabled: false,
    minAmount: 5,
  },
  {
    key: "tip_band",
    title: "Tip the Band",
    description: "Thanks for the support ❤️",
    enabled: false,
    minAmount: 5,
  },
  {
    key: "pay_merch",
    title: "Pay for Merch",
    description: "Shirts, posters, vinyl, etc.",
    enabled: false,
    minAmount: 5,
  },
  {
    key: "support_band",
    title: "Support the Band",
    description: "Help us keep making music",
    enabled: false,
    minAmount: 5,
  },
  {
    key: "help_get_home",
    title: "Help Us Get Home",
    description: "Gas, food, and late nights on the road",
    enabled: false,
    minAmount: 5,
  },
  {
    key: "after_show_support",
    title: "After-Show Support",
    description: "Thanks for coming out tonight ❤️",
    enabled: false,
    minAmount: 5,
  },
]);

// Helpers
function normalizeLink(link) {
  if (!link) return "";
  if (/^https?:\/\//i.test(link)) return link.trim();
  if (/^www\./i.test(link)) return `https://${link.trim()}`;
  return `https://www.${link.trim()}`;
}

function handleImageUpload(e) {
  bandImg.value = e.target.files[0];
  bandImgUrl.value = URL.createObjectURL(bandImg.value);
}
function handleSingleSongUpload(e) {
  const f = e.target.files[0];
  singlesongFile.value = f;
  singlesongFileName.value = f?.name || "";
}

// Optional: preload user bands
onMounted(async () => {
  try {
    await client("/bands", {
      params: {
        filters: { users_permissions_user: { id: user.value.id } },
        populate: ["users_permissions_user"],
      },
    });
  } catch (e) {
    console.error(e);
  }
});

async function submitForm() {
  loading.value = true;
  loadingMessage.value = 'Creating your band...';
  try {
    // Validate embed mode: require a real iframe
    if (singlesongType.value === "embed" && singlesongEmbedHtml.value.trim()) {
      const looksLikeIframe = /<iframe[\s\S]*<\/iframe>/i.test(
        singlesongEmbedHtml.value
      );
      if (!looksLikeIframe) {
        alert("Please paste a full <iframe> embed code for the embedded song.");
        loading.value = false;
        return;
      }
    }

    // 1) Build JSON payload
    const payload = {
      name: bandName.value,
      isBandNameInLogo: isBandNameInLogo.value,
      pageStyle: pageStyle.value,
      genre: genre.value,
      bio: bio.value,
      websitelink: normalizeLink(websitelink.value) || null,
      websitelinktext: websitelinktext.value || null,
      users_permissions_user: user.value.id,
      paymentButtons: paymentButtons.value.map((b) => ({
        key: b.key,
        enabled: b.enabled === true,
        pricingMode: "min",
        minAmount: Number(b.minAmount || 5),
      })),

      // members
      members: members.value.map((m) => ({
        name: m.name,
        instrument: m.instrument,
      })),

      // social (normalized)
      ...Object.fromEntries(
        Object.entries(social.value).map(([key, val]) => [
          key,
          normalizeLink(val),
        ])
      ),

      // streaming (normalized)
      ...Object.fromEntries(
        Object.entries(streaming.value).map(([key, val]) => [
          key,
          normalizeLink(val),
        ])
      ),

      // event hubs (normalized)
      ...Object.fromEntries(
        Object.entries(eventHubs.value).map(([key, val]) => [
          key,
          normalizeLink(val),
        ])
      ),

      // contact / booking
      bookingEmail: contacts.value.bookingEmail?.trim() || "",
      managementEmail: contacts.value.managementEmail?.trim() || "",
      pressEmail: contacts.value.pressEmail?.trim() || "",
      bookingAgent: contacts.value.bookingAgent?.trim() || "",
      labelUrl: contacts.value.labelUrl?.trim() || "",
      labelName: contacts.value.labelName?.trim() || "",

      // featured song — embedHtml OR upload OR Spotify oEmbed
      singlesong: (() => {
        const isEmbed = singlesongType.value === "embed";
        const isSpotify = isEmbed && singlesongPlatform.value === "spotify";
        return {
          title: singlesongTitle.value || "",
          isEmbed,
          platform: isEmbed ? singlesongPlatform.value || null : null,
          // For non-Spotify embeds, use embedHtml
          embedHtml: isEmbed && !isSpotify ? (singlesongEmbedHtml.value || "").trim() : null,
          // For Spotify, use oEmbed data
          spotifyUrl: isSpotify && spotifyOembedData.value ? spotifyOembedData.value.spotifyUrl : null,
          spotifyOembedTitle: isSpotify && spotifyOembedData.value ? spotifyOembedData.value.title : null,
          spotifyOembedThumbnailUrl: isSpotify && spotifyOembedData.value ? spotifyOembedData.value.thumbnailUrl : null,
          spotifyOembedType: isSpotify && spotifyOembedData.value ? spotifyOembedData.value.type : null,
          spotifyOembedHtml: isSpotify && spotifyOembedData.value ? spotifyOembedData.value.html : null,
        };
      })(),

      // featured video
      singlevideo: {
        youtubeid: singlevideoYoutubeUrl.value || "",
        title: singlevideoTitle.value || "",
      },
    };

    // 2) Wrap in FormData for file uploads
    const fd = new FormData();
    fd.append("data", JSON.stringify(payload));

    if (bandImg.value) {
      fd.append("files.bandImg", bandImg.value);
    }
    members.value.forEach((m, i) => {
      if (m.image) {
        fd.append(`files.members.${i}.image`, m.image);
      }
    });
    if (singlesongType.value === "upload" && singlesongFile.value) {
      fd.append("files.singlesong.song", singlesongFile.value);
    }

    // 3) Create band
    const res = await fetch(`${config.public.strapiUrl}/api/bands`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
      body: fd,
    });
    const json = await res.json();
    if (!res.ok) throw json;

    // 4) Redirect - keep loading true until navigation completes
    loadingMessage.value = 'Band created! Redirecting...';
    const slug = json.data?.attributes?.slug;
    await router.push(slug ? { name: "slug", params: { slug } } : "/dashboard");
    // Loading stays true - page will unmount on navigation
  } catch (err) {
    console.error("❌ createBand error:", err);
    alert(err?.error?.message || "Creation failed");
    loading.value = false;
  }
}
</script>

<style scoped>
/* Form Section Card */
.form-section {
  @apply rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden;
}

.form-section-header {
  @apply flex items-center gap-4 p-5 border-b border-white/10 bg-white/[0.02];
}

.form-section-icon {
  @apply w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0;
}

.form-section-title {
  @apply text-lg font-semibold text-white;
}

.form-section-subtitle {
  @apply text-sm text-white/50;
}

.form-section-content {
  @apply p-5 space-y-4;
}

/* Form Fields */
.form-field {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-white/70;
}

.form-input {
  @apply w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 
         focus:border-purple-500 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-purple-500/50 
         transition duration-200;
}

.form-textarea {
  @apply resize-none;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
