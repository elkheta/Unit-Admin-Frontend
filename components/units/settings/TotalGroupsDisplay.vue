<template>
  <div>
    <FormLabel text="TOTAL GROUPS" />
    <div class="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 mt-2">
      <span class="text-lg font-bold text-gray-900">{{ totalGroups }}</span>
      <span class="text-sm text-gray-700 ml-1">groups</span>
    </div>
  </div>
</template>

<script setup>
import { FormLabel } from '../../ui';

defineProps({
  totalGroups: {
    type: Number,
    required: true
  }
});
</script>

