<template>
  <div class="bg-black">
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    </Head>
    <Header />
    <slot />
  </div>
</template>

<script setup>
import { useHead } from '#imports'
provideHeadlessUseId(() => useId())

useHead({
  titleTemplate: (titleChunk) =>
    titleChunk ? `${titleChunk} | musicbizqr` : 'musicbizqr',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content:
        'musicbizqr for musicians: generate a dynamic QR code link tree that builds your artist profile, tracks clicks, and lets you update destinations anytime—with full analytics.'
    }
  ]
})
</script>
