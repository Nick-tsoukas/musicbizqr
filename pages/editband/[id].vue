<template>
  <div class="min-h-screen bg-black pt-[var(--header-height)]">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-4 text-center px-6">
        <div class="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <div>
          <p class="text-white font-semibold text-lg">{{ loadingMessage }}</p>
          <p class="text-white/50 text-sm mt-1">Please wait while we save your changes...</p>
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
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-white">Edit Band Profile</h1>
            <p class="text-white/60 mt-2">Update your band's information and settings</p>
          </div>
          <NuxtLink
            :to="`/band-layout/${$route.params.id}`"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/40 bg-purple-900/30 text-purple-200 hover:bg-purple-900/50 transition text-sm font-medium shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Edit Layout
          </NuxtLink>
        </div>
      </div>

      <form class="space-y-8" @submit.prevent="submitForm">
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

          <!-- Button Style (COMMENTED OUT - defaulting to Classic)
          <div v-if="pageStyle === 'default'" class="mt-6 pt-6 border-t border-white/10">
            <h3 class="text-white font-semibold mb-3">Button Style</h3>
            <p class="text-white/50 text-sm mb-4">Choose how streaming and social buttons appear on your page.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                class="relative p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="buttonStyle === 'classic' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'"
                @click="buttonStyle = 'classic'"
              >
                <div class="flex items-start gap-3">
                  <div 
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                    :class="buttonStyle === 'classic' ? 'border-purple-500 bg-purple-500' : 'border-white/30'"
                  >
                    <svg v-if="buttonStyle === 'classic'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-white font-semibold">Classic</div>
                    <p class="text-white/50 text-sm mt-1">Bold white borders, larger buttons with hover lift effect.</p>
                  </div>
                </div>
                <div class="mt-3 space-y-2">
                  <div class="w-full border border-white bg-transparent text-white flex items-center gap-2 font-semibold px-3 py-2 rounded-md text-sm">
                    <div class="w-5 h-5 rounded bg-green-500/20"></div>
                    <span>Spotify</span>
                  </div>
                </div>
              </div>
              <div 
                class="relative p-4 rounded-xl border-2 cursor-pointer transition-all"
                :class="buttonStyle === 'modern' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'"
                @click="buttonStyle = 'modern'"
              >
                <div class="flex items-start gap-3">
                  <div 
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                    :class="buttonStyle === 'modern' ? 'border-purple-500 bg-purple-500' : 'border-white/30'"
                  >
                    <svg v-if="buttonStyle === 'modern'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-white font-semibold">Modern</div>
                    <p class="text-white/50 text-sm mt-1">Subtle glass effect, rounded corners, compact spacing.</p>
                  </div>
                </div>
                <div class="mt-3 space-y-2">
                  <div class="w-full flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm">
                    <div class="w-4 h-4 rounded bg-green-500/20"></div>
                    <span class="text-white font-medium">Spotify</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          -->
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
            <div class="form-field">
              <label for="band-name" class="form-label">Band Name <span class="text-red-400">*</span></label>
              <input
                type="text"
                id="band-name"
                class="form-input"
                v-model="bandName"
                placeholder="Enter your band name"
                required
              />
            </div>

            <div class="form-field">
              <label for="genre" class="form-label">Genre <span class="text-red-400">*</span></label>
              <input
                type="text"
                id="genre"
                class="form-input"
                v-model="genre"
                placeholder="e.g. Rock, Jazz, Electronic"
                required
              />
            </div>

            <div class="form-field">
              <label for="bio" class="form-label">Bio / Description <span class="text-red-400">*</span></label>
              <textarea
                id="bio"
                class="form-input form-textarea"
                v-model="bio"
                placeholder="Tell fans about your band..."
                rows="4"
                required
              ></textarea>
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

            <!-- Song Title -->
            <div class="form-field">
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
              <!-- Show uploaded file info -->
              <div v-if="singlesongFile || singlesongFileId" class="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <span class="text-white truncate block">{{ singlesongFile?.name || existingSongFilename || 'Audio file' }}</span>
                    <span v-if="singlesongFile" class="text-white/50 text-sm">New file selected</span>
                    <span v-else-if="singlesongFileId" class="text-white/50 text-sm">Current file</span>
                  </div>
                </div>
                <button
                  type="button"
                  @click="deleteSong"
                  class="text-red-400 hover:text-red-300 transition flex-shrink-0 ml-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Upload area (show when no file) -->
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

              <!-- Replace file button (when file exists) -->
              <label
                v-if="singlesongFile || singlesongFileId"
                for="singlesong-file-replace"
                class="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm cursor-pointer transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Replace with different file</span>
                <input
                  type="file"
                  id="singlesong-file-replace"
                  class="hidden"
                  @change="handleSingleSongUpload"
                  accept="audio/*"
                  :key="songInputKey"
                />
              </label>
            </div>

            <!-- Embed Mode -->
            <div v-if="singlesongType === 'embed'" class="space-y-4">
              <div class="form-field">
                <label for="singlesong-embedhtml" class="form-label">Embed Code</label>
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
                @click="deleteSong"
                class="text-red-400 hover:text-red-300 text-sm transition"
              >
                Clear embed code
              </button>
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
                <label for="singlevideo-youtube" class="form-label">YouTube Video URL</label>
                <input
                  id="singlevideo-youtube"
                  v-model="singlevideoYoutubeUrl"
                  type="url"
                  class="form-input"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
            <button
              v-if="singlevideoYoutubeUrl"
              type="button"
              @click="deleteVideo"
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
                <div class="flex items-center justify-between mb-2">
                  <label :for="stream" class="form-label capitalize mb-0">{{ stream }}</label>
                  <label :for="`hide-${stream}`" class="flex items-center gap-2 cursor-pointer">
                    <span class="text-white/50 text-xs">Hide</span>
                    <div class="relative">
                      <input
                        type="checkbox"
                        :id="`hide-${stream}`"
                        :checked="isLinkHidden(stream)"
                        @change="setLinkHidden(stream, $event.target.checked)"
                        class="sr-only peer"
                      />
                      <div class="w-8 h-4 bg-white/20 rounded-full peer peer-checked:bg-purple-600 transition-colors"></div>
                      <div class="absolute left-[2px] top-[2px] w-3 h-3 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4"></div>
                    </div>
                  </label>
                </div>
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
                <div class="flex items-center justify-between mb-2">
                  <label :for="net" class="form-label capitalize mb-0">{{ net }}</label>
                  <label :for="`hide-${net}`" class="flex items-center gap-2 cursor-pointer">
                    <span class="text-white/50 text-xs">Hide</span>
                    <div class="relative">
                      <input
                        type="checkbox"
                        :id="`hide-${net}`"
                        :checked="isLinkHidden(net)"
                        @change="setLinkHidden(net, $event.target.checked)"
                        class="sr-only peer"
                      />
                      <div class="w-8 h-4 bg-white/20 rounded-full peer peer-checked:bg-purple-600 transition-colors"></div>
                      <div class="absolute left-[2px] top-[2px] w-3 h-3 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4"></div>
                    </div>
                  </label>
                </div>
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
                <div class="flex items-center justify-between mb-2">
                  <label :for="hub" class="form-label capitalize mb-0">{{ hub }}</label>
                  <label :for="`hide-${hub}`" class="flex items-center gap-2 cursor-pointer">
                    <span class="text-white/50 text-xs">Hide</span>
                    <div class="relative">
                      <input
                        type="checkbox"
                        :id="`hide-${hub}`"
                        :checked="isLinkHidden(hub)"
                        @change="setLinkHidden(hub, $event.target.checked)"
                        class="sr-only peer"
                      />
                      <div class="w-8 h-4 bg-white/20 rounded-full peer peer-checked:bg-purple-600 transition-colors"></div>
                      <div class="absolute left-[2px] top-[2px] w-3 h-3 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4"></div>
                    </div>
                  </label>
                </div>
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
                  class="form-input"
                  v-model="websitelink"
                  placeholder="https://yourbandsite.com"
                />
              </div>
              <div class="form-field">
                <label for="websitelinktext" class="form-label">Display Text</label>
                <input
                  type="text"
                  id="websitelinktext"
                  class="form-input"
                  v-model="websitelinktext"
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

                <div v-if="btn.enabled" class="mt-4 grid gap-3 md:grid-cols-2">
                  <div class="form-field">
                    <label class="form-label">Pricing Mode</label>
                    <select
                      v-model="btn.pricingMode"
                      class="form-input"
                    >
                      <option value="min">Minimum</option>
                      <option value="fixed">Fixed</option>
                      <option value="presets">Presets</option>
                    </select>
                  </div>

                  <div v-if="btn.pricingMode === 'min'" class="form-field">
                    <label class="form-label">Minimum amount</label>
                    <div class="flex items-center gap-2">
                      <span class="text-white/60">$</span>
                      <input
                        v-model.number="btn.minAmount"
                        type="number"
                        step="1"
                        min="0"
                        class="form-input"
                      />
                    </div>
                  </div>

                  <div v-else-if="btn.pricingMode === 'fixed'" class="form-field">
                    <label class="form-label">Fixed amount</label>
                    <div class="flex items-center gap-2">
                      <span class="text-white/60">$</span>
                      <input
                        v-model.number="btn.fixedAmount"
                        type="number"
                        step="1"
                        min="0"
                        class="form-input"
                      />
                    </div>
                  </div>

                  <div v-else-if="btn.pricingMode === 'presets'" class="md:col-span-2 form-field">
                    <label class="form-label">Preset amounts (comma-separated)</label>
                    <input
                      v-model="btn.presetAmountsText"
                      @blur="btn.presetAmounts = parsePresetAmounts(btn.presetAmountsText)"
                      type="text"
                      placeholder="e.g. 3, 5, 10"
                      class="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Payouts Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-emerald-500 to-teal-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Payouts (Get Paid)</h2>
              <p class="form-section-subtitle">Connect Stripe to receive payments</p>
            </div>
          </div>

          <div class="form-section-content">
            <div class="grid grid-cols-3 gap-4 mb-4">
              <div class="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                <div class="text-white/50 text-xs uppercase tracking-wide mb-1">Stripe</div>
                <div class="text-white font-semibold">{{ stripeAccountId ? "Connected" : "Not connected" }}</div>
              </div>
              <div class="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                <div class="text-white/50 text-xs uppercase tracking-wide mb-1">Onboarding</div>
                <div class="font-semibold" :class="stripeOnboardingComplete ? 'text-emerald-400' : 'text-amber-400'">
                  {{ stripeOnboardingComplete ? "Complete" : "Incomplete" }}
                </div>
              </div>
              <div class="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                <div class="text-white/50 text-xs uppercase tracking-wide mb-1">Payments</div>
                <div class="font-semibold" :class="paymentsEnabled ? 'text-emerald-400' : 'text-white/50'">
                  {{ paymentsEnabled ? "Enabled" : "Disabled" }}
                </div>
              </div>
            </div>

            <button
              type="button"
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold transition disabled:opacity-50"
              :disabled="payoutLoading"
              @click="startPayoutOnboarding"
            >
              {{ payoutLoading ? "Loading…" : (stripeOnboardingComplete ? "Manage / Continue Payout Setup" : "Set Up Payouts") }}
            </button>
          </div>
        </section>

        <!-- Merch Concierge Section -->
        <section class="form-section">
          <div class="form-section-header">
            <div class="form-section-icon bg-gradient-to-br from-violet-500 to-purple-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 class="form-section-title">Merch Concierge</h2>
              <p class="form-section-subtitle">Show-only pickup for fans</p>
            </div>
          </div>

          <div class="form-section-content">
            <label for="mc-enabled" class="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/[0.07] transition group">
              <div class="relative">
                <input
                  id="mc-enabled"
                  type="checkbox"
                  v-model="mcEnabled"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-purple-600 transition-colors"></div>
                <div class="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
              </div>
              <div>
                <div class="text-white font-medium">Enable Merch Concierge</div>
                <div class="text-white/50 text-sm">Let fans buy merch during the show and pick it up later</div>
              </div>
            </label>

            <div v-if="mcEnabled" class="space-y-4 mt-4">
              <div class="form-field">
                <label for="mc-pickup" class="form-label">Pickup Instructions <span class="text-red-400">*</span></label>
                <textarea
                  id="mc-pickup"
                  class="form-input form-textarea"
                  v-model="mcPickupInstructions"
                  placeholder="e.g. Pickup at the merch table after the set — show this screen to staff."
                  rows="3"
                  required
                ></textarea>
              </div>

              <label for="mc-ready" class="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/[0.07] transition">
                <div class="relative">
                  <input
                    id="mc-ready"
                    type="checkbox"
                    v-model="mcStaffReadyConfirmed"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-purple-600 transition-colors"></div>
                  <div class="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                </div>
                <div>
                  <div class="text-white font-medium">Staff & inventory ready</div>
                  <div class="text-white/50 text-sm">Must be checked for checkout to work</div>
                </div>
              </label>

              <div class="space-y-4">
                <div
                  v-for="(item, idx) in mcItems"
                  :key="idx"
                  class="p-4 rounded-xl border border-white/10 bg-white/5"
                >
                  <div class="flex items-center justify-between gap-3 mb-4">
                    <div class="text-white font-semibold">Item {{ idx + 1 }}</div>
                    <button
                      type="button"
                      class="text-sm text-red-400 hover:text-red-300 transition"
                      @click="resetMcItem(idx)"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-field">
                      <label :for="`mc-title-${idx}`" class="form-label">Title</label>
                      <input
                        :id="`mc-title-${idx}`"
                        v-model="item.title"
                        type="text"
                        class="form-input"
                        placeholder="T-Shirt, Vinyl, etc."
                      />
                    </div>

                    <div class="form-field">
                      <label :for="`mc-price-${idx}`" class="form-label">Price (USD)</label>
                      <input
                        :id="`mc-price-${idx}`"
                        type="text"
                        inputmode="decimal"
                        class="form-input"
                        placeholder="25.00"
                        v-model="mcPriceTextByIndex[idx]"
                        @blur="commitMcPrice(idx)"
                        @change="commitMcPrice(idx)"
                      />
                    </div>

                    <div class="md:col-span-2 form-field">
                      <label class="form-label">Product image (optional)</label>
                      <input
                        :id="`mc-img-${idx}`"
                        type="file"
                        accept="image/*"
                        class="form-input"
                        @change="onMcImageFileChange(idx, $event)"
                      />

                      <div v-if="mcItemImagePreviewByIndex[idx] || item.imageUrl" class="mt-3 relative inline-block">
                        <img
                          :src="mcItemImagePreviewByIndex[idx] || item.imageUrl"
                          :alt="item.title || 'Product image'"
                          class="max-h-40 rounded-lg border border-white/10"
                        />
                        <button
                          type="button"
                          class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow transition"
                          @click="clearMcImage(idx)"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="md:col-span-2 form-field">
                      <label :for="`mc-desc-${idx}`" class="form-label">Description</label>
                      <textarea
                        :id="`mc-desc-${idx}`"
                        v-model="item.description"
                        class="form-input form-textarea"
                        placeholder="Optional description..."
                        rows="2"
                      ></textarea>
                    </div>
                  </div>

                  <label :for="`mc-sizes-${idx}`" class="flex items-center gap-3 mt-4 cursor-pointer">
                    <div class="relative">
                      <input
                        :id="`mc-sizes-${idx}`"
                        type="checkbox"
                        v-model="item.sizesEnabled"
                        class="sr-only peer"
                      />
                      <div class="w-9 h-5 bg-white/20 rounded-full peer peer-checked:bg-purple-600 transition-colors"></div>
                      <div class="absolute left-[2px] top-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4"></div>
                    </div>
                    <span class="text-white text-sm">Sizes enabled</span>
                  </label>

                  <div v-if="!item.sizesEnabled" class="mt-3 form-field">
                    <label class="form-label">Available quantity</label>
                    <input
                      v-model.number="item.availableQty"
                      type="number"
                      step="1"
                      min="0"
                      class="form-input w-32"
                    />
                  </div>

                  <div v-else class="mt-3">
                    <div class="text-white/50 text-sm mb-2">Size stock (set 0 for sold out)</div>
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <div v-for="sz in mcSizes" :key="sz" class="form-field">
                        <label class="form-label text-xs">{{ sz }}</label>
                        <input
                          v-model.number="item.sizeStock[sz]"
                          type="number"
                          step="1"
                          min="0"
                          class="form-input"
                        />
                      </div>
                    </div>
                  </div>
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
              Saving...
            </span>
            <span v-else>Save Changes</span>
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
import { ref, onMounted, computed } from "vue";
import BandPageStylePreview from '@/components/band/BandPageStylePreview.vue';

