<template>
  <div>
    <h1>this is qr type page </h1>
    <p>list out the types of qr code functionality the user can do</p>
    <ul>
      <nuxt-link :to="{ name: 'createqr', query: { type: 'externalurl' } }">External Url</nuxt-link>
      <nuxt-link :to="{ name: 'createqr', query: { type: 'bnadprofile' } }">Band Profile </nuxt-link>
      <nuxt-link :to="{ name: 'createqr', query: { type: 'eventslist' } }">Events</nuxt-link>
      <nuxt-link :to="{ name: 'createqr', query: { type: 'audioplayer' } }">Audio Player</nuxt-link>
      <nuxt-link :to="{ name: 'createqr', query: { type: 'sociallinks' } }">All Social links</nuxt-link>
      <nuxt-link :to="{ name: 'createqr', query: { type: 'tip me jar' } }">Tip me jar</nuxt-link>
    </ul>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>