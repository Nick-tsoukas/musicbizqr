<template>
  <nav 
    v-if="user && userBand" 
    class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 safe-area-pb"
  >
    <!-- Gradient glow effect -->
    <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
    
    <div class="flex items-center justify-around px-2 py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item group"
        :class="{ 'is-active': isActive(item.path) }"
      >
        <!-- Active indicator pill -->
        <span 
          v-if="isActive(item.path)" 
          class="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-accent to-neon-purple"
        ></span>
        
        <!-- Icon with glow on active -->
        <span 
          class="nav-icon-wrap"
          :class="{ 'active-glow': isActive(item.path) }"
        >
          <component :is="item.icon" class="w-5 h-5" />
        </span>
        
        <!-- Label -->
        <span class="nav-label">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRoute } from 'vue-router'
import { useStrapiUser } from '#imports'
import { useRuntimeConfig, useAsyncData } from '#app'

const route = useRoute()
const user = useStrapiUser()
const config = useRuntimeConfig()

const { data: bandData } = await useAsyncData(
  'user-band-nav',
  () => user.value?.id 
    ? $fetch(`${config.public.strapiUrl}/api/bands`, {
        params: {
          'filters[users_permissions_user][id][$eq]': user.value.id,
          'fields[0]': 'slug',
          'fields[1]': 'name',
        },
      })
    : Promise.resolve(null),
  {
    server: true,
    watch: () => user.value?.id,
  }
)

const userBand = computed(() => {
  const list = bandData.value?.data || []
  if (!list.length) return null
  const item = list[0]
  return {
    slug: item.attributes?.slug ?? item.slug,
    name: item.attributes?.name ?? item.name,
  }
})

const DashIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' })
])

const ArtistIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' })
])

const AnalyticsIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])

const QrIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' })
])

const navItems = computed(() => {
  if (!userBand.value) return []
  return [
    { path: '/dashboard', label: 'Dash', icon: DashIcon },
    { path: `/${userBand.value.slug}`, label: 'Artist', icon: ArtistIcon },
    { path: `/dashboard/analytics/${userBand.value.slug}`, label: 'Analytics', icon: AnalyticsIcon },
    { path: '/dashboard/qrs', label: 'QRs', icon: QrIcon },
  ]
})

function isActive(path) {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.nav-item {
  @apply flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 relative;
  @apply text-gray-500;
}

.nav-item.is-active {
  @apply text-white;
}

.nav-item:active {
  @apply scale-95;
}

.nav-icon-wrap {
  @apply w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200;
}

.nav-item.is-active .nav-icon-wrap {
  @apply bg-white/10;
}

.active-glow {
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3), 0 0 40px rgba(145, 0, 255, 0.15);
}

.nav-label {
  @apply text-[10px] font-semibold tracking-wide uppercase;
}
</style>
