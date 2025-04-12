<template>
  <div class="max-w-2xl mx-auto px-6 py-10 bg-[#121212] text-white rounded-2xl shadow-lg">
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
    <div v-if="data">
  <p>Plan: {{ data.subscription?.plan.nickname || 'Trial' }}</p>
  <p>Status: {{ data.subscription?.status || 'trialing' }}</p>
  <p v-if="data.trialEndsAt">Trial Ends: {{ format(new Date(data.trialEndsAt), 'PPP') }}</p>
</div>
    <div class="mt-12 border-t border-gray-700 pt-8">
      <h2 class="text-2xl font-semibold mb-2">Subscription</h2>
      <p class="text-gray-300 mb-4">Status: {{ subscriptionStatus }}</p>

      <button
        @click="goToBillingPortal"
        class="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
      >
        Manage Billing Info
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const user = useStrapiUser();
const token = useStrapiToken();
const client = useStrapiClient();

const email = ref('');
const password = ref('');
const subscriptionStatus = ref('Loading...');

onMounted(() => {
  if (user.value) {
    email.value = user.value.email;
  }
  fetchSubscriptionStatus();
});

const { data, error } = await useFetch('/api/stripe/billing', {
  baseURL: 'http://localhost:1337',
  headers: {
    Authorization: `Bearer ${useStrapiToken().value}`,
  },
});

const updateAccount = async () => {
  const updates: any = { email: email.value, username: email.value };
  if (password.value) updates.password = password.value;

  try {
    await client(`/users/${user.value.id}`, {
      method: 'PUT',
      body: updates,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    alert('Account updated.');
  } catch (err) {
    console.error('Update failed:', err);
    alert('Failed to update account');
  }
};

const fetchSubscriptionStatus = async () => {
  try {
    const res = await client('/subscription-status', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    subscriptionStatus.value = res.status || 'Unknown';
  } catch (err) {
    subscriptionStatus.value = 'Error fetching status';
    console.error(err);
  }
};

const goToBillingPortal = async () => {
  try {
    const res = await client('/create-billing-portal-session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (res.url) {
      window.location.href = res.url;
    } else {
      alert('Failed to redirect to billing portal');
    }
  } catch (err) {
    console.error('Billing portal error:', err);
    alert('Error loading billing portal');
  }
};
</script>
