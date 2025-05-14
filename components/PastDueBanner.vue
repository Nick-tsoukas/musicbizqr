<!-- components/PastDueBanner.vue -->
<template>
  <div v-if="showBanner" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-md mb-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium text-red-800 mb-1">Payment Overdue</p>
        <p class="text-red-700 text-sm">
          You have an outstanding invoice. Please pay now to avoid interruption.
        </p>
      </div>
      <button
        @click="goToBillingPortal"
        class="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Pay Now
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'


const user = useStrapiUser()
const client = useStrapiClient()
const token = useStrapiToken()

// Show the banner if the user’s subscriptionStatus is "pastDue"
const showBanner = computed(() => user.value?.subscriptionStatus === 'pastDue')

async function goToBillingPortal() {
  try {
    const res: any = await client('stripe/create-billing-portal-session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    if (res.url) {
      window.location.href = res.url
    } else {
      alert('⚠️ Unable to open billing portal')
    }
  } catch (err) {
    console.error('❌ Billing portal error:', err)
    alert('Error opening billing portal')
  }
}
</script>
