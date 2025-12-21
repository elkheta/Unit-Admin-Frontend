<template>
  <div class="flex-1">
    <span class="text-sm font-medium text-gray-900">{{ name }}</span>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
});
</script>