const singlevideoTitle = ref("");
const singlesongEmbedHtml = ref("");

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const user = useStrapiUser();
const token = useStrapiToken();

const loading = ref(false);
const loadingMessage = ref('Saving changes...');
const payoutLoading = ref(false);

const stripeAccountId = ref(null);
const stripeOnboardingComplete = ref(false);
const paymentsEnabled = ref(false);

// flags for “delete on save”
const removeSong = ref(false);
const removeVideo = ref(false);

// Page style
const pageStyle = ref('default'); // 'default' | 'compact' | 'bold'
const buttonStyle = ref('classic'); // 'classic' | 'modern'
const showStylePreview = ref(false);
const previewingStyle = ref('default');

// Feature flag: show alternative templates for all users
const showAlternativeTemplates = computed(() => true);

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
const websitelink = ref("");
const websitelinktext = ref("");

// Track existing vs new image
const bandImgFile = ref(null);
const bandImgUrl = ref("");
const bandImgId = ref(null);

// Members
const members = ref([]);

// Social media links
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

// Streaming links
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

// Event hub links
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

const hiddenLinks = ref([]);

// Merch Concierge config
const mcSizes = ["S", "M", "L", "XL", "2XL"];
const mcEnabled = ref(false);
const mcPickupInstructions = ref("");
const mcStaffReadyConfirmed = ref(false);
const mcPriceTextByIndex = ref(["", "", ""]);
const mcItemImageFiles = ref([null, null, null]);
const mcItemImagePreviewByIndex = ref({});
const mcItems = ref([
  {
    title: "",
    description: "",
    imageUrl: "",
    priceCents: 0,
    sizesEnabled: false,
    availableQty: 0,
    sizeStock: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 },
  },
  {
    title: "",
    description: "",
    imageUrl: "",
    priceCents: 0,
    sizesEnabled: false,
    availableQty: 0,
    sizeStock: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 },
  },
  {
    title: "",
    description: "",
    imageUrl: "",
    priceCents: 0,
    sizesEnabled: false,
    availableQty: 0,
    sizeStock: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 },
  },
]);

