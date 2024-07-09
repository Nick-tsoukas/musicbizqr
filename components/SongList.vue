<template>
  <div class="list-container">
    <div class="h-24 bg-black w-full">

    </div>
    <ul class="list">
      <li v-for="item in items" :key="item.id" class="list-item">
        <span class="material-icons list-item__icon">{{ item.icon }}</span>
        <span class="list-item__text">{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>

const items = ref([
  { id: 1, icon: 'inbox', text: 'Inbox' },
  { id: 2, icon: 'send', text: 'Sent Mail' },
  { id: 3, icon: 'drafts', text: 'Drafts' }
]);
</script>

<style scoped>
.list-container {
  @apply w-full max-w-md mx-auto my-4 bg-white shadow-md rounded-lg;
}

.list {
  @apply divide-y divide-gray-200;
}

.list-item {
  @apply flex items-center p-4 hover:bg-gray-100 cursor-pointer;
}

.list-item__icon {
  @apply text-gray-500 mr-4;
}

.list-item__text {
  @apply text-gray-900;
}
</style>
