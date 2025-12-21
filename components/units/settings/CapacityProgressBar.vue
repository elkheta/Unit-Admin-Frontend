<template>
  <div class="mb-2">
    <div class="w-full bg-gray-200 rounded-full h-3">
      <div 
        class="bg-blue-600 h-3 rounded-full transition-all duration-300"
        :style="{ width: `${capacityPercentage}%` }"
      ></div>
    </div>
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

const capacityPercentage = computed(() => {
  if (!props.maxCapacity || props.maxCapacity === 0) return 0;
  return Math.min((props.currentCapacity / props.maxCapacity) * 100, 100);
});
</script>