function normalizeMerchConcierge(raw) {
  const mc = raw && typeof raw === "object" ? raw : null;
  if (!mc) return;

  mcEnabled.value = mc.enabled === true;
  mcPickupInstructions.value = mc.pickupInstructions ? String(mc.pickupInstructions) : "";
  mcStaffReadyConfirmed.value = mc.staffReadyConfirmed === true;

  const items = Array.isArray(mc.merchItems) ? mc.merchItems : [];
  const next = mcItems.value.map((d, i) => {
    const it = items[i] || {};
    const sizesEnabled = it.sizesEnabled === true;
    const sizeStock = it.sizeStock && typeof it.sizeStock === "object" ? it.sizeStock : {};

    return {
      ...d,
      title: it.title ? String(it.title) : "",
      description: it.description ? String(it.description) : "",
      imageUrl: it.imageUrl ? String(it.imageUrl) : "",
      priceCents: Number(it.priceCents || 0),
      sizesEnabled,
      availableQty: Number(it.availableQty || 0),
      sizeStock: {
        S: Number(sizeStock.S || 0),
        M: Number(sizeStock.M || 0),
        L: Number(sizeStock.L || 0),
        XL: Number(sizeStock.XL || 0),
        "2XL": Number(sizeStock["2XL"] || 0),
      },
    };
  });

  mcItems.value = next;

  mcPriceTextByIndex.value = next.map((it) => formatMcPriceDollars(it.priceCents));
}

