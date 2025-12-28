<template>
  <div class="min-h-screen bg-black text-white px-6 py-10 pt-[var(--header-height)]">
    <div class="max-w-2xl mx-auto bg-[#121212] p-8 rounded-2xl shadow-xl">
      <h1 class="text-3xl font-semibold mb-8">Account Settings</h1>

      <form @submit.prevent="updateAccount" class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            v-model="email"
            required
            class="w-full bg-[#1e1e1e] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            v-model="password"
            placeholder="Leave blank to keep current password"
            class="w-full bg-[#1e1e1e] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-xl transition-all"
        >
          Update Account
        </button>
      </form>

      <div v-if="billingData" class="mt-12 border-t border-gray-700 pt-8">
        <h2 class="text-2xl font-semibold mb-2">Subscription Status</h2>

        <p class="text-gray-300">
          Plan: {{ planLabel }}
        </p>

        <p class="text-gray-300">
          Status:
          <span
            :class="{ 'text-red-400 font-semibold': isPastDue }"
            class="capitalize"
          >
            {{ displayStatus }}
          </span>
        </p>

        <p v-if="showTrialEnds" class="text-gray-300">
          Trial Ends: {{ format(new Date(billingData.trialEndsAt), 'PPP') }}
        </p>
        <p v-if="billingData.subscription" class="text-gray-300">
          Renews at $7.00 per month
        </p>
      </div>

      <div class="mt-8">
        <button
          @click="goToBillingPortal()"
          class="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
        >
          {{ isPastDue ? 'Pay Invoice' : 'Manage Billing Info' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';

const config = useRuntimeConfig();
const user   = useStrapiUser();
const token  = useStrapiToken();
const client = useStrapiClient();

const email       = ref('');
const password    = ref('');
const billingData = ref<any>(null);

// derive statuses
const strapiStatus = computed(() => user.value?.subscriptionStatus || '');
const stripeStatus = computed(() => billingData.value?.subscription?.status || 'trialing');
const normalizedStatus = computed(() =>
  strapiStatus.value === 'pastDue' ? 'pastDue' : stripeStatus.value
);
const isTrialing = computed(() => normalizedStatus.value === 'trialing');
const isPastDue = computed(() =>
  normalizedStatus.value === 'past_due' || normalizedStatus.value === 'pastDue'
);
const displayStatus = computed(() =>
  isPastDue.value
    ? 'Past Due'
    : normalizedStatus.value.charAt(0).toUpperCase() +
      normalizedStatus.value.slice(1)
);

const planLabel = computed(() =>
  billingData.value?.subscription?.plan?.nickname || (isTrialing.value ? 'Trial' : 'Monthly')
);

const showTrialEnds = computed(() => {
  if (!isTrialing.value) return false;
  const t = billingData.value?.trialEndsAt;
  if (!t) return false;
  const d = new Date(t);
  return !Number.isNaN(d.getTime()) && d.getTime() > Date.now();
});

onMounted(async () => {
  if (user.value) email.value = user.value.email;
  await fetchBillingInfo();
});

async function fetchBillingInfo() {
  try {
    const { data, error } = await useFetch('/api/stripe/billing', {
      baseURL: config.public.strapiUrl,
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (error.value) throw error.value;
    billingData.value = data.value;
    // sync the Strapi store
    user.value.subscriptionStatus = normalizedStatus.value;
  } catch (e) {
    console.error('Billing fetch error', e);
  }
}

async function updateAccount() {
  const updates: Record<string, string> = {
    email:    email.value,
    username: email.value,
  };
  if (password.value) updates.password = password.value;

  try {
    await client(`/users/${user.value.id}`, {
      method: 'PUT',
      body:   updates,
      headers: { Authorization: `Bearer ${token.value}` },
    });
    alert('Account updated!');
  } catch (e) {
    console.error('Update error', e);
    alert('Failed to update account');
  }
}

async function goToBillingPortal() {
  try {
    const res: any = await client('stripe/create-billing-portal-session', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (res?.url) {
      window.location.href = res.url;
    } else {
      alert('Unable to open billing portal');
    }
  } catch (e) {
    console.error('Portal error', e);
    alert('Error opening billing portal');
  }
}
</script>
