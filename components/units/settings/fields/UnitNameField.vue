<template>
  <div>
    <FormLabel text="UNIT NAME" />
    <BaseInput 
      :model-value="unitName" 
      placeholder="Unit Name" 
      input-class="bg-gray-50" 
      :disabled="true" 
    />
  </div>
</template>

<script setup>
import { BaseInput, FormLabel } from '../../../ui';

defineProps({
  unitName: {
    type: String,
    required: true
  }
});
</script>

