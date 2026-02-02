<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">QR Repair Tool</h1>
      <p class="text-gray-400 mb-8">
        This tool will regenerate all your QR images to ensure they encode valid scannable URLs.
      </p>

      <div v-if="!user" class="bg-red-900/50 p-4 rounded-lg">
        Please log in to use this tool.
      </div>

      <div v-else>
        <div class="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 class="text-xl font-semibold mb-4">Your QRs</h2>
          <p class="text-gray-400 mb-4">Found {{ qrs.length }} QR codes</p>
          
          <button 
            @click="repairAll" 
            :disabled="repairing"
            class="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {{ repairing ? `Repairing ${repairProgress}/${qrs.length}...` : 'Repair All QRs' }}
          </button>
        </div>

        <div v-if="repairLog.length" class="bg-gray-800 p-6 rounded-lg">
          <h2 class="text-xl font-semibold mb-4">Repair Log</h2>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div 
              v-for="(log, i) in repairLog" 
              :key="i"
              :class="log.success ? 'text-green-400' : 'text-red-400'"
            >
              {{ log.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStrapiUser, useStrapiClient } from '#imports'

const user = useStrapiUser()
const client = useStrapiClient()

const qrs = ref([])
const repairing = ref(false)
const repairProgress = ref(0)
const repairLog = ref([])

onMounted(async () => {
  if (!user.value) return
  
  try {
    const res = await client('/qrs', {
      method: 'GET',
      params: {
        'filters[users_permissions_user][id][$eq]': user.value.id,
        'populate': '*',
        'pagination[pageSize]': 100
      }
    })
    qrs.value = res.data || []
  } catch (e) {
    console.error('Failed to load QRs:', e)
  }
})

async function repairAll() {
  repairing.value = true
  repairProgress.value = 0
  repairLog.value = []

  for (const qr of qrs.value) {
    try {
      const id = qr.id
      const attrs = qr.attributes || qr
      
      // Determine the correct URL
      const slugId = attrs.slugId || id
      const correctUrl = `https://musicbizqr.com/directqr?id=${slugId}`
      
      // Update the QR with correct URL and options.data
      await client(`/qrs/${id}`, {
        method: 'PUT',
        body: {
          data: {
            url: correctUrl,
            slugId: slugId,
            options: {
              ...attrs.options,
              data: correctUrl
            }
          }
        }
      })

      repairLog.value.push({
        success: true,
        message: `✓ QR ${id} (${attrs.name || 'unnamed'}): Updated to ${correctUrl}`
      })
    } catch (e) {
      repairLog.value.push({
        success: false,
        message: `✗ QR ${qr.id}: ${e.message || 'Failed'}`
      })
    }
    
    repairProgress.value++
  }

  repairing.value = false
  repairLog.value.push({
    success: true,
    message: `\n✓ Done! Now go to Edit on each QR and click Save to regenerate the image.`
  })
}
</script>
