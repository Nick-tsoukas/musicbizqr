<template>
  <div v-if="showBanner" class="banner banner-danger mb-6">
    <div class="banner-icon">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <div class="banner-content">
      <h3 class="banner-title">Payment Overdue</h3>
      <p class="banner-text">
        You have an outstanding invoice. Please pay now to avoid service interruption.
      </p>
    </div>
    <button
      @click="goToBillingPortal"
      class="banner-button banner-button-danger"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      Pay Now
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const token = useStrapiToken()
const client = useStrapiClient()

// Props from Dashboard (plain JS)
const props = defineProps({
  status: { type: String, default: null },            // 'trialing' | 'active' | 'past_due' | ...
  daysLeft: { type: Number, default: null },          // number or null
  hasPaymentMethod: { type: Boolean, default: null }, // boolean or null
})

// Show if Stripe says past_due-like OR trial is over + no card on file
const showBanner = computed(() => {
  const s = props.status || ''
  const pastDueLike = ['past_due', 'unpaid', 'incomplete', 'incomplete_expired'].includes(s)
  const trialOverNoCard = (props.daysLeft === 0 || props.daysLeft === null) && props.hasPaymentMethod === false
  return pastDueLike || trialOverNoCard
})

async function goToBillingPortal() {
  try {
    const res = await client('stripe/create-billing-portal-session', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
    })
    if (res && res.url) {
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

<style scoped>
.banner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid;
}

@media (min-width: 640px) {
  .banner {
    flex-direction: row;
    align-items: center;
  }
}

.banner-danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.banner-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.banner-danger .banner-icon {
  background: rgba(239, 68, 68, 0.2);
  color: rgb(248, 113, 113);
}

.banner-content {
  flex: 1;
  min-width: 0;
}

.banner-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.banner-danger .banner-title {
  color: rgb(252, 165, 165);
}

.banner-text {
  font-size: 0.875rem;
  line-height: 1.5;
}

.banner-danger .banner-text {
  color: rgba(252, 165, 165, 0.8);
}

.banner-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  white-space: nowrap;
  border: none;
  cursor: pointer;
}

.banner-button-danger {
  background: rgb(239, 68, 68);
  color: white;
}

.banner-button-danger:hover {
  background: rgb(220, 38, 38);
  transform: translateY(-1px);
}
</style>
