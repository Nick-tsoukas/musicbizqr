<script  setup>
const { find } = useStrapi()
const user = useStrapiUser()

const qrs = ref([])
const band = ref(null)
async function fetchQrCodes() {
  if (user.value) {
    try {
      const band = await find('bands')
      band.value = band.data
      const response = await find('qrs', {
        filters: {
          users_permissions_user: {
            id: {
              $eq: user.value.id
            }
          }
        },
        populate: '*'
      })
      qrs.value = response.data
    } catch (error) {
      console.error('Error fetching QR codes:', error)
    }
  }
}

fetchQrCodes()
</script>

<template>
  <div>
    <pre>{{ band }}</pre>
    <div v-if="qrs.length">
      <MaterialCard v-for="qr in qrs" :qr="qr"  :qrId="qr.id"  :link="qr.attributes.link" :url="qr.attributes.url" :key="qr.name" :scan="scanTime"  :name="qr.attributes.name" :q_type="qr.attributes.q_type" :q_image="qr.attributes.q_image.data.attributes.url" />
    </div>
  </div>
</template>


