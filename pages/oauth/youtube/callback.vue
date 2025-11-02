<script setup>
const route = useRoute()

const code = route.query.code
const state = route.query.state

const status = ref('connecting')
const result = ref(null)
const error = ref(null)

onMounted(async () => {
  if (!code || !state) {
    status.value = 'error'
    error.value = 'Missing code or state from Google'
    return
  }

  try {
    // adjust base URL if your Strapi is not localhost:1337
    const res = await $fetch('http://localhost:1337/api/youtube/oauth/callback', {
      method: 'POST',
      body: { code, state },
    })

    result.value = res

    if (res?.needsChannelSelection) {
      status.value = 'needs-channel'
    } else if (res?.ok) {
      status.value = 'done'
    } else {
      status.value = 'error'
      error.value = res
    }
  } catch (err) {
    status.value = 'error'
    error.value = err?.data || err?.message || err
  }
})

async function selectChannel(channelId) {
  const match = String(state || '').match(/band:(\d+)/)
  const bandId = match ? Number(match[1]) : null

  if (!bandId) {
    alert('Missing bandId in state')
    return
  }

  try {
    const res = await $fetch('http://localhost:1337/api/youtube/select-channel', {
      method: 'POST',
      body: { bandId, channelId },
    })
    console.log('Selected channel', res)
    status.value = 'done'
    result.value = res
  } catch (err) {
    console.error(err)
    alert('Error selecting channel')
  }
}
</script>

<template>
  <div class="min-h-screen bg-black text-white flex items-center justify-center p-6">
    <div class="max-w-md w-full space-y-4">
      <h1 class="text-xl font-semibold">Connecting YouTube…</h1>

      <p v-if="status === 'connecting'">
        Talking to MusicBizQR backend…
      </p>

      <div v-else-if="status === 'done'">
        <p class="mb-2">✅ YouTube connected.</p>
        <p class="text-sm text-gray-300">
          You can close this window and go back to the analytics dashboard.
        </p>
        <pre class="bg-zinc-900 p-3 rounded text-xs overflow-auto">{{ result }}</pre>
      </div>

      <div v-else-if="status === 'needs-channel'">
        <p class="mb-2">This Google account has more than one YouTube channel.</p>
        <p class="text-sm text-gray-300 mb-2">
          Pick which one should be linked to this band.
        </p>

        <div v-if="result?.channels?.length" class="space-y-2">
          <button
            v-for="ch in result.channels"
            :key="ch.id"
            class="w-full bg-white/10 hover:bg-white/20 rounded px-3 py-2 text-left"
            @click="selectChannel(ch.id)"
          >
            <div class="font-medium">{{ ch.title || ch.id }}</div>
            <div class="text-xs text-gray-400">{{ ch.id }}</div>
          </button>
        </div>
      </div>

      <div v-else-if="status === 'error'">
        <p class="text-red-400 mb-2">Something went wrong.</p>
        <pre class="bg-zinc-900 p-3 rounded text-xs overflow-auto">{{ error }}</pre>
      </div>
    </div>
  </div>
</template>
