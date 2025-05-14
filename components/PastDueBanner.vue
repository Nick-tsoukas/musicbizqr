<template>
  <div
    v-if="isPastDue && daysLeft > 0"
    class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-md mb-6"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium text-red-800 mb-1">Payment Overdue</p>
        <p class="text-red-700 text-sm">
          You have an outstanding invoice. Please pay within
          <strong>{{ daysLeft }} day<span v-if="daysLeft !== 1">s</span></strong>
          to avoid interruption.
        </p>
      </div>
      <button
        @click="goToBilling"
        class="ml-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        Pay Now
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFetch } from '#app'

// reactive state
const statusData = ref<{
  status: string
  gracePeriodStart: string | null
} | null>(null)
const portalUrl = ref<string | null>(null)

// fetch user’s subscription status on mount
async function loadStatus() {
  const { data } = await useFetch('/stripe/subscription-status')
  statusData.value = data.value
}
onMounted(loadStatus)

// compute flags
const isPastDue = computed(() => statusData.value?.status === 'pastDue')
const daysLeft = computed(() => {
  if (!statusData.value?.gracePeriodStart) return 0
  const start = new Date(statusData.value.gracePeriodStart).getTime()
  const elapsed = Date.now() - start
  const remainingMs = 3 * 24 * 60 * 60 * 1000 - elapsed
  return remainingMs > 0 ? Math.ceil(remainingMs / (24 * 60 * 60 * 1000)) : 0
})

// create (or reuse) a portal session
async function fetchPortal() {
  const { data } = await useFetch('/stripe/create-billing-portal-session', {
    method: 'POST',
  })
  portalUrl.value = data.value.url
}

// redirect user
function goToBilling() {
  if (!portalUrl.value) {
    fetchPortal().then(() => {
      if (portalUrl.value) window.location.href = portalUrl.value
    })
  } else {
    window.location.href = portalUrl.value
  }
}
</script>
