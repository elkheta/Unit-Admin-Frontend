<template>
  <BaseButton 
    variant="primary" 
    size="md" 
    class="shadow-md shadow-blue-100 whitespace-nowrap flex-shrink-0"
    @click="$emit('unit-click', unit)"
  >
    Students List
  </BaseButton>
</template>

<script setup>
import { BaseButton } from '../ui';

defineProps({
  unit: {
    type: Object,
    required: true
  }
});

defineEmits(['unit-click']);
</script>

