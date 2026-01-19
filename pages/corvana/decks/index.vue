<template>
  <div class="min-h-screen bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-white mb-2">Corvana Presentations</h1>
      <p class="text-gray-400 mb-8">Internal deck viewer and presentation system</p>
      
      <a 
        href="/corvana/decks/mbq-flagship-v1"
        class="block bg-gray-800 border border-gray-700 rounded-xl p-6 cursor-pointer hover:border-purple-500 transition-all no-underline"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-purple-600/20 p-3 rounded-lg">
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span class="text-purple-400 text-sm font-medium bg-purple-600/20 px-3 py-1 rounded-full">v1</span>
        </div>
        
        <h2 class="text-xl font-semibold text-white mb-2">MBQ Flagship Deck</h2>
        <p class="text-gray-400 mb-4">Live Artist Surface + Momentum Intelligence Layer</p>
        
        <div class="flex justify-end">
          <span class="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            Open Deck
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
// Using native anchor tag for navigation
</script>