function formatMcPriceDollars(priceCents) {
  const n = Number(priceCents || 0);
  return (n / 100).toFixed(2);
}

function parseMcPriceToCents(value) {
  const s = String(value == null ? "" : value).trim();
  if (!s) return 0;
  const num = Number(s);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 100);
}

function commitMcPrice(idx) {
  const v = mcPriceTextByIndex.value?.[idx];
  const cents = parseMcPriceToCents(v);
  mcItems.value[idx].priceCents = cents;
  mcPriceTextByIndex.value[idx] = formatMcPriceDollars(cents);
}

function onMcImageFileChange(idx, e) {
  const f = e?.target?.files?.[0] || null;
  mcItemImageFiles.value[idx] = f;

  const next = { ...(mcItemImagePreviewByIndex.value || {}) };
  if (f) {
    next[idx] = URL.createObjectURL(f);
  } else {
    delete next[idx];
  }
  mcItemImagePreviewByIndex.value = next;
}

function clearMcImage(idx) {
  mcItemImageFiles.value[idx] = null;
  mcItems.value[idx].imageUrl = "";
  const next = { ...(mcItemImagePreviewByIndex.value || {}) };
  delete next[idx];
  mcItemImagePreviewByIndex.value = next;
}

function resetMcItem(idx) {
  if (!confirm("Clear this merch item?")) return;

  mcItems.value[idx] = {
    title: "",
    description: "",
    imageUrl: "",
    priceCents: 0,
    sizesEnabled: false,
    availableQty: 0,
    sizeStock: { S: 0, M: 0, L: 0, XL: 0, "2XL": 0 },
  };

  mcItemImageFiles.value[idx] = null;
  const next = { ...(mcItemImagePreviewByIndex.value || {}) };
  delete next[idx];
  mcItemImagePreviewByIndex.value = next;

  mcPriceTextByIndex.value[idx] = "";
}

