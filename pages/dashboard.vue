<script  setup>
const { find } = useStrapi()
const user = useStrapiUser()

const qrs = ref([])
async function fetchQrCodes() {
  if (user.value) {
    try {
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
=
    <div v-if="qrs.length">
      <MaterialCard v-for="qr in qrs" :key="qr.name" :name="qr.attributes.name" :q_image="qr.attributes.q_image.data.attributes.url" />
    </div>
  </div>
</template>


