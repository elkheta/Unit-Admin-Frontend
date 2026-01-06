<template>
  <span 
    class="px-2.5 py-1 rounded-full text-xs font-medium"
    :class="statusClasses"
  >
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['Active', 'Inactive'].includes(value)
  }
});

const statusClasses = computed(() => {
  return props.status === 'Active' 
    ? 'bg-green-100 text-green-700' 
    : 'bg-red-100 text-red-700';
});
</script>

