<template>
  <div>
    <FormLabel text="UNIT ID" />
    <BaseInput 
      :model-value="String(unitId)" 
      placeholder="Unit ID" 
      input-class="bg-gray-50" 
      :disabled="true" 
    />
  </div>
</template>

<script setup>
import { BaseInput, FormLabel } from '../../../ui';

defineProps({
  unitId: {
    type: [String, Number],
    required: true
  }
});
</script>

