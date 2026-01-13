<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
    <!-- Password Gate -->
    <div v-if="!store.passwordUnlocked" class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-sm">
        <div class="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
          <div class="text-center mb-6">
            <div class="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 class="text-xl font-semibold text-white">Agency Portal</h1>
            <p class="text-gray-400 text-sm mt-1">Enter password to continue</p>
          </div>
          
          <form @submit.prevent="handleLogin">
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              :class="{ 'border-red-500': loginError }"
            />
            <p v-if="loginError" class="text-red-400 text-sm mt-2">Invalid password</p>
            <button
              type="submit"
              class="w-full mt-4 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors"
            >
              Enter Portal
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Main Layout -->
    <div v-else class="flex min-h-screen">
      <!-- Desktop Sidebar -->
      <AgencySidebar class="hidden lg:flex" />

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-h-screen lg:ml-64">
        <!-- Header -->
        <header class="sticky top-0 z-40 bg-gray-950 backdrop-blur-md border-b border-gray-800">
          <div class="px-4 lg:px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button 
                @click="mobileMenuOpen = true"
                class="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 class="text-lg font-semibold text-white">{{ store.org.name }}</h1>
                <span class="text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">V1 (Mock)</span>
              </div>
            </div>
            <button 
              @click="store.lockPortal()"
              class="text-gray-400 hover:text-white text-sm flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 pt-2">
          <slot />
        </main>
      </div>

      <!-- Mobile Navigation -->
      <AgencyMobileNav />

      <!-- Mobile Menu Overlay -->
      <Teleport to="body">
        <Transition name="fade">
          <div 
            v-if="mobileMenuOpen" 
            class="fixed inset-0 z-50 lg:hidden"
          >
            <div class="absolute inset-0 bg-black/60" @click="mobileMenuOpen = false" />
            <div class="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800">
              <AgencySidebar @navigate="mobileMenuOpen = false" :is-mobile="true" />
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAgencyPortalStore } from '~/stores/agencyPortal'

const store = useAgencyPortalStore()
const password = ref('')
const loginError = ref(false)
const mobileMenuOpen = ref(false)

function handleLogin() {
  loginError.value = false
  if (!store.unlockPortal(password.value)) {
    loginError.value = true
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
