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
        <h2 class="text-2xl font-semibold mb-2">Subscription</h2>
        <p class="text-gray-300">Plan: {{ billingData.subscription?.plan.nickname || 'Trial' }}</p>
        <p class="text-gray-300">Status: {{ billingData.subscription?.status || 'trialing' }}</p>
        <p class="text-gray-300" v-if="billingData.trialEndsAt">
          Trial Ends: {{ format(new Date(billingData.trialEndsAt), 'PPP') }}
        </p>
      </div>

      <div class="mt-8">
        <p class="text-gray-300 mb-4">Status: {{ subscriptionStatus }}</p>
        <button
          @click="goToBillingPortal"
          class="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all"
        >
          Manage Billing Info
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';

const config = useRuntimeConfig();

const user = useStrapiUser();
const token = useStrapiToken();
const client = useStrapiClient();

const email = ref('');
const password = ref('');
const subscriptionStatus = ref('Loading...');
const billingData = ref<any>(null);
const loading = ref(false); // ✅ Replaces useLoadingIndicator

onMounted(async () => {
  if (user.value) {
    email.value = user.value.email;
  }
  await fetchBillingInfo();
  await fetchSubscriptionStatus();
});

const fetchBillingInfo = async () => {
  loading.value = true;
  try {
    const { data, error } = await useFetch('/api/stripe/billing', {
      baseURL: config.public.strapiUrl,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (error.value) throw new Error(error.value.message || 'Billing info error');
    billingData.value = data.value;
    console.log('✅ Billing info:', billingData.value);
  } catch (err) {
    console.error('❌ Billing info failed:', err);
  } finally {
    loading.value = false;
  }
};

const updateAccount = async () => {
  const updates: Record<string, string> = {
    email: email.value,
    username: email.value,
  };
  if (password.value) updates.password = password.value;

  loading.value = true;
  try {
    await client(`/users/${user.value.id}`, {
      method: 'PUT',
      body: updates,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    alert('✅ Account updated!');
  } catch (err) {
    console.error('❌ Update failed:', err);
    alert('Failed to update account');
  } finally {
    loading.value = false;
  }
};

const fetchSubscriptionStatus = async () => {
  loading.value = true;
  try {
    const res: any = await client('stripe/subscription-status', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    subscriptionStatus.value = res?.status || 'Unknown';
  } catch (err) {
    subscriptionStatus.value = 'Error fetching status';
    console.error('❌ Subscription status error:', err);
  } finally {
    loading.value = false;
  }
};

const goToBillingPortal = async () => {
  loading.value = true;
  try {
    const res: any = await client('/create-billing-portal-session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (res?.url) {
      window.location.href = res.url;
    } else {
      alert('⚠️ Failed to open billing portal');
    }
  } catch (err) {
    console.error('❌ Billing portal error:', err);
    alert('Error opening billing portal');
  } finally {
    loading.value = false;
  }
};
</script>
