
<script  setup>
const route = useRoute()
const type = route.query.type
</script>

<template>


    <ClientOnly v-eles>
      <QrCode />
    </ClientOnly>

</template>



