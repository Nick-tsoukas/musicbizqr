<template>
  <div
    v-if="showBanner"
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

interface StatusData {
  status: string
  gracePeriodStart: string | null
}

const statusData = ref<StatusData | null>(null)
const portalUrl   = ref<string | null>(null)

async function loadStatus() {
  try {
    const res = await $fetch<StatusData>('/stripe/subscription-status', {
      credentials: 'include'
    })
    console.log('Fetched subscription status:', res)
    statusData.value = res
  } catch (err) {
    console.error('Error fetching subscription status:', err)
  }
}

onMounted(loadStatus)

const isPastDue = computed(() => statusData.value?.status === 'pastDue')

const daysLeft = computed(() => {
  if (!statusData.value?.gracePeriodStart) return 0
  const startMs     = new Date(statusData.value.gracePeriodStart).getTime()
  const elapsedMs   = Date.now() - startMs
  const msPerDay    = 24 * 60 * 60 * 1000
  const remainingMs = 3 * msPerDay - elapsedMs
  return remainingMs > 0 ? Math.ceil(remainingMs / msPerDay) : 0
})

const showBanner = computed(() => {
  if (!statusData.value) return false
  if (isPastDue.value && daysLeft.value > 0) {
    return true
  }
  // debug log so you can see why it’s hidden
  console.log(
    'PastDueBanner hidden →',
    'status=', statusData.value.status,
    'daysLeft=', daysLeft.value
  )
  return false
})

async function goToBilling() {
  try {
    if (!portalUrl.value) {
      const res = await $fetch<{ url: string }>('/stripe/create-billing-portal-session', {
        method: 'POST',
        credentials: 'include'
      })
      portalUrl.value = res.url
    }
    if (portalUrl.value) {
      window.location.href = portalUrl.value
    }
  } catch (err) {
    console.error('Error creating billing portal session:', err)
  }
}
</script>
