<template>
  <header
    class="bg-black text-white shadow-lg fixed top-0 left-0 right-0"
    style="height: var(--header-height)"
  >
    <!-- <BackButton
    v-if="showBack"
    defaultRoute="/dashboard"
    class="absolute left-4 top-1/2 transform -translate-y-1/2 z-50"
  /> -->

    <div
      class="flex items-center justify-between h-full px-4 mx-auto max-w-5xl"
    >
    <NuxtLink to="/">
      <img src="@/assets/musicbizlogo.png" class="h-8" />
    </NuxtLink>

      <nav class="z-50 hidden md:flex items-center space-x-1">
        <!-- Primary text links -->
        <NuxtLink v-if="!user" to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink v-if="user" to="/dashboard" class="nav-link">Dashboard</NuxtLink>
        <client-only>
          <NuxtLink
            v-if="user && userSlug"
            :to="`/${userSlug}`"
            class="nav-link"
          >
            Artist Page
          </NuxtLink>
        </client-only>
        <NuxtLink v-if="!user" to="/signup" class="nav-link">Signup</NuxtLink>
        <NuxtLink v-if="!user" to="/login" class="nav-link">Login</NuxtLink>
        <NuxtLink to="/agency" class="nav-link">Agency</NuxtLink>
        <NuxtLink to="/demo" class="nav-link">Demo</NuxtLink>

        <!-- Divider -->
        <div class="w-px h-5 bg-white/20 mx-2"></div>

        <!-- Search input field -->
        <button
          @click="openSearch"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 transition-all group"
          title="Search Artists (⌘K)"
        >
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="text-emerald-400/70 text-sm">Search bands...</span>
          <kbd class="hidden lg:inline-flex px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50 font-mono">⌘K</kbd>
        </button>

        <!-- Icon links -->
        <NuxtLink to="/saved" class="nav-icon" title="Saved">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <client-only>
            <span v-if="savedCount" class="nav-icon-badge">{{ savedCount }}</span>
          </client-only>
        </NuxtLink>
        <NuxtLink v-if="user" to="/account" class="nav-icon" title="Account">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </NuxtLink>
        <button v-if="user" @click="logoutUser" class="nav-icon" title="Logout">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </nav>

      <!-- Mobile search button - always visible -->
      <button
        @click="openSearch"
        class="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 border-emerald-400 bg-emerald-400/10 mr-3"
      >
        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="text-emerald-400/80 text-xs font-medium">Search</span>
      </button>

      <button 
        @click="toggleMenu" 
        class="md:hidden focus:outline-none w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
      >
        <div class="hamburger-icon" :class="{ 'is-open': isMenuOpen }">
          <span class="hamburger-line hamburger-line-1"></span>
          <span class="hamburger-line hamburger-line-2"></span>
          <span class="hamburger-line hamburger-line-3"></span>
        </div>
      </button>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <nav
        v-if="isMenuOpen"
        class="fixed left-0 w-full bg-gradient-to-b from-black via-black to-gray-900 text-white md:hidden z-50 overflow-y-auto"
        style="
          top: var(--header-height);
          height: calc(100vh - var(--header-height));
        "
      >
        <!-- Decorative gradient orbs -->
        <div class="absolute top-20 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-20 left-0 w-48 h-48 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative flex flex-col px-6 py-8 pb-24 space-y-2">
          <!-- Primary Navigation -->
          <div class="space-y-1">
            <NuxtLink
              v-if="!user"
              to="/"
              @click="toggleMenu"
              class="mobile-nav-item"
            >
              <span class="mobile-nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
              <span>Home</span>
            </NuxtLink>

            <button
              @click="openSearchMobile"
              class="mobile-nav-item w-full"
            >
              <span class="mobile-nav-icon bg-emerald-500/20 text-emerald-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <span>Search Artists</span>
            </button>

            <NuxtLink to="/saved" @click="toggleMenu" class="mobile-nav-item">
              <span class="mobile-nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </span>
              <span>Saved</span>
              <client-only>
                <span v-if="savedCount" class="ml-auto bg-accent/20 text-accent text-xs font-bold px-2 py-0.5 rounded-full">{{ savedCount }}</span>
              </client-only>
            </NuxtLink>

            <client-only>
              <NuxtLink
                v-if="user && userSlug"
                :to="`${userSlug}`"
                @click="toggleMenu"
                class="mobile-nav-item"
              >
                <span class="mobile-nav-icon bg-accent/20 text-accent">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </span>
                <span>My Artist Page</span>
              </NuxtLink>
            </client-only>

            <NuxtLink
              v-if="user"
              to="/dashboard"
              @click="toggleMenu"
              class="mobile-nav-item"
            >
              <span class="mobile-nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </span>
              <span>Dashboard</span>
            </NuxtLink>
          </div>

          <!-- Divider -->
          <div class="py-3">
            <div class="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          <!-- Secondary Navigation -->
          <div class="space-y-1">
            <NuxtLink to="/agency" @click="toggleMenu" class="mobile-nav-item">
              <span class="mobile-nav-icon bg-neon-purple/20 text-neon-purple">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <span>Agency</span>
            </NuxtLink>

            <NuxtLink to="/demo" @click="toggleMenu" class="mobile-nav-item">
              <span class="mobile-nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>Demo</span>
            </NuxtLink>

            <NuxtLink to="/contact" @click="toggleMenu" class="mobile-nav-item">
              <span class="mobile-nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span>Contact</span>
            </NuxtLink>
          </div>

          <!-- Divider -->
          <div class="py-3">
            <div class="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          <!-- Auth Section -->
          <div class="space-y-1">
            <NuxtLink
              v-if="user"
              to="/account"
              @click="toggleMenu"
              class="mobile-nav-item"
            >
              <span class="mobile-nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span>Account</span>
            </NuxtLink>

            <NuxtLink
              v-if="!user"
              to="/signup"
              @click="toggleMenu"
              class="mobile-nav-item-cta"
            >
              <span>Get Started Free</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>

            <NuxtLink
              v-if="!user"
              to="/login"
              @click="toggleMenu"
              class="mobile-nav-item"
            >
              <span class="mobile-nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </span>
              <span>Login</span>
            </NuxtLink>

            <button
              v-if="user"
              @click="logoutUserMobile"
              class="mobile-nav-item w-full text-red-400"
            >
              <span class="mobile-nav-icon bg-red-500/20 text-red-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
              <span>Logout</span>
            </button>
          </div>

          <!-- App badge -->
          <div class="pt-6">
            <NuxtLink 
              to="/install" 
              @click="toggleMenu"
              class="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-accent/10 to-neon-purple/10 border border-white/5"
            >
              <img src="/icons/icon-192.png" class="w-10 h-10 rounded-xl" alt="MBQ" />
              <div class="flex-1">
                <p class="text-white font-medium text-sm">Install MBQ App</p>
                <p class="text-gray-500 text-xs">Faster access at shows</p>
              </div>
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </Transition>
      <!-- Band Search Modal -->
    <client-only>
      <BandSearchModal
        :is-open="isSearchOpen"
        @close="isSearchOpen = false"
        @select="onBandSelect"
      />
    </client-only>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStrapiUser, useStrapiAuth, useFetch, useRuntimeConfig } from '#imports'
