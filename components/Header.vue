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

      <button @click="toggleMenu" class="md:hidden focus:outline-none">
        <svg
          class="w-6 h-6 transition-transform"
          :class="{ 'rotate-45': isMenuOpen, 'rotate-0': !isMenuOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="!isMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <nav
      class="fixed left-0 w-full bg-black text-white md:hidden transition-transform z-50 "
      :class="isMenuOpen ? 'block' : 'hidden'"
      style="
        top: var(--header-height);
        height: calc(100vh - var(--header-height));
      "
    >
      <div class="flex flex-col items-center h-full space-y-4 py-4">
        <NuxtLink
          v-if="!user"
          to="/"
          @click="toggleMenu"
          class="mobile-nav-link"
          >Home</NuxtLink
        >
        <!-- Mobile search button -->
        <button
          @click="openSearchMobile"
          class="mobile-nav-link flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Artists
        </button>
        <NuxtLink to="/saved" @click="toggleMenu" class="mobile-nav-link">
          Saved
          <client-only>
            <span v-if="savedCount" class="ml-1">({{ savedCount }})</span>
          </client-only>
        </NuxtLink>
        <client-only>
        <NuxtLink
          v-if="user && userSlug"
          :to="`${userSlug}`"
          @click="toggleMenu"
          class="mobile-nav-link"
        >
          Artist Link Page
        </NuxtLink>
        </client-only>
        <NuxtLink
          v-if="user"
          to="/dashboard"
          @click="toggleMenu"
          class="mobile-nav-link"
          >Dashboard</NuxtLink
        >
        <!-- <NuxtLink to="/videos" class="mobile-nav-link"  @click="toggleMenu">Videos</NuxtLink> -->

        <NuxtLink
          v-if="!user"
          to="/signup"
          @click="toggleMenu"
          class="mobile-nav-link"
          >Signup</NuxtLink
        >
        <NuxtLink
          v-if="!user"
          to="/login"
          @click="toggleMenu"
          class="mobile-nav-link"
          >Login</NuxtLink
        >
        <NuxtLink
          v-if="user"
          to="/"
          @click="logoutUserMobile"
          class="mobile-nav-link"
          >Logout</NuxtLink
        >
        <NuxtLink to="/contact" @click="toggleMenu" class="mobile-nav-link"
          >Contact</NuxtLink
        >
        <NuxtLink to="/agency" @click="toggleMenu" class="mobile-nav-link"
          >Agency</NuxtLink
        >
        <NuxtLink to="/demo" @click="toggleMenu" class="mobile-nav-link"
          >Demo</NuxtLink
        >
        <NuxtLink
          v-if="user"
          to="/account"
          @click="toggleMenu"
          class="mobile-nav-link"
          >Account</NuxtLink
        >
      </div>
    </nav>
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

.showfully {
  z-index: 9999999999999;
}

.block {
  display: block;
}

body {
  overflow-x: hidden; /* Prevent horizontal scrolling */
}
</style>
