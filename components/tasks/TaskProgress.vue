<template>
  <div class="flex flex-col gap-1 w-24">
    <div class="flex justify-between text-xs text-gray-500 font-medium">
      <span>{{ progressCount }}/{{ progressTotal }}</span>
      <span>{{ progressPercent }}%</span>
    </div>
    <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div class="h-full bg-blue-500 rounded-full" :style="{ width: `${progressPercent}%` }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  progressCount: {
    type: Number,
    required: true
  },
  progressTotal: {
    type: Number,
    required: true
  },
  progressPercent: {
    type: Number,
    required: true
  }
});
</script>