import { useRouter } from 'vue-router'
import { useAsyncData } from '#app'
import { useSavedBands } from '@/composables/useSavedBands'

const user = useStrapiUser()
const { logout } = useStrapiAuth()
const router = useRouter()
const config = useRuntimeConfig()

const { count: savedCount } = useSavedBands()

// 1) Fetch the user's band slug via SSR + client
const { data: bandData, pending: bandLoading, error: bandError } = await useAsyncData(
  'user-band',
  () => $fetch(`${config.public.strapiUrl}/api/bands`, {
    params: {
      'filters[users_permissions_user][id][$eq]': user.value?.id,
      'fields[0]': 'slug',
    },
  }),
  {
    server: true,
    immediate: true,
    watch: () => user.value?.id,
  }
)

// 2) Compute a simple slug or null
const userSlug = computed(() => {
  if (bandLoading.value || bandError.value) return null
  const list = bandData.value?.data || []
  if (!list.length) return null
  const item = list[0]
  return item.attributes?.slug ?? item.slug ?? null
})

// Menu state & actions
const isMenuOpen = ref(false)
const toggleMenu = () => {
  document.body.style.overflow = isMenuOpen.value ? '' : 'hidden'
  isMenuOpen.value = !isMenuOpen.value
}
const logoutUser = () => {
  logout()
  router.push('/')
}
const logoutUserMobile = () => {
  logout()
  toggleMenu()
  router.push('/')
}

// Search modal state
const isSearchOpen = ref(false)

function openSearch() {
  isSearchOpen.value = true
}

function openSearchMobile() {
  toggleMenu()
  isSearchOpen.value = true
}

function onBandSelect(band) {
  router.push(`/${band.slug}`)
}

// Keyboard shortcut: Cmd/Ctrl + K
function handleGlobalKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isSearchOpen.value = true
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
header {
  z-index: 99999999 !important;
}
.nav-link {
  @apply text-white hover:bg-purple-700 rounded px-3 py-2 transition-colors text-sm;
}

.nav-icon {
  @apply relative text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors;
}

.nav-icon-badge {
  @apply absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center;
}

.mobile-nav-link {
  @apply text-white text-xl hover:bg-purple-100 rounded px-4 py-2 transition-colors;
}

.mobile-nav-item {
  @apply flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/90 hover:bg-white/5 transition-all duration-200 text-base font-medium;
}

.mobile-nav-item:active {
  @apply scale-[0.98] bg-white/10;
}

.mobile-nav-icon {
  @apply w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/70;
}

.mobile-nav-item-cta {
  @apply flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-accent to-neon-purple text-white font-semibold text-base transition-all duration-200;
}

.mobile-nav-item-cta:active {
  @apply scale-[0.98] opacity-90;
}

.showfully {
  z-index: 9999999999999;
}

.block {
  display: block;
}

body {
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

/* Premium animated hamburger menu */
.hamburger-icon {
  width: 22px;
  height: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #FF00FF, #9100FF);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
}

.hamburger-line-1 {
  width: 100%;
}

.hamburger-line-2 {
  width: 70%;
  margin-left: auto;
}

.hamburger-line-3 {
  width: 85%;
}

/* Open state - transform to X */
.hamburger-icon.is-open .hamburger-line-1 {
  transform: translateY(7px) rotate(45deg);
  width: 100%;
}

.hamburger-icon.is-open .hamburger-line-2 {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-icon.is-open .hamburger-line-3 {
  transform: translateY(-7px) rotate(-45deg);
  width: 100%;
}

/* Hover glow effect */
.hamburger-icon:hover .hamburger-line {
  box-shadow: 0 0 8px rgba(255, 0, 255, 0.5);
}
</style>
