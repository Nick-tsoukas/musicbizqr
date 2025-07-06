<template>
    <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 flex justify-between items-center">
      <div>
        <strong>Your 30-day trial ends in {{ daysLeft }} {{ daysLeft === 1 ? 'day' : 'days' }}.</strong>
        <span class="ml-2 text-sm text-gray-700">Add a payment method now to keep your access uninterrupted.</span>
      </div>
      <button
        @click="handleAddPayment"
        class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
      >
        Add Payment
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, onMounted } from 'vue'
  
  const props = defineProps<{ daysLeft: number }>()
  const emit = defineEmits<{
    (e: 'add-payment'): void
  }>()
  
  onMounted(() => {
    console.debug('[TrialBanner] mounted with daysLeft =', props.daysLeft)
  })
  
  function handleAddPayment() {
    console.debug('[TrialBanner] Add Payment button clicked')
    emit('add-payment')
  }
  </script>
  
  <style scoped>
  /* Customize banner styles as needed */
  </style>
  