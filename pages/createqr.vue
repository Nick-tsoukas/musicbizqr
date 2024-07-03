
<script  setup>
const route = useRoute()
const type = route.query.type
</script>

<template>
  <div>

    <ClientOnly>
      <QrCode :type="type"/>
    </ClientOnly>
  </div>
</template>



