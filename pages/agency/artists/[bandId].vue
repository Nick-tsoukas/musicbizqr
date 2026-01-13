<template>
  <AgencyLayout>
    <div class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <button 
        @click="router.push('/agency')"
        class="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Inbox
      </button>

      <!-- Artist Header -->
      <div v-if="band" class="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-6">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center border border-gray-700">
            <span class="text-violet-400 font-bold text-2xl">{{ band.name.charAt(0) }}</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-2xl font-bold text-white">{{ band.name }}</h1>
              <span :class="tierClass" class="text-xs px-2 py-1 rounded-lg font-medium">
                Tier {{ band.tier }}
              </span>
              <SignalPill v-if="momentumState" :state="momentumState" />
            </div>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span>{{ band.genre }}</span>
              <span>{{ band.homeCity }}</span>
            </div>
          </div>
          
          <!-- Owner Dropdown -->
          <div class="flex-shrink-0">
            <button 
              @click="assignDrawerOpen = true"
              class="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition-colors"
            >
              <div class="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">
                {{ owner?.name?.charAt(0) || '?' }}
              </div>
              <span class="text-gray-300">{{ owner?.name?.split(' ')[0] || 'Unassigned' }}</span>
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Top Signals Row -->
      <div v-if="topSignals.length" class="mb-6">
        <h2 class="text-white font-semibold mb-3">Top Signals</h2>
        <div class="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div 
            v-for="signal in topSignals" 
            :key="signal.id"
            class="flex-shrink-0 w-64 bg-gray-900/60 border border-gray-800 rounded-xl p-4"
            :class="signalBorderClass(signal.accent)"
          >
            <div class="text-xs font-bold tracking-wide" :class="signalTextClass(signal.accent)">
              {{ signal.headline }}
            </div>
            <div class="text-3xl font-bold mt-2" :class="signalTextClass(signal.accent)">
              {{ signal.hero }}
            </div>
            <p class="text-gray-400 text-xs mt-2 line-clamp-2">{{ signal.proof }}</p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-xs text-gray-500">{{ signal.windowLabel }}</span>
              <button 
                @click="openProofDrawer(signal)"
                class="text-xs text-violet-400 hover:text-violet-300"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Suggested Playbook -->
      <div v-if="suggestedPlaybook" class="mb-6">
        <PlaybookPanel 
          :playbook="suggestedPlaybook" 
          @create-task="openTaskDrawer(topSignals[0])"
        />
      </div>

      <!-- Recent Signals -->
      <div class="mb-6">
        <h2 class="text-white font-semibold mb-3">Recent Signals</h2>
        <div class="space-y-3">
          <SignalFeedItem
            v-for="signal in signals"
            :key="signal.id"
            :signal="signal"
            @open="() => {}"
            @handle="handleSignal"
            @task="openTaskDrawer"
          />
        </div>
        <div v-if="!signals.length" class="text-center py-8 text-gray-500 text-sm">
          No signals for this artist
        </div>
      </div>

      <!-- Tasks -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-white font-semibold">Tasks</h2>
          <button 
            @click="openTaskDrawer(null)"
            class="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>
        <div class="space-y-2">
          <div 
            v-for="task in bandTasks" 
            :key="task.id"
            class="flex items-center gap-3 p-3 bg-gray-900/60 border border-gray-800 rounded-xl"
          >
            <button 
              @click="toggleTask(task)"
              class="w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors"
              :class="task.status === 'done' ? 'bg-emerald-600 border-emerald-600' : 'border-gray-600 hover:border-gray-500'"
            >
              <svg v-if="task.status === 'done'" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <div class="flex-1 min-w-0">
              <div class="text-sm text-white" :class="{ 'line-through opacity-50': task.status === 'done' }">
                {{ task.title }}
              </div>
              <div v-if="task.dueAt" class="text-xs text-gray-500">
                Due {{ formatDate(task.dueAt) }}
              </div>
            </div>
            <button 
              @click="editTask(task)"
              class="p-1.5 text-gray-500 hover:text-gray-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div v-if="!bandTasks.length" class="text-center py-8 text-gray-500 text-sm border border-dashed border-gray-800 rounded-xl">
          No tasks yet
        </div>
      </div>
    </div>

    <!-- Drawers -->
    <AssignOwnerDrawer
      :is-open="assignDrawerOpen"
      :band-id="bandId"
      @close="assignDrawerOpen = false"
    />

    <ProofDrawer
      :is-open="proofDrawerOpen"
      :signal="selectedSignal"
      @close="proofDrawerOpen = false"
    />

    <TaskDrawer
      :is-open="taskDrawerOpen"
      :band-id="bandId"
      :signal="selectedSignal"
      :editing-task="editingTask"
      @close="closeTaskDrawer"
    />
  </AgencyLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgencyPortalStore } from '~/stores/agencyPortal'
import { getPlaybookForSignalType, getMomentumState } from '~/utils/agencyPortal/mockData'

useHead({
  title: 'Artist Command - Agency Portal',
  meta: [
    { name: 'robots', content: 'noindex,nofollow' }
  ]
})

const route = useRoute()
const router = useRouter()
const store = useAgencyPortalStore()

const bandId = computed(() => route.params.bandId)
const band = computed(() => store.getBandById(bandId.value))
const signals = computed(() => store.getSignalsForBand(bandId.value))
const topSignals = computed(() => [...signals.value].sort((a, b) => b.score - a.score).slice(0, 3))
const owner = computed(() => store.getOwnerForBand(bandId.value))
const bandTasks = computed(() => store.getTasksForBand(bandId.value))

const momentumState = computed(() => {
  const topSignal = topSignals.value[0]
  return topSignal ? getMomentumState(topSignal.score) : null
})

const suggestedPlaybook = computed(() => {
  const topSignal = topSignals.value[0]
  return topSignal ? getPlaybookForSignalType(topSignal.type) : null
})

const tierClass = computed(() => {
  const classes = {
    A: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    B: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    C: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
  return classes[band.value?.tier] || classes.C
})

const assignDrawerOpen = ref(false)
const proofDrawerOpen = ref(false)
const taskDrawerOpen = ref(false)
const selectedSignal = ref(null)
const editingTask = ref(null)

function signalTextClass(accent) {
  const classes = {
    violet: 'text-violet-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
  }
  return classes[accent] || classes.violet
}

function signalBorderClass(accent) {
  const classes = {
    violet: 'border-violet-500/30',
    blue: 'border-blue-500/30',
    emerald: 'border-emerald-500/30',
    amber: 'border-amber-500/30',
    rose: 'border-rose-500/30'
  }
  return classes[accent] || classes.violet
}

function openProofDrawer(signal) {
  selectedSignal.value = signal
  proofDrawerOpen.value = true
}

function openTaskDrawer(signal) {
  selectedSignal.value = signal
  editingTask.value = null
  taskDrawerOpen.value = true
}

function editTask(task) {
  editingTask.value = task
  selectedSignal.value = null
  taskDrawerOpen.value = true
}

function closeTaskDrawer() {
  taskDrawerOpen.value = false
  editingTask.value = null
  selectedSignal.value = null
}

function handleSignal(signalId) {
  store.handleSignal(signalId)
}

function toggleTask(task) {
  if (task.status === 'done') {
    store.updateTask(task.id, { status: 'open' })
  } else {
    store.completeTask(task.id)
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
