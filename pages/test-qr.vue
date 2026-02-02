<template>
  <div class="min-h-screen bg-black flex flex-col items-center justify-center p-8">
    <h1 class="text-white text-2xl font-bold mb-4">QR Test Page</h1>
    <p class="text-white/70 mb-8">Scan this QR with your phone camera</p>
    
    <!-- QR Code -->
    <div class="bg-white p-6 rounded-2xl">
      <ClientOnly>
        <QrcodeVue 
          :value="testUrl"
          :size="250"
          level="M"
          render-as="svg"
        />
      </ClientOnly>
    </div>
    
    <p class="text-white/50 text-sm mt-6">Should open: {{ testUrl }}</p>
    
    <div class="mt-8 space-y-4 text-center">
      <p class="text-green-400" v-if="scanned">✓ If you see this after scanning, QRs work!</p>
      <p class="text-white/70">Test URL: <code class="bg-white/10 px-2 py-1 rounded">{{ testUrl }}</code></p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'

const route = useRoute()
const scanned = computed(() => route.query.scanned === '1')

// This QR encodes a link back to this page with ?scanned=1
const testUrl = 'https://musicbizqr.com/test-qr?scanned=1'
</script>
