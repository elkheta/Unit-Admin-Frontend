<template>
  <div>
    <FormLabel text="UNIT NAME" />
    <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm">
      {{ unitName }}
    </div>
  </div>
</template>

<script setup>
import { FormLabel } from '../../../ui';

defineProps({
  unitName: {
    type: String,
    required: true
  }
});
</script>

