<template>
  <div>
    <FormLabel text="UNIT ID" />
    <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm">
      {{ unitId }}
    </div>
  </div>
</template>

<script setup>
import { FormLabel } from '../../../ui';

defineProps({
  unitId: {
    type: [String, Number],
    required: true
  }
});
</script>

