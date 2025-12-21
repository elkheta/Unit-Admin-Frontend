<template>
  <div class="flex justify-between items-center mb-2">
    <span class="text-xs font-semibold text-gray-700">Groups</span>
    <span class="text-[10px] text-gray-400">
      {{ count }} groups
    </span>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    required: true
  }
});
</script>

