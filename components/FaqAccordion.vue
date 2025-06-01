<template>
  <div class="w-full max-w-5xl mx-auto">
    <div
      v-for="(item, idx) in faqs"
      :key="idx"
      class="border-b border-gray-200 last:border-none"
    >
      <button
        @click="toggle(idx)"
        class="flex justify-between w-full py-4 px-3 focus:outline-none hover:bg-gray-900"
      >
        <span class="text-left text-lg font-medium text-white">
          {{ item.question }}
        </span>
        <svg
          :class="{'transform rotate-180': openIndex === idx}"
          class="w-6 h-6 text-whitetransition-transform duration-200"
          fill="none"
          stroke="white"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        v-show="openIndex === idx"
        class="px-3 pb-4 text-gray-100 prose prose-sm"
      >
        {{ item.answer }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';

const props = defineProps({
  faqs: {
    type: Array,
    required: true,
    validator: (arr) =>
      arr.every(
        (x) =>
          typeof x.question === 'string' && typeof x.answer === 'string'
      ),
  },
});

const openIndex = ref(null);

function toggle(i) {
  openIndex.value = openIndex.value === i ? null : i;
}
</script>

<style scoped>
/* Optional: style the prose text if you want Markdown‐style paragraphs */
.prose-sm p {
  margin-bottom: 0.75rem;
}
</style>
