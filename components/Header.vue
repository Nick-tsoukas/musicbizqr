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

      <nav class=" z-50 hidden md:flex space-x-4">
        <NuxtLink v-if="!user" to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink v-if="user" to="/dashboard" class="nav-link"
          >Dashboard</NuxtLink
        >
      <client-only>
        <NuxtLink
          v-if="user && userSlug"
          :to="`/${userSlug}`"
          class="nav-link"
        >
          Artist Link Page
        </NuxtLink>
      </client-only>
        <NuxtLink v-if="!user" to="/signup" class="nav-link">Signup</NuxtLink>
        <NuxtLink v-if="!user" to="/login" class="nav-link">Login</NuxtLink>
        <NuxtLink to="/videos" class="nav-link">Tutorials</NuxtLink>

        <p v-if="user" @click="logoutUser" class="nav-link cursor-pointer">
          Logout
        </p>
        <NuxtLink to="/article" class="nav-link">Articles</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
        <NuxtLink v-if="user" to="/account" class="nav-link">Account</NuxtLink>
      </nav>

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
        <NuxtLink to="/videos" class="mobile-nav-link">Tutorials</NuxtLink>

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
        <NuxtLink
          v-if="user"
          to="/account"
          @click="toggleMenu"
          class="mobile-nav-link"
          >Account</NuxtLink
        >
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStrapiUser, useStrapiAuth, useFetch, useRuntimeConfig } from '#imports'
import { useRouter } from 'vue-router'
import { useAsyncData } from '#app'

const user = useStrapiUser()
const { logout } = useStrapiAuth()
const router = useRouter()
const config = useRuntimeConfig()

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
</script>

<style scoped>
header {
  z-index: 99999999 !important;
}
.nav-link {
  @apply text-white hover:bg-purple-700 rounded px-4 py-2 transition-colors;
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
