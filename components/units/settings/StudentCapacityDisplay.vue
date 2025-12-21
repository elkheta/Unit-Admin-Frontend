<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
        STUDENTS CAPACITY
      </label>
      <span class="text-lg font-bold text-gray-900">{{ currentCapacity }} / {{ maxCapacity }}</span>
    </div>
    <CapacityProgressBar
      :current-capacity="currentCapacity"
      :max-capacity="maxCapacity"
    />
    <CapacityInfo
      :current-capacity="currentCapacity"
      :max-capacity="maxCapacity"
    />
  </div>
</template>

<script setup>
import { FormLabel } from '../../ui';
import { CapacityProgressBar, CapacityInfo } from './index.js';

defineProps({
  currentCapacity: {
    type: Number,
    required: true
  },
  maxCapacity: {
    type: Number,
    required: true
  }
});
</script>

