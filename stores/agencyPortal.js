/**
 * Agency Portal Store (Pinia)
 * Manages state for the Agency Portal V1 with localStorage persistence
 * 
 * HOW TO SWAP FOR REAL API:
 * 1. Replace mock data imports with API fetch calls
 * 2. Add async actions that call your endpoints
 * 3. Keep the same state shape for component compatibility
 * See docs/AGENCY_SCHEMA_BLUEPRINT.md for endpoint suggestions.
 */

import { defineStore } from 'pinia'
import {
  mockOrg,
  mockMembers,
  mockRosterBands,
  mockSignals,
  getTriageBucket,
  getMomentumState
} from '~/utils/agencyPortal/mockData'

const STORAGE_KEY = 'mbq_agency_portal'

function loadFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (e) {
    console.warn('Failed to load agency portal state from localStorage:', e)
    return null
  }
}

function saveToStorage(data) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save agency portal state to localStorage:', e)
  }
}

export const useAgencyPortalStore = defineStore('agencyPortal', {
  state: () => {
    const stored = loadFromStorage()
    return {
      // Auth
      passwordUnlocked: stored?.passwordUnlocked || false,
      
      // Org data (from mock)
      org: mockOrg,
      members: mockMembers,
      rosterBands: mockRosterBands,
      
      // Signals indexed by bandId
      signalsByBandId: mockSignals.reduce((acc, signal) => {
        if (!acc[signal.bandId]) acc[signal.bandId] = []
        acc[signal.bandId].push(signal)
        return acc
      }, {}),
      
      // Persisted user actions
      handledSignals: stored?.handledSignals || {},
      assignments: stored?.assignments || {},
      tasks: stored?.tasks || [],
      
      // UI state
      selectedBandId: null,
      searchQuery: '',
      filterType: null,
      filterCity: null
    }
  },

  getters: {
    // Get all signals flat
    allSignals: (state) => {
      return Object.values(state.signalsByBandId).flat()
    },

    // Get signals for a specific band
    getSignalsForBand: (state) => (bandId) => {
      return state.signalsByBandId[bandId] || []
    },

    // Get top signal for a band (highest score)
    getTopSignalForBand: (state) => (bandId) => {
      const signals = state.signalsByBandId[bandId] || []
      if (!signals.length) return null
      return signals.reduce((top, s) => s.score > top.score ? s : top, signals[0])
    },

    // Get band by ID
    getBandById: (state) => (bandId) => {
      return state.rosterBands.find(b => b.bandId === bandId)
    },

    // Get member by ID
    getMemberById: (state) => (memberId) => {
      return state.members.find(m => m.id === memberId)
    },

    // Get owner for a band (from assignments or default)
    getOwnerForBand: (state) => (bandId) => {
      const assignedId = state.assignments[bandId]
      if (assignedId) {
        return state.members.find(m => m.id === assignedId)
      }
      const band = state.rosterBands.find(b => b.bandId === bandId)
      if (band?.ownerId) {
        return state.members.find(m => m.id === band.ownerId)
      }
      return null
    },

    // Check if signal is handled
    isSignalHandled: (state) => (signalId) => {
      return !!state.handledSignals[signalId]
    },

    // Get tasks for a band
    getTasksForBand: (state) => (bandId) => {
      return state.tasks.filter(t => t.bandId === bandId)
    },

    // Get triage buckets with bands
    triageBuckets: (state) => {
      const buckets = {
        needsAction: [],
        heatingUp: [],
        watching: [],
        cooling: []
      }

      state.rosterBands.forEach(band => {
        const signals = state.signalsByBandId[band.bandId] || []
        if (!signals.length) {
          buckets.cooling.push({ band, topSignal: null, bucket: 'cooling' })
          return
        }

        const topSignal = signals.reduce((top, s) => s.score > top.score ? s : top, signals[0])
        const bucket = getTriageBucket(topSignal)
        
        // Skip if handled
        if (state.handledSignals[topSignal.id]) {
          return
        }

        buckets[bucket].push({
          band,
          topSignal,
          signals,
          bucket,
          momentumState: getMomentumState(topSignal.score),
          owner: state.members.find(m => m.id === (state.assignments[band.bandId] || band.ownerId))
        })
      })

      // Sort each bucket by score descending
      Object.keys(buckets).forEach(key => {
        buckets[key].sort((a, b) => (b.topSignal?.score || 0) - (a.topSignal?.score || 0))
      })

      return buckets
    },

    // Get cities with activity
    activeCities: (state) => {
      const cityMap = {}
      
      state.rosterBands.forEach(band => {
        const signals = state.signalsByBandId[band.bandId] || []
        signals.forEach(signal => {
          if (signal.context?.city) {
            const city = signal.context.city
            if (!cityMap[city]) {
              cityMap[city] = {
                name: city,
                artists: [],
                signals: [],
                topScore: 0
              }
            }
            if (!cityMap[city].artists.find(a => a.bandId === band.bandId)) {
              cityMap[city].artists.push(band)
            }
            cityMap[city].signals.push({ ...signal, band })
            if (signal.score > cityMap[city].topScore) {
              cityMap[city].topScore = signal.score
              cityMap[city].topSignal = signal
            }
          }
        })
      })

      // Convert to array and sort by artist count
      return Object.values(cityMap)
        .map(city => ({
          ...city,
          artistCount: city.artists.length,
          isStack: city.artists.filter(a => {
            const topSig = state.signalsByBandId[a.bandId]?.find(s => s.context?.city === city.name)
            return topSig && topSig.score >= 75
          }).length >= 2
        }))
        .sort((a, b) => b.artistCount - a.artistCount)
    },

    // Filtered bands for search
    filteredBands: (state) => {
      if (!state.searchQuery) return state.rosterBands
      const q = state.searchQuery.toLowerCase()
      return state.rosterBands.filter(band => 
        band.name.toLowerCase().includes(q) ||
        band.genre?.toLowerCase().includes(q) ||
        band.homeCity?.toLowerCase().includes(q)
      )
    },

    // Tasks grouped by status
    tasksByStatus: (state) => {
      const now = new Date()
      return {
        open: state.tasks.filter(t => t.status === 'open' && new Date(t.dueAt) >= now),
        overdue: state.tasks.filter(t => t.status === 'open' && new Date(t.dueAt) < now),
        done: state.tasks.filter(t => t.status === 'done')
      }
    }
  },

  actions: {
    // Persist state to localStorage
    persist() {
      saveToStorage({
        passwordUnlocked: this.passwordUnlocked,
        handledSignals: this.handledSignals,
        assignments: this.assignments,
        tasks: this.tasks
      })
    },

    // Unlock portal with password
    unlockPortal(password) {
      if (password === 'password101') {
        this.passwordUnlocked = true
        this.persist()
        return true
      }
      return false
    },

    // Lock portal (logout)
    lockPortal() {
      this.passwordUnlocked = false
      this.persist()
    },

    // Mark signal as handled
    handleSignal(signalId, memberId = 'mem_001') {
      this.handledSignals[signalId] = {
        handledAt: new Date().toISOString(),
        handledBy: memberId
      }
      this.persist()
    },

    // Unhandle signal
    unhandleSignal(signalId) {
      delete this.handledSignals[signalId]
      this.persist()
    },

    // Assign band to member
    assignBand(bandId, memberId) {
      this.assignments[bandId] = memberId
      this.persist()
    },

    // Create task
    createTask(task) {
      const newTask = {
        id: `task_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'open',
        ...task
      }
      this.tasks.push(newTask)
      this.persist()
      return newTask
    },

    // Update task
    updateTask(taskId, updates) {
      const idx = this.tasks.findIndex(t => t.id === taskId)
      if (idx !== -1) {
        this.tasks[idx] = { ...this.tasks[idx], ...updates }
        this.persist()
      }
    },

    // Complete task
    completeTask(taskId) {
      this.updateTask(taskId, { status: 'done', completedAt: new Date().toISOString() })
    },

    // Delete task
    deleteTask(taskId) {
      this.tasks = this.tasks.filter(t => t.id !== taskId)
      this.persist()
    },

    // Set search query
    setSearchQuery(query) {
      this.searchQuery = query
    },

    // Set filters
    setFilters({ type, city }) {
      if (type !== undefined) this.filterType = type
      if (city !== undefined) this.filterCity = city
    },

    // Update band tier
    updateBandTier(bandId, tier) {
      const band = this.rosterBands.find(b => b.bandId === bandId)
      if (band) {
        band.tier = tier
      }
    }
  }
})
