
<script  setup>
const route = useRoute()
const type = route.query.type
</script>

<template>
  <div>
    <h1>This is create qr</h1>
    <!-- create params for qr code component type to hide of show the external link url -->
    <ClientOnly>
      <h1>{{ type }}</h1>
      <QrCode :type="type"/>
    </ClientOnly>
  </div>
</template>



