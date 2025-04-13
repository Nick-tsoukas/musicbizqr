<template>
  <div class="min-h-screen bg-[#121212] text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold">Contact Us</h2>
        <p class="mt-2 text-sm text-gray-400">
          We'd love to hear from you. Fill out the form below and we'll get back to you soon.
        </p>
      </div>
      <form class="space-y-6" @submit.prevent="submitForm">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium mb-1">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autocomplete="name"
              required
              v-model="form.name"
              placeholder="Your name"
              class="w-full bg-[#1e1e1e] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="form.email"
              placeholder="Your email"
              class="w-full bg-[#1e1e1e] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label for="message" class="block text-sm font-medium mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              required
              v-model="form.message"
              placeholder="Your message"
              class="w-full bg-[#1e1e1e] border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
            ></textarea>
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-xl transition-all"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  message: '',
});

const submitForm = () => {
  console.log('📩 Submitting contact form:', form.value);
  alert('Thank you for contacting us!');
  form.value = { name: '', email: '', message: '' };
};
</script>
