
<script  setup>
const route = useRoute()
const type = route.query.type
</script>

<template>
  <div>
    <h1>This is create qr {{ type }}</h1>
    <!-- create params for qr code component type to hide of show the external link url -->
    <ClientOnly>
      <QrCode :type="type"/>
    </ClientOnly>
  </div>
</template>



