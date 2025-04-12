<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';

const user = useStrapiUser();
const token = useStrapiToken();
const client = useStrapiClient();

const email = ref('');
const password = ref('');
const subscriptionStatus = ref('Loading...');
const billingData = ref<any>(null);

onMounted(async () => {
  if (user.value) {
    email.value = user.value.email;
  }
  await fetchBillingInfo();
  await fetchSubscriptionStatus();
});

const fetchBillingInfo = async () => {
  try {
    const { data } = await useFetch('/api/stripe/billing', {
      baseURL: 'https://your-production-api.com', // ✅ Set correct prod baseURL here
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    billingData.value = data.value;
  } catch (err) {
    console.error('Error fetching billing info:', err);
  }
};

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
