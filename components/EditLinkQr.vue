<template>
  <div>
     <p>edit link qr {{ props.q_type }} </p>
  </div>
</template>

<script  setup>
const props = defineProps({
  name: {
    type: String,
    default: 'Default Title'
  },
  qr: {
    type: Object
  },
  url: {
    type: String,
    default: ''
  },
  q_image: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  q_type: {
  type: String
  },
  link: {
    type: String,
    default: null
  },
  qrId : {
    type: Number
  }
})

</script>

<style>

</style>