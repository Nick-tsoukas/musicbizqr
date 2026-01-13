<template>
  <div class="space-y-6">
    <!-- Scene Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">Share Moments</h1>
      <p class="text-white/60 text-lg">Sharing becomes distribution. Identity signal, not just a link.</p>
    </div>

    <!-- Three Panel Layout -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Panel 1: Moment Maker -->
      <div class="bg-gradient-to-b from-white/5 to-black/40 border border-white/10 rounded-2xl p-5">
        <h3 class="text-white font-semibold text-lg mb-4">Create a Moment</h3>

        <!-- Moment Type -->
        <div class="mb-4">
          <div class="text-white/60 text-sm mb-2">Moment Type</div>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="type in momentTypes"
              :key="type.id"
              type="button"
              :class="[
                'px-3 py-2 rounded-lg border text-left transition text-sm',
                selectedType === type.id
                  ? 'border-purple-400/50 bg-purple-500/20 text-purple-200'
                  : 'border-white/10 text-white/70 hover:bg-white/5',
              ]"
              @click="selectedType = type.id"
            >
              <span class="mr-1">{{ type.icon }}</span>
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- City -->
        <div class="mb-4">
          <div class="text-white/60 text-sm mb-2">City</div>
          <select
            v-model="selectedCity"
            class="w-full px-3 py-2 rounded-lg border border-white/10 bg-black/60 text-white text-sm focus:border-purple-400/50 focus:outline-none"
          >
            <option v-for="city in demoCities" :key="city.name" :value="city.name">
              {{ city.name }}, {{ city.state }}
            </option>
          </select>
        </div>

        <!-- Vibe -->
        <div class="mb-4">
          <div class="text-white/60 text-sm mb-2">Vibe</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="vibe in vibeOptions"
              :key="vibe.id"
              type="button"
              :class="[
                'px-3 py-1.5 rounded-full border text-xs transition',
                selectedVibe === vibe.id
                  ? 'border-purple-400/50 bg-purple-500/20 text-purple-200'
                  : 'border-white/10 text-white/60 hover:bg-white/5',
              ]"
              @click="selectedVibe = vibe.id"
            >
              {{ vibe.emoji }} {{ vibe.label }}
            </button>
          </div>
        </div>

        <!-- Generate Button -->
        <button
          type="button"
          class="w-full py-3 rounded-xl border border-purple-400/50 bg-purple-500/20 text-purple-200 font-semibold hover:bg-purple-500/30 transition"
          @click="handleCreateMoment"
        >
          Generate Moment
        </button>
      </div>

      <!-- Panel 2: Moment Card Preview -->
      <div class="bg-gradient-to-b from-white/5 to-black/40 border border-white/10 rounded-2xl p-5">
        <h3 class="text-white font-semibold text-lg mb-4">Moment Card</h3>

        <div
          v-if="latestMoment"
          class="bg-gradient-to-br from-purple-900/40 via-violet-900/30 to-black border border-purple-500/30 rounded-xl p-5 space-y-3"
        >
          <!-- Band Name -->
          <div class="text-purple-300 text-sm font-medium">{{ latestMoment.bandName }}</div>

          <!-- Headline -->
          <div class="text-2xl font-bold text-white">
            {{ getMomentType(latestMoment.momentType)?.headline || 'I was there.' }}
          </div>

          <!-- Subline -->
          <div class="text-white/70">
            {{ getMomentType(latestMoment.momentType)?.subline || 'And it was everything.' }}
          </div>

          <!-- City & Date -->
          <div class="flex items-center gap-3 text-sm text-white/60">
            <span>📍 {{ latestMoment.city }}</span>
            <span>📅 {{ formatDate(latestMoment.date) }}</span>
          </div>

          <!-- Vibe -->
          <div v-if="latestMoment.vibe" class="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm">
            {{ getVibe(latestMoment.vibe)?.emoji }} {{ getVibe(latestMoment.vibe)?.label }}
          </div>

          <!-- Share Button -->
          <button
            type="button"
            :class="[
              'w-full py-3 rounded-xl border font-semibold transition mt-4',
              latestMoment.shared
                ? 'border-green-400/50 bg-green-500/20 text-green-200'
                : 'border-purple-400/50 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30',
            ]"
            :disabled="latestMoment.shared"
            @click="handleShareMoment(latestMoment.id)"
          >
            {{ latestMoment.shared ? '✓ Shared' : 'Share Moment' }}
          </button>
        </div>

        <div v-else class="text-center py-12 text-white/40">
          <div class="text-4xl mb-2">✨</div>
          <div>Create a moment to see the preview</div>
        </div>
      </div>

      <!-- Panel 3: Moment Feed & Stats -->
      <div class="bg-gradient-to-b from-white/5 to-black/40 border border-white/10 rounded-2xl p-5">
        <h3 class="text-white font-semibold text-lg mb-4">Moment Feed</h3>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <div class="bg-black/30 border border-white/10 rounded-lg p-3 text-center">
            <div class="text-xl font-bold text-white tabular-nums">{{ demoStats.momentsCreated }}</div>
            <div class="text-white/50 text-xs">Created</div>
          </div>
          <div class="bg-black/30 border border-white/10 rounded-lg p-3 text-center">
            <div class="text-xl font-bold text-white tabular-nums">{{ demoStats.momentsShared }}</div>
            <div class="text-white/50 text-xs">Shared</div>
          </div>
          <div class="bg-black/30 border border-white/10 rounded-lg p-3 text-center">
            <div class="text-xl font-bold text-white tabular-nums">{{ demoStats.profileVisits }}</div>
            <div class="text-white/50 text-xs">Visits</div>
          </div>
        </div>

        <!-- Feed -->
        <div class="space-y-2 max-h-80 overflow-y-auto">
          <div
            v-for="moment in moments.slice(0, 8)"
            :key="moment.id"
            :class="[
              'px-3 py-2 rounded-lg border transition',
              moment.id === latestMoment?.id
                ? 'border-purple-400/40 bg-purple-500/10'
                : 'border-white/10 bg-black/20',
            ]"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="text-white text-sm font-medium truncate">
                  {{ getMomentType(moment.momentType)?.icon }} {{ getMomentType(moment.momentType)?.label }}
                </div>
                <div class="text-white/50 text-xs">
                  {{ moment.city }} · {{ formatDate(moment.date) }}
                </div>
              </div>
              <div v-if="moment.shared" class="shrink-0 text-green-400 text-xs">✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDemoShow } from '@/composables/useDemoShow'
import { momentTypes, vibeOptions, getMomentType, getVibe } from '@/data/demoMomentTemplates'

const {
  selectedBand,
  demoStats,
  moments,
  demoCities,
  createMoment,
  shareMoment,
} = useDemoShow()

const selectedType = ref('i-was-there')
const selectedCity = ref('Los Angeles')
const selectedVibe = ref('front-row')

const latestMoment = computed(() => moments.value[0] || null)

function handleCreateMoment() {
  createMoment(selectedType.value, selectedCity.value, selectedVibe.value)
}

function handleShareMoment(momentId) {
  shareMoment(momentId)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
