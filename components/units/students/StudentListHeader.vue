<template>
  <div class="mb-6">
    <h2 class="text-3xl font-bold text-gray-900 mb-2">Student List</h2>
    <p class="text-base text-gray-700 font-normal">Manage students for {{ unitName }}</p>
  </div>
</template>

<script setup>
defineProps({
  unitName: {
    type: String,
    required: true
  }
});
</script>

