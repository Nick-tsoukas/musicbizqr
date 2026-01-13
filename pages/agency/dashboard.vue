<template>
  <AgencyLayout>
    <div class="max-w-6xl mx-auto">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p class="text-gray-400">Roster performance overview and territorial insights</p>
      </div>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Roster Momentum Trend -->
        <AgencyDashboardRosterMomentumTrendCard />

        <!-- Platform Pull Mix -->
        <AgencyDashboardPlatformPullMixCard />

        <!-- Heat Map -->
        <AgencyDashboardHeatMapCard />

        <!-- City Stacks -->
        <AgencyDashboardCityStackCard @open-city="openCityDetail" />

        <!-- After-Show Lift -->
        <AgencyDashboardAfterShowLiftCard />

        <!-- Top Movers -->
        <AgencyDashboardTopMoversCard 
          @open-artist="openArtist" 
          @view-all="navigateTo('/agency/admin')"
        />
      </div>
    </div>

    <!-- City Detail Drawer -->
    <AgencyCityDetailDrawer
      :is-open="cityDetailOpen"
      :city="selectedCity"
      @close="cityDetailOpen = false"
      @open-artist="openArtist"
    />
  </AgencyLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'agency'
})

useHead({
  title: 'Dashboard - Agency Portal',
  meta: [
    { name: 'robots', content: 'noindex,nofollow' }
  ]
})

const router = useRouter()

const cityDetailOpen = ref(false)
const selectedCity = ref(null)

function openCityDetail(city) {
  selectedCity.value = city
  cityDetailOpen.value = true
}

function openArtist(bandId) {
  cityDetailOpen.value = false
  router.push(`/agency/artists/${bandId}`)
}
</script>
