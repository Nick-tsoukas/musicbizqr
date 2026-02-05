<template>
  <div class="support-module">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <div class="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
      <h2 class="text-xl font-bold text-white">Support {{ bandName }}</h2>
    </div>

    <!-- Support Card -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 via-violet-900/20 to-pink-900/30 border border-purple-400/20 p-5">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div class="relative">
        <!-- Intro text -->
        <div class="text-center mb-5">
          <div class="text-2xl mb-2">💜</div>
          <p class="text-white/70 text-sm">Help fuel the music. Every bit counts.</p>
        </div>

        <!-- Quick Tip Amounts -->
        <div v-if="showQuickTips" class="mb-5">
          <div class="text-white/50 text-xs uppercase tracking-wider mb-3 text-center">Quick Tip</div>
          <div class="grid grid-cols-3 gap-3">
            <button 
              v-for="amount in quickTipAmounts"
              :key="amount"
              @click="handleQuickTip(amount)"
              :disabled="isProcessing"
              class="relative py-3 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
              :class="amount === 20 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20' 
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'"
            >
              ${{ amount }}
              <span v-if="amount === 20" class="absolute -top-2 -right-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full">
                Popular
              </span>
            </button>
          </div>
        </div>

        <!-- Expandable Payment Options -->
        <div class="space-y-3">
          <button
            v-if="!isExpanded && hasPaymentButtons"
            @click="isExpanded = true"
            class="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition flex items-center justify-center gap-2"
          >
            <span>More ways to support</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Expanded Payment Buttons -->
          <Transition name="expand">
            <div v-if="isExpanded || expandByDefault" class="space-y-3">
              <div
                v-for="btn in paymentButtons"
                :key="btn.key"
                class="bg-black/30 border border-white/10 rounded-xl p-4"
              >
                <div class="text-white font-semibold">{{ btn.title }}</div>
                <div v-if="btn.description" class="text-white/60 text-sm mt-1">{{ btn.description }}</div>

                <!-- Pricing Mode: Min Amount -->
                <div v-if="btn.pricingMode === 'min'" class="mt-3">
                  <div class="text-white/50 text-xs mb-2">Enter an amount</div>
                  <div class="flex items-center gap-2">
                    <span class="text-white/60">$</span>
                    <input
                      v-model.number="paymentAmounts[btn.key]"
                      type="number"
                      step="1"
                      min="0"
                      class="w-28 px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-white text-sm"
                    />
                    <span v-if="btn.minAmount" class="text-white/40 text-xs">
                      Min ${{ btn.minAmount }}
                    </span>
                  </div>
                </div>

                <!-- Pricing Mode: Presets -->
                <div v-else-if="btn.pricingMode === 'presets'" class="mt-3">
                  <div class="text-white/50 text-xs mb-2">Select an amount</div>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="amt in (btn.presetAmounts || [])"
                      :key="amt"
                      type="button"
                      @click="selectPresetAmount(btn.key, Number(amt))"
                      class="px-3 py-2 rounded-lg border border-white/20 text-white text-sm hover:bg-white/10 transition"
                      :class="{ 'bg-purple-600/40 border-purple-400/50': !customAmountActive[btn.key] && Number(paymentAmounts[btn.key]) === Number(amt) }"
                    >
                      ${{ amt }}
                    </button>
                    <button
                      type="button"
                      @click="toggleCustomAmount(btn.key)"
                      class="px-3 py-2 rounded-lg border border-white/20 text-white text-sm hover:bg-white/10 transition"
                      :class="{ 'bg-purple-600/40 border-purple-400/50': customAmountActive[btn.key] }"
                    >
                      + Custom
                    </button>
                  </div>
                  <!-- Custom amount input -->
                  <div v-if="customAmountActive[btn.key]" class="mt-3 flex items-center gap-2">
                    <span class="text-white/60">$</span>
                    <input
                      v-model.number="paymentAmounts[btn.key]"
                      type="number"
                      step="1"
                      min="1"
                      placeholder="Enter amount"
                      class="w-28 px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-white text-sm"
                    />
                  </div>
                </div>

                <!-- Pricing Mode: Fixed -->
                <div v-else-if="btn.pricingMode === 'fixed'" class="mt-3">
                  <div class="text-white/50 text-xs mb-1">Fixed price</div>
                  <div class="text-white text-xl font-semibold">${{ btn.fixedAmount }}</div>
                </div>

                <!-- Checkout Button -->
                <button
                  type="button"
                  @click="handleCheckout(btn)"
                  :disabled="isProcessing"
                  class="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold transition disabled:opacity-50"
                >
                  <span v-if="processingKey === btn.key">Processing...</span>
                  <span v-else>Continue to Payment</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'

const props = defineProps({
  bandName: {
    type: String,
    default: 'the band'
  },
  paymentButtons: {
    type: Array,
    default: () => []
  },
  pageMode: {
    type: String,
    default: 'QUIET'
  },
  showQuickTips: {
    type: Boolean,
    default: true
  },
  quickTipAmounts: {
    type: Array,
    default: () => [5, 10, 20]
  }
})

const emit = defineEmits(['quick-tip', 'checkout'])

const isExpanded = ref(false)
const isProcessing = ref(false)
const processingKey = ref(null)
const paymentAmounts = reactive({})
const customAmountActive = reactive({})

// Expand by default on SHOW_DAY mode
const expandByDefault = computed(() => {
  return props.pageMode === 'SHOW_DAY'
})

const hasPaymentButtons = computed(() => {
  return props.paymentButtons.length > 0
})

// Initialize payment amounts from button defaults
watch(() => props.paymentButtons, (buttons) => {
  buttons.forEach(btn => {
    if (btn.pricingMode === 'fixed') {
      paymentAmounts[btn.key] = btn.fixedAmount
    } else if (btn.pricingMode === 'presets' && btn.presetAmounts?.length) {
      paymentAmounts[btn.key] = btn.presetAmounts[0]
    } else if (btn.pricingMode === 'min') {
      paymentAmounts[btn.key] = btn.minAmount || 5
    }
  })
}, { immediate: true })

function handleQuickTip(amount) {
  emit('quick-tip', amount)
}

function handleCheckout(btn) {
  const amount = paymentAmounts[btn.key]
  emit('checkout', { button: btn, amount })
}

function selectPresetAmount(key, amount) {
  customAmountActive[key] = false
  paymentAmounts[key] = amount
}

function toggleCustomAmount(key) {
  customAmountActive[key] = !customAmountActive[key]
  if (customAmountActive[key]) {
    // Clear the amount so user can enter fresh
    paymentAmounts[key] = null
  }
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
}
</style>
