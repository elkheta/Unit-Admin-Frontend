<template>
  <div class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <span class="text-sm font-medium text-gray-700">{{ group.name }}</span>
    <span class="text-sm text-gray-500">{{ group.current }} students</span>
  </div>
</template>

<script setup>
defineProps({
  group: {
    type: Object,
    required: true
  }
});
</script>
