<template>
  <div class="flex-1">
    <span class="text-sm font-medium text-gray-900">{{ simplifiedName }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});

const simplifiedName = computed(() => {
  let simplified = props.name;
  
  // Remove "Track Class - " prefix if present
  if (simplified.startsWith('Track Class - ')) {
    simplified = simplified.replace('Track Class - ', '');
  }
  
  // Convert to lowercase and clean up formatting
  // Example: "S3-AR Sc-Year-Single-Content-BIOLOGY" -> "s3- ar - single - biology"
  simplified = simplified
    .toLowerCase()
    .replace(/sc-year-single-content-/gi, 'single - ')
    .replace(/sc-year-bundle-content-/gi, 'bundle - ')
    .replace(/-/g, '- ');
  
  return simplified;
});
</script>

