
<script  setup>
const route = useRoute()
const type = route.query.type
</script>

<template>
  <div class="mx-auto max-w-5xl" >

    <ClientOnly>
      <QrCode />
    </ClientOnly>
  </div>
</template>



