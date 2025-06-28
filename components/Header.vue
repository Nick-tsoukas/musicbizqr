<template>
  <header
    class="bg-black text-white shadow-lg fixed top-0 left-0 right-0 z-50"
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
      <img src="@/assets/musicbizlogo.png" class="h-8" />

      <nav class="hidden md:flex space-x-4">
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
        <p v-if="user" @click="logoutUser" class="nav-link cursor-pointer">
          Logout
        </p>
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
      class="fixed left-0 w-full bg-black text-white md:hidden transition-transform z-40"
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
import { ref, watch } from 'vue'
import { useStrapiUser, useStrapiAuth, useFetch, useRuntimeConfig } from '#imports'
import { useRouter } from 'vue-router'

const user = useStrapiUser()
const { logout } = useStrapiAuth()
const router = useRouter()
const config = useRuntimeConfig()

// will hold the current user’s band slug
const userSlug = ref(null)

watch(
  () => user.value?.id,
  async (id) => {
    if (!id) return

    try {
      const { data, error } = await useFetch(
        `${config.public.strapiUrl}/api/bands`,
        {
          params: {
            'filters[users_permissions_user][id][$eq]': id,
            'fields[0]': 'slug',
          },
        }
      )

      if (error.value) {
        console.error('Error fetching user band:', error.value)
        return
      }

      const list = data.value?.data
      if (list?.length) {
        const item = list[0]
        // handle both shapes: flatten or attributes wrapper
        const slug =
          item.attributes?.slug != null
            ? item.attributes.slug
            : item.slug

        if (slug) {
          userSlug.value = slug
          console.log('✅ My band slug:', slug)
        } else {
          console.warn('⚠️ Fetched band had no slug field:', item)
          userSlug.value = null
        }
      } else {
        console.warn('⚠️ No band found for user', id)
        userSlug.value = null
      }
    } catch (e) {
      console.error('Unexpected error fetching band:', e)
      userSlug.value = null
    }
  },
  { immediate: true }
)

// computed link
const slugLink = ref(null)
watch(userSlug, s => slugLink.value = s ? `/${s}` : null)

// header/menu state & actions
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