function normalizeHiddenLinks(v) {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (v && typeof v === 'object') return Object.keys(v).filter((k) => v[k]);
  return [];
}

function isLinkHidden(key) {
  return Array.isArray(hiddenLinks.value) && hiddenLinks.value.includes(key);
}

function setLinkHidden(key, hidden) {
  const next = Array.isArray(hiddenLinks.value) ? [...hiddenLinks.value] : [];
  const idx = next.indexOf(key);
  if (hidden && idx === -1) next.push(key);
  if (!hidden && idx !== -1) next.splice(idx, 1);
  hiddenLinks.value = next;
}

const paymentButtons = ref([
  {
    key: "pay_entry",
    title: "Pay Entry",
    badgeId: "show_supporter",
    description: "Door entry for tonight’s show",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
  {
    key: "tip_band",
    title: "Tip the Band",
    badgeId: "tip_legend",
    description: "Thanks for the support ❤️",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
  {
    key: "pay_merch",
    title: "Pay for Merch",
    badgeId: "merch_mvp",
    description: "Shirts, posters, vinyl, etc.",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
  {
    key: "support_band",
    title: "Support the Band",
    badgeId: "band_backer",
    description: "Help us keep making music",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
  {
    key: "help_get_home",
    title: "Help Us Get Home",
    badgeId: "road_crew",
    description: "Gas, food, and late nights on the road",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
  {
    key: "after_show_support",
    title: "After-Show Support",
    badgeId: "after_show_backer",
    description: "Thanks for coming out tonight ❤️",
    enabled: false,
    pricingMode: "min",
    minAmount: 5,
    fixedAmount: null,
    presetAmounts: [],
    presetAmountsText: "",
    shareEnabled: true,
    unlockEnabled: false,
    supporterWallEligible: true,
  },
]);

function sanitizePricingMode(v) {
  return v === "fixed" || v === "presets" || v === "min" ? v : "min";
}

function parsePresetAmounts(v) {
  if (!v) return [];
  return String(v)
    .split(",")
    .map((s) => Number(String(s).trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function sanitizePresetAmounts(arr) {
  return Array.isArray(arr)
    ? arr
        .map((n) => Number(n))
        .filter((n) => Number.isFinite(n) && n > 0)
    : [];
}

function formatPresetAmounts(arr) {
  return Array.isArray(arr) ? arr.filter(Boolean).join(", ") : "";
}

function mergePaymentButtons(existing = []) {
  const safeExisting = Array.isArray(existing) ? existing : [];
  const byKey = new Map(safeExisting.filter(Boolean).map((b) => [b.key, b]));
  return paymentButtons.value.map((d) => {
    const e = byKey.get(d.key) || {};

    const pricingMode = sanitizePricingMode(e.pricingMode ?? d.pricingMode);
    const minAmount = Number(e.minAmount ?? d.minAmount ?? 5);
    const fixedAmountRaw = e.fixedAmount ?? d.fixedAmount ?? null;
    const fixedAmount = fixedAmountRaw == null ? null : Number(fixedAmountRaw);
    const presetAmounts = sanitizePresetAmounts(e.presetAmounts ?? d.presetAmounts);

    return {
      ...d,
      ...e,
      key: d.key,
      title: d.title,
      description: d.description,
      enabled: e.enabled === true,
      pricingMode,
      minAmount: pricingMode === "min" ? minAmount : null,
      fixedAmount: pricingMode === "fixed" ? fixedAmount : null,
      presetAmounts: pricingMode === "presets" ? presetAmounts : [],
      presetAmountsText:
        pricingMode === "presets" ? formatPresetAmounts(presetAmounts) : "",
    };
  });
}

// Featured song/video
const singlesongType = ref("upload"); // 'upload' or 'embed'
const singlesongTitle = ref("");
const singlesongPlatform = ref(""); // new
const singlesongTrackId = ref(""); // new
const singlesongFile = ref(null);
const singlesongFileId = ref(null); // preserve existing file relation
const existingSongFilename = ref(""); // store the existing song filename
const songInputKey = ref(0); // key to reset file input

const singlevideoYoutubeUrl = ref("");

// Clear the song fields and mark for removal on Save
function deleteSong() {
  if (!confirm("Remove the featured song from this form?")) return;
  removeSong.value = true;
  singlesongTitle.value = "";
  singlesongPlatform.value = "";
  singlesongTrackId.value = "";
  singlesongEmbedHtml.value = ""; // NEW
  singlesongFile.value = null;
  singlesongFileId.value = null;
  existingSongFilename.value = "";
  songInputKey.value++; // reset file input
}

// Clear the video field and mark for removal on Save
function deleteVideo() {
  if (!confirm("Remove the featured video from this form?")) return;
  removeVideo.value = true;
  singlevideoYoutubeUrl.value = "";
}

const rawEmbedHtml = computed(() => singlesongEmbedHtml.value || "");

function normalizeLink(link) {
  if (!link) return "";

  // Already has a protocol → return as-is
  if (/^https?:\/\//i.test(link)) return link.trim();

  // Starts with www → add https://
  if (/^www\./i.test(link)) return `https://${link.trim()}`;

  // Otherwise assume https://
  return `https://www.${link.trim()}`;
}

async function fetchBand() {
  loading.value = true;
  const id = route.params.id;

  try {
    const url =
      `${config.public.strapiUrl}/api/bands/${id}` +
      `?populate=bandImg,members.image,singlesong.song,singlevideo`;
    const res = await fetch(url);
    const j = await res.json();
    if (!j.data) throw new Error("No data");

    // Support both Strapi response formats:
    // - Core controller: { data: { id, attributes: {...} } }
    // - Custom controller: { data: { id, name, ... } } (flat)
    const attrs = j.data.attributes || j.data;

    stripeAccountId.value = attrs.stripeAccountId || null;
    stripeOnboardingComplete.value = attrs.stripeOnboardingComplete === true;
    paymentsEnabled.value = attrs.paymentsEnabled === true;

    // Basic fields
    bandName.value = attrs.name || "";
    genre.value = attrs.genre || "";
    bio.value = attrs.bio || "";
    websitelink.value = normalizeLink(attrs.websitelink) || "";
    websitelinktext.value = attrs.websitelinktext || "";
    pageStyle.value = attrs.pageStyle || "default";
    buttonStyle.value = attrs.buttonStyle || "classic";

    // Existing image - handle both formats
    const img = attrs.bandImg?.data || attrs.bandImg;
    bandImgId.value = img?.id || null;
    bandImgUrl.value = img?.attributes?.url || img?.url || "";

    // Members - handle both formats
    const rawMembers = attrs.members?.data || attrs.members || [];
    members.value = rawMembers.map((m) => {
      const memberData = m.attributes || m;
      const memberImg = memberData.image?.data || memberData.image;
      return {
        name: memberData.name,
        instrument: memberData.instrument,
        imageUrl: memberImg?.attributes?.url || memberImg?.url || null,
      };
    });

    // Social & Streaming & Event Hubs
    console.log('[DEBUG fetchBand] Full attrs:', attrs);
    console.log('[DEBUG fetchBand] threads:', attrs.threads, 'discord:', attrs.discord, 'patreon:', attrs.patreon);
    Object.keys(social.value).forEach(
      (k) => (social.value[k] = attrs[k] || "")
    );
    Object.keys(streaming.value).forEach(
      (k) => (streaming.value[k] = attrs[k] || "")
    );
    Object.keys(eventHubs.value).forEach(
      (k) => (eventHubs.value[k] = attrs[k] || "")
    );

    // Load contact/booking fields
    contacts.value.bookingEmail = attrs.bookingEmail || "";
    contacts.value.managementEmail = attrs.managementEmail || "";
    contacts.value.pressEmail = attrs.pressEmail || "";
    contacts.value.bookingAgent = attrs.bookingAgent || "";
    contacts.value.labelUrl = attrs.labelUrl || "";
    contacts.value.labelName = attrs.labelName || "";

    hiddenLinks.value = normalizeHiddenLinks(attrs.hiddenLinks);

    paymentButtons.value = mergePaymentButtons(attrs.paymentButtons);

    normalizeMerchConcierge(attrs.merchConcierge);

    // Singlesong component + existing file - handle both formats
    if (attrs.singlesong) {
      const ss = attrs.singlesong;
      singlesongTitle.value = ss.title || "";
      if (ss.isEmbed) {
        singlesongType.value = "embed";
        // legacy (keep reading in case old data exists)
        singlesongPlatform.value = ss.platform || "";
        singlesongTrackId.value = ss.trackId || "";
        // NEW: load raw embed code if present
        singlesongEmbedHtml.value = ss.embedHtml || "";
      } else {
        singlesongType.value = "upload";
      }
      const songFile = ss.song?.data || ss.song;
      singlesongFileId.value = songFile?.id || null;
      // Store existing song filename for display
      existingSongFilename.value = songFile?.attributes?.name || songFile?.name || "";
    }

    // Singlevideo component
    if (attrs.singlevideo) {
      singlevideoYoutubeUrl.value = attrs.singlevideo.youtubeid || "";
      singlevideoTitle.value = attrs.singlevideo?.title || "";
    }
  } catch (err) {
    console.error("❌ fetchBand failed:", err);
  } finally {
    loading.value = false;
  }
}
onMounted(fetchBand);

async function startPayoutOnboarding() {
  const id = route.params.id;
  if (!token.value) {
    alert("You must be logged in.");
    return;
  }

  payoutLoading.value = true;
  try {
    const res = await fetch(
      `${config.public.strapiUrl}/api/bands/${id}/payments/onboard`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error?.message || "Unable to start Stripe onboarding");
    }
    if (!json?.url) throw new Error("Stripe onboarding URL missing");
    window.location.href = json.url;
  } catch (e) {
    alert(e?.message || "Unable to start payouts setup");
  } finally {
    payoutLoading.value = false;
  }
}

// Handlers
function handleImageUpload(e) {
  bandImgFile.value = e.target.files[0];
  bandImgUrl.value = URL.createObjectURL(bandImgFile.value);
}
function handleSingleSongUpload(e) {
  singlesongFile.value = e.target.files[0];
}

// Normalize links before including them in the payload

async function submitForm() {
  loading.value = true;
  loadingMessage.value = 'Saving changes...';
  const id = route.params.id;

  try {
    // Ensure merch price inputs are committed to cents
    for (let i = 0; i < mcItems.value.length; i++) {
      const cents = parseMcPriceToCents(mcPriceTextByIndex.value?.[i]);
      mcItems.value[i].priceCents = cents;
      mcPriceTextByIndex.value[i] = formatMcPriceDollars(cents);
    }

    // 1) Upload new image if chosen
    let newImageId = null;
    if (bandImgFile.value) {
      const fm = new FormData();
      fm.append("files", bandImgFile.value, bandImgFile.value.name);
      fm.append("ref", "api::band.band");
      fm.append("refId", id);
      fm.append("field", "bandImg");
      const up = await fetch(`${config.public.strapiUrl}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: fm,
      });
      const uj = await up.json();
      if (!up.ok) throw uj;
      newImageId = uj[0]?.id ?? null;
    }

    // 2) Upload new song file if chosen (only relevant for upload mode)
    let newSongId = null;
    if (singlesongFile.value) {
      const fm2 = new FormData();
      fm2.append("files", singlesongFile.value, singlesongFile.value.name);
      fm2.append("ref", "api::band.band");
      fm2.append("refId", id);
      fm2.append("field", "singlesong.song");
      const su = await fetch(`${config.public.strapiUrl}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: fm2,
      });
      const suj = await su.json();
      if (!su.ok) throw suj;
      newSongId = suj[0]?.id ?? null;
    }

    // 2b) Upload merch concierge images (stored as absolute URL in merchConcierge JSON)
    if (mcEnabled.value) {
      for (let i = 0; i < mcItemImageFiles.value.length; i++) {
        const f = mcItemImageFiles.value[i];
        if (!f) continue;

        const fm3 = new FormData();
        fm3.append("files", f, f.name);
        const mu = await fetch(`${config.public.strapiUrl}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token.value}` },
          body: fm3,
        });
        const muj = await mu.json();
        if (!mu.ok) throw muj;

        const uploadedUrl = muj?.[0]?.url || null;
        if (uploadedUrl) {
          const base = String(config.public.strapiUrl || "").replace(/\/+$/, "");
          const u = String(uploadedUrl);
          mcItems.value[i].imageUrl = u.startsWith("http")
            ? u
            : base + (u.startsWith("/") ? u : `/${u}`);
        }
      }
    }

    // Optional: require a real <iframe> when in embed mode and user pasted something
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

    // 3) Build payloads
    // Featured song
    let singlesongPayload = null;
    if (!removeSong.value) {
      const isEmbed = singlesongType.value === "embed";
      const embedHtml = isEmbed ? (singlesongEmbedHtml.value || "").trim() : "";

      singlesongPayload = {
        title: singlesongTitle.value || "",
        isEmbed,
        // Prefer raw embed HTML. If present, we ignore platform/trackId.
        embedHtml: isEmbed ? embedHtml || null : null,
        platform:
          isEmbed && !embedHtml ? singlesongPlatform.value || null : null, // legacy fallback
        trackId: isEmbed && !embedHtml ? singlesongTrackId.value || null : null, // legacy fallback
        embedUrl: null, // no builder anymore
        song: !isEmbed ? newSongId || singlesongFileId.value || null : null,
      };
    }

    // Featured video
    const singlevideoPayload = removeVideo.value
      ? null
      : {
          youtubeid: singlevideoYoutubeUrl.value || "",
          title: singlevideoTitle.value || "",
        };

    // Normalize socials/streaming/eventHubs
    const normalizedSocial = Object.fromEntries(
      Object.entries(social.value).map(([key, val]) => [
        key,
        normalizeLink(val),
      ])
    );
    const normalizedStreaming = Object.fromEntries(
      Object.entries(streaming.value).map(([key, val]) => [
        key,
        normalizeLink(val),
      ])
    );
    const normalizedEventHubs = Object.fromEntries(
      Object.entries(eventHubs.value).map(([key, val]) => [
        key,
        normalizeLink(val),
      ])
    );

    // Full band payload
    const payload = {
      name: bandName.value,
      pageStyle: pageStyle.value,
      buttonStyle: buttonStyle.value,
      genre: genre.value,
      bio: bio.value,
      websitelink: websitelink.value || null,
      websitelinktext: websitelinktext.value || null,
      users_permissions_user: user.value.id,
      hiddenLinks: hiddenLinks.value,
      merchConcierge: mcEnabled.value
        ? {
            enabled: true,
            pickupInstructions: String(mcPickupInstructions.value || "").trim(),
            staffReadyConfirmed: mcStaffReadyConfirmed.value === true,
            merchItems: mcItems.value.map((it) => {
              const sizesEnabled = it.sizesEnabled === true;
              const sizeStock = sizesEnabled ? (it.sizeStock || {}) : {};
              return {
                title: String(it.title || "").trim(),
                description: String(it.description || "").trim(),
                imageUrl: String(it.imageUrl || "").trim(),
                priceCents: Number(it.priceCents || 0),
                sizesEnabled,
                availableQty: sizesEnabled ? null : Number(it.availableQty || 0),
                sizeStock: sizesEnabled ? sizeStock : null,
              };
            }),
          }
        : { enabled: false },
      paymentButtons: paymentButtons.value.map((b) => {
        const mode = sanitizePricingMode(b.pricingMode);
        const minAmount = mode === "min" ? Number(b.minAmount || 5) : null;
        const fixedAmount =
          mode === "fixed" && b.fixedAmount != null && b.fixedAmount !== ""
            ? Number(b.fixedAmount)
            : null;
        const presetAmounts =
          mode === "presets"
            ? parsePresetAmounts(
                b.presetAmountsText != null
                  ? String(b.presetAmountsText)
                  : formatPresetAmounts(b.presetAmounts)
              )
            : [];
        return {
          key: b.key,
          title: b.title,
          description: b.description,
          badgeId: b.badgeId ?? null,
          enabled: b.enabled === true,
          pricingMode: mode,
          minAmount,
          fixedAmount,
          presetAmounts,
          shareEnabled: b.shareEnabled ?? true,
          unlockEnabled: b.unlockEnabled ?? false,
          supporterWallEligible: b.supporterWallEligible ?? true,
        };
      }),
      ...(newImageId
        ? { bandImg: newImageId }
        : bandImgId.value && { bandImg: bandImgId.value }),
      members: members.value.map((m) => ({
        name: m.name,
        instrument: m.instrument,
      })),
      ...normalizedSocial,
      ...normalizedStreaming,
      ...normalizedEventHubs,
      // contact / booking
      bookingEmail: contacts.value.bookingEmail?.trim() || "",
      managementEmail: contacts.value.managementEmail?.trim() || "",
      pressEmail: contacts.value.pressEmail?.trim() || "",
      bookingAgent: contacts.value.bookingAgent?.trim() || "",
      labelUrl: contacts.value.labelUrl?.trim() || "",
      labelName: contacts.value.labelName?.trim() || "",
      singlesong: singlesongPayload,
      singlevideo: singlevideoPayload,
    };

    // 4) Send update
    const put = await fetch(`${config.public.strapiUrl}/api/bands/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({ data: payload }),
    });
    const pj = await put.json();
    if (!put.ok) throw pj;

   // ✅ get the current slug and do a full redirect (hard refresh)
let slug =
  pj?.data?.attributes?.slug ||
  pj?.data?.slug ||
  pj?.slug ||
  null;

if (!slug) {
  // fallback: refetch just the slug by id
  try {
    const r = await fetch(`${config.public.strapiUrl}/api/bands/${id}?fields[0]=slug`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    const j = await r.json();
    slug = j?.data?.attributes?.slug || j?.data?.slug || null;
  } catch {}
}

// Update loading message before redirect
loadingMessage.value = 'Changes saved! Redirecting...';

if (slug && process.client) {
  // full page navigation → guarantees header is fresh
  window.location.replace(`/${slug}`);
  return;
}

// final fallback
if (process.client) window.location.reload();
  // Loading stays true - page will navigate away
  } catch (err) {
    console.error("❌ submitForm error:", err);
    alert(err?.error?.message || "Update failed");
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

/* Legacy MDC styles for existing sections */
.mdc-text-field {
  position: relative;
  margin-bottom: 1.5rem;
  width: 100%;
}
.mdc-text-field__input {
  width: 100%;
  padding: 0.75rem 0.5rem;
  border: 1px solid #000;
  border-radius: 10px;
  outline: none;
}
.mdc-floating-label {
  position: absolute;
  top: 0.75rem;
  left: 0.5rem;
  background: white;
  padding: 0 0.2em;
  transition: transform 0.2s, color 0.2s;
}
.mdc-text-field__input:focus + .mdc-floating-label,
.mdc-text-field__input:not(:placeholder-shown) + .mdc-floating-label {
  transform: translateY(-1.5rem);
  color: #6200ee;
}
.mdc-line-ripple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #6200ee;
  transform: scaleX(0);
  transition: transform 0.2s;
}
.mdc-text-field__input:focus ~ .mdc-line-ripple {
  transform: scaleX(1);
}

.mdc-button,
.styled-file-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.mdc-button {
  background: #2c2c2c;
  color: #fff;
  border: none;
  margin-top: 1rem;
}
.mdc-button:hover {
  background: #3700b3;
}
.styled-file-input {
  display: none;
}
.styled-file-label {
  background: #2c2c2c;
  color: #fff;
}
.styled-file-label:hover {
  background: #3700b3;
}
.styled-file-label.w-full {
  width: 100%;
  text-align: center;
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
