<template>
  <span 
    class="px-2.5 py-1 rounded-full text-xs font-medium"
    :class="performanceClasses"
  >
    {{ performance }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  performance: {
    type: String,
    required: true,
    validator: (value) => ['Good', 'Excellent', 'At Risk'].includes(value)
  }
});

const performanceClasses = computed(() => {
  const classes = {
    'Good': 'bg-blue-100 text-blue-700',
    'Excellent': 'bg-green-100 text-green-700',
    'At Risk': 'bg-red-100 text-red-700'
  };
  return classes[props.performance] || 'bg-gray-100 text-gray-700';
});
</script>

