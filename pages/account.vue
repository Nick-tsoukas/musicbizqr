<template>
  <div class="min-h-screen bg-black text-white px-6 py-10">
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
          Plan: {{ billingData.subscription?.plan.nickname || 'Trial' }}
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
        <p class="text-gray-300" v-if="billingData.trialEndsAt">
          Trial Ends: {{ format(new Date(billingData.trialEndsAt), 'PPP') }}
        </p>
        <p class="text-gray-300" v-if="billingData.trialEndsAt">
          Renews at $7.00 per month
        </p>
      </div>

      <div class="mt-8">
        <button
          @click="isPastDue ? payInvoice() : goToBillingPortal()"
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
const user   = useStrapiUser();       // Strapi user store
const token  = useStrapiToken();
const client = useStrapiClient();

const email       = ref('');
const password    = ref('');
const billingData = ref<any>(null);
const loading     = ref(false);

// 1) The status your Strapi DB has stored:
const strapiStatus = computed<string>(() =>
  user.value?.subscriptionStatus || ''
);

// 2) The status Stripe returns via billingData:
const stripeStatus = computed<string>(() =>
  billingData.value?.subscription?.status || 'trialing'
);

// 3) Final normalized status (Strapi’s overrides Stripe’s only when pastDue)
const normalizedStatus = computed<string>(() =>
  strapiStatus.value === 'pastDue'
    ? 'pastDue'
    : stripeStatus.value
);

// 4) Past-due flag if either form matches
const isPastDue = computed<boolean>(() =>
  normalizedStatus.value === 'past_due' ||
  normalizedStatus.value === 'pastDue'
);

// 5) Display-friendly text
const displayStatus = computed<string>(() => {
  if (isPastDue.value) return 'Past Due';
  // Capitalize other statuses
  return normalizedStatus.value.charAt(0).toUpperCase() +
         normalizedStatus.value.slice(1);
});

onMounted(async () => {
  if (user.value) {
    email.value = user.value.email;
  }
  await fetchBillingInfo();
});

const fetchBillingInfo = async () => {
  loading.value = true;
  try {
    const { data, error } = await useFetch('/api/stripe/billing', {
      baseURL: config.public.strapiUrl,
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (error.value) {
      throw new Error(error.value.message || 'Billing info error');
    }
    billingData.value = data.value;
    // Sync Strapi store if you want UI components to see the new status:
    user.value.subscriptionStatus = normalizedS
