<template>
  <div class="flex justify-end mb-6">
    <BaseButton 
      v-if="expiredCount > 0" 
      variant="warning" 
      size="sm" 
      class="text-xs"
      @click="$emit('expired-click', unit)"
    >
      {{ expiredCount }} Expired
    </BaseButton>
    <BaseButton 
      v-else 
      disabled 
      variant="secondary" 
      size="sm" 
      class="text-xs"
    >
      0 Expired
    </BaseButton>
  </div>
</template>

<script setup>
import { BaseButton } from '../ui';

defineProps({
  unit: {
    type: Object,
    required: true
  },
  expiredCount: {
    type: Number,
    default: 0
  }
});

defineEmits(['expired-click']);
</script>

