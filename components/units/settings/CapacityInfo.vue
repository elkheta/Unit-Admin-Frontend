<template>
  <div class="flex items-center justify-between text-sm mt-2">
    <span class="text-gray-600">
      Available: <span class="font-semibold text-gray-900">{{ availableCapacity }}</span>
    </span>
    <span class="text-gray-600">
      Total Capacity: <span class="font-semibold text-gray-900">{{ maxCapacity }}</span>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentCapacity: {
    type: Number,
    required: true
  },
  maxCapacity: {
    type: Number,
    required: true
  }
});

const availableCapacity = computed(() => {
  return Math.max(props.maxCapacity - props.currentCapacity, 0);
});
</script>

