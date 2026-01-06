<template>
  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
    {{ text }}
  </label>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

