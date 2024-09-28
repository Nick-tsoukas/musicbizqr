
<script  setup>
const route = useRoute()
const type = route.query.type
</script>

<template >


    <ClientOnly >
      <QrCode />
    </ClientOnly>

</template>



